import React from "react";
import TwitchPlaysPokemonPanel from "./TwitchPlaysPokemonPanel";
import { useRef, useEffect, useState } from "react";
//import { Runtime, Inspector } from  "@observablehq/runtime"
//import notebook1 from "@roboticsuniversity/livekit";
// btw i publish my rewind.ai, reflect.app, and more daialy to a public folder 4 fun - like carmack.plna - hope to be like him in 25 years like jiro dreams of sushi guy making his first souffle 
import {
  Runtime,
  Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import define from "https://api.observablehq.com/@roboticsuniversity/livekit.js?v=4";
import define2 from "https://api.observablehq.com/@roboticsuniversity/robotics-hardware.js?v=4";
//import define3 from "https://api.observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d.js?v=4";
//import define3 from "https://api.observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d@84.js?v=6";

// v??? - -- adsf
import VoxelNotebook from "https://api.observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d@88.js?v=4";


//import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
import voxelpainter from "https://api.observablehq.com/@roboticsuniversity/alanthree.js?v=4";
// new Runtime().module(define, name => {
//   if (name === "pointerAndObjects") return new Inspector(document.querySelector("#observablehq-pointerAndObjects-cd3c836e"));
// });

function VoxelPainter() {

    const pointerAndObjectsRef = useRef();
  
    useEffect(() => {
      const runtime = new Runtime();
      runtime.module(voxelpainter, name => {
        if (name === "pointerAndObjects") return new Inspector(pointerAndObjectsRef.current);
      });
      return () => runtime.dispose();
    }, []);
  
    return (
      <>
        <div ref={pointerAndObjectsRef} />
        <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/alanthree">Three.js by roboticsuniversity</a></p>
      </>
    );
  }

function Livekit() {
  const lOGORef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(define, (name) => {
      //console.log(name);
      if (name === "LOGO") return new Inspector(lOGORef.current);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={lOGORef} />
      <p>
        Credit:{" "}
        <a href="https://observablehq.com/@roboticsuniversity/livekit@132">
          TeleGuidance - Cooperative Robotics Control by roboticsuniversity
        </a>
      </p>
    </>
  );
}

// import notebook2 from "@roboticsuniversity/robotics-hardware";

import { Tldraw, TldrawApp, TDDocument } from '@tldraw/tldraw';

import 'tldraw/tldraw.css'

 function Whiteboard() {
  const handleMount = (app: TldrawApp) => {

  //app.selectTool('pencil'); 

  // Hide all unnecessary controls like UI, panels, etc.
  // app.updateSettings({
  //   isReadonly: true, // Disable interactions that aren't drawing.
  //   showPages: false, // Hide pages panel.
  //   showMenu: false,  // Hide the top menu.
  //   showStyles: false, // Hide style panel.
  //   showZoom: false,  // Hide zoom controls.
  //   showMultiplayerMenu: false, // Hide multiplayer options.
  //   showStatusBar: false, // Hide the status bar.
  // });
};
	return (
		<div style={{ width: '300px', height: '300px',  inset: 0 }}>
		 <Tldraw
      autofocus // Optional: Focus on the canvas automatically.
      disableAssets={true} // Disable assets upload.
      showUI={false} // Hide the general UI.
      onMount={handleMount} // Set up the app with custom behavior.
    />
		</div>
	)
}


function RoboticsHardware() {
  const viewofModuleNameRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(define2, (name) => {
      if (name === "LOGO") return new Inspector(viewofModuleNameRef.current);
      //console.log(name);
      //if (name === "viewof moduleName") return new Inspector(viewofModuleNameRef.current);
      return [
        "basicRequire",
        "dynamicImport",
        "skypackImport",
        "bundleRun",
        "scavengingForLinks",
        "globalLeaksPattern",
        "pkg",
      ].includes(name);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
          <Whiteboard />

      <div ref={viewofModuleNameRef} />
      <p className="text-green-100">
        Credit:{" "}
        <a href="https://observablehq.com/@observablehq/module-require-debugger">
          LIVE KIT = WEBRTC = GREAT
        </a>
      </p>
    </>
  );
}
// }https://github.com/tldraw/tldraw
// https://files.hashirama.blog/static/blog/maze.gif
// https://files.hashirama.blog/static/blog/health_wealth.gif
// https://files.hashirama.blog/static/blog/zed_sensor.gif

// https://files.hashirama.blog/static/blog/arm-day1.gif
function DiffusionVoxelPointCloud() {
  const lOGORef = useRef();
  const nOTCHRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(VoxelNotebook, name => {
      if (name === "NOTCH") return new Inspector(nOTCHRef.current);
      if (name === "LOGO") return new Inspector(lOGORef.current);

    });
    return () => runtime.dispose();
  }, []);
  
  //return <></>
  return (
    <>
      <VoxelPainter />
      <div ref={nOTCHRef} />
      <div ref={lOGORef} />

      {/* <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d@88">Voxels + diffusion-policy-3d by roboticsuniversity</a></p> */}
    </>
  );

  // https://files.hashirama.blog/static/blog/animated_gifs/Animated%20GIF%20optimizer.gif
}



function TeleGuidance() {
  const list_of_links = [
    "https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*",
    "https://observablehq.com/embed/@roboticsuniversity/robotics-hardware?cell=*",
    "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",
  ];
  return (
    <div className="bg-gray-900 ">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="mt-2 max-w-lg text-4xl font-medium tracking-tight text-white sm:text-5xl"></p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">


          
          <div className="lg:col-span-4 flex flex-col rounded-lg bg-gray-800 overflow-hidden" style={{ maxHeight: '50vh' }}>
              <Livekit />
          </div>
          <div className="lg:col-span-2 flex flex-col rounded-lg bg-gray-800 overflow-hidden" style={{ maxHeight: '50vh' }}>
            <TwitchPlaysPokemonPanel/>
          </div>
          <div className="lg:col-span-2 flex flex-col rounded-lg bg-gray-800 overflow-hidden" style={{ maxHeight: '50vh' }}>
            <RoboticsHardware />

            {/* <TeleGuidanceFrame link={list_of_links[2]}/> */}
          </div>
          <div className="lg:col-span-4 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
          <iframe width="900px" height="500px" frameborder="0"
  src="https://observablehq.com/embed/@roboticsuniversity/alanthree?cell=*"></iframe>
            
            <DiffusionVoxelPointCloud />
          </div>
        </div>
      </div>
    </div>
  );
}


// "The less confident you are, the more serious you have to act."
//"“At every period of history, people have believed things that were just ridiculous, and believed them so strongly that you risked ostracism or even violence by saying otherwise. If our own time were any different, that would be remarkable. As far as I can tell it isn't.”"

const pg = `“Let's start with a test: Do you have any opinions that you would be reluctant to express in front of a group of your peers?

If the answer is no, you might want to stop and think about that. If everything you believe is something you're supposed to believe, could that possibly be a coincidence? Odds are it isn't. Odds are you just think whatever you're told.”`

// import React, {useRef, useEffect} from "react";
// import {Runtime, Inspector} from "@observablehq/runtime";
//import alanthree from "@roboticsuniversity/alanthree";
//import alanthree from "https://api.observablehq.com/@roboticsuniversity/alanthree.js?v= ";
import alanthree from "https://api.observablehq.com/@roboticsuniversity/alanthree.js?v=4";

function Alanthree() {
  const ref = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(alanthree, Inspector.into(ref.current));
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={ref} />
      <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/alanthree">Three.js by roboticsuniversity</a></p>
    </>
  );
}

