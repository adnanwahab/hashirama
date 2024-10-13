// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";
import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";
import fs from "fs";
import path from "path";

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

function App() {
  return <RoboticsOdyssey />;
}

const html = indexHtmlContent.replace(
  "{{template roboticsodyssey}}",
  `${renderToString(<App />)}`,
);
export default html;

async function proxy(req: Request) {
  const url = new URL(req.url);
  if (url.pathname === "/" || url.pathname === "/robotics-odyssey") {
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  if (url.pathname in routes) {
    const html = fs.readFileSync(routes[url.pathname], "utf-8");
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}
const port = 8003;
async function main() {
  serve({
    port,
    fetch: proxy,
  });
  console.log("Server running at http://localhost", port);
}
main();
