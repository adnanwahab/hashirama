```js
md`# Dimensionality Reduction drawings`
```

```js
md`UMAP and t-SNE are iterative dimensionality reduction methods. The picture gets drawn by drawing the voronoi cells of the intermediate results above each other with some opacity.`
```

```js
{
  const m = 5;
  const context = DOM.context2d(width, height, 1);
  context.canvas.style.maxWidth = "100%";
  context.globalAlpha = globalAlpha;
  let dr;
  if (drMethod == "UMAP") {
    dr = new druid.UMAP(data.values, 15, 1, 1, 2, druid.euclidean, seed);
  } else if (drMethod == "TSNE") {
    dr = new druid.TSNE(data.values, 50, 5, 2, druid.euclidean, seed);
  } else if (drMethod == "SAMMON") {
    dr = new druid.SAMMON(data.values, 0.1, 2, druid.euclidean, seed);
  }

  const c = d3.scaleSequential(d3[colorscale]).domain([0, data.values.length]);

  for (const Y of dr.generator()) {
    if (clear_in_between) context.clearRect(0, 0, width, height);
    const x = d3
      .scaleLinear()
      .domain(d3.extent(Y, (d) => d[0]))
      .range([m, width - m]);
    const y = d3
      .scaleLinear()
      .domain(d3.extent(Y, (d) => d[1]))
      .range([m, height - m]);
    const delaunay = Delaunay.Delaunay.from(
      Y,
      (d) => x(d[0]),
      (d) => y(d[1])
    );
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    for (let i = 0; i < data.values.length; ++i) {
      console.log(i);
      let color = d3.color(c(i));
      color.opacity = cellOpacity;
      context.beginPath();
      context.fillStyle = color;
      voronoi.renderCell(i, context);
      context.fill();
      if (drawStroke) {
        let strokeStyle = customColor ? d3.rgb(strokeColor) : color.copy();
        strokeStyle.opacity = strokeOpacity;
        context.strokeStyle = strokeStyle;
        context.stroke();
      }
      if (drawPoints) {
        context.fillStyle = clear_in_between
          ? c(i)
          : color[drawPointsDarker](colorPointsStrength);
        context.beginPath();
        context.arc(x(Y[i][0]), y(Y[i][1]), pointRadius, 0, Math.PI * 2);
        context.fill();
      }
    }
    yield context.canvas;
  }

  return context.canvas;
}
```

```js
viewof dataset = Select(
  [
    "FMNIST",
    "IRIS",
    "MAMMOTH",
    "MNIST",
    "SSHAPE",
    "SWISSROLL",
    "WAVES",
    "BLOBS"
  ],
  { value: "IRIS", label: "Dataset" }
)
```

```js
viewof drMethod = Select(["UMAP", "TSNE", "SAMMON"], {
  value: "UMAP",
  label: "Dimensionality Reduction Method"
})
```

```js
viewof seed = Text({
  label: "Seed",
  placeholder: "Enter a seed",
  value: 0,
  type: "number"
})
```

```js
viewof colorscale = Select(colorscales, {value: "interpolateInferno", label: "Colorscale"})
```

```js
md`#### Voronoi Cells`
```

```js
viewof cellOpacity = Range([0.001, 1], {step:0.001, value: 0.015, label: "Cell opacity"})
```

```js
viewof drawStroke = Toggle({label: "Draw stroke", value: true})
```

```js
viewof strokeOpacity = Range([0.001, 1], {step:0.001, value: 0.045, label: "Stroke opacity", disabled: !drawStroke})
```

```js
viewof customColor = Toggle({label: "Custom stroke color", value: false, disabled: !drawStroke})
```

```js
viewof strokeColor = Text({type: "Color", label: "Custom Stroke Color", disabled: !drawStroke || !customColor})
```

```js
md`#### Points`
```

```js
viewof drawPoints = Toggle({label: "Draw points", value: false})
```

```js
viewof drawPointsDarker = Radio(["darker", "brighter"], {label: "Color points", value: "brighter", disabled: !drawPoints})
```

```js
viewof colorPointsStrength = Range([0, 4], {
  step: 0.25,
  value: 1,
  label: "Color strength",
  disabled: !drawPoints
})
```

```js
viewof pointRadius = Text({label: "Point Radius", type: "number", placeholder: "Select a radius", value: "3", disabled: !drawPoints})
```

```js
md`#### Canvas`
```

```js
viewof globalAlpha = Range([0, 1], {step:0.1, value: 0.8, label: "Global alpha"})
```

```js
viewof width = Range([954, 3840], {step:1, value: 954, label: "Width"})
```

```js
viewof height = Range([600, 2160], {step:1, value: 600, label: "Height"})
```

```js
viewof clear_in_between = Inputs.toggle({ label: "Clear inbetween" })
```

```js
md`## Requires`
```

```js echo
druid = require("@saehrimnir/druidjs")
```

```js echo
druid.version
```

```js
data = {
  switch (dataset) {
    case "MNIST":
    case "FMNIST":
      return await datasets["fetch_" + dataset.toLowerCase()]();
    default:
      return datasets[dataset];
  }
}
```

```js echo
datasets = require("@saehrimnir/dataset@^0.1.5")
```

```js echo
d3 = require("d3")
```

```js echo
Delaunay = require("d3-delaunay")
```

```js
colorscales = {
  const scale_chromatic = await require("d3-scale-chromatic");
  return Object.keys(scale_chromatic).filter(d => d.includes("interpolate"))
}  
```

```js echo
import {Select, Range, Text, Toggle, Radio} from "@observablehq/inputs"
```
