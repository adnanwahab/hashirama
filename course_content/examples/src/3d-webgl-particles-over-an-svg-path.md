```js
md`# 3D WebGL Particles Over an SVG Path`
```

```js
md`As the particles fall, they fill a shape from an attached SVG file.`
```

```js
viewof replay = Inputs.button("Restart Surface Accumulation")
```

```js
canvas = {
  const canvas = DOM.canvas();
  const gl = canvas.gl = canvas.getContext('webgl',{
  premultipliedAlpha: false , // Ask for non-premultiplied alpha
  alpha:false
});
  const ext = gl.getExtension('OES_element_index_uint');
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
 // gl.enable(gl.CULL_FACE);
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const scale = window.devicePixelRatio || 1;
  canvas.style.width = width+"px";
  canvas.style.height = height+"px";
  canvas.width = width*scale;
  canvas.height = height*scale;
  return canvas;
}
```

```js
viewof cameraZ = Inputs.range([-500,500], {step: 1, value:-80, label:"z position"});
```

```js
viewof cameraAngleRadians = Inputs.range([-Math.PI*2, Math.PI*2], {step: .001, value:degToRad(190), label:"y rotation"});
```

```js
viewof cameraAngleRadiansX = Inputs.range([-Math.PI*2, Math.PI*2], {step: .001, value:degToRad(28.5), label:"x rotation"});
```

```js
viewof fieldOfViewRadians = Inputs.range([-Math.PI*2, Math.PI*2], {step: .1, value:degToRad(60), label:"field of view"});
```

```js
md`This notebook renders particles in 3D with initial positions generated over a path defined in an SVG file. The particle positions are calculated on the CPU but rendering happens on the GPU using WebGL. Initial inspiration came from a 2D [JavaScript particle simulation](https://github.com/VincentGarreau/particles.js/) that uses canvas. As with anything WebGL I have created, I owe a lot to the articles on WebGLFundamentals, specifically an article on [image processing and framebuffers](https://webglfundamentals.org/webgl/lessons/webgl-image-processing-continued.html) for this project. The particles in this notebook are rendered using a [billboard technique](http://www.opengl-tutorial.org/intermediate-tutorials/billboards-particles/billboards/) where a plane is rotated to always be facing the camera. The billboard texture is a Signed Distance Field created using the [TinySDF library](https://github.com/mapbox/tiny-sdf). Inspiration for the rendering style of the points as they intersect the surface came from this [cool visualization](https://github.com/fogleman/density) of taxi pickups in New York by Michael Fogleman.`
```

```js
md`## Code Cells`
```

```js echo
f = await FileAttachment("SnowFlake04.svg")
```

```js echo
svgImage = {
  const text = await f.text();
  const document = (new DOMParser).parseFromString(text, "image/svg+xml");
  
  const svg = d3.select(document.documentElement).remove();
  const viewBox = svg.node().getAttribute("viewBox").split(" ");
  const svgWidth = viewBox[2];
  const svgHeight = viewBox[3];
  const path = svg.selectAll("path");
  const pathNode = path.node();
 
  const d = pathNode.getAttribute('d');
 
  const svgOut = d3.create("svg").attr("width", svgWidth).attr("height", svgHeight);
  svgOut.selectAll("path").data(path).enter().append("path")
   .attr("d", d=>{
    return d.getAttribute('d');
  })
  
  return svgOut.node();
}
```

```js echo
numElements = 1000
```

```js
imageWidth = svgImage.clientWidth;
```

```js
imageHeight = svgImage.clientHeight
```

```js
colorBar = {
  const ctx = DOM.context2d(256, 10);
  ctx.canvas.width = 256;
  ctx.canvas.height = 10;
  
  
  // Create gradient
  var grd = ctx.createLinearGradient(0, 0, 256, 0);
  grd.addColorStop(0, "rgba(0,106,255,255)");
  grd.addColorStop(0.66, "rgba(124,178,255,255)");
  grd.addColorStop(1, "white");

  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 256, 10);
  return ctx.canvas;
}
```

```js echo
ctx = {
  const ctx = DOM.context2d(imageWidth, imageHeight);
  ctx.canvas.width = imageWidth;
  ctx.canvas.height = imageHeight;
  const text = await f.text();
  const document = (new DOMParser).parseFromString(text, "image/svg+xml");
  const svg = d3.select(document.documentElement).remove();
  
  const path = d3.select(svgImage).selectAll("path");
  
  path.each(d=>{
    const pathData = new Path2D(d.getAttribute('d'));
    ctx.fill(pathData);
  })
  //fill SVG path on canvas 
  
  
  const data = ctx.getImageData(0,0,imageWidth,imageHeight).data;
  
  let coords = [];
  //get all pixels with non-zero opacity
  for (let i=0; i<data.length; i+=4) {
    if (data[i+3] > 0) {
      let y = Math.floor(i/(imageWidth*4));
      let x = (i%(imageWidth*4))/4;
      coords.push({
        x,
        y})
    }
  }
  
  return coords;
}
```

```js
TinySDF = {
  function TinySDF(size, buffer, value, radius, cutoff) {
    this.fontSize = size;
    this.buffer = buffer === undefined ? 3 : buffer;
    this.cutoff = cutoff || 0.25;
    this.radius = radius || 20;
    var size = this.size = this.fontSize + this.buffer * 2;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = size;
    this.circleWidth = this.canvas.width-10;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'black';
     // temporary arrays for the distance transform
    this.gridOuter = new Float64Array(size * size);
    this.gridInner = new Float64Array(size * size);
    this.f = new Float64Array(size);
    this.z = new Float64Array(size + 1);
    this.v = new Uint16Array(size);

    // hack around https://bugzilla.mozilla.org/show_bug.cgi?id=737852
    this.middle = Math.round((size / 2) * (navigator.userAgent.indexOf('Gecko/') >= 0 ? 1.2 : 1));
  }
  
    TinySDF.prototype.draw = function (char) {
    this.ctx.arc(this.circleWidth/2, this.circleWidth/2, this.circleWidth/8, 0, 2 * Math.PI);
    this.ctx.fill();
    var imgData = this.ctx.getImageData(0, 0, this.size, this.size);
     
    var alphaChannel = new Uint8ClampedArray(this.size * this.size);

    for (var i = 0; i < this.size * this.size; i++) {
        var a = imgData.data[i * 4 + 3] / 255; // alpha value
        this.gridOuter[i] = a === 1 ? 0 : a === 0 ? INF : Math.pow(Math.max(0, 0.5 - a), 2);
        this.gridInner[i] = a === 1 ? INF : a === 0 ? 0 : Math.pow(Math.max(0, a - 0.5), 2);
    }

    this.edt(this.gridOuter, this.size, this.size, this.f, this.v, this.z);
    this.edt(this.gridInner, this.size, this.size, this.f, this.v, this.z);

    for (i = 0; i < this.size * this.size; i++) {
        var d = Math.sqrt(this.gridOuter[i]) - Math.sqrt(this.gridInner[i]);
        alphaChannel[i] = Math.round(255 - 255 * (d / this.radius + this.cutoff));
    }

    this.alphaChannel = alphaChannel;
    return alphaChannel;
   }
  
  TinySDF.prototype.edt = function (data, width, height, f, v, z) {
    for (var x = 0; x < width; x++) this.edt1d(data, x, width, height, f, v, z);
    for (var y = 0; y < height; y++) this.edt1d(data, y * width, 1, width, f, v, z);
  }
  
  TinySDF.prototype.edt1d = function (grid, offset, stride, length, f, v, z) {
    var q, k, s, r;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;

    for (q = 0; q < length; q++) f[q] = grid[offset + q * stride];

    for (q = 1, k = 0, s = 0; q < length; q++) {
        do {
            r = v[k];
            s = (f[q] - f[r] + q * q - r * r) / (q - r) / 2;
        } while (s <= z[k] && --k > -1);

        k++;
        v[k] = q;
        z[k] = s;
        z[k + 1] = INF;
    }

    for (q = 0, k = 0; q < length; q++) {
        while (z[k + 1] < q) k++;
        r = v[k];
        grid[offset + q * stride] = f[r] + (q - r) * (q - r);
    }
  }
  
  return TinySDF;
}
```

```js
exampleSDF = new TinySDF(64,0)
```

```js echo
particleCanvas = {
  const alpha = exampleSDF.draw();
  const ctx = DOM.context2d(exampleSDF.size, exampleSDF.size);
  ctx.canvas.height = exampleSDF.size;
  ctx.canvas.width = exampleSDF.size;
  const u = new Uint8ClampedArray(exampleSDF.size*exampleSDF.size*4);
  for (let i=0; i<alpha.length; i++) {
    u[4*i+3] = alpha[i];
  }
  const imageData = new ImageData(u,exampleSDF.size,exampleSDF.size);
  ctx.putImageData(imageData,0,0)
  return ctx.canvas;
}
```

```js
INF = 1e16
```

```js
function degToRad(d) {
  return d*Math.PI/180
}
```

```js echo
Grid = {
  function Grid() {
    this.width = imageWidth;
    this.height = imageHeight;
    this.values = new Uint8ClampedArray(this.width*this.height*4);
    this.spaceWidth = this.width/10;
    this.spaceHeight = this.height/10;
  }
  
  Grid.prototype.reset = function() {
    this.values = new Uint8ClampedArray(this.width*this.height*4);
    const num = this.width*this.height;
    for (let i=0; i<num; i++) {
      this.values[i*4+3] = 255;
    }
  }
  
  Grid.prototype.add = function(x, y) {
    if (x > this.spaceWidth || x < 0 || y > this.spaceHeight || y < 0) {
      return;
    }
    const fracX = Math.floor(x/this.spaceWidth * this.width);
    const fracY = Math.floor(y/this.spaceHeight * this.height);
    
    const idx = fracY*this.width + fracX;
    
    this.values[idx*4]=Math.min(255,this.values[idx*4]+255);
    this.values[idx*4+1]=Math.min(255,this.values[idx*4+1]+255);
    this.values[idx*4+2]=Math.min(255,this.values[idx*4+2]+255);
    
  }
  
  return Grid
}
```

```js echo
hitGrid = {
  return new Grid();
}
```

```js echo
Point = {
  function Point() {
    //x,y,z positions
    this.y = 30;
    const randomPoint = ctx[Math.floor(Math.random()*ctx.length)];
    this.x = randomPoint.x/10;
    this.z = randomPoint.y/10;

    //x,y,z velocities
    this.vy = Math.random()*-0.15 - 0.05;
    this.vx = (Math.random() - 0.5)/150;
    this.vz = (Math.random() - 0.5)/150;
  }
  
  Point.prototype.propagate = function(delta) {
    this.y = this.y + delta*this.vy*100;
    this.x = this.x + delta*this.vx*100;
    this.z = this.z + delta*this.vz*100;
  }
  
  Point.prototype.resetY = function() {
    //point has intersected surface
    if (this.y < -1) {
      hitGrid.add(this.x, this.z);

      this.y = 30;
      const randomPoint = ctx[Math.floor(Math.random()*ctx.length)];
      this.x = randomPoint.x/10;
      this.z = randomPoint.y/10;
    }
  }
  
  return Point;
  
}
```

```js echo
points = {
  //store data about points and their locations
  let points = [];
  //location of particle center
  const tData = new Float32Array(numElements*18);
  //texture quad coordinates for billboards relative to particle center
  const vData = new Float32Array(numElements*18);
  
  for (let i=0; i<numElements; i++) {
    const point = new Point();
    points.push(point);
    
    //translation of particle
    tData[i*18+0] = point.x;
    tData[i*18+1] = point.y;
    tData[i*18+2] = point.z;
    
    tData[i*18+3] = point.x;
    tData[i*18+4] = point.y;
    tData[i*18+5] = point.z;
    
    tData[i*18+6] = point.x;
    tData[i*18+7] = point.y;
    tData[i*18+8] = point.z;
    
    tData[i*18+9] = point.x;
    tData[i*18+10] = point.y;
    tData[i*18+11] = point.z;
    
    tData[i*18+12] = point.x;
    tData[i*18+13] = point.y;
    tData[i*18+14] = point.z;
    
    tData[i*18+15] = point.x;
    tData[i*18+16] = point.y;
    tData[i*18+17] = point.z;
    
    //billboard quad
    vData[i*18+0] = -0.5;
    vData[i*18+1] = -0.5;
    vData[i*18+2] = 0;
    
    vData[i*18+3] = 0.5;
    vData[i*18+4] = -0.5;
    vData[i*18+5] = 0;
    
    vData[i*18+6] = -0.5;
    vData[i*18+7] = 0.5;
    vData[i*18+8] = 0;
    
    vData[i*18+9] = -0.5;
    vData[i*18+10] = 0.5;
    vData[i*18+11] = 0;
    
    vData[i*18+12] = 0.5;
    vData[i*18+13] = -0.5;
    vData[i*18+14] = 0;
    
    vData[i*18+15] = 0.5;
    vData[i*18+16] = 0.5;
    vData[i*18+17] = 0;
   
  }
  
  return {
    points: points,
    tData: tData,
    vData: vData
  }
  
}
```

```js echo
rendering = {
  
  let frame;
  let then;
  (function idraw(now) {
    now *= 0.001;
    let deltaTime;
    if (then) {
      deltaTime = now-then;
    } else {
      deltaTime = 0;
    }
    then = now;
    
    //update billboard center points (6 * 3)
    for (let i=0; i<numElements; i++) {
      points.points[i].propagate(deltaTime);
      points.tData[i*18+1] = points.points[i].y;
      points.tData[i*18+4] = points.points[i].y;
      points.tData[i*18+7] = points.points[i].y;
      points.tData[i*18] = points.points[i].x;
      points.tData[i*18+3] = points.points[i].x;
      points.tData[i*18+6] = points.points[i].x;
      points.tData[i*18+2] = points.points[i].z;
      points.tData[i*18+5] = points.points[i].z;
      points.tData[i*18+8] = points.points[i].z;
      points.tData[i*18+9] = points.points[i].x;
      points.tData[i*18+10] = points.points[i].y;
      points.tData[i*18+11] = points.points[i].z;
     
      points.tData[i*18+12] = points.points[i].x;
      points.tData[i*18+13] = points.points[i].y;
      points.tData[i*18+14] = points.points[i].z;
     
      points.tData[i*18+15] = points.points[i].x;
      points.tData[i*18+16] = points.points[i].y;
      points.tData[i*18+17] = points.points[i].z;
    }
    
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 3;          // 3 components per iteration
    let type = canvas.gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer

    //define viewport size
    canvas.gl.viewport(0, 0, canvas.width, canvas.height);

    canvas.gl.clearColor(0.15, 0.15, 0.15, 1);
   
    canvas.gl.clear(canvas.gl.COLOR_BUFFER_BIT | canvas.gl.DEPTH_BUFFER_BIT);

    // Compute the matrix
    const aspect = canvas.width / canvas.height;
    const zNear = 1;
    const zFar = 2000;
    const matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute a matrix for the camera
    let cameraMatrix = twgl.m4.rotateY(twgl.m4.identity(), cameraAngleRadians);
    cameraMatrix = twgl.m4.rotateX(cameraMatrix, cameraAngleRadiansX);
    cameraMatrix = twgl.m4.translate(cameraMatrix, [0,0,cameraZ]);
    
    // Get the camera's position from the matrix we computed
    const cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    const up = [0, 1, 0];
 
    // Compute the camera's matrix using look at.
    cameraMatrix = twgl.m4.lookAt(cameraPosition, [imageWidth/20,0,imageHeight/20], up);
 

    // Make a view matrix from the camera matrix
    const viewMatrix = twgl.m4.inverse(cameraMatrix);
    
    //vectors for billboard shader
    const cameraRight = [viewMatrix[0], viewMatrix[4], viewMatrix[8]];
    const cameraUp = [viewMatrix[1], viewMatrix[5], viewMatrix[9]];

    // Compute a view projection matrix
    const viewProjectionMatrix = twgl.m4.multiply(matrix, viewMatrix);

    const internalFormat = canvas.gl.RGBA;
    const border = 0;
    const format = canvas.gl.RGBA;
    type = canvas.gl.UNSIGNED_BYTE;
    
    canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, tallyTextures.particleTexture);
    canvas.gl.texImage2D(canvas.gl.TEXTURE_2D, 0, internalFormat,
                imageWidth, imageHeight, border,
               format, type, hitGrid.values);
    
    //first pass of gaussian smoother rendered to framebuffer
    smooth(viewProjectionMatrix);
    
    //disable rendering to framebuffer
    canvas.gl.bindFramebuffer(canvas.gl.FRAMEBUFFER, null);
    
    //draw planes, one black slightly below the color
    drawPlane(viewProjectionMatrix, tallyTextures.combinedTexture, planeVertices2);
    drawPlane(viewProjectionMatrix, tallyTextures.existingTexture, planeVertices);

    //draw particle billboards
    canvas.gl.useProgram(program);
    type = canvas.gl.FLOAT;
    
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffers.trans);
    canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, points.tData, canvas.gl.STATIC_DRAW);
    canvas.gl.enableVertexAttribArray(locations.trans);
    canvas.gl.vertexAttribPointer(locations.trans, 3, type, normalize, stride, offset);
    
    canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffers.square);
    canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, points.vData, canvas.gl.STATIC_DRAW);
    canvas.gl.enableVertexAttribArray(locations.square);
    canvas.gl.vertexAttribPointer(locations.square, 3, type, normalize, stride, offset);

    // Set the matrix.
    canvas.gl.uniformMatrix4fv(locations.matrix, false, viewProjectionMatrix);
    canvas.gl.uniform3f(locations.right, cameraRight[0], cameraRight[1], cameraRight[2]);
    canvas.gl.uniform3f(locations.up, cameraUp[0], cameraUp[1], cameraUp[2]);
    
    canvas.gl.activeTexture(canvas.gl.TEXTURE0);
    canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, tallyTextures.circleTexture);
    canvas.gl.uniform1i(locations.circle, 0);

    var primitiveType = canvas.gl.TRIANGLES;
        offset = 0;
        var count = 6;
        canvas.gl.drawArrays(primitiveType, offset, numElements*count);
    
     
     for (let i=0; i<numElements; i++) {
      points.points[i].resetY();
     }
    
    //request another frame
    frame=requestAnimationFrame(idraw);
    
})()
  invalidation.then(() => cancelAnimationFrame(frame));
}
```

```js echo
tallyTextures = {
  //all textures the programs will need
  const existingTexture = canvas.gl.createTexture();
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, existingTexture);

  const level = 0;
  let internalFormat = canvas.gl.RGBA;
  const width = imageWidth;
  const height = imageHeight;
  const border = 0;
  let format = canvas.gl.RGBA;
  let type = canvas.gl.UNSIGNED_BYTE;
  const zeros = new Uint8Array(4*imageWidth*imageHeight);
 
  canvas.gl.texImage2D(canvas.gl.TEXTURE_2D, level, internalFormat, imageWidth, imageHeight, border,
                format, type, zeros);
  
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MIN_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MAG_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_S, canvas.gl.CLAMP_TO_EDGE);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_T, canvas.gl.CLAMP_TO_EDGE);
  
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, null);
  
  const particleTexture = canvas.gl.createTexture();
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, particleTexture);
 
  internalFormat = canvas.gl.RGBA;
  format = canvas.gl.RGBA;
  type = canvas.gl.UNSIGNED_BYTE;
  canvas.gl.texImage2D(canvas.gl.TEXTURE_2D, level, internalFormat,
                imageWidth, imageHeight, border,
                format, type, zeros);
 
  // set the filtering so we don't need mips
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MIN_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MAG_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_S, canvas.gl.CLAMP_TO_EDGE);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_T, canvas.gl.CLAMP_TO_EDGE);
  
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, null);
  
  //black plane
  const combinedTexture = canvas.gl.createTexture();
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, combinedTexture);
  canvas.gl.texImage2D(canvas.gl.TEXTURE_2D, level, internalFormat,
                imageWidth, imageHeight, border,
                format, type, zeros);
 
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MIN_FILTER, canvas.gl.NEAREST);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MAG_FILTER, canvas.gl.NEAREST);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_S, canvas.gl.CLAMP_TO_EDGE);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_T, canvas.gl.CLAMP_TO_EDGE);
  
  //colors for plane image
  const colorbarTexture = canvas.gl.createTexture();
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, colorbarTexture);
  canvas.gl.texImage2D(canvas.gl.TEXTURE_2D, 0, canvas.gl.RGBA, canvas.gl.RGBA, canvas.gl.UNSIGNED_BYTE, colorBar);
  
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MIN_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MAG_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_S, canvas.gl.CLAMP_TO_EDGE);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_T, canvas.gl.CLAMP_TO_EDGE);
  
  //texture for particle billboards
  const circleTexture = canvas.gl.createTexture();
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, circleTexture);
  canvas.gl.texImage2D(canvas.gl.TEXTURE_2D, 0, canvas.gl.RGBA, canvas.gl.RGBA, canvas.gl.UNSIGNED_BYTE, particleCanvas);
  
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MIN_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_MAG_FILTER, canvas.gl.LINEAR);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_S, canvas.gl.CLAMP_TO_EDGE);
  canvas.gl.texParameteri(canvas.gl.TEXTURE_2D, canvas.gl.TEXTURE_WRAP_T, canvas.gl.CLAMP_TO_EDGE);
  
  return {
    existingTexture,
    particleTexture,
    combinedTexture,
    colorbarTexture,
    circleTexture
  }
  
}
```

```js echo
function smooth(viewProjectionMatrix) {
  
  canvas.gl.useProgram(programSmooth);
  
  //rendering to framebuffer
  canvas.gl.bindFramebuffer(canvas.gl.FRAMEBUFFER, frameBuffers.fb1);
  
  // attach the texture as the first color attachment
  const attachmentPoint = canvas.gl.COLOR_ATTACHMENT0;
  canvas.gl.framebufferTexture2D(
      canvas.gl.FRAMEBUFFER, attachmentPoint, canvas.gl.TEXTURE_2D, tallyTextures.existingTexture, 0);
  
  // Tell WebGL how to convert from clip space to pixels
  canvas.gl.viewport(0, 0, imageWidth, imageHeight);
  
  let type = canvas.gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0; 
  canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffers.planePosition);
  
  const vertices = new Float32Array([
     -1, -1,
     -1, 1,
     1, -1,
     1, -1,
     -1, 1,
     1, 1,
  ]);
  canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, vertices, canvas.gl.STATIC_DRAW);
  
  //rendering over entire clipspace
  canvas.gl.enableVertexAttribArray(locations.smoothPlanePosLocation);
  canvas.gl.vertexAttribPointer(locations.smoothPlanePosLocation, 2, type, normalize, stride, offset);
  
 //handle texture for plane
  canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffers.texCoord);
  canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0,1,
      1, 1,
    ]), canvas.gl.STATIC_DRAW);
  
  //rendering entire texture corresponding to entire cipspace
  canvas.gl.enableVertexAttribArray(locations.smoothTexCoordLocation);
  canvas.gl.vertexAttribPointer(locations.smoothTexCoordLocation, 2, type, normalize, stride, offset);
 
  //active texture is hitgrid to start
  canvas.gl.activeTexture(canvas.gl.TEXTURE3);
  
  const internalFormat = canvas.gl.RGBA;
  const border = 0;
  const format = canvas.gl.RGBA;
  type = canvas.gl.UNSIGNED_BYTE;
  
  //need to attach hitGrid.values to particle texture
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, tallyTextures.particleTexture);
  canvas.gl.uniform1i(locations.smoothPlaneUniformLocation, 3);
  
  // set the kernel and its weight
  canvas.gl.uniform1fv(locations.smoothKernelUniformLocation, gaussianBlur);
  canvas.gl.uniform1f(locations.smoothKernelWeightUniformLocation, weight);
  // set the size of the image
  canvas.gl.uniform2f(locations.smoothTextureSizeUniformLocation, imageWidth, imageHeight);
  
  var primitiveType = canvas.gl.TRIANGLES;
      offset = 0;
      var count = 3;
      canvas.gl.drawArrays(primitiveType, offset, 2*count);
  
}
```

```js echo
planeVertices = {
  const data = new Float32Array([
    0, -1, 0, 
    0, -1, hitGrid.spaceHeight,
    hitGrid.spaceWidth, -1, 0,
    hitGrid.spaceWidth, -1, 0,
    0, -1, hitGrid.spaceHeight,
    hitGrid.spaceWidth, -1, hitGrid.spaceHeight,
    ])
  return data;
}
```

```js echo
planeVertices2 = {
  const data = new Float32Array([
    0, -1.01, 0, 
    0, -1.01, hitGrid.spaceHeight,
    hitGrid.spaceWidth, -1.01, 0,
    hitGrid.spaceWidth, -1.01, 0,
    0, -1.01, hitGrid.spaceHeight,
    hitGrid.spaceWidth, -1.01, hitGrid.spaceHeight,
    
    ])
  return data;
}
```

```js echo
function drawPlane(viewProjectionMatrix, texture, vertices) {
  canvas.gl.useProgram(programPlane);
  canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffers.planePosition);
  canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, vertices, canvas.gl.STATIC_DRAW);
  canvas.gl.enableVertexAttribArray(locations.posPlane);
  
  let type = canvas.gl.FLOAT;   // the data is 32bit floats
  const normalize = false; // don't normalize the data
  const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0;    
  
  canvas.gl.vertexAttribPointer(locations.posPlane, 3, type, normalize, stride, offset);

  // Set the matrix.
  canvas.gl.uniformMatrix4fv(locations.matrixPlane, false, viewProjectionMatrix);
  
 //handle texture for plane
  canvas.gl.bindBuffer(canvas.gl.ARRAY_BUFFER, buffers.texCoord);
  canvas.gl.bufferData(canvas.gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0,1,
      1, 1,
    ]), canvas.gl.STATIC_DRAW);

  canvas.gl.enableVertexAttribArray(locations.texCoord);
  canvas.gl.vertexAttribPointer(locations.texCoord, 2, type, normalize, stride, offset);
 
  canvas.gl.activeTexture(canvas.gl.TEXTURE3);
  
  const internalFormat = canvas.gl.RGBA;
  const border = 0;
  const format = canvas.gl.RGBA;
  type = canvas.gl.UNSIGNED_BYTE;

  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, texture);
  
  canvas.gl.uniform1i(locations.planeUniformLocation, 3);
  
  canvas.gl.activeTexture(canvas.gl.TEXTURE4);
  canvas.gl.bindTexture(canvas.gl.TEXTURE_2D, tallyTextures.colorbarTexture);
  canvas.gl.uniform1i(locations.colorbarUniformLocation, 4);
  
  // set the kernel and its weight
  canvas.gl.uniform1fv(locations.kernelUniformLocation, gaussianBlur);
  canvas.gl.uniform1f(locations.kernelWeightUniformLocation, weight);
  // set the size of the image
  canvas.gl.uniform2f(locations.textureSizeUniformLocation, imageWidth, imageHeight);
  
  //define viewport size
  canvas.gl.viewport(0, 0, canvas.width, canvas.height);
  
  var primitiveType = canvas.gl.TRIANGLES;
      offset = 0;
      var count = 3;
      canvas.gl.drawArrays(primitiveType, offset, 2*count);
}
```

```js echo
gaussianBlur=  [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045
    ]
