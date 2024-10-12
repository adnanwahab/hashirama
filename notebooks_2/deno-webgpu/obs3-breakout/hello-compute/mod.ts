import { createBufferInit } from "../utils.ts";

const OVERFLOW = 0xffffffff;

// Get some numbers from the command line, or use the default 1, 4, 3, 295.
let numbers: Uint32Array;
if (Deno.args.length > 0) {
  numbers = new Uint32Array(Deno.args.map((a) => parseInt(a)));
} else {
  numbers = new Uint32Array([1, 4, 3, 295]);
}

const adapter = await navigator.gpu.requestAdapter();
const device = await adapter?.requestDevice();

if (!device) {
  console.error("no suitable adapter found");
  Deno.exit(0);
}

const shaderCode = `
@group(0)
@binding(0)
var<storage, read_write> v_indices: array<u32>; // this is used as both input and output for convenience

// The Collatz Conjecture states that for any integer n:
// If n is even, n = n/2
// If n is odd, n = 3n+1
// And repeat this process for each new n, you will always eventually reach 1.
// Though the conjecture has not been proven, no counterexample has ever been found.
// This function returns how many times this recurrence needs to be applied to reach 1.
fn collatz_iterations(n_base: u32) -> u32{
    var n: u32 = n_base;
    var i: u32 = 0u;
    loop {
        if (n <= 1u) {
            break;
        }
        if (n % 2u == 0u) {
            n = n / 2u;
        }
        else {
            // Overflow? (i.e. 3*n + 1 > 0xffffffffu?)
            if (n >= 1431655765u) {   // 0x55555555u
                return 4294967295u;   // 0xffffffffu
            }

            n = 3u * n + 1u;
        }
        i = i + 1u;
    }
    return i;
}

@compute
@workgroup_size(1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    v_indices[global_id.x] = collatz_iterations(v_indices[global_id.x]);
}
`;

const shaderModule = device.createShaderModule({
  code: shaderCode,
});

const stagingBuffer = device.createBuffer({
  size: numbers.byteLength,
  usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
});

const storageBuffer = createBufferInit(device, {
  label: "Storage Buffer",
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST |
    GPUBufferUsage.COPY_SRC,
  contents: numbers.buffer,
});

const computePipeline = device.createComputePipeline({
  layout: "auto",
  compute: {
    module: shaderModule,
    entryPoint: "main",
  },
});

const bindGroupLayout = computePipeline.getBindGroupLayout(0);
const bindGroup = device.createBindGroup({
  layout: bindGroupLayout,
  entries: [
    {
      binding: 0,
      resource: {
        buffer: storageBuffer,
      },
    },
  ],
});

const encoder = device.createCommandEncoder();

const computePass = encoder.beginComputePass();
computePass.setPipeline(computePipeline);
computePass.setBindGroup(0, bindGroup);
computePass.insertDebugMarker("compute collatz iterations");
computePass.dispatchWorkgroups(numbers.length);
computePass.end();

encoder.copyBufferToBuffer(
  storageBuffer,
  0,
  stagingBuffer,
  0,
  numbers.byteLength,
);

device.queue.submit([encoder.finish()]);

await stagingBuffer.mapAsync(1);
const arrayBufferData = stagingBuffer.getMappedRange();
const uintData = new Uint32Array(arrayBufferData);
const checkedData = Array.from(uintData).map((n) => {
  if (n === OVERFLOW) {
    return "OVERFLOW";
  } else {
    return n.toString();
  }
});
console.log(checkedData);
stagingBuffer.unmap();
