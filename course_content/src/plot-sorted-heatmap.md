<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Sorted heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Sorted heatmap

[Grouping](https://observablehq.com/plot/transforms/group) by *x* (hour of day) and *y* (location) produces a heatmap. Locations are [sorted](https://observablehq.com/plot/features/scales#sort-mark-option) by the maximum highway traffic (measured as vehicles per hour) they have during the day. Data: [Christopher Möller](https://gist.github.com/chrtze).

```js echo
Plot.plot({
  marginLeft: 120,
  padding: 0,
  y: {label: null},
  color: {legend: true, zero: true},
  marks: [
    Plot.cell(
      traffic,
      Plot.group(
        {fill: "median"},
        {x: (d) => d.date.getUTCHours(), y: "location", fill: "vehicles", inset: 0.5, sort: {y: "fill"}}
      )
    )
  ]
})
```

```js echo
traffic = FileAttachment("traffic.csv").csv({typed: true})
```
