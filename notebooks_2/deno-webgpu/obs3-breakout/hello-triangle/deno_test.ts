import { copyToBuffer, createPng, Dimensions } from "../utils.ts";
import { createCapture } from "std/webgpu";
import { serveDir, serveFile } from "jsr:@std/http/file-server";

const dimensions: Dimensions = {
    width: 200,
    height: 200,
};

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

if (!device) {
    console.error("no suitable adapter found");
    Deno.exit(0);
}

const shaderCode = `
@vertex
fn vs_main(@builtin(vertex_index) in_vertex_index: u32) -> @builtin(position) vec4<f32> {
    let x = f32(i32(in_vertex_index) - 1);
    let y = f32(i32(in_vertex_index & 1u) * 2 - 1);
    return vec4<f32>(x, y, 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}
`;

const shaderModule = device.createShaderModule({
    code: shaderCode,
});

const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [],
});

const renderPipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
        module: shaderModule,
        entryPoint: "vs_main",
    },
    fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [
            {
                format: "rgba8unorm-srgb",
            },
        ],
    },
});

const { texture, outputBuffer } = createCapture(
    device,
    dimensions.width,
    dimensions.height,
);

const encoder = device.createCommandEncoder();
const renderPass = encoder.beginRenderPass({
    colorAttachments: [
        {
            view: texture.createView(),
            storeOp: "store",
            loadOp: "clear",
            clearValue: [0, 1, 0, 1],
        },
    ],
});
renderPass.setPipeline(renderPipeline);
renderPass.draw(3, 1);
renderPass.end();

copyToBuffer(encoder, texture, outputBuffer, dimensions);

device.queue.submit([encoder.finish()]);

await createPng(outputBuffer, dimensions);

async function readImageAndConvertToBase64(filepath) {
    try {
        // Deno 2 simplifies file reading with Deno.readFile
        const fileData = await Deno.readFile(filepath);

        // Convert the Uint8Array to a Base64 string
        const base64String = btoa(new TextDecoder("latin1").decode(fileData));

        return base64String;
    } catch (error) {
        console.error("Error reading the file:", error);
        return null;
    }
}

// Usage
//const filepath = "./output.png";
// const file_path = '/Users/shelbernstein/hashirama/services/deno-webgpu/hello-triangle/'

// Deno.serve(
//   { port: 3000, hostname: "127.0.0.1" },

// (req: Request) => {
//   const pathname = new URL(req.url).pathname;

//   if (pathname === "/output.png") {
//     return serveFile(req, 'output.png');
//   }

//   if (pathname.startsWith("/file_path")) {
//     return serveDir(req, {
//       fsRoot: file_path,
//       urlRoot: "file_path",
//     });
//   }

//   return new Response("404: Not Found", {
//     status: 404,
//   });
// });
console.log("noop");
