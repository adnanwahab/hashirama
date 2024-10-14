```js
md`# Zoom strategies for huge scatterplots with three.js

What I call 'deep' scatterplots are plots with thousands or millions points, each with significant metadata that require zooming or other similar interactions to fully explore. I previously used canvas to visualize [15 million books in the Hathi Trust digital library](http://creatingdata.us/techne/deep_scatterplots/), and wrote up there some of my general strategies especially around tiling and labeling. 

This notebook is about an issue I didn't explicitly address there, but that becomes more pressing with deep scatterplots; the tradeoff between semantic or geometric zoom. I'll explore it initially with some data that comes from a [UMAP embedding of a word2vec model](https://benschmidt.org/profCloud) with 138,839 points, colorized by sentiment. This is a nice in-between size: it's more than canvas can hold, but about 1% the size of the data I want to work with ultimately. One issue with canvas is that most browsers stutter when rendering more than 10,000 points. I've found @grantcuster's notebooks about three.js and webgl especially useful here, and have borrowed much of his code.

## Balancing semantic and geometric zooms

Some of Mike Bostock's old visualizations have d3 users comfortable with the notion that scatter plots can use ["semantic zoom"](https://bl.ocks.org/mbostock/3680957), where points stay the same size when you zoom in, and ["geometric zoom"](https://bl.ocks.org/mbostock/3680999), where points grow as you zoom in. For scatterplots with tens of thousands of points, both of these methods have shortcomings. You can see these shortcomings by switching the zoom strategy below. At high zoom levels, geometric zoom usually leaves you with heavy overplotting of points at high zoom levels; while semantic zoom strategies are usually overcrowded at the overview level if the point size is large enough to support any interactions.

Below this chart you can turn on either of those to see how they work. But by default, I do something I call 'balanced zoom' that's generally better for deep scatters, but that seems to not always be obvious.
`
```

```js
function jump(scale = 3700) {
  // A function to continually choose and zoom to a new random word.
  let dat = random_point()

  d3.select("#viztxt2").style("color", colorscale(+dat.sentiment)).text(`Focused on: '${dat.word}'`)
  const [x, y] = [+dat.x, -dat.y];
    canvas.transition().duration(3500).call(
      // zoom out on the new point quickly
      zoomBehavior.transform,
      d3.zoomIdentity.translate(width / 2, viz_height / 2).scale(width/95).translate(-x, -y)
      ).transition().duration(7500).call(
      //zoom in slowly
      zoomBehavior.transform,
      d3.zoomIdentity.translate(width / 2, viz_height / 2).scale(scale).translate(-x, -y)
      )
      .on("end", function() {jump()})
}
```

```js
plot_legend = {
  // This handles starting the jump process.
  [replay, replay2] //trigger replay on button clicks.
  jump()
  return html`<div id=viztxt2 style="font-size:24px;background-color:white;text-fill:red">Preparing zoom</div>` 
}
```

```js
viewof replay = html`<button>Restart animation</button>`
```

```js
html`<div id=viz><canvas id="gl1" width=${width} height=${viz_height} /><div id=viztxt style="background:blue;position:absolute;z-index:1000;top:20">foo</div></div>`
```

```js echo
viewof replay2 = html`<button>Restart animation</button>`
```

```js
md` ## Parameterizing the semantic-geometric tradeoff`
```

```js
viewof binary = radio({options:["Semantic zoom", "Geometric zoom", "Balanced zoom"], value:"Balanced zoom", title: "Choose zoom strategy. By default, the 'balanced' version."})
```

```js
viewof point_size = slider({min:0.1, max:10, step:0.1, value:1.33, description: "Base point size (may be affected by zoom", title: "Point Size"})
```

```js
viewof tradeoff = slider({title:"Geometric zoom share", value: 0.5, min: 0, format: '.01%', max: 1, step:0.01, description: "Balance between semantic and geometric zooming. Represents a share of the zoom that goes into the new data. 0 is semantic zooming, where the size is constant in pixels: 100% makes the size grow linearly with zoom: and 50% is the geometric mean (I think)? of the two sizes."})
```

```js
md`Fortunately, there's a relatively straightforward way to balance between these two imperatives that I have ticked by default above.

In semantic zoom, any given point has size p; in geometric zoom, any given point has size \`p*k\`, where k is the d3 zoom level. 

To smoothly interpolate between this, we just need to remember that d3-zoom operates on a logarithmic scale; that is, the same amount of mouse wheeling produces zoom of 2, then 4, then 8, etc. So the geometric zoom formula is actually \`size = p*(exp(z))\`, where \`z == log(k)\`, the zoom parameter in a linear domain. From here, we can create a tradeoff parameter \`g\` that ranges between zero and one.

The size of any given point is then **\`p*(exp(z*g))\`**. When \`g\` is zero, this reduces simply to \`p\` (semantic zoom); when \`g\` is one, it's geometric zoom. But for values in between, it represents the share of zoom level that should translate into also enlarging points. When using charts with high levels of zoom, almost any intermediate value seems preferable to 0 or 1; I generally just use 0.5, but YMMV. (In theory, this function isn't actually bounded by 0 and 1: you could also set it below zero or above one to switch the direction of growth so points get ever smaller as you zoom in. In practice, I don't think this would ever be useful.)

I think this smooth interpolation general looks better than the most widely used alternatives for making deep zoom plots legible (periodically stepping up sizes, as in mapping applications; tricks involving opacity; and bounding point size within a minimum and maximum so that they grow until they're 20 points or so wide). But it's also compatible with any of them.

### A 2-d three.js camera trick.

In SVG or canvas, this calculation is relatively straightforward. In pure WebGL, I think it can be done with a shader. In three.js, though, updating the size of points may be a pain compared to moving the camera. But there's a trick that avoids updating any of the underlying geometry buffers: it's possible to change this parameter with camera updates alone, because three.js exposes two parameters that correspond to geometric and semantic zoom: the camera height, and the field-of-view angle.

The math here is a little tricky, but inverting one of @grantcuster's trigonometric functions, we can set both parameters in tandem. Using using his field-of-view visualization below, you can see the way that z height and field of view trade off.
`


```

```js
md`# Remaining questions

I think this is a good general strategy, but there are few other remaining issues. The choice of initial parameters still requires hand-tuning. My instinct is that at most zoom levels, the right strategy will have about 1/4 to 1/2 of the screen filled with dots and 1/2 to 3/4 empty; but building that in as a default is a little tricky. Perhaps it should be done simply as a function of the number of points in the scatterplot and the number of pixels on the screen.
`
```

```js
get_camera_z = function(zoom_level) {
  let v
  switch (binary) {
    case "Semantic zoom": v = 0; break;
    case "Geometric zoom": v = 1; break;
    case "Balanced zoom": v = tradeoff; break;
  }
  return viz_height/(Math.exp(zoom_level*v)
)}

```

```js
zoomBehavior = {
  // adapted from https://observablehq.com/@grantcuster/using-three-js-for-2d-data-visualization
  let d3_zoom = d3.zoom()
    .scaleExtent([10, 400000])
    //.extent([[-30, -30], [30, 30]])
    //.translateExtent([[0, 0], [width, viz_height]])
    .extent([[0, 0], [width, viz_height]])
  	.on('zoom', () =>  {
      const e = d3.event.transform
      zoomEvent(e);
    });
  return d3_zoom;
}

```

```js echo
canvas = d3.select("#gl1").call(zoomBehavior)
```

```js echo
html`<canvas id="fov_image" style="background:#efefef" width=${width} height=${canvas_height}></canvas>`
```

```js
viewof zoom1 = slider({min: 0, max: 15, step: .25, value:3.5, title:"Base Zoom level", description: "Change this to adjust the zooming distance. The number you adjust here is the log of the d3 zoom value (transform.k)"})
```

```js echo
d3.zoomIdentity
```

```js
function setUpZoom() {
  // This probably should just be called directly, not wrapped as a function.
  let initial_scale = zoom1;
  var initial_transform = d3.zoomIdentity
  .translate(width/2, viz_height/2)
  .scale(initial_scale);    
  zoomBehavior.transform(d3.select("#gl1"), initial_transform);
  camera.position.set(0, 0, get_camera_z(zoom1));
  
}
```

```js echo
setUpZoom()
```

```js
zoom = zoom1// + (animation =="True" ? zoom_modifier : .4)
```

```js
md`## Illustration key

(*This text is by Grant Custer*)

The illustration above is a cutaway side-view of the three.js camera and scene. The horizontal view represents the z axis and the vertical is the y.  
<span style="background: black; color: white">The black dot represents the camera.</span>  
<span style="background: green; color: white">The green line shows the height and poistion of the group of dots. The dots are centered around the position \`x: 0, y: 0, z: 0\`.</span>  
<span style="background: #fff">The dotted line is the z position you adjusted above -- the distance between the camera and the points in the z-axis.</span>  
<span style="background: purple; color: white;">The purple lines show the field of view angle. What they contain determines what is visible in the visualization.</span>  
<span style="background: blue; color: white;">The blue line represents the height of the visualization itself, which is useful for thinking about scale.</span>  
<span style="background: #ddd">The dark gray rectangle represents the space between the near and far plane. Anything outside of that space will not be rendered. Note that the planes are defined relative to the position of the camera.`
```

```js echo
md`The zoom modifier just uses the time to continuously zoom in and out smoothly.`
```

```js echo
zoom_modifier = 0//Math.sin(now / 2000)* 2.3 + 1.2
```

```js
viewof year_size = slider({
  min: 1, 
  max: 200, 
  value: 200,
  step: 1,
  description: "Number of years to show"
})
```

```js
random_point = function() {
  let r = Math.floor(Math.random()*data.length)
  // Pick a random word weighted by zipfian frequency.
  r = Math.round(Math.exp(Math.random()*Math.log(data.length)))
  return data[r]
}
```

```js
md`## Near Plane calculations

Ignore this: it will be the subject of my next notebook in this series, and I'm too lazy to remove it yet.

First Year: __${(near_year)}__. Last year: __${far_year}__.`
```

```js echo
far_year = near_year + year_size
```

```js
viewof near_year = slider({
  min: 1600, 
  max: 2010, 
  step: 1, 
  description: "First year"
})
```

```js
md`Point settings:`
```

```js
viewof sizeAttenuation = html`<input checked type=checkbox>`
```

```js
md`## Using these settings in three.js

I set field of view, but the updating zoom here means I set more variables before render than Custer.`
```

```js echo
camera = new THREE.PerspectiveCamera(90, width / viz_height, 1, 1000);
```

```js
renderer = {
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas: d3.select("#gl1").node() });
  renderer.setSize(width, viz_height);
  renderer.setPixelRatio(devicePixelRatio);
  return renderer
}
```

```js echo
function zoomEvent(zoom) {
  let canvas_inputs = {}
  const scale = zoom.k;
  camera.position.x = -(zoom.x - width/2) / scale;
  camera.position.y = (zoom.y - viz_height/2) / scale;
  camera.position.z = get_camera_z(Math.log(scale));
  camera.fov = needed_fov(viz_height, camera.position.z, scale)
  
  // future compatibility
  camera.near_plane = 1//camera.position.z * 2 // + near_year/1000
  camera.far_plane = 10000//camera.position.z / 2//camera.position.z + far_year/1000
  
  camera.updateProjectionMatrix()
  renderer.render(scene, camera);

  canvas_inputs.k = scale
  canvas_inputs.x = camera.position.x
  canvas_inputs.y = camera.position.y
  canvas_inputs.z = camera.position.z
  canvas_inputs.fov = camera.fov
  canvas_inputs.near_plane = camera.near_plane
  canvas_inputs.far_plane = camera.far_plane
  
  drawCamera(canvas_inputs)
  
  return canvas_inputs
}
```

```js echo
needed_fov(850, 26, 200)
```

```js echo
pointsMaterial = {
  let point_size_adjuster = 1
  if (binary == "Semantic zoom") {
    point_size_adjuster = 2
  } else if (binary == "Geometric zoom") {
    point_size_adjuster = 0.25 
  } else if (binary == "Balanced zoom") {
    point_size_adjuster = 0.85 
  }
  return new THREE.PointsMaterial({
    size: point_size * point_size_adjuster,
    sizeAttenuation: sizeAttenuation,
    vertexColors: THREE.VertexColors,
    map: circle_sprite,
    transparent: true
})
}
```

```js
md`## How to think about scale

The original visualization here calculates a D3 scale from zoom and width parameters. Here I want the inverse; how do we calculate zoom and field-of-view parameters given a d3-zoom value?`
```

```js echo
function needed_fov(viz_height, camera_z, scale) {
 const fov_height = viz_height/scale
 const half_fov_radians = Math.atan(fov_height/(2 * camera_z))
 const half_fov = toDegrees(half_fov_radians)
 return half_fov * 2
}
```

```js
md`### Illustration code`
```

```js
canvas_z_fit = 1000
```

```js
canvas_z_padding = 40
```

```js
canvas_scale = width/(canvas_z_fit + canvas_z_padding * 2)

