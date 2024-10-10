import { serve } from "bun";
import ollama from 'ollama'
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { readFile, writeFile } from 'fs/promises';
// deliver obs w/ cursor (script cursor as a "test" + do it with 1tb of embeeddings);;;;;;;
//2pm 

async function callOpenAI(prompt) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
}

async function callAnthropic(prompt) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });
  return response.content[0].text;
}

const readFileAsString = async (filePath) => {
  try {
    const data = await readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

// show git difif 



const call_llama = async (user_instructions) => {

  // const _json = {
  //   success: true,
  //   edited_content: fileContent + 'edited',
  //   fileContent: fileContent,
  // }
  // return _json

  

  // let responseContent = '';
  // for await (const part of responseStream) {
  //   console.log("thinking...", part.message.content.length);
  //   responseContent += part.message.content;
  // }
  // const remoteOllama = new Ollama({
  //   host: 'http://adnan@gpu:11434', // Replace with the actual IP or hostname and port
  // });
  
  let responseContent = ''
  const message = { role: 'user', content: user_instructions }
const response = await ollama.chat({ model: 'llama3.2', messages: [message], stream: true })
for await (const part of response) {
  //process.stdout.write(part.message.content)
  //console.log(part.message.content.length)
  responseContent += part.message.content
}

  //console.log(response.message.content, 'response.message.content')
  return responseContent
}
// import { WebhookReceiver } from "livekit-server-sdk";

// import { watch } from "fs";

// import dotenv from "dotenv";

// import { execLiveKit } from "./livekit-bun";

//import { Octokit } from "@octokit/fetchc";

//deno webgpu zed plugin - friday

// Optionally, you can add a check to ensure required variables are set

// Function to fetch secrets from GitHub

// Fetch secrets before checking for required env vars

// Install required packages
//Bun.spawn(["bun", "add", "livekit-server-sdk", "livekit-client"]);

// File watcher setup
// const watcher = watch(__filename, (eventType, filename) => {
//   if (eventType === "change") {
//     console.log(`File ${filename} has been changed. Restarting server...`);
//     process.exit(0); // Exit the process, assuming it's being managed by a process manager
//   }
// });
import { AccessToken } from "livekit-server-sdk";

// if this room doesn't exist, it'll be automatically created when the first
// client joins
// const roomName = "name-of-room";
// // identifier to be used for participant.
// // it's available as LocalParticipant.identity with livekit-client SDK
// const participantName = `{Math.random()}`;
// const api_key = process.env.LIVEKIT_API_KEY;
// const secret_key = process.env.LIVEKIT_API_SECRET;

// const at = new AccessToken(api_key, secret_key, {
//   identity: participantName,
// });
// at.addGrant({ roomJoin: true, room: roomName });

// const token = await at.toJwt();
//7999 - actual main
//8000 - air main
//8001 - llama bun
//8002 - cgi bun


const handlers = [
  file_rewriter,
  replay_analyzer,
  paper_party,
  observable_cursor,
  is_this_okay,
]
function observable_cursor() {
  // observable edit left - panel
  // deno webgpu right panel
  return new Response(JSON.stringify({}));
}


function replay_analyzer() {
  // video left panel 
  // svg annotations right panel ---

  const html = `
    <div class="container">
    <!-- Left Panel for YouTube -->
    <div class="panel">
        <input class="replay" type="text" placeholder="Enter YouTube URL" style="width: 100%;">
        <button style="margin-top: 10px;" onclick="loadVideo()">Load Video</button>
        <iframe class="iframe" id="youtubeIframe"></iframe>
    </div>

    <!-- Right Panel for SVG -->
    <div class="panel">
        <svg class="svg"></svg>
    </div>
</div>
`

const js = `
    function loadVideo() {
        const input = document.querySelector('input');
        const iframe = document.getElementById('youtubeIframe');
        const url = input.value;
        const videoId = url.split('v=')[1];
        iframe.src = 'https://www.youtube.com/embed/'+videoId
    }
        console.log('input', 'y')
    setTimeout(() => {
      console.log('adding event listener',document.querySelector('.replay'));
      document.querySelector('.replay').addEventListener('change', loadVideo)
    }, 1000)
`

  return new Response(JSON.stringify({
    type: 'both',
    js: js,
    html: html
  }));
}

function paper_party() {
  // pdf left panel
  // middle panel  ----- intermediate rperesnenatiaon
  // right panel ----- output
  //4th panel <render webrtc of agent>
  const html = `
  <div class="container">
  <!-- PDF Left Panel -->
  <div class="panel left-panel">
    <h2>PDF Viewer</h2>
    <!-- Placeholder for PDF content -->
    <div class="pdf-viewer">pdf go here</div>
  </div>

  <!-- Middle Panel for Intermediate Representation -->
  <div class="panel middle-panel">
    <h2>Intermediate Representation</h2>
    <!-- Placeholder for intermediate content -->
    <div class="content">
      <!-- Content goes here -->
    </div>
  </div>

  <!-- Right Panel for Output -->
  <div class="panel right-panel">
    <h2>Output</h2>
    <!-- Placeholder for output content -->
    <div class="content">
      <!-- Content goes here -->
    </div>
  </div>

  <!-- 4th Panel for WebRTC Agent -->
  <div class="panel webrtc-panel">
    <h2>WebRTC Agent</h2>
    <!-- Placeholder for WebRTC content -->
    <video id="webrtcVideo" autoplay></video>
  </div>
</div>
`


  return new Response(JSON.stringify({
    type: 'both',
    html: html,
    js: ''
  }));
}

function is_this_okay(req) {
  //select person career profile 
//  -------------------
// right panel = output over time 
  return new Response(JSON.stringify({}));
}
async function file_rewriter(req) {
  console.log('this is the file rewriter')
  // const file_path = new URL(req.url).searchParams.get("file_path");
  // const prompt = new URL(req.url).searchParams.get("prompt");
  // const test = new URL(req.url).searchParams.get("test");
  const file_path = "/Users/shelbernstein/hashirama/js/llama-backend.js"
  const prompt = "add a new function to get the location of the rewind.ai website and the datafiles, specifically the video and anything that might be useful  to the top of the file "
  const edited_content = await  call_llama(prompt)
  const fileContent = await Bun.file(file_path).text();
  const html = `
  <div class="bun-output">
  <div style="background-color: blue; color: white; padding: 10px; margin: 5px 0;">
    <strong>${edited_content}:</strong> blalbalhal
  </div>
  <div style="background-color: green; color: white; padding: 10px; margin: 5px 0;">
    <strong>${fileContent}:</strong> blalbalhal
  </div>
  `
  const js = `

 // Declare the chart dimensions and margins.
 const width = 640;
 const height = 400;
 const marginTop = 20;
 const marginRight = 20;
 const marginBottom = 30;
 const marginLeft = 40;
 
 // Declare the x (horizontal position) scale.
 const x = d3.scaleUtc()
     .domain([new Date("2023-01-01"), new Date("2024-01-01")])
     .range([marginLeft, width - marginRight]);
 
 // Declare the y (vertical position) scale.
 const y = d3.scaleLinear()
     .domain([0, 100])
     .range([height - marginBottom, marginTop]);
 
 // Create the SVG container.
 const svg = observable_output.append("svg")
     .attr("width", width)
     .attr("height", height);
 
 // Add the x-axis.
 svg.append("g")
     //.attr("transform", 'translate(0,'+height - marginBottom+')')
     .call(d3.axisBottom(x));
 
 // Add the y-axis.
 svg.append("g")
     .attr("transform", 'translate('+marginLeft+',0)')
     .call(d3.axisLeft(y));
 
 
 function render_possibilties () {
   
   const width = 928;
   const marginTop = 10;
   const marginRight = 10;
   const marginBottom = 10;
   const marginLeft = 40;
 
   // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
   // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
   // “bottom”, in the data domain. The width of a column is based on the tree’s height.
   const root = d3.hierarchy(data);
   const dx = 10;
   const dy = (width - marginRight - marginLeft) / (1 + root.height);
 
   // Define the tree layout and the shape for links.
   const tree = d3.tree().nodeSize([dx, dy]);
   const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
 
   // Create the SVG container, a layer for the links and a layer for the nodes.
   const svg = d3.create("svg")
       .attr("width", width)
       .attr("height", dx)
       .attr("viewBox", [-marginLeft, -marginTop, width, dx])
       .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");
 
   const gLink = svg.append("g")
       .attr("fill", "none")
       .attr("stroke", "#555")
       .attr("stroke-opacity", 0.4)
       .attr("stroke-width", 1.5);
 
   const gNode = svg.append("g")
       .attr("cursor", "pointer")
       .attr("pointer-events", "all");
 
   function update(event, source) {
     const duration = True ? 2500 : 250; // hold the alt key to slow down the transition
     const nodes = root.descendants().reverse();
     const links = root.links();
 
     // Compute the new tree layout.
     tree(root);
 
     let left = root;
     let right = root;
     root.eachBefore(node => {
       if (node.x < left.x) left = node;
       if (node.x > right.x) right = node;
     });
 
     const height = right.x - left.x + marginTop + marginBottom;
 
     const transition = svg.transition()
         .duration(duration)
         .attr("height", height)
         .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])
         .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));
 
     // Update the nodes…
     const node = gNode.selectAll("g")
       .data(nodes, d => d.id);
 
     // Enter any new nodes at the parent's previous position.
     const nodeEnter = node.enter().append("g")
         .attr("transform", d => 'translate('+source.y0+','+source.x0+')')
         .attr("fill-opacity", 0)
         .attr("stroke-opacity", 0)
         .on("click", (event, d) => {
           d.children = d.children ? null : d._children;
           update(event, d);
         });
 
     nodeEnter.append("circle")
         .attr("r", 2.5)
         .attr("fill", d => d._children ? "#555" : "#999")
         .attr("stroke-width", 10);
 
     nodeEnter.append("text")
         .attr("dy", "0.31em")
         .attr("x", d => d._children ? -6 : 6)
         .attr("text-anchor", d => d._children ? "end" : "start")
         .text(d => d.data.name)
         .attr("stroke-linejoin", "round")
         .attr("stroke-width", 3)
         .attr("stroke", "white")
         .attr("paint-order", "stroke");
 
     // Transition nodes to their new position.
     const nodeUpdate = node.merge(nodeEnter).transition(transition)
         .attr("transform", d => 'translate('+d.y+','+d.x+')')
         .attr("fill-opacity", 1)
         .attr("stroke-opacity", 1);
 
     // Transition exiting nodes to the parent's new position.
     const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => 'translate('+source.y+','+source.x+')')
         .attr("fill-opacity", 0)
         .attr("stroke-opacity", 0);
 
     // Update the links…
     const link = gLink.selectAll("path")
       .data(links, d => d.target.id);
 
     // Enter any new links at the parent's previous position.
     const linkEnter = link.enter().append("path")
         .attr("d", d => {
           const o = {x: source.x0, y: source.y0};
           return diagonal({source: o, target: o});
         });
 
     // Transition links to their new position.
     link.merge(linkEnter).transition(transition)
         .attr("d", diagonal);
 
     // Transition exiting nodes to the parent's new position.
     link.exit().transition(transition).remove()
         .attr("d", d => {
           const o = {x: source.x, y: source.y};
           return diagonal({source: o, target: o});
         });
 
     // Stash the old positions for transition.
     root.eachBefore(d => {
       d.x0 = d.x;
       d.y0 = d.y;
     });
   }

 
   // Do the first update to the initial configuration of the tree — where a number of nodes
   // are open (arbitrarily selected as the root, plus nodes with 7 letters).
   root.x0 = dy / 2;
   root.y0 = 0;
   root.descendants().forEach((d, i) => {
     d.id = i;
     d._children = d.children;
     if (d.depth && d.data.name.length !== 7) d.children = null;
   });
 
   update(null, root);    
 
   return svg.node();
 }
   `




  const json = {
    type: 'both',
    success: true,
   html: html,
   js: js
  }
  const string = JSON.stringify(json)
  console.log('this is the output of edit file', Object.keys(json), json.success)
  return new Response(string)
}





function particles_morph_target() {
  return new Response(JSON.stringify({}));
}

function vit_dice_frames() {
  return new Response(JSON.stringify({}));
}

function robotics_ui_data() {
  return new Response(JSON.stringify({}));
}

function flux_implant_images() {
  return new Response(JSON.stringify({}));
}

function dynamicland_staircase() {
  return new Response(JSON.stringify({}));
}


const cgi_handlers = [
  particles_morph_target,
  vit_dice_frames,
  robotics_ui_data,
  flux_implant_images,
  dynamicland_staircase
]

const port = 8002;
//console.log(`Server is running on port: ${port}`);
Bun.serve({
  port: port,
  fetch(req) {
    //console.log(`we still on port : ${port}`);

    const url = new URL(req.url);


 




const handler_call_llama = async (user_instructions) => {
  console.log('this is the user instructions', user_instructions)

  const response = await call_llama(user_instructions)

console.log(response)
  return new Response(JSON.stringify({response}));
  
}

    

    const is_cgi = "/cgi-backend"
    const is_llama = "/llama-backend"
    //console.log(url.pathname)
    switch (url.pathname) {
      case is_llama+"/0": return handler_call_llama(req.message)

      case is_llama+"/1": return handlers[0](req)
      case is_llama+"/2": return handlers[1](req)
      case is_llama+"/3": return handlers[2](req)
      case is_llama+"/4": return handlers[3](req)
      case is_llama+"/5": return handlers[4](req)


      case is_cgi+"/1": return cgi_handlers[0](req)
      case is_cgi+"/2": return cgi_handlers[1](req)
      case is_cgi+"/3": return cgi_handlers[2](req)
      case is_cgi+"/4": return cgi_handlers[3](req)
      case is_cgi+"/5": return cgi_handlers[4](req)
    }
    const color = "red";  
    if ((req.method === "POST" && req.body) || url.searchParams.toString()) {
      //console.log('/api/* --> yay', req.body);
      function generateRandomString(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

      // Example usage:
      //console.log(generateRandomString()); // Outputs a random string of 10 characters

      return handler_call_llama(generateRandomString());
    }

    return new Response(`
      <html>
        <body style="background-color: ${color};">
          <h1>Welcome to the ${color} page!</h1>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });
  },
});

// // Endpoint for LiveKit webhook
// const server = serve({
//   "/getToken": async (req) => {
//     res.headers.set("Access-Control-Allow-Origin", "*");
//     res.headers.set(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS",
//     );
//     console.log("hello world");
//     return new Response(token);
//   },

//   // "/livekit-webhook": async (req) => {
//   //   const webhookReceiver = new WebhookReceiver(
//   //     process.env.LIVEKIT_API_KEY,
//   //     process.env.LIVEKIT_API_SECRET,
//   //   );
//   //   const event = await webhookReceiver.receive(await req.text());
//   //   console.log("Received LiveKit event:", event);
//   //   return new Response("OK");
//   // },



//   "/add_eval": async () => {},

//   "/structured_output": async () => {},

//   "/tool_calling": async (req) => {
//     if (req.method === "GET") {
//       return new Response(JSON.stringify(Tool_calling_schema), {
//         headers: { "Content-Type": "application/json" },
//       });
//     } else if (req.method === "POST") {
//       const body = await req.json();
//       const newTool = body.tool;
//       const category = body.category;

//       if (!newTool || !category || !Tool_calling_schema[category]) {
//         return new Response("Invalid request", { status: 400 });
//       }

//       // Prepare the parameters for the edit_file endpoint
//       const file_path = "bun-agent-server.js";
//       const prompt = `add this tool into the json at the bottom of the file: ${newTool} in category ${category}`;

//       // Call the edit_file endpoint
//       const editResponse = await fetch(
//         `http://localhost:${server.port}/edit_file?file_path=${encodeURIComponent(file_path)}&prompt=${encodeURIComponent(prompt)}`,
//       );

//       if (editResponse.ok) {
//         return new Response("Tool added successfully", { status: 200 });
//       } else {
//         return new Response("Failed to add tool", { status: 500 });
//       }
//     } else {
//       return new Response("Method not allowed", { status: 405 });
//     }
//   },

//   "/whisper": async (req) => {
//     const formData = await req.formData();
//     const audioFile = formData.get("audio");

//     if (audioFile) {
//       const buffer = await audioFile.arrayBuffer();
//       const transcript = await whisper.transcribe(buffer);
//       return new Response(transcript);
//     } else {
//       return new Response("No audio file received", { status: 400 });
//     }
//   },

//   async fetch(req) {
//     const url = new URL(req.url);

//     // Route for docs pages
//     if (url.pathname.startsWith("/docs")) {
//       const docsUrl = "https://bun.sh/docs";

//       // `https://example.com${url.pathname}`;
//       return fetchAndServeDocs(docsUrl);
//     }
//     // Route for Bun docs
//     if (url.pathname === "/bun") {
//       const response = await fetch("https://bun.sh/docs");
//       const content = await response.html();
//       return new Response(content, {
//         headers: { "Content-Type": "text/html" },
//       });
//     }
//     // Default route
//     return new Response("Welcome to the docs server!");
//   },
// });

// console.log(`Listening on http://localhost:${server.port}`);

// // Function to fetch and serve docs pages
// async function fetchAndServeDocs(url) {
//   const response = await fetch(url);
//   const content = await response.text();

//   // Wrap the content in an iframe
//   const iframeContent = `
//     -------Hello this is the bun server -------

//     ${content}

//   `;

//   return new Response(iframeContent, {
//     headers: {
//       "Content-Type": "text/html",
//       "X-Frame-Options": "ALLOW-FROM http://localhost:5173",
//     },
//   });
// }

const urls = {
  zed: "https://zed.dev/docs",
  bun: "https://bun.sh/docs",
  deno: "https://deno.land/manual@v2.0.0/introduction",
};

const Tool_calling_schema = {
  developerTools: [
    "reflect.app",
    "observablehq",
    "golang",
    "echo",
    "python",
    "tinygrad",
    "jupyter",
    "bun",
    "deno",
    "zed-editor",
    "zed-stereoscopic-camera",
    "jetson nano",
    "dynamixel servos", // find more hardware with good docs
    "roomba",
    "foxglove",
    "three.js",
    "webgpu",
    "Unreal Engine",
    "ISAAC_ROS",
    "NVIDIA omniverse",
    "tailwindcss",
    "tailscale",
    "github",
    "caddy",
    "sqlite",
  ],
  AIToolsForCourseContent: [
    "Descript",
    "DomoAI",
    "GPT-3",
    "Coursera AI",
    "EdX Studio",
    "Knewton",
    "Carnegie Learning",
    "Quizlet Learn",
    "Gradescope",
    "Packback",
    "Realizeit",
    "Cerego",
    "Smart Sparrow",
    "Cogbooks",
    "Content Technologies Inc.",
    "Third Space Learning",
    "Century Tech",
    "Cognii",
    "Querium",
    "Knewton Alta",
  ],
};

// Best practice for running as a long process:
// 1. Use a process manager like PM2 or systemd to manage the Bun process
// 2. The Go process rendering the status page can be a separate service
// 3. Use inter-process communication (IPC) or a shared database for communication between processes
// Example PM2 ecosystem file (ecosystem.config.js):
/*
module.exports = {
  apps: [
    {
      name: 'bun-agent-server',
      script: 'bun',
      args: 'run bun-agent-server.js',
      watch: true,
      ignore_watch: ['node_modules', 'data'],
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'go-status-page',
      script: '/path/to/go/binary',
      args: 'run status-page.go',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
*/



async function callAIModels(filePath, userInstruction) {
  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const prompt = `Read the following file content and prepend a new function that does the following: ${userInstruction}\n\nFile content:\n${fileContent}`;

    // Call OpenAI GPT-4
    const openaiFunction = await callOpenAI(prompt);

    // Call Anthropic Claude 3 Opus
    const anthropicFunction = await callAnthropic(prompt);

    // Combine responses (you can modify this based on your preference)
    const combinedFunction = `// OpenAI GPT-4 suggestion:\n${openaiFunction}\n\n// Anthropic Claude 3 Opus suggestion:\n${anthropicFunction}`;

    // Prepend the new function to the file
    const updatedContent = combinedFunction + '\n\n' + fileContent;
    await writeFile(filePath, updatedContent, 'utf-8');

    return { success: true, message: 'File updated successfully with AI suggestions.' };
  } catch (error) {
    console.error('Error in callAIModels:', error);
    return { success: false, message: 'Failed to update file with AI suggestions.' };
  }
}