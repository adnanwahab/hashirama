```js
md`# Regl and Earcut for hi-resolution maps

[Earcut](https://github.com/mapbox/earcut) is a library for triangulating polygons to make maps easily fit into the browser; regl is a webgl wrapper. Together, they can draw complicated polygons much faster than canvas or SVG. Earcut was made to work with mapboxgl, and should be fine there; the chief advantage of doing it with regl and d3's projection libraries is that you can use fancy projections.

This notebook shows one way to get them to play together, mapping unemployment in all the counties in the United States (about 837,000 vertices), using the highest resolution the census bureau offers (1:500,000). Projection happens on the client once. Each draw seems to take about 15ms (66fps) on my seven-year-old laptop, regardless of how detailed the polygons are. This is a big difference from d3 with canvas, where it's very important to simplify the data. Here, the bottleneck is not polygon rendering, so you can get extremely high detail. I've only put zoom to the center point, but you can see there how fine the resolution is).

Data is COVID "Incidence Rate" from Hopkins, whatever that means.

This could probably be faster--if at the expense of taking more GPU memory--if all the triangles were drawn in a single pass, not 3000 separate ones. At 3,000 points, this is fine; but at 10,000 or more, it might matter. One thing that **is** critically important is that the mesh data here is all parked in GPU memory, not sent every frame.

`
```

```js echo
myCanvas = DOM.canvas(975, 610)
```

```js
viewof resolution = radio({title: "resolution", options: ["1:500,000", "1:5,000,000", "1:20,000,000"], value: "1:500,000"})
```

```js echo
viewof zoom = slider({title: "zoom (square root)", min: .5, max: 15, value: 1, step: .1})
```

```js
viewof jitter_radius = slider({'title': "jitter radius", 'min': 0, 'max': 25, value: 1, step: .1, "description": "Jitter is just to make any lag visible"})
```

```js echo
render_loop = {
  const times = []
  while (true) {
    
    const overall_radius = jitter_radius / 100 * (Math.sin(Date.now()/1000) + 1)/2
    const start = performance.now()
    
    gl.clear({color: [0.1, 0.1, .1, 0.5]});
    
    for (let feature of using.features.filter(d => d.projected)) {
      //Dumb
      const rand = feature.rand ? feature.rand : feature.rand = [Math.random() - .5, Math.random() - .5]
      const flip = rand[0] + rand[1] > 0 ? 1 : -1 // Pointless
      // Gotta have a color
      const { STATE, COUNTY } = feature.properties
      const val = fips_data.get(STATE+COUNTY)*10
      
      let color = d3.rgb(d3.interpolateMagma(val/100000))
      render({
        color: [color.r/255, color.g/255, color.b/255],
        zoom,
        position: feature.coord_buffer,
        elements: feature.vertex_buffer,
        jitter: [overall_radius * Math.sin(Date.now()/(600+rand[1]*10) + rand[0]) * flip, overall_radius * Math.cos(Date.now()/(600+rand[1]*10) + rand[1])]// Stupid.

      })
    }
    // Logging.
    times.push(performance.now() - start)
    const average = d3.mean(times.slice(times.length > 200 ? times.length - 200 : 0))
    yield md`Average render time of ${d3.format(".2f")(average)} milliseconds for ${n_points} points`
  }
}
```

```js echo
n_points = using.features.map(d => d.geometry.coordinates).flat(12).length/2
```

```js echo
class BufferHandler {
  // simple data structure to post blocks of data to regl buffers.
  
  // Rather than allocate a new buffer for each polygon, which is kind of wasteful, 
  // just set them up in 2 MB blocks and keep using until the next call will overflow.
  
  // Something is wrong with the regl scoping here, so it breaks if you have more than one buffer.
  // Currently, I just make sure that the buffer is crazy big--would be worth fixing, though.
  
 constructor(regl, size = 2**26) {
   this.regl = regl;
   this.size = size;
   this.buffers = {"1": regl.buffer({length: this.size, type: "float", usage: "static"})}
   this.current_buffer = "1"
   this.current_position = 0;
 }
  
 post_data(data, stride = 8) {
    if (data.length*4 + this.current_position > this.size) {
      this.current_buffer = (1+parseInt(this.current_buffer)) + ""
      this.buffers[this.current_buffer] = this.regl.buffer(this.size);
      this.current_position = 0;
    }
   const buffer = this.buffers[this.current_buffer]
   buffer.subdata(data, this.current_position)
   const description = {
     key: this.current_buffer,
     buffer: buffer,
     stride: stride ? stride : 8,
     offset: this.current_position
   }
   this.current_position += data.length * 4;
   return description;
 }
  
}
```

```js echo
using = resolution == "1:500,000" ? k500_counties : resolution == "1:5,000,000" ? m5_features : m20_features
```

