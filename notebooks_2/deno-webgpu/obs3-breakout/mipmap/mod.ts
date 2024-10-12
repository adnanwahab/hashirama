import { Framework } from "../framework.ts";
import * as gmath from "gmath";
import {
  createBufferInit,
  Dimensions,
  OPENGL_TO_WGPU_MATRIX,
} from "../utils.ts";

function createTexels(size: number, cx: number, cy: number): Uint8Array {
  const texels = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    let x = 4 * (i % size) / (size - 1) - 2;
    let y = 2 * Math.floor(i / size) / (size - 1) - 1;
    let count = 0;
    while (count < 0xFF && x * x + y * y < 4) {
      const oldX = x;
      x = x * x - y * y + cx;
      y = 2.0 * oldX * y + cy;
      count += 1;
    }
    texels.set(
      [
        0xFF - ((count * 2) & ~(~0 << 8)),
        0xFF - ((count * 5) & ~(~0 << 8)),
        0xFF - ((count * 13) & ~(~0 << 8)),
        255,
      ],
      i * 4,
    );
  }
  return texels;
}

function generateMatrix(aspectRatio: number): Float32Array {
  const mxProjection = new gmath.PerspectiveFov(
    new gmath.Deg(45),
    aspectRatio,
    1,
    1000,
  ).toPerspective().toMatrix4();
  const mxView = gmath.Matrix4.lookAtRh(
    new gmath.Vector3(0, 0, 10),
    new gmath.Vector3(0, 50, 0),
    gmath.Vector3.forward(),
  );
  return OPENGL_TO_WGPU_MATRIX.mul(mxProjection.mul(mxView)).toFloat32Array();
}

class Mipmap extends Framework {
  mipLevelCount: number;

  drawPipeline!: GPURenderPipeline;
  bindGroup!: GPUBindGroup;

  constructor(options: {
    mipLevelCount: number;
    dimensions: Dimensions;
  }, device: GPUDevice) {
    super(options.dimensions, device);

    this.mipLevelCount = options.mipLevelCount;
  }

  generateMipmaps(encoder: GPUCommandEncoder, texture: GPUTexture) {
    const shader = this.device.createShaderModule({
      code: Deno.readTextFileSync(new URL("blit.wgsl", import.meta.url)),
    });
    const pipeline = this.device.createRenderPipeline({
      layout: "auto",
      label: "blit",
      vertex: {
        module: shader,
        entryPoint: "vs_main",
      },
      fragment: {
        module: shader,
        entryPoint: "fs_main",
        targets: [{
          format: "rgba8unorm-srgb",
        }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
    const bindGroupLayout = pipeline.getBindGroupLayout(0);
    const sampler = this.device.createSampler({
      label: "mip",
      magFilter: "linear",
      minFilter: "linear",
    });
    const views = [];
    for (let i = 0; i < this.mipLevelCount; i++) {
      views.push(texture.createView({
        label: "mip",
        baseMipLevel: i,
        mipLevelCount: 1,
      }));
    }

    for (let i = 1; i < this.mipLevelCount; i++) {
      const bindGroup = this.device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          {
            binding: 0,
            resource: views[i - 1],
          },
          {
            binding: 1,
            resource: sampler,
          },
        ],
      });

      const renderPass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: views[i],
            storeOp: "store",
            loadOp: "clear",
            clearValue: [1, 1, 1, 1],
          },
        ],
      });

      renderPass.setPipeline(pipeline);
      renderPass.setBindGroup(0, bindGroup);
      renderPass.draw(3, 1);
      renderPass.end();
    }
  }

  // deno-lint-ignore require-await
  async init() {
    const initEncoder = this.device.createCommandEncoder();

    const size = 1 << (this.mipLevelCount - 1);
    const texels = createTexels(size, -0.8, 0.156);
    const textureExtent = {
      width: size,
      height: size,
    };
    const texture = this.device.createTexture({
      size: textureExtent,
      mipLevelCount: this.mipLevelCount,
      format: "rgba8unorm-srgb",
      usage: GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.RENDER_ATTACHMENT |
        GPUTextureUsage.COPY_DST,
    });
    const textureView = texture.createView();

    const tempBuffer = createBufferInit(this.device, {
      label: "Temporary Buffer",
      usage: GPUBufferUsage.COPY_SRC,
      contents: texels.buffer,
    });
    initEncoder.copyBufferToTexture(
      {
        buffer: tempBuffer,
        bytesPerRow: 4 * size,
      },
      {
        texture: texture,
      },
      textureExtent,
    );

    const sampler = this.device.createSampler({
      addressModeU: "repeat",
      addressModeV: "repeat",
      addressModeW: "repeat",
      magFilter: "linear",
      minFilter: "linear",
      mipmapFilter: "linear",
    });

    const uniformBuffer = createBufferInit(this.device, {
      label: "Uniform Buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      contents:
        generateMatrix(this.dimensions.width / this.dimensions.height).buffer,
    });

    const shader = this.device.createShaderModule({
      code: Deno.readTextFileSync(new URL("./draw.wgsl", import.meta.url)),
    });

    this.drawPipeline = this.device.createRenderPipeline({
      layout: "auto",
      label: "draw",
      vertex: {
        module: shader,
        entryPoint: "vs_main",
        buffers: [],
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
        topology: "triangle-strip",
        cullMode: "back",
      },
    });

    const bindGroupLayout = this.drawPipeline.getBindGroupLayout(0);
    this.bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
          },
        },
        {
          binding: 1,
          resource: textureView,
        },
        {
          binding: 2,
          resource: sampler,
        },
      ],
    });

    this.generateMipmaps(initEncoder, texture);

    this.device.queue.submit([initEncoder.finish()]);
  }

  render(encoder: GPUCommandEncoder, view: GPUTextureView) {
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: view,
          storeOp: "store",
          loadOp: "clear",
          clearValue: [0.1, 0.2, 0.3, 1],
        },
      ],
    });
    renderPass.setPipeline(this.drawPipeline);
    renderPass.setBindGroup(0, this.bindGroup);
    renderPass.draw(4, 1);
    renderPass.end();
  }
}

const mipmap = new Mipmap({
  mipLevelCount: 10,
  dimensions: {
    width: 1600,
    height: 1200,
  },
}, await Mipmap.getDevice());
await mipmap.renderPng();
