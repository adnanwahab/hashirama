<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Volcano raster</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Volcano raster

A [raster](https://observablehq.com/plot/marks/raster) mark directly reading an array of elevation values.

```js echo
Plot.plot({
  aspectRatio: 1,
  color: {label: "Elevation (m)", legend: true},
  marks: [
    Plot.raster(volcano.values, {width: volcano.width, height: volcano.height})
  ]
})
```

```js echo
volcano = FileAttachment("volcano.json").json()
```
