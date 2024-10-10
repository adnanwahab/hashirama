import { join } from 'path';
const staticDir = join('static/');

const fs = require('fs');
const path = require('path');
const html_pages = {
  "livekit_audio": fs.readFileSync(join('views/components/livekit_audio.html')),
  "cognition_engine": fs.readFileSync(join('views/components/cognition_engine.html')), 
  "replay_analyzer": fs.readFileSync(join('views/components/replay_analyzer.html')),
  "logs_viewer": fs.readFileSync(join('views/components/logs_viewer.html')),
  "import_docs": fs.readFileSync(join('views/components/import_docs.html')),
  "script_reflect": fs.readFileSync(join('js/pricing.html')),
  "script_obs": fs.readFileSync(join('views/components/script_obs.html')),
  "livekit_video": fs.readFileSync(join('views/components/livekit_video.html')),
  "llama_search": fs.readFileSync(join('views/components/llama_search.html')),
};

const routes = {
  livekit_audio:() =>  render_container(render_page('livekit_audio')),
  cognition_engine:() =>  render_container(render_page('cognition_engine')),
  replay_analyzer:() =>  render_container(render_page('replay_analyzer')),
  logs_viewer:() =>  render_container(render_page('logs_viewer')),
  import_docs:() =>  render_container(render_page('import_docs')),
  script_reflect:() =>  render_container(render_page('script_reflect')),
    // livekit_video:() =>  render_container(render_page('livekit_video')),
  // () =>  render_container(render_page('script_obs')),
}

const render_page = ( phrase) => { 
  if (! phrase in html_pages) throw new Error('page not found')
  const content = html_pages[phrase]
  return `<div class="bg-slate-700 text-white">
  <div>${phrase}</div>
  ${content}
  </div>
  `
}

const port = 8900;
Bun.serve({
  port: port,
  async fetch(req) {
    const url = new URL(req.url);
  //console.log(url.pathname)
    switch (url.pathname) {
      case "/llama-backend/0": return new Response(routes['cognition_engine'](req), { headers: { "Content-Type": "text/html" } });
      case "/llama-backend/1": return new Response(routes['livekit_audio'](req), { headers: { "Content-Type": "text/html" } });
      case "/llama-backend/2": return new Response(routes['replay_analyzer'](req), { headers: { "Content-Type": "text/html" } });
      case "/llama-backend/3": return new Response(routes['logs_viewer'](req), { headers: { "Content-Type": "text/html" } });
      case "/llama-backend/4": return new Response(routes['import_docs'](req), { headers: { "Content-Type": "text/html" } });
      case "/llama-backend/5": return new Response(routes['script_reflect'](req), { headers: { "Content-Type": "text/html" } });

    }

    if (url.pathname.includes("static/")) {
      const filePath = join(staticDir, url.pathname.replace("static/", ""));
      return Bun.file(filePath);
    }

    const api_docs = `
  <div class="bg-blue-500" style="background-color: purple;">
    <h1>API Documentation</h1>
    <p>Welcome to the API documentation for our application.</p>
    <h2>Endpoints</h2>
    <ul>
      <li><strong>GET /api/data</strong> - Retrieve data from the server.</li>
      <li><strong>POST /api/data</strong> - Send data to the server.</li>
    </ul>
  </div>
`
    return new Response(render_container(api_docs), { headers: { "Content-Type": "text/html" } });
  },
});

console.log('running llama-backend on port ' + port);

function render_container(content)  {
  return `
  <head>
  <link rel="stylesheet" href="${staticDir}/css/output.css">
  <style>${css_()}
  </style>
  <title>bunkit livekit server</title>
  </head>
  <body>
  ${content}
  </body>
  `
}
function css_() { return fs.readFileSync(path.join(staticDir, 'css', 'output.css'), 'utf8') }