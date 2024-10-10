/*
 * From https://www.redblobgames.com/pathfinding-canvas/all-pairs/
 * Copyright 2014, 2020 Red Blob Games <redblobgames@gmail.com>
 * License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 * I had originally implemented Floyd-Warshall for all-pairs paths. It
 * was reasonable but then I tried Breadth First Search and it ran
 * much much faster. It's not a substitute for all problems, since it
 * doesn't handle edge weights, but it made the demo run at interactive
 * speeds.
 *
 */

import { SearchOptions } from "./search.js";
import { SquareGrid, SquareGridLayout } from "./grid.js";
import { Diagram, Layers, clamp, lerp } from "./diagram.js";

let global_dist = [],
  global_next = [];

function init_datatable(dist, next, N) {
  // reuse these tables each calculation
  for (let i = 0; i < N; i++) {
    dist.push(new Int32Array(N));
    next.push(new Int32Array(N));
  }
  return { dist, next };
}

function multiple_bfs(dist, next, graph) {
  // next[i][j] means if you are at j and want to get to i, what is the next node?
  console.time("bfs");
  let queue = [];

  let N = graph.num_nodes;
  if (dist.length === 0) {
    init_datatable(dist, next, N);
  }

  // collect edges in an array of arrays
  let edges = [];
  for (let id = 0; id < N; id++) {
    edges[id] = graph.edges_from(id);
  }

  for (let id = 0; id < N; id++) {
    // we need a queue and an output array; avoid allocation by reusing them
    queue.splice(0);
    let came_from = next[id];
    came_from.fill(-1);

    // run bfs from id to find paths to all locations
    let queue_pos = 0;
    queue.push(id);
    came_from[id] = id;
    while (queue_pos < queue.length) {
      let current = queue[queue_pos++];
      for (let next of edges[current]) {
        if (came_from[next] === -1) {
          came_from[next] = current;
          queue.push(next);
        }
      }
    }
  }

  // NOTE: we could but don't compute the distances because we don't
  // use them in the visualization; floyd-warshall has to compute
  // the distances to work
  console.timeEnd("bfs");
}

// Based on <http://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm>
function floyd_warshall(dist, next, graph) {
  // next[i][j] means if you are at j and want to get to i, what is the next node?
  console.time("floyd-warshall");
  const MAX_WEIGHT = 1000000000;
  let N = graph.num_nodes;
  if (dist.length === 0) {
    init_datatable(dist, next, N);
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      dist[i][j] = i === j ? 0 : MAX_WEIGHT;
      next[i][j] = -1;
    }
  }

  graph.all_edges().forEach((edge) => {
    let id1 = edge[0],
      id2 = edge[1];
    dist[id1][id2] = graph.edge_weight(id1, id2);
    next[id1][id2] = id1;
  });

  for (let k = 0; k < N; k++) {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let w = dist[i][k] + dist[k][j];
        if (w < dist[i][j]) {
          dist[i][j] = w;
          next[j][i] = next[k][i];
        }
      }
    }
  }

  console.timeEnd("floyd-warshall");
}

/* HACK: use a layer to calculate additional data */
function allPairsLayer() {
  return {
    draw(ctx, ss, map) {
      // floyd_warshall(global_dist, global_next, this.graph);
      multiple_bfs(global_dist, global_next, this.graph);
      let paths = global_next;

      // Figure out how often each location is used for all paths
      let N = this.graph.num_nodes;
      let max = 0;
      for (let id = 0; id < N; id++) {
        map[id].count = 0;
      }

      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          // Now trace the path from i to j, and increment
          // counts at each location
          for (let k = i; k !== -1 && k !== j; k = paths[j][k]) {
            map[k].count++;
            if (map[k].count > max) {
              max = map[k].count;
            }
          }
        }
      }
    },
  };
}

