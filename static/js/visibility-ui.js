/*
 * Visibility algorithm visualization
 * From https://www.redblobgames.com/articles/visibility/
 * Copyright 2012-2018 Red Blob Games <redblobgames@gmail.com>
 * License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 * This file implements the diagrams on the page. The core algorithm
 * is in Visibility.hx (compiled into output/_visibility.js). The UI
 * code here is a bit messy. It's mutated quite a bit as I changed my
 * plans for the page, adding and removing diagrams. The core code is
 * in Visibility.hx I used it in a project back in 2011.
 *
 */

"use strict";

/* global Visibility, makeDraggable */

function clamp(x, lo, hi) {
  if (x < lo) {
    x = lo;
  }
  if (x > hi) {
    x = hi;
  }
  return x;
}

/** draw an svg path array ['M', 30, 50, 'L', 70, 20] to a canvas */
function interpretSvg(ctx, path) {
  for (let i = 0; i < path.length; i++) {
    if (path[i] === "M") {
      ctx.moveTo(path[i + 1], path[i + 2]);
      i += 2;
    }
    if (path[i] === "L") {
      ctx.lineTo(path[i + 1], path[i + 2]);
      i += 2;
    }
  }
}

function computeVisibleAreaPaths(center, output) {
  let path1 = [];
  let path2 = [];
  let path3 = [];

  for (let i = 0; i < output.length; i += 2) {
    let p1 = output[i];
    let p2 = output[i + 1];
    if (isNaN(p1.x) || isNaN(p1.y) || isNaN(p2.x) || isNaN(p2.y)) {
      // These are collinear points that Visibility.hx
      // doesn't output properly. The triangle has zero area
      // so we can skip it.
      continue;
    }

    path1.push("L", p1.x, p1.y, "L", p2.x, p2.y);
    path2.push(
      "M",
      center.x,
      center.y,
      "L",
      p1.x,
      p1.y,
      "M",
      center.x,
      center.y,
      "L",
      p2.x,
      p2.y,
    );
    path3.push("M", p1.x, p1.y, "L", p2.x, p2.y);
  }

  return { floor: path1, triangles: path2, walls: path3 };
}

class BlockLayer {
  constructor(diagram) {
    this.diagram = diagram;

    diagram.blocks.forEach(function (block, i) {
      block.bounds = [
        block.r,
        diagram.maxStorageColumn - block.r,
        block.r,
        diagram.size - block.r,
      ];

      block.outputSprite = document.createElement("canvas");
      block.outputSprite.setAttribute("width", block.r * 2);
      block.outputSprite.setAttribute("height", block.r * 2);

      let ctx = block.outputSprite.getContext("2d");
      let hue = 75;

      let gradient = ctx.createRadialGradient(
        block.r,
        block.r,
        0,
        block.r * 0.7,
        block.r * 0.7,
        block.r * 1.5,
      );
      gradient.addColorStop(0.0, "hsl(" + hue + ", 40%, 40%)");
      gradient.addColorStop(0.5, "hsl(" + hue + ", 50%, 35%)");
      gradient.addColorStop(1.0, "hsl(" + hue + ", 60%, 30%)");

      ctx.save();
      ctx.fillStyle = gradient;
      ctx.strokeStyle = "hsl(" + hue + ", 20%, 30%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(0, 0, block.r * 2, block.r * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
  }

  draw(ctx) {
    this.diagram.blocks.forEach((block) => {
      // see http://seb.ly/2011/02/html5-canvas-sprite-optimisation/
      let rounded_x = Math.round(block.x - block.r);
      let rounded_y = Math.round(block.y - block.r);
      ctx.save();
      if (this.diagram.highlight === block) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = "black";
        ctx.shadowOffsetY = 2;
      }
      ctx.drawImage(block.outputSprite, rounded_x, rounded_y);
      ctx.restore();
    });

    ctx.save();
    ctx.strokeStyle = "hsl(0, 50%, 30%)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    this.diagram.visibility.demo_intersectionsDetected.forEach(
      function (segment) {
        ctx.moveTo(segment[0].x, segment[0].y);
        ctx.lineTo(segment[1].x, segment[1].y);
        ctx.moveTo(segment[2].x, segment[2].y);
        ctx.lineTo(segment[3].x, segment[3].y);
      },
    );
    ctx.stroke();
    ctx.restore();
  }

