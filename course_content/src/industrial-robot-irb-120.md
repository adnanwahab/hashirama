# ABB's Industrial Robot IRB 120


```html
<i><p>
  This Observable notebook demonstrates the control of a 3D model of the industrial robot IRB 120 . For those interested in CAD model integration using the JavaScript library <b>Three.js</b>, be sure to <a href="https://observablehq.com/@christophe-yamahata/embedding-3d-models-using-three-js?collection=@christophe-yamahata/3d-three-js">check out this other notebook</a>. Here, we take it a step further by offering full control of the robot's 6 axes via a web interface.
</p>
<p>
  Additionally, a <a href="#framework">Framework version</a> of this notebook
is available.
</p></i>
```

```js
{
    // See also: https://observablehq.com/@mbostock/fullscreen-canvas
      return htl.html`<button onclick=${({currentTarget}) => {
      const currentCell = currentTarget.parentElement;
      const zoomCell = currentCell.nextElementSibling;
      zoomCell.requestFullscreen ? zoomCell.requestFullscreen()
        : zoomCell.webkitRequestFullscreen ? zoomCell.webkitRequestFullscreen()
        : (() => { throw new Error("Fullscreen API not supported"); });
    }}>Full screen</button>`
}
```

```js
container = html`
  <div style="background-color:#fff; border: 1px solid #ccc; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; padding:15px; user-select: none;">
 
    <div style="display: flex; flex: 1; box-sizing: border-box;">
      <div style="flex: 1; box-sizing: border-box;">
        ${renderer.domElement}
      </div>
      <div style="margin-left: 40px; margin-right: 50px; display: flex; flex-direction: column; align-items: flex-start;">
        <div style="flex-grow: 1; margin-top: auto;">
          <br/>${viewof BKG_color}
          ${viewof Use_BKG_image}
          <br/>${viewof Grid_color}
          ${viewof opacity}
          ${viewof Display_grid}
          <br/>${viewof Metalness}
          ${viewof Roughness}
          ${viewof Environment_intensity}
          <br/>${viewof Model_color}
          ${viewof Wireframe}
          ${viewof UniformColor}
          ${viewof DisplayCubes}
          <hr/>
          ${viewof animation_loop}
          <div style="margin-left: 0px; margin-top: 10px;">
            ${(disabled == "disabled") ? htl.html`${viewof n}` : htl.html`${viewof position}`}
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-wrap: wrap; margin: 20px 0; justify-content: space-between; box-sizing: border-box;">
      <div style="flex: 1; min-width: 400px; max-width: 900px;  box-sizing: border-box; margin-right: 20px;">
        <form>
          <fieldset ${disabled_A} style="border: 1px solid ${(disabled_A == "disabled") ? `#ccc` : `#00f`}; padding: 10px;">
            <legend><b>Position A</b></legend>
            <div style="display: flex; flex-wrap: wrap;">
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px; margin-right:40px;">
                ${viewof theta_1_A}
                ${viewof theta_2_A}
                ${viewof theta_3_A}
              </div>
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px;">
                ${viewof theta_4_A}
                ${viewof theta_5_A}
                ${viewof theta_6_A}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div style="flex: 1; min-width: 400px; max-width: 900px; box-sizing: border-box; margin-left: 20px;">
        <form>
          <fieldset ${disabled_B} style="border: 1px solid ${(disabled_B == "disabled") ? `#ccc` : `#00f`}; padding: 10px;">
            <legend><b>Position B</b></legend>
            <div style="display: flex; flex-wrap: wrap;">
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px; margin-right:40px;">
                ${viewof theta_1_B}
                ${viewof theta_2_B}
                ${viewof theta_3_B}
              </div>
              <div style="flex: 1; max-width: 400px; box-sizing: border-box; margin-left:20px;">
                ${viewof theta_4_B}
                ${viewof theta_5_B}
                ${viewof theta_6_B}
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
  `;
```

---
## About the IRB 120

