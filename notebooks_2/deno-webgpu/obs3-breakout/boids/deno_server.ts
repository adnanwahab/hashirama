import { serveDir, serveFile } from "jsr:@std/http/file-server";
import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

import {run_boids} from './mod.ts'




Deno.serve(async (req: Request) => {
  const pathname = new URL(req.url).pathname;

  console.log('pathname', pathname)
  await run_boids()
  // Serve index.html for the root path
  if (pathname === "/") {
    return serveFile(req, "./index.html");
  }

  // if (pathname === "/boids.png") {
  //   return serveFile(req, "./boids.png");
  // }

  // Serve static files from the 'public' directory
  if (pathname.startsWith("/static")) {
    return serveDir(req, {
      fsRoot: "public",
      urlRoot: "static",
    });
  }

  // Serve inspector.css, runtime files, and index.js
  if (pathname === "/inspector.css" ||
      pathname.startsWith("/runtime/") ||
      pathname === "/index.js") {
    return serveFile(req, `.${pathname}`);
  }

  // If no matching route is found, return a 404 response
  return new Response("404: Not Found", {
    status: 404,
  });
});