import { copyToBuffer, createPng, Dimensions } from "../utils.ts";
import { createCapture } from "std/webgpu";

const dimensions: Dimensions = {
  width: 100,
  height: 200,
};

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

if (!device) {
  console.error("no suitable adapter found");
  Deno.exit(0);
}

const { texture, outputBuffer } = createCapture(
  device,
  dimensions.width,
  dimensions.height,
);

const encoder = device.createCommandEncoder();
encoder.beginRenderPass({
  colorAttachments: [
    {
      view: texture.createView(),
      storeOp: "store",
      loadOp: "clear",
      clearValue: [1, 0, 0, 1],
    },
  ],
}).end();

copyToBuffer(encoder, texture, outputBuffer, dimensions);

device.queue.submit([encoder.finish()]);

await createPng(outputBuffer, dimensions);
