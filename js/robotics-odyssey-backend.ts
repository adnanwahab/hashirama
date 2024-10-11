import { AccessToken } from 'livekit-server-sdk';
import { join } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { serve } from "bun";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDir = join(__dirname, 'static')
const {jwt, wsUrl} = connect_to_livekit()

const order = [
  "diffusion-policy",
  "democracy-mode",
  "idk",
  "dynamicland.org",
  "how",
  "meforgert"
]


const diffusion_policy = () => `
  <div class="text-blue-200">
    <script src="https://cdn.tailwindcss.com"></script>

  <link href="/static/output.css" rel="stylesheet">
  <div id="observablehq-e6b4d66b"></div>


<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import define from "https://api.observablehq.com/d/29574e768ede40b8@39.js?v=4&api_key=a5b5aac3a46045186fc90aaec61f37611f3b1955";
new Runtime().module(define, Inspector.into("#observablehq-e6b4d66b"));
</script>
 https://3d-diffusion-policy.github.io/
<div id="observablehq-56f99f22"></div>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import define from "https://api.observablehq.com/d/29574e768ede40b8@4.js?v=4&api_key=8e38415b78bfb28677b1248a2bfed0566fbd1b65";
new Runtime().module(define, Inspector.into("#observablehq-56f99f22"));
</script>

  </div>
`;

const democracy_mode = () => `
  <div class="text-blue-200">
  <link href="/static/output.css" rel="stylesheet">
    <h1 style="color: white;">Democracy Mode</h1>
    <p>This is a simple HTML string indicating democracy mode.</p>
    <style>
         body {
             font-family: 'Courier New', Courier, monospace;
             background-color: black;
             color: white;
             text-align: center;
         }

         .container {
             width: 300px;
             margin: auto;
             margin-top: 50px;
         }

         .slider-container {
             display: flex;
             justify-content: space-between;
             margin-bottom: 20px;
         }

         .bar-chart {
             margin-bottom: 20px;
         }

         .votes-list {
             text-align: left;
             margin: auto;
             width: 200px;
         }
     </style>
    <div class="container">
         <h1>Twitch Plays Pokémon</h1>
         <h2>5d 13h 45m 21s</h2>

         <div class="slider-container">
             <span>Anarchy</span>
             <input type="range" min="0" max="100" value="50" class="slider" id="anarchy-democracy-slider">
             <span>Democracy</span>
         </div>

         <div id="bar-chart" class="bar-chart"></div>

         <div class="votes-list" id="votes-list">
             <!-- Dynamic vote list will be inserted here -->
         </div>
     </div>

     <script>
         // Bar Chart Data
         const voteData = [
             { action: 'down', votes: 90 },
             { action: 'left', votes: 41 },
             { action: 'right', votes: 6 },
             { action: 'b', votes: 3 },
             { action: 'start', votes: 3 },
             { action: 'start9', votes: 2 },
             { action: 'a', votes: 1 },
         ];

         // Set up dimensions for the bar chart
         const chartWidth = 300;
         const chartHeight = 200;

         const svg = d3.select("#bar-chart")
             .append("svg")
             .attr("width", chartWidth)
             .attr("height", chartHeight);

         const xScale = d3.scaleLinear()
             .domain([0, d3.max(voteData, d => d.votes)])
             .range([0, chartWidth]);

         const yScale = d3.scaleBand()
             .domain(voteData.map(d => d.action))
             .range([0, chartHeight])
             .padding(0.1);

         // Add bars
         svg.selectAll(".bar")
             .data(voteData)
             .enter()
             .append("rect")
             .attr("class", "bar")
             .attr("x", 0)
             .attr("y", d => yScale(d.action))
             .attr("width", d => xScale(d.votes))
             .attr("height", yScale.bandwidth())
             .attr("fill", "white");

         // Add labels
         svg.selectAll(".label")
             .data(voteData)
             .enter()
             .append("text")
             .attr("x", d => xScale(d.votes) + 5)
             .attr("y", d => yScale(d.action) + yScale.bandwidth() / 2 + 5)
             .text(d => d.votes)
             .attr("fill", "white");

         // Vote List rendering
         const voteListContainer = d3.select("#votes-list");

         voteData.forEach(vote => {
             voteListContainer.append("div")
                 
                 .style("margin-bottom", "5px");
         });

         // Slider functionality
         const slider = document.getElementById("anarchy-democracy-slider");
         slider.addEventListener("input", function() {
             const sliderValue = slider.value;
             
         });
     </script>

  </div>

`;

const idk = () => `
  <div>
      <h1 style="color: white;">diffusion !?!?!  Mode</h1>
  </div>
`;

const dynamicland_org = () => `
  <div class="text-blue-200">
  <link href="/static/output.css" rel="stylesheet">
      <img src="/static/dynamic_land.gif" />
      </a>
  </div>
`;
const how = () => `
  <div class="text-blue-200">
  <link href="/static/output.css" rel="stylesheet">
  <div id="observablehq-9c205166"></div>
<p>Credit: <a href="https://observablehq.com/d/4d506176b786c501@92">ALan - how? by roboticsuniversity</a></p>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import define from "https://api.observablehq.com/d/4d506176b786c501@92.js?v=4&api_key=f2300a05054ccb1ea5c58e6df367be732d5d692f";
new Runtime().module(define, Inspector.into("#observablehq-9c205166"));
</script>
`;


async function connect_to_livekit() {
  const apiKey =  process.env.livekit_api_key
  const apiSecret = process.env.livekit_api_secret
    const token = new AccessToken(apiKey, apiSecret, {
    identity: 'example-participant',
  });
  ;token.addGrant({
      room: 'example-room',
      roomJoin: true,
      canPublish: true,
    });
  const jwt = await token.toJwt();



  return {token: jwt, wsUrl}
}


