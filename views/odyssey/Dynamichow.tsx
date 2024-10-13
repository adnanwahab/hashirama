import React from 'react';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';

function TeleGuidanceFrame(props) {
  let  src = props.link;
  if (typeof src === 'function') {
    console.log("returning twitch pane")
   return <TwitchPlaysPokemonPanel/>
  }
console.log("returning iframe", src)
 //src = "https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*"
  return (
    <iframe
 
      className="border border-white/10 h-96 object-cover object-left w-full"
      src={src}
    ></iframe>
  );
}


// import {useRef, useEffect} from "react";
// import {Runtime, Inspector} from "@observablehq/runtime";
// import notebook from "@roboticsuniversity/alan_how";
// function Alanhow() {
//   // const ref = useRef();

//   // useEffect(() => {
//   //   const runtime = new Runtime();
//   //   runtime.module(notebook, Inspector.into(ref.current));
//   //   return () => runtime.dispose();
//   // }, []);

//   return (
//     <>
//       {/* <div ref={ref} /> */}
//       <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/alan_how@110">ALan - how? by roboticsuniversity</a></p>
//     </>
//   );
// }


// export default Alanhow;


function Alanhow() {}

function DynamicHow() {
  const second_bento = [
    'https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*',
    'https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*',
  ]
  
    return (
      <div className="bg-slate-900 ">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
  
          <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
        
                <TeleGuidanceFrame link={second_bento[0]}/>

               
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
            </div>
 
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
        
                
                  
              <Alanhow />


                  
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    )

}
export default DynamicHow;
