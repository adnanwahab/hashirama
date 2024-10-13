// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";
import { writeFile } from "fs";
import { renderToReadableStream } from 'react-dom/server';

import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";
// Bun server that uses JSX and React to render the component on the server
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../views/odyssey/index.html');

let indexHtmlContent = '';

try {
  indexHtmlContent = fs.readFileSync(filePath, 'utf-8');
} catch (error) {
  console.error('Error reading index.html:', error);
}


function App() {
  return <RoboticsOdyssey />
}

const targets = {
  '/obs-framework': 'http://localhost:3000', // Route to backend server
  //'/assets': 'http://localhost:3002', // Route to asset server
};


const html = indexHtmlContent.replace('{{template roboticsodyssey}}', `${renderToString(<App />)}`)
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

  // if (url.pathname === "/twitch-plays-pokemon") {
  //   // const stream = renderToReadableStream(<App />);
  //   // stream.pipe(res);
  //   const stream = await renderToReadableStream(App());
  //   return new Response(stream, {
  //     headers: { "Content-Type": "text/html" },
  //   });
    //return renderToReadableStream(<TwitchPlaysPokemonPanel/>)
  //}

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
    port: 3000,
    fetch: proxy,
  });

  console.log("Server running at http://localhost:8003");

} 

main()