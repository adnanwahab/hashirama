// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";
import { writeFile } from "fs";

import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";
// Bun server that uses JSX and React to render the component on the server

function App() {
  return <RoboticsOdyssey />
}

const targets = {
  '/obs-framework': 'http://localhost:3000', // Route to backend server
  //'/assets': 'http://localhost:3002', // Route to asset server
};


const html = `<!DOCTYPE html>${renderToString(<App />)}`
export default html;

async function proxy(req: Request) {
  const url = new URL(req.url);

  // if ('/obs-framework' == url.pathname) {
  //     // Forward the request to the target server
  //   //const newUrl = targetUrl + url.pathname + url.search;
  //   console.log('hi')
  //   const proxyReq = new Request("http://localhost:3000", req);
  //   return await fetch(proxyReq);
  // }
  if (url.pathname === "/" || url.pathname === "/robotics-odyssey") {
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });

  }
}


async function main() {
  
  serve({
    port: 8003,
    fetch: proxy,
  });

  console.log("Server running at http://localhost:8003");

} 

