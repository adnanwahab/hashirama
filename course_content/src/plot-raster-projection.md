<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Projected raster: vapor</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Projected raster: vapor

The [raster](https://observablehq.com/plot/marks/raster) mark works with [projections](https://observablehq.com/plot/features/projections). Data: [Aqua/MODIS water vapor](https://neo.gsfc.nasa.gov/view.php?datasetId=MYDAL2_M_SKY_WV), NASA Earth Observations.

```js echo
Plot.plot({
  projection: "equal-earth",
  color: {
    scheme: "BuPu",
    domain: [0, 6],
    legend: true,
    label: "Water vapor (cm)"
  },
  marks: [
    Plot.raster(vapor, {
      fill: Plot.identity,
      width: 360,
      height: 180,
      x1: -180,
      y1: 90,
      x2: 180,
      y2: -90,
      interpolate: "barycentric",
      clip: "sphere"
    }),
    Plot.sphere({stroke: "black"})
  ]
})
```

```js echo
vapor = FileAttachment("water-vapor.csv").csv({array: true}).then(rows => rows.flat().map((x) => (x === "99999.0" ? NaN : +x)))
```