```html
<p>
  The IRB 120 is a 6-degree-of-freedom (6-DOF) industrial robot developed by ABB. Its structure can be broken down into seven components: Six key blocks corresponding to the robot's joints, plus one end effector.
  <ol>
    <li><b>Base</b> (Joint 1, angle θ<sub>1</sub>)&mdash; The fixed part of the robot attached to a mounting surface (floor or ceiling). Joint 1 (J1) provides rotation around the vertical axis.</li> 
    <li><b>Lower Arm</b> (Joint 2, angle θ<sub>2</sub>)&mdash; Joint 2 (J2) allows the shoulder rotation of the lower arm, enabling forward and backward pitch movement.</li>
    <li><b>Upper Arm</b> (Joint 3, angle θ<sub>3</sub>)&mdash; Joint 3 (J3) allows the elbow rotation of the upper arm, providing up and down pitch movement.</li> 
    <li><b>Wrist Base</b> (Joint 4, angle θ<sub>4</sub>)&mdash; This component connects the upper arm to the wrist. Joint 4 (J4) enables the roll movement of the wrist around the arm's axis (<i>wrist pitch</i>).</li> 
    <li><b>Wrist Middle</b> (Joint 5, angle θ<sub>5</sub>)&mdash; Joint 5 (J5) allows the wrist to bend up and down (<i>wrist yaw</i>).</li>
    <li><b>Wrist End</b> (Joint 6, angle θ<sub>6</sub>)&mdash; Joint 6 (J6) allows the end effector to rotate around the wrist's axis (<i>wrist roll</i>).</li>
    <li><b>End Effector</b> &mdash; Attached to the wrist end, the end effector interacts with objects. It can be a gripper or any custom-specific tool.</li>
  </ol>
The arm joints (J1-J3) are responsible for the positioning of the tool, while the wrist joints (J4-J6) control its orientation.
</p>
<p>
  The 3D model embedeed in this notebook consists of seven separate files extracted from a CAD model downloaded from <a href="https://www.traceparts.com/en/product/abb-robotics-abbs-6-axis-robot-irb-120306?CatalogPath=TRACEPARTS%3ATP02001006003&Product=90-25022021-051339&PartNumber=IRB%20120-3%2F0.6" target="_blank">TraceParts</a>. The glTF file format is used here as it is convenient for use with the 3D visualization library <a href="https://observablehq.com/@christophe-yamahata/embedding-3d-models-using-three-js?collection=@christophe-yamahata/3d-three-js"><i>Three.js</i></a>.
</p>
```

---
## Forward kinematics

```html
<p>
  In robotics and computer animation, <a href="https://en.wikipedia.org/wiki/Forward_kinematics" target="_blank">forward kinematics</a> is used to determine the position and orientation of an end effector based on the joint angles of a mechanism. For this example, we calculate the positions and orientations of two reference cubes using six input angles (θ<sub>1</sub> to θ<sub>6</sub>) for each cube. The dimensions of the robot, as provided by the manufacturer (see <a href="#dimensions">illustration below</a>), are used in these calculations.
</p>
<p>
  The transformation matrices for the first three joints are defined as follows:
</p>
```

```js
tex`
    \qquad 
    T_{01}(\theta_1) = \begin{bmatrix}
          \cos(\theta_1) & -sin(\theta_1) & 0 & 0 \\
          \sin(\theta_1) & cos(\theta_1) & 0 & 0 \\
          0 & 0 & 1 & 0 \\
          0 & 0 & 0 & 1 \\
    \end{bmatrix} \qquad
    T_{12}(\theta_2) = \begin{bmatrix}
          1 & 0 & 0 & 0 \\
          0 & \cos(\theta_2) & -sin(\theta_2) & 0 \\
          0 & \sin(\theta_2) & cos(\theta_2)  & L_{1} \\
          0 & 0 & 0 & 1 \\
    \end{bmatrix} \qquad
    T_{23}(\theta_3) = \begin{bmatrix}
          1 & 0 & 0 & 0 \\
          0 & \cos(\theta_3) & -sin(\theta_3) & 0 \\
          0 & \sin(\theta_3) & cos(\theta_3)  & L_{2} \\
          0 & 0 & 0 & 1 \\
    \end{bmatrix} \\
    \quad \\
    \qquad \textrm{where } L_{1} = {\bf ${(pivotOffset_1/mm_to_inch).toFixed(0)}} \textrm{ mm is the vertical distance from the robot base to Joint 2 (J2).} \\
    \qquad \textrm{and } \;\;\;\, L_{2} = {\bf ${((pivotOffset_2 - pivotOffset_1)/mm_to_inch).toFixed(0)}} \textrm{ mm is the distance between Joint 2 (J2) and Joint 3 (J3).}
`
```

```html
<p>
  The transformation matrix ${tex`T_{01}`} represents the rotation around the vertical axis at Joint 1 (J1). 
  <br/>${tex`T_{12}`} represents the rotation around Joint 2 (J2) offset by ${tex`L_1`}.
  <br/>${tex`T_{23}`} represents the rotation around Joint 3 (J3) offset by ${tex`L_2`}.
</p>
<p>
  Given the IRB&nbsp;120 robot's 6 degrees of freedom (DOF), the complete transformation matrix ${tex`T_{06}`} is computed from the product of six individual transformation matrices:
  <br/>${tex`\qquad T_{06} = T_{01}T_{12}T_{23}T_{34}T_{45}T_{56}`}
</p>
```

```html
<p>
  Here are the results for the current positions <b>A</b> and <b>B</b>: 
</p>
```

