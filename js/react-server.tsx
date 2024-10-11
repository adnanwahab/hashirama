// server.js
import { renderToString } from "react-dom/server";
import React from "react";
import { serve } from "bun";

// Create a simple React component
function App() {
  const pages = ['index', 'llama-tools']
  return (
    <html>
      <head>
        <title>JSX with Bun</title>
      </head>
      <body>

        {pages.map(page => <div><a href={`/${page}`}>{page}</a></div>)}
        <h1>Hello, JSX on the server with Bun!</h1>
      </body>
    </html>
  );
}

// Bun server that uses JSX and React to render the component on the server
serve({
  port: 3000,
  fetch(req) {
    const html = renderToString(<App />);
    return new Response(`<!DOCTYPE html>${html}`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log("Server running at http://localhost:3000");