import React from 'react';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
import {useRef, useEffect, useState} from 'react';
import { Runtime, Inspector } from  "@observablehq/runtime"
import notebook1 from "@roboticsuniversity/livekit";
import notebook2 from "@roboticsuniversity/robotics-hardware";
import notebook3 from "@roboticsuniversity/voxels-diffusion-policy-3d";//"@roboticsuniversity/voxels-diffusion-policy-3d";

function Livekit() {
  const lOGORef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook1, name => {
      console.log(name)
      if (name === "LOGO") return new Inspector(lOGORef.current);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={lOGORef} />
      <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/livekit@132">TeleGuidance - Cooperative Robotics Control by roboticsuniversity</a></p>
    </>
  );
}
function RoboticsHardware() {
  const viewofModuleNameRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook1, name => {
      if (name === "viewof moduleName") return new Inspector(viewofModuleNameRef.current);
      return ["basicRequire","dynamicImport","skypackImport","bundleRun","scavengingForLinks","globalLeaksPattern","pkg"].includes(name);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={viewofModuleNameRef} />
      <p className="text-green-100">Credit: <a href="https://observablehq.com/@observablehq/module-require-debugger">LIVE KIT = WEBRTC = GREAT</a></p>
    </>
  );
}

function DiffusionVoxelPointCloud() {
  const viewofModuleNameRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook1, name => {
      if (name === "viewof moduleName") return new Inspector(viewofModuleNameRef.current);
      return ["basicRequire","dynamicImport","skypackImport","bundleRun","scavengingForLinks","globalLeaksPattern","pkg"].includes(name);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={viewofModuleNameRef} />
      <p className="text-green-100">Credit: <a href="https://observablehq.com/@observablehq/module-require-debugger">LIVE KIT = WEBRTC = GREAT</a></p>
    </>
  );
}
function TeleGuidance() {
  const list_of_links = [
    "https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*",
    "https://observablehq.com/embed/@roboticsuniversity/robotics-hardware?cell=*",
    "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",
    
  ]
  return (
    <div className="bg-gray-900 ">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        {/* <h2 className="text-base font-semibold text-indigo-400">Deploy faster</h2> */}
        <p className="mt-2 max-w-lg text-4xl font-medium tracking-tight text-white sm:text-5xl">
          {/* Everything you need to deploy your app. */}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="lg:col-span-4 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
    
      <Livekit />
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Releases</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Push to deploy</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida justo et nulla efficitur, maximus
                egestas sem pellentesque.
              </p>
            </div> */}
          </div>
          <div className="lg:col-span-2 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
            <TwitchPlaysPokemonPanel/>

            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Integrations</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Connect your favorite tools</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Curabitur auctor, ex quis auctor venenatis, eros arcu rhoncus massa.
              </p>
            </div> */}
          </div>
          <div className="lg:col-span-2 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">

            <RoboticsHardware/>

              {/* draw -> it becomes a nanousar  -> gen 3 diagrams -> explorable */}

              {/* <TeleGuidanceFrame link={list_of_links[2]}/> */}
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Security</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Advanced access control</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.
              </p>
            </div> */}
          </div>
          <div className="lg:col-span-4 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
            <DiffusionVoxelPointCloud/>

            {/* <ModuleRequireDebugger /> */}
              {/* <TeleGuidanceFrame link={list_of_links[3]}/> */}
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Performance</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Lightning-fast builds</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Sed congue eros non finibus molestie. Vestibulum euismod augue vel commodo vulputate. Maecenas at
                augue sed elit dictum vulputate.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}



//https://github.com/Erkaman/regl-cnn



export default TeleGuidance;


//yarn add "https://api.observablehq.com/@observablehq/module-require-debugger.tgz?v=3"


//bun add "https://api.observablehq.com/@roboticsuniversity/livekit.tgz?v=3"

import notebook16 from "@roboticsuniversity/dynamicland";
//import notebook8 from "@roboticsuniversity/agent-dashboard";

// prompt - make a puzzle peiece in css
//import TeleGuidanceFrame from './TeleGuidanceFrame';
// import json from './example.json'
// const modules = import.meta.glob('./dir/*.js')
// import init from './example.wasm?init'
// https://v3.vitejs.dev/guide/using-plugins.html
// /Users/shelbernstein/homelab_status_page/views/odyssey/human_robot.txt

//const TwitchPlaysPokemonPanel = React.lazy(() => import("./TwitchPlaysPokemonPanel"));
// import notebook4 from "@roboticsuniversity/3-planning-prediction";
// import notebook5 from "@roboticsuniversity/collaborative-ui-twitch-plays-robot";
// import notebook6 from "@roboticsuniversity/dynamicland";
// import notebook7 from "@roboticsuniversity/alan_how";
// import notebook8 from "@roboticsuniversity/5000-research-papers";
// import notebook9 from "@roboticsuniversity/infrastructure-notebook";
// import notebook10 from "@roboticsuniversity/collaborative-ui-twitch-plays-robot";
// import notebook11 from "@roboticsuniversity/dynamicland";
// import notebook12 from "@roboticsuniversity/alan_how";
// import notebook13 from "@roboticsuniversity/5000-research-papers";
// import notebook14 from "@roboticsuniversity/infrastructure-notebook";


const get_links = () =>    $$('.listing-grid > * ').map(_=> _.firstElementChild.querySelector('a').href)

const list_of_links = [
  "https://observablehq.com/@roboticsuniversity/5000-research-papers?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/infrastructure-notebook?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/collaborative-ui-twitch-plays-robot?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/dynamicland?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/livekit?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/alan_how?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/robotics-hardware?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/3-planning-prediction?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d?collection=@roboticsuniversity/robotics-odyssey"
]

// // bun add "https://api.observablehq.com/@roboticsuniversity/5000-research-papers.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/infrastructure-notebook.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/collaborative-ui-twitch-plays-robot.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/dynamicland.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/livekit.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/alan_how.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/robotics-hardware.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/3-planning-prediction.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d.tgz"

