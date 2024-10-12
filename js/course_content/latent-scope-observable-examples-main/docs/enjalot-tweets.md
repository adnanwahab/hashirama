---
title: enjalot's tweets
---

# enjalot's tweets
## Looking in the mirror of ${max(da, d => d.year) - min(da, d => d.year)} years and 10,965 tweets.

Oh god this could get embarrassing. 
The problem with powerful visualization tools is that they will show you things whether you wanted to see them or not. 
For most of my career I've used Twitter mainly in a professional capacity, but as we will see my younger self was sometimes a bit flippant. 
Here goes nothing! 

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
            r: 1,
            fill: "cluster",
            title: d => `${d["cluster"]}: ${d["label"]} 
${d["type"]} ${d["created_at"]}

${d["full_text"]}`,
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

Before we begin the analysis, I should point out that each of the dots in the above map is a tweet, and all those tweets went through the [4 step process](your-first-scope) in Latent scope:  
1. Embed - run each piece of text through an embedding model
2. Project - run the high-dimensional embeddings through UMAP
3. Cluster - run the 2-dimensional UMAP coordinates through HDBSCAN
4. Label - ask an LLM to create a label by summarizing a list of text taken from each cluster

So at the end of this process we have ${clusterTableData.length} clusters carving up our ${da.length} tweets. 
Every row of our input data is annotated with a cluster index and label:


<div class="card">
<div class="static-table">
${Inputs.table(da, {...tableConfig, columns: [
    "cluster",
    "label",
    "full_text",
    "favorite_count",
    "retweet_count",
    "tweet_id"
  ],
  width: {
    ...tableConfig.width,
    full_text: "40%",
    tweet_id: 70,
    cluster: 50,
    label: 200
  }
})}
</div>
</div>

${clusterTableData.length} clusters is better than 10,000 but it's still quite a lot. 
Let's use some common metrics to explore our clusters, namely likes and rewteets.
We can sort our list of clusters by the various column headers and see what's in each cluster:


<div class="input-card">

```js
const clusterTableData = scope.cluster_labels_lookup.map(c => {
  let dc = da.filter(d => d.cluster == c.cluster)
  return {
    cluster: c.cluster,
    label: c.label,
    count: dc.length,
    favorites: sum(dc, d => d.favorite_count),
    retweets: sum(dc, d => d.retweet_count),
    min_date: min(dc, d => d.created_at),
    max_date: max(dc, d => d.created_at),
  }
})
const selclusterTable = view(Inputs.table(clusterTableData, {
  format: {
    "favorites": sparkbar(max(clusterTableData, d => d.favorites), "lightblue"),
    "retweets": sparkbar(max(clusterTableData, d => d.retweets), "orange"),
  },
  width: {
    cluster: 20,
    label: 200,
    count: 50,
    favorites: 100,
    retweets: 100,
    min_date: 100,
    max_date: 100
  },
  header: {
    "cluster": ""
  },
  sort: "favorites",
  reverse: true,
  multiple: false,
  value: clusterTableData[62]
}))
```

</div>

_Click on the radio button on the left of each cluster in the table to select it and see the details in the card below_

```js
function clusterDescription (cluster) {
  return htl.html`<div>
   <span style="border-bottom: 2px solid lightblue">favorites: ${clusterTableData[cluster].favorites}</span>
   <br/>
   <br/>
   <span style="border-bottom: 2px solid orange">retweets: ${clusterTableData[cluster].retweets}</span>
  </div>`
}
```

