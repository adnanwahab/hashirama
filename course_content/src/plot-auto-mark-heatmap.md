<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Auto mark, heatmap</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Auto mark, heatmap

Given two quantitative dimensions for *x* and *y*, the [auto](https://observablehq.com/plot/marks/auto) mark will create a heatmap from the [binned](https://observablehq.com/plot/transforms/bin) values.

```js echo
Plot.auto(olympians, {x: "weight", y: "height", color: "count"}).plot()
```

This auto mark is equivalent to a rect & bin combination:

```js echo
Plot.rect(olympians, Plot.bin({fill: "count"}, {x: "weight", y: "height"})).plot()
```