```

```js
mutable canvas_height = 400 * canvas_scale
```

```js echo
function drawCamera(canvas_inputs) {
  let ctx = d3.select("#fov_image").node().getContext('2d')
  
  let cx = width/2;
  let cy = canvas_height/2;
  ctx.clearRect(0, 0, width, canvas_height)

  let scaled_z = canvas_inputs.z * canvas_scale;
  let z_padding = canvas_z_padding * canvas_scale;
  
  let y_adjust = -canvas_inputs.y * canvas_scale;

  // Near and far threshold
  
  ctx.beginPath();
  ctx.moveTo(width - z_padding - scaled_z + canvas_inputs.near_plane * canvas_scale, 0)
  ctx.lineTo(width - z_padding - scaled_z + canvas_inputs.far_plane * canvas_scale, 0)
  ctx.lineTo(width - z_padding - scaled_z + canvas_inputs.far_plane * canvas_scale, canvas_height)
  ctx.lineTo(width - z_padding - scaled_z + canvas_inputs.near_plane * canvas_scale, canvas_height)
  ctx.closePath();
  ctx.fillStyle = "#ddd";
  ctx.fill();
  
  // Z line
  ctx.beginPath();
  ctx.moveTo(width - z_padding, cy + y_adjust)
  ctx.lineTo(width - z_padding - scaled_z, cy + y_adjust);
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 2;
  ctx.stroke();
  
  let half_fov = canvas_inputs.fov/2;
  let half_fov_radians = toRadians(half_fov);
  let fov_height = 2* Math.tan(half_fov_radians) * canvas_inputs.z;

  // Field of view triangle
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(width - z_padding - scaled_z, cy + y_adjust)
  ctx.lineTo(width - z_padding, cy - (fov_height / 2 * canvas_scale) + y_adjust);
  ctx.lineTo(width - z_padding, cy + (fov_height  / 2 * canvas_scale) + y_adjust);
  ctx.closePath();
  ctx.strokeStyle = "purple";
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Camera circle
  ctx.beginPath();
  ctx.arc(width - z_padding - scaled_z, cy + y_adjust, 9, 0, Math.PI * 2, true);
  ctx.lineWidth = 0;
  ctx.fillStyle = "black";
  ctx.fill();
  
  // Screen indicator
  ctx.beginPath();
  ctx.moveTo(width - z_padding, cy - viz_height / 2 * canvas_scale);
  ctx.lineTo(width - z_padding, cy + viz_height / 2 * canvas_scale);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "blue";
  ctx.stroke();
  
  // Dots indicator
  ctx.beginPath();
  ctx.moveTo(width - z_padding, cy - points_radius * canvas_scale);
  ctx.lineTo(width - z_padding, cy + points_radius * canvas_scale);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "green";
  ctx.stroke();
}
```

```js
md`### Visualization code`
```

```js
viz_height = width * 0.7
```

```js
points_radius = 30
```

```js
scene = {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2f2f2f);
  scene.add(points);
  return scene;
}
```

```js echo
points = {
  let pointsGeometry = new THREE.BufferGeometry();
  const buffer = new ArrayBuffer(data.length * 3 * 4);
  const color_buffer = new ArrayBuffer(data.length * 3 * 4);
  const positions = new Float32Array(buffer)
  const colors = new Float32Array(color_buffer);

  data.forEach((datum, i) => {
    positions.set(datum.position, i * 3)
    const c = d3.color(colorscale(+datum.sentiment))
    colors.set([c.r/255, c.g/255, c.b/255], i*3)
    // colors.set([0, 0, 1], i*3)
  })
  let sizes = data.map(d => d.size)
  sizes = Float32Array.from(sizes)
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  pointsGeometry.setAttribute('size', new THREE.BufferAttribute( sizes, 1 ))
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute( positions, 3))
  return new THREE.Points(pointsGeometry, pointsMaterial);
}
```

```js echo
colorscale = d3.scaleLinear().domain([-0.15, 0, 0.15]).range([d3.interpolatePuOr(0), d3.interpolatePuOr(.5), d3.interpolatePuOr(1)]).clamp(true)
```

```js
circle_sprite= new THREE.TextureLoader().load(
  "https://blog.fastforwardlabs.com/images/2018/02/circle-1518727951930.png"
)
```

```js echo
d3 = require('d3@5')
```

```js echo
function return_tile(depth, i, j) {  return d3.tsv(`https://creatingdata.us/data/scatter/hathi/tiles/${depth}/${i}/${j}.tsv`).catch(err => Promise.resolve([])).then(d => d.map(e => {return {position: [+e.x, +e.y, -e.date/1000], ix: +e.ix, name: e.title, data: e, group: e.lc1.slice(1)}}))}
                                                        
