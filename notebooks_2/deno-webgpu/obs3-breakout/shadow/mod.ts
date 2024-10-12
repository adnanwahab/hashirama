import { Framework } from "../framework.ts";
import {
  createBufferInit,
  Dimensions,
  OPENGL_TO_WGPU_MATRIX,
} from "../utils.ts";
import * as gmath from "gmath";

function vertex(
  pos: [number, number, number],
  nor: [number, number, number],
): number[] {
  // deno-fmt-ignore
  return [
    ...pos, 1,
    ...nor, 0,
  ];
}

interface ObjectData {
  vertexData: Int8Array;
  indexData: Uint16Array;
}

function createCube(): ObjectData {
  const vertexData = new Int8Array([
    // top (0, 0, 1)
    ...vertex([-1, -1, 1], [0, 0, 1]),
    ...vertex([1, -1, 1], [0, 0, 1]),
    ...vertex([1, 1, 1], [0, 0, 1]),
    ...vertex([-1, 1, 1], [0, 0, 1]),
    // bottom (0, 0, -1)
    ...vertex([-1, 1, -1], [0, 0, -1]),
    ...vertex([1, 1, -1], [0, 0, -1]),
    ...vertex([1, -1, -1], [0, 0, -1]),
    ...vertex([-1, -1, -1], [0, 0, -1]),
    // right (1, 0, 0)
    ...vertex([1, -1, -1], [1, 0, 0]),
    ...vertex([1, 1, -1], [1, 0, 0]),
    ...vertex([1, 1, 1], [1, 0, 0]),
    ...vertex([1, -1, 1], [1, 0, 0]),
    // left (-1, 0, 0)
    ...vertex([-1, -1, 1], [-1, 0, 0]),
    ...vertex([-1, 1, 1], [-1, 0, 0]),
    ...vertex([-1, 1, -1], [-1, 0, 0]),
    ...vertex([-1, -1, -1], [-1, 0, 0]),
    // front (0, 1, 0)
    ...vertex([1, 1, -1], [0, 1, 0]),
    ...vertex([-1, 1, -1], [0, 1, 0]),
    ...vertex([-1, 1, 1], [0, 1, 0]),
    ...vertex([1, 1, 1], [0, 1, 0]),
    // back (0, -1, 0)
    ...vertex([1, -1, 1], [0, -1, 0]),
    ...vertex([-1, -1, 1], [0, -1, 0]),
    ...vertex([-1, -1, -1], [0, -1, 0]),
    ...vertex([1, -1, -1], [0, -1, 0]),
  ]);

  // deno-fmt-ignore
  const indexData = new Uint16Array([
    0, 1, 2, 2, 3, 0, // top
    4, 5, 6, 6, 7, 4, // bottom
    8, 9, 10, 10, 11, 8, // right
    12, 13, 14, 14, 15, 12, // left
    16, 17, 18, 18, 19, 16, // front
    20, 21, 22, 22, 23, 20, // back
  ]);

  return { vertexData, indexData };
}

function createPlane(size: number): ObjectData {
  const vertexData = new Int8Array([
    ...vertex([size, -size, 0], [0, 0, 1]),
    ...vertex([size, size, 0], [0, 0, 1]),
    ...vertex([-size, -size, 0], [0, 0, 1]),
    ...vertex([-size, size, 0], [0, 0, 1]),
  ]);

  const indexData = new Uint16Array([0, 1, 2, 2, 1, 3]);

  return { vertexData, indexData };
}

function generateMatrix(aspectRatio: number): Float32Array {
  const mxProjection = new gmath.PerspectiveFov(
    new gmath.Deg(45),
    aspectRatio,
    1,
    20,
  ).toPerspective().toMatrix4();
  const mxView = gmath.Matrix4.lookAtRh(
    new gmath.Vector3(3, -10, 6),
    new gmath.Vector3(0, 0, 0),
    gmath.Vector3.forward(),
  );
  return OPENGL_TO_WGPU_MATRIX.mul(mxProjection.mul(mxView)).toFloat32Array();
}

interface Entity {
  mxWorld: gmath.Matrix4;
  rotationSpeed: number;
  color: [number, number, number, number];
  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
  indexFormat: GPUIndexFormat;
  indexCount: number;
  uniformOffset: number;
}

interface Light {
  pos: gmath.Vector3;
  color: [number, number, number, number];
  fov: number;
  depth: [number, number];
  targetView: GPUTextureView;
}