//export default Alanthree;

//https://github.com/Erkaman/regl-cnn
// blip - see conosole - import 
export default TeleGuidance;

//yarn add "https://api.observablehq.com/@observablehq/module-require-debugger.tgz?v=3"

//bun add "https://api.observablehq.com/@roboticsuniversity/livekit.tgz?v=3"
//import notebook16 from "@roboticsuniversity/dynamicland";
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

const get_links = () =>
  $$(".listing-grid > * ").map(
    (_) => _.firstElementChild.querySelector("a").href,
  );

const list_of_links = [
  "https://observablehq.com/@roboticsuniversity/5000-research-papers?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/infrastructure-notebook?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/collaborative-ui-twitch-plays-robot?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/dynamicland?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/livekit?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/alan_how?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/robotics-hardware?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/3-planning-prediction?collection=@roboticsuniversity/robotics-odyssey",
  "https://observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d?collection=@roboticsuniversity/robotics-odyssey",
];

// // bun add "https://api.observablehq.com/@roboticsuniversity/5000-research-papers.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/infrastructure-notebook.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/collaborative-ui-twitch-plays-robot.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/dynamicland.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/livekit.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/alan_how.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/robotics-hardware.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/3-planning-prediction.tgz"
// bun add "https://api.observablehq.com/@roboticsuniversity/voxels-diffusion-policy-3d.tgz"
