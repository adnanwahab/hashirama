import { join } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { serve } from "bun";
import path from 'path';
//import { connect_to_livekit } from './bun-livekit-server.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = join(__dirname, 'static')

const observable_links = {
  voxels: "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*", 
  dynamicland: "https://observablehq.com/embed/@roboticsuniversity/dynamicland?cell=*",
  livekit: "https://observablehq.com/embed/@roboticsuniversity/livekit-robotics-tele-guidance?cell=*",
  alan_how: "https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*",
  hardware: "https://observablehq.com/embed/@roboticsuniversity/1-hardware-design-repair?cell=*",
  prediction: "https://observablehq.com/embed/@roboticsuniversity/3-planning-prediction?cell=*",
  infra: "https://observablehq.com/embed/@roboticsuniversity/infrastructure-notebook@13?cell=*",
  democracy: "https://observablehq.com/embed/@roboticsuniversity/collaborative-ui-twitch-plays-robot?cell=*",
  research: "https://observablehq.com/embed/@roboticsuniversity/5000-research-papers?cell=*",
  //semseg: "https://observablehq.com/embed/@roboticsuniversity/semantic-segmentation-robot?cell=*",
}
function observable_template(name) { 
  if (!observable_links[name]) {
    return new Error(`No notebook found for ${name}`)
  }
  const link = observable_links[name]
  const regex = /https:\/\/observablehq\.com\/embed\/@roboticsuniversity\/collaborative-ui-twitch-plays-robot\?cell=\*/;

  const idMatch = link.match(/@roboticsuniversity\/([^?]+)/);
  const id = idMatch ? idMatch[1] : null;
  if (!id) {
    return new Error(`Invalid link format for ${name}`);
  }

  const js_link = `https://api.observablehq.com/@roboticsuniversity/${id}.js`

  return `
  <div>This is a bun component from robotics-odyssey-backend</div>
  <div class="observablehq-${id}"></div>
  <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/${id}">${name}</a></p>
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
  <script type="module">
  import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
  import define from "${js_link}";
  new Runtime().module(define, Inspector.into(".observablehq-${id}"));
  </script>
  `
}

const port = 3003

const render_everything = async (req) => {
  const url = req.url
  const notebook_name = req.url.split("?idk=")[1];
  let content = ''

  if (url.startsWith("http://localhost:3003/static")) { // Remove .pathname
    return Bun.file(join(staticDir, url.replace("/static", "")));
  }
  if (url === "http://localhost:3003/") {
     content = fs.readFileSync(join('/Users/shelbernstein/homelab_status_page/views/llama-tools/api_docs.html'), 'utf8')
  } else {
    content = observable_template(notebook_name)
  }
  
    return new Response(content, {
      headers: {
        "Content-Type": "text/html",
      },
    });
}

serve({
   fetch(req) {
    //console.log('req', req)
    return render_everything(req)
    .then(res => res)
    .catch(err => {
      console.error(err)
      return new Response("Error: " + err.message, { status: 500 })
    })
  },
  port: port, // You can change the port if needed
});

console.log("Bun server is running on http://localhost:" + port);


//obseravble university 


// uppload diff of notebook - download diff - render automatically - etc

//Overriding cell values
//bun run -- update-notebooks 
//creates a jons - observable links
// run bun script to parse pages and create links
// all front end componets can use either react or native html/css/js
//3d react css - lib for obs.
//https://observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d

// : "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",
// dynamicland: "https://observablehq.com/embed/@roboticsuniversity/dynamicland?cell=*",
// livekit: "https://observablehq.com/embed/@roboticsuniversity/livekit-robotics-tele-guidance?cell=*",
// alan: "https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*",
// hardware: "https://observablehq.com/embed/@roboticsuniversity/1-hardware-design-repair?cell=*",
// prediction: "https://observablehq.com/embed/@roboticsuniversity/3-planning-prediction?cell=*",
// infra: "https://observablehq.com/embed/@roboticsuniversity/infrastructure-notebook@13?cell=*",
//livekit: "https://observablehq.com/embed/@roboticsuniversity/livekit-robotics-tele-guidance?cell=*",
