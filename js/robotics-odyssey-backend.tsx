import { join } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { serve } from "bun";
import path from "path";
import { connect_to_livekit } from "./bun-livekit-server.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = join(__dirname, "static");

//import Dynamicland from "./DynamicLand.tsx";
import React from "react";
import { renderToString } from "react-dom/server";
import TwitchPlaysPokemonPanel from "./react-server.tsx";
//rich hickey talks - all favorite blogs - find all devices - export history - script - tailscale - observable-server
//https://diffusion-policy.cs.columbia.edu/
// one agent for import demos into repo/archive -> one agent for import demos into obseravable - another agent for magic variables
const observable_links = {
  voxels:
    "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",
  //"worrydream": "https://observablehq.com/embed/@roboticsuniversity/worrydream?cell=*",
  //"dynamicland.org": "https://observablehq.com/embed/@roboticsuniversity/dynamicland.org?cell=*",
  dynamicland: "https://observablehq.com/embed/@roboticsuniversity/dynamicland?cell=*",
  "livekit_subscriber": "https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*",
//  "livekit_subscriber": "https://observablehq.com/embed/@roboticsuniversity/livekit-robotics-tele-guidance?cell=*",

  alan_how:
    "https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*",
  hardware: "https://observablehq.com/embed/@roboticsuniversity/robotics-hardware?cell=*",
  prediction:
    "https://observablehq.com/embed/@roboticsuniversity/3-planning-prediction?cell=*",
  infra:
    "https://observablehq.com/embed/@roboticsuniversity/infrastructure-notebook@13?cell=*",
  democracy:
    "https://observablehq.com/embed/@roboticsuniversity/collaborative-ui-twitch-plays-robot?cell=*",
  twitch: TwitchPlaysPokemonPanel,

  //twitch: "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",

  research:
    "https://observablehq.com/embed/@roboticsuniversity/5000-research-papers?cell=*",
  //semseg: "https://observablehq.com/embed/@roboticsuniversity/semantic-segmentation-robot?cell=*",
};

function stubObservable(name) {
  return (`
  <div id="observablehq-fba2beec"></div>
  <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/dynamicland">DynamicLand by roboticsuniversity</a></p>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
  <script type="module">
  import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
  import define from "https://api.observablehq.com/@roboticsuniversity/dynamicland.js?v=4";
  new Runtime().module(define, Inspector.into("#observablehq-fba2beec"));
  </script>`)
}

// learn iframes - first
// learn inspector + runtime 
// learn react 

function observable_template(name) {
  if (name === 'livekit') {
    return stubObservable(name)
  }
 
  const _ = observable_links[name];
  if (!_) {
    return new Error(`No notebook found for ${name}`);
  }
  if (typeof _ === "function") {
    console.log('its a function')
    return renderToString(React.createElement(_));
  }
  return `<h1>${name}</h1><iframe style="background-color: white;" width="100%" height="500" frameborder="0" src="${_}"></iframe>` ;


  

  //console.log('name', observable_links[name])

  const link = observable_links[name];
  const regex =
    /https:\/\/observablehq\.com\/embed\/@roboticsuniversity\/collaborative-ui-twitch-plays-robot\?cell=\*/;

  const idMatch = link.match(/@roboticsuniversity\/([^?]+)/);
  const id = idMatch ? idMatch[1] : null;
  if (!id) {
    return new Error(`Invalid link format for ${name}`);
  }

  const js_link = `https://api.observablehq.com/@roboticsuniversity/${id}.js`;

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
  `;
}

const port = 3003;

const render_everything = async (req) => {
  const url = req.url;
  console.log("url", url);
  const notebook_name = new URL(req.url).pathname.slice(1); //req.url.split("?idk=")[1];
  let content = "";
  console.log('notebook_name', notebook_name)

  if (notebook_name === 'publisher.html') {
    console.log('publisher.html')

    content = fs.readFileSync(join(__dirname, '/publisher.html'), 'utf8')
    return new Response(content, {headers: { "Content-Type": "text/html"}})
  }
  if (notebook_name === 'subscriber.html') {
    console.log('subscriber.html')
    content = fs.readFileSync(join(__dirname, '/subscriber.html'), 'utf8')
    return new Response(content, {headers: { "Content-Type": "text/html"}})
  }
  // edit language to take safety and humane technolgoy more seriously - kapil
  if (url.startsWith("http://localhost:3003/static")) {
    return Bun.file(join(staticDir, url.replace("/static", "")));
  }
  //console.log('url', notebook_name === "livekit")
  //console.log('method', req.method)
  // make this work for both post + jsonp
  if (req.method === "GET") {


    const queryParams = new URLSearchParams(new URL(req.url).search);
    const params = {};
    for (const [key, value] of queryParams.entries()) {
      params[key] = value;
    }
    //console.log('Query Parameters:', params);

    if (notebook_name === "livekit") {
      //console.log('data', params)
      const json = await connect_to_livekit(params);
      //console.log('res', json)
      return new Response(JSON.stringify(json));
    }
  }


  if (url === "http://localhost:3003/") {
    content = fs.readFileSync(
      join(
        "/Users/shelbernstein/homelab_status_page/views/llama-tools/api_docs.html",
      ),
      "utf8",
    );
  } else {
    content = observable_template(notebook_name);
  }






  return new Response(content, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};

serve({
  fetch(req) {
    return render_everything(req)
      .then((res) => res)
      .catch((err) => {
        console.error(err);
        return new Response("Error: " + err.message, { status: 500 });
      });
  },
  port: port, // You can change the port if needed
});

//console.log(typeof TwitchPlaysPokemonPanel())
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
