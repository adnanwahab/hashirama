// Grid generator for https://www.redblobgames.com/pathfinding/
// Copyright 2014 Red Blob Games
// License: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

// Graph class.
//
// Weights are assigned to *nodes* not *edges*, but the pathfinder
// will need edge weights, so we treat an edge A->B as having the
// weight of tile B. If a tile weight is Infinity we don't expose
// edges to it.
export class Graph {
  constructor(num_nodes) {
    this.num_nodes = num_nodes;
    this._edges = []; // node id to list of node ids
    this._weights = []; // node id to number (could be Infinity)
    this._observers = []; // functions to call when data changes
    for (let id = 0; id < num_nodes; id++) {
      this._weights[id] = 1;
      this._edges[id] = [];
    }
  }

  /** Array of all node ids */
  ids() {
    return Array.from({ length: this.num_nodes }, (_, id) => id);
  }

  // Weights are given to tiles, not edges, but the search interface
  // will only ask about edges. Weight of edge id1->id2 is of tile id2.

  tile_weight(id) {
    return this._weights[id];
  }

  set_tile_weight(id, w) {
    if (this._weights[id] !== w) {
      this._weights[id] = w;
      this.notify_observers();
    }
  }

  tiles_less_than_weight(w = Infinity) {
    return Array.from({ length: this.num_nodes }, (_, id) => id).filter(
      (id) => this._weights[id] < w,
    );
  }

  tiles_with_given_weight(w = Infinity) {
    return Array.from({ length: this.num_nodes }, (_, id) => id).filter(
      (id) => this._weights[id] === w,
    );
  }

  edge_weight(id1, id2) {
    if (!this.has_edge(id1, id2)) {
      return Infinity;
    }
    if (this._weights[id2] === undefined) {
      return 1;
    }
    return this._weights[id2];
  }

  // Is there an edge from id1 to id2?
  has_edge(id1, id2) {
    return this._edges[id1] && this._edges[id1].indexOf(id2) >= 0;
  }

  // Array of id2 where there exists an edge id1→id2
  edges_from(id1) {
    let edges = this._edges[id1].filter(
      (id2) => this.tile_weight(id2) !== Infinity,
    );
    return edges;
  }

  // All edges as a list of [id1, id2], where the tile weight < maxWeight
  all_edges(maxWeight = Infinity) {
    let all = [];
    for (let id1 = 0; id1 < this.num_nodes; id1++) {
      if (this.tile_weight(id1) < maxWeight) {
        this._edges[id1].forEach((id2) => {
          if (this.tile_weight(id2) < maxWeight) {
            all.push([id1, id2]);
          }
        });
      }
    }
    return all;
  }

  // Observers get notified when the graph changes
  notify_observers() {
    this._observers.forEach((f) => f());
  }
  add_observer(f) {
    this._observers.push(f);
    f();
  }

  // Make a proxy graph object, to share some things but override
  // some methods for comparison diagrams
  make_proxy() {
    return Object.create(this);
  }
}

// Each graph type is paired with a layout that maps ids to positions and shapes
export class GraphLayout {
  constructor(graph, SCALE) {
    this.graph = graph;
    this.SCALE = SCALE;
  }

  // Return min/max x/y for the entire graph; caller needs size and
  // offset. Always include 0,0 in the range.
  coordinate_range() {
    let min = [0, 0];
    let max = [-Infinity, -Infinity];
    for (let id = 0; id < this.graph.num_nodes; id++) {
      let center = this.tile_center(id);
      let path = this.tile_shape(id);
      for (let j = 0; j < path.length; j++) {
        for (let axis = 0; axis < 2; axis++) {
          min[axis] = Math.min(min[axis], center[axis] + path[j][axis]);
          max[axis] = Math.max(max[axis], center[axis] + path[j][axis]);
        }
      }
    }
    return { min, max };
  }

  // Override these in the child class
  tile_center(id) {
    return [0, 0];
  }
  tile_shape(id) {
    return [[0, 0]];
  }
  pixel_to_tile(coord) {
    return -1;
  }
}

// Generate a grid of squares, to be used as a graph.
export class SquareGrid extends Graph {
  // The class creates the structure of the grid; the client can
  // directly set the weights on nodes.
  constructor(W, H) {
    super(W * H);
    this.W = W;
    this.H = H;
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        let id = this.to_id(x, y);
        SquareGrid.DIRS.forEach((dir) => {
          let x2 = x + dir[0],
            y2 = y + dir[1];
          if (this.valid(x2, y2)) {
            this._edges[id].push(this.to_id(x2, y2));
          }
        });
      }
    }
  }

  edges_from(id1) {
    let edges = super.edges_from(id1);
    let xy = this.from_id(id1);
    if ((xy[0] + xy[1]) % 2 === 0) {
      // This is purely for aesthetic purposes on grids -- using a
      // checkerboard pattern, flip every other tile's edges so
      // that paths along diagonal lines end up stairstepping
      // instead of doing all east/west movement first and then
      // all north/south.
      edges.reverse();
    }
    return edges;
  }

  // Encode/decode grid locations (x,y) to integers (id)
  valid(x, y) {
    return 0 <= x && x < this.W && 0 <= y && y < this.H;
  }
  to_id(x, y) {
    x = Math.min(this.W - 1, Math.max(0, x));
    y = Math.min(this.H - 1, Math.max(0, y));
    return x + y * this.W;
  }
  from_id(id) {
    return [id % this.W, Math.floor(id / this.W)];
  }
}
SquareGrid.DIRS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export class SquareGridLayout extends GraphLayout {
  // Layout -- square tiles
  xy_scaled(xy) {
    return [xy[0] * this.SCALE, xy[1] * this.SCALE];
  }

  tile_center(id) {
    return this.xy_scaled(this.graph.from_id(id));
  }

  tile_shape(id) {
    let S = this.SCALE;
    return [
      [-S / 2, -S / 2],
      [-S / 2, S / 2 - 1],
      [S / 2 - 1, S / 2 - 1],
      [S / 2 - 1, -S / 2],
    ];
  }

  pixel_to_tile(coord) {
    return this.graph.to_id(
      Math.round(coord[0] / this.SCALE),
      Math.round(coord[1] / this.SCALE),
    );
  }
}
