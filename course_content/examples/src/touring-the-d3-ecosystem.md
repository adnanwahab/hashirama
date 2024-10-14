```js
md`# Touring the D3 Ecosystem

These are the ${links.length} links I go over in my [DataVizLive talk](https://share.dataviz.live/ijd3)
`
```

```js
md`<iframe width="560" height="315" src="https://www.youtube.com/embed/4cEc4FdxHf0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
```

```js echo
html`<div style="display:flex;flex-wrap: wrap;">${links.map((d,i) => {
   let img = d.thumbnail ? "https://static.observableusercontent.com/thumbnail/" + d.thumbnail + ".jpg" : d.preview || ""
   return `
  <div style="width: 200px;margin:15px 5px;padding:5px 10px; border: 1px solid #eee">
<a href="${d.url}">
  <img width=150 src="${img}"><br>
   <span>
     ${i+1}) 
     ${d.description} <br> <i>${d.url.split("/")[2]}</i>  
   </span>
</a>
   <br/>
</div>`
  })
}`
```

```js
links = [
  { url: "https://d3js.org", 
   preview: await FileAttachment("d3js.png").url(),
   description: "D3 Homepage"},
  
  { url: "https://observablehq.com/@d3/gallery", 
   description: "D3 Gallery", 
   thumbnail: "1ef827a19d556921d616d53f79fdd6f9eb4d030acb243d70559be3993e4a7292"
  },
  
  { url: "https://observablehq.com/@d3/animated-treemap", 
   thumbnail: "882768da05f294d7eea3aef0e4d5e060b9f9ee542d681772b54341f26b6abfef",
   description: "Animated Treemap"},
  
  { url: "https://observablehq.com/@d3/stacked-to-grouped-bars", 
   thumbnail: "dd31278bae4c99bde3636bda55fc739876540de74f29d7fb04f30e8d2be11029",
   description: "Stacked To Grouped Bars"},
  
  { url: "https://observablehq.com/@d3/streamgraph-transitions", 
    thumbnail: "88cb758abb926ed4bdf56282a1e7a7b33ced1c4324165ff664eecbc06381fc4d",
   description: "Streamgraph Transitions"},
  
  { url: "https://observablehq.com/@d3/cascaded-treemap", 
   thumbnail: "b44b2a0f1f8c422cda333d43d0aa280d9dbf035a3ed8d5679b0bcebe65772672",
   description: "Cascaded Treemap"},
  
  { url: "https://observablehq.com/@mbostock/tree-of-life", 
   thumbnail: "f0d22d1729b7efbceaa9df1790a149c2633bc1444c47e3534188df961a902e66",
   description: "Tree of Life"},
  
  { url: "https://observablehq.com/@d3/sankey-diagram", 
   thumbnail: "6883002e48c6daa9ffece5daf1334e8b6b6437b0e59b7aab37b8e863a650d41b",
   description: "Sankey Diagram"},
  
  { url: "https://observablehq.com/@emamd/animating-lots-and-lots-of-circles-with-regl-js", 
   thumbnail: "2b983cc923ff0931fe6beb171ba28a6019579d4bbd9814861e0f72fa4b8d47eb",
   description: "Animating lots and lots of Circles with regl"},
  
  { url: "https://observablehq.com/@d3/calendar-view", 
   thumbnail: "6aca77339e6635d2e34ba12ea884268908cae0b699f568585aeb380d589cae98",
   description: "Calendar View"},
  { url: "https://observablehq.com/@d3/parallel-coordinates", 
    thumbnail: "9eaa34cbedef4151517474920b9739e9589ab1b9d2abe9f447841a3ef54771dd",
   description: "Parallel Coordinates"},

  {url: "https://pudding.cool/2017/03/hamilton/index.html", 
   preview: await FileAttachment("hamilton.png").url(),
   description: "An Interactive Visualization of Every Line in Hamilton"},
  
  {url: "http://archive.nytimes.com/www.nytimes.com/interactive/2012/11/02/us/politics/paths-to-the-white-house.html?_r=0", 
   preview: await FileAttachment("NYT512paths.png").url(),
   description: "512 Paths to the White House"},
  
  {url: "https://archive.nytimes.com/www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html", 
   preview: await FileAttachment("NYTObamaBudget.png").url(),
   description: "Four Ways to Slice Obama’s 2013 Budget Proposal"},
  
  {url: "https://www.washingtonpost.com/graphics/2018/national/segregation-us-cities/", 
   preview: await FileAttachment("WaPoSegregated@1.png").url(),
   description: "America is more diverse than ever — but still segregated."},
  
  {url: "https://graphics.reuters.com/USA-WILDFIRE/POLLUTION/xlbpgjgervq/index.html", 
  preview: await FileAttachment("ReutersShiftingSmoke@1.png").url(), 
  description: "Shifting Smoke"},
  
  {url:"https://observablehq.com/@attharmirza/the-coronavirus-pandemic-ends-when-this-chart-shrinks-agai", 
   thumbnail: "f51673a7b591921abaf1bf49ca3cbfae816e387b4d44097f0e95f34f7e98490e",
   description: "The Coronavirus Pandemic Ends when this Chart Shrinks Again"},
  
  
  {url: "http://www.r2d3.us/visual-intro-to-machine-learning-part-1/", 
   preview: await FileAttachment("r2d3.png").url(),
   description: "A Visual Introduction to Machine Learning"},
  
  {url: "https://distill.pub", 
   preview: await FileAttachment("distill@1.png").url(),
   description: "Distill Journal"},
  
  {url: "https://distill.pub/2020/communicating-with-interactive-articles/", 
      preview: await FileAttachment("distill-interactives@1.png").url(),
   description: "Communicating with Interactive Articles"},
  
  { url: "https://observablehq.com/@d3/connected-scatterplot", 
   thumbnail: "c15212f9ff847782e2d7737c41d429cb2a04df6b62837df381e69483aeeb0dde",
   description: "Connected Scatterplot"},
  
  { url: "https://observablehq.com/@d3/temporal-force-directed-graph", 
   thumbnail: "5a82bf9ce093b740ecd130a2993f6372f431d92fdb7e3ac6537051304c9cce23",
   description: "Temporal Force Directed Graph"},
  
  { url: "https://observablehq.com/@d3/cascaded-treemap", 
    thumbnail: "b44b2a0f1f8c422cda333d43d0aa280d9dbf035a3ed8d5679b0bcebe65772672",
   description: "Cascaded Treemap"},
  
  { url: "https://observablehq.com/@nitaku/tangled-tree-visualization-ii", 
    thumbnail: "d5dccb8e353ef157a46212eb6a0b169facfdf95f1e10c37140b74f8deca64578",
   description: "Tangled Tree Visualization II"},
  
  { url: "https://observablehq.com/@d3/radial-tidy-tree", 
     thumbnail: "02452067d052d66adffe1cbae750bb0fdbf0209075422cc3815fdd97ae56490f",
   description: "Radial Tidy Tree"},
  
  { url: "https://observablehq.com/@d3/multi-line-chart", 
   thumbnail: "efd2d99f7030626ac0e791b999c847b169ef7572c9956e0fb979ce01fb1ac687",
   description: "Multi-Line Chart"},
  
  { url: "https://observablehq.com/@d3/disjoint-force-directed-graph", 
    thumbnail: "95da8a028dd1b86eb79b41c4aef080222e5374b3c7fea3abf2a1edbc6fe1e52a",
   description: "Disjoint Force Directed Graph"},
  
  { url: "https://observablehq.com/@mbostock/inequality-in-american-cities", 
    thumbnail: "f076409809e006e2dea5108472e803af3b7be295c21c39990fd326083ad19e7b",
   description: "Inequality in American Cities"},
  
  { url: "https://observablehq.com/@d3/parallel-coordinates", 
   thumbnail: "9eaa34cbedef4151517474920b9739e9589ab1b9d2abe9f447841a3ef54771dd",
   description: "Parallel Coordinates"},
  
  {url: "https://observablehq.com/@fil/how-we-made-waves-of-interest", 
    thumbnail: "615aeb68fafe6bbcec64a2bf72d0f726e0f0d2ee37d541acf2e3d5f4844e00c7",
   description: "How We Made Waves of Interest"},
  
  {url: "https://alignedleft.com/tutorials/d3/fundamentals", 
   preview: await FileAttachment("alignedleft.png").url(),
   description: "Scott Murray: Intro to D3"},
  
  { url: "https://observablehq.com/@d3/learn-d3", 
    thumbnail: "6782987c12640214fe1eedf5693751984e9dde1e277f7450436345a307d51067",
   description: "Learn D3"},
  
  { url: "https://observablehq.com/explore", 
   preview: await FileAttachment("observable-explore@1.png").url(),
   description: "Explore Observable"},
  
  { url: "https://www.newline.co/fullstack-d3", 
   preview: await FileAttachment("fullstackd3.png").url(),
   description: "Full-stack D3 Book"},
  
  { url: "https://wattenberger.com/blog/d3", 
   preview: await FileAttachment("wattenberger-d3.png").url(),
   description: "Amelia Wattenberger: Intro to D3"},

  {url: "https://stackoverflow.com/questions/tagged/d3.js", 
   preview: await FileAttachment("stackoverflow.png").url(),
   description: "Stackoverflow d3.js"},
  
  {url: "https://groups.google.com/g/d3-js", 
   preview: await FileAttachment("d3mailinglist.png").url(),
   description: "d3.js Google group mailing list"},
  
  {url: "https://d3-slackin.herokuapp.com/", 
   preview: await FileAttachment("slack.png").url(),
   description: "d3.js Slack"},
  
  {url: "http://www.datasketch.es/", 
   preview: await FileAttachment("datasketches.png").url(),
   description: "Data Sketches by Nadieh Bremer and Shirley Wu"},
  
  {url: "https://observablehq.com/@visionscarto/population-a-la-bertin", 
   thumbnail: "0559a70b0920e984487b62d9e4bb67cc4f034e11cec0558aa54dfc9717ba1ecd",
   description: "Population à la Bertin"},
  
  {url: "https://observablehq.com/@fil/how-we-made-waves-of-interest", 
    thumbnail: "615aeb68fafe6bbcec64a2bf72d0f726e0f0d2ee37d541acf2e3d5f4844e00c7",
   description: "How We Made Waves of Interest"},
  
  {url: "https://observablehq.com/@observablehq/electoral-college-decision-tree", 
    thumbnail: "24815f247f2681428a78d2ca9c18d1b0903795376fa9edfa7db5d46c4615b179",
   description: "Electoral College Decision Tree"},
  
  {url: "https://twitter.com/d3js_org", 
   preview: await FileAttachment("d3twitter.png").url(),
   description: "d3.js Twitter account"},
  
  {url: "https://www.meetup.com/Bay-Area-d3-User-Group/", 
      preview: await FileAttachment("meetup.png").url(),
   description: "d3.js Bay Area Meetup"},
  
  {url: "https://www.meetup.com/D3-Online/", 
      preview: await FileAttachment("d3-online.png").url(),
   description: "d3.js Online Meetup"},
  
  {url: "https://www.youtube.com/results?search_query=d3.js", 
      preview: await FileAttachment("d3youtube.png").url(),
   description: "d3.js Youtube search"},
  
  {url: "https://www.youtube.com/playlist?list=PL-_RDR0qu9VKm1FOWUsV5WMXp0p70kWk5", 
   preview: await FileAttachment("visfest-youtube.png").url(),
   description: "Past d3.js meetup videos"},

    {url: "https://github.com/d3/d3-selection", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-selection"},
  
    {url: "https://observablehq.com/@d3/selection-join", 
      thumbnail: "64258bc4c5e2bf6f7aef08eaff9354909ea4ab2f71fa4b3f8e8deb489cce8b19",
     description: "Selection Join"},
  
    {url: "https://observablehq.com/@d3/styled-axes", 
     thumbnail: "3c9c8fbf7f898adc9d1731044fc902a8ee736e7502de0b2d2f384fb30beaa6db",
     description: "Styled Axes"},
  
    {url: "https://observablehq.com/@d3/axis-ticks", 
     thumbnail: "e31a7268448a19a1e12690ee7774186e61e68f13545c8061de4b95cf60ad0c5e",
     description: "Axis Ticks"},
  
    {url: "https://observablehq.com/@bchoatejr/chained-transition", 
      thumbnail: "ccefd6041a414b95d3128c192adeb0c14f33725268a63b2e8057e8547aa46b0e",
     description: "Chained Transition"},
  
  {url: "https://github.com/d3/d3-ease", 
  preview: await FileAttachment("github.png").url(),
   description: "d3-ease"},
  
    {url: "https://github.com/d3/d3-interpolate", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-interpolate"},
  
    {url: "https://github.com/d3/d3-timer", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-timer"},
  
    {url: "https://github.com/d3/d3-scale", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-scale"},
  
    {url: "https://observablehq.com/@mkfreeman/animated-scale-diagram", 
     thumbnail: "21925b3efda12f33a768b49e509786024d3fb45583f95eff3a84eaf00490edfb",
     description: "Animated Scale Diagram"},
  
    {url: "https://github.com/d3/d3-array", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-array"},
    {url: "https://github.com/d3/d3-fetch", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-fetch"},
    {url: "https://github.com/d3/d3-dsv", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-dsv"},
  
    {url: "https://github.com/d3/d3-force", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-force"},
  {url: "https://github.com/d3/d3-hierarchy", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-hierarchy"},
  {url: "https://github.com/d3/d3-chord", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-chord"},
  
  {url: "https://github.com/d3/d3-shape", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-shape"},
  {url: "https://github.com/d3/d3-path", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-path"},
  {url: "https://github.com/d3/d3-contour", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-contour"},
    {url: "https://github.com/d3/d3-delaunay", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-delaunay"},
  
  {url: "https://github.com/d3/d3-color", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-color"},
  
  {url: "https://github.com/d3/d3-scale-chromatic", 
      preview: await FileAttachment("github.png").url(),
   description: "d3-scale-chromatic"},
  
    {url: "https://observablehq.com/@d3/programmatic-zoom", 
      thumbnail: "fa85c92d2157e1d442e8209a477d92ac6bc3bcca5e47bed6331394f57fd32eed",
     description: "Programmatic Zoom"},
  
  {url: "https://github.com/d3/d3-zoom", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-zoom"},
  
  {url: "https://github.com/d3/d3-brush", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-brush"},
  
{url: "https://github.com/d3/d3-drag", 
 preview: await FileAttachment("github.png").url(),
 description: "d3-drag"},
  
{url: "https://github.com/d3/d3-geo", 
 preview: await FileAttachment("github.png").url(),
 description: "d3-geo"},
  
  {url: "https://observablehq.com/@d3/projection-comparison", 
   thumbnail: "9596c59b75461eab2e17f406c7caa6b0574e64e74aacab392167bf7eb469f6d1",
   description: "Projection Comparison"},

  {url: "https://github.com/d3/d3-time", 
   preview: await FileAttachment("github.png").url(),
   description: "d3-time"},
  
    {url: "https://observablehq.com/@d3/calendar-view", 
      thumbnail: "6aca77339e6635d2e34ba12ea884268908cae0b699f568585aeb380d589cae98",
     description: "Calendar View"},
  
    {url: "https://github.com/d3/d3-format", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-format"},
  
    {url: "https://github.com/d3/d3-time-format", 
     preview: await FileAttachment("github.png").url(),
     description: "d3-time-format"},
  
    {url: "https://medium.com/@enjalot/the-hitchhikers-guide-to-d3-js-a8552174733a", 
     preview: await FileAttachment("d3map.png").url(),
     description: "Hitchhiker's Guide to d3.js"},

    
]
```

```js
// md`${links.map((d,i) => {
//    return `${i+1}) [${d.description}](${d.url}) - *${d.url}*  \n`
//   })
// }`
```
