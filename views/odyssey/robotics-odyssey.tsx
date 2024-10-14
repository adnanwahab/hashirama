import React from 'react';
import Header from './Header';
import ObservablePreview from './ObservablePreview.tsx';
import Footer from './Footer';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
import TeleGuidance from './TeleGuidance';
import DynamicHow from './Dynamichow';
import Box from './Box';

function RoboticsOdyssey() {
  return (
    <html className="dark">
      <Header />
      <body className="text-gray-950 antialiased bg-slate-900">
        <div className="overflow-hidden">
          <main>
          <Box></Box>


             <TeleGuidance /> 

        

            <ObservablePreview></ObservablePreview>

              <DynamicHow  /> 

              <iframe width="560" height="315" src="https://www.youtube.com/embed/_5cga0x8Q9g?si=IljvmBa3RfaxAqEy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                  <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}




export default RoboticsOdyssey;