  hitTest(location) {
    for (let block of this.diagram.blocks) {
      if (
        block.x - block.r <= location.x &&
        location.x <= block.x + block.r &&
        block.y - block.r <= location.y &&
        location.y <= block.y + block.r
      ) {
        return block;
      }
    }
    return null;
  }
}

class CenterLayer {
  constructor(diagram) {
    this.diagram = diagram;
    this.diagram.center.bounds = [
      diagram.gridMargin,
      diagram.size - diagram.gridMargin,
      diagram.gridMargin,
      diagram.size - diagram.gridMargin,
    ];
  }

  draw(ctx) {
    // The control is a yellow circle
    let center = this.diagram.center;
    ctx.save();
    if (this.diagram.highlight === center) {
      ctx.shadowBlur = 4;
      ctx.shadowColor = "black";
      ctx.shadowOffsetY = 2;
    }
    ctx.fillStyle = "hsl(60, 100%, 63%)";
    ctx.strokeStyle = "hsl(60, 60%, 30%)";
    ctx.beginPath();
    ctx.arc(center.x, center.y, center.r, 0, 2 * Math.PI, true);
    ctx.fill();
    if (this.diagram.highlight !== center) {
      ctx.stroke();
    }
    ctx.restore();
  }

  hitTest(location, slack = 1) {
    let center = this.diagram.center;
    let size = slack * center.r;
    if (
      center.x - size <= location.x &&
      location.x <= center.x + size &&
      center.y - size <= location.y &&
      location.y <= center.y + size
    ) {
      return center;
    }
    return null;
  }

  hitTestTight(location) {
    return this.hitTest(location, 1.5);
  }
  hitTestLoose(location) {
    return this.hitTest(location, 5);
  }
}

/* The slider widget goes from -π to +π, but with extra padding to
   allow some parts of the diagram to fade out towards the end. */
class SliderWidget {
  constructor(diagram) {
    this.min = -Math.PI;
    this.max = +Math.PI;
    this.padding = Math.PI / 10;
    this.paddedMax = this.max + this.padding;
    this.slider = null;
    this.diagram = diagram;
    if (diagram.options.slider) {
      let input = document.createElement("input");
      input.setAttribute("type", "range");
      input.setAttribute("min", this.min.toFixed(2));
      input.setAttribute("max", this.paddedMax.toFixed(2));
      input.setAttribute("step", 0.01);
      input.setAttribute(
        "value",
        diagram.options.slider === "right" ? this.paddedMax : this.min,
      );
      input.addEventListener("input", (event) => {
        this.set(input.valueAsNumber);
      });
      input.addEventListener("touchmove", (event) => {
        // HACK: for better responsiveness on touch devices (iOS mainly)
        let rect = input.getBoundingClientRect();
        let value = (event.changedTouches[0].clientX - rect.left) / rect.width;
        value = clamp(
          this.min + value * (this.paddedMax - this.min),
          this.min,
          this.paddedMax,
        );
        input.value = value;
        input.dispatchEvent(new Event("input"));
        event.preventDefault();
        event.stopPropagation();
      });

      let div = document.createElement("div");
      div.setAttribute("class", "slider-container");
      div.append("⟳");
      div.appendChild(input);
      diagram.root.appendChild(div);
      this.slider = input;
    }
  }

  get() {
    return this.slider
      ? clamp(this.slider.valueAsNumber, this.min, this.max)
      : this.max;
  }

  set(value) {
    this.slider.value = value;
    this.diagram.update();
  }

  fade() {
    // return 0.0 if value <= max - padding, then ramp up to 1.0 at maxPadding
    let value = this.slider ? this.slider.valueAsNumber : this.maxPadding;
    return clamp(
      (value - (this.max - this.padding)) / (2 * this.padding),
      0,
      1,
    );
  }
}