```js
tex`
    \qquad 
    T_{06}^{A} = \begin{bmatrix}
          ${T06_A[0][0].toFixed(3)} &  ${T06_A[0][1].toFixed(3)}  &  ${T06_A[0][2].toFixed(3)}  &  {\bf ${(T06_A[0][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_A[1][0].toFixed(3)} &  ${T06_A[1][1].toFixed(3)}  &  ${T06_A[1][2].toFixed(3)}  &  {\bf ${(T06_A[1][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_A[2][0].toFixed(3)} &  ${T06_A[2][1].toFixed(3)}  &  ${T06_A[2][2].toFixed(3)}  &  {\bf ${(T06_A[2][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_A[3][0].toFixed(0)} &  ${T06_A[3][1].toFixed(0)}  &  ${T06_A[3][2].toFixed(0)}  &  ${T06_A[3][3].toFixed(0)}  \\
    \end{bmatrix} \qquad \Rightarrow \quad  x_A = {\bf ${(T06_A[0][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            y_A = {\bf ${(T06_A[1][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            z_A = {\bf ${(T06_A[2][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
`
```

```js
tex`
    \qquad 
    T_{06}^{B} = \begin{bmatrix}
          ${T06_B[0][0].toFixed(3)} &  ${T06_B[0][1].toFixed(3)}  &  ${T06_B[0][2].toFixed(3)}  &  {\bf ${(T06_B[0][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_B[1][0].toFixed(3)} &  ${T06_B[1][1].toFixed(3)}  &  ${T06_B[1][2].toFixed(3)}  &  {\bf ${(T06_B[1][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_B[2][0].toFixed(3)} &  ${T06_B[2][1].toFixed(3)}  &  ${T06_B[2][2].toFixed(3)}  &  {\bf ${(T06_B[2][3]/mm_to_inch).toFixed(1)} } \\
          ${T06_B[3][0].toFixed(0)} &  ${T06_B[3][1].toFixed(0)}  &  ${T06_B[3][2].toFixed(0)}  &  ${T06_B[3][3].toFixed(0)}  \\
    \end{bmatrix} \qquad \Rightarrow \quad  x_B = {\bf ${(T06_B[0][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            y_B = {\bf ${(T06_B[1][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
                                            z_B = {\bf ${(T06_B[2][3]/mm_to_inch).toFixed(1)} } \textrm{ mm,  }
`
```

```html
<p>
  These coordinates are to be compared with the dimensional drawing. For example, at rest position (all angles set to 0°), you will find out that the cube is in the following position along the <i>y</i> axis:
  <br/>${tex`\qquad y_{0} = `}  (${(Math.abs(pivotOffset_5)/mm_to_inch).toFixed(0)} 
                              + ${((Math.abs(pivotOffset_7) - Math.abs(pivotOffset_5))/mm_to_inch - cube_offset).toFixed(0)}) + ${cube_offset}
                              = ${(Math.abs(pivotOffset_7)/mm_to_inch - cube_offset).toFixed(0)} + ${cube_offset}
                              = ${(Math.abs(pivotOffset_7) /mm_to_inch).toFixed(1)} mm</b>, 
  <br/> &nbsp; &nbsp; &nbsp; &nbsp; <i>i.e.</i>, the position of the end effector, plus an offset of ${cube_offset} mm.
</p>
```

```js
dimensions = md`
---
## Dimensional drawing
`
```

```html
<p>
  The 2D drawing provides useful dimensions (in mm) necessary for the proper animation of the IRB 120 using <i>Three.js</i>.
  The base part is positioned at the origin of our scene. In the 3D model, the IRB 120 is in its rest position with the components assembled as depicted in the drawing. Therefore, the following offsets of the rotation axes need to be accounted for:
  
  <ul>
    <li>Joint 2 (J2): Vertically offset by <b>${(pivotOffset_1/mm_to_inch).toFixed(0)} mm</b>.</li>
    <li>Joint 3 (J3): Vertically offset by <b>${(pivotOffset_2/mm_to_inch).toFixed(0)} mm</b> (${(pivotOffset_1/mm_to_inch).toFixed(0)} mm + ${((pivotOffset_2-pivotOffset_1)/mm_to_inch).toFixed(0)} mm).</li>
    <li>Joint 4 (J4): Vertically offset by <b>${(pivotOffset_3/mm_to_inch).toFixed(0)} mm</b> (${(pivotOffset_1/mm_to_inch).toFixed(0)} mm + ${((pivotOffset_2-pivotOffset_1)/mm_to_inch).toFixed(0)} mm + ${((pivotOffset_3-pivotOffset_2)/mm_to_inch).toFixed(0)} mm).</li>
    <li>For Joint 5 (J5), we must consider two offsets:
        <ul>
          <li>A vertical offset of <b>${(pivotOffset_4/mm_to_inch).toFixed(0)} mm</b> (same as J4).</li>
          <li>A horizontal offset of <b>${(Math.abs(pivotOffset_5)/mm_to_inch).toFixed(0)} mm</b>.</li>
        </ul>
    </li>
    <li>To rotate the end effector, we need to account for the vertical offset of Joint 6 (J6), which is <b>${(pivotOffset_6/mm_to_inch).toFixed(0)} mm</b> (same as J4).</li>
  </ul>
</p>
```

```html
<figure>
  <img src="${await FileAttachment("IRB_120_Dimensional_drawing.png").url()}" style="border: 1px solid #a0a0a0; width: 545px">
  <figcaption>Dimensional drawing of the IRB 120. The values are given in millimeters (mm).</figcaption>
</figure>
```

```js
framework = md`
---
## Observable Framework
`
```

```html
<p>
Converting this notebook into a framework presented a few subtleties that needed to be overcome, but the final result is quite similar. As a teaser, the following thumbnail links to a video demonstrating the deployment of this computer graphics animation using the Observable Framework.
<ul>
  <li><a href="https://christophe-yamahata.observablehq.cloud/irb120-animated-with-three-js/" target="_blank">Link the the Framework</a> (Observablehq.cloud)</li>
  <li><a href="https://youtu.be/imaOQ4znJmI" target="_blank">Link to the video</a> (YouTube.com)</li>
</ul>
</p>
```

```html
<figure>
  <a href="https://youtu.be/imaOQ4znJmI" target="_blank"><img src="${await FileAttachment("illustration_YouTube_IRB120.png").url()}" style="border: 1px solid #a0a0a0; width: 650px;"></a>
  <figcaption><b>Observable Framework</b> &ndash;  IRB 120 Industrial Robot: Animation using Three.js and Observable Framework</figcaption>
</figure>
```

---
## Appendices

### Scene in *Three.js*

```js
aspect_ratio = 1.42
```

```js
environmentMap = FileAttachment("a1e09630d937af8a4ad169486c4af5932b4653d5.jpg").url()
```

```js
metaRoughnessTexture = FileAttachment("metal_roughness_texture.jpg").url()
```

```js
textureBackground = FileAttachment("texture_background.PNG").url()
```

```js
THREE = {
  // Import threejs
  const three = await require("three@0.139.2");
  window.THREE = three;

  // Import plugins
  await require("three@0.139.2/examples/js/controls/OrbitControls.js").catch((e) => { console.warn(e) });
  await require("three@0.139.2/examples/js/loaders/GLTFLoader").catch((e) => { console.warn(e) });

  console.log(three);
  return three;
}
```

```js
// Define paths object: 7 sub-assemblies for the industrial robot IRB 120 
paths = (async () => {
  const base = await FileAttachment("base@2.glb").url();
  const lowerArm = await (FileAttachment("lowerArm@4.glb").url());
  const upperArm = await (FileAttachment("upperArm@2.glb").url());
  const wristBase = await FileAttachment("wristBase@5.glb").url();
  const wristMiddle = await FileAttachment("wristMiddle@1.glb").url();
  const wristEnd = await FileAttachment("wristEnd@1.glb").url();
  const endEffector = await FileAttachment("endEffector@3.glb").url();

  return {
    base,
    lowerArm,
    upperArm,
    wristBase,
    wristMiddle,
    wristEnd,
    endEffector
  };
})();
  
```

```js
// Define two cubes
cubes = (async () => {
  const cubeA = await FileAttachment("Cube_xyz@2.glb").url();
  const cubeB = await (FileAttachment("Cube_xyz@2.glb").url());

  return {
    cubeA,
    cubeB
  };
})();
```

```js
// Create renderer
renderer = {
  
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width-450, (width-450)/aspect_ratio);
  renderer.setPixelRatio(devicePixelRatio);

  // Initial controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 15, 0); // Adjust the target position for panning

  // Set the maximum zoom levels
  controls.minDistance = 10;
  controls.maxDistance = 100;

  // Manually trigger an update of OrbitControls
  controls.update();
  
  return renderer;
}
```

```js
// Create camera
camera = {
  const fov = 30;
  const near = 1;
  const far = 500;
  const camera = new THREE.PerspectiveCamera(fov, aspect_ratio, near, far);

  camera.position.set(-70, 5, -10);

  return camera;
}

```

```js
scene = {
  // Initialize the scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BKG_color);

  if (!renderer) {
    let renderer = new THREE.WebGLRenderer();
  }

  // Initialize lights
  const point = new THREE.PointLight(0xcccccc);
  point.position.set(-50, 500, -100);
  scene.add(point);
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);
  
  // Grid
  const gridHelper = new THREE.GridHelper(200, 50, Grid_color, Grid_color);
  if(Display_grid) {    
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = opacity;
    scene.add(gridHelper);
    // const axesHelper = new THREE.AxesHelper( 15 );
    // scene.add( axesHelper );
  }

  // load a backround image
  if(Use_BKG_image) {
    const textureBKG = new THREE.TextureLoader().load(await textureBackground);
    scene.background = textureBKG;    
  }
  
  // Load the environment map
  const loadEnvironmentMap = (url) => {
    return new Promise((resolve, reject) => {
      mapLoader.load(url, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      }, undefined, reject);
    });
  };
  const mapLoader = new THREE.TextureLoader();
  const envMap = await loadEnvironmentMap(await environmentMap);

  // Load the roughness texture for the 3D model
  const loadRoughnessTexture = (url) => {
    return new Promise((resolve, reject) => {
      textureLoader.load(url, (texture) => {
        // Scale and repeat the roughness texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 3); // Adjust these values to control the repetition
        resolve(texture);
      }, undefined, reject);
    });
  };
  const textureLoader = new THREE.TextureLoader();
  const roughnessTexture = await loadRoughnessTexture(await metaRoughnessTexture);
  
  // Loaders (glTF format)
  const loader = new THREE.GLTFLoader();

  // Load model function
  async function loadModel(modelPath) {
    return new Promise((resolve, reject) => {
      loader.load(
        modelPath,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }
  
  function applyCubeTransformation(H, cube) {
    // Convert the 2D array to a 1D array in column-major order
    if (H && H.length === 4 && H[0].length === 4) {
        // Apply transformations based on the provided logic
        const matrixArray = [
            H[0][0], H[1][0], H[2][0], H[3][0],
            H[0][1], H[1][1], H[2][1], H[3][1],
            H[0][2], H[1][2], H[2][2], H[3][2],
            H[0][3], H[1][3], H[2][3], H[3][3]
        ];

      // Create a Matrix4 object and set its elements
      const originalMatrix = new THREE.Matrix4();
      originalMatrix.fromArray(matrixArray);
  
      // Define the axis swap transformation matrix
      // This transformation is needed because the transformation matrix used a reference coordinate different from that used in three.js
      const axisSwapMatrixArray = [
          0,  0, -1,  0,
         -1,  0,  0,  0,
          0,  1,  0,  0,
          0,  0,  0,  1
      ];
  
      const axisSwapMatrix = new THREE.Matrix4();
      axisSwapMatrix.fromArray(axisSwapMatrixArray);
  
      const transformedMatrix = new THREE.Matrix4();
      transformedMatrix.multiplyMatrices(axisSwapMatrix, originalMatrix);
  
      cube.applyMatrix4(transformedMatrix);
  
      // Extract the translation components from the transformed matrix
      const translationX = transformedMatrix.elements[12];  // Translation along x-axis
      const translationY = transformedMatrix.elements[13];  // Translation along y-axis
      const translationZ = transformedMatrix.elements[14];  // Translation along z-axis
  
      // Apply the translation to the cube's position
      cube.position.set(translationX, translationY, translationZ);
  
      // Extract the rotation components and convert to Euler angles
      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.extractRotation(transformedMatrix);
  
      const euler = new THREE.Euler();
      euler.setFromRotationMatrix(rotationMatrix);
  
      // Apply the rotation to the cube's rotation
      cube.rotation.x = euler.x;
      cube.rotation.y = euler.y;
      cube.rotation.z = euler.z;
    } else {
          console.error('Transformation matrix H is invalid:', H);
    }
  }
        
  
  // Define variables to store loaded models and groups
  let baseModel, lowerArmGroup, lowerArmModel, upperArmGroup, upperArmModel, wristBaseGroup, wristBaseModel, 
      wristMiddleGroup, wristMiddleModel, wristEndGroup, wristEndModel, endEffectorGroup, endEffectorModel;
  let cubeA, cubeB;
  
  let modelsLoaded = false;
  
  // Function to load all robot parts and set up hierarchy
  const loadRobotModels = async () => {
    try {      
      // Load models if not already loaded
      if (!modelsLoaded) {
        // Load models
          const models = await Promise.all([
            loadModel(paths.base),
            loadModel(paths.lowerArm),
            loadModel(paths.upperArm),
            loadModel(paths.wristBase),
            loadModel(paths.wristMiddle),
            loadModel(paths.wristEnd),
            loadModel(paths.endEffector),
            loadModel(cubes.cubeA),
            loadModel(cubes.cubeB)
          ]);
  
        // Destructure loaded models
        [baseModel, lowerArmModel, upperArmModel, wristBaseModel, wristMiddleModel, wristEndModel, endEffectorModel, 
         cubeA, cubeB] = models;

        // Add cubes to the scene
        if(DisplayCubes) {  
          scene.add(cubeA);
          scene.add(cubeB);
        }

        // Create groups for hierarchical pivoting
        lowerArmGroup = new THREE.Group();
        lowerArmGroup.add(lowerArmModel);
        upperArmGroup = new THREE.Group();
        wristBaseGroup = new THREE.Group();
        wristMiddleGroup = new THREE.Group();
        wristEndGroup = new THREE.Group();
        endEffectorGroup = new THREE.Group();
        
        // Set up hierarchy according to robot's structure
        baseModel.add(lowerArmGroup);
        lowerArmGroup.add(upperArmGroup);
        upperArmGroup.add(upperArmModel);
  
        upperArmModel.add(wristBaseGroup);
        wristBaseGroup.add(wristBaseModel);
        wristBaseModel.add(wristMiddleGroup);
        wristMiddleGroup.add(wristMiddleModel);
        wristMiddleModel.add(wristEndGroup);
        wristEndGroup.add(wristEndModel);
        wristEndModel.add(endEffectorGroup);
        endEffectorGroup.add(endEffectorModel);
  
        // Add base to the scene
        scene.add(baseModel);
        
        baseModel.traverse(function (child) {
          if (child.isMesh) {
            if(Wireframe){
              if(UniformColor) {
                child.material.color.setStyle(Model_color);
              }
              child.material.wireframe = true;
              child.material.transparent = true;
              child.material.opacity = 0.1;
            } else {              
              child.material.wireframe = false;
              child.material.opacity = 1;
              if(UniformColor) {
                child.material.color.setStyle(Model_color);
              }
              child.material.transparent = true;
              child.material.roughness = Roughness; 
              child.material.metalness = Metalness;
              child.material.roughnessMap = roughnessTexture; // Apply the roughness texture
              if(Environment_intensity>0) {
                child.material.envMap = envMap; // Assign Equirectangular environment map
                child.material.envMapIntensity = Environment_intensity; // Intensity of environment map reflection
                child.material.reflectivity = 1 - Roughness; // Reflectivity (0 to 1)              
              }
            } 
          }
        });
        
       // Set modelsLoaded to true to indicate that models have been loaded
        modelsLoaded = true;
      }
    } catch (error) {
      console.error('An error occurred while loading the robot models:', error);
    }
  };
    
  // Function to apply transformations based on angles and pivot offsets
  const applyTransformations = () => {
    if (modelsLoaded) {
      
        // Apply the transformation to the cubes
        applyCubeTransformation(T06_A, cubeA);
        applyCubeTransformation(T06_B, cubeB);
      
        // Rotate lower arm group
        lowerArmGroup.rotation.y = THREE.MathUtils.degToRad(theta_1);
  
        // Rotate upper arm group
        upperArmGroup.position.y = pivotOffset_1;
        upperArmGroup.rotation.z = THREE.MathUtils.degToRad(theta_2);
        upperArmModel.position.y = -pivotOffset_1;
  
        // Rotate wrist base group
        wristBaseGroup.position.y = pivotOffset_2;
        wristBaseGroup.rotation.z = THREE.MathUtils.degToRad(theta_3);
        wristBaseModel.position.y = -pivotOffset_2;
  
        // Rotate wrist middle group
        wristMiddleGroup.position.y = pivotOffset_3;
        wristMiddleGroup.rotation.x = THREE.MathUtils.degToRad(theta_4);
        wristMiddleModel.position.y = -pivotOffset_3;
  
        // Rotate wrist end group     
        wristEndGroup.position.y = pivotOffset_4;
        wristEndGroup.position.x = pivotOffset_5;
        wristEndGroup.rotation.z = THREE.MathUtils.degToRad(theta_5);
        wristEndModel.position.y = -pivotOffset_4;
        wristEndModel.position.x = -pivotOffset_5;
  
        // Rotate end effector group
        endEffectorGroup.position.y = pivotOffset_6;
        endEffectorGroup.rotation.x = THREE.MathUtils.degToRad(theta_6);
        endEffectorModel.position.y = -pivotOffset_6;

    }
  };

  var theta_1 = position == "A"? theta_1_A: theta_1_B;    
  var theta_2 = position == "A"? theta_2_A: theta_2_B;
  var theta_3 = position == "A"? theta_3_A: theta_3_B;
  var theta_4 = position == "A"? theta_4_A: theta_4_B; 
  var theta_5 = position == "A"? theta_5_A: theta_5_B;
  var theta_6 = position == "A"? theta_6_A: theta_6_B;


  // Function to update theta with smooth behavior
  function updateTheta(theta_A, theta_B) {
      let progress = step / n;
      let phase = (progress < 0.5) ? 2 * progress : 2 * (1 - progress);
      let easingValue = 3 * Math.pow(phase,2) - 2 * Math.pow(phase,3);
      let theta = theta_A + (theta_B - theta_A) * easingValue;
      return theta;
  }

  // Animation
  let step = 0; // Initialize step
  const animate = () => { 
    if(animation_loop) {
      requestAnimationFrame(animate);      
      theta_1 = updateTheta(theta_1_A,theta_1_B);
      theta_2 = updateTheta(theta_2_A,theta_2_B);
      theta_3 = updateTheta(theta_3_A,theta_3_B);
      theta_4 = updateTheta(theta_4_A,theta_4_B);      
      theta_5 = updateTheta(theta_5_A,theta_5_B);
      theta_6 = updateTheta(theta_6_A,theta_6_B);

      // Update step
      (step > n) ? step = 0 : step += 1; // Reset step after one complete cycle
    }     
    applyTransformations();
  };

  // Load all models initially and start animation loop
  loadRobotModels().then(() => { 
    animate();
    renderer.render(scene, camera);
  });

  // Return the scene object
  return scene;
};
```

```js echo
{
  while (true) {
    renderer.render(scene, camera);
    yield null;
  } 
}
```

### Model parameters

```js
mm_to_inch = 0.0393701
```

```js
cube_offset = 8
```

```js
pivotOffset_1 = 290*mm_to_inch
```

```js
pivotOffset_2 = pivotOffset_1 + 270*mm_to_inch
```

```js
pivotOffset_3 = pivotOffset_2 + 70*mm_to_inch
```

```js
pivotOffset_4 = pivotOffset_3
```

```js
pivotOffset_5 = -302*mm_to_inch
```

```js
pivotOffset_6 = pivotOffset_3
```

```js
// Cube defined from its center. It must positioned with an offset
pivotOffset_7 = -(374 + cube_offset) * mm_to_inch
```

---
### User interface

```js
disabled = animation_loop ? "disabled":"";
```

```js
disabled_A= animation_loop || position == "B" ? "disabled":""
```

```js echo
disabled_B= animation_loop || position == "A" ? "disabled":""
```

```js echo
viewof BKG_color = Inputs.color({label: "Background color", value: "#555b62"})
```

```js echo
viewof Use_BKG_image = Inputs.toggle({label: "Use a texture background", value: true})
```

```js echo
viewof Metalness = Inputs.range([0, 1], {value: 0.6, step: 0.1, label: "Material metalness"})
```

```js echo
viewof Roughness = Inputs.range([0, 1], {value: 0.9, step: 0.05, label: "Material roughness"})
```

```js echo
viewof Environment_intensity = Inputs.range([0, 1], {value: 0.5, step: 0.1, label: "Environment intensity"})
```

```js echo
viewof Model_color = Inputs.color({label: "Wireframe color / uniform color", value: "#b9cdd4"})
```

```js echo
viewof Wireframe = Inputs.toggle({label: "3D model as wireframe", value: false})
```

```js echo
viewof DisplayCubes = Inputs.toggle({label: htl.html`Display cubes <br/>in <b>A</b> and <b>B</b>`, value: true})
```

```js echo
viewof UniformColor = Inputs.toggle({label: "Uniform color", value: false})
```

```js echo
viewof Grid_color = Inputs.color({label: "Grid color", value: "#d53040"})
```

```js echo
viewof opacity = Inputs.range([0, 1], {value: 0.6, step: 0.1, label: "Grid opacity"})
```

```js echo
viewof Display_grid = Inputs.toggle({label: "Grid display", value: true})
```

```js echo
viewof n = Inputs.radio(new Map([["Very sow", 1000], ["Slow", 500], ["Medium", 200], ["Fast", 100], ["Very fast", 40]]), {value: 100, label: "Animation speed:"})
```

```js echo
viewof animation_loop = Inputs.toggle({label: htl.html`Looped animation? <i>(uncheck to modify values for <b>A</b> and <b>B</b>)</i>`, value: true})
```

```js echo
viewof position = Inputs.radio(["A", "B"], {label: "Active position:", value: "A"})
```

```js echo
viewof theta_1_A = Inputs.range([-165, 165], {value: -50, step: 5, label: htl.html`Rotation θ<sub>1</sub>`})
```

```js echo
viewof theta_1_B = Inputs.range([-165, 165], {value: 35, step: 5, label: htl.html`Rotation θ<sub>1</sub>`})
```

```js echo
viewof theta_2_A = Inputs.range([-110, 110], {value: 60, step: 5, label: htl.html`Rotation θ<sub>2</sub>`})
```

```js echo
viewof theta_2_B = Inputs.range([-110, 110], {value: 35, step: 5, label: htl.html`Rotation θ<sub>2</sub>`})
```

```js echo
viewof theta_3_A = Inputs.range([-110, 70], {value: -15, step: 5, label: htl.html`Rotation θ<sub>3</sub>`})
```

```js echo
viewof theta_3_B = Inputs.range([-110, 70], {value: 5, step: 5, label: htl.html`Rotation θ<sub>3</sub>`})
```

```js echo
viewof theta_4_A = Inputs.range([-160, 160], {value: 0, step: 5, label: htl.html`Rotation θ<sub>4</sub>`})
```

```js echo
viewof theta_4_B = Inputs.range([-160, 160], {value: -55, step: 5, label: htl.html`Rotation θ<sub>4</sub>`})
```

```js echo
viewof theta_5_A = Inputs.range([-120, 120], {value: 45, step: 5, label: htl.html`Rotation θ<sub>5</sub>`})
```

```js echo
viewof theta_5_B = Inputs.range([-120, 120], {value: 80, step: 5, label: htl.html`Rotation θ<sub>5</sub>`})
```

```js echo
viewof theta_6_A = Inputs.range([-400, 400], {value: 50, step: 5, label: htl.html`Rotation θ<sub>6</sub>`})
```

```js echo
viewof theta_6_B = Inputs.range([-400, 400], {value: 200, step: 5, label: htl.html`Rotation θ<sub>6</sub>`})
```

---
### Forward kinematics 
#### (positioning the cubes in *A* and *B*)

```js
// Function to multiply two 4x4 matrices
// M = M1.M2
function multiplyMatrices4x4(M1, M2) {
    // Initialize a 4x4 result matrix with zeros
    const M = Array.from({ length: 4 }, () => Array(4).fill(0));

    // Perform matrix multiplication
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            for (let k = 0; k < 4; k++) {
                M[i][j] += M1[i][k] * M2[k][j];
            }
        }
    }

    return M;
}
```

```js
// Function to create the transformation matrix T01(theta)
function T01(theta) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T01(theta)
    const T = [
        [cosTheta, -sinTheta, 0, 0],
        [sinTheta, cosTheta, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    return T;
}

```

```js
// Function to create the transformation matrix T12(theta)
T12 = function(theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T12(theta)
    const T = [
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, 0],
        [0, sinTheta, cosTheta, pivotOffset],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T23(theta)
function T23(theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T23(theta)
    const T = [
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, 0],
        [0, sinTheta, cosTheta, pivotOffset],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T34(theta)
T34 = function (theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T34(theta)
    const T = [
        [cosTheta, 0, sinTheta, 0],
        [0, 1, 0, 0],
        [-sinTheta, 0, cosTheta, pivotOffset],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T45(theta)
T45 = function (theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T45(theta)
    const T = [
        [1, 0, 0, 0],
        [0, cosTheta, -sinTheta, pivotOffset],
        [0, sinTheta, cosTheta, 0],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
// Function to create the transformation matrix T56(theta)
T56 = function (theta, pivotOffset) {
    const thetaRadians = theta * (Math.PI / 180);
    const cosTheta = Math.cos(thetaRadians);
    const sinTheta = Math.sin(thetaRadians);

    // Define the transformation matrix T56(theta)
    const T = [
        [cosTheta, 0, sinTheta, 0],
        [0, 1, 0, pivotOffset],
        [-sinTheta, 0, cosTheta, 0],
        [0, 0, 0, 1]
    ];

    return T;
}
```

```js
T01_A = T01(theta_1_A)
```

```js
T01_B = T01(theta_1_B)
```

```js
T12_A = T12(-theta_2_A, pivotOffset_1)
```

```js
T12_B = T12(-theta_2_B, pivotOffset_1)
```

```js
T23_A = T23(-theta_3_A, pivotOffset_2 - pivotOffset_1);
```

```js
T23_B = T23(-theta_3_B, pivotOffset_2 - pivotOffset_1);
```

```js
T34_A = T34(-theta_4_A, pivotOffset_3 - pivotOffset_2);
```

```js
T34_B = T34(-theta_4_B, pivotOffset_3 - pivotOffset_2);
```

```js
T45_A = T45(-theta_5_A, -pivotOffset_5);
```

```js
T45_B = T45(-theta_5_B, -pivotOffset_5);
```

```js
T56_A = T56(-theta_6_A, -pivotOffset_7 + pivotOffset_5);
```

```js
T56_B = T56(-theta_6_B, -pivotOffset_7 + pivotOffset_5);
```

```js
T02_A = multiplyMatrices4x4(T01_A,T12_A)
```

```js
T02_B = multiplyMatrices4x4(T01_B,T12_B)
```

```js
T03_A = multiplyMatrices4x4(T02_A,T23_A)
```

```js
T03_B = multiplyMatrices4x4(T02_B,T23_B)
```

```js
T04_A = multiplyMatrices4x4(T03_A,T34_A)
```

```js
T04_B = multiplyMatrices4x4(T03_B,T34_B)
```

```js
T05_A = multiplyMatrices4x4(T04_A,T45_A)
```

```js
T05_B = multiplyMatrices4x4(T04_B,T45_B)
```

```js
T06_A = multiplyMatrices4x4(T05_A,T56_A)
```

```js
T06_B = multiplyMatrices4x4(T05_B,T56_B)
```
