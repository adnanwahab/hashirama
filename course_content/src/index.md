---
theme: slate
---

```js
import {ApiHeatmap} from "./components/apiHeatmap.js";
import {ApiHistogram} from "./components/apiHistogram.js";
```

Thank the wizards - sicp - refleict visions - morophocde sidepanel -- loading bar +==++++++ rceive input from the electorate

# Analyzing web logs

Web logs capture traffic metadata, such as the request time and route, how long the server took to respond, the response size, and so on. Analyzing web logs sheds light on both server performance and client behavior. Yet the common practice of summary statistics (_e.g._, 95th-percentile latency) often hides interesting patterns! This is because performance varies wildly based on the nature of the request, and unusual clients such as bots can easily hide in a sea of “natural” traffic.

What if — instead of summarizing — we plotted _every_ request as a dot with time along *x*→ and latency (on a log scale) along *y*↑?

```js
const latencyHeatmap = FileAttachment("data/latency-heatmap.parquet").parquet();
const latencyByRouteCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response latency, color by route</h2>
  ${resize((width) => ApiHeatmap(latencyHeatmap.getChild("count"), latencyHeatmap.getChild("route"), {y1: 0.5, y2: 10_000, canvas: latencyByRouteCanvas, color: routeColor, width, label: "Duration (ms)"}))}
</div>

```js
const topRoutesPixel = d3.sort(d3.rollups(latencyHeatmap.getChild("route"), (D) => D.length, (d) => d).filter(([d]) => d), ([, d]) => -d).map(([route, count]) => ({route, count}));
const routeColor = Object.assign(Plot.scale({color: {domain: topRoutesPixel.map((d) => d.route)}}), {label: "route"});
const routeSwatch = (route) => html`<span style="white-space: nowrap;"><svg width=10 height=10 fill=${routeColor.apply(route)}><rect width=10 height=10></rect></svg> <span class="small">${route}</span></span>`;
```

The plot above shows a sample of ${d3.sum(latencyHeatmap.getChild("count")).toLocaleString("en-US")} requests to Observable servers over a 7-day period. Color encodes the associated route. Hover to see the route.

<div class="small note">Since the image is discrete, this scatterplot is effectively a heatmap: each pixel corresponds to a 5-minute time interval and some narrow latency band, while color encodes the most-frequent route within the pixel. There are many routes, so categorical colors are recycled; yet much like political maps, color reveals boundaries.</div>

The detail in this plot is astonishing: it shows the varying performance of different routes, and intriguing temporal patterns. We’ll tease apart these patterns in a bit. First let’s better understand what we’re looking at.

Collapsing *x*→ (time) gives a more traditional view of latency: a stacked histogram colored by route. This view focuses on performance. Notice ${routeSwatch("/documents/@{login}")} tends to be slow (~1 second), and ${routeSwatch("/avatar/{hash}")} tends to vary widely. Performance is contextualized by showing how much traffic routes receive in aggregate: area is proportional to request volume. The popular ${routeSwatch("/d/{id}.js")} and ${routeSwatch("/@{login}/{slug}.js")} routes power [notebook imports](https://observablehq.com/@observablehq/import), so we want them to be fast (and they are).

```js
const latencyHistogram = FileAttachment("data/latency-histogram.parquet").parquet();
const histogramCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response latency histogram</h2>
  ${resize((width) => ApiHistogram(latencyHistogram.getChild("duration"), latencyHistogram.getChild("count"), latencyHistogram.getChild("route"), {canvas: histogramCanvas, color: routeColor, width, label: "Duration (ms)", y1: 0.5, y2: 10_000}))}
</div>

<div class="small note">The artifacts on the left of the histogram (as well as on the bottom of the heatmap above) are due to the millisecond precision of latency values. Latencies are uniformly jittered by ±0.5ms to smooth (or smear) the data.</div>

Analyzing web logs lets us focus on optimizing routes that are both slow and popular, such as ${routeSwatch("/documents/@{login}")} and ${routeSwatch("/avatar/{hash}")}. We can confirm this by aggregating routes by total count and duration.

```js
const topRoutesCount = visibility().then(() => FileAttachment("data/top-routes-count.parquet").parquet());
const topRoutesDuration = visibility().then(() => FileAttachment("data/top-routes-duration.parquet").parquet());
```

<div class="grid grid-cols-2">
  <div class="card">
    <h2>Top routes by total count</h2>
    ${resize((width) => Plot.plot({
      width,
      marginLeft: 10,
      x: {axis: "top", labelAnchor: "left", grid: true, insetRight: 90, transform: (d) => d / 1000, label: "Requests (thousands)"},
      y: {axis: null, round: false},
      color: routeColor,
      marks: [
        Plot.rectX(topRoutesCount, {x: "count", y: "route", fill: "route", sort: {y: "-x", limit: 10}}),
        Plot.ruleX([0]),
        Plot.text(topRoutesCount, {x: "count", y: "route", dx: -6, text: (d) => d.count / 1000, fill: "var(--theme-background)", frameAnchor: "right"}),
        Plot.text(topRoutesCount, {x: "count", y: "route", dx: 6, text: "route", frameAnchor: "left"})
      ]
    }))}
  </div>
  <div class="card">
    <h2>Top routes by total duration</h2>
    ${resize((width) => Plot.plot({
      width,
      marginLeft: 10,
      x: {axis: "top", labelAnchor: "left", grid: true, insetRight: 90, transform: (d) => d / (1000 * 60 * 60), label: "Duration (hours)"},
      y: {axis: null, round: false},
      color: routeColor,
      marks: [
        Plot.rectX(topRoutesDuration, {x: "duration", y: "route", fill: "route", sort: {y: "-x", limit: 10}}),
        Plot.ruleX([0]),
        Plot.text(topRoutesDuration, {x: "duration", y: "route", dx: -6, text: (d) => d.duration / (1000 * 60 * 60), fill: "var(--theme-background)", frameAnchor: "right"}),
        Plot.text(topRoutesDuration, {x: "duration", y: "route", dx: 6, text: "route", frameAnchor: "left"})
      ]
    }))}
  </div>
</div>

But back to those _temporal_ patterns. These are fascinating because they don’t just show server performance — they show how clients behave “in the wild.”

We can use a dense scatterplot to visualize any quantitative request metric. Below we show response size in bytes along *y*↑. Response sizes are also important for performance, especially if latency measurements only consider the time it takes the server to send the response and not user-perceived latency across the network.

```js
const sizeHeatmap = visibility().then(() => FileAttachment("data/size-heatmap.parquet").parquet());
const sizeByRouteCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response size, color by route</h2>
  ${resize((width) => ApiHeatmap(sizeHeatmap.getChild("count"), sizeHeatmap.getChild("route"), {y1: 400, y2: 160_000, canvas: sizeByRouteCanvas, color: routeColor, width, label: "Size (bytes)"}))}
</div>

The response size heatmap also highlights individual paths, visible as horizontal striations. The ${routeSwatch("/document/@{login}/{slug}")} line at 15,846 bytes represents the [D3 gallery](https://observablehq.com/@d3/gallery), one of the most popular pages on Observable. And the ${routeSwatch("/@{login}/{slug}.js")} line at 12,193 bytes represents [Jeremy’s Inputs](https://observablehq.com/@jashkenas/inputs), a popular import (though superseded by our official [Observable Inputs](https://observablehq.com/framework/lib/inputs)). This heatmap previously revealed a bug where we were loading 200+ notebooks to serve a gallery of only 4–9 notebooks; by fixing the bug, we reduced the total number of >50KB responses by more than half!

The daily pattern for ${routeSwatch("/document/{id}@{version}")} sticks out in this heatmap and on the latency heatmap. What’s going on there? By inspecting logs, we believe this represents an academic research project scraping public notebooks for content analysis. The scraper starts by fetching ${routeSwatch("/documents/public")} ([recent notebooks](https://observablehq.com/recent)) and then repeatedly requests ${routeSwatch("/document/{id}@{version}")} to fetch notebook contents. Once a month, they do a deeper scrape.

By filtering on route, we can see the periodic behavior of the scraper more clearly.

```js
const latencyDocumentsPublicHeatmap = visibility().then(() => FileAttachment("data/latency-heatmap-documents-public.parquet").parquet());
const latencyDocumentsPublicCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response latency of /documents/{public} and /document/{id}@{version}</h2>
  ${resize((width) => ApiHeatmap(latencyDocumentsPublicHeatmap.getChild("count"), null, {y1: 0.5, y2: 10_000, canvas: latencyDocumentsPublicCanvas, color: Object.assign(Plot.scale({color: {domain: [0, 50]}}), {label: "frequency"}), width, label: "Duration (ms)"}))}
</div>

<div class="small note">We support visualization research. If you’re interested in studying public notebooks, please reach out and let us help you write a polite scraper.</div>

Above, we color by frequency instead of route. This better reveals the density of requests, though we cannot differentiate routes and therefore infer as much about behavior. Notice the spike in the early morning hours of January 31. By looking at the associated logs, we determined this to be a bot scanning for vulnerabilities.

```js
const latencyCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response latency, color by frequency</h2>
  ${resize((width) => ApiHeatmap(latencyHeatmap.getChild("count"), null, {y1: 0.5, y2: 10_000, canvas: latencyCanvas, color: Object.assign(Plot.scale({color: {domain: [0, 100]}}), {label: "frequency"}), width, label: "Duration (ms)"}))}
</div>

Let’s look at a couple more routes of interest. The ${routeSwatch("/avatar/{hash}")} route is responsible for serving avatars (profile images). Avatars are used throughout Observable and this is one of the highest-traffic routes.

```js
const latencyAvatarHeatmap = visibility().then(() => FileAttachment("data/latency-heatmap-avatar.parquet").parquet());
const latencyAvatarCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response latency of /avatar/{hash}</h2>
  ${resize((width) => ApiHeatmap(latencyAvatarHeatmap.getChild("count"), null, {y1: 0.5, y2: 10_000, canvas: latencyAvatarCanvas, color: Object.assign(Plot.scale({color: {domain: [0, 50]}}), {label: "frequency"}), width, label: "Duration (ms)"}))}
</div>

