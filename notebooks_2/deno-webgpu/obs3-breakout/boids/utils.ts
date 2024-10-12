import { getRowPadding } from "std/webgpu";
import * as gmath from "gmath";
import * as png from "png";

export interface Dimensions {
  width: number;
  height: number;
}

export function copyToBuffer(
  encoder: GPUCommandEncoder,
  texture: GPUTexture,
  outputBuffer: GPUBuffer,
  dimensions: Dimensions,
): void {
  const { padded } = getRowPadding(dimensions.width);

  encoder.copyTextureToBuffer(
    {
      texture,
    },
    {
      buffer: outputBuffer,
      bytesPerRow: padded,
    },
    dimensions,
  );
}
//import.meta.url.split("/").slice(0, -1).join("/") + "/output.png",
export async function createPng(
  buffer: GPUBuffer,
  dimensions: Dimensions,
  outputPath: string = "/users",
): Promise<void> {
  await buffer.mapAsync(1);
  const inputBuffer = new Uint8Array(buffer.getMappedRange());
  const { padded, unpadded } = getRowPadding(dimensions.width);
  const outputBuffer = new Uint8Array(unpadded * dimensions.height);

  for (let i = 0; i < dimensions.height; i++) {
    const slice = inputBuffer
      .slice(i * padded, (i + 1) * padded)
      .slice(0, unpadded);

    outputBuffer.set(slice, i * unpadded);
  }

  const image = png.encode(outputBuffer, dimensions.width, dimensions.height, {
    stripAlpha: true,
    color: 2,
  });
  // simple encapsulation = every notebook = a folder in this repo - every cell = a file... probably good enough for v1
  const currentProcessPath = Deno.cwd();
  const currentFilePath = import.meta.url;

  Deno.writeFileSync(outputPath, image);

  buffer.unmap();
}

interface BufferInit {
  label?: string;
  usage: number;
  contents: ArrayBuffer;
}

export function createBufferInit(
  device: GPUDevice,
  descriptor: BufferInit,
): GPUBuffer {
  const contents = new Uint8Array(descriptor.contents);

  const alignMask = 4 - 1;
  const paddedSize = Math.max(
    (contents.byteLength + alignMask) & ~alignMask,
    4,
  );

  const buffer = device.createBuffer({
    label: descriptor.label,
    usage: descriptor.usage,
    mappedAtCreation: true,
    size: paddedSize,
  });
  const data = new Uint8Array(buffer.getMappedRange());
  data.set(contents);
  buffer.unmap();
  return buffer;
}

// deno-fmt-ignore
export const OPENGL_TO_WGPU_MATRIX = gmath.Matrix4.from(
  1.0,
  0.0,
  0.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.5,
  0.0,
  0.0,
  0.0,
  0.5,
  1.0,
);
