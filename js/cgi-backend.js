const staticDir = join('static/');
import { join } from 'node:path';
const path = require('path');
const goodOnesDir = join('views', 'cgi-tools');
const Replicate = require("replicate");
const fs = require('fs'); 
import { connect_to_livekit } from './bun-livekit-server.js'

const routes = [
  'livekit_video',
  'voice_reactive_particles',
  'flux_test', //flux
  // 'git_viusalizer',
  // 'ig-generation-flux',
  // 'kill-math',
  // 'nerf',
  // 'scene_reconstruction',
]
// obs + jupyter right panel (remote desktop on jupyter)
const path_maker = (route) => join(goodOnesDir, route + '.html')
const goodOnesFiles = routes.map(path_maker)
const compile_time_file_checker = file => { 
  return goodOnesFiles.includes(  path_maker(file)  ) 
}
const filtered_good_ones_files = routes.filter(compile_time_file_checker);
console.log('Files in goodOnesDir:',filtered_good_ones_files.length);
console.log('filtered,  goodOnesFiles', compile_time_file_checker('index') )
const render_page = (page_name) => {
  const page_path = path_maker(page_name)
  if (filtered_good_ones_files.includes(page_name.replace('/', ''))) { // Remove leading slash
    return fs.readFileSync(page_path, 'utf8')
  } else {
    return '404'
  }
}
const port = 8003;
Bun.serve({
  port: port,
  async fetch(req) {
    let url = new URL(req.url).pathname;
    console.log('url', url);
    if (url === '/helpers_list') {
      const helpersDir = path.join(__dirname, 'helpers');
      const helperFiles = fs.readdirSync(helpersDir);
      return new Response(JSON.stringify(helperFiles), { headers: { "Content-Type": "application/json" } });
    }
    if (url === '/') url = 'livekit_video';
    if (url === '/connect') { 
      const json = await connect_to_livekit();
      console.log(json, json);
      return new Response(JSON.stringify(json));
    }
    if (url.includes('static')) return new Response(Bun.file(url.slice(1)));
    return new Response(render_page(url), { headers: { "Content-Type": "text/html" } });
  },
});
// add rate limitier - 
console.log('running cgi-backend on port ' + 8003);


// cgi-backend.js

// function particlesMorphTarget() {
//     return new Response(JSON.stringify({}));
//   }
  
//   function vitDiceFrames() {
//     return new Response(JSON.stringify({}));
//   }
  
//   function roboticsUiData() {
//     return new Response(JSON.stringify({}));
//   }
  
//   function fluxImplantImages() {
//     return new Response(JSON.stringify({}));
//   }
  
//   function dynamiclandStaircase() {
//     return new Response(JSON.stringify({}));
//   }
  
//   const cgiHandlers = [
//     particlesMorphTarget,
//     vitDiceFrames,
//     roboticsUiData,
//     fluxImplantImages,
//     dynamiclandStaircase
//   ];

//   function replayAnalyzer() {
//     const html = `
//       <div class="container">
//         <div class="panel">
//           <input class="replay" type="text" placeholder="Enter YouTube URL" style="width: 100%;">
//           <button style="margin-top: 10px;" onclick="loadVideo()">Load Video</button>
//           <iframe class="iframe" id="youtubeIframe"></iframe>
//         </div>
//         <div class="panel">
//           <svg class="svg"></svg>
//         </div>
//       </div>
//     `;

//   }
//   function observableCursor() {
//     return new Response(JSON.stringify({}));
//   }
  
//     const js = `
//       function loadVideo() {
//         const input = document.querySelector('input');
//         const iframe = document.getElementById('youtubeIframe');
//         const url = input.value;
//         const videoId = url.split('v=')[1];
//         iframe.src = 'https://www.youtube.com/embed/' + videoId;
//       }
//       setTimeout(() => {
//         document.querySelector('.replay').addEventListener('change', loadVideo);
//       }, 1000);
//     `;
  
//     return new Response(JSON.stringify({ type: 'both', js, html }));
//   }

// module.exports = {
//   figma_to_animation,
//   test_replicate
// };const 


 async function figma_to_flux(req) {

  console.log('this is the flux rendering')


  const content = await figma_to_animation(req);

  return new Response(content, { headers: { "Content-Type": "json" } });
}

async function figma_to_animation (data) {

  return {
      "notyet": true
  }

  const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
  });
  //const response = await replicate.models.list();

  const output = await replicate.run(
      "rossjillian/controlnet:795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
      {
          input: {
              eta: 0,
              seed: 20,
              image: "https://replicate.delivery/pbxt/IYQLHLFDraqCrjDUoiwpM9xBhQM1eQVHbxBiNxcbwctUamzb/user_1.png",
              scale: 9,
              steps: 20,
              prompt: "a photo of a brightly colored turtle",
              scheduler: "DDIM",
              structure: "scribble",
              num_outputs: 1,
              low_threshold: 100,
              high_threshold: 200,
              negative_prompt: "Longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
              image_resolution: 512,
              return_reference_image: false
          }
      }
  );
  console.log('outout', output);

  fs.writeFileSync('./output.json', JSON.stringify(output, null, 2))
  return "sucess"
}