/* Viridis color scale from
   https://github.com/politiken-journalism/scale-color-perceptual
   Copyright (c) 2015, Politiken Journalism <emil.bay@pol.dk>
   License: ISC
*/
function viridisColorScale() {
  return [
    "#440154",
    "#440256",
    "#450457",
    "#450559",
    "#46075a",
    "#46085c",
    "#460a5d",
    "#460b5e",
    "#470d60",
    "#470e61",
    "#471063",
    "#471164",
    "#471365",
    "#481467",
    "#481668",
    "#481769",
    "#48186a",
    "#481a6c",
    "#481b6d",
    "#481c6e",
    "#481d6f",
    "#481f70",
    "#482071",
    "#482173",
    "#482374",
    "#482475",
    "#482576",
    "#482677",
    "#482878",
    "#482979",
    "#472a7a",
    "#472c7a",
    "#472d7b",
    "#472e7c",
    "#472f7d",
    "#46307e",
    "#46327e",
    "#46337f",
    "#463480",
    "#453581",
    "#453781",
    "#453882",
    "#443983",
    "#443a83",
    "#443b84",
    "#433d84",
    "#433e85",
    "#423f85",
    "#424086",
    "#424186",
    "#414287",
    "#414487",
    "#404588",
    "#404688",
    "#3f4788",
    "#3f4889",
    "#3e4989",
    "#3e4a89",
    "#3e4c8a",
    "#3d4d8a",
    "#3d4e8a",
    "#3c4f8a",
    "#3c508b",
    "#3b518b",
    "#3b528b",
    "#3a538b",
    "#3a548c",
    "#39558c",
    "#39568c",
    "#38588c",
    "#38598c",
    "#375a8c",
    "#375b8d",
    "#365c8d",
    "#365d8d",
    "#355e8d",
    "#355f8d",
    "#34608d",
    "#34618d",
    "#33628d",
    "#33638d",
    "#32648e",
    "#32658e",
    "#31668e",
    "#31678e",
    "#31688e",
    "#30698e",
    "#306a8e",
    "#2f6b8e",
    "#2f6c8e",
    "#2e6d8e",
    "#2e6e8e",
    "#2e6f8e",
    "#2d708e",
    "#2d718e",
    "#2c718e",
    "#2c728e",
    "#2c738e",
    "#2b748e",
    "#2b758e",
    "#2a768e",
    "#2a778e",
    "#2a788e",
    "#29798e",
    "#297a8e",
    "#297b8e",
    "#287c8e",
    "#287d8e",
    "#277e8e",
    "#277f8e",
    "#27808e",
    "#26818e",
    "#26828e",
    "#26828e",
    "#25838e",
    "#25848e",
    "#25858e",
    "#24868e",
    "#24878e",
    "#23888e",
    "#23898e",
    "#238a8d",
    "#228b8d",
    "#228c8d",
    "#228d8d",
    "#218e8d",
    "#218f8d",
    "#21908d",
    "#21918c",
    "#20928c",
    "#20928c",
    "#20938c",
    "#1f948c",
    "#1f958b",
    "#1f968b",
    "#1f978b",
    "#1f988b",
    "#1f998a",
    "#1f9a8a",
    "#1e9b8a",
    "#1e9c89",
    "#1e9d89",
    "#1f9e89",
    "#1f9f88",
    "#1fa088",
    "#1fa188",
    "#1fa187",
    "#1fa287",
    "#20a386",
    "#20a486",
    "#21a585",
    "#21a685",
    "#22a785",
    "#22a884",
    "#23a983",
    "#24aa83",
    "#25ab82",
    "#25ac82",
    "#26ad81",
    "#27ad81",
    "#28ae80",
    "#29af7f",
    "#2ab07f",
    "#2cb17e",
    "#2db27d",
    "#2eb37c",
    "#2fb47c",
    "#31b57b",
    "#32b67a",
    "#34b679",
    "#35b779",
    "#37b878",
    "#38b977",
    "#3aba76",
    "#3bbb75",
    "#3dbc74",
    "#3fbc73",
    "#40bd72",
    "#42be71",
    "#44bf70",
    "#46c06f",
    "#48c16e",
    "#4ac16d",
    "#4cc26c",
    "#4ec36b",
    "#50c46a",
    "#52c569",
    "#54c568",
    "#56c667",
    "#58c765",
    "#5ac864",
    "#5cc863",
    "#5ec962",
    "#60ca60",
    "#63cb5f",
    "#65cb5e",
    "#67cc5c",
    "#69cd5b",
    "#6ccd5a",
    "#6ece58",
    "#70cf57",
    "#73d056",
    "#75d054",
    "#77d153",
    "#7ad151",
    "#7cd250",
    "#7fd34e",
    "#81d34d",
    "#84d44b",
    "#86d549",
    "#89d548",
    "#8bd646",
    "#8ed645",
    "#90d743",
    "#93d741",
    "#95d840",
    "#98d83e",
    "#9bd93c",
    "#9dd93b",
    "#a0da39",
    "#a2da37",
    "#a5db36",
    "#a8db34",
    "#aadc32",
    "#addc30",
    "#b0dd2f",
    "#b2dd2d",
    "#b5de2b",
    "#b8de29",
    "#bade28",
    "#bddf26",
    "#c0df25",
    "#c2df23",
    "#c5e021",
    "#c8e020",
    "#cae11f",
    "#cde11d",
    "#d0e11c",
    "#d2e21b",
    "#d5e21a",
    "#d8e219",
    "#dae319",
    "#dde318",
    "#dfe318",
    "#e2e418",
    "#e5e419",
    "#e7e419",
    "#eae51a",
    "#ece51b",
    "#efe51c",
    "#f1e51d",
    "#f4e61e",
    "#f6e620",
    "#f8e621",
    "#fbe723",
    "#fde725",
  ];
}

