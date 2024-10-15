import React from "react";
import Header from "./Header";
import ObservablePreview from "./ObservablePreview.tsx";
import Footer from "./Footer";
import TwitchPlaysPokemonPanel from "./TwitchPlaysPokemonPanel";
import TeleGuidance from "./TeleGuidance";
import DynamicHow from "./Dynamichow";
import PowerPoint from "./PowerPoints";
import Box from "./Box";

function RoboticsOdyssey() {
  return (
    <div className="dark">
      <Header />
      <div className="text-gray-950 antialiased bg-slate-900">
        <div className="overflow-hidden flex justify-center items-center min-h-screen">
          <main>
            <h1 className="text-white">
              Thanks to BotParty.org + Dynamicland.org!
            </h1>

            <div className="border border-white/10">
              {" "}
              <TeleGuidance />{" "}
            </div>
            <div className="border border-white/10">
           
              {/* <ObservablePreview></ObservablePreview>{" "} */}



            </div>
            <div className="border border-white/10">
              {" "}
              <DynamicHow />{" "}
            </div>
            <PowerPoint />
            <Box />
            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
}

{
  /* <iframe width="560" height="315" src="https://www.youtube.com/embed/_5cga0x8Q9g?si=IljvmBa3RfaxAqEy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> */
}

export default RoboticsOdyssey;
