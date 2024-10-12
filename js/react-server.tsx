// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";

import RoboticsOdyssey from "../views/odyssey/robotics-odyssey.tsx";
// Bun server that uses JSX and React to render the component on the server

function App() {
  return <RoboticsOdyssey />
}
serve({
  port: 8003,
  fetch(req) {
    const html = renderToString(<App />);
    return new Response(`<!DOCTYPE html>${html}`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log("Server running at http://localhost:8003");
