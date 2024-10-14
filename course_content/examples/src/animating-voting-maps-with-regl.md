```js
md`# Animating voting maps with regl

A lot of code to draw a relatively simple map using regl on the GPU; 2016 New York City election results oscillating with 2020 ones at the precinct level. (I made the geojson here in R using some areal interpolation to align 2016 and 2020 precincts; in Jamaica Bay, it seems this might have been imperfect.) There are about 5,000 small polygons at fairly high resolution. 

Election districts are scaled by the number of votes; change the radio to see a more conventional map.

The next notebook here will show how to make this into a fast-animating dot-density map of votes.

Zoom in to see individual areas. The biggest shifts towards Trump were in the Orthodox Jewish neighborhoods of Brooklyn, while the Hispanic parts of the Bronx and Northern Manhattan become less overwhelmingly blue.

`
```

```js
viewof areal = radio({title: "scale by", options: ["area", "votes"], value: "votes"})
```

```js
md`# ${2016 + Math.round(balance)*4}`
```

```js
div = DOM.canvas(width, width)
```

```js
import { radio } from '@jashkenas/inputs'
```

```js
flip = d3.geoTransform({
  point: function(x, y) {
    this.stream.point(x, -y);
  }
});

```

```js
election_districts = new TriFeather(await FileAttachment("ne_50m_admin_0_countries_lakes.gleofeather").arrayBuffer())//TriFeather.from_feature_collection(await FileAttachment("nyc.geojson").json(), flip)
```

```js
//raw = 
```

```js
import { TriFeather, TriRow, download_button } from '@bmschmidt/pre-triangulated-feather'
```

```js
import { window_transform } from '@bmschmidt/sharing-a-single-zoom-state-between-svg-canvas-and-webgl'
```

```js
balance = (Math.sin(now/500) + 1)/2
```

```js echo
map.color_func = function(f) {
  const balance = (Math.sin(Date.now()/500) + 1)/2
  const r1 = 1 - f.properties["2016_Trump"]/f.properties["2016_tot"]
  const r2 = 1 - f.properties["2020_Trump"]/f.properties["2020_tot"]
  if (f.properties["2020_tot"] === 0) {return [1, 1, 1]}
  const {r, g, b} = d3.rgb(colorscale(r1*(1-balance) + r2*balance))
  return [r/255, g/255, b/255]
}
```

```js echo
size_scale = {
  map // need map for the features to exist.
  return d3.scaleSqrt().domain(d3.extent(election_districts.features.map(feature => feature.properties['2020_tot'] / feature.properties.pixel_area))).range([0, 3]).clamp(true)
}
```

```js echo
map.size_func = areal == "area" ? () => 1 : (feature) => {
  const balance = (Math.sin(Date.now()/500) + 1)/2
 
  return size_scale((feature.properties['2020_tot'] * balance + feature.properties['2016_tot'] * (1-balance)) / feature.properties.pixel_area)
  
}
```

```js echo
colorscale = d3.scaleSequential(d3.interpolateRdBu).domain([0.05, .95])
```

```js echo
map = new TriMap(div, [election_districts])
```

```js echo
md`# TriMap

A handler class to deal with interactions between regl contexts and feather feature sets. I'll use this more later.`
```

```js echo
class TriMap {

  constructor(div, layers) {
  
    this.div = div
    this.regl = wrapRegl({canvas: div, extensions: ["OES_element_index_uint"]})
    for (let layer of layers) {
      layer.bind_to_regl(this.regl) 
    }
    this.layers = layers;

    const {width, height} = div
    this.magic_numbers = window_transform(
      d3.scaleLinear().domain(layers[0].bbox.x).range([0, width]),
      d3.scaleLinear().domain(layers[0].bbox.y).range([0, height]), width, height)
      .map(d => d.flat())
    this.prepare_div(width, height)
    this.set_renderer()
    this.regl.frame(() => this.tick())
  }
  
