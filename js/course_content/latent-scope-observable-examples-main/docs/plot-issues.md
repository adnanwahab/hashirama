---
title: GitHub Issues & PRs
---


# GitHub Issues & PRs

Collecting feedback from users and customers is an easy way to end up with an enormous amount of unstructured text data, even when there is useful structured data associated with it.
For example, managing a popular open source repository can lead to hundreds of issues and pull requests. 

Let's use [Observable Plot](https://observablehq.com/plot/what-is-plot) as an example, not only is it the visualization library I'm using for these analyses, 
with ${da.filter(d => d.type == "issue").length} issues (${da.filter(d => d.type == "issue" && d.state == "open").length} open) 
and ${da.filter(d => d.type =="pull_request").length} pull requests (${da.filter(d => d.type =="pull_request" && d.state == "open").length} open) 
there is a lot of feedback to sort through.

To get the data we'll use the excellent [GitHub Burndown](https://observablehq.com/@tmcw/github-burndown) notebook, where you could enter your own API key to fetch all the issues & PRs for a repository you control. You can download the resulting data via Observable's interface like so:
<img src="/assets/plot-issues/download_json.png" style="width:80%;" />

The notebook itself provides some interesting visualizations focused around when issues are opened and closed:

<img src="/assets/plot-issues/burndown.png" style="width:80%;" />

We want to focus on the contents of the issues, and just like in our [Datavis Survey example](datavis-survey), just scrolling through a table and reading every issue isn't practical at all:

<div class="card">
<div class="static-table">
${Inputs.table(da, tableConfig)}
</div>
</div>

So again, we use Latent Scope's process to create a map of our unstructured text data:

```js
Plot.plot({
        marks: [
          Plot.hull(hulls.flatMap(d => d), {
            x: "x",
            y: "y",
            z: "cluster",
            fill: "lightgray",
            fillOpacity: 0.1,
            stroke: "lightgray",
            curve: "catmull-rom",
          }),
          Plot.dot(da, {
            x: "x",
            y: "y",
            r: 2,
            fill: "cluster",
            title: d => `${d["cluster"]}: ${d["label"]}
${d["type"]} ${d["state"]}

${d["title"]}
---
${d["body"]}`,
            tip: true
          }),
        ],
        width: 500,
        height: 500,
        margin: 30,
        color: { scheme: "cool" },
        y: { axis: null},
        x: { axis: null },
      })
```


The map is created by going through the 4 step process in Latent scope:  
1. Embed - run each piece of text through an embedding model
2. Project - run the high-dimensional embeddings through UMAP
3. Cluster - run the 2-dimensional UMAP coordinates through HDBSCAN
4. Label - ask an LLM to create a label by summarizing a list of text taken from each cluster

So at the end of this process we have ${clusterTableData.length} clusters carving up our ${da.length} issues and pull requests. 
Every row of our input data is annotated with a cluster index and label:

<div class="card">
  <div class="static-table">
    ${Inputs.table(da, {...tableConfig, columns: [
        "cluster",
        "label",
        "html_url",
        "text",
        "state",
        "type"
      ],
      width: {
        ...tableConfig.width,
        text: "50%",
        cluster: 50,
        label: 200
      }
    })}
  </div>
</div>

We've essentially added some new structure that we can use to filter and group our data, while still attaching the valuable structured metadata we already had.

For example, one thing we might be interested in is the cluster with the most open issues:

