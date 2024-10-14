# AoC 12: shortest path under constraints

Advent of Code [#12](https://adventofcode.com/2022/day/12). Find the shortest path, with the constraint that we can _climb_ at most 1 level at each step (but we can go down without constraint). Note: with this terrain, it ends up being faster to compute backwards, as this avoids getting into the ponds of level *a* that are surrounded by *c*, and thus are dead-ends. In the forward direction only a few paths are cut short by the constraint.

```js
viewof backwards = Inputs.toggle({ label: "go backwards?" })
```

```js
viewof steps = Inputs.radio(
  new Map([
    ["step by step", 1],
    ["smooth", 20],
    ["quick", 200],
    ["instant", 100000]
  ]),
  { value: 200 }
)
```

```js
Plot.plot({
  projection: {
    type: "reflect-y",
    domain: contours[0],
    insetLeft: 3,
    insetBottom: 3
  },
  marks: [
    Plot.geo(contours, {
      fill: "value",
      dx: -3,
      dy: 3,
      title: (d) => String.fromCharCode(97 + d.value)
    }), // using Plot.geo for performance!
    Plot.geo(
      {
        type: "MultiLineString",
        coordinates: Array.from(state.tree, ([d, e]) => [
          [d % w, (d / w) | 0],
          [e % w, (e / w) | 0]
        ])
      },
      { strokeWidth: 0.2 }
    ),
    Plot.dot([bestA], {
      x: ({ i }) => i % w,
      y: ({ i }) => (i / w) | 0,
      filter: ({ cost }) => isFinite(cost),
      fill: "orange"
    }),
    Plot.line(state.walk, {
      x: (d) => d % w,
      y: (d) => (d / w) | 0,
      curve: "basis",
      stroke: "steelblue"
    }),
    Plot.dot(state.active, {
      x: (d) => d % w,
      y: (d) => (d / w) | 0,
      fill: "red"
    }),
    Plot.dot([terrain.start, terrain.end], {
      x: (d) => d % w,
      y: (d) => (d / w) | 0,
      fill: "steelblue",
      symbol: "square"
    })
  ],
  width: 928,
  height: 237,
  color: { scheme: "greys" },
  axis: null
})
```

For part 2, go backwards. The orange dot is the best location with elevation _a_.

```js echo
// part 2
bestA = d3.least(
  Array.from(state.costs, (cost, i) => ({ cost, i })),
  ({ cost, i }) => (V[i] === 0 ? cost : Infinity)
)
```

```js echo
state.costs
```

```js echo
state.time
```

```js echo
state.perf // performance.now
```

```js echo
state.costs[terrain[backwards ? "start" : "end"]]
```

```js echo
w = input.split("\n")[0].length
```

```js echo
h = input.split("\n").length
```

```js echo
terrain = {
  let start, end;
  const V = Array.from(input.replaceAll("\n", ""));
  for (let i = 0; i < V.length; ++i) {
    if (V[i] === "S") (start = i), (V[i] = "a"); // start S is a
    else if (V[i] === "E") (end = i), (V[i] = "z"); // end E is z
    V[i] = V[i].charCodeAt(0) - 97;
  }
  return { V, start, end };
}
```

```js echo
V = terrain.V
```

```js echo
// Compute these contours once, rather than thousands of rect elements with Plot.cell
contours = d3.contours().size([w, h]).thresholds(25).smooth(false)(V)
```

```js echo
state = {
  const [S, E] = backwards
    ? [terrain.end, terrain.start]
    : [terrain.start, terrain.end];

  // The tree is just here to draw on the map, but not needed for the computation.
  function walk(tree, active) {
    let node = d3.least(active, (d) =>
      Math.hypot((d % w) - (E % w), ((d / w) | 0) - ((E / w) | 0))
    );
    const path = [node];
    while (tree.has(node)) path.push((node = tree.get(node)));
    return path;
  }

  const tree = new Map();
  // Tested with a priority queue and A* in https://observablehq.com/@fil/advent-of-code-12@506;
  // and it doesn't help
  const active = new Set([S]);
  const costs = new Array(V.length).fill(Infinity);
  costs[S] = 0;

  let t = 0;
  const t0 = performance.now();
  do {
    const node = active.values().next().value; // get first
    active.delete(node);
    const x = node % w;
    const y = (node / w) | 0;
    for (const nei of [
      x > 0 && node - 1,
      x < w - 1 && node + 1,
      y > 0 && node - w,
      y < h - 1 && node + w
    ]) {
      // ignore neighbor outside the map
      if (nei === false) continue;

      // acceptable neighbor: max 1 step _up_
      if ((backwards ? -1 : 1) * (V[nei] - V[node]) <= 1) {
        const c = costs[node] + 1;
        if (c < costs[nei]) {
          costs[nei] = c;
          active.add(nei);
          tree.set(nei, node);
        }
      }
    }
    if (++t % steps === 0) {
      yield { costs, active, tree, time: t, walk: walk(tree, active) };
    }
  } while (active.size);
  const perf = performance.now() - t0;
  yield { costs, active, tree, time: t, walk: walk(tree, [E]), perf };
}
```

```js
input = `abcccaaaaacccacccccccccccccccccccccccccccccccccccccccccccccccccccccccaaaaaacaccccccaaacccccccccccccccccccccccccccccccccccaaaaaaaaccccccccccccccccccccccccccccccccaaaaaa
abcccaaaaacccaaacaaacccccccccccccccccaaccccccacccaacccccccccccaacccccaaaaaaaaaaaccaaaaaaccccccccccccccccccccccccccccccccccaaaaaccccccccccccccccccccccccccccccccccaaaaaa
abccccaaaaaccaaaaaaaccccccccccccccaaaacccccccaacaaacccccccccaaaaaacccaaaaaaaaaaaccaaaaaacccccccccccccccccccccccccccccccccccaaaaaccccccccccccccaaacccccccccccccccccaaaaa
abccccaacccccaaaaaacccccccccccccccaaaaaacccccaaaaaccccccccccaaaaaacaaaaaaaaaaaaaccaaaaaacccccccccccccccccccccccccccccccccccaacaaccccccccccccccaaaaccccccccccccccccccaaa
abccccccccccaaaaaaaacccccccccccaaccaaaaaccccccaaaaaacccccccccaaaaacaaaaaaaaccccccccaaaaacccccccccccccccccccccccccccccccccccaacccccccccccccccccaaaaccaaacccccccccccccaac
abaaaaaccccaaaaaaaaaaccccccaaccaacaaaaacccccaaaaaaaaaaacccccaaaaacaaaacaaaaacccccccaacaacccccccccccccccccccccccccccccccccccccccccccccccccccccccaaaaaaaaacccccccccccaaac
abaaaaaccccaaaaaaaaaacaacccaaaaaacaccaacccccaaaaaaaaaaacccccaaaaaccccccaaaaaccccccccccaacccccccccccccccccccccccccccccccccccccccccccccccccccccccaaaakkkllccccccccccccccc
abaaaaacccccccaaacaaaaaaccccaaaaaaaccccccaaacccaacccaaaaaaacccccccccccccaaaaacccccccccaaaaaaccccccccccccccccccccccccccaaccccccccccccccccccccccackkkkkklllccccaaaccccccc
abaaaaacccccccaaacaaaaaaacccaaaaaaaccccccaaaacaaacaaaaaaaacccccccccccccaaaaaacccccccccaaaaaaccaacaacccccccccccccccaaaaaacccccccccccccccccccaaakkkkkkkkllllcccaaacaccccc
abaaaaaccccccccaacaaaaaaaacaaaaaaccccccccaaaaaaacaaaaaaaaacccccccccccccaaaacccccccccaaaaaaacccaaaaacccccccccccccccaaaaaaccccccccccccccccjjjjjkkkkkkpppplllcccaaaaaacccc
abaaaccccccccccccccaaaaaaacaaaaaacccccccccaaaaaaccaaaaaaaccccccccccccccccaaaccccccccaaaaaaaccccaaaaacccccccccccccccaaaaaaaccccaaccccccjjjjjjjkkkkppppppplllcccaaaaacccc
abccccccccccccccccaaaaaacccccccaaccccccaaaaaaaacccccaaaaaaccccccccccccccccccccccccccccaaaaaaccaaaaaacccccccccccccccaaaaaaaaaacaacccccjjjjjjjjjkooppppppplllcccaaacccccc
abccccccccccccccccaaaaaacccccccccccccccaaaaaaaaacccaaacaaacccccccccccccccccccccccaaaccaaccaaccaaaaccccccccccccccccaaaaaaaccaaaaaccccjjjjooooooooopuuuupppllccccaaaccccc
abccccccccccccccccccccaaccccccccccccccccaaaaaaaacccaaaccaacccccccccccccccccccccccaaaaaaacccccccaaaccccccccccccccccaaaaaaccccaaaaaaccjjjoooooooooouuuuuupplllccccaaccccc
abccaaaaccccaaacccccccccccccccccccccccccccaaaaaaaccaaccccccccccccaacccccccccccccccaaaaacccaaccaaaccccccccccccccccccccaaacccaaaaaaaccjjjoootuuuuuuuuuuuuppllllccccaccccc
abccaaaaaccaaaacccccccccccccccccccccccccccaacccacccccccccccccccacaaaacccccccccccaaaaaaacccaaaaaaacccccccccccccccccccccccccaaaaaacccciijnoottuuuuuuxxyuvpqqlmmcccccccccc
abcaaaaaaccaaaacccccccaaaaccccccccccacccccaaccccaaaccccccccccccaaaaaacccccccccccaaaaaaaaccaaaaaacccccccccccccccccaacccccccaacaaacccciiinntttxxxxuxxyyvvqqqqmmmmddddcccc
abcaaaaaacccaaacccccccaaaaccccaaaaaaaaccaaaaccccaacaacccccccccccaaaaccccccccccccaaaaaaaacccaaaaaaaacccccccccccccaaaaccccccccccaacccciiinntttxxxxxxxyyvvqqqqqmmmmdddcccc
abcaaaaaacccccccccccccaaaacccccaaaaaacccaaaaaaaaaaaaacccccccccccaaaaccccccccccccccaaacacccaaaaaaaaacccccccccccccaaaacccccccccccccccciiinnnttxxxxxxxyyvvvvqqqqmmmdddcccc
abcccaaccccccccccccccccaaccccccaaaaaacccaaaaaaaaaaaaaaccccccccccaacaccccccccccccccaaaccccaaaaaaaaaacccccccccccccaaaacccccccccccccccciiinnntttxxxxxyyyyyvvvqqqqmmmdddccc
SbccccccccccccccccccccccccccccaaaaaaaaccaaaccaaaaaaaaacccccccccccccccccccccccccccccccccccaaaaaaacccccccccaacccccccccccccccccccccccccciiinntttxxxxEzyyyyyvvvqqqmmmdddccc
abcccccccccccccccccccccccccccaaaaaaaaaacccccccaaaaaacccccccccccccaaacccccaacaacccccccccccccccaaaaaaccccccaacaaacccccccccccccccccccccciiinntttxxxyyyyyyyvvvvqqqmmmdddccc
abcccccccccccccccccccccccccccaaaaaaaaaaccccccaaaaaaaaccccccccccccaaaccccccaaaacccccccccccccccaaaaaaccccccaaaaacccccccccccccccccccccciiinnnttxxyyyyyyyvvvvvqqqqmmmdddccc
abcccccccccccccccccccccccccccacacaaacccccccccaaaaaaacccccccccccaaaaaaaacccaaaaacccccccccccccccaaaaaaaacaaaaaaccccccccccccccccccccccciiinntttxxwyyyyywwvvrrrqqmmmdddcccc
abaccccccccccccccccccccccccccccccaaacccccccccaaacaaaaacccccccccaaaaaaaaccaaaaaacccccccccccccccaaaaaaaacaaaaaaacccccccccccccccccccccchhnnnttwwwwwwwyyywvrrrrnnnnmdddcccc
abaccccccccccccccccccccccccccccccaaccccccccccccccaaaaaacccccccccaaaaaccccaaaacaccccccccccccccccaaaaacccccaaaaaaccccccaaaccccccaaaccchhnmmttswwwwwwywwwrrrrnnnnneeeccccc
abaccccccccccccccccccccccccccccccccccccccccccccccaaaaaacccccaaccaaaaaacccccaaccccccccccccccccccaaaaaaccccaaccaaccccaaaaaacccccaaacahhhmmmsssssssswwwwwrrrnnnneeeecccccc
abaaaccccccccccccccccccccccccccccaaaccccccccccccccaaaaaccccaaaccaaaaaacccccccccccccccccccccccccaaaaaaccccaaccccccccaaaaaacccaaaaaaahhhmmmmsssssssswwwwrrnnnneeeeacccccc
abaaaccccccccccccccccccccccccccccaaaaaaccccccccccaaaaacaaaaaaaccaaaccaccccccccaaaaaccccccccccccaaaacacccccccccccccccaaaaacccaaaaaaahhhhmmmmssssssswwwwrrnnneeeeaacccccc
abaaacccccccccccccccccccccccccccaaaaaaaccccccccccaaaaacaaaaaaaaaacccaaaaacccccaaaaacccccccccacaaaaaccacccccccccccccaaaaacccccaaaaaachhhmmmmmmmmmsssrrrrrnnneeeaaaaacccc
abaccccccccccccccaaaaccccccccccaaaaaaaacccccccccccccccccaaaaaaaaacccaaaaaccccaaaaaacccccccccaaaaaaaaaacccccccccccccaaaaaccccccaaaaachhhhmmmmmmmooossrrronneeeaaaaaacccc
abaccccccccccccccaaaaccccccccccaaaaaaacccccccccccccccccccaaaaaaaccccaaaaaacccaaaaaaccccaaaccaaaaaaaaaacccccccccccaaccccccccccaaaaaacchhhhhggggooooorrroonnfeeaaaaaccccc
abcccccccccccccccaaaaccccccccccccaaaaaacccccccccccccccccaaaaaaccccccaaaaaacccaaaaaaccccaaaaaacaaaaaacccccccccaaccaacccccccccccaacccccchhhhggggggoooooooooffeaaaaacccccc
abccccccccccccccccaacccccccccccccaaaaaacccccccaaccacccccaaaaaaacccccaaaaaaccccaaaccccccaaaaaacaaaaaacccccccccaaaaacccccccccccccccccccccccgggggggggooooooffffaaaaaaccccc
abccccccccccccccccccccccccccaaaccaacccccccccccaaaaacccccaaccaaacccccccaaacccccccccccccaaaaaaacaaaaaacccccccccaaaaaaaaccccccccccccccccccccccaaaggggfooooffffccccaacccccc
abaaccccccccccccccccccccccccaaacaccccccccccccaaaaacccccccccccaacccccccaaaacccaacccccccaaaaaaaaaaaaaaaccccccccccaaaaacccccccccccccaaaccccccccccccggfffffffffcccccccccccc
abaaccccccccccccccccccccccaacaaaaacccccccccccaaaaaacccccccccccccccccccaaaacaaaacccccccaaaaaaaaaccccaccccccccccaaaaaccccccccccccccaaaccccccccccccagfffffffccccccccccccca
abaacccccccaacccccccccccccaaaaaaaaccccccaacccccaaaacccccccccccccccccccaaaaaaaaacccccccccaaacaacaaacccccccccccaaacaaccccaaccaaccaaaaaaaaccccccccaaaccffffcccccccccccccaa
abaaaaaaaccaaccccccccccccccaaaaacccccccaaaacccaaccccccccccccccccccacaaaaaaaaaaccccccccccaaacaaaaaacccccccccccccccaaccccaaaaaaccaaaaaaaacccccccccaacccccccccccccccaaacaa
abaaaaaaaaaaccccccccccccccccaaaaaccccccaaaacccccccccccccccccccccccaaaaaaaaaaaaccccccccccccccaaaaaacccccccccccccccccccccaaaaaacccaaaaaacccccccccaaacccccccccccccccaaaaaa
abaaaacaaaaaaaacccccccccccccaacaaccccccaaaaccccccccccccccccccccccccaaaaaaaaaaacccccccccccccaaaaaaaacccccccccccccccccccaaaaaaaaccaaaaaaccccccccccccccccccccccccccccaaaaa`
```
