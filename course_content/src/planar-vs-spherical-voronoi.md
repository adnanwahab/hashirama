<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Planar vs. Spherical Voronoi</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Planar vs. Spherical Voronoi

The distances between points projected on the plane are not exactly proportional to the corresponding distances on the sphere. This unescapable mathematical fact creates a discrepancy between the planar Voronoi diagram and its spherical counterpart.

For example, a “true” (spherical) diagram has polygons that cross the antemeridian line, which are impossible on the planar diagram. In general, the planar Voronoi distorts polygons that are close to the edge of the map.

For the sake of simplicity (and for faster loading times), Plot defaults to the planar algorithm. But if you want more accuracy, you can require [d3-geo-voronoi](https://github.com/Fil/d3-geo-voronoi), and let Plot.geo draw its outputs.


The maps below compare the planar (on the left) and spherical (on the right) Voronoi diagrams associated with a dataset of the [world’s airports](https://observablehq.com/@d3/world-airports-voronoi).

## Orthographic
${show("orthographic")}

## Mercator
${show("mercator")}

## Equal Earth

The distortion near the edges (at the poles and on the antimeridian line) is quite important.

${show("equal-earth")}

## Zoom

When we start zooming in, like here with the stereographic projection, the
distortion recedes.

${show("stereographic", true)}


## Focus

Zooming in a bit closer, for example by focusing on the U.S. with Albers’ conic
projection, the distortion is almost invisible.

${show("albers", true)}


Click on the button below to overlay the maps with blue and red colors.

```js
viewof compose = Inputs.radio(["side by side", "blue and red"], {
  value: "side by side"
})
```

---

*supporting code*

```js echo
show = (projection, frame) => compose === "side by side" ?
  htl.html`<div style="display:flex; justify-content: space-between">
    ${planar(projection, frame)}
    ${spherical(projection, frame)}
  `
  :
  htl.html`
    ${mix(projection, frame)}
  `
```

```js echo
planar = (projection, frame) =>
  Plot.plot({
    width: 0.49 * width,
    height: 0.49 * width * (projection === "equal-earth" ? 0.5 : 1),
    projection,
    marks: [
      Plot.voronoiMesh(points, {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5
      }),
      Plot.dot(points, { r: 1, fill: "black" }),
      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()
    ],
    caption: "Planar"
  })
```

```js echo
spherical = (projection, frame) =>
  Plot.plot({
    width: 0.49 * width,
    height: 0.49 * width * (projection === "equal-earth" ? 0.5 : 1),
    projection,
    marks: [
      Plot.geo(d3.geoVoronoi().cellMesh(points), {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5
      }),
      Plot.dot(points, { r: 1, fill: "black" }),
      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()
    ],
    caption: "Spherical"
  })
```

```js echo
mix = (projection, frame) =>
  Plot.plot({
    width: 0.49 * width,
    height: 0.49 * width * (projection === "equal-earth" ? 0.5 : 1),
    projection,
    marks: [
      Plot.voronoiMesh(points, {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5,
        stroke: "red"
      }),
      Plot.geo(d3.geoVoronoi().cellMesh(points), {
        clip: "sphere",
        strokeOpacity: 1,
        strokeWidth: 0.5,
        stroke: "blue"
      }),
      Plot.dot(points, { r: 1, fill: "black" }),
      frame ? Plot.frame({ strokeWidth: 1.5 }) : Plot.sphere()
    ],
    caption: htl.html`<span><span style="color: red">Planar</span> — <span style="color: blue">Spherical</span>`
  })
```

```js echo
d3 = require("d3-geo-voronoi@2")
```

```js echo
import {points} from "@d3/world-airports-voronoi"
```