```

```js echo
function computeKernelWeight(kernel) {
    var weight = kernel.reduce(function(prev, curr) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
  }
```

```js echo
weight = computeKernelWeight(gaussianBlur)
```

```js echo
locations = {
  //need to get attribute locations
  const translate = canvas.gl.getAttribLocation(program, "a_trans");
  const matrixLocation = canvas.gl.getUniformLocation(program, "u_matrix");
  const planeMatrixLocation = canvas.gl.getUniformLocation(programPlane, "u_matrix");
  const planePosLocation = canvas.gl.getAttribLocation(programPlane, "a_pos");
  const texCoordLocation = canvas.gl.getAttribLocation(programPlane, "a_texcoord");
  const planeUniformLocation = canvas.gl.getUniformLocation(programPlane, "u_texture");
  const colorbarUniformLocation = canvas.gl.getUniformLocation(programPlane, "u_colorbar");
  const textureSizeUniformLocation = canvas.gl.getUniformLocation(programPlane, "u_textureSize");
  const kernelUniformLocation = canvas.gl.getUniformLocation(programPlane, "u_kernel");
  const kernelWeightUniformLocation = canvas.gl.getUniformLocation(programPlane, "u_kernelWeight");
  const smoothPlanePosLocation = canvas.gl.getAttribLocation(programSmooth, "a_pos");
  const smoothTexCoordLocation = canvas.gl.getAttribLocation(programSmooth, "a_texcoord");
  const smoothPlaneUniformLocation = canvas.gl.getUniformLocation(programSmooth, "u_texture");
  const smoothTextureSizeUniformLocation = canvas.gl.getUniformLocation(programSmooth, "u_textureSize");
  const smoothKernelUniformLocation = canvas.gl.getUniformLocation(programSmooth, "u_kernel");
  const smoothKernelWeightUniformLocation = canvas.gl.getUniformLocation(programSmooth, "u_kernelWeight");
  const squareLocation = canvas.gl.getAttribLocation(program, "a_square");
  const rightLocation = canvas.gl.getUniformLocation(program, "u_right");
  const upLocation = canvas.gl.getUniformLocation(program, "u_up");
  const circleUniformLocation = canvas.gl.getUniformLocation(program, "u_texture");
  
  return {
    matrix: matrixLocation,
    trans: translate,
    matrixPlane: planeMatrixLocation,
    posPlane: planePosLocation,
    texCoord: texCoordLocation,
    planeUniformLocation,
    colorbarUniformLocation,
    textureSizeUniformLocation,
    kernelUniformLocation,
    kernelWeightUniformLocation,
    smoothPlanePosLocation,
    smoothTexCoordLocation,
    smoothPlaneUniformLocation,
    smoothTextureSizeUniformLocation,
    smoothKernelUniformLocation,
    smoothKernelWeightUniformLocation,
    square:squareLocation,
    right:rightLocation,
    up:upLocation,
    circle:circleUniformLocation
  }
}
```

```js echo
vsSource = `
attribute vec3 a_trans;
attribute vec3 a_square;

uniform mat4 u_matrix;
uniform vec3 u_right;
uniform vec3 u_up;

varying vec2 v_texcoord;

void main() {
  vec3 vertexPosition_worldspace = a_trans+ u_right * a_square.x * 0.9+ u_up * a_square.y * 0.9;

  gl_Position = u_matrix * vec4(vertexPosition_worldspace, 1.0);

  v_texcoord = a_square.xy + vec2(0.5,0.5);
}
`
```

```js echo
fsSource = `
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;

void main() {
 
  vec4 u_color = vec4(0.0,106./255.,1.0,1.0);
  vec4 baseColor = u_color;
  float dist = texture2D(u_texture, v_texcoord).a;

  float oFactor = smoothstep(0.3, 1.0, dist);
  baseColor = mix(u_color, vec4(1.0,1.0,1.0,1.0), oFactor);
  baseColor.a *= smoothstep(0.0, 0.8, dist);
  gl_FragColor = baseColor;

  if(gl_FragColor.a < 0.5)
    discard;
}
`
```

```js echo
vsSourcePlane = `
attribute vec3 a_pos;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  gl_Position = u_matrix*vec4(a_pos, 1.0);

  v_texcoord = a_texcoord;
}
`
```

```js
fsSourcePlane = `
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform sampler2D u_colorbar;

uniform vec2 u_textureSize;
uniform float u_kernel[9];
uniform float u_kernelWeight;

void main() {
   vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
  
  float colorSum =
       texture2D(u_texture, v_texcoord + onePixel * vec2(-1, -1)).x * u_kernel[0] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 0, -1)).x * u_kernel[1] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 1, -1)).x * u_kernel[2] +
       texture2D(u_texture, v_texcoord + onePixel * vec2(-1,  0)).x * u_kernel[3] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 0,  0)).x * u_kernel[4] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 1,  0)).x * u_kernel[5] +
       texture2D(u_texture, v_texcoord + onePixel * vec2(-1,  1)).x * u_kernel[6] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 0,  1)).x * u_kernel[7] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 1,  1)).x * u_kernel[8] ;

if (colorSum == 0.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } 
  else {
      gl_FragColor = vec4(texture2D(u_colorbar, vec2(colorSum/u_kernelWeight,0.0)).xyz, pow(colorSum/u_kernelWeight,0.25)*1.0);
  }
}
`
```

```js
vsSourceSmooth=`
attribute vec3 a_pos;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

void main() {
  gl_Position = vec4(a_pos, 1.0);
  v_texcoord = a_texcoord;
}
`
```

```js
fsSourceSmooth=`
precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform sampler2D u_colorbar;

uniform vec2 u_textureSize;
uniform float u_kernel[9];
uniform float u_kernelWeight;

void main() {
   vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
  
  float colorSum =
       texture2D(u_texture, v_texcoord + onePixel * vec2(-1, -1)).x * u_kernel[0] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 0, -1)).x * u_kernel[1] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 1, -1)).x * u_kernel[2] +
       texture2D(u_texture, v_texcoord + onePixel * vec2(-1,  0)).x * u_kernel[3] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 0,  0)).x * u_kernel[4] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 1,  0)).x * u_kernel[5] +
       texture2D(u_texture, v_texcoord + onePixel * vec2(-1,  1)).x * u_kernel[6] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 0,  1)).x * u_kernel[7] +
       texture2D(u_texture, v_texcoord + onePixel * vec2( 1,  1)).x * u_kernel[8] ;
 
  if (colorSum == 0.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } 
  else {
      gl_FragColor = vec4(min(1.0,colorSum/u_kernelWeight), 0.0, 0.0, 1.0);
  }
}
`
```

```js echo
program = initShaderProgram(canvas.gl, vsSource, fsSource)
```

```js echo
programPlane = initShaderProgram(canvas.gl, vsSourcePlane, fsSourcePlane)
```

```js echo
programSmooth = initShaderProgram(canvas.gl, vsSourceSmooth, fsSourceSmooth);
```

```js echo
//compiles program
function initShaderProgram(gl, vsSource, fsSource) {
  //compile shaders
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  const success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  if (!success) {
    
    throw new Error(`Couldn't link shader`);
    gl.deleteProgram(shaderProgram);
  }
  
  return shaderProgram;
}
```

```js echo
//compiles shaders
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error(`Couldn't compile shader`);
  }
  return shader;
}
```

```js echo
frameBuffers = {
  const fb1 = canvas.gl.createFramebuffer();
  
  return {
    fb1
  }
}
```

```js echo
buffers = {
  //creating buffers for programs
  const transBuffer = canvas.gl.createBuffer();
  const planePositionBuffer = canvas.gl.createBuffer();
  const texCoordBuffer = canvas.gl.createBuffer();
  const square = canvas.gl.createBuffer();
  
  return {
    trans:transBuffer,
    planePosition: planePositionBuffer,
    texCoord: texCoordBuffer,
    square:square
  }
}
```

```js echo
width = Math.min(600, window.innerWidth);
```

```js echo
height = width
```

```js
{
  replay;
  hitGrid.reset();
}
```

```js
m4 = {
  return {

  perspective: function(fieldOfViewInRadians, aspect, near, far) {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ];
  },

  projection: function(width, height, depth) {
    // Note: This matrix flips the Y axis so 0 is at the top.
    return [
       2 / width, 0, 0, 0,
       0, -2 / height, 0, 0,
       0, 0, 2 / depth, 0,
      -1, 1, 0, 1,
    ];
  },

  multiply: function(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function(tx, ty, tz) {
    return [
       1,  0,  0,  0,
       0,  1,  0,  0,
       0,  0,  1,  0,
       tx, ty, tz, 1,
    ];
  },

  xRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function(angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1,
    ];
  },

  scaling: function(sx, sy, sz) {
    return [
      sx, 0,  0,  0,
      0, sy,  0,  0,
      0,  0, sz,  0,
      0,  0,  0,  1,
    ];
  },

 
  }
};
```

```js
d3 = require('d3@6')
```

```js
twgl = require('twgl.js')
```
