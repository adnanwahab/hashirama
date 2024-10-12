import {disposable} from "./disposable.js";
//import {disposable} from "./disposable.js";
//visaulize the git history to understand why it is the way it is.

export function worker(source) {
  const url = URL.createObjectURL(
    new Blob([source], {type: "text/javascript"})
  );
  const worker = new Worker(url);

  return disposable(worker, () => {
    worker.terminate();
    URL.revokeObjectURL(url);
  });
}

const exec_web_worker_on_bun = (source) => `
  console.log("still in browser");
  fetch("http://localhost:8000/observable-server?runtime=bun", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ${source} })
  }).then(_ => { return _.json()})
  .then(json => { console.log("server responded with ", json) })
    console.log("in browser still");
  `;


  const exec_web_worker_on_deno = (source) => `
  console.log("still in browser");
  fetch("http://localhost:8000/observable-server?runtime=deno", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ${source} })
  }).then(_ => { return _.json()})
  .then(json => { console.log("server responded with ", json) })
    console.log("in browser still");
  `;


  //import their docs - kirby-docs - show you executable cells of all the thingsies - do 10 cos - buundays
// async - juyper - does is exist ? if not - use obs - and make multiplagne x 5 
//bun``
const bun_should_look_likethis =`
const path = "/path/to/package.json";
const file = Bun.file(path);

const contents = await file.json();
// { name: "my-package" }

file.type; // 
`

let deno_should_look_likethis = `
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";

const server = serve({ port: 8000 });

for await (const req of server) {
  req.respond({ body: "Hello World" });
}
`

//import dmeos /// ?? llm as is 
deno_should_look_likethis = `

import * as mod from "node:fs";
const bytes = await Deno.readFile("hello.txt");
const text = await Deno.readTextFile("hello.txt");
const file = await Deno.open("hello.txt");
const buffer = new Uint8Array(5);
const bytesRead = await file.read(buffer);
console.log('Read '+ bytesRead +' + 'bytes');
const pos = await file.seek(6, Deno.SeekMode.Start);
console.log('Sought to position ' + pos);
const buffer2 = new Uint8Array(2);
const bytesRead2 = await file.read(buffer2);
console.log('Read' + bytesRead2 +'bytes');
await file.seek(0, Deno.SeekMode.Start);
file.close();
Deno.readFileSync("hello.txt");
Deno.readTextFileSync("hello.txt");
const f = Deno.openSync("hello.txt");
f.seekSync(6, Deno.SeekMode.Start);
const buf = new Uint8Array(5);
f.readSync(buf);
f.close();



`





console.log(123123);
export function _worker(source, isServer = false) {
  if (isServer) {
    source = exec_web_worker_on_server(source);
  }

  console.log("forked observable for server-side js");

  const url = URL.createObjectURL(
    new Blob([source], {type: "text/javascript"})
  );

  const worker = new Worker(url);
  worker.onerror = (err) => {
    console.error("Error in Web Worker:", err);
  };

  return disposable(worker, () => {
    worker.terminate();
    URL.revokeObjectURL(url);
  });
}

export function worker_hashirama(source, is_deno_or_bun = false) {
  const is_bun = is_deno_or_bun === 'bun'
  const is_deno = is_deno_or_bun === 'deno'

  if (is_bun) {
    source = exec_web_worker_on_bun(source);
  }

  if (is_deno) {
    source = exec_web_worker_on_deno(source);
  }

  //console.log("forked observable for server-side js");

  const url = URL.createObjectURL(
    new Blob([source], {type: "text/javascript"})
  );

  const worker = new Worker(url);
  worker.onerror = (err) => {
    console.error("Error in Web Worker:", err);
  };

  return disposable(worker, () => {
    worker.terminate();
    URL.revokeObjectURL(url);
  });
}


















// sat = make up for friday  by - therapized-overhawul + rewind girl = super lemiollion 




//make it so infra can be as easy to automate as ui - write a dvi - write a cache in valdiaion server - (ui+ai)i in the heart of the OS = karpathy 's dream ----- make his life easier - email 10 people ask for thouhtfs on sunday - then setokr - he lieks 10 happy users - liek gameil

//server doesmtime slightly more difficutl than - uI = bc cant rollface to working ui - etc 
// code is data + data is code = sicp - meta-circulator - meta-mathemgatical = obs
//add 10% to obs - 5 lines of code



// what cant replit do - stacklbitz etc = what does obs land need - find feedback and - reactive - server -  - talstislcae ui doesnt refresh 
//, bun, deno , python, ??? (zig, )