Unfortunately, avatars are _slow_. Serving an avatar requires fetching an image for S3 and rescaling to the requested size. S3 is slow, and images are often large and expensive to resize. Furthermore, avatars are often requested in bulk — for example, an activity feed might show hundreds of avatars! The vertical streaks here represent individual clients spawning many simultaneous requests. We have room for improvement here.

The ${routeSwatch("/documents/@{login}")} route is also interesting. It lists the notebooks in the given workspace, such as when you go to your home page, or visit someone’s profile.

```js
const latencyDocumentsAtHeatmap = visibility().then(() => FileAttachment("data/latency-heatmap-documents-at.parquet").parquet());
const latencyDocumentsAtCanvas = document.createElement("canvas");
```

<div class="card">
  <h2>Response latency of /documents/@{login}</h2>
  ${resize((width) => ApiHeatmap(latencyDocumentsAtHeatmap.getChild("count"), null, {y1: 0.5, y2: 10_000, canvas: latencyDocumentsAtCanvas, color: Object.assign(Plot.scale({color: {domain: [0, 30]}}), {label: "frequency"}), width, label: "Duration (ms)"}))}
</div>

This route is slower than we like, mostly due to complicated permissions that make the underlying database queries difficult to index. But the temporal pattern is interesting: at midnight UTC, latency noticeably increases for an hour or two. We believe an internal scheduled batch job is causing resource contention. We want to optimize this route, too.

Web log analysis has been fruitful for the Observable team to prioritize optimization and manage traffic. Using these granular heatmaps, we’ve identified numerous opportunities for improvement that would otherwise go unnoticed.



# Observable Plot downloads

```js
import {revive} from "./components/revive.js";
import {Trend} from "./components/trend.js";
import {BurndownPlot} from "./components/burndownPlot.js";
import {DailyPlot} from "./components/dailyPlot.js";
```

```js
const versions = FileAttachment("data/plot-version-data.csv").csv({typed: true});
const downloads = FileAttachment("data/plot-npm-downloads.csv").csv({typed: true});
const issues = FileAttachment("data/plot-github-issues.json").json().then(revive);
const stars = FileAttachment("data/plot-github-stars.csv").csv({typed: true});
```

```js
// These dates are declared globally to ensure consistency across plots.
const end = downloads[0].date;
const start = d3.utcYear.offset(end, -2);
const lastMonth = d3.utcDay.offset(end, -28);
const lastWeek = d3.utcDay.offset(end, -7);
const x = {domain: [start, end]};
```

<div class="grid grid-cols-4">
  <a class="card" href="https://github.com/observablehq/plot/releases" style="color: inherit;">
    <h2>Latest release</h2>
    <span class="big">${versions.at(-1).version}</span>
    <span class="muted">${((days) => days === 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`)(d3.utcDay.count(versions.at(-1).date, end))}</span>
  </a>
  <a class="card" href="https://github.com/observablehq/plot" style="color: inherit;">
    <h2>GitHub stars</h2>
    <span class="big">${stars.length.toLocaleString("en-US")}</span>
    ${Trend(d3.sum(stars, (d) => d.starred_at >= lastWeek))}</span>
    <span class="muted">over 7d</span>
  </a>
  <a class="card" href="https://npmjs.com/package/@observablehq/plot" style="color: inherit;">
    <h2>Daily npm downloads</h2>
    <span class="big">${downloads[0].value.toLocaleString("en-US")}</span>
    ${Trend(downloads[7].value ? (downloads[0].value - downloads[7].value) / downloads[7].value : undefined, {format: {style: "percent"}})}
    <span class="muted">over 7d</span>
  </a>
  <a class="card" href="https://npmjs.com/package/@observablehq/plot" style="color: inherit;">
    <h2>Total npm downloads</h2>
    <span class="big">${d3.sum(downloads, (d) => d.value).toLocaleString("en-US")}</span>
  </a>
</div>

<div class="card">
  <h2>Daily npm downloads</h2>
  <h3>28d <b style="color: var(--theme-foreground);">—</b> and 7d <b style="color: var(--theme-foreground-focus);">—</b> moving average</h3>
  ${resize((width) =>
    DailyPlot(downloads, {
      width,
      marginRight: 40,
      x,
      y: {insetTop: 40, label: "downloads"},
      annotations: versions.filter((d) => !/-/.test(d.version)).map((d) => ({date: d.date, text: d.version, href: `https://github.com/observablehq/plot/releases/v${d.version}`}))
    })
  )}
</div>

<div class="card">
  <h2>Weekly downloads by version</h2>
  <h3>Last 7d, grouped by major version</h3>
  ${resize((width) =>
    Plot.plot({
      width,
      x: {label: null, round: true, axis: "top"},
      y: {type: "band", reverse: true},
      marginBottom: 0,
      color: {type: "ordinal", scheme: "ylgnbu"},
      marks: [
        Plot.barX(versions, {
          x: "downloads",
          stroke: "white",
          strokeWidth: 0.5,
          y: (d) => d.version.split(".").slice(0, 2).join("."),
          fill: (d) => d.version.split(".").slice(0, 2).join("."),
          tip: {
            channels: {
              version: "version",
              released: (d) => `${d3.utcDay.count(d.date, end).toLocaleString("en-US")} days ago`,
              downloads: "downloads",
            },
            format: {fill: false, x: false, y: false}
          }
        }),
        Plot.ruleX([0]),
        Plot.textX(versions, Plot.stackX({
          x: "downloads",
          y: (d) => d.version.split(".").slice(0, 2).join("."),
          text: (d) => d.downloads > 500 ? d.version : null,
          fill: "white",
          stroke: (d) => d.version.split(".").slice(0, 2).join("."),
          strokeWidth: 5,
          pointerEvents: null
        }))
      ]
    })
  )}
</div>

<div class="grid grid-cols-4">
  <a class="card" href="https://github.com/observablehq/plot/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc" style="color: inherit;">
    <h2>Open issues</h2>
    <span class="big">${d3.sum(issues, (d) => !d.pull_request && d.state === "open").toLocaleString("en-US")}</span>
  </a>
  <a class="card" href="https://github.com/observablehq/plot/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc+draft%3Afalse" style="color: inherit;">
    <h2>Open PRs</h2>
    <span class="big">${d3.sum(issues, (d) => d.pull_request && d.state === "open" && !d.draft).toLocaleString("en-US")}</span>
  </a>
  <a class="card" href="https://github.com/observablehq/plot/issues?q=sort%3Acreated-desc" style="color: inherit;">
    <h2>Recent opened issues</h2>
    <span class="big">${d3.sum(issues, (d) => !d.pull_request && d.open >= lastMonth).toLocaleString("en-US")}</span>
    <span class="muted">in 28d</span>
  </a>
  <a class="card" href="https://github.com/observablehq/plot/issues?q=is%3Aissue+is%3Aclosed+sort%3Aupdated-desc" style="color: inherit;">
    <h2>Recent closed issues</h2>
    <span class="big">${d3.sum(issues, (d) => !d.pull_request && d.close >= lastMonth).toLocaleString("en-US")}</span>
    <span class="muted">in 28d</span>
  </a>
</div>

<div class="grid">
  <div class="card">
    <h2>Open issues over time</h2>
    ${BurndownPlot(issues.filter((d) => !d.pull_request), {x, color: {legend: true, label: "open month"}})}
  </div>
</div>

<div class="grid">
  <div class="card" style="padding: 0;">
    ${Inputs.table(
      issues
        .filter((d) => d.state === "open" && d.reactions.total_count > 5)
        .sort((a, b) => b.reactions.total_count - a.reactions.total_count)
        .map((d) => ({
          "title": {title: d.title, number: d.number},
          "reactions": d.reactions.total_count,
          "days old": d3.utcDay.count(d.created_at, end)
        })),
      {
        width,
        header: {
          title: "Top issues"
        },
        format: {
          title: (d) => html`<a href=https://github.com/observablehq/plot/issues/${d.number} target=_blank>${d.title}</a>`
        }
      }
    )}
  </div>
</div>


asdfasdf



<div class="w-full bg-red-500">
asdflaskdjflaskjflasdkfj asdfasdfasdf
</div>

asdfasdf


asdfas

<iframe class="w-full"src="https://worrydream.com/LadderOfAbstraction/">
</iframe>



<!-- <iframe class="w-full"src="/proxy_to_threejs_journey">
</iframe> -->



<iframe class="w-full"src="https://madebyevan.com/webgl-water/">
</iframe>


<iframe width="100%" height="500" frameborder="0" src="https://observablehq.com/embed/@d3/latex?cells=viewof+tex"></iframe>

```tex

\[
E = mc^2
\]

\[
\int_{a}^{b} x^2 \, dx = \frac{b^3}{3} - \frac{a^3}{3}
\]

\[
F = G \frac{m_1 m_2}{r^2}
\]

\[
\frac{d}{dx}e^x = e^x
\]

\[
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
\]

```


right practice = good - outleirs + sicp

practice + thoery = better



---
sql
select * from files;
---
flocking -webgpu streaming from desktop + all other devices --- share compute --- from scratch or from the module

infra - test latency numbers on yours and mine  - p2p robots


Plot.plot({
  projection: "identity",
  width: 975,
  height: 610,
  marks: [
    Plot.geo(countiesmesh, {strokeOpacity: 0.5}),
    Plot.geo(statemesh, {strokeWidth: 0.75}),
    Plot.geo(nation, {strokeWidth: 1.5})
  ]
})


c = \pm\sqrt{a^2 + b^2}
https://observablehq.com/plot/


https://101.school/courses/physics-101 - chatbot + twitch chat -> issues commands to queue -
test gen
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Plot: Mandelbrot set</h1><a href="/plot">Observable Plot</a> › <a href="/@observablehq/plot-gallery">Gallery</a></div>

# Mandelbrot set

