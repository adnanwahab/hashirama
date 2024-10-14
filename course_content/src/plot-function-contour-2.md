<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Function contour 2</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Function contour 2

A function [contour](https://observablehq.com/plot/marks/contour) with a [diverging](https://observablehq.com/plot/features/scales#color-scale-options) color scale.

```js echo
Plot.plot({
  aspectRatio: 1,
  x: {tickSpacing: 80, label: "x →"},
  y: {tickSpacing: 80, label: "↑ y"},
  color: {type: "diverging", legend: true, label: "sin(x) cos(y)"},
  marks: [
    Plot.contour({
      fill: (x, y) => Math.sin(x) * Math.cos(y),
      x1: 0,
      y1: 0,
      x2: 6 * Math.PI,
      y2: 4 * Math.PI
    })
  ]
})
```
