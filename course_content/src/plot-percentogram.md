<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Percentogram</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Percentogram

Ref. Andrew Gelman, [The “percentogram”—a histogram binned by percentages of the cumulative distribution, rather than using fixed bin widths](https://statmodeling.stat.columbia.edu/2023/04/13/the-percentogram-a-histogram-binned-by-percentages-of-the-cumulative-distribution-rather-than-using-fixed-bin-widths/), 13 April 2023.

```js echo
Plot.plot({
  color: {
    legend: true,
    type: "quantize",
    scheme: "spectral",
    n: 10,
    label: "percentile"
  },
  y: {label: "density"},
  marks: [
    Plot.rectY(numbers, {
      fill: (d, i) => i,
      ...Plot.binX({
        y: (bin, {x1, x2}) => 1 / (x2 - x1),
        thresholds: percentiles
      })
    }),
    Plot.ruleY([0])
  ]
})
```

```js echo
numbers = Float64Array.from({length: 10000}, d3.randomNormal.source(d3.randomLcg(3))())
```

```js echo
function percentiles(numbers) {
  const sorted = d3.sort(numbers);
  return d3.range(0, 101).map((q) => d3.quantileSorted(sorted, q / 100));
}
```
