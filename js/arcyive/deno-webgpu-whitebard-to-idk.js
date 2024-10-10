// take darwing 


// segment _>  thing of internetst


//// -> make story -.>>>>


//////// story = frames that are "linked"


////     take drawing -> animate stick figure 


////    sho all possible animations -- draw stick figure -> stick figure walks into wall,bush, lake, airplane, etc 


// convert stick figure to boid -> zoom out = see other peoples "stories" -> learn all stories interegaetion

// everyone desgins next buidlign together ---> new additiosn to school ---


// see how each possiblities affects (whole) system --- )


/// the reason i didnt investigate bret's work more is bec -> its like burning bush you see it and yourre like AAAAA put the shoes on and  go back to sleep 

// main.js  for every link find all evolutoonary paths -> walk wones that were aifun 
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
