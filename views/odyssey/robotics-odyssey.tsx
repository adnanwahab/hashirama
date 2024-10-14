import React from 'react';
import Header from './Header';
import ObservablePreview from './ObservablePreview.tsx';
import Footer from './Footer';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
import TeleGuidance from './TeleGuidance';
import DynamicHow from './Dynamichow';
import Box from './Box';

import PowerPoint from "./PowerPoints";


import {useRef, useEffect} from "react";
import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "@roboticsuniversity/agent-dashboard";

function Admin_Panel() {
  const viewofTableRef = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(notebook, name => {
      if (name === "viewof table") return new Inspector(viewofTableRef.current);
    });
    return () => runtime.dispose();
  }, []);

  return (
    <>
      <div className="text-blue-200" ref={viewofTableRef} />
      <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/agent-dashboard@70">Agent Dashboard - Course Gen by roboticsuniversity</a></p>
    </>
  );
}

function RoboticsOdyssey() {
  return (
    <html className="dark">
      <Header />
      <body className="text-gray-950 antialiased bg-slate-900">
        <div className="overflow-hidden flex justify-center items-center min-h-screen">
          <main>
        

          <h1 className="text-white">
            Thanks to BotParty.org + Dynamicland.org!
            </h1>
            <h2 className="text-white"><PowerPoint /></h2>
            
             {/* <TeleGuidance />  */}

        

            {/* <ObservablePreview></ObservablePreview> */}

              {/* <DynamicHow  />  */}



              {/* <Admin_Panel /> */}
              {/* <Box></Box> */}
                  <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}



              {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/_5cga0x8Q9g?si=IljvmBa3RfaxAqEy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */}

export default RoboticsOdyssey;






