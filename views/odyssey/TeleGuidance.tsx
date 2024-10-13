import React from 'react';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
import TeleGuidanceFrame from './TeleGuidanceFrame';


function TeleGuidance() {
  const list_of_links = [
    "https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*",
    TwitchPlaysPokemonPanel,
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
            <iframe
      style={{ backgroundColor: 'white' }}
 
      className="h-full object-cover object-left w-full"
      src={"https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*"}
      ></iframe>
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
              <TeleGuidanceFrame link={list_of_links[1]}/>
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
              <TeleGuidanceFrame link={list_of_links[2]}/>
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
              <TeleGuidanceFrame link={list_of_links[3]}/>
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






export default TeleGuidance;