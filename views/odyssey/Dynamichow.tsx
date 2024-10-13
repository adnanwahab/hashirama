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
 
      className="border border-white/10 h-80 object-cover object-left w-full"
      src={src}
    ></iframe>
  );
}


function DynamicHow() {
  const second_bento = [
    'https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*',
    'https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*',
  ]
  
    return (
      <div className="bg-slate-900 ">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
  
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
               
                </div>
                
                <TeleGuidanceFrame link={second_bento[0]}/>

               
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
            </div>
 
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
        
                
                  
                  <TeleGuidanceFrame link={second_bento[0]}/>


                  
                
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    )

}
export default DynamicHow;
