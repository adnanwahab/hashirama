import {html} from "npm:htl";
import * as Inputs from "npm:@observablehq/inputs";
import * as Plot from "npm:@observablehq/plot";

// cluster is the cluster index
export function clusterCard(cluster, {
  description, 
  plot,
  tableConfig, 
  da, 
  scope,
  hulls,
  r = 3
} = {}) {
  const cda = da.filter(d => d.cluster == cluster)
  return html`<div class="cluster-card grid grid-cols-1">
  <div class="card">
    <h2>Cluster ${cluster}: ${scope.cluster_labels_lookup[cluster].label}</h2>
    <h3>${cda.length} rows</h3>
    <div class="cluster-content grid grid-cols-3">
      <div class="cluster-plot">
      ${
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
          Plot.hull(hulls.flatMap(d => d), {
            filter: d => d.cluster == cluster,
            x: "x",
            y: "y",
            fill: "cluster",
            fillOpacity: 0.25,
            stroke: "black",
            strokeWidth: 2,
            curve: "catmull-rom",
          }),
          Plot.dot(da, {
            filter: d => d.cluster == cluster,
            x: "x",
            y: "y",
            fill: "cluster",
            r,
            title: scope.dataset.text_column,
            tip: true
          }),
        ],
        width: 300,
        height: 300,
        color: { scheme: "cool" },
        y: { axis: null},
        x: { axis: null },
        tip: {
          format: {
            cluster: true,
            title: true
          }
        }
      })
      }
      </div>
      <div class="cluster-description">
      ${description}
      </div>
      <div class="cluster-diagram">
      ${plot}
      </div>
    </div>
    <div class="static-table">
      ${Inputs.table(cda, tableConfig)}
    </div>
</div>`
}

