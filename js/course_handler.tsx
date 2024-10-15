// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";
import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";
import fs from "fs";
import path from "path";
import { watch } from "fs";

import { connect_to_livekit } from './bun-livekit-server.js'


let routes = {
  framesplitter: "views/framesplitter",
  css_webgl_animation_from_paper_image:
    "views/css_webgl_animation_from_paper_image",
  make1e9jobs: "views/make1e9jobs",
  vr_ghost_in_shell: "views/vr_ghost_in_shell",
  object_search: "views/object_search",
  particles: "views/particles",
  cloud_flare: "views/cloud_flare",
  perspective_transformation: "views/perspective_transformation",
  "bumble-flow": "views/bumble-flow",
  "jsonp-yt-instant-everything": "views/jsonp-yt-instant-everything",
  "request-5k": "views/request-5k",
  all_tools_in_obs: "views/all_tools_in_obs",
  ffmpeg_vid_to_img: "views/ffmpeg_vid_to_img",
  portfolio: "views/portfolio",
};
const filePath = path.join(__dirname, "../views/odyssey/index.html");

let indexHtmlContent = fs.readFileSync(filePath, "utf-8");




//export default html;

function makeReactApp() {
  
      const App = () => <RoboticsOdyssey />;
      let html = indexHtmlContent.replace(
        "{{template roboticsodyssey}}",
        `${renderToString(<App />)}`,
      );
      return html
}

const { spawn } = require("child_process");

const containerName = "zed2i-container";
const imageName = "<zed-container>";  // Replace with your ZED Docker image

const dockerRunArgs = [
  "run", 
  "--rm",
  "--runtime", "nvidia",
  "--gpus", "all",
  "--network", "host",
  "--env", "DISPLAY=$DISPLAY",
  "--volume", "/tmp/.X11-unix:/tmp/.X11-unix:rw",
  "--device", "/dev/video0", // Adjust if using another device
  "--name", containerName,
  imageName,
  "/bin/bash"
];

console.log("Starting Jetson container for ZED 2i...");

const dockerProcess = spawn("docker", dockerRunArgs);

dockerProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

dockerProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

dockerProcess.on("close", (code) => {
  console.log(`Docker process exited with code ${code}`);
});

async function proxy(req: Request) {
   const url = new URL(req.url);
   console.log(url.pathname);
    const html = makeReactApp()
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
   

  //         if (url.pathname === "/ws") {
  //           const stream = new ReadableStream({
  //             start(controller) {
  //               const interval = setInterval(() => {
  //                 console.log("WebSocket message every 5 seconds");
  //               }, 5000);

  //               // Cleanup when the stream is canceled
  //               controller.signal.addEventListener("abort", () => {
  //                 clearInterval(interval);
  //               });
  //             }
  //           });

  //           return new Response(stream, {
  //             headers: {
  //               "Content-Type": "text/event-stream",
  //               "Cache-Control": "no-cache",
  //               "Connection": "keep-alive"
  //             }
  //           });
  //         }


// if (url.pathname === '/livekit_connect') { 

//   const identity = url.searchParams.get("identity");
//   if (!identity) {
//     return new Response("Identity parameter is missing", { status: 400 });
//   }

//   const json = await connect_to_livekit();
//   console.log(json, json);
//     return new Response(JSON.stringify(json));
//   }
//}
    if (url.pathname === "/" || url.pathname === "/robotics-odyssey") {



    return new Response(makeReactApp(), {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  if (url.pathname === "/sse") {
    // const stream = new ReadableStream({
    //   start(controller) {
    //     const interval = setInterval(() => {

    //       const message = `data: ${new Date().toISOString()}\n\n`;
    //       controller.enqueue(new TextEncoder().encode(message));
    //     }, 1000);

    //     watch("../views", (eventType, filename) => {
    //       if (eventType === "change") {
    //         controller.enqueue(new TextEncoder().encode("refresh"));
            // console.log("File changed:", filename);
            // // Refresh the html content
            // indexHtmlContent = fs.readFileSync(filePath, "utf-8");
            // // Update the html variable
            // const newHtml = indexHtmlContent.replace(
            //   "{{template roboticsodyssey}}",
            //   `${renderToString(<App />)}`,
            // );
            // // Update the exported html
            // html = newHtml;
        //   }
        // });

        // Cleanup when the stream is canceled
        // controller.signal.addEventListener("abort", () => {
        //   clearInterval(interval);
        // });
    //   }
    // });

    // return new Response(stream, {
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Cache-Control": "no-cache",
    //     "Connection": "keep-alive"
    //   }
    // });
  }

  
  // console.log("Server running at http://localhost", port);
  // watch("views/odyssey", (eventType, filename) => {
  //   if (eventType === "change") {
  //     console.log("File changed:", filename);
  //     // Refresh the html content
  //     indexHtmlContent = fs.readFileSync(filePath, "utf-8");
  //     // Update the html variable
  //     const newHtml = indexHtmlContent.replace(
  //       "{{template roboticsodyssey}}",
  //       `${renderToString(<App />)}`,
  //     );
  //     // Update the exported html
  //     html = newHtml;
  //   }
  // });

  // if (url.pathname in routes) {
  //   const html = fs.readFileSync(routes[url.pathname], "utf-8");
  //   return new Response(html, {
  //     headers: {
  //       "Content-Type": "text/html",
  //     },
  //   });
  // }
}
const port = 8080;
async function main() {
  serve({
    port,
    fetch: proxy,
  });
 
}
main();

console.log("Server running at http://localhost", port);
