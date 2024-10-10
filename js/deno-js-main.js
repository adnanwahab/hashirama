// main.js
async function init() {
    // Check for WebGPU support
    if (!navigator.gpu) {
        console.error("WebGPU is not supported. Please use a compatible browser.");
        return;
    }

    // Get a GPU device
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    // Create a canvas and get its WebGPU context
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("webgpu");

    // Set the size of the canvas
    const presentationFormat = context.getPreferredFormat(adapter);
    context.configure({
        device: device,
        format: presentationFormat,
    });

    // Create a simple render pass
    const commandEncoder = device.createCommandEncoder();
    const renderPassDescriptor = {
        colorAttachments: [{
            view: undefined, // Assigned later
            loadValue: [0.0, 0.0, 0.0, 1.0], // Clear to black
            storeOp: 'store',
        }],
    };

    // Render loop
    function frame() {
        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.endPass();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    }

    // Start the render loop
    frame();
}

// Initialize the application
init();