function makeBackgroundLayer(lights, options) {
  return class BackgroundLayer {
    constructor(diagram) {
      this.diagram = diagram;
      this.diagram.drawLights = !!lights;
      this.canvas = document.createElement("canvas");
      this.canvas.width = diagram.maxStorageColumn + 1;
      this.canvas.height = diagram.size + 1;
      this.draw();
    }

    draw() {
      let stepSize = 20;
      let { size } = this.diagram;
      let ctx = this.canvas.getContext("2d");

      // Background
      ctx.fillStyle = "hsl(210, 50%, 25%)";
      ctx.fillRect(0, 0, size + 1, size + 1);

      // Draw the static lights -- NOTE: this can't handle blocks
      // moving around. NOTE: This should use additive blend mode
      // but canvas doesn't support that so I use 'lighter'
      // composite operation instead, which causes the lights to be
      // more bluish and less yellowish. That's ok for this demo.
      if (this.diagram.drawLights) {
        ctx.save();
        ctx.globalAlpha = options.lightAlpha || 0.8;
        ctx.globalCompositeOperation = "lighter";
        let v = new Visibility();
        v.loadMap(
          size,
          this.diagram.gridMargin,
          this.diagram.blocks,
          this.diagram.walls.map((wall) => ({
            p1: { x: wall[0], y: wall[1] },
            p2: { x: wall[2], y: wall[3] },
          })),
        );
        lights.forEach(function (p) {
          v.setLightLocation(p[0], p[1]);
          v.sweep(Math.PI);
          let paths = computeVisibleAreaPaths({ x: p[0], y: p[1] }, v.output);
          let gradient = ctx.createRadialGradient(
            p[0],
            p[1],
            0,
            p[0],
            p[1],
            options.lightRadius || 100,
          );
          gradient.addColorStop(0.0, "hsla(60, 100%, 50%, 1.0)");
          if (options.lightGradientStyle === 2) {
            gradient.addColorStop(0.1, "hsla(-40, 20%, 30%, 1.0)");
            gradient.addColorStop(0.99, "hsla(-40, 20%, 30%, 1.0)");
            gradient.addColorStop(1.0, "hsla(30, 70%, 50%, 1.0)");
          } else {
            gradient.addColorStop(0.03, "hsla(60, 100%, 100%, 1.0)");
            gradient.addColorStop(0.04, "hsla(60, 80%, 75%, 0.4)");
            gradient.addColorStop(1.0, "hsla(60, 50%, 75%, 0.05)");
          }
          ctx.fillStyle = gradient;
          ctx.beginPath();
          interpretSvg(ctx, paths.floor);
          ctx.fill();
        });
        ctx.restore();
      }

      // Draw the grid on the left side
      ctx.strokeStyle = "hsla(210, 0%, 10%, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0.5; x <= 0.6 + size; x += stepSize) {
        ctx.moveTo(0, x);
        ctx.lineTo(size, x);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, size);
      }
      ctx.stroke();

      // Draw a storage area on the right
      ctx.fillStyle = "hsl(35, 30%, 90%)";
      ctx.strokeStyle = "hsl(35, 0%, 50%)";
      ctx.beginPath();
      ctx.rect(size + 1, 0, this.diagram.maxStorageColumn - size, size + 1);
      ctx.fill();
      ctx.stroke();
    }
  };
}

/** Diagram object
 *
 * The configuration is:
 *   center: {x, y} - position of light
 *   blocks: [{x, y, r}, ...] - moveable
 *   walls: [[x1, y1, x2, y2], ...] - unmoveable
 *   lights: [[x, y], ...] - unmoveable
 *
 * The state is the center position, block positions, lights toggle,
 * slider position, and wall time (for animations). These will be modified
 * by the UI.
 */