function lightToRaw(light: Light): Float32Array {
  const mxView = gmath.Matrix4.lookAtRh(
    light.pos,
    gmath.Vector3.zero(),
    gmath.Vector3.forward(),
  );
  const projection = new gmath.PerspectiveFov(
    new gmath.Deg(light.fov),
    1,
    light.depth[0],
    light.depth[1],
  );
  const mxViewProj = OPENGL_TO_WGPU_MATRIX.mul(
    projection.toPerspective().toMatrix4().mul(mxView),
  );
  // deno-fmt-ignore
  return new Float32Array([
    ...mxViewProj.toFloat32Array().slice(),
    ...light.pos.toArray(), 1,
    ...light.color,
  ]);
}

interface Pass {
  pipeline: GPURenderPipeline;
  bindGroup: GPUBindGroup;
  uniformBuffer: GPUBuffer;
}

const LIGHT_SIZE = (4 * 4 * 4) + (4 * 4) + (4 * 4);

class Shadow extends Framework {
  maxLights: number;

  entities!: Entity[];
  shadowPass!: Pass;
  forwardPass!: Pass;
  depthTextureView!: GPUTextureView;
  entityUniformBuffer!: GPUBuffer;
  lightStorageBuffer!: GPUBuffer;
  lights!: Light[];
  entityBindGroup!: GPUBindGroup;

  lightsAreDirty = true;

  constructor(options: {
    maxLights: number;
    dimensions: Dimensions;
  }, device: GPUDevice) {
    super(options.dimensions, device);

    this.maxLights = options.maxLights;
  }