A [raster](https://observablehq.com/plot/marks/raster) can color each pixel with the result of a function. Here the function counts the number of iterations needed until the point “escapes”. Reference: [Wikipedia](https://en.wikipedia.org/wiki/Mandelbrot_set).

```js echo
Plot.raster({fill: mandelbrot, x1: -2, x2: 1, y1: -1.164, y2: 1.164}).plot({aspectRatio: 1})
```

```js echo
function mandelbrot(x, y) {
  for (let n = 0, zr = 0, zi = 0; n < 80; ++n) {
    [zr, zi] = [zr * zr - zi * zi + x, 2 * zr * zi + y];
    if (zr * zr + zi * zi > 4) return n;
  }
}
```
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
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Zoomable circle packing</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Zoomable circle packing

Click to zoom in or out.

```js echo
chart = {

  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;

  // Create the color scale.
  const color = d3.scaleLinear()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

  // Compute the layout.
  const pack = data => d3.pack()
      .size([width, height])
      .padding(3)
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
  const root = pack(data);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", `max-width: 100%; height: auto; display: block; margin: 0 -14px; background: ${color(0)}; cursor: pointer;`);

  // Append the nodes.
  const node = svg.append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")
      .attr("pointer-events", d => !d.children ? "none" : null)
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
      .on("mouseout", function() { d3.select(this).attr("stroke", null); })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

  // Append the text labels.
  const label = svg.append("g")
      .style("font", "10px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);

  // Create the zoom behavior and zoom immediately in to the initial focus node.
  svg.on("click", (event) => zoom(event, root));
  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];

    view = v;

    label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr("r", d => d.r * k);
  }

  function zoom(event, d) {
    const focus0 = focus;

    focus = d;

    const transition = svg.transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", d => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

    label
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
      .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  return svg.node();
}
```

```js echo
data = FileAttachment("flare-2.json").json()
```
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
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">The impact of vaccines</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# The impact of vaccines

A recreation of [a WSJ graphic](http://graphics.wsj.com/infectious-diseases-and-vaccines/) by Tynan DeBold and Dov Friedman.

```js
legend({
  color: chart.scales.color,
  title: "Measles cases per 100,000 people",
  width: 360
})
```

```js echo
chart = {
  // Declare the chart dimensions and margins.
  const marginTop = 20;
  const marginRight = 1;
  const marginBottom = 40;
  const marginLeft = 40;
  const rowHeight = 16;
  const width = 928;
  const height = rowHeight * data.names.length + marginTop + marginBottom;

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");

  // Create the scales.
  const x = d3.scaleLinear()
    .domain([d3.min(data.years), d3.max(data.years) + 1])
    .rangeRound([marginLeft, width - marginRight])

  const y = d3.scaleBand()
    .domain(data.names)
    .rangeRound([marginTop, height - marginBottom])

  const color = d3.scaleSequentialSqrt([0, d3.max(data.values, d => d3.max(d))], d3.interpolatePuRd);

  // Append the axes.
  svg.append("g")
      .call(g => g.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(d3.axisTop(x).ticks(null, "d"))
        .call(g => g.select(".domain").remove()))
      .call(g => g.append("g")
        .attr("transform", `translate(0,${height - marginBottom + 4})`)
        .call(d3.axisBottom(x)
            .tickValues([data.year])
            .tickFormat(x => x)
            .tickSize(marginTop + marginBottom - height - 10))
        .call(g => g.select(".tick text")
            .clone()
            .attr("dy", "2em")
            .style("font-weight", "bold")
            .text("Measles vaccine introduced"))
        .call(g => g.select(".domain").remove()));

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select(".domain").remove());

  // Create a cell for each (state, year) value.
  const f = d3.format(",d");
  const format = d => isNaN(d) ? "N/A cases"
      : d === 0 ? "0 cases"
      : d < 1 ? "<1 case"
      : d < 1.5 ? "1 case"
      : `${f(d)} cases`;

  svg.append("g")
    .selectAll("g")
    .data(data.values)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${y(data.names[i])})`)
    .selectAll("rect")
    .data(d => d)
    .join("rect")
      .attr("x", (d, i) => x(data.years[i]) + 1)
      .attr("width", (d, i) => x(data.years[i] + 1) - x(data.years[i]) - 1)
      .attr("height", y.bandwidth() - 1)
      .attr("fill", d => isNaN(d) ? "#eee" : d === 0 ? "#fff" : color(d))
    .append("title")
      .text((d, i) => `${format(d)} per 100,000 people in ${data.years[i]}`);

  return Object.assign(svg.node(), {scales: {color}});
}
```

```js echo
data = {
  const names = ["Alaska", "Ala.", "Ark.", "Ariz.", "Calif.", "Colo.", "Conn.", "D.C.", "Del.", "Fla.", "Ga.", "Hawaii", "Iowa", "Idaho", "Ill.", "Ind.", "Kan.", "Ky.", "La.", "Mass.", "Md.", "Maine", "Mich.", "Minn.", "Mo.", "Miss.", "Mont.", "N.C.", "N.D.", "Neb.", "N.H.", "N.J.", "N.M", "Nev.", "N.Y.", "Ohio", "Okla.", "Ore.", "Pa.", "R.I.", "S.C.", "S.D.", "Tenn.", "Texas", "Utah", "Va.", "Vt.", "Wash.", "Wis.", "W.Va.", "Wyo."];
  const data = await FileAttachment("vaccines.json").json();
  const values = [];
  const year0 = d3.min(data[0].data.values.data, d => d[0]);
  const year1 = d3.max(data[0].data.values.data, d => d[0]);
  const years = d3.range(year0, year1 + 1);
  for (const [year, i, value] of data[0].data.values.data) {
    if (value == null) continue;
    (values[i] || (values[i] = []))[year - year0] = value;
  }
  return {
    values,
    names,
    years,
    year: data[0].data.chart_options.vaccine_year
  };
}
```

```js echo
import {legend} from "@d3/color-legend"
```

For a recreation of this chart with [Observable Plot](/plot/)’s concise API, see [this notebook](https://observablehq.com/@observablehq/plot-impact-of-vaccines).
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Brushable scatterplot</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Brushable scatterplot

This chart shows the inverse relationship between engine power (*y*-axis) and fuel efficiency (*x*-axis) in ${data.length} cars from 1970–1982. Brushing this scatterplot will show the selected data points.

```js echo
viewof selection = {

  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  // Create the horizontal (x) scale, positioning N/A values on the left margin.
  const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Miles_per_Gallon"])]).nice()
      .range([marginLeft, width - marginRight])
      .unknown(marginLeft);

  // Create the vertical (y) scale, positioning N/A values on the bottom margin.
  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Horsepower"])]).nice()
      .range([height - marginBottom, marginTop])
      .unknown(height - marginBottom);

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .property("value", []);

  // Append the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", width - marginRight)
          .attr("y", -4)
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .text("Miles per Gallon"));

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 4)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Horsepower"));

  // Append the dots.
  const dot = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("transform", d => `translate(${x(d["Miles_per_Gallon"])},${y(d["Horsepower"])})`)
      .attr("r", 3);

  // Create the brush behavior.
  svg.call(d3.brush().on("start brush end", ({selection}) => {
    let value = [];
    if (selection) {
      const [[x0, y0], [x1, y1]] = selection;
      value = dot
        .style("stroke", "gray")
        .filter(d => x0 <= x(d["Miles_per_Gallon"]) && x(d["Miles_per_Gallon"]) < x1
                && y0 <= y(d["Horsepower"]) && y(d["Horsepower"]) < y1)
        .style("stroke", "steelblue")
        .data();
    } else {
      dot.style("stroke", "steelblue");
    }

    // Inform downstream cells that the selection has changed.
    svg.property("value", value).dispatch("input");
  }));

  return svg.node();
}
```

```js echo
selection
```

```js echo
data = FileAttachment("cars-2.csv").csv({typed: true})
```

Thanks to [John Alexis Guerra Gómez](/@john-guerra) for suggestions.
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Radial cluster tree</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Radial cluster tree

D3’s [cluster layout](https://d3js.org/d3-hierarchy/cluster) produces node-link diagrams with leaf nodes at equal depth. These are less compact than [tidy trees](/@d3/radial-tree/2), but are useful for dendrograms, hierarchical clustering and [phylogenetic trees](/@d3/tree-of-life). See also the [Cartesian variant](/@d3/cluster/2).

```js echo
chart = {
  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;
  const cx = width * 0.5; // adjust as needed to fit
  const cy = height * 0.54; // adjust as needed to fit
  const radius = Math.min(width, height) / 2 - 80;

  // Create a radial cluster layout. The layout’s first dimension (x)
  // is the angle, while the second (y) is the radius.
  const tree = d3.cluster()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  // Sort the tree and apply the layout.
  const root = tree(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

  // Creates the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-cx, -cy, width, height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

  // Append links.
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));

  // Append nodes.
  svg.append("g")
    .selectAll()
    .data(root.descendants())
    .join("circle")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

  // Append labels.
  svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants())
    .join("text")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .text(d => d.data.name);

  return svg.node();
}
```

```js echo
data = FileAttachment("flare-2.json").json()
```
```js
md`# Electricity Usage, 2019

During sunny days in the summer, my home’s solar cells typically produce more energy than we consume. However, at night, on cloudy days, and during the winter when the sun is lower in the sky, we pull energy from PG&E’s grid.

We also have an electric car and a fast charger that can draw 10 kW! The frequent 4-6 hour evening spikes in energy consumption show the car charging. You can also see our electric furnace warming up the house on cold February mornings. And you can see our four-day power outage in October. 😣

You can visualize your own data from PG&E, too! Follow the instructions below.`
```

```js
chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("background", "white");

  svg.append("g")
    .append(() => legend({
      color,
      title: "Net power consumption (kW)", 
      tickFormat: "+d"
    }));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.date.getHours()))
      .attr("y", d => y(d3.timeDay(d.date)))
      .attr("width", x.bandwidth() - 1)
      .attr("height", y.bandwidth() - 1)
      .attr("fill", d => color(d.usage))
    .append("title")
      .text(d => `${formatDate(d.date)}
${formatUsage(d.usage)} kW`);

  return svg.node();
}
```

```js
md`To incorporate your own data into this chart:

1. Go to your [PG&E account](https://pge.com)
1. Under *Your Account*, click *Your Energy Use*
1. Under *Understand your energy use*, click *View Your Energy Use*
1. Scroll down and click the *Green Button* (Download my data)
1. Select *Export usage for a range of days* and *CSV* format
1. Expand the downloaded ZIP file
1. Open the CSV file in a text editor
1. *Delete the first five lines* including your account numbers ⚠️
1. Save the file
1. *Rename the file* to remove your account number ⚠️
1. Hover the *data* cell below
1. Click the <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke-width="2"><path d="M7.19855 2.52175L7.88131 1.79111L7.19855 2.52175ZM12.6 11.7764L13.2581 11.0234L12.6 11.7764ZM5.34191 6.76078L11.9419 12.5293L13.2581 11.0234L6.65809 5.2549L5.34191 6.76078ZM10.8958 13.6864L3.35462 6.63385L1.98852 8.09459L9.52965 15.1472L10.8958 13.6864ZM6.51578 3.25238L13.8172 10.0755L15.1828 8.61419L7.88131 1.79111L6.51578 3.25238ZM3.08395 3.55474C3.91017 2.45311 5.50967 2.31219 6.51578 3.25238L7.88131 1.79111C6.0058 0.0384695 3.02413 0.301162 1.48395 2.35474L3.08395 3.55474ZM3.35462 6.63385C2.49183 5.82695 2.37516 4.49978 3.08395 3.55474L1.48395 2.35474C0.162683 4.11642 0.380169 6.59044 1.98852 8.09459L3.35462 6.63385ZM11.993 13.6551C11.6977 13.9647 11.2082 13.9786 10.8958 13.6864L9.52965 15.1472C10.6432 16.1886 12.3878 16.1388 13.4402 15.0356L11.993 13.6551ZM11.9419 12.5293C12.2764 12.8216 12.2996 13.3337 11.993 13.6551L13.4402 15.0356C14.5328 13.8903 14.4499 12.0651 13.2581 11.0234L11.9419 12.5293Z" fill="currentColor"></path></svg> file icon
11. Click *Replace* and select your file`
```

```js echo
data = d3.csvParse(await FileAttachment("pge-electric-data.csv").text(), parseData)
```

```js echo
parseData = d => ({date: parseDate(`${d["DATE"]}T${d["START TIME"]}`), usage: +d["USAGE"]})
```

```js echo
parseDate = d3.timeParse("%Y-%m-%dT%H:%M")
```

```js echo
dateExtent = d3.extent(data, d => d.date)
```

```js echo
x = d3.scaleBand(d3.range(24), [margin.left, width - margin.right]).round(true)
```

```js echo
y = d3.scaleBand(d3.timeDays(...dateExtent), [margin.top, height - margin.bottom]).round(true)
```

```js echo
color = {
  let [min, max] = d3.extent(data, d => d.usage);
  if (min < 0) {
    max = Math.max(-min, max);
    return d3.scaleDiverging([-max, 0, max], t => d3.interpolateRdBu(1 - t));
  }
  return d3.scaleSequential([0, max], d3.interpolateReds);
}
```

```js echo
xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).tickFormat(formatHour))
    .call(g => g.select(".domain").remove())