function makeDiagram(rootId, options, backgroundClass, center, blocks, walls) {
  // Scratch area on right where you can keep blocks
  let size = options.size || 400;
  let maxStorageColumn = size + (options.storageArea || 0);
  let gridMargin = 20;

  // References to the DOM
  let root = document.getElementById(rootId);

  // The algorithm is implemented in Visibility.hx, compiled to output/_visibility.js
  let visibility = new Visibility();

  // Canvas layers
  let state = {
    root,
    options,
    size,
    maxStorageColumn,
    gridMargin,
    center,
    blocks,
    walls,
    visibility,
    drawLights: false,
    update: updateAll,
    highlight: null,
  };
  let visible = document.createElement("canvas");
  root.appendChild(visible);
  visible.width = maxStorageColumn + 1;
  visible.height = size + 1;
  let background = new backgroundClass(state);
  let blockLayer = new BlockLayer(state);
  let centerLayer = new CenterLayer(state);
  let sliderWidget = new SliderWidget(state);
  let knobWidget;

  /* Set up mouse handlers for hover and dragging */

  root.addEventListener("touchmove", (event) => {
    event.preventDefault();
  });

  function setHighlight(object) {
    if (state.highlight !== object) {
      visible.style.cursor = object ? "move" : "";
      state.highlight = object;
      updateAll();
    }
  }

  visible.addEventListener("mousemove", (event) => {
    let rect = visible.getBoundingClientRect();
    let x = ((event.clientX - rect.left) / rect.width) * visible.width,
      y = ((event.clientY - rect.top) / rect.height) * visible.height;
    setHighlight(
      centerLayer.hitTestTight({ x, y }) || blockLayer.hitTest({ x, y }),
    );
  });
  visible.addEventListener("mouseleave", (event) => {
    setHighlight(null);
  });
  makeDraggable(visible, visible, (begin, current, state) => {
    const epsilon = 1e-2;
    let xScale = visible.width / visible.offsetWidth,
      yScale = visible.height / visible.offsetHeight;
    let x = current.x * xScale,
      y = current.y * yScale;
    if (state === null) {
      // drag started -- figure out which object it is, if any
      let x0 = begin.x * xScale,
        y0 = begin.y * yScale;
      state = centerLayer.hitTestTight({ x, y }) ||
        blockLayer.hitTest({ x, y }) ||
        centerLayer.hitTestLoose({ x, y }) || { dummy: 1, x: 0, y: 0 };
      state.offsetX = state.x - x0;
      state.offsetY = state.y - y0;
      setHighlight(state.dummy ? null : state);
    }
    if (!state.dummy) {
      state.x = clamp(
        state.offsetX + x,
        state.bounds[0] + epsilon,
        state.bounds[1] - epsilon,
      );
      state.y = clamp(
        state.offsetY + y,
        state.bounds[2] + epsilon,
        state.bounds[3] - epsilon,
      );
      updateAll();
    }
    return state;
  });

  function redrawAll() {
    visibility.loadMap(
      size,
      gridMargin,
      blocks.filter((block) => block.x - block.r < size),
      walls.map((wall) => ({
        p1: { x: wall[0], y: wall[1] },
        p2: { x: wall[2], y: wall[3] },
      })),
    );
    visibility.setLightLocation(center.x, center.y);
    visibility.sweep(sliderWidget.get());

    redraw();
  }

  function updateAll() {
    requestAnimationFrame(redrawAll);
  }

  function getEndpointAngles() {
    let angles = [];
    visibility.endpoints.toArray().forEach(function (endpoint) {
      // Since many endpoints are part of more than one line segment
      // there will be duplicates, which we discard here
      if (angles.length === 0 || endpoint.angle !== angles[angles.length - 1]) {
        angles.push(endpoint.angle);
      }
    });
    return angles;
  }

  function drawRays(ctx, path, option) {
    ctx.save();

    ctx.beginPath();
    interpretSvg(ctx, path);
    ctx.clip();

    let angles = [];
    if (option === "endpoints") {
      angles = getEndpointAngles();
    } else {
      // A fixed set of angles
      let numAngles = 60;
      for (let i = 0; i < numAngles; i++) {
        angles.push((2 * Math.PI * i) / numAngles);
      }
    }

    ctx.strokeStyle = "hsla(30, 100%, 70%, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    angles.forEach(function (angle) {
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(
        center.x + size * Math.cos(angle),
        center.y + size * Math.sin(angle),
      );
    });
    ctx.stroke();

    ctx.restore();
  }

  function drawFloor(ctx, path, solidStyle) {
    let gradient = ctx.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      size * 0.75,
    );
    gradient.addColorStop(0.0, "hsla(60, 100%, 75%, 0.5)");
    gradient.addColorStop(0.5, "hsla(60, 50%, 50%, 0.3)");
    gradient.addColorStop(1.0, "hsla(60, 60%, 30%, 0.1)");

    ctx.save();
    ctx.fillStyle = solidStyle ? "hsla(60, 75%, 60%, 0.2)" : gradient;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    interpretSvg(ctx, path);
    ctx.lineTo(center.x, center.y);

    if (state.drawLights) {
      // When lights are involved, the lighting has already been
      // applied. Instead of lighting up the areas we can see,
      // invert the fill region, blacking out areas we can't
      // see.
      ctx.fillStyle = "rgba(0, 0, 16, 0.8)";
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(size, size);
      ctx.lineTo(size, 0);
    }
    ctx.fill();
    ctx.restore();
  }

  function drawFloorTriangles(ctx, path) {
    ctx.save();
    ctx.strokeStyle = "hsl(80, 30%, 25%)";
    ctx.beginPath();
    interpretSvg(ctx, path);
    ctx.stroke();
    ctx.restore();
  }

  // Draw labels on the generated triangles
  function drawTriangleLabels(ctx, path) {
    const minimumTriangleArea = 10;
    // NOTE: the path is ["L", x1, y1, "L", x2, y2, "L", x3, y3, ...]
    // but some of these triangles are basically empty! so I need to
    // skip the labeling of them; TODO: investigate why they're empty
    // and maybe I can find some algorithm improvements
    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "white";
    let label = 1;
    for (let i = 0; i < path.length; i += 3) {
      let x1 = path[i + 1],
        y1 = path[i + 2],
        x2 = path[i + 4],
        y2 = path[i + 5];
      let xc = (center.x + x1 + x2) / 3,
        yc = (center.y + y1 + y2) / 3;
      let area = Math.abs(
        (x1 * (y2 - yc) + x2 * (yc - y1) + xc * (y1 - y2)) / 2,
      );
      if (area >= minimumTriangleArea) {
        ctx.fillText(label, xc, yc);
        label++;
      }
    }
    ctx.restore();
  }

  // Draw the walls lit up by the light
  function drawWalls(ctx, path) {
    ctx.save();
    ctx.strokeStyle = "hsl(60, 100%, 90%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    interpretSvg(ctx, path);
    ctx.stroke();
    ctx.restore();
    // TODO: there's a corner case bug: if a wall is collinear
    // with the player, the wall isn't marked as being visible. An
    // alternative would be to draw all the walls and use the
    // floor area as a mask. Reproduce by placing a box on the
    // left side of the map, with the top edge of the box along
    // the x-axis.
  }

  // Draw the segments
  function drawSegments(ctx) {
    const maxAngle = sliderWidget.get();

    ctx.save();
    ctx.strokeStyle = "hsl(30, 10%, 50%)";
    ctx.lineWidth = 2;
    let i = visibility.segments.iterator();
    while (i.hasNext()) {
      let segment = i.next();
      ctx.beginPath();
      ctx.moveTo(segment.p1.x, segment.p1.y);
      ctx.lineTo(segment.p2.x, segment.p2.y);
      ctx.stroke();
    }

    ctx.strokeStyle = "hsl(30, 0%, 100%)"; // first one
    ctx.lineWidth = 3;
    i = visibility.open.iterator();
    while (i.hasNext()) {
      let segment = i.next();
      ctx.beginPath();
      ctx.moveTo(segment.p1.x, segment.p1.y);
      ctx.lineTo(segment.p2.x, segment.p2.y);
      ctx.stroke();
      ctx.strokeStyle = "hsl(30, 0%, 0%)"; // remaining segments
    }
    ctx.restore();
  }

  // Draw the endpoints of the segments
  function drawEndpoints(ctx) {
    let maxAngle = sliderWidget.get();

    ctx.save();
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    let label = 1;
    let i = visibility.endpoints.iterator();
    while (i.hasNext()) {
      let p = i.next();
      if (p.visualize) {
        ctx.fillStyle =
          p.angle < maxAngle + 1e-2 ? "hsl(60, 80%, 50%)" : "hsl(60, 20%, 40%)";
        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          Math.abs(p.angle - maxAngle) < 1e-2 ? 5 : 3,
          0,
          2 * Math.PI,
          true,
        );
        ctx.fill();
        ctx.fillStyle = "white";
        if (options.labelEndpoints && p.angle < maxAngle + 1e-2) {
          ctx.fillText(label, p.x, p.y - 1);
        }
        label++;
      }
    }
    ctx.restore();
  }

  // Draw a sweep line that will be animated around 360 degrees
  function drawSweepLine(ctx) {
    let maxAngle = sliderWidget.get();

    ctx.save();
    ctx.strokeStyle = "hsl(30, 100%, 70%)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(
      center.x + size * Math.cos(maxAngle),
      center.y + size * Math.sin(maxAngle),
    );
    ctx.stroke();
    ctx.restore();
  }

  // Draw the output of all the algorithms. If there's a slider,
  // some of the output will fade out just as the slider reaches
  // the right hand side.
  function redraw() {
    let paths = computeVisibleAreaPaths(center, visibility.output);
    let now = new Date().getTime();
    let maxAngle = sliderWidget.get();
    let fade = sliderWidget.fade();

    // The base layer is the grid image
    let canvas = visible;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(background.canvas, 0, 0);

    // NOTE: the drawing options are a mess; I only put in what I
    // needed to for the diagrams, and it's not clean or
    // orthogonal or documented.

    ctx.globalAlpha = 0.5 + 0.5 * fade;
    if (options.drawFloor != false) {
      drawFloor(ctx, paths.floor, options.drawFloor);
      if (fade < 1.0) {
        ctx.globalAlpha = 1.0 - fade;
        drawFloorTriangles(ctx, paths.triangles);
        if (options.labelTriangles) {
          drawTriangleLabels(ctx, paths.floor);
        }
      }
    }
    if (options.drawRays) {
      drawRays(ctx, paths.floor, options.drawRays);
    }
    ctx.globalAlpha = 1.0;
    blockLayer.draw(ctx);
    if (fade < 1.0 && options.drawSegments) {
      ctx.globalAlpha = 1.0 - fade;
      drawSegments(ctx);
    }
    ctx.globalAlpha = 0.5 + 0.5 * fade;
    drawWalls(ctx, paths.walls);
    ctx.globalAlpha = 1.0 - fade;
    if (options.drawEndpoints || fade < 1.0) {
      drawEndpoints(ctx);
    }
    if (fade < 1.0) {
      drawSweepLine(ctx);
    }
    ctx.globalAlpha = 1.0;

    centerLayer.draw(ctx);
  }

  updateAll();

  return {
    setLights: function (show) {
      state.drawLights = show;
      background.draw();
      redraw();
    },
  };
}

