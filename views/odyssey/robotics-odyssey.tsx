import React from 'react';
import Header from './Header';
import ObservablePreview from './ObservablePreview.tsx';
import Footer from './Footer';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
import TeleGuidance from './TeleGuidance';
import DynamicHow from './Dynamichow';


function RoboticsOdyssey() {
  return (
    <html className="dark">
      <Header />
      <body className="text-gray-950 antialiased bg-slate-900">
        <div className="overflow-hidden">
          <main>



            <TeleGuidance />

            <div>
top 3 uses className
1. cleaning up the house
2. feeding stray animals 
3. buidling dynamicland
4. vote here for more new usescases 

            </div>

            <ObservablePreview></ObservablePreview>

              <DynamicHow  />
        
                  <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}




export default RoboticsOdyssey;