<div>
  ${clusterCard(11, {
    description: "", 
    plot: barPlot(11),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

We might also be interested in which cluster has the most comments, as that can be another indication of how much interest in (or struggles with) certain concepts users are having.

<div>
  ${clusterCard(0, {
    description: "", 
    plot: barPlot(0),
    tableConfig: { ...tableConfig, sort: "comments" }, 
    da, 
    scope, 
    hulls
  })}
</div>

It would also be great to get insight into the clusters as a whole. 
We can create a data table that displays key metrics computed for each cluster. 
We can then also click on the radio button next to each cluster to select it and view it in more detail. 
Sorting the table allows us to investigate the various metrics we may care about in relation to the clusters.


<div class="input-card">

```js
const clusterTableData = scope.cluster_labels_lookup.map(c => {
  let dc = da.filter(d => d.cluster == c.cluster)
  return {
    cluster: c.cluster,
    label: c.label,
    open_issues: dc.filter(d => d.state == "open" && d.type == "issue").length,
    closed_issues: dc.filter(d => d.state == "closed" && d.type == "issue").length,
    open_pull_requests: dc.filter(d => d.state == "open" && d.type == "pull_request").length,
    closed_pull_requests: dc.filter(d => d.state == "closed" && d.type == "pull_request").length,
    comments: sum(dc, d => d.comments),
    min_date: min(dc, d => d.created_at),
    max_date: max(dc, d => d.created_at),
  }
})
const selclusterTable = view(Inputs.table(clusterTableData, {
  format: {
    "open_issues": sparkbar(max(clusterTableData, d => d.open_issues), "orange"),
    "open_pull_requests": sparkbar(max(clusterTableData, d => d.open_pull_requests), "orange"),
    "closed_issues": sparkbar(max(clusterTableData, d => d.closed_issues), "lightblue"),
    "closed_pull_requests": sparkbar(max(clusterTableData, d => d.closed_pull_requests), "lightblue"),
  },
  width: {
    "cluster": 20,
    "label": "20%"
  },
  header: {
    "cluster": ""
  },
  sort: "open_issues",
  reverse: true,
  multiple: false,
  value: clusterTableData[11],
}))
```

</div>

_Click on the radio button on the left of each cluster in the table above to select it and see the details in the card below_

<div>
  ${clusterCard(selclusterTable.cluster, {
    description: "", 
    plot: barPlot(selclusterTable.cluster),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

At the end of the day, the insights to be found depend heavily on your relationship to the dataset.
If this was your repository it might be more illuminating who is opening the issues or pull requests. 
It could be that some clusters represent recently added features and when the issues are opened matters more. 

The important thing is to take a look, with Latent Scope you can [easily export](exporting-data) your annotated data and analyze it in the tool of your choice. 
Personally, I've been enjoying [Observable Plot](https://observablehq.com/plot/) inside [Observable Framework](https://observablehq.com/framework/) to make this site with my exported scopes.

```js
// ----------------------------------------------------------
```


```js
const tableConfig = { 
  columns: [
    "html_url",
    "text",
    "state",
    "type",
    "user",
    "comments"
  ],
  header: {
    "html_url": "url"
  },
  format: {
    "html_url": x => htl.html`<a href=${x}>${x.split("/")[x.split("/").length - 1]}</a>`
  },
  width: {
    "text": "50%",
    "html_url": 40,
    "comments": 70,
  },
  sort: "state",
  reverse: true,
  rows: 15
}
```


```js
// const map = view(canvas)
```

```js
const tip = tooltip({})
```

```js
// let hp = da[map.hovered[0]]
 ```

```js
// if(hp) {
//   // display the tooltip
//   // console.log("p, sel", p, selected)
//   tip.show(hp, map, md.unsafe(`
//   <i>Cluster ${hp["cluster"]}: ${hp["label"]}</i>
//   <br/>
//   <span>state: ${hp["state"]}
//   <span>type: ${hp["type"]}
//   <br/>
//   ${hp["text"]}
//   `))
// } else {
//   tip.hide()
// }
```

```js
function barPlot(cluster, {
  width = 300,
  height = 300,
} = {}) {
  return Plot.plot({
        marks: [
          Plot.barX(da, Plot.groupY({x: "count"}, {
            filter: d => d.cluster == cluster,
            y: "type",
            x: "count",
            fill: "state",
            tip: true,
            order: ["open", "closed"]
          }))
        ],
        marginLeft: 80,
        marginBottom: 30,
        width,
        height,
        y: { label: null },
        x: { label: null, grid: true },
        color: { range: ["lightblue", "orange", ]},
        style: { "background-color": "#f0f0f0" }
      })
}
```
```js
function sparkbar(max, color) {
  return x => htl.html`<div style="
    background: ${color};
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en")}`
}
```

```js
// const canvas = document.createElement("canvas")
```

```js
// let tableData = []
// if(map.selected.length > 0) {
//   // tableData = []
//   map.selected.forEach(i => tableData.push(da[i]))
// }
```

```js
// calculate the hull points
const hulls = scope.cluster_labels_lookup.map(c => {
  return c.hull.map(idx => da.find(d => d.index === idx))
})
```


```js
const db = DuckDBClient.of({
  scope: FileAttachment("data/plot-issues/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/plot-issues/scopes-001.json").json()
```

```js
// const rows = db.sql`SELECT * FROM input`
const data = db.sql`SELECT * FROM scope`
```
```js
const da = data.toArray().map(d => d.toJSON())
```
```js
console.log("data!", da)
console.log("scope!", scope)
console.log("hulls!", hulls)
```

```js
import {scatter} from "./components/scatter.js";
import {hull} from "./components/hull.js";
import {tooltip} from "./components/tooltip.js";
import {clusterCard} from "./components/clusterCard.js";

import markdownit from "markdown-it";
import { min, max, sum } from "npm:d3-array"
```
```js
const Markdown = new markdownit({html: true});

const md = {
  unsafe(string) {
    const template = document.createElement("template");
    template.innerHTML = Markdown.render(string);
    return template.content.cloneNode(true);
  }
};
```

```js
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```