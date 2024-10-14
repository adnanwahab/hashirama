```js
md`# Buddhabrot Playground`
```

```js
canvas = {
  let canvas = DOM.canvas(width * 2, 1200);
  canvas.style.width = width + "px";
  canvas.style.height = "600px";
  return canvas;
}
```

```js
md`Adjust the brightness (exposure) of the fractal`
```

```js
viewof input_exposure = html`<input type=range value="0" min="-100" max="100">`
```

```js
md`Adjust the colormap of the fractal. Lower, medium, and high number of escape iterations are mapped to the three colors below. The spectrum parameter modulates the separation of colors.`
```

```js
viewof input_spectrum = html`<input type="range" min="0" max="100" value="50" />`
```

```js
viewof input_color1 = html`<input type="color" value="${chroma("royalblue")}" />`
```

```js
viewof input_color2 = html`<input type="color" value="${chroma("lime")}" />`
```

```js
viewof input_color3 = html`<input type="color" value="${chroma("red")}" />`
```

```js
md`## Introduction`
```

```js
md`
Many people are familiar with the [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) which is the set of complex numbers ${tex`c`} for which the iterative equation ${tex`z_{n+1}=z_n^2+c`} does not diverge when iterated from ${tex`z_0=0`}. The Mandelbrot set is usually visualized by plotting the complex plane of ${tex`c`} with some color scheme to encode the speed of divergence.

The [Buddhabrot](https://en.wikipedia.org/wiki/Buddhabrot) is another way to visualize the same iterative equation. To produce the Buddhabrot visualization, we take a uniform sample of ${tex`c`} points on the complex plane, find those that lead to divergent ${tex`\{z_n\}`} sequences. We then take all the ${tex`z`} points of the divergent sequences and accumulate them into a histogram (each bin correspond to a pixel) on the ${tex`z`} plane. The histogram is then colormapped for a better visual effect.

This interactive notebook allows you to play with a Buddhabrot rendering program implemented in JavaScript with WebGL 2. You can create interesting visualizations by changing the iterative equation, projection method, and other parameters.

This notebook is ported from my Buddhabrot renderer program at <https://donghaoren.org/buddhabrot/>. The program offers more presets to play with, while this notebook allows you to manipulate the code directly. Source code: <https://github.com/donghaoren/buddhabrot-renderer>.
`
```

```js
md`## Equations`
```

```js
md`
The following GLSL (WebGL's shader language) function defines the iterative function of Mandelbrot

${tex.block`z_{n+1} = z_n^2 + c`}

In the program, complex numbers are represented using \`vec2\` types. The x component is the real part, and the y component is the imaginary part. For example, ${tex`z = 2 + 3i`} is represented as \`z = vec2(2.0, 3.0)\`.

You can modify this function to use other equations to produce different fractals. Below are some examples that you can try:

    # Tricorn equation:
    return vec2(z.x * z.x - z.y * z.y + c.x, -z.x * z.y * 2.0 + c.y);

`
```

```js echo
fractal_code = () => `vec2 fractal(vec2 z, vec2 c) {
  return vec2(z.x * z.x - z.y * z.y + c.x, z.x * z.y * 2.0 + c.y);
}`
```

```js
md`
The following GLSL function defines how a fractal state ${tex`(z, c)`} is projected to the 2D plane for visualization. The default behavior is to just show ${tex`z`}, which produces the default Buddhabrot.

You can modify this function to produce alternative projections. Here are some to try:

    # Show the c values instead of z (this produces the Mandelbrot):
    return c;

    # Show the real parts of z and c (this produces a logistic map):
    return vec2(z.x, c.x);
`
```

```js echo
fractal_projection_code = () => `vec2 fractal_projection(vec2 z, vec2 c) {
  return z;
}`
```

```js
md`## Rendering the Buddhabrot Fractal
`
```

```js
md`
It's not easy to render the Buddhabrot fractal efficiently. If you just take a uniform sample of ${tex`c`} points, most of them will diverge very quickly, wasting the computation time. It turns out that the most useful points are those close but not inside the Mandelbrot set. In this program, we follow an importance sampling method to speed up rendering.
`
```

```js
md`### Importance Sampling
Importance sampling is completed in two steps:
1. Generate an importance map by looking for ${tex`c`} points that leads to long divergent ${tex`\{z_n\}`} sequences. We do this in the GPU using a WebGL shader.
2. Sample the importance map to produce a set of ${tex`c`}. This is completed in the CPU in JavaScript.
`
```

```js echo
sampler_params = ({
  mipmapLevel: 1,
  size: 512,
  mipmapSize: 256
})
```

```js echo
shader_mandelbrot = compileShader(
  `
  precision highp float;
  attribute vec2 a_position;
  void main () {
    gl_Position = vec4(a_position, 0, 1);
  }
  `,
  `
  precision highp float;
  uniform vec2 u_resolution;
  uniform int u_maxIterations;
  ${fractal_code()}
  ${fractal_projection_code()}
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 c = uv * 4.0 - vec2(2.0);
    vec2 z = vec2(0.0);
    vec2 pw;
    vec2 z1;
    bool escaped = false;
    int number_iterations = 0;
    int num_contain = 0;
    for (int i = 0; i < 256; i++) {
      if (i >= u_maxIterations) {
        number_iterations = i;
        break;
      }
      z1 = fractal(z, c);
      if(z.x == z1.x && z.y == z1.y) {
        number_iterations = u_maxIterations;
        break;
      }
      z = z1;
      pw = fractal_projection(z, c);
      if(pw.x >= -2.0 && pw.x <= 2.0 && pw.y >= -2.0 && pw.y <= 2.0) {
        num_contain++;
      }
      if (length(z) > 4.0) {
        escaped = true;
        number_iterations = i;
        break;
      }
    }
    float v = float(number_iterations >= 16 ? num_contain : 0) / 255.0;
    gl_FragColor = escaped && num_contain > 0 ? vec4(vec3(v), 1.0) : vec4(0, 0, 0, 1);
  }
  `
)
```

```js echo
sampler = {
  let mipmapLevel = sampler_params.mipmapLevel;
  let size = sampler_params.size;
  let mipmapSize = sampler_params.mipmapSize;
  let scaler = 256 * 256 / (mipmapSize * mipmapSize);
  // Create a texture to render the importance map to
  let framebufferTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, size, size, 0, gl.RED, gl.UNSIGNED_BYTE, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  // Create framebuffer and assign the texture
  let framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebufferTexture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  // Create a quad primitive to render the importance map
  let quadVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  
  return {
    sampledBuffer: gl.createBuffer(),
    mipmapLevel, size, mipmapSize, scaler, framebufferTexture, framebuffer, quadVertices
  };
}
```

```js echo
importance_map = {
  let buffer = new Uint8Array(sampler.mipmapSize * sampler.mipmapSize);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.bindFramebuffer(gl.FRAMEBUFFER, sampler.framebuffer);
  gl.viewport(0, 0, sampler.size, sampler.size);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sampler.framebufferTexture, 0);
  // Render mandelbrot
  gl.useProgram(shader_mandelbrot);
  gl.uniform2f(gl.getUniformLocation(shader_mandelbrot, "u_resolution"), sampler.size, sampler.size);
  gl.uniform1i(gl.getUniformLocation(shader_mandelbrot, "u_maxIterations"), 512);
  gl.bindBuffer(gl.ARRAY_BUFFER, sampler.quadVertices);
  gl.enableVertexAttribArray(gl.getAttribLocation(shader_mandelbrot, "a_position"));
  gl.vertexAttribPointer(gl.getAttribLocation(shader_mandelbrot, "a_position"), 2, gl.FLOAT, false, 8, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  // Generate mipmap and read pixels at desired level
  gl.bindTexture(gl.TEXTURE_2D, sampler.framebufferTexture);
  if (sampler.mipmapLevel != 0) {
    gl.generateMipmap(gl.TEXTURE_2D);
  }
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sampler.framebufferTexture, sampler.mipmapLevel);
  gl.readPixels(0, 0, sampler.mipmapSize, sampler.mipmapSize, gl.RED, gl.UNSIGNED_BYTE, buffer);
  // Reset the framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return {
    buffer
  };
}
```

```js echo
function importance_sample() {
  let buffer = importance_map.buffer;
  let total_value = 0;
  for (let i = 0; i < buffer.length; i++) {
    let v = buffer[i];
    total_value += v;
  }
  let multipler = total_value > 0 ? 1 + Math.floor(10000 / total_value) : 1;
  total_value *= multipler;
  
  let samplesData = new Float32Array(total_value * 3);
  
  let i_sample = 0;
  let ix = 0;
  let iy = 0;
  let scale = 1.0 / sampler.mipmapSize * 4;
  for (let i = 0; i < buffer.length; i++) {
    let v = (buffer[i]) * multipler;
    let x = ix * scale - 2;
    let y = iy * scale - 2;
    for (let j = 0; j < v; j++) {
      let dx = (random_uniform() + 0.5) * scale;
      let dy = (random_uniform() + 0.5) * scale;
      samplesData[i_sample++] = x + dx;
      samplesData[i_sample++] = y + dy;
      samplesData[i_sample++] = 1.0 / v;
    }
    ix++;
    if (ix >= sampler.mipmapSize) {
      ix = 0;
      iy++;
    }
  }
  // Upload the samples to the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, sampler.sampledBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, samplesData, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return {
    samples: sampler.sampledBuffer, count: total_value
  };
}
```

```js
md`### Produce the Image
Now we have a bunch of importance sampled ${tex`c`} values, we can render the fractal.
Rendering is completed using a sequence of TransformFeedback passes, each pass complete one iteration of all points in parallel.
`
```

```js echo
renderer = {
  let renderWidth = canvas.width * 2;
  let renderHeight = canvas.height * 2;
  
  let feedbackBuffer1 = gl.createBuffer();
  let feedbackBuffer2 = gl.createBuffer();
  let transformFeedback = gl.createTransformFeedback();
  let framebufferTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, renderWidth, renderHeight, 0, gl.RGBA, gl.FLOAT, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  let framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebufferTexture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return {
    renderWidth, renderHeight,
    feedbackBuffer1, feedbackBuffer2,
    transformFeedback, framebufferTexture, framebuffer
  };
}
```

```js echo
texture_color = {
  let textureColor = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, textureColor);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return textureColor;
}
```

```js echo
colormap = {
  let color2xyz = (c) => lab2xyz(...chroma(c).lab());
  let colormap = [
    chroma.scale(["#000000", input_color1]).correctLightness().colors(100).map(color2xyz),
    chroma.scale(["#000000", input_color2]).correctLightness().colors(100).map(color2xyz),
    chroma.scale(["#000000", input_color3]).correctLightness().colors(100).map(color2xyz)
  ];
  gl.bindTexture(gl.TEXTURE_2D, texture_color);
  let textureData = new Float32Array(colormap[0].length * 4 * 6);
  let p = 0;
  for (let k = 0; k < 3; k++) {
    for (let m = 0; m < 2; m++) {
      for (let i = 0; i < colormap[0].length; i++) {
        textureData[p++] = colormap[k][i][0];
        textureData[p++] = colormap[k][i][1];
        textureData[p++] = colormap[k][i][2];
        textureData[p++] = colormap[k][i][3];
      }
    }
  }
  let colormapSize = colormap[0].length;
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, colormap[0].length, 6, 0, gl.RGBA, gl.FLOAT, textureData);
  gl.bindTexture(gl.TEXTURE_2D, null);
    
  return {
    textureColor: texture_color, colormapSize
  }
}
```

```js echo
shader_buddhabrot = compileShader(
  `#version 300 es
  precision highp float;
  in vec3 a_position;
  in vec3 i_position;
  out vec3 o_position;
  out vec3 vo_accum;
  uniform float u_aspect_ratio;
  ${fractal_code()}
  ${fractal_projection_code()}
  void main () {
    o_position = vec3(fractal(i_position.xy, a_position.xy), i_position.z);
    vec2 proj = fractal_projection(o_position.xy, a_position.xy);
    proj.y /= u_aspect_ratio;
    gl_Position = vec4(proj / 2.0, 0, 1);
    if(i_position.z < 0.3333) {
      vo_accum = vec3(a_position.z) * vec3(1, 0, 0);
    } else if(i_position.z < 0.6666) {
      vo_accum = vec3(a_position.z) * vec3(0, 1, 0);
    } else {
      vo_accum = vec3(a_position.z) * vec3(0, 0, 1);
    }
  }
  `,
  `#version 300 es
  precision highp float;
  in vec3 vo_accum;
  out vec4 v_color;
  void main() {
      v_color = vec4(vec3(vo_accum), 1);
  }
  `,
  (p) => {
    gl.transformFeedbackVaryings(p, ["o_position"], gl.SEPARATE_ATTRIBS);
  }
)
```

```js echo
shader_buddhabrot_escape = compileShader(
  `#version 300 es
  precision highp float;
  in vec3 a_position;
  out vec3 o_position;
  out vec3 vo_accum;
  uniform float u_spectrum_scaler;
  ${fractal_code()}
  void main () {
    vec2 z = vec2(0);
    o_position = vec3(100.0, 100.0, 100.0);
    for(int i = 0; i < 256; i++) {
      z = fractal(z, a_position.xy);
      if(z.x * z.x + z.y * z.y > 16.0) {
        o_position = vec3(0, 0, float(i) / 160.0 * u_spectrum_scaler);
        break;
      }
    }
  }
  `,
  `#version 300 es
  precision highp float;
  in vec3 vo_accum;
  out vec4 v_color;
  void main() {
    v_color = vec4(vec3(vo_accum), 1);
  }
  `,
  (p) => {
    gl.transformFeedbackVaryings(p, ["o_position"], gl.SEPARATE_ATTRIBS);
  }
)
```

```js echo
shader_color = compileShader(
  `
  precision highp float;
  attribute vec2 a_position;
  varying vec2 vo_position;
  void main () {
    vo_position = (vec2(-a_position.y, a_position.x) + 1.0) / 2.0;
    gl_Position = vec4(a_position, 0, 1);
  }
  `, `
  precision highp float;
  uniform sampler2D texture;
  uniform sampler2D textureColor;
  uniform float colormapSize;
  uniform float colormapScaler;
  varying vec2 vo_position;
  float xyz_rgb_curve(float r) {
    if(r <= 0.00304) {
      return 12.92 * r;
    } else {
      return 1.055 * pow(r, 1.0 / 2.4) - 0.055;
    }
  }
  vec3 xyz2rgb(vec3 xyz) {
    return vec3(
      xyz_rgb_curve(3.2404542 * xyz.x - 1.5371385 * xyz.y - 0.4985314 * xyz.z),
      xyz_rgb_curve(-0.9692660 * xyz.x + 1.8760108 * xyz.y + 0.0415560 * xyz.z),
      xyz_rgb_curve(0.0556434 * xyz.x - 0.2040259 * xyz.y + 1.0572252 * xyz.z)
    );
  }
  void main() {
    float scale = colormapScaler * 4.0;
    vec4 color = texture2D(texture, vo_position);
    vec3 v = min(vec3(1.0), sqrt(color.rgb / scale));
    vec3 cx = texture2D(textureColor, vec2((v.x * (colormapSize - 0.5) + 0.5) / colormapSize, 1.0 / 6.0)).xyz;
    vec3 cy = texture2D(textureColor, vec2((v.y * (colormapSize - 0.5) + 0.5) / colormapSize, 0.5)).xyz;
    vec3 cz = texture2D(textureColor, vec2((v.z * (colormapSize - 0.5) + 0.5) / colormapSize, 5.0 / 6.0)).xyz;
    vec3 xyz = cx + cy + cz;
    gl_FragColor = vec4(xyz2rgb(xyz), 1.0);
  }
  `
)
```

```js echo
{
  if(renderer.timerNextFrame) {
    clearTimeout(renderer.timerNextFrame);
    renderer.timerNextFrame = undefined;
  }
  
  let spectrumScaler = input_spectrum / 40;
  let renderIterations = 256;
  let accumulate = false;
  let exposure = input_exposure / 50;
  let accumulateScaler = 1;
  
  let doRenderNextFrame = (accumulate) => {
    let sampled = importance_sample();
    let samplesCount = sampled.count;
    let cBuffer = sampled.samples;
    gl.disable(gl.DEPTH_TEST);
    // Sample the mandelbrot to get a set of "c" points for buddhabrot.
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderer.framebuffer);
    gl.viewport(0, 0, renderer.renderWidth, renderer.renderHeight);
    gl.clearColor(0, 0, 0, 1);
    if (!accumulate) {
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    // Initialize the feedback buffer to zero
    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.feedbackBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, 12 * samplesCount, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.feedbackBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, 12 * samplesCount, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Determine the number of iterations and coloring of the samples
    gl.useProgram(shader_buddhabrot_escape);

    gl.uniform1f(gl.getUniformLocation(shader_buddhabrot_escape, "u_spectrum_scaler"), spectrumScaler);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.enableVertexAttribArray(gl.getAttribLocation(shader_buddhabrot_escape, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(shader_buddhabrot_escape, "a_position"), 3, gl.FLOAT, false, 12, 0);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, renderer.transformFeedback);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, renderer.feedbackBuffer1);
    gl.bindBuffer(gl.ARRAY_BUFFER, renderer.feedbackBuffer2);
    gl.beginTransformFeedback(gl.POINTS);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.drawArrays(gl.POINTS, 0, samplesCount);
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.endTransformFeedback();
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // Iteratively render using transform feedback
    gl.useProgram(shader_buddhabrot);
    gl.uniform1f(gl.getUniformLocation(shader_buddhabrot, "u_aspect_ratio"), renderer.renderWidth / renderer.renderHeight);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.enableVertexAttribArray(gl.getAttribLocation(shader_buddhabrot, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(shader_buddhabrot, "a_position"), 3, gl.FLOAT, false, 12, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, renderer.transformFeedback);
    for (let i = 0; i < renderIterations; i++) {
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, renderer.feedbackBuffer2);

      gl.bindBuffer(gl.ARRAY_BUFFER, renderer.feedbackBuffer1);
      gl.enableVertexAttribArray(gl.getAttribLocation(shader_buddhabrot, "i_position"));
      gl.vertexAttribPointer(gl.getAttribLocation(shader_buddhabrot, "i_position"), 3, gl.FLOAT, false, 12, 0);

      gl.beginTransformFeedback(gl.POINTS);
      if (i < 4) {
        gl.enable(gl.RASTERIZER_DISCARD);
      }
      gl.drawArrays(gl.POINTS, 0, samplesCount);
      gl.disable(gl.RASTERIZER_DISCARD);
      gl.endTransformFeedback();

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

      let t = renderer.feedbackBuffer1;
      renderer.feedbackBuffer1 = renderer.feedbackBuffer2;
      renderer.feedbackBuffer2 = t;
    }
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // Generate the colored fractal
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.BLEND);

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    gl.useProgram(shader_color);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(gl.getAttribLocation(shader_color, "a_position"));
    gl.vertexAttribPointer(gl.getAttribLocation(shader_color, "a_position"), 2, gl.FLOAT, false, 8, 0);
    gl.uniform1i(gl.getUniformLocation(shader_color, "texture"), 0);
    gl.uniform1i(gl.getUniformLocation(shader_color, "textureColor"), 1);
    gl.uniform1f(gl.getUniformLocation(shader_color, "colormapSize"), colormap.colormapSize);
    gl.uniform1f(gl.getUniformLocation(shader_color, "colormapScaler"), Math.pow(2, -exposure) * (renderIterations - 4) / 6000 * accumulateScaler / sampler.scaler / 1 / 4);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, colormap.textureColor);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, renderer.framebufferTexture);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    accumulateScaler += 1;    
    if(accumulateScaler < 1000) {
      renderer.timerNextFrame = setTimeout(() => {
        doRenderNextFrame(true);
      }, 100);
    }
  }
  
  doRenderNextFrame(false);
}
```

```js
md`### Prepare WebGL 2 Context
We create a WebGL2RenderingContext, and then get two necessary extension: \`OES_texture_float_linear\` and \`EXT_color_buffer_float\`.
`
```

```js
gl = {
  let gl = canvas.getContext("webgl2");
  gl.getExtension("OES_texture_float");
  gl.getExtension("OES_texture_float_linear");
  gl.getExtension("EXT_color_buffer_float");
  return gl;
}
```

```js
md`### Utility Functions`
```

```js
function compileShader(vs_code, fs_code, options) {
  let vs = gl.createShader(gl.VERTEX_SHADER);
  let fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vs, vs_code);
  gl.compileShader(vs);
  let isValid = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
  if (!isValid) {
  console.info("vertex shader error: " + gl.getShaderInfoLog(vs));
  throw new Error("vertex shader compilation failure");
  }
  gl.shaderSource(fs, fs_code);
  gl.compileShader(fs);
  isValid = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
  if (!isValid) {
    console.info("fragment shader error: " + gl.getShaderInfoLog(fs));
    throw new Error("fragment shader compilation failure");
  }
  let p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  if (options) {
    options(p);
  }
  gl.linkProgram(p);
  isValid = gl.getProgramParameter(p, gl.LINK_STATUS);
  if (!isValid) {
    console.info("program link error: " + gl.getProgramInfoLog(p));
    throw new Error("program link failure");
  }
  return p;
}
```

```js
chroma = require("chroma-js")
```

```js
lab2xyz = {
  let LAB_CONSTANTS = {
      Kn: 18,
      Xn: 0.950470,
      Yn: 1,
      Zn: 1.088830,
      t0: 0.137931034,
      t1: 0.206896552,
      t2: 0.12841855,
      t3: 0.008856452
  };

  function lab_xyzf(t) {
      if (t > LAB_CONSTANTS.t1) {
          return t * t * t
      } else {
          return LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0)
      }
  }

  function lab2xyz(l, a, b) {
      let y = (l + 16) / 116;
      let x = y + a / 500;
      let z = y - b / 200;
      y = LAB_CONSTANTS.Yn * lab_xyzf(y);
      x = LAB_CONSTANTS.Xn * lab_xyzf(x);
      z = LAB_CONSTANTS.Zn * lab_xyzf(z);
      return [x, y, z, 1];
  }
  return lab2xyz;
}
```

```js
function random_uniform() {
  let v1, v2, s;
  do {
     v1 = 2 * Math.random() - 1;
     v2 = 2 * Math.random() - 1;
     s = v1 * v1 + v2 * v2;
  } while (s >= 1 || s == 0);
  s = Math.sqrt((-2 * Math.log(s)) / s) / 2;
  return v1 * s;
}
```
