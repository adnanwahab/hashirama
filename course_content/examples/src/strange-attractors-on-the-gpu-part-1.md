```js
md`# Strange Attractors on the GPU, Part 1: Implementation

This notebook walks through simulating a strange attractor on the GPU and then rendering particle tracks as lines. We do this without any of the data ever touching the CPU!

The notebook presents the details below, but the high level summary is that the state of all particle tracks is stored in a single WebGL texture where each row of the texture is a ring buffer representing the history of each particle. On each frame we step a differential equation and overwrite the oldest element of each particle's history with a new value. Finally, we render particle tracks directly from the texture data.

Each frame of the simulation incurs just four draw calls:

1. Integrate the differential equation, writing a column containing the new state of all particles into a temporary texture.
2. Copy the temporary slice back into full state texture, overwriting the oldest values.
3. Draw all line segments and line joins using instanced triangle strip geometry. Sentinel values separate the lines into multiple contiguous segments.
4. Draw all line caps, using instanced triangle geometry.

Doing this requires being fancy about how we move data around, but I think the end result is actually pretty extensible and reusable for both 2D and 3D high performance line rendering. The line rendering itself is implemented in the [regl-gpu-lines](https://github.com/rreusser/regl-gpu-lines) npm module.

This notebook walks through all of the above steps in detail. To see more interesting attractors in action, see the companion notebook, [Strange Attractors on the GPU, Part 2: Fun! 🔗](https://observablehq.com/d/df2e1a97f7ab9a46).`
```

```js
viewof regl = reglCanvas(this, {
  width: width,
  height: Math.max(400, width * 0.6),
  pixelRatio,
  attributes: { antialias: ~contextOpts.indexOf('Antialiasing') },
  extensions: ['ANGLE_instanced_arrays', 'OES_texture_float']
})
```

```js
viewof restart = Inputs.button('Restart')
```

```js
viewof opts = Inputs.checkbox(['Simulate'], {
  value: ['Simulate']
})
```

```js
viewof particleCount = Inputs.range([1, 4096], {
  value: 20,
  label: 'Particle count',
  step: 1
})
```

```js
viewof stepCount = Inputs.range([1, 1024], {
  label: 'Track length',
  value: 100,
  transform: Math.log,
  step: 1
})
```

```js
viewof dt = Inputs.range([0.001, 0.1], {
  value: 0.02,
  label: html`Time step, ${tex`\Delta t`}`
})
```

```js
viewof contextOpts = Inputs.checkbox(['Antialiasing'], {
  value: ['Antialiasing']
})
```

```js
section_problemSetup = md`## Simulation method

To simulate strange attractors, here we use the [regl](https://github.com/regl-project/regl) WebGL library. I like \`regl\` because it's mostly just a convenience wrapper around the low-level WebGL API, adding few of its own abstractions while making WebGL fun and easy to use—especially for creative simulations like this.

However, there's a big downside. When you rely on low-level graphics APIs, even simple things can become very difficult. Lines are a good example. All browsers these days limit the built-in [OpenGL line primitive](https://www.khronos.org/opengl/wiki/Primitive#Line_primitives) to a single pixel width, so if you want any reasonably well-rendered lines, you really just have to implement it yourself.

Thus we have two challenges: to simulate the equations and to draw lines.`
```

```js
md`## WebGL context creation

To get started, we import a helper for instantiating the [\`regl\`](https://github.com/regl-project/regl) library and create a context in the [\`regl\`](#regl) cell above (i.e. the main visualization).`
```

```js
import { reglCanvas } from '@rreusser/regl-canvas'
```

```js
pixelRatio = window.devicePixelRatio
```

```js
md`The reason for this helper is that browsers limit the total number of WebGL contexts before the oldest start getting removed—usually 8 or 16 contexts. If we're not careful, dependence on the notebook's \`width\` value will trigger instantiaton of tens of new contexts when we resize the page, causing figures to start to go blank. To avoid this, the \`reglCanvas\` helper prevents recreating the context when only the size has changed.`
```

```js
md`Next, we instantiate a camera. I wish I had a better camera module to offer, but the only module I have on hand is the [inertial-turntable-camera](https://github.com/standardCyborg/inertial-turntable-camera) module I wrote some time ago, and for which I have a lot of regrets. It needs a major overhaul which I haven't yet attacked. Really though, any camera model which exposes a standard, combined projection-view matrix would do just fine.`
```

```js
import { createReglCamera, createInteractions } from '@rreusser/regl-tools'
```

```js
camera = {
  restart;
  const camera = createReglCamera(regl, {
    distance: 7,
    near: 0.01,
    far: 100,
    phi: 0,
    theta: -1,
    center: [0, 2, 0]
  });
  createInteractions(camera);
  return camera;
}
```

```js
updateCameraOnResize = {
  // Trigger a dependence of resizing on the page size and regl instance:
  width, regl;

  const aspectRatio = viewof regl.width / viewof regl.height;
  camera.resize(aspectRatio);
}
```

```js
section_dataModel = md`## State layout
Next, we define how we represent particle track data in a WebGL texture. The state of our ordinary differential equation (ODE) is represented by the three-component vector ${tex`(x, y, z)`}. WebGL generally gives us four color channels to work with, so we choose to represent the state in a four-channel floating point texture. The ${tex`j^{th}`} time step of the ${tex`i^{th}`} particle is thus represented by the four-component vector, ${tex.block`\mathbf{p}_j^{(i)} = (x_j^{(i)}, y_j^{(i)}, z_j^{(i)}, 1).`}

We pack these vectors into a texture, each row representing the history of a single particle. `
```

```js
{
  const w = Math.min(600, width);
  const h = 150;
  const svg = d3.select(DOM.svg(w, h));

  const colors = ['#cc2255', '#2255dd'];

  const xScale = d3
    .scaleLinear()
    .domain([-2.5, 2.5])
    .range([0, w]);

  const yScale = d3
    .scaleLinear()
    .domain([-0.5, 0.9])
    .range([h, 0]);

  const line = d3
    .line(d => xScale(d[0]), d => yScale(d[1]))
    .defined(d => !!d && !isNaN(d[0]));

  const pointsPerSeg = 5;
  const points = [
    [-2, -0.2],
    [-1.5, 0.5],
    [-1, 0.2],
    [-0.5, 0.2],
    [0, 0.6],
    null,
    [0, -0.2],
    [0.5, -0.1],
    [1, 0.2],
    [1.5, 0.3],
    [2, 0.1]
  ];

  svg
    .append('path')
    .attr('stroke', colors[0])
    .attr('fill', 'none')
    .attr('d', line(points.slice(0, pointsPerSeg)));

  svg
    .append('path')
    .attr('stroke', colors[1])
    .attr('fill', 'none')
    .attr('d', line(points.slice(pointsPerSeg + 1)));

  svg
    .append('g')
    .selectAll('circle')
    .data(points.filter(d => d))
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 2.5)
    .attr('fill', (d, i) => colors[Math.floor(i / pointsPerSeg)]);

  const entry = svg
    .append('g')
    .selectAll('text')
    .data(points.filter(d => d))
    .enter()
    .append('text')
    .attr('x', d => xScale(d[0]))
    .attr('y', d => yScale(d[1]))
    .attr('dy', d => 7)
    .text('p')
    .attr('dominant-baseline', d => 'hanging')
    .attr('font-family', 'KaTeX_Main,Times New Roman,serif')
    .attr('text-anchor', d => 'start')
    .attr('font-weight', 700)
    .attr('fill', (d, i) => colors[Math.floor(i / pointsPerSeg)]);

  entry
    .append('tspan')
    .attr('font-weight', 400)
    .attr('font-size', '.8em')
    .attr('dy', '-.4em')
    .text((d, i) => `(${Math.floor(i / pointsPerSeg)})`);

  entry
    .append('tspan')
    .attr('font-weight', 400)
    .attr('font-size', '.8em')
    .attr('dy', '1.4em')
    .attr('dx', '-1.1em')
    .text((d, i) => i % pointsPerSeg);

  const particles = 3;
  const steps = 5;
  const texture = html`<div style="display:flex;flex-direction:row;justify-content:center;align-items:center">
    <div style="width:30px;transform:rotate(-90deg) translate(-150%,0)">&larr;&nbsp;particle&nbsp;&nbsp;<em>i</em></div>
    <div>step ${tex`j`} &rarr;<br>
    <table class="texture1"><tbody>${[...Array(particles).keys()].map(
      (particle, i) => {
        return html`<tr style="color:${colors[particle]}">${[
          ...Array(steps).keys()
        ].map(step => {
          if (particle === 2) return html`<td>${tex`\vdots`}</td>`;
          let eqn;
          const linenum = Math.floor(step / (pointsPerSeg + 1));
          eqn = tex`\mathbf{p}_${step}^{(${particle})}`;
          return html`<td>${eqn}</td>`;
        })}</tr>`;
      }
    )}</tbody></table>
    </div>
  </div>`;

  const endpoints = [0, 1, 2, 4, 3, 2, 0, 1, 2, 4, 3, 2];
  const lookupTable = html`
  <table class="buffers" style="margin-bottom:1em">
    <tbody>
      <tr>
        <td style="background-color:#eee">vertices</td>${[
          ...Array(points.length).keys()
        ].map(step => {
          const p = Math.floor(step / (pointsPerSeg + 1));
          const i = step % (pointsPerSeg + 1);
          if (i === pointsPerSeg)
            return html`<td style="background-color:#eee">${tex`\textsf{NaN}`}</td>`;
          const css = `color:${colors[p]}`;
          return html`<td style="${css}">${tex`uv_{${i}}^{(${p})}`}</td>`;
        })}
      </tr>
    </tbody>
  </table>
  <table class="buffers">
    <tbody>
      <tr>
        <td style="background-color:#eee">endpoints</td>${endpoints.map(
          (endpoint, endpointIndex) => {
            const seg = Math.floor(endpointIndex / 3);
            const line = Math.floor(endpointIndex / 6);
            const css = `color:${colors[line]};background-color:${
              Math.floor(endpointIndex / 3) % 2 === 0 ? 'none' : '#eee'
            }`;
            return html`<td style="${css}">${tex`uv_{${endpoint}}^{(${line})}`}</td>`;
          }
        )}
      </tr>
      <tr>
        <td style="background-color:#eee">isstart</td>${[1, 0, 1, 0].map(
          (isStart, idx) => {
            const css = `color:${
              colors[Math.floor(idx / 2)]
            };background-color:${isStart ? 'none' : '#eee'}`;
            return html`<td colspan="3" style=${css}>${tex`${isStart}`}</td>`;
          }
        )}
      </tr>
    </tbody>
  </table>`;

  const css = html`<style>
    .observablehq .buffers {
      margin:auto;
      border: 1px solid #aaa;
      width: auto;
    }
    .observablehq .buffers td:not(:last-child) {
      border-right: 1px solid #aaa;
    }
    .observablehq .buffers tr:not(:last-child) {
      border-bottom: 1px solid #aaa;
    }
    .observablehq .buffers td {
      width: 30px;
      height: 30px;
      padding: 5px;
      text-align: center;
    }

    .observablehq .texture1 {
      margin: auto;
      border: 1px solid #aaa;
      width: auto;
    }
    .observablehq .texture1 tr:nth-child(even) {
      background-color: #eee;
    }
    .observablehq .texture1 td:not(:last-child) {
      border-right: 1px solid #aaa;
    }
    .observablehq .texture1 tr:not(:last-child) {
      border-bottom: 1px solid #aaa;
    }
    .observablehq .texture1 td {
      width: 30px;
      height: 30px;
      padding: 5px;
      text-align: center;
    }
  </style>`;

  return html`
  <figure style="max-width: 640px;text-align:center;">
    ${svg.node()}
    <h4 style="margin-bottom:3em;">Line geometry</h4>
    ${texture}
    <h4 style="margin-bottom:1em;margin-top:1em;">State texture representation</h4>
    ${css}
    <figcaption>The layout of the ${tex`j^{th}`} step of particle ${tex`i`}, ${tex`p_j^{(i)}`}, in a WebGL texture.</figcaption>
  </figure>`;
}
```

```js
md`As we step the ODE, we compute one new history point for each particle track. To avoid having to shift the entire history over one texel on every iteration just to append a new step, we instead treat each row as a ring buffer. At each time step ${tex`j`}, we use the previous column of the history, ${tex`p_{j-1}^{(i)}`}, to compute the next time step, ${tex`p_{j}^{(i)}`}. When we reach the end of the row, we loop back to the start, at each step overwriting the oldest time step with the newest.

The cells below define empty textures which will hold our state data.`
```

```js
state = {
  const fbo = regl.framebuffer({
    depthStencil: false,
    width: stepCount,
    height: particleCount,
    colorType: 'float',
    colorFormat: 'rgba'
  });

  // Clean up resources when Observable reevaluates this cell
  invalidation.then(() => fbo.destroy());

  return fbo;
}
```

```js
tmpStateColumn = {
  const fbo = regl.framebuffer({
    depthStencil: false,
    width: 1,
    height: particleCount,
    colorType: 'float',
    colorFormat: 'rgba'
  });
  invalidation.then(() => fbo.destroy());
  return fbo;
}
```

```js
mutable currentColumn = 0
```

```js
mutable t = 0
```

```js
md`## Computation

We now define our WebGL drawing commands. Our fundamental computational primitive will be similar to a *map* operation. WebGL 1 can't modify textures in-place, so this operation will read from one texture (or zero or two textures, if we like), perform some computation in a fragment shader, and write to an output texture.`
```

```js
{
  const w = Math.min(400, width);
  const h = (w * 3) / 4;
  const svg = d3.select(DOM.svg(w, h));

  const xScale = d3
    .scaleLinear()
    .domain([(-5 * w) / h, (5 * w) / h])
    .range([0, w]);

  const yScale = d3
    .scaleLinear()
    .domain([-5, 5])
    .range([h, 0]);

  const line = d3.line(d => xScale(d[0]), d => yScale(d[1])).defined(x => !!x);

  const axes = svg.append('g');
  axes
    .append('path')
    .attr('stroke', 'black')
    .attr('d', line([[-6, 0], [6, 0]]));
  axes
    .append('path')
    .attr('stroke', 'black')
    .attr('d', line([[0, -5], [0, 5]]));

  const quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  svg
    .append('path')
    .attr('stroke', '#888888')
    .attr('fill', 'rgba(0,0,0,0.05)')
    .attr('d', line(quad) + 'Z');

  const res = 12;
  const gridValues = [...Array(res - 1).keys()].map(
    i => ((i + 1) / res) * 2 - 1
  );
  const yGrid = gridValues.map(y => [[-1, y], [1, y], null]).flat();
  const xGrid = gridValues.map(x => [[x, -1], [x, 1], null]).flat();

  svg
    .append('path')
    .attr('stroke', 'rgba(0,0,0,0.2)')
    .attr('fill', 'none')
    .attr('d', line(xGrid));
  svg
    .append('path')
    .attr('stroke', 'rgba(0,0,0,0.2)')
    .attr('fill', 'none')
    .attr('d', line(yGrid));

  const bigTriangle = [[-4, -4], [4, -4], [0, 4]];
  svg
    .append('path')
    .attr('stroke', 'rgba(128,0,0,0.5)')
    .attr('fill', 'rgba(255,0,0,0.05)')
    .attr('d', line(bigTriangle) + 'Z');

  svg
    .append('g')
    .selectAll('circle')
    .data(bigTriangle)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 2.5)
    .attr('fill', 'red');
  svg
    .append('g')
    .selectAll('circle')
    .data(quad)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 2.5)
    .attr('fill', 'black');

  const labels = [
    {
      text: '(4, -4)',
      loc: [4, -4],
      baseline: 'hanging',
      anchor: 'start'
    },
    {
      text: '(-4, -4)',
      loc: [-4, -4],
      baseline: 'hanging',
      anchor: 'end'
    },
    { text: '(0, 4)', loc: [0, 4], baseline: 'auto', anchor: 'start' },
    {
      text: '(-1, -1)',
      loc: [-1, -1],
      baseline: 'hanging',
      anchor: 'end'
    },
    {
      text: '(1,1)',
      loc: [1, 1],
      baseline: 'auto',
      anchor: 'start'
    }
  ];

  svg
    .append('g')
    .selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.loc[0]))
    .attr('y', d => yScale(d.loc[1]))
    .attr('dx', d => (d.anchor === 'start' ? 5 : -5))
    .attr('dy', d => d.dy || 0)
    .text(d => d.text)
    .attr('dominant-baseline', d => d.baseline || 'auto')
    .attr('text-anchor', d => d.anchor || 'start');

  return html`
  <figure style="max-width: 640px;text-align: center;">
    ${svg.node()}
    <figcaption style="width:500px;max-width:100%;margin:auto">A single big triangle covers the entire ${tex`[-1, 1] \times [-1, 1]`} viewport in the ${tex`x-y`} plane of <a href="https://learnopengl.com/Getting-started/Coordinate-Systems">Normalized Device Coordinates</a> (NDC), triggering processing of all fragments. This forms our basic map operation for texture-based computation.</figcaption>
  </figure>`;
}
```

```js
md`Modern graphics APIs more directly treat data as data, but in WebGL 1 we must deal with data as if it's colors, triangles, and textures. So in order to step the ODE and update the state, we therefore need to draw some sort of geometric primitive and assign each state texel a color. Many people use a fullscreen quad composed of two triangles for this operation, but I find it simpler (and [potentially better for performance](https://www.npmjs.com/package/a-big-triangle)) to use a single big triangle which covers the entire viewport.

Whichever you prefer, when we write such commands, in a sense we need to think backwards: we focus on the *output* texture we're evaluating and then work backward, sampling our input textures as needed and executing a fragment shader to determine the resulting output color.

Thus, the *vertex shader* will trivially position this triangle, and the *fragment shader* is where we will perform the real computation.`
```

```js
section_initialization = md`### Initialization

We start with a simple draw command. Initialization uniformly assigns each row of the state texture (all of a particle's history) to some random location within a sphere. Generating good pseudorandom numbers on a GPU is tricky, so to initialize our state, we use a low-discrepancy quasirandom number generator described by Martin Roberts in *[The Unreasonable Effectiveness
of Quasirandom Sequences](http://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/)*.

The command below implements this step and writes the result to an output framebuffer.`
```

```js
initializeState = regl({
  vert: `
    precision mediump float;
    attribute vec2 xy;
    varying vec2 uv;
    void main () {
      uv = 0.5 * xy + 0.5;
      gl_Position = vec4(xy, 0, 1);
    }`,
  frag: `
    precision mediump float;
    varying vec2 uv;
    uniform vec2 resolution;
    uniform vec3 origin;
    uniform float scale;
    uniform sampler2D src;

    // http://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/
    vec3 quasirandom (float n) {
      const float g = 1.22074408460575947536;
      return fract(0.5 + n * vec3(1.0 / g, 1.0 / (g * g), 1.0 / (g * g * g))).zyx;
    }

    vec3 sphericalRandom (float n) {
      vec3 rand = quasirandom(n);
      float u = rand.x * 2.0 - 1.0;
      float theta = (2.0 * ${Math.PI}) * rand.y;
      return vec3(sqrt(1.0 - u * u) * vec2(cos(theta), sin(theta)), u) * sqrt(rand.z);
    }

    void main () {
      // gl_FragCoord is offset by a half-texel, but it's actually nice to avoid
      // identically zero states, since they tend to get stuck along zero
      // axes and follow unstable paths off to infinity.
      float particle = gl_FragCoord.y;

      // Output (x, y, z, 1):
      gl_FragColor = vec4(origin + scale * sphericalRandom(particle), 1);
    }`,
  uniforms: {
    resolution: ctx => [ctx.framebufferWidth, ctx.framebufferHeight],
    origin: (ctx, props) => [0, 1, 0],
    scale: (ctx, props) => 1
  },
  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
  framebuffer: regl.prop('dst'),
  count: 3
})
```

```js
triggerInitialization = {
  restart;
  regl.poll();
  mutable currentColumn = 0;
  mutable t = 0;
  initializeState({ dst: state });
}
```

```js
section_integration = md`### Integration
Next, we define a shader to integrate the ODE. Our output destination is a texture just large enough to hold the single time step we are computing. Its dimension is therefore 1 texel wide and \`particleCount\` texels tall. In the fragment shader, we sample the current state from our full state texture, perform an integration step, and output the updated state as the fragment color. Finally, we invoke an additional \`copyStateColumn\` draw command to transfer this single history slice back into our main state texture.

For integration, we use the [fourth-order Runge-Kutta](https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods#The_Runge%E2%80%93Kutta_method) (RK4) method and directly substitute a GLSL derivative function into the shader.`
```

```js
attractorGLSL = `
vec3 derivative (float x, float y, float z, float t) {
  const float alpha = 3.0;
  const float beta = 2.20;
  const float gamma = 1.0;
  const float mu = 1.510;
  return vec3(
    alpha * x * (1.0 - y) - beta * z,
    -gamma * y * (1.0 - x * x),
    mu * x
  );
}`
```

```js
integrate = regl({
  vert: `
    precision highp float;
    attribute vec2 xy;
    varying vec2 srcTexCoord;
    uniform float srcTexCoordU;
    void main () {
      // Map clip coords ([-1, 1] x [-1, 1]) to texture coords
      // ([0, 1] x [0, 1]) and store in a varying to be used
      // in the fragment shader:
      srcTexCoord = vec2(srcTexCoordU, 0.5 * xy.y + 0.5);
      gl_Position = vec4(xy, 0, 1);
    }`,
  frag: `
    precision highp float;
    uniform sampler2D srcTex;
    uniform float dt, t;
    varying vec2 srcTexCoord;

    ${attractorGLSL}

    vec3 deriv (vec3 p, float t) {
      // Unpack, for convenience
      return derivative(p.x, p.y, p.z, t);
    }

    void main () {
      vec3 p = texture2D(srcTex, srcTexCoord).xyz;

      // Runge-Kutta 4th order integration
      vec3 k1 = deriv(p, t);
      vec3 k2 = deriv(p + (0.5 * dt) * k1, t + 0.5 * dt);
      vec3 k3 = deriv(p + (0.5 * dt) * k2, t + 0.5 * dt);
      vec3 k4 = deriv(p + dt * k3, t + dt);

      // Evaluate the derivative there and use for a whole step:
      gl_FragColor = vec4(p + (dt / 6.0) * (k1 + k4 + 2.0 * (k2 + k3)), 1);

      // If the particle diverges off to infinity, place it back near the origin
      if (dot(gl_FragColor.xyz, gl_FragColor.xyz) > 1e6) {
        gl_FragColor.xyz *= 0.0001;
      }
    }`,
  attributes: {
    xy: [[-4, -4], [0, 4], [4, -4]]
  },
  uniforms: {
    dt: regl.prop('dt'),
    t: regl.prop('t'),
    srcTex: regl.prop('src'),
    // Convert the integer column index into a texture coordinate in [0, 1],
    // keeping in mind that texture coordinates are centered a the *center* of each texel
    srcTexCoordU: (ctx, props) => (props.srcColumn + 0.5) / stepCount
  },
  framebuffer: regl.prop('dst'),
  count: 3
})
```

```js
md`After running this command, we will have computed our updated state, except it will be in the the wrong place—our temporary texture. The following command implements the copy operation so that we can transfer it back to the correct place in our state texture. It uses scissoring to limit this copy to a single column, and we use a mutable counter to track the current time step column.`
```

```js
copyStateColumn = regl({
  vert: `
    precision mediump float;
    attribute vec2 xy;
    varying vec2 uv;
    void main () {
      uv = 0.5 * xy + 0.5;
      gl_Position = vec4(xy, 0, 1);
    }`,
  frag: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D srcTex;
    void main () {
      gl_FragColor = texture2D(srcTex, uv);
    }`,
  attributes: { xy: [[-4, -4], [0, 4], [4, -4]] },
  uniforms: {
    srcTex: regl.prop('src')
  },
  framebuffer: regl.prop('dst'),
  scissor: {
    enable: true,
    box: {
      x: regl.prop('dstColumn'),
      y: 0,
      height: particleCount,
      width: 1
    }
  },
  count: 3
})
```

```js
md`## Line Rendering

In the timeless words of Matt DesLauriers, *[Drawing Lines is Hard](https://mattdesl.svbtle.com/drawing-lines-is-hard)*. This notebook didn't really come together until [Rye Terrell](https://twitter.com/wwwtyro)'s post, *[Instanced Line Rendering Part II: Alpha blending](https://wwwtyro.net/2021/10/01/instanced-lines-part-2.html)*, spurred me to resurrect my long-running attempts to come up with a clean solution for line rendering.

The resulting module is published as [regl-gpu-lines](https://github.com/rreusser/regl-gpu-lines). At the end of the day, it's really nothing more than a basic line rendering function, but it's written to be as general possible so that you can connect \`attribute\` and \`varying\` inputs to your data in the particular way which is meaningful to you.`
```

```js echo
reglLines = require('https://unpkg.com/regl-gpu-lines@2.2.0')
```

```js
md`The general flow of vertex data required to render lines is illustrated below. Instead of particle positions in the vertex attributes, we instead store *texture coordinates*. Then in the vertex shader, we perform a texture lookup to retrieve the corresponding state vector, which we plot as the vertex position. 

The texture coordinates of the ${tex`i^{th}`} particle at the ${tex`j^{th}`} step are ${tex`(u_j^{(i)}, v_j^{(i)})`}, denoted ${tex`\mathbf{u}_j^{(i)}`}. They are equal to

${tex.block`\mathbf{u}_j^{(i)} = \left(\frac{j + \frac{1}{2}}{M}, \frac{i + \frac{1}{2}}{N}\right),`}
where there are ${tex`M`} total time steps and ${tex`N`} total particle tracks. Texture sampler coordinates are located at the center of each texel, accounting for the half-texel offset.

`
```

```js
{
  const w = Math.min(600, width);
  const h = 150;
  const svg = d3.select(DOM.svg(w, h));

  const colors = ['#cc2255', '#2255dd'];

  const xScale = d3
    .scaleLinear()
    .domain([-2.5, 2.5])
    .range([0, w]);

  const yScale = d3
    .scaleLinear()
    .domain([-0.5, 0.9])
    .range([h, 0]);

  const line = d3
    .line(d => xScale(d[0]), d => yScale(d[1]))
    .defined(d => !!d && !isNaN(d[0]));

  const pointsPerSeg = 5;
  const points = [
    [-2, -0.2],
    [-1.5, 0.5],
    [-1, 0.2],
    [-0.5, 0.2],
    [0, 0.6],
    null,
    [0, -0.2],
    [0.5, -0.1],
    [1, 0.2],
    [1.5, 0.3],
    [2, 0.1]
  ];

  svg
    .append('path')
    .attr('stroke', colors[0])
    .attr('fill', 'none')
    .attr('d', line(points.slice(0, pointsPerSeg)));

  svg
    .append('path')
    .attr('stroke', colors[1])
    .attr('fill', 'none')
    .attr('d', line(points.slice(pointsPerSeg + 1)));

  svg
    .append('g')
    .selectAll('circle')
    .data(points.filter(d => d))
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[0]))
    .attr('cy', d => yScale(d[1]))
    .attr('r', 2.5)
    .attr('fill', (d, i) => colors[Math.floor(i / pointsPerSeg)]);

  const entry = svg
    .append('g')
    .selectAll('text')
    .data(points.filter(d => d))
    .enter()
    .append('text')
    .attr('x', d => xScale(d[0]))
    .attr('y', d => yScale(d[1]))
    .attr('dy', d => 7)
    .attr('dy', 18)
    .attr('dominant-baseline', d => 'auto')
    .attr('font-family', 'KaTeX_Main,Times New Roman,serif')
    .attr('text-anchor', d => 'start')
    .attr('fill', (d, i) => colors[Math.floor(i / pointsPerSeg)]);

  entry
    .append('tspan')
    .text('p')
    .attr('font-weight', 700);

  entry.append('tspan').text('(');
  entry
    .append('tspan')
    .text('u')
    .attr('font-weight', 700)
    .attr('dx', '-0.1em');
  entry
    .append('tspan')
    .attr('font-size', '.6em')
    .attr('dy', '-.8em')
    .text((d, i) => `(${Math.floor(i / pointsPerSeg)})`);

  entry
    .append('tspan')
    .attr('font-size', '.6em')
    .attr('dy', '1.2em')
    .attr('dx', '-1.1em')
    .text((d, i) => i % pointsPerSeg);
  entry
    .append('tspan')
    .attr('dx', '0.35em')
    .attr('dy', '-0.25em')
    .text(')');

  const particles = 2;
  const steps = 5;
  const texture = html`<div style="display:flex;flex-direction:row;justify-content:center;align-items:center;">
    <div style="width:30px;transform:rotate(-90deg) translate(-50%,0)">&larr;<em>v</em></div>
    <div>texture coord <em>u</em>&rarr;<br>
    <table class="texture2"><tbody>${[...Array(particles).keys()].map(
      (particle, i) => {
        return html`<tr style="color:${colors[particle]}">${[
          ...Array(steps).keys()
        ].map(step => {
          let eqn;
          const linenum = Math.floor(step / (pointsPerSeg + 1));
          eqn = tex`\mathbf{u}_${step}^{(${particle})}`;
          return html`<td>${eqn}</td>`;
        })}</tr>`;
      }
    )}</tbody></table>
    </div>
  </div>`;

  const endpoints = [0, 1, 2, 4, 3, 2, 0, 1, 2, 4, 3, 2];
  const lookupTable = html`
  <table class="buffers" style="margin-bottom:1em">
    <tbody>
      <tr>
        <td style="background-color:#eee">vertex</td>${[
          ...Array(points.length).keys()
        ].map(step => {
          const p = Math.floor(step / (pointsPerSeg + 1));
          const i = step % (pointsPerSeg + 1);
          if (i === pointsPerSeg)
            return html`<td style="background-color:#eee">${tex`\textsf{NaN}`}</td>`;
          const css = `color:${colors[p]}`;
          return html`<td style="${css}">${tex`\mathbf{u}_{${i}}^{(${p})}`}</td>`;
        })}
      </tr>
    </tbody>
  </table>
  <table class="buffers">
    <tbody>
      <tr>
        <td style="background-color:#eee">endpoint</td>${endpoints.map(
          (endpoint, endpointIndex) => {
            const seg = Math.floor(endpointIndex / 3);
            const line = Math.floor(endpointIndex / 6);
            const css = `color:${colors[line]};background-color:${
              Math.floor(endpointIndex / 3) % 2 === 0 ? 'none' : '#eee'
            }`;
            return html`<td style="${css}">${tex`\mathbf{u}_{${endpoint}}^{(${line})}`}</td>`;
          }
        )}
      </tr>
      <tr>
        <td style="background-color:#eee">isstart</td>${[1, 0, 1, 0].map(
          (isStart, idx) => {
            const css = `color:${
              colors[Math.floor(idx / 2)]
            };background-color:${isStart ? 'none' : '#eee'}`;
            return html`<td colspan="3" style=${css}>${tex`${isStart}`}</td>`;
          }
        )}
      </tr>
    </tbody>
  </table>`;

  const css = html`<style>
    .observablehq .buffers {
      margin:auto;
      border: 1px solid #aaa;
      width: auto;
    }
    .observablehq .buffers td:not(:last-child) {
      border-right: 1px solid #aaa;
    }
    .observablehq .buffers tr:not(:last-child) {
      border-bottom: 1px solid #aaa;
    }
    .observablehq .buffers td {
      width: 30px;
      height: 30px;
      padding: 5px;
      text-align: center;
    }

    .observablehq .texture2 {
      margin: auto;
      border: 1px solid #aaa;
      width: auto;
    }
    .observablehq .texture2 tr:nth-child(even) {
      background-color: #eee;
    }
    .observablehq .texture2 td:not(:last-child) {
      border-right: 1px solid #aaa;
    }
    .observablehq .texture2 tr:not(:last-child) {
      border-bottom: 1px solid #aaa;
    }
    .observablehq .texture2 td {
      width: 30px;
      height: 30px;
      padding: 5px;
      text-align: center;
    }
  </style>`;

  return html`
  <figure style="max-width: 640px;text-align:center;">
    ${lookupTable}
    <h4 style="margin-top:1em;margin-bottom:2em">Texture lookup vertex attribute buffers</h3>
    ${texture}
    <h4 style="margin-bottom:3em;margin-top:1em;">State texture coordinates</h3>
    ${svg.node()}
    <h4 style="margin-bottom:3em;">Line geometry</h3>
    ${css}
    <figcaption style="width:500px;max-width:100%;margin:auto">Data layout for line rendering. We start with vertex attributes containing texture coordinates and sample the state texture in the line drawing vertex shader to position line vertices.</figcaption>
  </figure>`;
}
```

```js
md`Drawing lines proceeds in two steps. First, we draw interior segments. For this step, we pass the *vertex* attribute above. Each contiguous particle track is separated by a sentinel value. (Here I've called that \`NaN\`, though GLSL is not particularly IEEE754 compliant, so what I've *acutally* done is to pass it the out-of-bounds texture coordinate ${tex`(-1, -1)`} which is then converted into a \`vec4\` position with \`w = 0.0\`, which the function interprets as a line break.) Rendering is accomplished by passing the same attribute aliased *four* times with a different offset. At each vertex we draw a segment and one adjacent join, sliding a window along the line and drawing a separate geometry instance for each segment. [Rye Terrell](https://wwwtyro.net/2021/10/01/instanced-lines-part-2.html) has an excellent post which walks through this process very clearly.

The second step is to draw end caps. For this step, we have to be a bit more clever and pass blocks of the three points nearest each end cap. Since GLSL ES 1.00 lacks the \`gl_InstanceID\` keyword, we're a bit limited in our options and need to pass a second per-endpoint-instance attribute which defines whether it's a starting or ending cap.

The demo below illustrates the resulting geometry, importing its implementation from the [\`regl\` Instanced Lines](https://observablehq.com/d/a5f8f4c894c77aaf) notebook. Line segments from the first pass are illustrated in blue, while line caps from the second pass are illustrated in red.`
```

```js
lineExampleRegl._gl.canvas
```

```js
viewof lineParams = multiplexInputs(
  {
    join: Inputs.select(['bevel', 'miter', 'round'], {
      value: 'miter',
      label: 'Joins'
    }),
    cap: Inputs.select(['none', 'square', 'round'], {
      value: 'round',
      label: 'Caps'
    }),
    capResolution: Inputs.range([1, 10], {
      value: 4,
      label: 'Cap resolution',
      step: 1
      //disabled: cap !== 'round'
    }),
    joinResolution: Inputs.range([1, 10], {
      value: 3,
      label: 'Join resolution',
      step: 1
      //disabled: join !== 'round'
    }),
    miterLimit: Inputs.range([1, 8], {
      value: 2,
      step: 0.1,
      label: 'Miter limit'
      //disabled: join !== 'miter'
    })
  },
  { label: 'Line parameters', open: true }
)
```

```js
renderExample = renderLineExample(lineParams)
```

```js
md`One small trick is to use the texture coordinate corresponding to the particle ID to offset the [Normalized Device Coordinates](https://learnopengl.com/Getting-started/Coordinate-Systems) z-coordinate of the projected line vertices. At the cost of strictly correct z-ordering, this prevents a bit of the excessive z-fighting which we otherwise encounter.

The function below defines the line rendering command. The \`#pragma\` statements are just something I've made up as a means of defining how it connects to the attribute inputs and converts those to positions and widths.`
```

```js
drawLines = reglLines(regl, {
  vert: `
    precision highp float;
    
    #pragma lines: attribute vec2 lookupCoord;
    #pragma lines: attribute float orientation;
    #pragma lines: position = projectPoint(lookupCoord);
    #pragma lines: width = pointWidth(lookupCoord);
    #pragma lines: varying vec3 color = getColor(lookupCoord);
    #pragma lines: orientation = getCapOrientation(orientation);

    uniform mat4 uProjectionView;
    uniform sampler2D src;
    uniform float scale, texOffset, width, pixelRatio, particleCount;

    vec4 projectPoint (vec2 point) {
      if (point.x < 0.0) return vec4(0);
      vec3 xyz = texture2D(src, fract(point.xy + vec2(texOffset, 0))).xyz;
      vec4 p = uProjectionView * vec4(xyz, 1);
      float w = p.w;
      p /= w;
      p.z -= 0.0002 * abs(point.y - 0.5);
      return p * w;
    }

    float getCapOrientation(float orientation) {
      return orientation;
    }

    float pointWidth (vec2 point) {
      return width;
    }
     
    vec3 getColor (vec2 point) {
      const vec3 color1 = vec3(0.55, 0.89, 0.65);
      const vec3 color2 = vec3(0.11, 0.32, 0.65);
      return mix(color1, color2, point.y);
    }`,
  frag: `
    precision highp float;
    varying vec3 lineCoord;
    varying vec3 color;
    void main () {
      const vec3 borderColor = vec3(1);
      gl_FragColor = vec4(mix(
        color,
        borderColor,
        smoothstep(0.5, 0.9, length(lineCoord.xy))
      ), 1);
    }`,
  uniforms: {
    width: (ctx, props) => ctx.pixelRatio * 5,
    src: regl.prop('src'),
    texOffset: regl.prop('texOffset')
  },
  depth: { enable: true },
  cull: { enable: false }
})
```

```js
md`The lines below construct the vertex attributes containing texture coordinate which the line drawing command uses to sample our state texture.`
```

```js
vertexAttributes = {
  const positions = [];
  for (let i = 0; i < particleCount; i++) {
    for (let j = 0; j < stepCount; j++) {
      positions.push([(j + 0.5) / stepCount, (i + 0.5) / particleCount]);
    }
    if (i < particleCount - 1) {
      positions.push([-1, -1]);
    }
  }

  let lookupCoord = regl.buffer(positions);
  invalidation.then(() => lookupCoord.destroy());
  return { lookupCoord, count: positions.length };
}
```

```js
endpointAttributes = {
  const endpoints = [];
  const orientation = [];
  let count = 0;
  for (let j = 0; j < particleCount; j++) {
    // Start cap
    for (let i = 0; i < 3; i++) {
      endpoints.push([(i + 0.5) / stepCount, (j + 0.5) / particleCount]);
    }

    // End cap
    for (let i = stepCount - 1; i >= stepCount - 3; i--) {
      endpoints.push([(i + 0.5) / stepCount, (j + 0.5) / particleCount]);
    }

    // One start, one end
    orientation.push(reglLines.START_CAP, reglLines.END_CAP);
    count += 2;
  }

  let endpointBuffer = regl.buffer(endpoints);
  let orientationBuffer = regl.buffer(new Uint8Array(orientation));
  invalidation.then(() => {
    endpointBuffer.destroy();
    orientationBuffer.destroy();
  });
  return { lookupCoord: endpointBuffer, orientation: orientationBuffer, count };
}
```

```js
lineData = ({
  cap: 'round',
  join: 'bevel',
  capResolution: 4,
  vertexAttributes,
  endpointAttributes,
  vertexCount: vertexAttributes.count,
  endpointCount: endpointAttributes.count
})
```

```js
md`## Draw loop`
```

```js
md`Finally we put it all together into a main drawing loop which performs a full step of the ODE and then configures the camera and renders lines.`
```

```js echo
mainDrawLoop = {
  initializeState;
  camera.taint();
  const simulate = ~opts.indexOf('Simulate');
  let frame = regl.frame(() => {
    try {
      if (simulate) {
        integrate({
          src: state,
          dst: tmpStateColumn,
          srcColumn: mutable currentColumn,
          dt,
          t: mutable t
        });

        mutable t += dt;
        mutable currentColumn = (mutable currentColumn + 1) % stepCount;

        copyStateColumn({
          src: tmpStateColumn,
          dst: state,
          dstColumn: mutable currentColumn
        });
      }

      camera(({ dirty }) => {
        // Only render if we're currently simulating or if the camera is moved
        if (!simulate && !dirty) return;
        regl.clear({ color: [1, 1, 1, 1], depth: 1 });

        drawLines({
          ...lineData,
          src: state,
          texOffset: (mutable currentColumn - stepCount + 1) / stepCount
        });
      });
    } catch (e) {
      console.error(e);
      frame && frame.cancel();
      frame = null;
    }
  });
  invalidation.then(() => {
    frame && frame.cancel();
    frame = null;
  });
}
```

```js
md`And that's it! You can see the result at the top of this page. Stay tuned for [Strange Attractors on the GPU, Part 2 🔗](https://observablehq.com/d/df2e1a97f7ab9a46), in which we copy/paste the exact same code, except focusing on making it look as good as possible rather than clear exposition.`
```

```js
md`## Imports`
```

```js
import { multiplexInputs } from '@rreusser/multiplex-inputs'
```

```js
import {
  regl2 as lineExampleRegl,
  renderExample as renderLineExample
} from 'a5f8f4c894c77aaf'
```
