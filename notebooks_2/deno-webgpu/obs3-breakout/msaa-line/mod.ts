import { Framework } from "../framework.ts";
import { createBufferInit, Dimensions } from "../utils.ts";

class MsaaLine extends Framework {
  sampleCount: number;
  vertexCount: number;

  bundle!: GPURenderBundle;
  multisampledBuffer!: GPUTextureView;

  constructor(options: {
    enableMsaa: boolean;
    lineCount: number;
    dimensions: Dimensions;
  }, device: GPUDevice) {
    super(options.dimensions, device);

    this.sampleCount = options.enableMsaa ? 4 : 1;
    this.vertexCount = options.lineCount;
  }

  createBundle(
    shader: GPUShaderModule,
    pipelineLayout: GPUPipelineLayout,
    vertexBuffer: GPUBuffer,
  ): GPURenderBundle {
    const renderPipeline = this.device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: shader,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 24,
            attributes: [
              {
                format: "float32x2",
                offset: 0,
                shaderLocation: 0,
              },
              {
                format: "float32x4",
                offset: 8,
                shaderLocation: 1,
              },
            ],
          },
        ],
      },
      fragment: {
        module: shader,
        entryPoint: "fs_main",
        targets: [
          {
            format: "rgba8unorm-srgb",
          },
        ],
      },
      primitive: {
        topology: "line-list",
      },
      multisample: {
        count: this.sampleCount,
      },
    });

    const encoder = this.device.createRenderBundleEncoder({
      colorFormats: [
        "rgba8unorm-srgb",
      ],
      sampleCount: this.sampleCount,
    });
    encoder.setPipeline(renderPipeline);
    encoder.setVertexBuffer(0, vertexBuffer);
    encoder.draw(this.vertexCount * 2, 1);
    return encoder.finish({
      label: "main",
    });
  }

  // deno-lint-ignore require-await
  async init() {
    const shader = this.device.createShaderModule({
      code: Deno.readTextFileSync(new URL("./shader.wgsl", import.meta.url)),
    });

    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [],
    });

    this.multisampledBuffer = this.device.createTexture({
      size: this.dimensions,
      sampleCount: this.sampleCount,
      format: "rgba8unorm-srgb",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    }).createView();

    const vertexSizePerIter = 6 * 2;
    const vertexData = new Float32Array(this.vertexCount * vertexSizePerIter);
    for (let i = 0; i < vertexData.length; i += vertexSizePerIter) {
      const percent = (i / vertexSizePerIter) / this.vertexCount;
      const sin = Math.sin(percent * 2 * Math.PI);
      const cos = Math.cos(percent * 2 * Math.PI);

      vertexData[i] = 0; // x
      vertexData[i + 1] = 0; // y
      vertexData[i + 2] = 1; // r
      vertexData[i + 3] = -sin; // g
      vertexData[i + 4] = cos; // b
      vertexData[i + 5] = 1; // a

      vertexData[i + 6] = cos; // x
      vertexData[i + 7] = sin; // y
      vertexData[i + 8] = sin; // r
      vertexData[i + 9] = -cos; // g
      vertexData[i + 10] = 1; // b
      vertexData[i + 11] = 1; // a
    }

    const vertexBuffer = createBufferInit(this.device, {
      label: "Vertex Buffer",
      usage: GPUBufferUsage.VERTEX,
      contents: vertexData.buffer,
    });

    this.bundle = this.createBundle(shader, pipelineLayout, vertexBuffer);
  }

  render(encoder: GPUCommandEncoder, view: GPUTextureView) {
    const attachment: GPURenderPassColorAttachment = this.sampleCount == 1
      ? {
        view: view,
        storeOp: "store",
        loadOp: "clear",
        clearValue: [0, 0, 0, 1],
      }
      : {
        view: this.multisampledBuffer,
        resolveTarget: view,
        storeOp: "discard",
        loadOp: "clear",
        clearValue: [0, 0, 0, 1],
      };
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [attachment],
    });
    renderPass.executeBundles([this.bundle]);
    renderPass.end();
  }
}

const msaaLine = new MsaaLine({
  enableMsaa: true,
  lineCount: 50,
  dimensions: {
    width: 1600,
    height: 1200,
  },
}, await MsaaLine.getDevice());
await msaaLine.renderPng();
