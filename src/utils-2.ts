// function makeDataTextureBindGroupDescriptor(stuff) {
//   let { gpuDevice, pipeline, data } = stuff;
//   const sampler = gpuDevice.createSampler({
//     magFilter: "linear",
//     minFilter: "linear",
//   });
//
//   let uniformsBuffer = updateUniforms(stuff);
//
//   const dataTexturesBindGroupLayoutDescriptor = {
//     entries: [
//       //GPUBindGroupLayoutEntry
//       firstEntry,
//       {
//         binding: 1,
//         visibility: GPUShaderStage.FRAGMENT,
//         type: "filtering",
//         resource: sampler,
//       },
//       {
//         binding: 2,
//         visibility: GPUShaderStage.FRAGMENT,
//         texture: {
//           type: "float",
//         },
//       },
//     ],
//   };
//   return {
//     dataTexturesBindGroupLayoutDescriptor,
//     sampler,
//   };
// }

async function makePipeline(stuff) {
  let data = stuff.data;
  const context = stuff.canvas.value || stuff.canvas.getContext("webgpu");
  const adapter = await navigator.gpu.requestAdapter();
  const gpuDevice = await adapter.requestDevice();
  stuff.gpuDevice = gpuDevice;

  const presentationFormat = context.getPreferredFormat(adapter);
  const presentationSize = [
    stuff.width * devicePixelRatio,
    stuff.height * devicePixelRatio,
  ];
  context.configure({
    device: gpuDevice,
    format: presentationFormat,
    size: presentationSize,
    //render attachment
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  stuff.context = context;
  let source = `
    let size = 3.0;
  fn main(uv: vec2<f32>) -> vec4<f32> {
    var base = vec4<f32>(cos(u.time), .5, sin(u.time), 1.);
    let dist = distance( uv, vec2<f32>(u.mouseX, u.mouseY));
    if (uv.x < .1 ) { base.y = .1; }
    if (uv.x > .2 ) { base.y = .5; }
    if (uv.x > .3 ) { base.x = .5; }
    return base;
  }

  [[stage(fragment)]]
  fn main_fragment(in: VertexOutput) -> [[location(0)]] vec4<f32> {
    return main(in.uv);
  }
  `;
  const userland_Uniforms = Object.keys(data)
    .map((name) => `${name}: f32;`)
    .join("\n");

  const shader = gpuDevice.createShaderModule({
    code: `
  [[block]] struct Uniforms {
    ${userland_Uniforms}
  };
  [[group(0), binding(0)]] var<uniform> u: Uniforms;
  [[group(0), binding(1)]] var mySampler: sampler;
  [[group(0), binding(2)]] var myTexture: texture_external;
  struct VertexInput {
    [[location(0)]] pos: vec2<f32>;
  };
  struct VertexOutput {
    [[builtin(position)]] pos: vec4<f32>;
    [[location(0)]] uv: vec2<f32>;
  };

  [[stage(vertex)]]
  fn main_vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    var pos: vec2<f32> = input.pos * 3.0 - 1.0;
    output.pos = vec4<f32>(pos, 0.0, 1.0);
    output.uv = input.pos;
    return output;
  }
  ${source}`,
  });
  const textureView = context.getCurrentTexture().createView();
  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: textureView,
        loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        storeOp: "store",
      },
    ],
  };

  const dataTexturesBindGroupLayoutDescriptor = {
    entries: [
      //GPUBindGroupLayoutEntry
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {
          type: "filtering",
        },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          type: "uint",
        },
      },
    ],
  };
  let values = Object.values(data);
  let uniformsArray = new Float32Array(values.length);
  uniformsArray.set(values, 0, values.length);
  let arr = uniformsArray;
  let usage = GPUBufferUsage.UNIFORM;
  let desc = {
    size: (arr.byteLength + 3) & ~3,
    usage,
    mappedAtCreation: true,
  };
  let buffer = gpuDevice.createBuffer(desc);
  const writeArray =
    arr instanceof Uint16Array
      ? new Uint16Array(buffer.getMappedRange())
      : new Float32Array(buffer.getMappedRange());
  writeArray.set(arr);
  buffer.unmap();
  stuff.renderPassDescriptor = renderPassDescriptor;
  const attribs = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
  stuff.attribsBuffer = buffer;
  stuff.gpuDevice = gpuDevice;
  //unroll update unforms
  //let uniformsBuffer = updateUniforms(stuff);
  //let values = Object.values(data);
  //let uniformsArray = new Float32Array(values.length);
  uniformsArray.set(values, 0, values.length);
  //let arr = uniformsArray;
  // //let usage = GPUBufferUsage.UNIFORM;
  // let desc = {
  //   size: (arr.byteLength + 3) & ~3,
  //   usage,
  //   mappedAtCreation: true,
  // };
  // let buffer = gpuDevice.createBuffer(desc);
  // const writeArray =
  //   arr instanceof Uint16Array
  //     ? new Uint16Array(buffer.getMappedRange())
  //     : new Float32Array(buffer.getMappedRange());
  // writeArray.set(arr);
  // buffer.unmap();
  return stuff.renderBundleEncoder || stuff.renderPipeline;
}