```

```js echo
yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(formatDay))
    .call(g => g.select(".domain").remove())
```

```js echo
formatUsage = d3.format(".2f")
```

```js echo
formatDate = d3.timeFormat("%B %-d, %-I %p")
```

```js echo
formatDay = {
  const formatMonth = d3.timeFormat("%b %-d");
  const formatDate = d3.timeFormat("%-d");
  return d => (d.getDate() === 1 ? formatMonth : formatDate)(d);
}
```

```js echo
formatHour = {
  return d => d === 0 ? "12 AM" : d === 12 ? "12 PM" : (d % 12) + "";
}
```

```js echo
width = 954
```

```js echo
height = margin.top + margin.bottom + (d3.timeDay.count(...dateExtent) + 1) * 10
```

```js echo
margin = ({top: 70, right: 0, bottom: 0, left: 40})
```

```js echo
d3 = require("d3@6")
```

```js echo
import {legend} from "@d3/color-legend"
```
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Treemap</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Treemap

Introduced by [Ben Shneiderman](http://www.cs.umd.edu/hcil/treemap-history/), treemaps recursively partition space into rectangles according to each node’s associated value. D3 supports several treemap [tiling methods](https://d3js.org/d3-hierarchy/treemap#treemap-tiling). See also [nested](/@d3/nested-treemap), [zoomable](/@d3/zoomable-treemap) and [animated](/@d3/animated-treemap) treemaps, and the [bubble chart](/@d3/bubble-chart/2). If your data is flat, see the [treemap, CSV](https://observablehq.com/@d3/treemap-stratify) variant.

```js
viewof tile = Inputs.select(
  new Map([
    ["binary", d3.treemapBinary],
    ["squarify", d3.treemapSquarify],
    ["slice-dice", d3.treemapSliceDice],
    ["slice", d3.treemapSlice],
    ["dice", d3.treemapDice]
  ]),
  {label: "Tiling method", value: d3.treemapBinary}
)
```

```js
key = Swatches(chart.scales.color)
```

```js echo
chart = {
  // Specify the chart’s dimensions.
  const width = 1154;
  const height = 1154;

  // Specify the color scale.
  const color = d3.scaleOrdinal(data.children.map(d => d.name), d3.schemeTableau10);

  // Compute the layout.
  const root = d3.treemap()
    .tile(tile) // e.g., d3.treemapSquarify
    .size([width, height])
    .padding(1)
    .round(true)
  (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));

  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Add a cell for each leaf of the hierarchy.
  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  // Append a tooltip.
  const format = d3.format(",d");
  leaf.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

  // Append a color rectangle. 
  leaf.append("rect")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.6)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  // Append a clipPath to ensure text does not overflow.
  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  // Append multiline text. The last line shows the value and has a specific formatting.
  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  return Object.assign(svg.node(), {scales: {color}});
}
```

```js echo
data = FileAttachment("flare.json").json()
```

```js echo
import {Swatches} from "@d3/color-legend"
```
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Calendar</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Calendar

This chart shows daily changes of the Dow Jones Industrial Average from ${dji.at(0).Date.getUTCFullYear()} to ${dji.at(-1).Date.getUTCFullYear()}. Days the index went up are green, and down are pink. Data: [Yahoo Finance](https://finance.yahoo.com/quote/%5EDJI/history/)

```js
key = Legend(chart.scales.color, {title: "Daily change", tickFormat: "+%", marginLeft: 40})
```

```js echo
chart = {
  const width = 928; // width of the chart
  const cellSize = 17; // height of a day
  const height = cellSize * 7; // height of a week (5 days + padding)

  // Define formatting functions for the axes and tooltips.
  const formatValue = d3.format("+.2%");
  const formatClose = d3.format("$,.2f");
  const formatDate = d3.utcFormat("%x");
  const formatDay = i => "SMTWTFS"[i];
  const formatMonth = d3.utcFormat("%b");

  // Helpers to compute a day’s position in the week.
  const timeWeek = d3.utcMonday; 
  const countDay = i => (i + 6) % 7;

  // Compute the values used to color the cells: percent change is the difference between the day’s
  // closing value and the previous day’s, as a fraction of the latter.
  const data = d3.pairs(dji, ({Close: Previous}, {Date, Close}) => ({
    date: Date,
    value: (Close - Previous) / Previous,
    close: Close
  }));

  // Compute the extent of the value, ignore the outliers
  // and define a diverging and symmetric color scale.
  const max = d3.quantile(data, 0.9975, d => Math.abs(d.value));
  const color = d3.scaleSequential(d3.interpolatePiYG).domain([-max, +max]);

  // Group data by year, in reverse input order. (Since the dataset is chronological,
  // this will show years in reverse chronological order.)
  const years = d3.groups(data, d => d.date.getUTCFullYear()).reverse();

  // A function that draws a thin white line to the left of each month.
  function pathMonth(t) {
    const d = Math.max(0, Math.min(5, countDay(t.getUTCDay())));
    const w = timeWeek.count(d3.utcYear(t), t);
    return `${d === 0 ? `M${w * cellSize},0`
        : d === 5 ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${5 * cellSize}`;
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height * years.length)
      .attr("viewBox", [0, 0, width, height * years.length])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  const year = svg.selectAll("g")
    .data(years)
    .join("g")
      .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

  year.append("text")
      .attr("x", -5)
      .attr("y", -5)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text(([key]) => key);

  year.append("g")
      .attr("text-anchor", "end")
    .selectAll()
    .data(d3.range(1, 6))
    .join("text")
      .attr("x", -5)
      .attr("y", i => (countDay(i) + 0.5) * cellSize)
      .attr("dy", "0.31em")
      .text(formatDay);

  year.append("g")
    .selectAll()
    .data(([, values]) => values.filter(d => ![0, 6].includes(d.date.getUTCDay())))
    .join("rect")
      .attr("width", cellSize - 1)
      .attr("height", cellSize - 1)
      .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
      .attr("y", d => countDay(d.date.getUTCDay()) * cellSize + 0.5)
      .attr("fill", d => color(d.value))
    .append("title")
      .text(d => `${formatDate(d.date)}
${formatValue(d.value)}${d.close === undefined ? "" : `
${formatClose(d.close)}`}`);

  const month = year.append("g")
    .selectAll()
    .data(([, values]) => d3.utcMonths(d3.utcMonth(values[0].date), values.at(-1).date))
    .join("g");

  month.filter((d, i) => i).append("path")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("d", pathMonth);

  month.append("text")
      .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
      .attr("y", -5)
      .text(formatMonth);

  return Object.assign(svg.node(), {scales: {color}});
}
```

```js echo
dji = FileAttachment("^DJI.csv").csv({typed: true})
```

```js echo
import {Legend} from "@d3/color-legend"
```

Using [Observable Plot](https://observablehq.com/plot)’s concise API, you can create a [simple calendar](https://observablehq.com/@observablehq/plot-simplified-calendar) with the [cell mark](https://observablehq.com/plot/marks/cell) and yearly [facets](https://observablehq.com/plot/features/facets), as shown below. There is also a [fancy version](https://observablehq.com/@observablehq/plot-calendar).

```js echo
Plot.plot({
  padding: 0,
  x: {axis: null},
  y: {tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0},
  fy: {tickFormat: "", reverse: true},
  color: {scheme: "PiYG", legend: true, label: "Daily change", tickFormat: "+%", domain: [-0.06, 0.06]},
  marks: [
    Plot.cell(dji, {
      x: (d) => d3.utcWeek.count(d3.utcYear(d.Date), d.Date),
      y: (d) => d.Date.getUTCDay(),
      fy: (d) => d.Date.getUTCFullYear(),
      fill: (d, i) => i > 0 ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : NaN,
      title: (d, i) => i > 0 ? ((d.Close - dji[i - 1].Close) / dji[i - 1].Close * 100).toFixed(1) : NaN,
      inset: 0.5
    })
  ]
})
```
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
<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Contours</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Contours

Showing the [Goldstein–Price test function](https://en.wikipedia.org/wiki/Test_functions_for_optimization).

```js echo
value = (x, y) =>
  (1 + (x + y + 1) ** 2 * (19 - 14 * x + 3 * x ** 2 - 14 * y + 6 * x * y + 3 * y ** 2))
  * (30 + (2 * x - 3 * y) ** 2 * (18 - 32 * x + 12 * x * x + 48 * y - 36 * x * y + 27 * y ** 2))