let mazeWalls = [
  // Horizontal walls
  [20, 60, 60, 60],
  [60, 60, 100, 60],
  [100, 60, 140, 60],
  [140, 60, 180, 60],
  [60, 100, 100, 100],
  [100, 100, 140, 100],
  [260, 100, 300, 100],
  [300, 100, 340, 100],
  [140, 140, 180, 140],
  [180, 140, 220, 140],
  [300, 140, 340, 140],
  [340, 140, 380, 140],
  [140, 260, 180, 260],
  [180, 260, 220, 260],
  [215, 240, 225, 240],
  [260, 220, 275, 220],
  // Vertical walls
  [300, 20, 300, 60],
  [180, 60, 180, 100],
  [180, 100, 180, 140],
  [260, 60, 260, 100],
  [340, 60, 340, 100],
  [180, 140, 180, 180],
  [180, 180, 180, 220],
  [260, 140, 260, 180],
  [260, 180, 260, 220],
  [140, 220, 140, 260],
  [140, 260, 140, 300],
  [140, 300, 140, 340],
  [220, 240, 220, 260],
  [220, 340, 220, 380],
  // Wall with holes
  [220, 260, 220, 268],
  [220, 270, 220, 278],
  [220, 280, 220, 288],
  [220, 290, 220, 298],
  [220, 300, 220, 308],
  [220, 310, 220, 318],
  [220, 320, 220, 328],
  [220, 330, 220, 338],
  // Pillars
  [210, 70, 230, 70],
  [230, 70, 230, 90],
  [230, 90, 222, 90],
  [218, 90, 210, 90],
  [210, 90, 210, 70],
  [51, 240, 60, 231],
  [60, 231, 69, 240],
  [69, 240, 60, 249],
  [60, 249, 51, 240],
  // Curves
  [20, 140, 50, 140],
  [50, 140, 80, 150],
  [80, 150, 95, 180],
  [95, 180, 100, 220],
  [100, 220, 100, 260],
  [100, 260, 95, 300],
  [95, 300, 80, 330],
  [300, 180, 320, 220],
  [320, 220, 320, 240],
  [320, 240, 310, 260],
  [310, 260, 305, 275],
  [305, 275, 300, 300],
  [300, 300, 300, 310],
  [300, 310, 305, 330],
  [305, 330, 330, 350],
  [330, 350, 360, 360],
];

