```js
md`# Density Scatterplot
Here's how to create a density scatterplot of ${tex`(x, y)`} points. The chart below plots ${comma(numPoints)} normally-distributed data points.`
```

```js
viewof numPoints = slider({
  min: 10000,
  max: maxPoints,
  value: 450000,
  step: 100,
  title: 'Number of points',
  format: ','
})
```

```js
viewof nBins = slider({
  min: 10,
  max: 400,
  value: 400,
  step: 10,
  title: 'Histogram bins',
  format: x => `${x}×${x}`
})
```

```js echo
{
  console.time("plot");
  // Create and configure a plotter with our density estimator and a color scale
  let plot = densityPlot(density)
    .size([500, 500])
    .background("#fff")
    // Customize the color scale to linearly map bin counts to an blue color scale.
    .color((buf) =>
      d3.scaleSequential(
        d3.extent(buf),
        // cacheInterpolator speeds up colorization by returning cached {r, g, b, opacity} objects
        cacheInterpolator(d3.interpolateBlues)
      )
    );
  let ret = plot(xs);
  console.timeEnd("plot");
  return ret;
}
```

```js
md`To discretize the data into an array of bin weights without plotting, call \`density(data)\` instead of \`plot(data)\`.`
```

```js echo
// Create and configure a density estimator for our data
density = pointDensity(nBins, nBins)
  .x(d => d)
  .y((d, i) => ys[i])
  // Specify the x and y domains that we'd like to plot
  .xDomain([-2.5, 2.5])
  .yDomain([-2.5, 2.5])
```

```js echo
xs = X.subarray(0, numPoints)
```

```js echo
ys = Y.subarray(0, numPoints)
```

```js echo
X = Float64Array.from({ length: maxPoints }, rand)
```

```js echo
Y = Float64Array.from({ length: maxPoints }, rand)
```

```js echo
maxPoints = 1e6
```

```js echo
rand = d3.randomNormal(0, 0.75) // Sample coordinates from a normal distribution
```

```js echo
d3 = require('d3@6')
```

```js echo
comma = d3.format(',')
```

```js echo
import { slider } from '@jashkenas/inputs'
```

```js echo
import {
  densityPlot,
  pointDensity,
  cacheInterpolator
} from '@twitter/density-plot@4159'
```