<div>
  ${clusterCard(selclusterTable.cluster, {
    description: clusterDescription(selclusterTable.cluster),
    //description: statPlot(selclusterTable.cluster), 
    //plot: barPlot(selclusterTable.cluster),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

As you can see from the first cluster in the list, I made a lot of tweets about Observable, 
especially Observable Plot which makes sense since it was a big part of my job to share my experience with these tools while I worked there.
The opportunity to work with Mike Bostock at Observable was the culmination of 10 years of investment in the D3.js community, which you can see in the next most popular cluster:

<div>
  ${clusterCard(91, {
    description: `Tweeting about D3.js since 2011`,
    plot: clusterDescription(91),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

Ok, but now I feel a little like I'm bragging.
Let's look at a cluster that represents my more unhinged thoughts, hopefully none of these get me cancelled 🫣 Honestly they will probably just make you 🙄.

<div>
  ${clusterCard(66, {
    description: `These are mostly late night tweets while I'm coding and listening to Lil' Wayne`,
    plot: clusterDescription(66),
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>

Alright, if you're still reading let's take a look at some clusters that are probably more relevant to your interests. Like these 4 that are all about AI and clustering!

<div>
  ${clusterListCard([22,23, 46, 47], {
    plot: `I first learned about latent space when I was working with @hardmaru on SketchRNN. I learned about dimensionality reduction working with @shancarter and @ch402 on Distill. Ever since then I've been trying to visualize latent space!`,
    tableConfig, 
    da, 
    scope, 
    hulls
  })}
</div>


## Filtering on metadata
Alright, you've read through a bunch of the content. 
Let's take a break and consider an aspect of this data that is probably relevant to anyone who wants to cluster their data, whether its tweets or otherwise.

The tweets you get from the archive are one of three things, a "tweet", a "reply" or a "retweet". Most likely we are only really interested in tweets as they represent the "original" thoughts. It is conceivable you might want to analyze your reply-game, or maybe see if there are patterns in what kind of stuff you retweet. 
So in that spirit lets see what happens when we filter our overall data down to just one of those three categories:

```js
const seltype = view(Inputs.select(["tweet", "reply", "retweet"]))
```
```js
const fda = da.filter(d => d.type == seltype)
```

```js
Plot.plot({
  marks: [
    Plot.hull(hulls.flatMap(d => d), {
      x: "x",
      y: "y",
      z: "cluster",
      // fill: "lightgray",
      // fillOpacity: 0.1,
      stroke: "lightgray",
      curve: "catmull-rom",
    }),
    Plot.dot(da, {
      x: "x",
      y: "y",
      r: 1,
      fill: "lightgray",
      fillOpacity: 0.5,
    }),
    Plot.dot(fda, {
      x: "x",
      y: "y",
      r: 2,
      fillOpacity: 0.7,
      fill: "cluster",
      title: d => `${d["cluster"]}: ${d["label"]} 
${d["type"]} ${d["created_at"]}

${d["full_text"]}`,
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


If you still want to analyze your own tweets after all of this, the first step is to request your archive from Twitter. You can follow the instructions in [this notebook](https://observablehq.com/@observablehq/save-and-analyze-your-twitter-archive) to download and then process your tweets into a format that matches this analysis.
The next step would be to run the CSV of your tweets through Latent Scope to get your clusters.
Then you can look in your own tweet mirror!

If you have questions feel free to get in touch on our <a href="https://discord.gg/x7NvpnM4pY">Discord server</a>!




```js
// ----------------------------------------------------------
```


```js
const tableConfig = { 
  columns: [
    "full_text",
    "created_at",
    "favorite_count",
    "retweet_count",
    "tweet_id",
  ],
  header: {
    "tweet_id": "link"
  },
  format: {
    "tweet_id": x => htl.html`<a target=_blank href="https://twitter.com/i/web/status/${x}">tweet</a>`
  },
  width: {
    "full_text": "60%",
    "favorite_count": 65,
    "retweet_count": 65,
    "tweet_id": 60,
    "created_at": 100,
  },
  sort: "favorite_count",
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
  field = "type",
  width = 300,
  height = 300,
} = {}) {
  return Plot.plot({
        marks: [
          Plot.barX(da, Plot.groupY({x: "count"}, {
            filter: d => d.cluster == cluster,
            y: field,
            x: "count",
            // fill: "state",
            tip: true,
            // order: ["open", "closed"]
          }))
        ],
        marginLeft: 80,
        marginBottom: 30,
        width,
        height,
        y: { label: null, tickFormat: x => x.toString() },
        x: { label: null, grid: true },
        style: { "background-color": "#f0f0f0" }
      })
}
```


```js
function statPlot(cluster, {
  field = "type",
  width = 300,
  height = 300,
} = {}) {
  let maxcount = max(clusterTableData, d => Math.max(d.favorites, d.retweets))
  let cdata = da.filter(d => d.cluster == cluster)
    .flatMap(d => [
      {stat: "favorites", value: d.favorite_count}, 
      {stat: "retweets", value: d.retweet_count}, 
    ])
  return Plot.plot({
        marks: [
          Plot.barX(cdata, Plot.groupY({x: "sum"}, {
            y: "stat",
            x: "value",
            fill: "stat",
            tip: true,
          }))
        ],
        marginLeft: 80,
        marginBottom: 30,
        width,
        height,
        y: { label: null, tickFormat: x => x.toString() },
        x: { label: null, grid: true, domain: [0, maxcount] },
        color: { range: ["lightblue", "orange"]},
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
  scope: FileAttachment("data/enjalot-tweets/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/enjalot-tweets/scopes-001.json").json()
```

```js
// const rows = db.sql`SELECT * FROM input`
const data = db.sql`SELECT *,id::string AS tweet_id FROM scope`
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
import {clusterListCard} from "./components/clusterListCard.js";

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