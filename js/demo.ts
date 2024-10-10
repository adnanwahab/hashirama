
import { serve } from "bun";

const htmlContent = `
<html>
  <body>
    <h1>Welcome to the Bun LiveKit Server</h1>
    <div id="livekit-token">oafisndfoa sdfa</div>
    <div id="livekit-ws-url">asdlfkajslfkasjdlfaksjdflkajfalsdkfj</div>
  </body>
</html>
`;



serve({
  fetch(req) {
    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
  port: 3009, // You can change the port if needed
});

console.log("Bun server is running on http://localhost:3009");
