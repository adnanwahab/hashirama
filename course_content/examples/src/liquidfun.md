```js
md`# LiquidFun

Adapted from the [LiquidFun testbed](http://google.github.io/liquidfun/).`
```

```js echo
canvas = {
  const timeStep = 1 / 60;
  const velocityIterations = 8;
  const positionIterations = 3;
  const maxVertices = 1 << 16;

  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xFFFFFF);
  renderer.setSize(width, height);
  renderer.setPixelRatio(devicePixelRatio);
  invalidation.then(() => renderer.dispose());

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(maxVertices * 3), 3));
  geometry.addAttribute("color", new THREE.BufferAttribute(new Float32Array(maxVertices * 3), 3));
  const positions = geometry.attributes.position.array;
  const colors = geometry.attributes.color.array;
  const buffer = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors}));
  const particleVertices = [];
  const particleResolution = 8;
  let currentVertex = 0;
  initCircleVertices(particleVertices, particleResolution);

  const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  camera.position.x = 0;
  camera.position.y = 1;
  camera.position.z = 2.5;
  camera.lookAt(0, 1, 0);

  const scene = new THREE.Scene();
  scene.add(buffer);

  function insertLine(x1, y1, x2, y2) {
    let i = currentVertex;
    let threeI = i * 3;
    positions[threeI] = x1;
    positions[threeI + 1] = y1;
    positions[threeI + 2] = 0;
    i++;
    threeI = i * 3;
    positions[threeI] = x2;
    positions[threeI + 1] = y2;
    positions[threeI + 2] = 0;
    currentVertex += 2;
  }

  function insertParticleVertices(radius, x, y) {
    const vertices = particleVertices;
    for (let i = 0; i < particleResolution; ++i) {
      const i4 = i * 4;
      const x1 = vertices[i4] * radius + x;
      const y1 = vertices[i4 + 1] * radius + y;
      const x2 = vertices[i4 + 2] * radius + x;
      const y2 = vertices[i4 + 3] * radius + y;
      insertLine(x1, y1, x2, y2);
    }
  }

  function initCircleVertices(v, resolution) {
    const size = 2 * Math.PI / resolution;
    for (let i = 0; i < resolution; ++i) {
      const s1 = i * size;
      const s2 = (i + 1) * size;
      v.push(Math.cos(s1), Math.sin(s1), Math.cos(s2), Math.sin(s2));
    }
  }

  function transformAndInsert(v1, v2, transform) {
    const tv1 = new b2.Vec2();
    const tv2 = new b2.Vec2();
    b2.Vec2.Mul(tv1, transform, v1);
    b2.Vec2.Mul(tv2, transform, v2);
    insertLine(tv1.x, tv1.y, tv2.x, tv2.y);
  }

  function transformVerticesAndInsert(vertices, transform) {
    for (let i = 1, n = vertices.length; i < n; i++) {
      transformAndInsert(vertices[i - 1], vertices[i], transform);
    }
  }

  function drawPolygonShape(shape, transform) {
    const i = currentVertex * 3;
    transformVerticesAndInsert(shape.vertices, transform, 0, 0, 0);
    const j = (currentVertex - 1) * 3;
    insertLine(positions[j], positions[j + 1], positions[i], positions[i + 1]);
  }

  function drawParticleSystem(system) {
    const particles = system.GetPositionBuffer();
    for (let i = 0, n = particles.length; i < n; i += 2) {
      insertParticleVertices(system.radius / 2, particles[i], particles[i + 1], 3);
    }
  }

  function draw() {
    const world = machine.world;
    currentVertex = 0;
    for (let i = 0, n = world.bodies.length; i < n; i++) {
      const body = world.bodies[i];
      const transform = body.GetTransform();
      for (let j = 0, m = body.fixtures.length; j < m; j++) {
        drawPolygonShape(body.fixtures[j].shape, transform);
      }
    }
    for (var i = 0, n = world.particleSystems.length; i < n; i++) {
      drawParticleSystem(world.particleSystems[i]);
    }
    buffer.geometry.attributes.position.needsUpdate = true;
    // buffer.geometry.attributes.color.needsUpdate = true;
    renderer.render(scene, camera);
  }

  for (let time = 0; true; time += timeStep) {
    machine.world.Step(timeStep, velocityIterations, positionIterations);
    machine.joint.SetMotorSpeed(Math.cos(time) / 3 - machine.joint.GetJointAngle());
    draw();
    yield renderer.domElement;
  }
}
```

```js echo
machine = {
  const world = window.world = new b2.World(new b2.Vec2(0, -10)); // Ugh, global.
  const bd = new b2.BodyDef();
  const ground = world.CreateBody(bd);
  bd.type = b2._dynamicBody;
  bd.allowSleep = false;
  bd.position.Set(0, 1);
  const body = world.CreateBody(bd);
  const p1 = new b2.PolygonShape();
  p1.SetAsBoxXYCenterAngle(0.05, 1, new b2.Vec2(2, 0), 0);
  body.CreateFixtureFromShape(p1, 5);
  const p2 = new b2.PolygonShape();
  p2.SetAsBoxXYCenterAngle(0.05, 1, new b2.Vec2(-2, 0), 0);
  body.CreateFixtureFromShape(p2, 5);
  const p3 = new b2.PolygonShape();
  p3.SetAsBoxXYCenterAngle(2, 0.05, new b2.Vec2(0, 1), 0);
  body.CreateFixtureFromShape(p3, 5);
  const p4 = new b2.PolygonShape();
  p4.SetAsBoxXYCenterAngle(2, 0.05, new b2.Vec2(0, -1), 0);
  body.CreateFixtureFromShape(p4, 5);
  const jd = new b2.RevoluteJointDef();
  jd.maxMotorTorque = 1e7;
  jd.enableMotor = true;
  const joint = jd.InitializeAndCreate(ground, body, new b2.Vec2(0, 1));
  const psd = new b2.ParticleSystemDef();
  psd.radius = 0.025;
  psd.dampingStrength = 0.2;
  const particleSystem = world.CreateParticleSystem(psd);
  const box = new b2.PolygonShape();
  box.SetAsBoxXYCenterAngle(0.9, 0.9, new b2.Vec2(0, 1), 0);
  const particleGroupDef = new b2.ParticleGroupDef();
  particleGroupDef.shape = box;
  particleSystem.CreateParticleGroup(particleGroupDef);
  return {world, joint};
}
```

```js echo
height = 600
```

```js echo
b2 = {
  await require("https://google.github.io/liquidfun/testbed/liquidfun.js").catch(() => {});
  const b2 = {};
  for (const k in window) if (/^b2/.test(k)) b2[k.slice(2)] = window[k];
  return b2;
}
```

```js echo
THREE = require("three@0.95/build/three.js")
```
