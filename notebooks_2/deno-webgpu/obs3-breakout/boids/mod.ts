import { Framework } from "./framework.ts";
import { createBufferInit, Dimensions } from "./utils.ts";

class Boids extends Framework {
  particleCount: number;
  particlesPerGroup: number;

  computePipeline!: GPUComputePipeline;
  particleBindGroups: GPUBindGroup[] = [];
  renderPipeline!: GPURenderPipeline;
  particleBuffers: GPUBuffer[] = [];
  verticesBuffer!: GPUBuffer;

  frameNum = 0;

  constructor(options: {
    particleCount: number;
    particlesPerGroup: number;
    dimensions: Dimensions;
  }, device: GPUDevice) {
    super(options.dimensions, device);

    this.particleCount = options.particleCount;
    this.particlesPerGroup = options.particlesPerGroup;
  }

  // deno-lint-ignore require-await
  async init() {
    const computeShader = this.device.createShaderModule({
      code: Deno.readTextFileSync(new URL("./compute.wgsl", import.meta.url)),
    });

    const drawShader = this.device.createShaderModule({
      code: Deno.readTextFileSync(new URL("./draw.wgsl", import.meta.url)),
    });

    const simParamData = new Float32Array([
      0.04, // deltaT
      0.1, // rule1Distance
      0.025, // rule2Distance
      0.025, // rule3Distance
      0.02, // rule1Scale
      0.05, // rule2Scale
      0.005, // rule3Scale
    ]);

    const simParamBuffer = createBufferInit(this.device, {
      label: "Simulation Parameter Buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      contents: simParamData.buffer,
    });

    const computeBindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            minBindingSize: simParamData.length * 4,
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "read-only-storage",
            minBindingSize: this.particleCount * 16,
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: "storage",
            minBindingSize: this.particleCount * 16,
          },
        },
      ],
    });
    const computePipelineLayout = this.device.createPipelineLayout({
      label: "compute",
      bindGroupLayouts: [computeBindGroupLayout],
    });
    const renderPipelineLayout = this.device.createPipelineLayout({
      label: "render",
      bindGroupLayouts: [],
    });
    this.renderPipeline = this.device.createRenderPipeline({
      layout: renderPipelineLayout,
      vertex: {
        module: drawShader,
        entryPoint: "main_vs",
        buffers: [
          {
            arrayStride: 4 * 4,
            stepMode: "instance",
            attributes: [
              {
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
              },
              {
                format: "float32x2",
                offset: 8,
                shaderLocation: 1,
              },
            ],
          },
          {
            arrayStride: 2 * 4,
            attributes: [
              {
                format: "float32x2",
                offset: 0,
                shaderLocation: 2,
              },
            ],
          },
        ],
      },
      fragment: {
        module: drawShader,
        entryPoint: "main_fs",
        targets: [
          {
            format: "rgba8unorm-srgb",
          },
        ],
      },
    });
    this.computePipeline = this.device.createComputePipeline({
      label: "Compute pipeline",
      layout: computePipelineLayout,
      compute: {
        module: computeShader,
        entryPoint: "main",
      },
    });
    const vertexBufferData = new Float32Array([
      -0.01,
      -0.02,
      0.01,
      -0.02,
      0.00,
      0.02,
    ]);
    this.verticesBuffer = createBufferInit(this.device, {
      label: "Vertex Buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      contents: vertexBufferData.buffer,
    });

    const initialParticleData = new Float32Array(4 * this.particleCount);
    for (let i = 0; i < initialParticleData.length; i += 4) {
      initialParticleData[i] = Math.random() * 2 - 1; // posx
      initialParticleData[i + 1] = Math.random() * 2 - 1; // posy
      initialParticleData[i + 2] = (Math.random() * 2 - 1) * 0.1; // velx
      initialParticleData[i + 3] = (Math.random() * 2 - 1) * 0.1; // vely
    }

    for (let i = 0; i < 2; i++) {
      this.particleBuffers.push(createBufferInit(this.device, {
        label: "Particle Buffer " + i,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE |
          GPUBufferUsage.COPY_DST,
        contents: initialParticleData.buffer,
      }));
    }

    for (let i = 0; i < 2; i++) {
      this.particleBindGroups.push(this.device.createBindGroup({
        layout: computeBindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: {
              buffer: simParamBuffer,
            },
          },
          {
            binding: 1,
            resource: {
              buffer: this.particleBuffers[i],
            },
          },
          {
            binding: 2,
            resource: {
              buffer: this.particleBuffers[(i + 1) % 2],
            },
          },
        ],
      }));
    }
  }

  render(encoder: GPUCommandEncoder, view: GPUTextureView) {
    encoder.pushDebugGroup("compute boid movement");
    const computePass = encoder.beginComputePass();
    computePass.setPipeline(this.computePipeline);
    computePass.setBindGroup(0, this.particleBindGroups[this.frameNum % 2]);
    computePass.dispatchWorkgroups(
      Math.ceil(this.particleCount / this.particlesPerGroup),
    );
    computePass.end();
    encoder.popDebugGroup();

    encoder.pushDebugGroup("render boids");
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: view,
          storeOp: "store",
          loadOp: "load",
        },
      ],
    });
    renderPass.setPipeline(this.renderPipeline);
    renderPass.setVertexBuffer(
      0,
      this.particleBuffers[(this.frameNum + 1) % 2],
    );
    renderPass.setVertexBuffer(1, this.verticesBuffer);
    renderPass.draw(3, this.particleCount);
    renderPass.end();
    encoder.popDebugGroup();

    this.frameNum += 1;
  }
}

// Export the Boids class


// Remove or comment out the following lines:

async function run_boids() {
  const boids = new Boids({
    particleCount: 1500,
    particlesPerGroup: 64,
    dimensions: {
      width: 1600,
      height: 1200,
    },
  }, await Boids.getDevice());

    await boids.renderPng("./public/boids.png");

    console.log('boids.png', "has been written")
}

export { run_boids };





//ML + GRAPHICS = creative AI  - with robotic art - show family (rakhi, misha, adel, farah, mom, dad, etc) oct 12
// 
// ML + WEBGPU = creative AI 
// ML + WEBGL = creative AI 
// ML + WEBASSEMBLY = creative AI 
// ML + PYTHON = creative AI 
// ML + JAVASCRIPT = creative AI 
// ML + DENO = creative AI 
// ML + RUST = creative AI 
// ML + C++ = creative AI 
