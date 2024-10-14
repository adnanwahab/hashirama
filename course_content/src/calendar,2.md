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
