import { writeFile } from "fs";
import html from "./react-server";
import { serve } from "bun";

async function main () {

  // Write the HTML to a file
  writeFile("docs/index.html", html, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("HTML successfully written to docs/index.html");
    }
  });

  // Serve the file using Bunx
  serve({
    port: 3000,
    fetch: (req) => {
      console.log(req.url);
      if (req.url === "http://localhost:3000/") {
        return new Response(html, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      }
      return new Response("Not Found", { status: 404 });
    },
  });
  
}

main()