/* Paint using a gradient */
function paintGradient(field, scale) {
  const viridis = viridisColorScale();
  return {
    [Infinity]: { fillStyle: "#eee" },
    override(ctx, ss, map, id) {
      if (map[id].tile_weight === 1) {
        let t = clamp(map[id][field] / scale, 0, 1);
        t = Math.pow(t, 0.3);
        ctx.fillStyle = viridis[(t * (viridis.length - 1)) | 0];
      }
    },
  };
}

function makeDiagram(el, graph) {
  let layout = new SquareGridLayout(graph, 20);
  let options = new SearchOptions([graph.to_id(8, 7)]);
  let diagram = new Diagram(
    el,
    graph,
    options,
    layout,
    allPairsLayer(),
    Layers.base(paintGradient("count", 60000)),
    // Layers.numericLabels('count', "black", (x, id) => graph.tile_weight(id) === Infinity? "" : (x/2500).toFixed(1)),
    Layers.editable(),
  );
}

function makeDiagramOpenWorld() {
  let graph = new SquareGrid(30, 15);
  [
    8, 9, 18, 19, 23, 38, 39, 48, 49, 53, 68, 69, 78, 79, 83, 98, 99, 108, 109,
    113, 158, 159, 168, 169, 173, 188, 189, 198, 199, 203, 204, 205, 206, 207,
    208, 209, 218, 219, 228, 229, 248, 249, 258, 259, 278, 279, 288, 289, 308,
    309, 318, 319, 368, 369, 378, 379, 398, 399, 408, 409, 428, 429, 438, 439,
  ].forEach((id) => graph.set_tile_weight(id, Infinity));
  makeDiagram("#diagram-openworld", graph);
  //     setInterval(() => {
  //         document.querySelector("pre").textContent = JSON.stringify(graph.tiles_with_given_weight());
  //     }, 3000);
}

function makeDiagramRooms() {
  let graph = new SquareGrid(30, 15);
  [
    5, 12, 13, 14, 15, 16, 17, 23, 35, 42, 45, 53, 65, 72, 75, 77, 83, 102, 105,
    107, 113, 125, 132, 135, 137, 150, 151, 152, 153, 154, 155, 156, 158, 159,
    161, 162, 165, 167, 173, 182, 189, 191, 192, 193, 195, 197, 198, 199, 200,
    201, 202, 203, 204, 205, 206, 207, 208, 209, 219, 230, 235, 240, 241, 242,
    249, 251, 252, 253, 254, 256, 257, 258, 260, 265, 279, 281, 286, 287, 288,
    295, 304, 305, 306, 307, 308, 309, 311, 316, 317, 318, 319, 320, 325, 334,
    341, 346, 347, 348, 349, 350, 364, 366, 371, 376, 380, 385, 394, 396, 401,
    406, 415, 426, 431, 436, 440, 445,
  ].forEach((id) => graph.set_tile_weight(id, Infinity));
  makeDiagram("#diagram-rooms", graph);
}

makeDiagramOpenWorld();
makeDiagramRooms();
