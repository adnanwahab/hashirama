import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
function cog_engine_5000_papers() {
  const html = `
    <div class="container">
      <div class="panel left-panel">
        <h2>PDF Viewer</h2>
        <div class="pdf-viewer">pdf go here</div>
      </div>
      <div class="panel middle-panel">
        <h2>Intermediate Representation</h2>
        <div class="content"></div>
      </div>
      <div class="panel right-panel">
        <h2>Output</h2>
        <div class="content"></div>
      </div>
      <div class="panel webrtc-panel">
        <h2>WebRTC Agent</h2>
        <video id="webrtcVideo" autoplay></video>
      </div>
    </div>
  `;

  return new Response(JSON.stringify({ type: 'both', html, js: '' }));
}

async function callLlama(userInstructions)  {
  let responseContent = '';
  const message = { role: 'user', content: userInstructions };
  const response = await ollama.chat({ model: 'llama3.2', messages: [message], stream: true });
  for await (const part of response) {
    responseContent += part.message.content;
  }
  return responseContent;
}


async function fileRewriter(req) {
  console.log('this is the file rewriter');
  const filePath = "/Users/shelbernstein/hashirama/js/llama-backend.js";
  const prompt = "add a new function to get the location of the rewind.ai website and the datafiles, specifically the video and anything that might be useful to the top of the file";
  const editedContent = await callLlama(prompt);
  const fileContent = await Bun.file(filePath).text();

  const html = `
    <div class="bun-output">
      <div style="background-color: blue; color: white; padding: 10px; margin: 5px 0;">
        <strong>${editedContent}:</strong> blalbalhal
      </div>
      <div style="background-color: green; color: white; padding: 10px; margin: 5px 0;">
        <strong>${fileContent}:</strong> blalbalhal
      </div>
    </div>
  `;
  const json = {
    type: 'both',
    success: true,
    html: html,
    js: js
  };
  const string = JSON.stringify(json);
  console.log('this is the output of edit file', Object.keys(json), json.success);
  return new Response(string);
} 

      // case isLlama + "/api*": return handlerCallLlama(req.message);
//auto-exnted the grid - life hoto essi 

// Function to handle file rewriting


//Vision-transformer
//generate-embeddings
//tool calling
//whisper


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


const readFileAsString = async (filePath) => {
  try {
    const data = await readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};

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


async function vision_transformer(input) {
  const ollama = new Ollama("llava:7b", "8dd30f6b0cb1");

  try {
    const result = await ollama.callFunction1(input);
    console.log("Function1 Result:", result);
    return result;
  } catch (error) {
    console.error("Error calling Function1:", error);
  }
}

async function llama(input) {
  const ollama = new Ollama("llama3.2:latest", "a80c4f17acd5");

  try {
    const result = await ollama.callFunction2(input);
    console.log("Function2 Result:", result);
    return result;
  } catch (error) {
    console.error("Error calling Function2:", error);
  }
}

module.exports = {
  llama,
  vision_transformer,
};

// Function to download PDF content and save it
async function downloadPDF(url, saveDir) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const filename = basename(url);
    await ensureDirectoryExists(saveDir);
    await writeFile(`${saveDir}/${filename}`, buffer);
    console.log(`PDF saved: ${saveDir}/${filename}`);
  } catch (error) {
    console.error(`Failed to download PDF ${url}: ${error.message}`);
  }
}

// Function to scrape content from a URL
async function useLLamaToGuessWhatToDoBetterThanHUman(url, saveDir) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // use extension - in the console - download all images - tailwind - make tool
  return data;
}

// Save scraped data to JSON file
async function saveDataToFile(url, data, saveDir) {
  const filename = `${url.replace(/https?:\/\//, "").replace(/\W+/g, "_")}.json`;
  const jsonContent = JSON.stringify(data, null, 2);
  await ensureDirectoryExists(saveDir);
  try {
    await writeFile(`${saveDir}/${filename}`, jsonContent);
    console.log(`Data saved to ${saveDir}/${filename}`);
  } catch (error) {
    console.error(`Failed to write file ${filename}: ${error.message}`);
  }
}

// Main function to run the scraper
async function main() {
  let url =
    "https://tinlizzie.org/IA/index.php/Papers_from_Viewpoints_Research_Institute";
  let saveDir = "static/alan_kay/";

  try {
    console.log(`Scraping content from ${url}`);
    const data = await scrapePage(url, saveDir);
    await saveDataToFile(url, data, saveDir);
  } catch (error) {
    console.error(`Failed to scrape ${url}: ${error.message}`);
  }
}

// main();

// ////// new module
// const { chromium } = require("playwright");

async function fetchGitHubSecrets(secretNames) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    console.error(
      "Missing GitHub configuration. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.",
    );
    process.exit(1);
  }
  const octokit = new Octokit({ auth: token });

  try {
    const secrets = await Promise.all(
      secretNames.map(async (secretName) => {
        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/actions/secrets/{secret_name}",
          {
            owner,
            repo,
            secret_name: secretName,
          },
        );
        return { name: secretName, value: data.value };
      }),
    );

    secrets.forEach(({ name, value }) => {
      process.env[name] = value;
    });
  } catch (error) {
    console.error("Error fetching GitHub secrets:", error.message);
    process.exit(1);
  }
}



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
  // "bottom", in the data domain. The width of a column is based on the tree's height.
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

    // Update the nodes...
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

    // Update the links...
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
`;