// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";

import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";
// Bun server that uses JSX and React to render the component on the server

function App() {
  return <RoboticsOdyssey />
}

const targets = {
  '/obs-framework': 'http://localhost:3000', // Route to backend server
  //'/assets': 'http://localhost:3002', // Route to asset server
};

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
    const html = renderToString(<App />);
    return new Response(`<!DOCTYPE html>${html}`, {
      headers: {
        "Content-Type": "text/html",
      },
    });

  }
}

serve({
  port: 8003,
  fetch: proxy,
});

console.log("Server running at http://localhost:8003");