let mazeLights = [
  // top hallway
  [40, 59],
  [80, 21],
  [120, 59],
  [160, 21],
  [297, 23],
  [303, 23],
  [377, 23],
  [263, 97],
  [337, 97],
  // upper left room
  [23, 63],
  [177, 63],
  [23, 137],
  [177, 137],
  // round room on left
  [45, 235],
  [45, 240],
  [45, 245],
  // upper pillar
  [220, 80],
  // hallway on left
  [120, 280],
  // next to wall notch
  [217, 243],
  // inside room with holes
  [180, 290],
  [180, 320],
  [180, 350],
  // right curved room
  [320, 320],
  // right hallway
  [270, 170],
];

function makeFirstDiagram() {
  // Remove placeholder image, since we're replacing it with a canvas
  let placeholder = document.querySelector(".placeholder");
  placeholder.parentNode.removeChild(placeholder);

  // Maze diagram with optional lights
  let maze = makeDiagram(
    "maze",
    {},
    makeBackgroundLayer(mazeLights, {}),
    { x: 200, y: 200, r: 10 },
    [],
    mazeWalls,
  );

  let mazeToggle = document.querySelector("#maze-light-toggle input");
  function mazeUpdate() {
    let lights = mazeToggle.checked;
    maze.setLights(lights);
  }
  mazeToggle.addEventListener("change", mazeUpdate);
  mazeUpdate();
}

