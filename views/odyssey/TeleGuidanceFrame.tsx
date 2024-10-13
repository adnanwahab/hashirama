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
      style={{ backgroundColor: 'white' }}
 
      className="h-80 object-cover object-left w-full"
      src={src}
    ></iframe>
  );
}

export default TeleGuidanceFrame;