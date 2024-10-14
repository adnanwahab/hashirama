# Park Access in London

```js echo
isochrone = {

  let range = ['#8C0172', 
               '#922D55', 
               '#964D3E', 
               '#9A6E28', 
               '#9B951B', 
               '#89BC48', 
               '#6BD48C', 
               '#66E8D3', 
               '#B2F2FD']
    
  let color = d3.scaleQuantize()
            .domain([0, d3.quantile(tree.cost, 0.9)])
            .range(range.reverse());
    

  const svg = d3.create("svg")
                .attr("viewBox", [0, 0, width, height])
                .style("background", "#333");

  const path = d3.geoPath(projection);

  path.pointRadius(1);
  svg
    .append("g")
    .selectAll("path")
    .data(d3.range(nodes.length))
    .join("path")
    .attr("d", (i) =>
      path({
        type: "Point",
        coordinates: coordinates(nodes[i])
      })
    )
    .attr("fill", (i) => color(tree.cost[i]));

  return svg.node();
}
```

```js
DOM.download(() => rasterize(isochrone), undefined, "Save as PNG")
```

```js
Inputs.table(nodes)
```

```js
Inputs.table(edges)
```

```js
import { shortest_tree } from "@fil/dijkstra"
```

```js
import {rasterize, serialize} from "@mbostock/saving-svg"
```

```js
nodes = FileAttachment('london_nodes.csv').csv({typed: true})
```

```js
edges = FileAttachment("london_edges.csv").csv({typed: true})
```

```js
entrances = FileAttachment("london_entrances.csv").csv({typed: true})
```

```js
grabsIndex = new Map(nodes.map(({ osmid }, i) => [osmid, i]))
```

```js
nodesIndex = d3.index(nodes, (d) => d.osmid)
```

```js echo
projection0 = d3.geoMercator().fitSize([width, 500], {
  type: "MultiPoint",
  coordinates: nodes.map((d) => [d.x, d.y])
})
```

```js echo
projection = d3
  .geoMercator()
  .translate([width / 2, height / 2])
  .center(d3.geoCentroid({ type: "MultiPoint", coordinates: nodes.map((d) => [d.x, d.y]) }))
  .scale(projection0.scale() * 1.8)
```

```js echo
height = { return Math.floor(width * 0.72); }
```

```js echo
function coordinates(node) {
  return [node.x, node.y];
}
```

```js echo
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, 500]);
  const path = d3.geoPath(projection0).pointRadius(1);

  svg
    .append("path")
    .attr(
      "d",
      path({ type: "MultiPoint", coordinates: nodes.map(coordinates) })
    );

  return svg.node();
}
```

```js echo
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, 500]);
  const path = d3.geoPath(projection0);

  svg
    .append("path")
    .attr(
      "d",
      path({
        type: "MultiLineString",
        coordinates: edges.map(({ u, v }) => [
          coordinates(nodesIndex.get(u)),
          coordinates(nodesIndex.get(v))
        ])
      })
    )
    .attr("stroke", "currentColor");

  return svg.node();
}
```

```js echo
graph = {
  const graph = {
    sources: [],
    targets: [],
    costs: []
  };
  const nodesIndex = new Map(nodes.map(({ osmid }, i) => [osmid, i]));
  for (const { u, v, length, highway } of edges) {
    graph.sources.push(nodesIndex.get(u));
    graph.targets.push(nodesIndex.get(v));
    graph.costs.push(length * (highway.match("residential") ? 5 : 1));
  }
  return graph;
}
```

```js
origins = entrances.map((e) => grabsIndex.get(e.osmid)).filter(function(e) { return e !== undefined; });
```

```js
tree = shortest_tree({ graph, origins })
```

```js echo
map = () => {
  const delay0 = 300;

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("background", "#333");

  const path = d3.geoPath(projection);
  const color = d3.scaleOrdinal(d3.shuffle(d3.schemeSet1));

  // the whole graph as dimmed paths
  // residential roads are dashed
  const gGraph = svg
    .append("g")
    .style("stroke", "white")
    .style("stroke-width", 0.125);

  for (const [type, subset] of d3.group(
    edges,
    (d) => !!d.highway.match("residential")
  )) {
    gGraph
      .append("path")
      .datum({
        type: "MultiLineString",
        coordinates: subset.map(({ u, v }) => [
          coordinates(nodesIndex.get(u)),
          coordinates(nodesIndex.get(v))
        ])
      })
      .attr("d", path)
      .style("stroke-dasharray", type ? [1, 3] : []);
  }

  svg
    .append("g")
    .attr("opacity", 0.7)
    .selectAll("path")
    .data(d3.range(nodes.length))
    .join("path")
    .attr("d", (i) =>
      tree.predecessor[i] === -1
        ? null
        : path({
            type: "LineString",
            coordinates: [
              coordinates(nodes[tree.predecessor[i]]),
              coordinates(nodes[i])
            ]
          })
    )
    .attr("stroke", (i) => color(tree.origin[i]))
    // Animation starts here
    .attr("opacity", 0)
    .attr("stroke-dasharray", [0, 1000])
    .transition()
    .delay((i) => delay0 + tree.cost[i])
    .attr("opacity", 1)
    .attr("stroke-dasharray", (i) =>
      tree.predecessor[i] === -1
        ? []
        : [(tree.cost[i] - tree.cost[tree.predecessor[i]]) / 10, 1000]
    );

  const gNodes = svg.append("g");
  const sorted = d3.sort(d3.range(nodes.length), (i) => tree.cost[i]);

  path.pointRadius(1);
  gNodes
    .selectAll("path")
    .data(d3.range(nodes.length))
    .join("path")
    .attr("d", (i) =>
      path({
        type: "Point",
        coordinates: coordinates(nodes[i])
      })
    )
    .attr("fill", (i) => color(tree.origin[i]))
    // Animation of nodes
    .attr("opacity", 0)
    .transition()
    .delay((i) => delay0 + tree.cost[i])
    .duration(1000)
    .attr("opacity", 1);

  path.pointRadius(4);
  svg
    .append("g")
    .selectAll("path")
    .data(origins)
    .join("path")
    .attr("d", (i) =>
      path({
        type: "Point",
        coordinates: coordinates(nodes[i])
      })
    )
    .attr("stroke", (i) => color(tree.origin[i]))
    .attr("fill", "white");

  svg
    .append("g")
    .attr("transform", "translate(10, 20)")
    .append("text")
    .text("London, Voronoi")
    .style("fill", "white")
    .style("font-family", "sans-serif")
    .style("font-size", "18px");

  return svg.node();
}
```