function makeOtherDiagrams() {
  // Diagram with moveable blocks, showing all the rays
  makeDiagram(
    "diagram-raycast-interval",
    { drawRays: true, drawFloor: false },
    makeBackgroundLayer(),
    { x: 200, y: 200, r: 15 },
    [
      { x: 95, y: 95, r: 25 },
      { x: 215, y: 285, r: 30 },
    ],
    [],
  );

  makeDiagram(
    "diagram-raycast-endpoints",
    { drawRays: "endpoints", drawFloor: "solid", drawEndpoints: true },
    makeBackgroundLayer(),
    { x: 200, y: 200, r: 15 },
    [
      { x: 95, y: 95, r: 25 },
      { x: 215, y: 285, r: 30 },
    ],
    [],
  );

  // Diagram with moving blocks, no rays, but with animation
  makeDiagram(
    "diagram-sweep-points",
    {
      slider: "left",
      drawEndpoints: true,
      labelEndpoints: true,
      drawSegments: false,
    },
    makeBackgroundLayer(),
    { x: 100, y: 300, r: 15 },
    [
      { x: 120, y: 100, r: 40 },
      { x: 180, y: 200, r: 40 },
    ],
    [],
  );

  makeDiagram(
    "diagram-sweep-segments",
    { slider: "left", labelTriangles: true },
    makeBackgroundLayer(),
    { x: 100, y: 300, r: 15 },
    [
      { x: 120, y: 100, r: 40 },
      { x: 180, y: 200, r: 40 },
    ],
    [],
  );

  makeDiagram(
    "diagram-playground",
    { storageArea: 100, slider: "right" },
    makeBackgroundLayer(),
    { x: 200, y: 200, r: 15 },
    [
      // All blocks in storage area to start with
      { x: 430, y: 30, r: 20 },
      { x: 470, y: 80, r: 20 },
      { x: 430, y: 130, r: 20 },
      { x: 470, y: 180, r: 20 },
      { x: 440, y: 240, r: 30 },
      { x: 460, y: 310, r: 30 },
      { x: 420, y: 360, r: 10 },
      { x: 450, y: 380, r: 10 },
      { x: 480, y: 360, r: 10 },
    ],
    [],
  );

  // Grenade throwing diagram
  let grenade = makeDiagram(
    "grenade",
    {},
    makeBackgroundLayer(
      [
        [130, 80],
        [150, 305],
        [280, 130],
      ],
      { lightAlpha: 1.0, lightRadius: 50, lightGradientStyle: 2 },
    ),
    { x: 200, y: 200, r: 10 },
    [],
    mazeWalls,
  );
}

setTimeout(makeFirstDiagram, 0);
setTimeout(makeOtherDiagrams, 250);
