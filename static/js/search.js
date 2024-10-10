/*
 * From https://www.redblobgames.com/pathfinding/
 * Copyright 2013, 2022 Red Blob Games <redblobgames@gmail.com>
 * @license: Apache-2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 */

// **********************************************************************
//
//
// NOTE:
// This code is designed for generating diagrams and is not necessarily
// the best way to implement the search algorithms in your own project.
//
// If you want to see code that you can use in your own project, see
// <https://www.redblobgames.com/pathfinding/a-star/implementation.html>
//
//
//
// ********************************************************************************

import { Graph, SquareGrid } from "./grid.js";

// The search algorithm takes a set of start points, graph
// (read-only), and a map (read-write). We'll annotate the map with
// 'reached', 'visit_order', 'steps', 'cost_so_far', 'parent',
// 'started_at', 'sort_key'. The algorithm modifies map
// in place, and returns its internal state at the time it stopped.
export class SearchState {
  constructor(steps, current, frontier, neighbors) {
    this.steps = steps;
    this.current = current;
    this.frontier = frontier;
    this.neighbors = neighbors;
  }
}

export class SearchOptions {
  // - starts (required) - list of start points
  // - exit_now function (optional) - return true if it's time to early exit
  // - sort_key (optional) - return a number for sorting the priority queue
  // - allow_reprioritize - true in general, but needs to be set to false for greedy best first search (ugly hack)
  constructor(
    starts = [],
    exit_now = (_) => false,
    sort_key = (id, node) => node.cost_so_far,
    search_setup = () => undefined,
  ) {
    this.allow_reprioritize = true;
    this.starts = starts;
    this.exit_now = exit_now;
    this.sort_key = sort_key;
    this.search_setup = search_setup;
  }
}

export function search(options, graph, map) {
  let ss = new SearchState(0, -1, options.starts.concat(), []);
  ss.frontier.forEach((id, i) => {
    map[id].reached = true;
    map[id].visit_order = i;
    map[id].steps = 0;
    map[id].cost_so_far = 0;
    map[id].parent = undefined;
    map[id].started_at = id;
    map[id].sort_key = options.sort_key(id, map[id]);
  });

  // For the interactive diagram, I need stable sorting, so I keep a
  // counter for the elements inserted into the frontier. Note that
  // for a real project you probably don't need stable sorting, and
  // should use a proper priority queue data structure instead of an
  // array (whether sorted or unsorted).
  let visit_order = ss.frontier.length;

  while (ss.frontier.length > 0) {
    ss.steps++;
    ss.frontier.sort((a, b) =>
      map[a].sort_key == map[b].sort_key
        ? map[a].visit_order - map[b].visit_order
        : map[a].sort_key - map[b].sort_key,
    );
    ss.current = ss.frontier.shift();
    ss.neighbors = graph.edges_from(ss.current);

    if (options.exit_now(ss, map)) {
      break;
    }

    ss.neighbors.forEach((next) => {
      let new_cost_so_far =
        map[ss.current].cost_so_far + graph.edge_weight(ss.current, next);
      if (
        !map[next].reached ||
        (options.allow_reprioritize &&
          map[next].reached &&
          new_cost_so_far < map[next].cost_so_far)
      ) {
        if (ss.frontier.indexOf(next) < 0) {
          ss.frontier.push(next);
        }
        map[next].reached = true;
        map[next].visit_order = visit_order++;
        map[next].steps = map[ss.current].steps + 1;
        map[next].cost_so_far = new_cost_so_far;
        map[next].parent = ss.current;
        map[next].started_at = map[ss.current].started_at;
        map[next].sort_key = options.sort_key(next, map[next]);
      }
    });
  }

  if (ss.frontier.length == 0) {
    // We actually finished the search, so internal state no
    // longer applies. NOTE: this code "smells" bad to me and I
    // should revisit it. I think I am missing one step of the iteration.
    ss.current = -1;
    ss.neighbors = [];
  }
  return ss;
}

function test_search() {
  function test(a, b) {
    a = JSON.stringify(a);
    b = JSON.stringify(b);
    if (a != b) console.log("FAIL", a, "should be", b);
  }

  let G, map, ret, options;

  options = new SearchOptions();

  // Test full exploration with no early exit
  G = new SquareGrid(2, 2);
  map = Array.from({ length: G.num_nodes }, (_) => ({}));
  ret = search(new SearchOptions([0]), G, map);
  test(map[3].cost_so_far, 2);
  test(map[1].parent, 0);
  test(ret.frontier, []);
  test(ret.neighbors, []);
  test(ret.current, -1);

  // Test grid with obstacles
  G = new SquareGrid(2, 2);
  G.set_tile_weight(1, Infinity);
  G.set_tile_weight(2, Infinity);
  map = Array.from({ length: G.num_nodes }, (_) => ({}));
  ret = search(new SearchOptions([0]), G, map);
  test(map[3].cost_so_far, undefined);
  test(map[1].parent, undefined);
  test(ret.frontier, []);
  test(ret.neighbors, []);
  test(ret.current, -1);

  // Test early exit
  G = new SquareGrid(2, 2);
  G.set_tile_weight(2, Infinity);
  map = Array.from({ length: G.num_nodes }, (_) => ({}));
  ret = search(new SearchOptions([0], (s) => s.current == 1), G, map);
  test(map[3].cost_so_far, undefined);
  test(map[1].parent, 0);
  test(ret.frontier, []);
  test(ret.neighbors, []);
  test(ret.current, -1);
}

test_search();