const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="/static/output.css" rel="stylesheet">

</head>
<body class="bg-slate-500" style="background-color: red;">
    <h1>Welcome to the Bun ___ Server</h1>
    <div id="livekit-token">${jwt}</div>
    <div id="livekit-ws-url">${wsUrl}</div>


    <p>This is a simple HTML page served by Bun.</p>
    <script type="module">
import {
createLocalTracks,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  RoomEvent,
  VideoPresets,
  Track,
  LocalTrackPublication,
  LocalParticipant,

Room } from 'https://unpkg.com/livekit-client@2.5.7/dist/livekit-client.esm.mjs?module'

const token = document.getElementById("livekit-token").textContent;
const wsUrl = document.getElementById("livekit-ws-url").textContent;
console.log(wsUrl);
debugger
if (false) connect()

function connect() {
const room = new Room();
room.prepareConnection(wsUrl, token);
await room.connect(wsUrl, token);

// Add the following lines
const localParticipant = room.localParticipant;
console.log(localParticipant)


// publish local camera and mic tracks
await localParticipant.enableCameraAndMicrophone();

console.log(localParticipant)




room.on(RoomEvent.TrackPublished, (track, publication, participant) => {
    console.log('Track Published:', track, publication, participant);
});

room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    console.log('Track Subscribed:', track, publication, participant);
});

room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
    console.log('Track Unsubscribed:', track, publication, participant);
});

room.on(RoomEvent.ParticipantJoined, (participant) => {
    console.log('Participant Joined:', participant);
    participant.publishTrack(track, {
        audio: true,
        video: true,
      });
});

room.on(RoomEvent.ParticipantLeft, (participant) => {
    console.log('Participant Left:', participant);
});

room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
    console.log('Active Speakers Changed:', speakers);
});

room.on(RoomEvent.Disconnected, () => {
    console.log('Disconnected from room');
});






function handleTrackSubscribed(track, publication, participant) {
  if (track.kind === 'video' || track.kind === 'audio') {
    // attach it to a new HTMLVideoElement or HTMLAudioElement
    const element = track.attach();
    parentElement.appendChild(element);
  }
}

function handleTrackUnsubscribed(track, publication, participant) {
  // remove tracks from all attached elements
  track.detach();
}

function handleLocalTrackUnpublished(publication, participant) {
  // when local tracks are ended, update UI to remove them from rendering
  publication.track.detach();
}

function handleActiveSpeakerChange(speakers) {
  // show UI indicators when participant is speaking
}

function handleDisconnect() {
  console.log('disconnected from room');
}

///const track = localParticipant.getTrackByName('camera')



const tracks = await createLocalTracks({
  audio: true,
    facingMode: { exact: "environment" } // Use the environment (rear-facing) camera
});


  
  // Render local camera track before publishing
  const localVideoElement = document.createElement('video');
  localVideoElement.autoplay = true;
  localVideoElement.muted = true;
  localVideoElement.srcObject = new MediaStream([tracks[1].mediaStreamTrack]); // Assuming video track is at index 1
  document.body.appendChild(localVideoElement);


}

    </script>
</body>
</html>
`;

function meforgert() {
return `
  <div>
  <div id="observablehq-1d886192"></div>


<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import define from "https://api.observablehq.com/@roboticsuniversity/1-hardware-design-repair@110.js?v=4&api_key=55e65cf14d719d6b84eb6a52840abb29fddc801d";
new Runtime().module(define, Inspector.into("#observablehq-1d886192"));
</script>
  </div>
`

}


const pages = [
   diffusion_policy(),
democracy_mode(),
 idk(),
 dynamicland_org(),
how(),
meforgert()
]

const port = 3003

const render_everything = async (req) => {
  const url = req.url
  const idk = req.url.split("?idk=")[1];
  console.log('idk',idk)

  if (url.startsWith("http://localhost:3003/static")) { // Remove .pathname
    return Bun.file(join(staticDir, url.replace("/static", "")));
  }

  if (url === "http://localhost:3003/") {
    const content = fs.readFileSync(join('/Users/shelbernstein/homelab_status_page/views/llama-tools/api_docs.html'), 'utf8')
    .replace("__content__", `
      
      ${order.map(page => `<li><a href="/?idk=${page}">${page}</a></li>`).join("\n")}


      ${order.map((page, i) => `<span class="prof-style">${order[i]}</span><iframe src="/?idk=${page}" width="100%" height="500px"></iframe>`).join("\n")}
      `)
    return new Response(content, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  //const default_content = pages.join("\n")
  // filmstip
  const default_content = pages[0]

  let templated = default_content
  const container_start = `
  <head>
  <title>bunkit livekit server</title>
  <script src="/static/css/output.css"></script>
  </head>
  <div class="min-h-screen flex items-center justify-center bg-slate-500">

  `
  const container_end = `
  <style>
      .rainbow-text {
          background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
          -webkit-background-clip: text;
          color: transparent;
          animation: rainbow-animation 5s infinite;
      }

      @keyframes rainbow-animation {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
      }

      .prof-style {
          font-family: 'Arial', sans-serif;
          font-size: 1.2em;
          margin: 10px;
          padding: 10px;
          border: 2px solid white;
          border-radius: 5px;
          background-color: rgba(255, 255, 255, 0.1);
      }
  </style>
  </div>
  `   


    if (idk) {
      templated = pages[order.indexOf(idk)]
    }
  

  return new Response(container_start + templated + container_end, {
    headers: {
      "Content-Type": "text/html",
    },
  });

}

serve({
  fetch(req) {
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