```

```js
Legend(color, {title: "Value", tickFormat: ","})
```

```js echo
chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width + 28, height])
      .style("display", "block")
      .style("margin", "0 -14px")
      .style("width", "calc(100% + 28px)");

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(contours)
    .join("path")
      .attr("fill", d => color(d.value))
      .attr("d", d3.geoPath());

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}
```

```js echo
color = d3.scaleSequentialLog(d3.extent(thresholds), d3.interpolateMagma)
```

```js echo
thresholds = d3.range(1, 20).map(i => Math.pow(2, i))
```

```js echo
grid = {
  const q = 4; // The level of detail, e.g., sample every 4 pixels in x and y.
  const x0 = -q / 2, x1 = width + 28 + q;
  const y0 = -q / 2, y1 = height + q;
  const n = Math.ceil((x1 - x0) / q);
  const m = Math.ceil((y1 - y0) / q);
  const grid = new Array(n * m);
  for (let j = 0; j < m; ++j) {
    for (let i = 0; i < n; ++i) {
      grid[j * n + i] = value(x.invert(i * q + x0), y.invert(j * q + y0));
    }
  }
  grid.x = -q;
  grid.y = -q;
  grid.k = q;
  grid.n = n;
  grid.m = m;
  return grid;
}
```

```js echo
// Converts from grid coordinates (indexes) to screen coordinates (pixels).
transform = ({type, value, coordinates}) => {
  return {type, value, coordinates: coordinates.map(rings => {
    return rings.map(points => {
      return points.map(([x, y]) => ([
        grid.x + grid.k * x,
        grid.y + grid.k * y
      ]));
    });
  })};
}
```

```js echo
contours = d3.contours()
    .size([grid.n, grid.m])
    .thresholds(thresholds)
  (grid)
    .map(transform)