```js
gl = regl({canvas:myCanvas});
```

```js echo
polygon_to_triangles = function(polygon) {
  // Actually perform the earcut work
  const el_pos = []
  const coords = polygon.flat(2)
  const vertices = earcut(...Object.values(earcut.flatten(polygon)))
  return { coords, vertices }
}
```

```js echo
fips_data = {
  const map = new Map()
  const d = await d3.csv("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/11-10-2020.csv")
  d.forEach(d => map.set(d.FIPS.padStart(5, "0"), +d.Incident_Rate))
  return map
}
```

```js echo
add_triangles_to_feature = function(feature, projection, buffers) {
    if (feature.projected) {
      return 
    }
    let projected = d3.geoProject(feature.geometry, projection)
    feature.projected = projected;
    let coordinates;
    if (!projected) {
      //console.log(feature.geometry)
      return
    }
    if (projected.type == "Polygon") {
      coordinates = [projected.coordinates]
    } else if (projected.type == "MultiPolygon") {
      coordinates = projected.coordinates
    } else {throw "All elements must be polygons or multipolgyons."}
    let all_coords = []
    let all_vertices = []
    for (let polygon of coordinates) {
      const current_vertex = all_coords.length/2
      const { coords, vertices } = polygon_to_triangles(polygon);
      all_coords.push(...coords)
      // If need to shift because we may be storing multiple triangle sets on a feature.
      all_vertices.push(...vertices.map(d => d + current_vertex))
    }
    const coords = buffers.post_data(all_coords.flat(10), 8)
    feature.coord_buffer = coords
    feature.vertex_buffer = buffers.regl.elements({
      primitive: "triangles",
      count: all_vertices.length,
      data: all_vertices.flat(10),
      // Use the smallest possible int type.
      type: all_coords.length < 2**8 ? 'uint8' : all_coords.length < 2**16 ? 'uint16' : 'uint32'
    })
    feature.vertex_buffer.data = all_vertices.flat(10)
}
```

```js echo
projection = d3.geoAlbersUsa().scale(2).translate([-0.2, 0])
```

```js echo
buffer_handler = new BufferHandler(gl, 2**26) // I would prefer multiple at 2**20 to one giant one like this.
```

```js echo
import { radio, slider } from '@jashkenas/inputs'
```

```js echo
render =  gl(renderer);
```

```js echo
colorscheme = d3.scaleLinear().domain([0, 100]).range(d3.schemeBuGn)
```

```js echo
m5_features = {
  return FileAttachment("gz_2010_us_050_00_5m.json").text().then(d => {
    const geojson = JSON.parse(d)
    for (let feature of geojson.features) {
      add_triangles_to_feature(feature, projection, buffer_handler) 
    }
    return geojson
  })
}
```

```js echo
m20_features = {
  return FileAttachment("gz_2010_us_050_00_20m.json").text().then(d => {
    const geojson = JSON.parse(d)
    for (let feature of geojson.features) {
      add_triangles_to_feature(feature, projection, buffer_handler) 
    }
    return geojson
  })
}
```

```js echo
renderer = (
  //Starting point: https://observablehq.com/@marcom13/mesh-rendering-using-webgl-regl
  {       
    vert: `
precision mediump float;
attribute vec2 position;
uniform float aspect;
uniform float u_zoom;
uniform vec3 color;
uniform vec2 jitter;
varying vec3 fragColor;

void main () {
gl_PointSize = 2.;      
fragColor = color;
gl_Position = vec4(position.x * u_zoom + jitter.x, -position.y * u_zoom * aspect + jitter.y * aspect, 0., 1.); 
}
`,
    frag: `
precision mediump float;
varying vec3 fragColor;
void main () {
gl_FragColor = vec4(fragColor, 1.);
}
`,
    attributes: {
      position: (state, props) => props.position
    },
    elements: function (state, props) {return props.elements},
    uniforms: {
      u_zoom: (_, {zoom}) => zoom * zoom,
      aspect: 975/610,
      jitter: (state, props) => props.jitter,
      color: (state, props) => props.color
    },
    primitive: "triangle",
  }

)
```

```js echo
topojson = require("topojson-client@3")
```

```js echo
k500_counties = {
  const f = topojson.feature(hirestopo, hirestopo.objects.gz_2010_us_050_00_500k)
  for (let feature of f.features) {
     add_triangles_to_feature(feature, projection, buffer_handler) 
  }
  return f
}
```

```js echo
hirestopo = FileAttachment("oput.topojson").text().then(d => JSON.parse(d))
```

```js echo
earcut = require("earcut")
```

```js echo
regl = require("regl") // Use the latest Version
```

```js echo
d3 = require("d3@v6", "d3-geo-projection")
```
