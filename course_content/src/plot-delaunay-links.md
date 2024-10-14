<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Delaunay links</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Delaunay links

It can be useful to color the links of the [Delaunay](https://observablehq.com/plot/marks/delaunay) graph based on some property of data, such as the body mass of penguins.

```js echo
Plot.plot({
  color: {legend: true},
  marks: [
    Plot.delaunayLink(penguins, {x: "culmen_depth_mm", y: "culmen_length_mm", stroke: "body_mass_g", strokeWidth: 1.5})
  ]
})
```