const webGPUTextureFromImageUrl = async function (gpuDevice, url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const imgBitmap = await createImageBitmap(blob);

  return webGPUTextureFromImageBitmapOrCanvas(gpuDevice, imgBitmap);
};

const recordRenderPass = async function (stuff, callback) {
  let {
    attribsBuffer,
    context,
    gpuDevice,
    pipeline,
    uniformsBuffer,
    renderPassDescriptor,
  } = stuff;

  const bindGroupLayout = gpuDevice.createBindGroupLayout({
    entries: [
      {
        //GPUBindGroupLayoutEntry
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,

        buffer: {
          type: "uniform",
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,

        sampler: {
          type: "filtering",
        },
      },

      {
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        externalTexture: {
          type: "float",
        },
      },
    ],
  });

  //use the neural nets for devotion to 1e6
  //resolve errors only and glue vars together ...accept
  const bindGroupLayoutDescriptor = {
    entries: [bindGroupLayout],
  };

  const pipelineLayoutDescriptor = { bindGroupLayouts: [bindGroupLayout] };

  let pipeLineLayout = gpuDevice.createPipelineLayout(pipelineLayoutDescriptor);

  let shader = makeShaderModule(gpuDevice, stuff.data);

  let pipelineDesc = {
    layout: pipeLineLayout,
    vertex: {
      module: shader,
      entryPoint: "main_vertex",
      buffers: [
        {
          arrayStride: Float32Array.BYTES_PER_ELEMENT * 2,
          attributes: [
            {
              offset: 0,
              shaderLocation: 0,
              format: "float32x2",
            },
          ],
        },
      ],
    },
    fragment: {
      module: shader,
      entryPoint: "main_fragment",
      targets: [{ format: "bgra8unorm" }],
    },
    primitives: {
      topology: "triangle-list",
    },
  };
  let renderPipeline = gpuDevice.createRenderPipeline(pipelineDesc);
  const commandEncoder = gpuDevice.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  renderPassDescriptor.colorAttachments[0].view = textureView;
  const renderPassEncoder = commandEncoder.beginRenderPass(
    renderPassDescriptor
  );
  renderPassEncoder.setPipeline(renderPipeline);
  //callback();
  // console.log(uniformsBuffer);
  // updateUniforms
  // updateUniforms
  if (!uniformsBuffer) uniformsBuffer = updateUniforms(stuff);
  if (!stuff.sampler)
    stuff.sampler = gpuDevice.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    });

  if (false && stuff.renderBundleEncoder) {
  } else {
    const bindGroup = gpuDevice.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        //  { binding: 0, resource: attribsBuffer },

        {
          binding: 0,
          resource: {
            buffer: uniformsBuffer,
          },
        },
        {
          binding: 1,
          resource: stuff.sampler,
        },
        {
          binding: 2,
          resource: gpuDevice.importExternalTexture({
            source: document.querySelector("video"),
          }),
        },
      ],
    });

    renderPassEncoder.setBindGroup(0, bindGroup);
    renderPassEncoder.setVertexBuffer(0, attribsBuffer);
    renderPassEncoder.draw(3 * 2, 1, 0, 0);
    renderPassEncoder.endPass();
  }

  gpuDevice.queue.submit([commandEncoder.finish()]); //async
};
function updateUniforms(stuff) {
  let {
    data,
    gpuDevice,
    uniformsBuffer,
    state,
    renderPassDescriptor,
    pipeline,
    attribsBuffer,
  } = stuff;
  console.log(stuff);
  let values = Object.values(data);
  let uniformsArray = new Float32Array(values.length);
  uniformsArray.set(values, 0, values.length);
  let arr = uniformsArray;
  let usage = GPUBufferUsage.UNIFORM;
  let desc = {
    size: (arr.byteLength + 3) & ~3,
    usage,
    mappedAtCreation: true,
  };
  let buffer = gpuDevice.createBuffer(desc);
  const writeArray =
    arr instanceof Uint16Array
      ? new Uint16Array(buffer.getMappedRange())
      : new Float32Array(buffer.getMappedRange());
  writeArray.set(arr);
  buffer.unmap();
  if (!uniformsBuffer) stuff.uniformsBuffer = buffer;
  return buffer;
}

