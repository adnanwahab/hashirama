import React, { useState } from 'react';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
//import notebook from "@roboticsuniversity/alan_how";
//import notebook2 from "@roboticsuniversity/dynamicland";//"@roboticsuniversity/voxels-diffusion-policy-3d";
// analyze seinfeild - cant be constant comedy - some boring parts -- watch youtube -with vonnegut annotaion - tvroeps is a datum
// kapil gupta was a doctor who discovered presiciptriosn were like sledge hammers for yuor neurons - AUC - attia + sapolsky -> 
// https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable
import {useRef, useEffect} from "react";
import {Runtime, Inspector} from "@observablehq/runtime";

//import notebook from "https://api.observablehq.com/@roboticsuniversity/alan_how?v=4";
//import notebook2 from "https://api.observablehq.com/@roboticsuniversity/dynamicland?v=4";

import notebook from "https://api.observablehq.com/@roboticsuniversity/alan_how.js?v=4";
import define from "https://api.observablehq.com/@roboticsuniversity/dynamicland.js?v=4";

// function Alanhow() {
//   const planeDivRef = useRef();
//   const viewofXRotRef = useRef();
//   const viewofYRotRef = useRef();

//   useEffect(() => {
//     const runtime = new Runtime();
//     runtime.module(notebook, name => {
//       if (name === "planeDiv") return new Inspector(planeDivRef.current);
//       if (name === "viewof xRot") return new Inspector(viewofXRotRef.current);
//       if (name === "viewof yRot") return new Inspector(viewofYRotRef.current);
//     });
//     return () => runtime.dispose();
//   }, []);

//   return (
//     <>
//       <div ref={planeDivRef} />
//       <div ref={viewofXRotRef} />
//       <div ref={viewofYRotRef} />
//       <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/alan_how">ALan - how? by roboticsuniversity</a></p>
//     </>
//   );
// }



const AlanHow = () => {
  const ballRef = useRef(null);

  // Ball Animation Logic
  useEffect(() => {
    let time = 0;
    const animateBall = () => {
      time += 0.05;
      const x = Math.sin(time) * 180;
      const y = Math.cos(time * 1.5) * 50;
      const z = Math.sin(time * 2) * 100 + 100;
      if (ballRef.current) {
        ballRef.current.style.transform = `translateX(${x}px) translateY(${y}px) translateZ(${z}px)`;
      }
      requestAnimationFrame(animateBall);
    };
    animateBall();
  }, []);

  // Inline Styles
  const sceneStyle = {
    position: 'relative',
    width: '500px',
    height: '500px',
    transformStyle: 'preserve-3d',
    animation: 'rotateScene 10s infinite linear',
  };

  const planeStyle = {
    position: 'absolute',
    width: '400px',
    height: '200px',
    backgroundColor: 'teal',
    transform: 'rotateX(45deg) rotateY(45deg) rotateZ(45deg) ',
    "opacity": 0.5
  };

  const ballStyle = {
    position: 'absolute',
    width: '30px',
    height: '30px',
    backgroundColor: 'red',
    borderRadius: '50%',
    transform: 'translateZ(100px)',
  };

  const wallStyle = {
    position: 'absolute',
    width: '400px',
    height: '200px',
    backgroundColor: 'blue',
    transform: 'translateZ(50px)',
    "opacity": 0.5
  };

  const containerStyle = {
    margin: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f8f8',
   
  };

  return (
    <div style={containerStyle}>
      <div> Alan Kay how?</div>
      <div style={sceneStyle}>
        <div style={planeStyle}></div>
        <div ref={ballRef} style={ballStyle}></div>
        <div style={wallStyle}></div>
      </div>
    </div>
  );
};



function DynamicLand() {
  const viewofModuleNameRef = useRef();
  const [index, setIndex] = useState(0);

      useEffect(() => {
        const interval = setInterval(() => {
          setIndex(prevIndex => prevIndex + 1);
        }, 1000);

        return () => clearInterval(interval);
      }, []);



  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(define, name => {
      if (name === "staticDynamicland") return new Inspector(viewofModuleNameRef.current);
      return ["basicRequire","dynamicImport","skypackImport","bundleRun","scavengingForLinks","globalLeaksPattern","pkg"].includes(name);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div ref={viewofModuleNameRef} />
      <img src={`https://files.hashirama.blog/static/blog/seeing/cropped_image_${index}.png`} alt="Cropped Image" />
      {/* <img src="https://files.hashirama.blog/static/blog/animated_gifs/Optimized%20%281%29.gif" alt="Optimized GIF" /> */}
      {/* <img src="https://files.hashirama.blog/static/blog/animated_gifs/samus.jpeg" alt="Samus" /> */}
      <p className="text-green-100">Credit: <a href="https://observablehq.com/@observablehq/module-require-debugger">LIVE KIT = WEBRTC = GREAT</a></p>
    </>
  );
}




function DynamicHow() {

  
    return (
      <div className="bg-slate-900 ">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
  
          <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
        
                
                <AlanHow />
               
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
            </div>
 
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
        
                
                  
              <DynamicLand />


                  
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    )

}
export default DynamicHow;
