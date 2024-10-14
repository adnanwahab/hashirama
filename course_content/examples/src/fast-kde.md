# Fast Kernel Density Estimation

[Kernel density estimation (KDE)](https://en.wikipedia.org/wiki/Kernel_density_estimation) models a set of discrete values as a continuous probability distribution. We represent each data point using a _kernel_: a distribution function such as a [normal (or Gaussian) distribution](https://en.wikipedia.org/wiki/Normal_distribution). We compute a kernel response for each data point, then add these up to form a continuous distribution.

KDE powers visualization techniques such as density plots, violin plots, heatmaps, and contour plots. The [`fast-kde`](https://github.com/uwdata/fast-kde) library provides fast (linear-time), accurate approximation of Gaussian kernel density estimates in both 1D and 2D.

```js echo
kde = require('fast-kde')
```

<hr/>
## 1D Density Estimation

To summarize a 1D distribution, we can estimate the density and plot the results.

```js
values1d = [2.1, 2.9, 3.1, 5.7, 6.6, 8.5];
```

```js echo
density1d = kde.density1d(values1d, { bandwidth: 3, pad, bins })
```

```js
viewof bw1d = Inputs.range([0.1, 3], {step: 0.01, value: 1, label: 'Bandwidth'})
```

```js
viewof pad = Inputs.range([0, 4], {step: 0.05, value: 4, label: 'Pad'})
```

```js
viewof bins = Inputs.select([64, 128, 256, 512, 1024], {value: 512, label: 'Bins'})
```

```js
Plot.plot({
  x: { domain: [-7, 17] },
  y: { grid: true },
  marks: [
    // use bandwidth method to update efficiently without re-binning
    Plot.areaY(density1d.bandwidth(bw1d), {x: 'x', y: 'y', fill: '#ccc' }),
    Plot.dot(values1d, {x: d => d, y: 0, fill: 'black' })
  ],
  width,
  height: 250
})
```

We plot density as a grey area, and include the input data points as black circles. Density plots provide a continuous alternative to summaries such as histograms.

The *bandwidth* parameter determines the kernel width, which here corresponds to the standard deviation of the Gaussian distributions representing each point. If the bandwidth is not specified, it is determined automatically using a heuristic.

The *pad* parameter indicates the number of bandwidths by which to extend the range of estimates beyond the \[min, max\] extent of the data. Alternatively, one can specify an *extent* array \[lo, hi\], in which case *pad* is ignored.

The density estimator bins data into a grid. The *bins* parameter controls the size of this grid and the number of corresponding sample points that are returned.

<hr/>
## 2D Density Estimation

We can also estimate density over a 2D domain.

```js
values2d = [
  [2.1, 2],
  [2.9, 3],
  [3.1, 4],
  [5.7, 5],
  [6.6, 6],
  [8.5, 7]
];
```

```js echo
density2d = kde.density2d(values2d, { bandwidth: 1, extent: [-2, 12] })
```

We can visualize 2D density estimates using color in a heatmap image. Color interpolators from [d3-scale-chromatic](https://github.com/d3/d3-scale-chromatic) can be used to stylize the encoding.

```js
viewof bw2d = Inputs.range([0.1, 3], {step: 0.01, value: 1, label: 'Bandwidth'})
```

```js echo
density2d.bandwidth(bw2d).heatmap({ color: d3.interpolatePiYG }) // returns an HTML canvas
```

Alternatively, we can generate sample points for the 2D density and plot them. Here we limit the number of `bins` (sample points) to 10 for both the x- and y-dimensions. The grey circles show density estimates, the black circles are input data points.

```js
Plot.plot({
  r: { type: 'sqrt', range: [0, 16] },
  marks: [
    Plot.dot(kde.density2d(values2d, { bins: 10, bandwidth: bw2d }), {x: 'x', y: 'y', r: 'z', fill: '#ccc' }),
    Plot.dot(values2d, { x: d => d[0], y: d => d[1], fill: 'black' })
  ],
  width: 300,
  height: 300
})
```

For more, see the [`fast-kde` documentation](https://github.com/uwdata/fast-kde) or the VIS 2021 paper [Fast &amp; Accurate Gaussian Kernel Density Estimation](https://idl.cs.washington.edu/papers/fast-kde).