```

```js echo
x = d3.scaleLinear([-2, 2], [0, width + 28])
```

```js echo
y = d3.scaleLinear([-2, 1], [height, 0])
```

```js echo
xAxis = g => g
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisTop(x).ticks(width / height * 10))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => x.domain().includes(d)).remove())
```

```js echo
yAxis = g => g
    .attr("transform", "translate(-1,0)")
    .call(d3.axisRight(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick").filter(d => y.domain().includes(d)).remove())
```

```js echo
height = 600
```

```js echo
import {Legend} from "@d3/color-legend"
```

---
Using [Observable Plot](/plot/)’s built-in [contour mark](/plot/marks/contour), we can create the same chart in a few lines—or see the [complete example with custom axes](/@observablehq/plot-goldstein-price-contours). Explicit thresholds are necessary due to the skewed distribution of the value.

```js echo
Plot.plot({
  color: {scheme: "Magma", type: "log", legend: true, width: 300, label: "Value", tickFormat: ","},
  marks: [
    Plot.contour({
      x1: -2,
      x2: 2,
      y1: -2,
      y2: 1,
      fill: value,
      stroke: "#fff",
      strokeOpacity: 0.5,
      thresholds: d3.range(1, 20).map(n => 2 ** n)
    })
  ]
})
```
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
# ABB's Industrial Robot IRB 120


```html
<i><p>
  This Observable notebook demonstrates the control of a 3D model of the industrial robot IRB 120 . For those interested in CAD model integration using the JavaScript library <b>Three.js</b>, be sure to <a href="https://observablehq.com/@christophe-yamahata/embedding-3d-models-using-three-js?collection=@christophe-yamahata/3d-three-js">check out this other notebook</a>. Here, we take it a step further by offering full control of the robot's 6 axes via a web interface.
</p>
<p>
  Additionally, a <a href="#framework">Framework version</a> of this notebook
is available.
</p></i>
```

```js
{
    // See also: https://observablehq.com/@mbostock/fullscreen-canvas
      return htl.html`<button onclick=${({currentTarget}) => {
      const currentCell = currentTarget.parentElement;
      const zoomCell = currentCell.nextElementSibling;
      zoomCell.requestFullscreen ? zoomCell.requestFullscreen()
        : zoomCell.webkitRequestFullscreen ? zoomCell.webkitRequestFullscreen()
        : (() => { throw new Error("Fullscreen API not supported"); });
    }}>Full screen</button>`
}
```

```js
container = html`
  <div style="background-color:#fff; border: 1px solid #ccc; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; padding:15px; user-select: none;">
 
    <div style="display: flex; flex: 1; box-sizing: border-box;">
      <div style="flex: 1; box-sizing: border-box;">
        ${renderer.domElement}
      </div>
      <div style="margin-left: 40px; margin-right: 50px; display: flex; flex-direction: column; align-items: flex-start;">
        <div style="flex-grow: 1; margin-top: auto;">
          <br/>${viewof BKG_color}
          ${viewof Use_BKG_image}
          <br/>${viewof Grid_color}
          ${viewof opacity}
          ${viewof Display_grid}
          <br/>${viewof Metalness}
          ${viewof Roughness}
          ${viewof Environment_intensity}
          <br/>${viewof Model_color}
          ${viewof Wireframe}
          ${viewof UniformColor}
          ${viewof DisplayCubes}
          <hr/>
          ${viewof animation_loop}
          <div style="margin-left: 0px; margin-top: 10px;">
            ${(disabled == "disabled") ? htl.html`${viewof n}` : htl.html`${viewof position}`}
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-wrap: wrap; margin: 20px 0; justify-content: space-between; box-sizing: border-box;">
      <div style="flex: 1; min-width: 400px; max-width: 900px;  box-sizing: border-box; margin-right: 20px;">
        <form>
          <fieldset ${disabled_A} style="border: 1px solid ${(disabled_A == "disabled") ? `#ccc` : `#00f`}; padding: 10px;">
            <legend><b>Position A</b></legend>
            <div style="display: flex; flex-wrap: wrap;">
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px; margin-right:40px;">
                ${viewof theta_1_A}
                ${viewof theta_2_A}
                ${viewof theta_3_A}
              </div>
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px;">
                ${viewof theta_4_A}
                ${viewof theta_5_A}
                ${viewof theta_6_A}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div style="flex: 1; min-width: 400px; max-width: 900px; box-sizing: border-box; margin-left: 20px;">
        <form>
          <fieldset ${disabled_B} style="border: 1px solid ${(disabled_B == "disabled") ? `#ccc` : `#00f`}; padding: 10px;">
            <legend><b>Position B</b></legend>
            <div style="display: flex; flex-wrap: wrap;">
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px; margin-right:40px;">
                ${viewof theta_1_B}
                ${viewof theta_2_B}
                ${viewof theta_3_B}
              </div>
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px;">
                ${viewof theta_4_B}
                ${viewof theta_5_B}
                ${viewof theta_6_B}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
  `;
```

---
## About the IRB 120

```html
<p>
  The IRB 120 is a 6-degree-of-freedom (6-DOF) industrial robot developed by ABB. Its structure can be broken down into seven components: Six key blocks corresponding to the robot's joints, plus one end effector.
  <ol>
    <li><b>Base</b> (Joint 1, angle θ<sub>1</sub>)&mdash; The fixed part of the robot attached to a mounting surface (floor or ceiling). Joint 1 (J1) provides rotation around the vertical axis.</li> 
    <li><b>Lower Arm</b> (Joint 2, angle θ<sub>2</sub>)&mdash; Joint 2 (J2) allows the shoulder rotation of the lower arm, enabling forward and backward pitch movement.</li>
    <li><b>Upper Arm</b> (Joint 3, angle θ<sub>3</sub>)&mdash; Joint 3 (J3) allows the elbow rotation of the upper arm, providing up and down pitch movement.</li> 
    <li><b>Wrist Base</b> (Joint 4, angle θ<sub>4</sub>)&mdash; This component connects the upper arm to the wrist. Joint 4 (J4) enables the roll movement of the wrist around the arm's axis (<i>wrist pitch</i>).</li> 
    <li><b>Wrist Middle</b> (Joint 5, angle θ<sub>5</sub>)&mdash; Joint 5 (J5) allows the wrist to bend up and down (<i>wrist yaw</i>).</li>
    <li><b>Wrist End</b> (Joint 6, angle θ<sub>6</sub>)&mdash; Joint 6 (J6) allows the end effector to rotate around the wrist's axis (<i>wrist roll</i>).</li>
    <li><b>End Effector</b> &mdash; Attached to the wrist end, the end effector interacts with objects. It can be a gripper or any custom-specific tool.</li>
  </ol>
The arm joints (J1-J3) are responsible for the positioning of the tool, while the wrist joints (J4-J6) control its orientation.
</p>
<p>
  The 3D model embedeed in this notebook consists of seven separate files extracted from a CAD model downloaded from <a href="https://www.traceparts.com/en/product/abb-robotics-abbs-6-axis-robot-irb-120306?CatalogPath=TRACEPARTS%3ATP02001006003&Product=90-25022021-051339&PartNumber=IRB%20120-3%2F0.6" target="_blank">TraceParts</a>. The glTF file format is used here as it is convenient for use with the 3D visualization library <a href="https://observablehq.com/@christophe-yamahata/embedding-3d-models-using-three-js?collection=@christophe-yamahata/3d-three-js"><i>Three.js</i></a>.
</p>
```

---
## Forward kinematics

```html
<p>
  In robotics and computer animation, <a href="https://en.wikipedia.org/wiki/Forward_kinematics" target="_blank">forward kinematics</a> is used to determine the position and orientation of an end effector based on the joint angles of a mechanism. For this example, we calculate the positions and orientations of two reference cubes using six input angles (θ<sub>1</sub> to θ<sub>6</sub>) for each cube. The dimensions of the robot, as provided by the manufacturer (see <a href="#dimensions">illustration below</a>), are used in these calculations.
</p>
<p>
  The transformation matrices for the first three joints are defined as follows:
</p>
```

```js
tex`
    \qquad 
    T_{01}(\theta_1) = \begin{bmatrix}
          \cos(\theta_1) & -sin(\theta_1) & 0 & 0 \\
          \sin(\theta_1) & cos(\theta_1) & 0 & 0 \\
          0 & 0 & 1 & 0 \\
          0 & 0 & 0 & 1 \\
    \end{bmatrix} \qquad
    T_{12}(\theta_2) = \begin{bmatrix}
          1 & 0 & 0 & 0 \\
          0 & \cos(\theta_2) & -sin(\theta_2) & 0 \\
          0 & \sin(\theta_2) & cos(\theta_2)  & L_{1} \\
          0 & 0 & 0 & 1 \\
    \end{bmatrix} \qquad
    T_{23}(\theta_3) = \begin{bmatrix}
          1 & 0 & 0 & 0 \\
          0 & \cos(\theta_3) & -sin(\theta_3) & 0 \\
          0 & \sin(\theta_3) & cos(\theta_3)  & L_{2} \\
          0 & 0 & 0 & 1 \\
    \end{bmatrix} \\
    \quad \\
    \qquad \textrm{where } L_{1} = {\bf ${(pivotOffset_1/mm_to_inch).toFixed(0)}} \textrm{ mm is the vertical distance from the robot base to Joint 2 (J2).} \\
    \qquad \textrm{and } \;\;\;\, L_{2} = {\bf ${((pivotOffset_2 - pivotOffset_1)/mm_to_inch).toFixed(0)}} \textrm{ mm is the distance between Joint 2 (J2) and Joint 3 (J3).}
`
```

```html
<p>
  The transformation matrix ${tex`T_{01}`} represents the rotation around the vertical axis at Joint 1 (J1). 
  <br/>${tex`T_{12}`} represents the rotation around Joint 2 (J2) offset by ${tex`L_1`}.
  <br/>${tex`T_{23}`} represents the rotation around Joint 3 (J3) offset by ${tex`L_2`}.
</p>
<p>
  Given the IRB&nbsp;120 robot's 6 degrees of freedom (DOF), the complete transformation matrix ${tex`T_{06}`} is computed from the product of six individual transformation matrices:
  <br/>${tex`\qquad T_{06} = T_{01}T_{12}T_{23}T_{34}T_{45}T_{56}`}
</p>
```

```html
<p>
  Here are the results for the current positions <b>A</b> and <b>B</b>: 
</p>
```

```js
tex`
    \qquad 
    T_{06}^{A} = \begin{bmatrix}
          ${T06_A[0][0].toFixed(3)} &  ${T06_A[0][1].toFixed(3)}  &  ${T06_A[0][2].toFixed(3)}  &  {\bf ${(T06_A[0][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_A[1][0].toFixed(3)} &  ${T06_A[1][1].toFixed(3)}  &  ${T06_A[1][2].toFixed(3)}  &  {\bf ${(T06_A[1][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_A[2][0].toFixed(3)} &  ${T06_A[2][1].toFixed(3)}  &  ${T06_A[2][2].toFixed(3)}  &  {\bf ${(T06_A[2][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_A[3][0].toFixed(0)} &  ${T06_A[3][1].toFixed(0)}  &  ${T06_A[3][2].toFixed(0)}  &  ${T06_A[3][3].toFixed(0)}  \\
    \end{bmatrix} \qquad \Rightarrow \quad  x_A = {\bf ${(T06_A[0][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            y_A = {\bf ${(T06_A[1][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            z_A = {\bf ${(T06_A[2][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
`
```

```js
tex`
    \qquad 
    T_{06}^{B} = \begin{bmatrix}
          ${T06_B[0][0].toFixed(3)} &  ${T06_B[0][1].toFixed(3)}  &  ${T06_B[0][2].toFixed(3)}  &  {\bf ${(T06_B[0][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_B[1][0].toFixed(3)} &  ${T06_B[1][1].toFixed(3)}  &  ${T06_B[1][2].toFixed(3)}  &  {\bf ${(T06_B[1][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_B[2][0].toFixed(3)} &  ${T06_B[2][1].toFixed(3)}  &  ${T06_B[2][2].toFixed(3)}  &  {\bf ${(T06_B[2][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_B[3][0].toFixed(0)} &  ${T06_B[3][1].toFixed(0)}  &  ${T06_B[3][2].toFixed(0)}  &  ${T06_B[3][3].toFixed(0)}  \\
    \end{bmatrix} \qquad \Rightarrow \quad  x_B = {\bf ${(T06_B[0][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            y_B = {\bf ${(T06_B[1][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            z_B = {\bf ${(T06_B[2][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
`
```

```html
<p>
  These coordinates are to be compared with the dimensional drawing. For example, at rest position (all angles set to 0°), you will find out that the cube is in the following position along the <i>y</i> axis:
  <br/>${tex`\qquad y_{0} = `}  (${(Math.abs(pivotOffset_5)/mm_to_inch).toFixed(0)} 
                              + ${((Math.abs(pivotOffset_7) - Math.abs(pivotOffset_5))/mm_to_inch - cube_offset).toFixed(0)}) + ${cube_offset}
                              = ${(Math.abs(pivotOffset_7)/mm_to_inch - cube_offset).toFixed(0)} + ${cube_offset}
                              = ${(Math.abs(pivotOffset_7) /mm_to_inch).toFixed(1)} mm</b>, 
  <br/> &nbsp; &nbsp; &nbsp; &nbsp; <i>i.e.</i>, the position of the end effector, plus an offset of ${cube_offset} mm.
</p>
```

```js
dimensions = md`
---
## Dimensional drawing
`
```

```html
<p>
  The 2D drawing provides useful dimensions (in mm) necessary for the proper animation of the IRB 120 using <i>Three.js</i>.
  The base part is positioned at the origin of our scene. In the 3D model, the IRB 120 is in its rest position with the components assembled as depicted in the drawing. Therefore, the following offsets of the rotation axes need to be accounted for:
  
  <ul>
    <li>Joint 2 (J2): Vertically offset by <b>${(pivotOffset_1/mm_to_inch).toFixed(0)} mm</b>.</li>
    <li>Joint 3 (J3): Vertically offset by <b>${(pivotOffset_2/mm_to_inch).toFixed(0)} mm</b> (${(pivotOffset_1/mm_to_inch).toFixed(0)} mm + ${((pivotOffset_2-pivotOffset_1)/mm_to_inch).toFixed(0)} mm).</li>
    <li>Joint 4 (J4): Vertically offset by <b>${(pivotOffset_3/mm_to_inch).toFixed(0)} mm</b> (${(pivotOffset_1/mm_to_inch).toFixed(0)} mm + ${((pivotOffset_2-pivotOffset_1)/mm_to_inch).toFixed(0)} mm + ${((pivotOffset_3-pivotOffset_2)/mm_to_inch).toFixed(0)} mm).</li>
    <li>For Joint 5 (J5), we must consider two offsets:
        <ul>
          <li>A vertical offset of <b>${(pivotOffset_4/mm_to_inch).toFixed(0)} mm</b> (same as J4).</li>
          <li>A horizontal offset of <b>${(Math.abs(pivotOffset_5)/mm_to_inch).toFixed(0)} mm</b>.</li>
        </ul>
    </li>
    <li>To rotate the end effector, we need to account for the vertical offset of Joint 6 (J6), which is <b>${(pivotOffset_6/mm_to_inch).toFixed(0)} mm</b> (same as J4).</li>
  </ul>
</p>
```

```html
<figure>
  <img src="${await FileAttachment("IRB_120_Dimensional_drawing.png").url()}" style="border: 1px solid #a0a0a0; width: 545px">
  <figcaption>Dimensional drawing of the IRB 120. The values are given in millimeters (mm).</figcaption>
</figure>
```

```js
framework = md`
---
## Observable Framework
`
```

```html
<p>
Converting this notebook into a framework presented a few subtleties that needed to be overcome, but the final result is quite similar. As a teaser, the following thumbnail links to a video demonstrating the deployment of this computer graphics animation using the Observable Framework.
<ul>
  <li><a href="https://christophe-yamahata.observablehq.cloud/irb120-animated-with-three-js/" target="_blank">Link the the Framework</a> (Observablehq.cloud)</li>
  <li><a href="https://youtu.be/imaOQ4znJmI" target="_blank">Link to the video</a> (YouTube.com)</li>
</ul>
</p>
```

```html
<figure>
  <a href="https://youtu.be/imaOQ4znJmI" target="_blank"><img src="${await FileAttachment("illustration_YouTube_IRB120.png").url()}" style="border: 1px solid #a0a0a0; width: 650px;"></a>
  <figcaption><b>Observable Framework</b> &ndash;  IRB 120 Industrial Robot: Animation using Three.js and Observable Framework</figcaption>
</figure>
```

---
## Appendices

### Scene in *Three.js*

```js
aspect_ratio = 1.42
```

```js
environmentMap = FileAttachment("a1e09630d937af8a4ad169486c4af5932b4653d5.jpg").url()
```

```js
metaRoughnessTexture = FileAttachment("metal_roughness_texture.jpg").url()
```

```js
textureBackground = FileAttachment("texture_background.PNG").url()
```

```js
THREE = {
  // Import threejs
  const three = await require("three@0.139.2");
  window.THREE = three;

  // Import plugins
  await require("three@0.139.2/examples/js/controls/OrbitControls.js").catch((e) => { console.warn(e) });
  await require("three@0.139.2/examples/js/loaders/GLTFLoader").catch((e) => { console.warn(e) });

  console.log(three);
  return three;
}
```

```js
// Define paths object: 7 sub-assemblies for the industrial robot IRB 120 
paths = (async () => {
  const base = await FileAttachment("base@2.glb").url();
  const lowerArm = await (FileAttachment("lowerArm@4.glb").url());
  const upperArm = await (FileAttachment("upperArm@2.glb").url());
  const wristBase = await FileAttachment("wristBase@5.glb").url();
  const wristMiddle = await FileAttachment("wristMiddle@1.glb").url();
  const wristEnd = await FileAttachment("wristEnd@1.glb").url();
  const endEffector = await FileAttachment("endEffector@3.glb").url();

  return {
    base,
    lowerArm,
    upperArm,
    wristBase,
    wristMiddle,
    wristEnd,
    endEffector
  };
})();
  
```

```js
// Define two cubes
cubes = (async () => {
  const cubeA = await FileAttachment("Cube_xyz@2.glb").url();
  const cubeB = await (FileAttachment("Cube_xyz@2.glb").url());

  return {
    cubeA,
    cubeB
  };
})();
```

```js
// Create renderer
renderer = {
  
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width-450, (width-450)/aspect_ratio);
  renderer.setPixelRatio(devicePixelRatio);

  // Initial controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 15, 0); // Adjust the target position for panning

  // Set the maximum zoom levels
  controls.minDistance = 10;
  controls.maxDistance = 100;

  // Manually trigger an update of OrbitControls
  controls.update();
  
  return renderer;
}
```

```js
// Create camera
camera = {
  const fov = 30;
  const near = 1;
  const far = 500;
  const camera = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);

  camera.position.set(-70, 5, -10);

  return camera;
}

```

```js
scene = {
  // Initialize the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BKG_color);

  if (!renderer) {
    let renderer = new THREE.WebGLRenderer();
  }

  // Initialize lights
  const point = new THREE.PointLight(0xcccccc);
  point.position.set(-50, 500, -100);
  scene.add(point);
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  
  // Grid
  const gridHelper = new THREE.GridHelper(200, 50, Grid_color, Grid_color);
  if(Display_grid) {    
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = opacity;
    scene.add(gridHelper);
    // const axesHelper = new THREE.AxesHelper( 15 );
    // scene.add( axesHelper );
  }

  // load a backround image
  if(Use_BKG_image) {
    const textureBKG = new THREE.TextureLoader().load(await textureBackground);
    scene.background = textureBKG;    
  }
  
  // Load the environment map
  const loadEnvironmentMap = (url) => {
    return new Promise((resolve, reject) => {
      mapLoader.load(url, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      }, undefined, reject);
    });
  };
  const mapLoader = new THREE.TextureLoader();
  const envMap = await loadEnvironmentMap(await environmentMap);

  // Load the roughness texture for the 3D model
  const loadRoughnessTexture = (url) => {
    return new Promise((resolve, reject) => {
      textureLoader.load(url, (texture) => {
        // Scale and repeat the roughness texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 3); // Adjust these values to control the repetition
        resolve(texture);
      }, undefined, reject);
    });
  };
  const textureLoader = new THREE.TextureLoader();
  const roughnessTexture = await loadRoughnessTexture(await metaRoughnessTexture);
  
  // Loaders (glTF format)
  const loader = new THREE.GLTFLoader();

  // Load model function
  async function loadModel(modelPath) {
    return new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  function applyCubeTransformation(H, cube) {
    // Convert the 2D array to a 1D array in column-major order
    if (H && H.length === 4 && H[0].length === 4) {
        // Apply transformations based on the provided logic
        const matrixArray = [
            H[0][0], H[1][0], H[2][0], H[3][0],
            H[0][1], H[1][1], H[2][1], H[3][1],
            H[0][2], H[1][2], H[2][2], H[3][2],
            H[0][3], H[1][3], H[2][3], H[3][3]
        ];

      // Create a Matrix4 object and set its elements
      const originalMatrix = new THREE.Matrix4();
      originalMatrix.fromArray(matrixArray);
  
      // Define the axis swap transformation matrix
      // This transformation is needed because the transformation matrix used a reference coordinate different from that used in three.js
      const axisSwapMatrixArray = [
          0,  0, -1,  0,
         -1,  0,  0,  0,
          0,  1,  0,  0,
          0,  0,  0,  1
      ];
  
      const axisSwapMatrix = new THREE.Matrix4();
      axisSwapMatrix.fromArray(axisSwapMatrixArray);
  
      const transformedMatrix = new THREE.Matrix4();
      transformedMatrix.multiplyMatrices(axisSwapMatrix, originalMatrix);
  
      cube.applyMatrix4(transformedMatrix);
  
      // Extract the translation components from the transformed matrix
      const translationX = transformedMatrix.elements[12];  // Translation along x-axis
      const translationY = transformedMatrix.elements[13];  // Translation along y-axis
      const translationZ = transformedMatrix.elements[14];  // Translation along z-axis
  
      // Apply the translation to the cube's position
      cube.position.set(translationX, translationY, translationZ);
  
      // Extract the rotation components and convert to Euler angles
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.extractRotation(transformedMatrix);
  
      const euler = new THREE.Euler();
      euler.setFromRotationMatrix(rotationMatrix);
  
      // Apply the rotation to the cube's rotation
      cube.rotation.x = euler.x;
      cube.rotation.y = euler.y;
      cube.rotation.z = euler.z;
    } else {
          console.error('Transformation matrix H is invalid:', H);
    }
  }
        
  
  // Define variables to store loaded models and groups
  let baseModel, lowerArmGroup, lowerArmModel, upperArmGroup, upperArmModel, wristBaseGroup, wristBaseModel, 
      wristMiddleGroup, wristMiddleModel, wristEndGroup, wristEndModel, endEffectorGroup, endEffectorModel;
  let cubeA, cubeB;
  
  let modelsLoaded = false;
  
  // Function to load all robot parts and set up hierarchy
  const loadRobotModels = async () => {
    try {      
      // Load models if not already loaded
      if (!modelsLoaded) {
        // Load models
          const models = await Promise.all([
            loadModel(paths.base),
            loadModel(paths.lowerArm),
            loadModel(paths.upperArm),
            loadModel(paths.wristBase),
            loadModel(paths.wristMiddle),
            loadModel(paths.wristEnd),
            loadModel(paths.endEffector),
            loadModel(cubes.cubeA),
            loadModel(cubes.cubeB)
          ]);
  
        // Destructure loaded models
        [baseModel, lowerArmModel, upperArmModel, wristBaseModel, wristMiddleModel, wristEndModel, endEffectorModel, 
         cubeA, cubeB] = models;

        // Add cubes to the scene
        if(DisplayCubes) {  
          scene.add(cubeA);
          scene.add(cubeB);
        }

        // Create groups for hierarchical pivoting
        lowerArmGroup = new THREE.Group();
        lowerArmGroup.add(lowerArmModel);
        upperArmGroup = new THREE.Group();
        wristBaseGroup = new THREE.Group();
        wristMiddleGroup = new THREE.Group();
        wristEndGroup = new THREE.Group();
        endEffectorGroup = new THREE.Group();
        
        // Set up hierarchy according to robot's structure
        baseModel.add(lowerArmGroup);
        lowerArmGroup.add(upperArmGroup);
        upperArmGroup.add(upperArmModel);
  
        upperArmModel.add(wristBaseGroup);
        wristBaseGroup.add(wristBaseModel);
        wristBaseModel.add(wristMiddleGroup);
        wristMiddleGroup.add(wristMiddleModel);
        wristMiddleModel.add(wristEndGroup);
        wristEndGroup.add(wristEndModel);
        wristEndModel.add(endEffectorGroup);
        endEffectorGroup.add(endEffectorModel);
  
        // Add base to the scene
        scene.add(baseModel);
        
        baseModel.traverse(function (child) {
          if (child.isMesh) {
            if(Wireframe){
              if(UniformColor) {
                child.material.color.setStyle(Model_color);
              }
              child.material.wireframe = true;
              child.material.transparent = true;
              child.material.opacity = 0.1;
            } else {              
              child.material.wireframe = false;
              child.material.opacity = 1;
              if(UniformColor) {
                child.material.color.setStyle(Model_color);
              }
              child.material.transparent = true;
              child.material.roughness = Roughness; 
              child.material.metalness = Metalness;
              child.material.roughnessMap = roughnessTexture; // Apply the roughness texture
              if(Environment_intensity>0) {
                child.material.envMap = envMap; // Assign Equirectangular environment map
                child.material.envMapIntensity = Environment_intensity; // Intensity of environment map reflection
                child.material.reflectivity = 1 - Roughness; // Reflectivity (0 to 1)              
              }
            } 
          }
        });
        
       // Set modelsLoaded to true to indicate that models have been loaded
        modelsLoaded = true;
      }
    } catch (error) {
      console.error('An error occurred while loading the robot models:', error);
    }
  };
    
  // Function to apply transformations based on angles and pivot offsets
  const applyTransformations = () => {
    if (modelsLoaded) {
      
        // Apply the transformation to the cubes
        applyCubeTransformation(T06_A, cubeA);
        applyCubeTransformation(T06_B, cubeB);
      
        // Rotate lower arm group
        lowerArmGroup.rotation.y = THREE.MathUtils.degToRad(theta_1);
  
        // Rotate upper arm group
        upperArmGroup.position.y = pivotOffset_1;
        upperArmGroup.rotation.z = THREE.MathUtils.degToRad(theta_2);
        upperArmModel.position.y = -pivotOffset_1;
  
        // Rotate wrist base group
        wristBaseGroup.position.y = pivotOffset_2;
        wristBaseGroup.rotation.z = THREE.MathUtils.degToRad(theta_3);
        wristBaseModel.position.y = -pivotOffset_2;
  
        // Rotate wrist middle group
        wristMiddleGroup.position.y = pivotOffset_3;
        wristMiddleGroup.rotation.x = THREE.MathUtils.degToRad(theta_4);
        wristMiddleModel.position.y = -pivotOffset_3;
  
        // Rotate wrist end group     
        wristEndGroup.position.y = pivotOffset_4;
        wristEndGroup.position.x = pivotOffset_5;
        wristEndGroup.rotation.z = THREE.MathUtils.degToRad(theta_5);
        wristEndModel.position.y = -pivotOffset_4;
        wristEndModel.position.x = -pivotOffset_5;
  
        // Rotate end effector group
        endEffectorGroup.position.y = pivotOffset_6;
        endEffectorGroup.rotation.x = THREE.MathUtils.degToRad(theta_6);
        endEffectorModel.position.y = -pivotOffset_6;

    }
  };

  var theta_1 = position == "A"? theta_1_A: theta_1_B;    
  var theta_2 = position == "A"? theta_2_A: theta_2_B;
  var theta_3 = position == "A"? theta_3_A: theta_3_B;
  var theta_4 = position == "A"? theta_4_A: theta_4_B; 
  var theta_5 = position == "A"? theta_5_A: theta_5_B;
  var theta_6 = position == "A"? theta_6_A: theta_6_B;


  // Function to update theta with smooth behavior
  function updateTheta(theta_A, theta_B) {
      let progress = step / n;
      let phase = (progress < 0.5) ? 2 * progress : 2 * (1 - progress);
      let easingValue = 3 * Math.pow(phase,2) - 2 * Math.pow(phase,3);
      let theta = theta_A + (theta_B - theta_A) * easingValue;
      return theta;
  }

  // Animation
  let step = 0; // Initialize step
  const animate = () => { 
    if(animation_loop) {
      requestAnimationFrame(animate);      
      theta_1 = updateTheta(theta_1_A,theta_1_B);
      theta_2 = updateTheta(theta_2_A,theta_2_B);
      theta_3 = updateTheta(theta_3_A,theta_3_B);
      theta_4 = updateTheta(theta_4_A,theta_4_B);      
      theta_5 = updateTheta(theta_5_A,theta_5_B);
      theta_6 = updateTheta(theta_6_A,theta_6_B);

      // Update step
      (step > n) ? step = 0 : step += 1; // Reset step after one complete cycle
    }     
    applyTransformations();
  };

  // Load all models initially and start animation loop
  loadRobotModels().then(() => { 
    animate();
    renderer.render(scene, camera);
  });

  // Return the scene object
  return scene;
};
```

```js echo
{
  while (true) {
    renderer.render(scene, camera);
    yield null;
  } 
}
```

### Model parameters

```js
mm_to_inch = 0.0393701
```

```js
cube_offset = 8
```

```js
pivotOffset_1 = 290*mm_to_inch
```

```js
pivotOffset_2 = pivotOffset_1 + 270*mm_to_inch
```

```js
pivotOffset_3 = pivotOffset_2 + 70*mm_to_inch
```

```js
pivotOffset_4 = pivotOffset_3
```

```js
pivotOffset_5 = -302*mm_to_inch
```

```js
pivotOffset_6 = pivotOffset_3
```

```js
// Cube defined from its center. It must positioned with an offset
pivotOffset_7 = -(374 + cube_offset) * mm_to_inch
```

---
### User interface

```js
disabled = animation_loop ? "disabled":"";
```

```js
disabled_A= animation_loop || position == "B" ? "disabled":""
```

```js echo
disabled_B= animation_loop || position == "A" ? "disabled":""
```

```js echo
viewof BKG_color = Inputs.color({label: "Background color", value: "#555b62"})
```

```js echo
viewof Use_BKG_image = Inputs.toggle({label: "Use a texture background", value: true})
```

```js echo
viewof Metalness = Inputs.range([0, 1], {value: 0.6, step: 0.1, label: "Material metalness"})
```

```js echo
viewof Roughness = Inputs.range([0, 1], {value: 0.9, step: 0.05, label: "Material roughness"})
```

```js echo
viewof Environment_intensity = Inputs.range([0, 1], {value: 0.5, step: 0.1, label: "Environment intensity"})
```

```js echo
viewof Model_color = Inputs.color({label: "Wireframe color / uniform color", value: "#b9cdd4"})
```

```js echo
viewof Wireframe = Inputs.toggle({label: "3D model as wireframe", value: false})
```

```js echo
viewof DisplayCubes = Inputs.toggle({label: htl.html`Display cubes <br/>in <b>A</b> and <b>B</b>`, value: true})
```

```js echo
viewof UniformColor = Inputs.toggle({label: "Uniform color", value: false})
```

```js echo
viewof Grid_color = Inputs.color({label: "Grid color", value: "#d53040"})
```

```js echo
viewof opacity = Inputs.range([0, 1], {value: 0.6, step: 0.1, label: "Grid opacity"})
```

```js echo
viewof Display_grid = Inputs.toggle({label: "Grid display", value: true})
```

```js echo
viewof n = Inputs.radio(new Map([["Very sow", 1000], ["Slow", 500], ["Medium", 200], ["Fast", 100], ["Very fast", 40]]), {value: 100, label: "Animation speed:"})
```

```js echo
viewof animation_loop = Inputs.toggle({label: htl.html`Looped animation? <i>(uncheck to modify values for <b>A</b> and <b>B</b>)</i>`, value: true})
```

```js echo
viewof position = Inputs.radio(["A", "B"], {label: "Active position:", value: "A"})
```

```js echo
viewof theta_1_A = Inputs.range([-165, 165], {value: -50, step: 5, label: htl.html`Rotation θ<sub>1</sub>`})
```

```js echo
viewof theta_1_B = Inputs.range([-165, 165], {value: 35, step: 5, label: htl.html`Rotation θ<sub>1</sub>`})
```

```js echo
viewof theta_2_A = Inputs.range([-110, 110], {value: 60, step: 5, label: htl.html`Rotation θ<sub>2</sub>`})
```

```js echo
viewof theta_2_B = Inputs.range([-110, 110], {value: 35, step: 5, label: htl.html`Rotation θ<sub>2</sub>`})
```

```js echo
viewof theta_3_A = Inputs.range([-110, 70], {value: -15, step: 5, label: htl.html`Rotation θ<sub>3</sub>`})
```

```js echo
viewof theta_3_B = Inputs.range([-110, 70], {value: 5, step: 5, label: htl.html`Rotation θ<sub>3</sub>`})
```

```js echo
viewof theta_4_A = Inputs.range([-160, 160], {value: 0, step: 5, label: htl.html`Rotation θ<sub>4</sub>`})
```

```js echo
viewof theta_4_B = Inputs.range([-160, 160], {value: -55, step: 5, label: htl.html`Rotation θ<sub>4</sub>`})
```

```js echo
viewof theta_5_A = Inputs.range([-120, 120], {value: 45, step: 5, label: htl.html`Rotation θ<sub>5</sub>`})
```

```js echo
viewof theta_5_B = Inputs.range([-120, 120], {value: 80, step: 5, label: htl.html`Rotation θ<sub>5</sub>`})
```

```js echo
viewof theta_6_A = Inputs.range([-400, 400], {value: 50, step: 5, label: htl.html`Rotation θ<sub>6</sub>`})
```

```js echo
viewof theta_6_B = Inputs.range([-400, 400], {value: 200, step: 5, label: htl.html`Rotation θ<sub>6</sub>`})
```

---
### Forward kinematics 
#### (positioning the cubes in *A* and *B*)

```js
// Function to multiply two 4x4 matrices
// M = M1.M2
function multiplyMatrices4x4(M1, M2) {
    // Initialize a 4x4 result matrix with zeros
    const M = Array.from({ length: 4 }, () => Array(4).fill(0));

    // Perform matrix multiplication
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                M[i][j] += M1[i][k] * M2[k][j];
            }
        }
    }

    return M;
}
```

```js
// Function to create the transformation matrix T01(theta)
function T01(theta) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T01(theta)
    const T = [
        [cosTheta, -sinTheta, 0, 0],
        [sinTheta, cosTheta, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    return T;
}

```

```js
// Function to create the transformation matrix T12(theta)
T12 = function(theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T12(theta)
    const T = [
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, 0],
        [0, sinTheta, cosTheta, pivotOffset],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T23(theta)
function T23(theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T23(theta)
    const T = [
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, 0],
        [0, sinTheta, cosTheta, pivotOffset],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T34(theta)
T34 = function (theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T34(theta)
    const T = [
        [cosTheta, 0, sinTheta, 0],
        [0, 1, 0, 0],
        [-sinTheta, 0, cosTheta, pivotOffset],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T45(theta)
T45 = function (theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T45(theta)
    const T = [
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, pivotOffset],
        [0, sinTheta, cosTheta, 0],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T56(theta)
T56 = function (theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T56(theta)
    const T = [
        [cosTheta, 0, sinTheta, 0],
        [0, 1, 0, pivotOffset],
        [-sinTheta, 0, cosTheta, 0],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
T01_A = T01(theta_1_A)
```

```js
T01_B = T01(theta_1_B)
```

```js
T12_A = T12(-theta_2_A, pivotOffset_1)
```

```js
T12_B = T12(-theta_2_B, pivotOffset_1)
```

```js
T23_A = T23(-theta_3_A, pivotOffset_2 - pivotOffset_1);
```

```js
T23_B = T23(-theta_3_B, pivotOffset_2 - pivotOffset_1);
```

```js
T34_A = T34(-theta_4_A, pivotOffset_3 - pivotOffset_2);
```

```js
T34_B = T34(-theta_4_B, pivotOffset_3 - pivotOffset_2);
```

```js
T45_A = T45(-theta_5_A, -pivotOffset_5);
```

```js
T45_B = T45(-theta_5_B, -pivotOffset_5);
```

```js
T56_A = T56(-theta_6_A, -pivotOffset_7 + pivotOffset_5);
```

```js
T56_B = T56(-theta_6_B, -pivotOffset_7 + pivotOffset_5);
```

```js
T02_A = multiplyMatrices4x4(T01_A,T12_A)
```

```js
T02_B = multiplyMatrices4x4(T01_B,T12_B)
```

```js
T03_A = multiplyMatrices4x4(T02_A,T23_A)
```

```js
T03_B = multiplyMatrices4x4(T02_B,T23_B)
```

```js
T04_A = multiplyMatrices4x4(T03_A,T34_A)
```

```js
T04_B = multiplyMatrices4x4(T03_B,T34_B)
```

```js
T05_A = multiplyMatrices4x4(T04_A,T45_A)
```

```js
T05_B = multiplyMatrices4x4(T04_B,T45_B)
```

```js
T06_A = multiplyMatrices4x4(T05_A,T56_A)
```

```js
T06_B = multiplyMatrices4x4(T05_B,T56_B)
```