const createBuffer = (gpuDevice, arr, usage) => {
  let desc = {
    size: (arr.byteLength + 3) & ~3,
    usage,
    mappedAtCreation: true,
  };
  let buffer = gpuDevice.createBuffer(desc);
  const writeArray =
    arr instanceof Uint16Array
      ? new Uint16Array(buffer.getMappedRange())
      : new Float32Array(buffer.getMappedRange());
  writeArray.set(arr);
  buffer.unmap();
  return buffer;
};

function makeShaderModule(gpuDevice, data) {
  let source = `
    let size = 3.0;
  fn main(uv: vec2<f32>) -> vec4<f32> {
    var base = vec4<f32>(cos(u.time), .5, sin(u.time), 1.);
    let dist = distance( uv, vec2<f32>(u.mouseX, u.mouseY));
    if (uv.x < .1 ) { base.y = .1; }
    if (uv.x > .2 ) { base.y = .5; }
    if (uv.x > .3 ) { base.x = .5; }
    //if (uv.x > .4 ) { base.z = .7; }
    //if (uv.x > .5 ) { base.z = .9; }
    //if (dist < .1) { base.x = .1; }
    return base;
  }

  [[stage(fragment)]]
  fn main_fragment(in: VertexOutput) -> [[location(0)]] vec4<f32> {
    return main(in.uv);
  }
  `;
  const userland_Uniforms = Object.keys(data)
    .map((name) => `${name}: f32;`)
    .join("\n");

  const shader = gpuDevice.createShaderModule({
    code: `
  [[block]] struct Uniforms {
    ${userland_Uniforms}
  };
  [[group(0), binding(0)]] var<uniform> u: Uniforms;
  [[group(0), binding(1)]] var mySampler: sampler;
  [[group(0), binding(2)]] var myTexture: texture_external;
  struct VertexInput {
    [[location(0)]] pos: vec2<f32>;
  };
  struct VertexOutput {
    [[builtin(position)]] pos: vec4<f32>;
    [[location(0)]] uv: vec2<f32>;
  };

  [[stage(vertex)]]
  fn main_vertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    var pos: vec2<f32> = input.pos * 3.0 - 1.0;
    output.pos = vec4<f32>(pos, 0.0, 1.0);
    output.uv = input.pos;
    return output;
  }
  ${source}`,
  });
  return shader;
}
//generic functions above
async function init(options) {
  const stuff = {
    ...options,
    canvas: options.canvas,
    state: {},
  };
  const pipeline = await makePipeline(stuff);
  // let renderBundleEncoder = pipeline.createRenderBundleEncoder({
  //   colorFormats: ["rgba8unorm"],
  // });
  // recordRenderPass(stuff, () => {
  //   // encoder.setBindGroup(0, bindGroup, dynamicOffsets);
  //   // encoder.finish();
  // });
  function draw(state) {
    // let uniformsBuffer = updateUniforms(stuff);
    // stuff.uniformsBuffer = uniformsBuffer;

    recordRenderPass(stuff).finally(() => {});
    return state;
  }

  return { draw, canvas: options.canvas };
}

export default { init };