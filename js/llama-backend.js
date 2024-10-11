const staticDir = join('static/');
import { join } from 'node:path';
const fs = require('fs');
const path = require('path');

const goodOnesDir = join('views', 'good_ones');

const routes = [
  'livekit_audio',
  'cognition_engine',
  'replay_analyzer',
  'logs_viewer',
  'import_docs',
  'script_obs',
  'for_jp',
  "index",
  'api_docs',
]

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
const port = 8900;
Bun.serve({
  port: port,
  async fetch(req) {
    let url = new URL(req.url).pathname;
    console.log('url', url);
    if (url === '/') url = 'index';
    return new Response(render_page(url), { headers: { "Content-Type": "text/html" } });
  },
});

console.log('running llama-backend on port ' + port);