  prepare_div(width, height) {
    this.zoom = {transform: {k: 1, x: 0, y:0}}
    d3.select(this.div).call(d3.zoom().extent([[0, 0], [width, height]]).on("zoom", (event, g) => {
      this.zoom.transform = event.transform
    }));

    return div;
  }

  get size_func() {
    return this._size_function ? this._size_function : () => 1
  }
  set size_func(f) {
    this._size_function = f
  }
  
  set color_func(f) {
    this._color_function = f
  }
  
  get color_func() {
    return this._color_function ? this._color_function : () => [.8, .8, .8]
    
  }
  
  tick() {
    const { regl } = this
    regl.clear({
      color: [0, 0, 0, .01],
    })
    const alpha = 1
    const calls = []
    for (let feature of this.layers[0]) {
      if (feature.properties['2020_tot'] === null) {continue}
      const {vertices, coords} = feature;
        calls.push({
          transform: this.zoom.transform,
          color: this.color_func(feature),
          centroid: [feature.properties.centroid_x, feature.properties.centroid_y],
          size: this.size_func(feature),
          alpha: 1,
          vertices: vertices,
          coords: coords
        })
    }
    this.render_polygons(calls)
  }

  set_renderer() {
    this.render_polygons = this.regl(this.polygon_renderer())
  }

  polygon_renderer() {
    const { regl, magic_numbers } = this;
    return {      
      depth: {
        enable: false
      },

      blend: {enable: true,      func: {
        srcRGB: 'one',
        srcAlpha: 'one',
        dstRGB: 'one minus src alpha',
        dstAlpha: 'one minus src alpha',
      }
             },
      vert: `
precision mediump float;
attribute vec2 position;
uniform float u_size;
uniform vec2 u_centroid;
varying vec4 fragColor;
uniform float u_k;
uniform float u_time;
uniform vec3 u_color;
varying vec4 fill;

// Transform from data space to the open window.
uniform mat3 u_window_scale;
// Transform from the open window to the d3-zoom.
uniform mat3 u_zoom;
uniform mat3 u_untransform;


// We can bundle the three matrices together here for all shaders.
mat3 from_coord_to_gl = u_window_scale * u_zoom * u_untransform;


float u_scale_factor = 0.5;

void main () {

// scale to normalized device coordinates
// gl_Position is a special variable that holds the position
// of a vertex
vec2 from_center = position-u_centroid;


vec3 p = vec3(from_center * u_size + u_centroid, 1.) * from_coord_to_gl;
gl_Position = vec4(p, 1.0);

gl_PointSize = u_size * (exp(log(u_k)*u_scale_factor)); 

fragColor = vec4(u_color.rgb, 1.);
//gl_Position = vec4(position / vec2(1., u_aspect), 1., 1.);
}
`,
      frag: `
precision highp float;
uniform float u_alpha;
varying vec4 fragColor;

void main() {
gl_FragColor = fragColor * u_alpha;
}`,
      attributes: {
        position: (_, {coords}) => coords,
      },
      elements: (_, {vertices}) => vertices,
      uniforms: {
        u_time: (context, _) => performance.now()/500,
        u_k: function(context, props) {        
          return props.transform.k
        },
        u_centroid: regl.prop('centroid'),
        u_color: (_, {color}) => color ? color : [.8, .9, .2],
        u_window_scale: magic_numbers[0].flat(),
        u_untransform: magic_numbers[1].flat(),
        u_zoom: function(context, props) {
          const g = [
            // This is how you build a transform matrix from d3 zoom.
            [props.transform.k, 0, props.transform.x],
            [0, props.transform.k, props.transform.y],
            [0, 0, 1],
          ].flat()
          return g
        },
        u_alpha: regl.prop('alpha'),
        u_size: (_, {size}) => size || 1,

      },
      primitive: "triangles"
    }
  }


}
```

```js echo
wrapRegl = require("regl")
```

```js echo
d3 = require("d3@v6")
```
