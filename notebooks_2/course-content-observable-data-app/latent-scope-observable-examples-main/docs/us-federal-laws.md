---
toc: false
---


# 50,000 U.S. Federal Laws 

This [fascinating dataset](https://osf.io/mrghc/?view_only) contains the titles and dates of almost 50,000 U.S. federal laws from ${min(da, d => d.date_of_passage).split("-")[0]} to ${max(da, d => d.date_of_passage).split("-")[0]}. 
I was made aware of this dataset in the [Data is Plural 2024.02.28 edition](https://www.data-is-plural.com/archive/2024-02-28-edition/), a great place to find interesting public datasets.

The 49,746 laws:

<div class="input-card">
<div class="static-table">
${Inputs.table(da, tableConfig)}
</div>
</div>

As you might imagine, 50k laws is a lot to sort through. 
We can use [Latent Scope](https://github.com/enjalot/latent-scope) to organize them by the similarity of their titles and see what clusters of laws emerge.
This article takes you through a short tour of these clusters, stopping at some really funny laws as well as some deadly serious laws.

Before we explore, I want to give a short preview of what Latent Scope is, you can get a full tutoria on [building your own scope](your-first-scope) but this is the interface you would work with to curate your clusters in the tool:

<img src="/assets/us-federal-laws/explore.png" class="pageshot">

Latent scope helps you put your data through a [4 step process](your-first-scope):  

<img src="/assets/us-federal-laws/setup.png" class="screenshot">

1. Embed - run each piece of text through an embedding model
2. Project - run the high-dimensional embeddings through UMAP
3. Cluster - run the 2-dimensional UMAP coordinates through HDBSCAN
4. Label - ask an LLM to create a label by summarizing a list of text taken from each cluster

So at the end of this process we have ${clusterTableData.length} clusters carving up our ${da.length} laws, with  
every row of our input data annotated with a cluster index and label. 
In our other example analyses like [Datavis Survey](datavis-survey) and [enjalot's tweets](enjalot-tweets) we didn't have quite so many data points.
50,000 isn't enormous, Latent Scope can easily work with a million on an average computer, but it is still a lot of points to plot.

So in this analysis we will focus on exploring the ${clusterTableData.length} clusters, showing the individual laws in each cluster only when you select a cluster.
Feel free to peruse the clusters in this interface, if you keep scrolling I'll take you on a tour of the ones I find most interesting!

_Click on the radio button on the left of each cluster in the table, or click on a cluster in the map to select it and see the details in the card below_

<div class="input-card" style="border: 1px solid lightgray; border-radius: 5px; padding: 10px;">

```js
const clusterTableData = scope.cluster_labels_lookup.map(c => {
  let dc = da.filter(d => d.cluster == c.cluster)
  return {
    cluster: c.cluster,
    label: c.label,
    count: dc.length,
    min_date: min(dc, d => d.date_of_passage),
    max_date: max(dc, d => d.date_of_passage),
  }
})
const selclusterTable = view(Inputs.table(clusterTableData, {
  width: {
    cluster: 40,
  },
  header: {
    "cluster": ""
  },
  sort: "min_date",
  reverse: false,
  multiple: false,
  value: clusterTableData[271]
}))
```

<div style="position:relative;">

  ```js
  const dynahull = view(dynamicHull(hulls, {
    width: 500,
    height: 500,
    xd: [-1.1, 1.1],
    yd: [-1.1, 1.1],
    selected: selclusterTable.cluster
  }))
  ```


  <div>
    ${tip}
  </div>
</div>
</div>

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
  ${clusterCard(dynahull.selected, {
    description: "",
    plot: dateBars(dynahull.selected),
    tableConfig, 
    da, 
    scope, 
    hulls,
    r: 1
  })}
</div>
<br/>

## ${clusterTableData[10].label}
The cluster that jumped out at me when I was first browsing the data is **${clusterTableData[10].label}**.
Seeing laws with a title like 
*"To change the name of the schooner Sally McGee to that of Ocean Eagle"* and 
*"To authorize the Secretary of the Treasury to change the name of the steam yacht "Fanny."* made me wonder what was going on in the 1800s. 
It seems like back then you even had to get Congress to help you fix a typo in your boat name: *"	To change the name of the schooner La Pette to La Petite."*

<div>
  ${clusterCard(10, {
    plot: "You used to have to ask Uncle Sam to name your boat?", 
    description: dateBars(10),
    tableConfig, 
    da, 
    scope, 
    hulls,
    r: 1
  })}
</div>
<br/>

## ${clusterTableData[59].label}
Another fun cluster is **${clusterTableData[59].label}**.
Were you aware that since 1962 the U.S. has had a "an annual National School Lunch Week"? 
There are over 600 National awareness related laws in this cluster!

<div>
  ${clusterCard(59, {
    plot: "This is a lot to be aware of...", 
    description: dateBars(59),
    tableConfig, 
    da, 
    scope, 
    hulls,
    r: 1
  })}
</div>

I also found the *"Joint resolution to designate the third Sunday in June 1966 as Father's Day"*, which made me curious about when Mother's day was establshed.
I believe this dataset is missing the [1914 law](https://en.wikipedia.org/wiki/Mother%27s_Day_(United_States)#Establishment_of_holiday) passed by U.S. Congress to make it official.

Here are the ${da.filter(d => d.date_of_passage?.indexOf("1914-05") == 0).length} laws in the dataset passed in May of 1914:
<div class="input-card">
${Inputs.table(da.filter(d => d.date_of_passage?.indexOf("1914-05") == 0), tableConfig)}
</div>

When dealing with a lot of data, small data quality issues can be hard to find. 
Being able to explore the data by through the meaningful groupings of the clusters is a great way to ask questions you didn't know you had!


## U.S. Land Legislation
An interesting and a bit more serious cluster is **${clusterTableData[189].label}**.
Can you find laws related the Louisiana Purchase around 1803?

<div>
  ${clusterCard(189, {
    description: "", 
    plot: dateBars(189),
    tableConfig, 
    da, 
    scope, 
    hulls,
    r: 1
  })}
</div>

## Bridge Building
There are more than 3,000 laws related to bridge building and dam construction across 19 clusters.
Sometimes the embedding model finds patterns in text that are more subtle than a high level concept such as bridges and dams.
Investigating what the different patterns in each cluster are could lead to interesting insights (if you care about bridges and dams!)

```js
const bridgeClusters = [72, 73, 74, 75, 76, 77, 79, 80,81, 83, 85, 88, 89, 90, 91, 92, 93, 97, 98]
```
<div>
${clusterListCard(bridgeClusters, {
    heading: "Bridge Building",
    plot: dateBars(bridgeClusters),
    tableConfig: {...tableConfig, columns: ["Title", "date_of_passage", "cluster", "label"], 
      width: { Title: "70%", date_of_passage: 100, cluster: 40, label: 170}, sort: "cluster"},
    da, 
    scope, 
    hulls 
})}
</div>

Another thing to notice about those bridge building clusters is that a lot of those laws were passed in the early 20th century, with a peak in the late 1920s and early 1930s.
This is also around the time that the Golden Gate Bridge began construction, so we must have really been into bridges at that time. 

## Washington D.C.
What does Congress love almost as much as building bridges? Washington D.C.! 
With over 5% of the laws in the dataset found in the Washington D.C. cluster, you can tell they really care about it.

```js
const dcClusters = [123, 106, 107, 109, 110, 111, 112, 114, 116, 118, 119]
```
<div>
${clusterListCard(dcClusters, {
    heading: "Washington D.C.",
    plot: dateBars(dcClusters),
    tableConfig: {...tableConfig, columns: ["Title", "date_of_passage", "cluster", "label"], width: { Title: "70%", date_of_passage: 100, cluster: 40, label: 170}},
    da, 
    scope, 
    hulls 
})}
</div>
<br/>

## Native Americans
There are also quite a few laws relating to our sad history with Native Americans.

```js
const naClusters = [105, 127, 141, 146,  178, 183, 190, 204, 205, 210, 211]
```
<div>
${clusterListCard(naClusters, {
    heading: "Native American",
    plot: dateBars(naClusters),
    tableConfig: {...tableConfig, columns: ["Title", "date_of_passage", "cluster", "label"], width: { Title: "70%", date_of_passage: 100, cluster: 40, label: 170}},
    da, 
    scope, 
    hulls 
})}
</div>
<br/>

## Civil Rights

I wasn't able to identify clusters that related specifically to civil rights, but thanks to the embeddings I was able to use nearest neighbor search to find 150 laws that are related to the concept of civil rights.
```js
const civilRights = (await FileAttachment("data/us-federal-laws/Civil Rights.indices").text()).split("\n").map(d => da.find(p => p.index == +d))
```

<div class="card">

```js
 Plot.plot({
        marks: [
          Plot.hull(hulls.flatMap(d => d), {
            x: "x",
            y: "y",
            fill: "cluster",
            fillOpacity: 0.1,
            stroke: "lightgray",
            curve: "catmull-rom",
          }),
          
          Plot.dot(civilRights, {
            x: "x",
            y: "y",
            fill: "cluster",
            title: d => `${d.Title}\n${d.date_of_passage}\n${d.cluster}: ${d.label}`,
            tip: true
          }),
        ],
        width: 500,
        height: 500,
        color: { scheme: "cool" },
        y: { axis: null},
        x: { axis: null },
        tip: {
          format: {
            cluster: true,
            title: true,
            date_of_passage: true
          }
        }
      })
```

  <div class="static-table">
    ${Inputs.table(civilRights, 
      {...tableConfig, columns: ["Title", "date_of_passage", "cluster", "label"], width: { Title: "70%", date_of_passage: 100, cluster: 40, label: 170}}
    )}
  </div>
</div>

Nearest neighbor search on embeddings is what powers techniques like Retrieval Augmented Generation (RAG), finding relevant documents to feed to an LLM as context for a query.
In the above visualization we can see that the similarity search on the query of "civil rights" returns laws that are mostly relevant but also spread across various clusters.
What would it be like to leverage the clustering to determine relevance when implementing techniques like RAG?

Interested in running your own large text dataset through Latent Scope? Try out [the getting started tutorial](your-first-scope) and reach out on [Discord](https://discord.gg/x7NvpnM4pY) if you run into any issues!



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
if(dynahull.hovered >= 0){
  // display the tooltip
  // console.log("p, sel", p, selected)
  // calculate the hull centroid
  let h = dynahull.hovered
  let x = mean(hulls[h], d => d.x)
  let y = mean(hulls[h], d => d.y)
  let hp = {...hulls[h][0], x, y}
  tip.show(hp, {width: 500, height: 500, xd: [-1.1, 1.1], yd: [-1.1, 1.1]}, md.unsafe(`
  <i>Cluster ${hp["cluster"]}: ${hp["label"]}</i>
  <br/>
  <span>${min(hulls[h], d => d["date_of_passage"])} - ${max(hulls[h], d => d["date_of_passage"])}</span>
  <br/>
  ${da.filter(d => d.cluster == h).length} laws
  `))
} else {
  tip.hide()
}
```

```js
const tableConfig = { 
  columns: [
    "Title",
    "date_of_passage",
  ],
  width: {
    "Title": "80%"
  },
  sort: "date_of_passage",
  reverse: false,
  rows: 15
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
function dateBars(cluster) {
  let filter = d => d.cluster == cluster
  if (Array.isArray(cluster)) {
    filter = d => cluster.indexOf(d.cluster) >= 0
  }
  return Plot.plot({
    marks: [
      Plot.barX(da, Plot.binY({x: "count"}, {
        filter,
        y: d => new Date(d["date_of_passage"]).getFullYear(),
        x: "count",
      }))
    ],
    marginLeft: 80,
    marginBottom: 30,
    width: 300,
    height: 300,
    y: { label: null, tickFormat: x => Math.floor(x).toString() },
    x: { label: null },
    // style: { "background-color": "white" }
  })
}
```


```js
const db = DuckDBClient.of({
  scope: FileAttachment("data/us-federal-laws/scopes-001-input.parquet")
});
```

```js
const scope = FileAttachment("data/us-federal-laws/scopes-001.json").json()
```

```js
// const rows = db.sql`SELECT * FROM input`
const data = db.sql`SELECT index,cluster,label,Title,date_of_passage,source,x,y FROM scope`
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
import {dynamicHull} from "./components/dynamicHull.js";
import {tooltip} from "./components/tooltip.js";
import {clusterCard} from "./components/clusterCard.js";
import {clusterListCard} from "./components/clusterListCard.js";

import markdownit from "markdown-it";
import { select } from 'npm:d3-selection';
import { min, max, sum, mean } from 'npm:d3-array';
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
```js
if(isMobileDevice) {
  select(".regl-container").style("display", "none")
}
```