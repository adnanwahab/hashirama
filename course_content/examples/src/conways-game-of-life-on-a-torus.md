```js
md`# Conways game of life on a torus

[wikipedia article](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) \n
I copied (and tried to understand) most of the shaders from [this notebook by @mbostock](https://observablehq.com/@mbostock/conways-game-of-life?collection=@observablehq/webgl)

*Note:* as always, i am not an expert if you find mistakes / have suggestions just let me know. 

*Edit:* Sad to hear about john conways passing, [here](https://www.theguardian.com/science/2015/jul/23/john-horton-conway-the-most-charismatic-mathematician-in-the-world?CMP=share_btn_tw) is a good article about him. `
```

```js
viewof values = inputsGroup([
  [
    slider({
      value: 8,
      min: 1,
      max: 15,
      step: 0.1,
      title: 'inner radius',
      ...sliderConfig
    }),
    slider({
      value: 3.5,
      min: 1,
      max: 10,
      step: 0.1,
      title: 'radius of tube',
      ...sliderConfig
    })
  ]
])
```

```js
viewof replay = html`<button>replay`
```

```js echo
{
  replay;
  const [[innerRadius, radiusTube]] = values;

  const uniforms = {
    u_texture: {
      type: 't',
      value: dataTexture
    },
    u_size: {
      type: 'v2',
      value: new THREE.Vector2(width, height)
    }
  };

  // create two targets to render to (aka render to texture)
  let target1 = new THREE.WebGLRenderTarget(width, height, targetOptions);
  let target2 = new THREE.WebGLRenderTarget(width, height, targetOptions);

  // will render game of life to a plane
  const shaderGeometry = new THREE.PlaneBufferGeometry(20, 20);

  // we need two scenes. One where we render the texture
  // and one where we render the output to screen
  const shaderScene = new THREE.Scene();
  const screenScene = new THREE.Scene();
  screenScene.background = new THREE.Color(0xffffff);
  screenScene.add(plane);
  screenScene.add(spotLight);

  // add camera controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  invalidation.then(() => (controls.dispose(), renderer.dispose()));
  controls.addEventListener("change", () =>
    renderer.render(screenScene, camera)
  );

  // we also want to render the texture with its own camera
  // (not sure if this is strictly necessary)
  const d = 10;
  const shaderCamera = new THREE.OrthographicCamera(-d, d, d, -d, 0, 1);

  // create shader mesh and add to shader scene
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  });
  const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
  shaderScene.add(shaderMesh);

  // create torus
  const torusGeometry = new THREE.TorusBufferGeometry(
    innerRadius,
    radiusTube,
    16,
    50
  );
  torusGeometry.rotateX(Math.PI / 1.2);
  const torusMaterial = new THREE.MeshBasicMaterial();
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.position.y = 3;
  torusMesh.castShadow = true;
  screenScene.add(torusMesh);

  while (true) {
    await Promises.delay(10);

    // render shader to first target and set texture value
    renderer.render(shaderScene, shaderCamera, target1);
    uniforms.u_texture.value = target1.texture;

    // texture from target1 as input to target2
    renderer.render(shaderScene, shaderCamera, target2);
    // output of target2 -> map of torus material
    torusMaterial.map = target2.texture;
    torusMaterial.needsUpdate = true;

    // render to screen
    renderer.render(screenScene, camera);

    // swap targets
    [target1, target2] = [target2, target1];

    yield renderer.domElement;
  }
}
```

```js echo
dataTexture = {
  const texture = new THREE.DataTexture(
    seed,
    width,
    height,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  texture.needsUpdate = true;
  return texture;
}
```

```js echo
fragmentShader = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_size;

void main() {
  vec2 position = gl_FragCoord.xy;
  int current = int(texture2D(u_texture, position / u_size).x);

  int n = -current;
  for (int dx = -1; dx <= 1; ++dx) {
    for (int dy = -1; dy <= 1; ++dy) {
      n += int(texture2D(u_texture, (position + vec2(dx,dy)) / u_size).x);
    }
  }
  
  bool c = current == 1 ? 2 <= n && n <= 3 : n == 3;
  gl_FragColor = vec4(c, c, c, 1.0);
}
`
```

```js
vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
```

```js echo
seed = {
  const data = new Float32Array(4 * width * height);

  for (let i = 0; i < 4 * width * height; i += 4) {
    const v = Math.random() >= 0.5 ? 1 : 0;
    data[i + 0] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 1;
  }

  return data;
}
```

```js echo
renderer = {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    transparent: true
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(width, height);

  if (!renderer.extensions.get('OES_texture_float'))
    throw "oes texture float not supported";
  if (!renderer.extensions.get('OES_texture_half_float'))
    throw "oes texture half float not supported";

  renderer.setPixelRatio(devicePixelRatio);
  return renderer;
}
```

```js echo
spotLight = {
  const light = new THREE.SpotLight(0xffffff);
  light.position.set(0, 20, 15);
  light.castShadow = true;
  light.shadow.mapSize.width = 1028;
  light.shadow.mapSize.height = 1028;
  light.shadow.radius = 5;

  return light;
}
```

```js echo
plane = {
  const geometry = new THREE.PlaneBufferGeometry(200, 200, 10, 10);
  geometry.rotateX(Math.PI / 2);

  const material = new THREE.ShadowMaterial({
    opacity: 0.5,
    color: 0xa3a2a0,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -14;
  mesh.receiveShadow = true;

  return mesh;
}
```

```js echo
camera = {
  const fov = 75;
  const aspect = width / height;
  const near = 0.001;
  const far = 10000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 20);
  return camera;
}
```

```js echo
THREE = {
  const THREE = (window.THREE = await require("three@0.99.0/build/three.min.js"));
  await require("three@0.99.0/examples/js/controls/OrbitControls.js").catch(
    () => {}
  );
  return THREE;
}
```

```js echo
import { slider } from '@bartok32/diy-inputs'
```

```js echo
import { checkbox } from '@jashkenas/inputs'
```

```js echo
import { inputsGroup } from '@bumbeishvili/input-groups'
```

```js echo
height = width / 1.5
```

```js echo
textureDim = 512
```

```js echo
sliderConfig = {
  return {
    theme: 'default-round',
    background: {
      type: 'double',
      colors: ['#7295FF', '#efefef']
    }
  };
}
```

```js echo
targetOptions = {
  return {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat
  };
}
```
