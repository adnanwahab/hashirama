import React from 'react';

function ObservablePreview() {
return (
  <div className="overflow-hidden">
    <div className="pb-24 px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        {/* <h2 className="max-w-3xl text-pretty text-4xl font-medium tracking-tighter text-gray-950 data-[dark]:text-white sm:text-6xl">
          A snapshot of your entire sales pipeline.
        </h2> */}
        <div
          style={{ "--width": 1216, "--height": 768 }}
          className="mt-16 h-[36rem] sm:h-auto sm:w-[76rem] relative aspect-[var(--width)/var(--height)] [--radius:theme(borderRadius.xl)]"
        >
          {/* <img
            alt=""
            src="https://radiant.tailwindui.com/screenshots/app.png"
            className="h-full rounded-[var(--radius)] shadow-2xl ring-1 ring-black/10"
          /> */}
          <iframe className="h-full w-full" src="https://roboticsuniversity.observablehq.cloud/robotics-odyssey/"></iframe>
        </div>
      </div>
    </div>
  </div>
);

}

export default ObservablePreview;