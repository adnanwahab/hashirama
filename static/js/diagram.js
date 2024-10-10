// From https://www.redblobgames.com/pathfinding/
// Copyright 2014, 2020 Red Blob Games <redblobgames@gmail.com>
// License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>

import { search } from "./search.js";
import { Draggable } from "./draggable.v2.js";

export function clamp(x, lo, hi) {
  if (x < lo) x = lo;
  if (x > hi) x = hi;
  return x;
}

export function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

export function drawPolygon(ctx, points) {
  for (let i = 0; i < points.length; i++) {
    if (points[i] === undefined) {
      continue;
    }
    let x = points[i][0],
      y = points[i][1];
    if (points[i - 1] === undefined) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
}

/** A pathfinding diagram supporting layer "mods" */
export class Diagram {
  /* A layer is an object with these optional methods:
   * .draw(ctx, ss, map)                 - to draw a layer
   * .draw_tile(ctx, ss, map, id)        - to draw on a tile
   * .handle_drag({x, y, id})            - to handle a mouse drag
   *             return handlers {start?, drag?, end?}, each method
   *             of type {x, y, id} => ()
   * .cursor({x, y, id)}: string?        - to set the mouse cursor
   * These layer functions will get called with the Diagram as 'this'
   */
  constructor(el, graph, options, layout, ...layers) {
    this.el = el;
    this.graph = graph;
    this.options = options;
    this.layout = layout;
    this.layers = layers;

    this._linked_diagrams = null; // list is *shared* among instances!
    this._redrawing = 0; // non-zero if waiting for a redraw

    this.margin = 4; // in pixels, margin around the sides
    this.xy_range = this.layout.coordinate_range();
    this.translate = [
      this.xy_range.min[0] - this.margin,
      this.xy_range.min[1] - this.margin,
    ];

    this.parent =
      typeof this.el === "string" ? document.querySelector(this.el) : this.el;

    this.canvas =
      this.parent.querySelector("canvas") || document.createElement("canvas"); // NOTE: idempotent
    this.setSize();
    this.ctx = this.canvas.getContext("2d");
    this.parent.appendChild(this.canvas);
    requestAnimationFrame(() => {
      this.setUpDragHandlers();
      this.setUpMouseoverHandlers();
      this.graph.add_observer(this.redraw.bind(this));
    });
  }

  /* Link this diagram to others so that they will all be redrawn together */
  linkTo(...diagrams) {
    if (this._linked_diagrams !== null) {
      throw `Diagram ${this.el} already linked`;
    }
    diagrams.push(this);
    for (let diagram of diagrams) {
      diagram._linked_diagrams = diagrams;
    }
  }

  /* Choose the size of the canvas to fit the size of the parent,
       and then scale our content to match. TODO: resize if layout changes */
  setSize() {
    let width = this.xy_range.max[0] - this.xy_range.min[0] + 2 * this.margin,
      height = this.xy_range.max[1] - this.xy_range.min[1] + 2 * this.margin;
    this.scale = (window.devicePixelRatio * this.parent.clientWidth) / width;

    width = Math.round(this.scale * width);
    height = Math.round(this.scale * height);

    /* To make sure the initial layout is reasonable I've statically included
           <canvas> elements on the page. These need to have the same aspect
           ratio as the ones I create dynamically. This warning lets me know if
           any of them have gotten out of sync. */
    /*
        let aspectRatioOld = this.canvas.width / this.canvas.height,
            aspectRatioNew = width / height;
        if (Math.round(50 * aspectRatioOld) !== Math.round(50 * aspectRatioNew)) {
            console.log('warning: %s > canvas should be sized statically:', this.el);
            console.log('    <canvas width="%s" height="%s"/>',
                        Math.round(width / window.devicePixelRatio),
                        Math.round(height / window.devicePixelRatio));
        }
        */

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  /* Convert input coordinates in screen space to canvas coordinates */
  mouseEventToTileEvent(event) {
    /* screen to world coordinates means we need to undo the
     * transforms (translate then scale). We also need to scale
     * down from the canvas physical size (.clientWidth) to the
     * virtual size (.width).
     */
    const canvas = this.canvas;
    let x =
        ((event.x / canvas.clientWidth) * canvas.width) / this.scale +
        this.translate[0],
      y =
        ((event.y / canvas.clientHeight) * canvas.height) / this.scale +
        this.translate[1];
    let id = this.layout.pixel_to_tile([x, y]);
    return { x, y, id };
  }

  setUpDragHandlers() {
    const diagram = this;

    function forward(handler, method, rawEvent) {
      handler?.[method]?.call(diagram, diagram.mouseEventToTileEvent(rawEvent));
    }

    new Draggable({
      el: this.canvas,
      start(rawEvent) {
        let event = diagram.mouseEventToTileEvent(rawEvent);
        /* ask each layer if it wants this; topmost layer gets first pick */
        this.handler = false;
        for (let i = diagram.layers.length - 1; i >= 0 && !this.handler; i--) {
          let layer = diagram.layers[i];
          this.handler = layer.handle_drag?.call(diagram, event);
        }
        forward(this.handler, "start", rawEvent);
        forward(this.handler, "drag", rawEvent); // convenience
      },
      drag(rawEvent) {
        forward(this.handler, "drag", rawEvent);
      },
      end(rawEvent) {
        forward(this.handler, "end", rawEvent);
      },
    });
  }

  setUpMouseoverHandlers() {
    const canvas = this.canvas;
    canvas.addEventListener("mousemove", (rawEvent) => {
      const bounds = this.canvas.getBoundingClientRect();
      let event = this.mouseEventToTileEvent({
        x: rawEvent.x - bounds.left,
        y: rawEvent.y - bounds.top,
      });
      this.updateCursor(event);
    });
  }

  updateCursor(event) {
    let cursor = "";
    for (let layer of this.layers) {
      if (layer.cursor) {
        cursor = layer.cursor.call(this, event) ?? cursor;
      }
    }
    this.canvas.style.cursor = cursor;
  }

  // Redraw this diagram and any linked diagrams
  redraw() {
    for (let diagram of this._linked_diagrams ?? [this]) {
      if (diagram._redrawing) return;
      diagram._redrawing = requestAnimationFrame(() => diagram._redraw());
    }
  }

  rerunSearch() {
    let map = this.graph
      .ids()
      .map((id) => ({ tile_weight: this.graph.tile_weight(id) }));
    let ss = search(this.options, this.graph, map);
    if (ss.current !== -1) {
      map[ss.current].current = true;
    }
    ss.frontier.forEach((id) => {
      map[id].frontier = true;
    });
    ss.neighbors.forEach((id) => {
      map[id].neighbor = true;
    });
    return { ss, map };
  }

  // Redraw only this diagram
  _redraw() {
    this._redrawing = 0;
    this.options.search_setup();
    const ids = this.graph.ids();
    let { ss, map } = this.rerunSearch();
    const { ctx } = this;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${this.layout.SCALE * 0.4}px sans-serif`;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.translate[0], -this.translate[1]);

    for (let layer of this.layers) {
      if (layer.draw) {
        ctx.save();
        layer.draw.call(this, ctx, ss, map);
        ctx.restore();
      }
      if (layer.draw_tile) {
        for (let id of ids) {
          let center = this.layout.tile_center(id);
          ctx.save();
          ctx.translate(center[0], center[1]);
          layer.draw_tile.call(this, ctx, ss, map, id);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }
}

//////////////////////////////////////////////////////////////////////
// Library of layers

export const Layers = {
  /* base layer draws the map; styleMap should be
        {tile: style, [weight]: style, reached: style, current: style, frontier: style,
         override: function(ctx, ss, map, id)}
        where style is {fillStyle:, strokeStyle:, …}

        The override method can set anything it wants on the ctx.

        For convenience, 'current' is treated as a member of 'frontier'.
    */
  base(styleMap = {}) {
    let { tile, reached, current, frontier, override } =
      Object.create(styleMap);
    tile = tile ?? { fillStyle: "hsl(0, 10%, 85%)" };
    reached = reached ?? { fillStyle: "hsl(30, 20%, 75%)" };
    frontier = frontier ?? {};
    current = current ?? {};
    styleMap[Infinity] = styleMap[Infinity] ?? {
      fillStyle: "hsl(60, 5%, 50%)",
      strokeStyle: "hsl(60, 5%, 50%)",
    };

    return {
      draw_tile(ctx, ss, map, id) {
        let w = map[id].tile_weight;

        let style = {};
        Object.assign(style, tile);
        map[id].reached && Object.assign(style, reached);
        styleMap[w] && Object.assign(style, styleMap[w]);
        (map[id].frontier || map[id].current) && Object.assign(style, frontier);
        map[id].current && Object.assign(style, current);
        Object.assign(ctx, style);

        if (override) {
          override.call(this, ctx, ss, map, id);
        }

        ctx.beginPath();
        drawPolygon(ctx, this.layout.tile_shape(id));
        if (style.fillStyle) ctx.fill();
        if (style.strokeStyle) ctx.stroke();
      },
    };
  },

  numericLabels(
    field,
    color = "black",
    format = (x) => (x === Infinity || x === undefined ? "" : x.toFixed(0)),
  ) {
    return {
      draw_tile(ctx, ss, map, id) {
        ctx.fillStyle = color;
        ctx.fillText(format(map[id][field], id), 0, 0);
      },
    };
  },

  frontierTiles(lineWidth = null, clip = false) {
    return {
      draw_tile(ctx, ss, map, id) {
        lineWidth = lineWidth ?? this.layout.SCALE / 10;
        if (map[id].current || map[id].frontier) {
          ctx.strokeStyle = "hsl(220, 50%, 50%)";
          ctx.lineWidth = lineWidth;
          if (clip) {
            ctx.beginPath();
            drawPolygon(ctx, this.layout.tile_shape(id));
            ctx.clip();
          }
          ctx.beginPath();
          drawPolygon(ctx, this.layout.tile_shape(id));
          ctx.stroke();
        }
      },
    };
  },

  neighborTiles(lineWidth = null) {
    let gradient = null;
    return {
      draw_tile(ctx, ss, map, id) {
        lineWidth = lineWidth ?? this.layout.SCALE / 5;
        if (map[id].neighbor) {
          if (gradient === null) {
            gradient = ctx.createRadialGradient(
              0,
              0,
              10,
              0,
              0,
              this.layout.SCALE / 2,
            );
            gradient.addColorStop(0.0, "hsla(150, 50%, 45%, 0.0)");
            gradient.addColorStop(1.0, "hsla(150, 50%, 45%, 0.5)");
          }
          ctx.fillStyle = gradient;
          ctx.strokeStyle = "hsl(150, 50%, 45%)";
          ctx.lineWidth = lineWidth;
          ctx.setLineDash([lineWidth / 2, lineWidth / 2]);
          ctx.beginPath();
          drawPolygon(ctx, this.layout.tile_shape(id));
          ctx.clip();
          ctx.beginPath();
          drawPolygon(ctx, this.layout.tile_shape(id));
          ctx.fill();
          ctx.stroke();
        }
      },
    };
  },

  parentPointers(
    reverseDirection = false,
    width = 3,
    style = {
      fillStyle: "hsl(30, 20%, 65%)",
      strokeStyle: "hsla(0, 0%, 100%, 0.5)",
      lineWidth: 0.5,
    },
  ) {
    const A = 0.1, // where stem starts
      B = 0.4, // where stem ends, arrowhead starts
      C = 0.7, // where arrowhead ends
      D = 3; // width of arrowhead relative to stem
    return {
      draw_tile(ctx, ss, map, id) {
        const parentId = map[id].parent;
        if (parentId === undefined) return;

        let xy1 = this.layout.tile_center(id);
        let xy2 = this.layout.tile_center(parentId);
        if (reverseDirection) {
          [xy1, xy2] = [xy2, xy1];
        }
        let d = [xy2[0] - xy1[0], xy2[1] - xy1[1]],
          dLength = Math.hypot(d[0], d[1]),
          w = [(-d[1] * width) / 2 / dLength, (d[0] * width) / 2 / dLength];

        function mix(...args) {
          let x = 0,
            y = 0;
          for (let i = 0; i < args.length; i += 2) {
            let weight = args[i],
              point = args[i + 1];
            x += weight * point[0];
            y += weight * point[1];
          }
          return [x, y];
        }

        // TODO: factor this out into a reusable drawArrow function
        Object.assign(ctx, style);
        ctx.beginPath();
        drawPolygon(ctx, [
          mix(A, d, 1, w),
          mix(B, d, 1, w),
          mix(B, d, D, w),
          mix(C, d),
          mix(B, d, -D, w),
          mix(B, d, -1, w),
          mix(A, d, -1, w),
        ]);
        if (style.strokeStyle) {
          ctx.stroke();
        }
        if (style.fillStyle) {
          ctx.fill();
        }
      },
    };
  },

  /* Paint on the map to change the weights */
  editable(...cycle_order) {
    if (cycle_order.length === 0) {
      cycle_order = [1, Infinity];
    }

    function next_weight_in_cycle(weight) {
      let i = cycle_order.indexOf(weight);
      return cycle_order[(i + 1) % cycle_order.length];
    }

    return {
      handle_drag(event) {
        const graph = this.graph;
        const new_weight = next_weight_in_cycle(graph.tile_weight(event.id));
        return {
          drag(event) {
            if (event.id !== -1) {
              graph.set_tile_weight(event.id, new_weight);
            }
          },
        };
      },
      cursor(event) {
        return "crosshair";
      },
    };
  },

  /* Draggable markers for start/end positions */
  draggableMarker(marker, obj, key) {
    /* marker should be a function(ctx, dragging) */
    /* obj[key] should be a graph id */

    let dragging = false;

    return {
      draw(ctx, _ss, _map) {
        let [x, y] = this.layout.tile_center(obj[key]);
        ctx.save();
        ctx.translate(x, y);
        marker(ctx, dragging);
        ctx.restore();
      },

      handle_drag(event) {
        if (event.id === obj[key]) {
          return {
            start(event) {
              dragging = true;
              this.updateCursor(event);
              this.redraw();
            },
            end(event) {
              dragging = false;
              this.updateCursor(event);
              this.redraw();
            },
            drag(event) {
              if (event.id !== -1 && event.id !== obj[key]) {
                obj[key] = event.id;
                this.redraw();
              }
            },
          };
        }
        return null;
      },

      cursor(event) {
        // TODO: the drag and cursor methods use the *tile* as
        // the hit region instread of using the marker shape
        // or a circular drag region
        if (event.id !== obj[key]) return null;
        return dragging ? "grabbing" : "grab";
      },
    };
  },
};

export const Patterns = (function () {
  let library = {};
  if (!globalThis.document) return library; // for use server side
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 10;
  canvas.height = 10;

  ctx.fillStyle = "hsl(110, 40%, 80%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "hsl(110, 50%, 70%)";
  ctx.beginPath();
  ctx.moveTo(1, 1);
  ctx.lineTo(3, 3);
  ctx.lineTo(5, 1);
  ctx.moveTo(6, 6);
  ctx.lineTo(8, 8);
  ctx.lineTo(10, 6);
  ctx.stroke();
  library.grass = ctx.createPattern(canvas, "repeat");

  ctx.fillStyle = "hsl(110, 20%, 70%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "hsl(100, 20%, 60%)";
  ctx.beginPath();
  ctx.moveTo(1, 1);
  ctx.lineTo(3, 3);
  ctx.lineTo(5, 1);
  ctx.moveTo(6, 6);
  ctx.lineTo(8, 8);
  ctx.lineTo(10, 6);
  ctx.stroke();
  library.forest = ctx.createPattern(canvas, "repeat");

  ctx.fillStyle = "hsl(60, 50%, 80%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "hsl(30, 50%, 80%)";
  ctx.beginPath();
  ctx.arc(5, 5, 3, 1.1 * Math.PI, 1.9 * Math.PI);
  ctx.stroke();
  library.desert = ctx.createPattern(canvas, "repeat");

  ctx.fillStyle = "hsl(200, 50%, 70%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "hsl(180, 50%, 70%)";
  ctx.beginPath();
  ctx.arc(5, 5, 3, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();
  library.river = ctx.createPattern(canvas, "repeat");

  return library;
})();

export const Markers = {
  blob(radius) {
    // For the default markers I export the style because the A*
    // page uses the style and path to construct svg equivalents
    // of these canvas markers
    draw.path = [];
    for (let angle = 0.0; angle < 2 * Math.PI; angle += 0.1) {
      let r = radius * (1 + Math.sin(5 * angle) / 5.5); // https://www.redblobgames.com/x/1907-logo-generator/
      let x = r * Math.cos(angle);
      let y = -r * Math.sin(angle);
      y -= 0.05 * radius; // adjust for blob head having less "weight" than feet
      draw.path.push([x, y]);
    }

    draw.style = {
      fillStyle: "hsl(0, 50%, 50%)",
      lineWidth: 0.4,
      strokeStyle: "hsl(0, 0%, 100%, 0.5)",
      shadowColor: "hsl(0, 0%, 0%, 0.5)",
      shadowOffsetY: 1,
      shadowBlur: 1,
    };

    const largeEyes = radius > 11;
    function drawEye(ctx, x, y, dragging) {
      // TODO: follow mouse movement, or the goal?
      const dx = dragging ? 0.02 : 0.01,
        dy = dragging ? 0.0 : 0.02;

      if (largeEyes) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(
          radius * x,
          radius * y,
          radius * 0.12,
          radius * 0.18,
          0,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      }
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(
        radius * (x + dx),
        radius * (y + dy),
        radius * (largeEyes ? 0.07 : 0.09),
        0,
        2 * Math.PI,
      );
      ctx.fill();
    }

    function draw(ctx, dragging) {
      Object.assign(ctx, draw.style);
      if (dragging) {
        ctx.scale(1.05, 1.05);
        ctx.shadowColor = "black";
      }
      ctx.beginPath();
      drawPolygon(ctx, draw.path);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = "rgb(0, 0, 0, 0.2)";
      drawEye(ctx, -0.18, -0.8, dragging);
      drawEye(ctx, +0.18, -0.8, dragging);
      ctx.strokeStyle = "black";
      ctx.lineWidth = radius * 0.1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-radius * 0.2, -radius * 0.4);
      ctx.quadraticCurveTo(
        0,
        -radius * (dragging ? 0.2 : 0.3),
        radius * 0.2,
        -radius * 0.4,
      );
      ctx.stroke();
    }

    return draw;
  },

  cross(radius) {
    draw.style = {
      lineWidth: 0.75 * radius,
      lineJoin: "miter",
      lineCap: "butt",
      strokeStyle: "hsl(310, 50%, 50%)",
      shadowColor: "hsl(0, 0%, 0%, 0.5)",
      shadowOffsetY: 1,
      shadowBlur: 1,
    };

    function draw(ctx, dragging) {
      Object.assign(ctx, draw.style);
      if (dragging) {
        ctx.scale(1.05, 1.05);
        ctx.shadowColor = "black";
      }
      ctx.beginPath();
      ctx.moveTo(-radius, -radius);
      ctx.lineTo(radius, radius);
      ctx.moveTo(-radius, radius);
      ctx.lineTo(radius, -radius);
      ctx.stroke();
    }

    return draw;
  },
};

export function addSliderSteps(el, diagrams) {
  let value = 0;

  let slider = addSlider(el, {
    min: 0,
    get max() {
      return diagrams[0].graph.tiles_less_than_weight().length;
    },
    get value() {
      return value;
    },
    set value(v) {
      value = v;
      diagrams.forEach((diagram) => diagram.redraw());
    },
  });

  // Inject an additional exit condition based on the slider
  for (let diagram of diagrams) {
    let previous_exit_now = diagram.options.exit_now;
    diagram.options.exit_now = (ss) =>
      previous_exit_now(ss) || ss.steps > value;
    diagram.graph.add_observer(() => slider.redrawSlider());
  }

  return slider;
}

/** options: {
        value: number
        min: number
        max: number
        animationFrameMs?: number
    } */
export function addSlider(el, options) {
  if (typeof el === "string") {
    el = document.querySelector(el);
  }
  const sliderElement =
    el.querySelector("div.slider") ?? document.createElement("div"); // NOTE: idempotent
  sliderElement.className = "slider";
  sliderElement.style.textAlign = "center";
  sliderElement.innerHTML = `
             <input type="range" />
             <br />
             <button class="step_back">←</button>
             <button class="play_pause"></button>
             <button class="step_forward">→</button>
    `;
  const inputElement = sliderElement.querySelector("input");
  inputElement.addEventListener("input", onInput);
  sliderElement
    .querySelector(".step_back")
    .addEventListener("click", onStepBack);
  sliderElement
    .querySelector(".play_pause")
    .addEventListener("click", onPlayPause);
  sliderElement
    .querySelector(".step_forward")
    .addEventListener("click", onStepForward);
  el.appendChild(sliderElement);
  let animation_id = 0;

  redrawSlider();
  return { setSliderPosition, setPlayPause, redrawSlider };

  function onInput(event) {
    setSliderPosition(event.target.valueAsNumber);
  }
  function onStepBack(event) {
    setSliderPosition(options.value - 1);
  }
  function onStepForward(event) {
    setSliderPosition(options.value + 1);
  }
  function onPlayPause(event) {
    setPlayPause(animation_id === 0);
  }

  function setSliderPosition(newPosition) {
    setPlayPause(false);
    setSliderPositionInternal(newPosition);
  }

  function setSliderPositionInternal(newPosition) {
    options.value = clamp(newPosition, options.min, options.max);
    redrawSlider();
  }

  function setPlayPause(shouldPlay) {
    if (shouldPlay && !animation_id) {
      animation_id = setInterval(loop, options.animationFrameMs ?? 1000 / 60);
      if (options.value === options.max) {
        // Pressing play when the animation is finished should start over
        setSliderPositionInternal(0);
      }
      redrawSlider();
    } else if (!shouldPlay && animation_id) {
      clearInterval(animation_id);
      animation_id = 0;
      redrawSlider();
    }
  }

  function loop() {
    if (options.value < options.max) {
      setSliderPositionInternal(options.value + 1);
    } else {
      // Slider reached the end, so stop the animation
      setPlayPause(false);
    }
  }

  function redrawSlider() {
    inputElement.min = options.min;
    inputElement.max = options.max;
    inputElement.value = options.value;
    sliderElement.querySelector(".play_pause").textContent = animation_id
      ? "Pause animation"
      : "Start animation";
  }
}