  // deno-lint-ignore require-await
  async init() {
    const supportStorageResources = false; //this.device.limits.maxStorageBuffersPerShaderStage > 0;

    const shadowSize: GPUExtent3D = {
      width: 512,
      height: 512,
      depthOrArrayLayers: this.maxLights,
    };

    const vertexSize = 1 * 4 * 2;
    const { vertexData: cubeVertexData, indexData: cubeIndexData } =
      createCube();
    const cubeVertexBuffer = createBufferInit(this.device, {
      label: "Cubes Vertex Buffer",
      usage: GPUBufferUsage.VERTEX,
      contents: cubeVertexData.buffer,
    });
    const cubeIndexBuffer = createBufferInit(this.device, {
      label: "Cubes Index Buffer",
      usage: GPUBufferUsage.INDEX,
      contents: cubeIndexData.buffer,
    });

    const { vertexData: planeVertexData, indexData: planeIndexData } =
      createPlane(
        7,
      );
    const planeVertexBuffer = createBufferInit(this.device, {
      label: "Plane Vertex Buffer",
      usage: GPUBufferUsage.VERTEX,
      contents: planeVertexData.buffer,
    });
    const planeIndexBuffer = createBufferInit(this.device, {
      label: "Plane Index Buffer",
      usage: GPUBufferUsage.INDEX,
      contents: planeIndexData.buffer,
    });

    interface CubeDesc {
      offset: gmath.Vector3;
      angle: number;
      scale: number;
      rotation: number;
    }

    const cubeDescs: CubeDesc[] = [
      {
        offset: new gmath.Vector3(-2.0, -2.0, 2.0),
        angle: 10.0,
        scale: 0.7,
        rotation: 0.1,
      },
      {
        offset: new gmath.Vector3(2.0, -2.0, 2.0),
        angle: 50.0,
        scale: 1.3,
        rotation: 0.2,
      },
      {
        offset: new gmath.Vector3(-2.0, 2.0, 2.0),
        angle: 140.0,
        scale: 1.1,
        rotation: 0.3,
      },
      {
        offset: new gmath.Vector3(2.0, 2.0, 2.0),
        angle: 210.0,
        scale: 0.9,
        rotation: 0.4,
      },
    ];

    const entityUniformSize = (4 * 4 * 4) + (4 * 4);
    const numEntities = 1 + cubeDescs.length;
    this.entityUniformBuffer = this.device.createBuffer({
      size: numEntities * this.device.limits.minUniformBufferOffsetAlignment!,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.entities = [
      {
        mxWorld: gmath.Matrix4.identity(),
        rotationSpeed: 0,
        color: [1, 1, 1, 1],
        vertexBuffer: planeVertexBuffer,
        indexBuffer: planeIndexBuffer,
        indexFormat: "uint16",
        indexCount: planeIndexData.length,
        uniformOffset: 0,
      },
    ];

    for (let i = 0; i < cubeDescs.length; i++) {
      const cube = cubeDescs[i];
      this.entities.push({
        mxWorld: gmath.Matrix4.fromDecomposed({
          disp: cube.offset,
          rot: gmath.Quaternion.fromAxisAngle(
            cube.offset.normal(),
            new gmath.Deg(cube.angle),
          ),
          scale: cube.scale,
        }),
        rotationSpeed: cube.rotation,
        color: [0, 1, 0, 1],
        vertexBuffer: cubeVertexBuffer,
        indexBuffer: cubeIndexBuffer,
        indexFormat: "uint16",
        indexCount: cubeIndexData.length,
        uniformOffset: (i + 1) *
          this.device.limits.minUniformBufferOffsetAlignment!,
      });
    }

    const localBindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {
            hasDynamicOffset: true,
            minBindingSize: entityUniformSize,
          },
        },
      ],
    });
    this.entityBindGroup = this.device.createBindGroup({
      layout: localBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.entityUniformBuffer,
            size: entityUniformSize,
          },
        },
      ],
    });

    const shadowSampler = this.device.createSampler({
      label: "shadow",
      magFilter: "linear",
      minFilter: "linear",
      compare: "less-equal",
    });
    const shadowTexture = this.device.createTexture({
      size: shadowSize,
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.TEXTURE_BINDING,
    });
    const shadowView = shadowTexture.createView();
    const shadowTargetViews: GPUTextureView[] = [0, 1].map((i) => {
      return shadowTexture.createView({
        label: "shadow",
        dimension: "2d",
        baseArrayLayer: i,
        arrayLayerCount: 1,
      });
    });

    this.lights = [
      {
        pos: new gmath.Vector3(7.0, -5.0, 10.0),
        color: [0.5, 1, 0.5, 1],
        fov: 60,
        depth: [1, 20],
        targetView: shadowTargetViews[0],
      },
      {
        pos: new gmath.Vector3(-5.0, 7.0, 10.0),
        color: [1, 0.5, 0.5, 1],
        fov: 45,
        depth: [1, 20],
        targetView: shadowTargetViews[1],
      },
    ];

    const lightUniformSize = this.maxLights * LIGHT_SIZE;
    this.lightStorageBuffer = this.device.createBuffer({
      size: lightUniformSize,
      usage: (supportStorageResources
        ? GPUBufferUsage.STORAGE
        : GPUBufferUsage.UNIFORM) |
        GPUBufferUsage.COPY_SRC |
        GPUBufferUsage.COPY_DST,
    });

    const vertexBufferLayout: GPUVertexBufferLayout = {
      arrayStride: vertexSize,
      attributes: [
        {
          format: "sint8x4",
          offset: 0,
          shaderLocation: 0,
        },
        {
          format: "sint8x4",
          offset: 4,
          shaderLocation: 1,
        },
      ],
    };

    const shader = this.device.createShaderModule({
      code: Deno.readTextFileSync(new URL("./shader.wgsl", import.meta.url)),
    });

    const uniformSize = (4 * 4 * 4) + (4 * 4);
    const shadowBindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            minBindingSize: uniformSize,
          },
        },
      ],
    });
    const shadowPipelineLayout = this.device.createPipelineLayout({
      label: "shadow",
      bindGroupLayouts: [shadowBindGroupLayout, localBindGroupLayout],
    });
    const shadowUniformBuffer = this.device.createBuffer({
      size: uniformSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const shadowBindGroup = this.device.createBindGroup({
      layout: shadowBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: shadowUniformBuffer,
          },
        },
      ],
    });

    const shadowRenderPipeline = this.device.createRenderPipeline({
      label: "shadow",
      layout: shadowPipelineLayout,
      vertex: {
        module: shader,
        entryPoint: "vs_bake",
        buffers: [vertexBufferLayout],
      },
      primitive: {
        cullMode: "back",
        unclippedDepth: this.device.features.has("depth-clip-control"),
      },
      depthStencil: {
        format: "depth32float",
        depthWriteEnabled: true,
        depthCompare: "less-equal",
        depthBias: 2,
        depthBiasSlopeScale: 2,
        stencilReadMask: 0,
        stencilWriteMask: 0,
      },
    });

    this.shadowPass = {
      pipeline: shadowRenderPipeline,
      bindGroup: shadowBindGroup,
      uniformBuffer: shadowUniformBuffer,
    };

    const forwardBindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: {
            minBindingSize: uniformSize,
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: supportStorageResources ? "read-only-storage" : "uniform",
            minBindingSize: lightUniformSize,
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {
            sampleType: "depth",
            viewDimension: "2d-array",
          },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {
            type: "comparison",
          },
        },
      ],
    });
    const forwardPipelineLayout = this.device.createPipelineLayout({
      label: "main",
      bindGroupLayouts: [forwardBindGroupLayout, localBindGroupLayout],
    });

    const mxTotal = generateMatrix(
      this.dimensions.width / this.dimensions.height,
    );
    const buffer = new ArrayBuffer(mxTotal.byteLength + (4 * 4));
    const float32 = new Float32Array(buffer);
    float32.set(mxTotal);
    const uint32 = new Uint32Array(buffer);
    uint32.set([this.lights.length, 0, 0, 0], uint32.length - 4);

    const forwardUniformBuffer = createBufferInit(this.device, {
      label: "Uniform Buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      contents: buffer,
    });

    const forwardBindGroup = this.device.createBindGroup({
      layout: forwardBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: forwardUniformBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this.lightStorageBuffer,
          },
        },
        {
          binding: 2,
          resource: shadowView,
        },
        {
          binding: 3,
          resource: shadowSampler,
        },
      ],
    });

    const forwardRenderPipeline = this.device.createRenderPipeline({
      label: "main",
      layout: forwardPipelineLayout,
      vertex: {
        module: shader,
        entryPoint: "vs_main",
        buffers: [vertexBufferLayout],
      },
      fragment: {
        module: shader,
        entryPoint: supportStorageResources
          ? "fs_main"
          : "fs_main_without_storage",
        targets: [
          {
            format: "rgba8unorm-srgb",
          },
        ],
      },
      primitive: {
        cullMode: "back",
      },
      depthStencil: {
        format: "depth32float",
        depthWriteEnabled: true,
        depthCompare: "less",
        stencilReadMask: 0,
        stencilWriteMask: 0,
      },
    });

    this.forwardPass = {
      pipeline: forwardRenderPipeline,
      bindGroup: forwardBindGroup,
      uniformBuffer: forwardUniformBuffer,
    };

    this.depthTextureView = this.device.createTexture({
      size: this.dimensions,
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    }).createView();
  }

  render(encoder: GPUCommandEncoder, view: GPUTextureView) {
    for (const entity of this.entities) {
      if (entity.rotationSpeed != 0) {
        const rotation = gmath.Matrix4.fromAngleX(
          new gmath.Deg(entity.rotationSpeed),
        );
        entity.mxWorld = entity.mxWorld.mul(rotation);
      }
      const data = new Float32Array([
        ...entity.mxWorld.toFloat32Array().slice(),
        ...entity.color,
      ]);
      this.device.queue.writeBuffer(
        this.entityUniformBuffer,
        entity.uniformOffset,
        data,
      );
    }

    if (this.lightsAreDirty) {
      this.lightsAreDirty = false;
      for (let i = 0; i < this.lights.length; i++) {
        this.device.queue.writeBuffer(
          this.lightStorageBuffer,
          i * LIGHT_SIZE,
          lightToRaw(this.lights[i]),
        );
      }
    }

    encoder.pushDebugGroup("shadow passes");
    for (let i = 0; i < this.lights.length; i++) {
      encoder.pushDebugGroup(
        `shadow pass ${i} (light at position ${this.lights[i].pos})`,
      );

      encoder.copyBufferToBuffer(
        this.lightStorageBuffer,
        i * LIGHT_SIZE,
        this.shadowPass.uniformBuffer,
        0,
        64,
      );

      encoder.insertDebugMarker("render entities");

      const renderPass = encoder.beginRenderPass({
        colorAttachments: [],
        depthStencilAttachment: {
          view: this.lights[i].targetView,

          depthClearValue: 1,
          depthLoadOp: "clear",
          depthStoreOp: "store",

          stencilLoadOp: "load",
          stencilStoreOp: "store",
          stencilReadOnly: true,
        },
      });
      renderPass.setPipeline(this.shadowPass.pipeline);
      renderPass.setBindGroup(0, this.shadowPass.bindGroup);

      for (const entity of this.entities) {
        renderPass.setBindGroup(1, this.entityBindGroup, [
          entity.uniformOffset,
        ]);
        renderPass.setIndexBuffer(entity.indexBuffer, entity.indexFormat);
        renderPass.setVertexBuffer(0, entity.vertexBuffer);
        renderPass.drawIndexed(entity.indexCount, 1);
      }
      renderPass.end();
      encoder.popDebugGroup();
    }
    encoder.popDebugGroup();

    encoder.pushDebugGroup("forward rendering pass");
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: view,
          storeOp: "store",
          loadOp: "clear",
          clearValue: [0.1, 0.2, 0.3, 1],
        },
      ],
      depthStencilAttachment: {
        view: this.depthTextureView,
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "discard",
        stencilReadOnly: true,
      },
    });
    renderPass.setPipeline(this.forwardPass.pipeline);
    renderPass.setBindGroup(0, this.forwardPass.bindGroup);
    for (const entity of this.entities) {
      renderPass.setBindGroup(1, this.entityBindGroup, [entity.uniformOffset]);
      renderPass.setIndexBuffer(entity.indexBuffer, entity.indexFormat);
      renderPass.setVertexBuffer(0, entity.vertexBuffer);
      renderPass.drawIndexed(entity.indexCount, 1);
    }
    renderPass.end();
    encoder.popDebugGroup();
  }
}

const shadow = new Shadow(
  {
    maxLights: 10,
    dimensions: {
      width: 1600,
      height: 1200,
    },
  },
  await Shadow.getDevice({
    requiredFeatures: ["depth-clip-control"],
  }),
);
await shadow.renderPng();