```

```js echo
function children(depth, i, j) {
  return [[depth * 2, i*2, j*2],[depth * 2, i*2+1, j*2],[depth * 2, i*2, j*2+1],[depth * 2, i*2+1, j*2+1]]
}
```

```js echo
function load_points(n, start = [1, 0, 0], depth=0) {                     
  //if (depth >= 257) {
  // Debugging regress loop.
  //  return "YOWZA" 
  //}
  const requests = []
  return return_tile(...start).catch(err => []).then(
    data => {
      const last_point = data.slice(-1)[0]
      // Break condition; only up to the nth point in the data.
      if (last_point.ix > n) {
        return data.filter(d => (+d.ix <= n)) 
      }
    // If unbroken, add points from all children tiles as well using this same function.
    const kids = children(...start).map(ix => load_points(n, ix, depth+1))
    return Promise.all(kids).then(kidders => {
      return [].concat(...kidders, data);
    })
  })
}
```

```js echo
old_data = load_points(500).then(p => {p.sort((a, b) => a.group == ''); return p})
```

```js echo
import {slider, radio} from "@jashkenas/inputs"

```

```js echo
data = d3.tsv("https://benschmidt.org/profCloud/d.tsv", function(row, i) {
  row.position = [+row.x, +row.y, -1.900]
  row.group = row.word.length
  row.ix = i
  row.size = 1/(i + 1)
  return row
})
```

```js echo
accent = d3.scaleOrdinal(d3.schemeAccent)
```

```js
function toRadians (angle) {
  return angle * (Math.PI / 180);
}
```

```js
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}
```

```js
THREE = require("three@0.111.0/build/three.min.js")
```
