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
