import React from 'react';
import TwitchPlaysPokemonPanel from './TwitchPlaysPokemonPanel';
import {useRef, useEffect, useState} from 'react';
//import TeleGuidanceFrame from './TeleGuidanceFrame';


//const TwitchPlaysPokemonPanel = React.lazy(() => import("./TwitchPlaysPokemonPanel"));


function TwitchPlays () {
  return <TwitchPlaysPokemonPanel/>
//   return  <React.Suspense fallback={<div>Loading...</div>}>
// <TwitchPlaysPokemonPanel/>
// </React.Suspense>

}
function TeleGuidanceFrame(props) {
  let  src = props.link;
  
console.log("returning iframe", src)
 //src = "https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*"
  return (
    <iframe
      style={{ backgroundColor: 'white' }}
 
      className="h-full object-cover object-left w-full"
      src={src}
    ></iframe>
  );
}
//https://github.com/Erkaman/regl-cnn
function Whiteboard(){
  return <iframe
  style={{ backgroundColor: 'white' }}

  className="h-full object-cover object-left w-full"
  src="https://observablehq.com/embed/@roboticsuniversity/robotics-hardware?cells=*"
></iframe>



  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [firstPoint, setFirstPoint] = useState<any>(null);
  const [lastPoint, setLastPoint] = useState<any>(null);
  const [painting, setPainting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.backgroundColor = "white";
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctxRef.current = ctx;
    }
  }, []);

  const calculateDirection = (start: any, end: any) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const radians = Math.atan2(deltaY, deltaX);
    const degrees = radians * (180 / Math.PI);
    return degrees;
  };

  const startPosition = (e: any) => {
    setPainting(true);
    setFirstPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    draw(e);
  };

  const endPosition = () => {
    setPainting(false);
    ctxRef.current?.beginPath(); // Reset path
    if (firstPoint && lastPoint) {
      const direction = calculateDirection(firstPoint, lastPoint);
      window.direction = direction;
      console.log('Direction from first to last point: ' + direction);
    }
  };

  const draw = (e: any) => {
    if (!painting) return;
    setLastPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });

    if (ctxRef.current) {
      ctxRef.current.lineWidth = 5000;
      ctxRef.current.lineCap = 'round';
      ctxRef.current.strokeStyle = 'blue';
    }

    ctxRef.current?.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current?.stroke();
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const clearCanvas = () => {
    //ctxRef.current?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
  };

  // const saveImage = () => {
  //   const link = document.createElement('a');
  //   link.download = 'whiteboard.png';
  //   link.href = canvasRef.current?.toDataURL('image/png').replace('image/png', 'image/octet-stream');
  //   link.click();
  // };

  return (
    <div>
      <canvas style={{backgroundColor: "white"}} ref={canvasRef} width={500} height={500} onMouseDown={startPosition} onMouseUp={endPosition} onMouseMove={draw} />
      {/* <button onClick={clearCanvas}>Clear</button>
      <button onClick={saveImage}>Save</button> */}
    </div>
  );
}

//const RoboticsOdyssey = React.lazy(() => import("../views/odyssey/robotics-odyssey.tsx"));



function TeleGuidance() {
  const list_of_links = [
    "https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*",
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
            <TwitchPlays/>
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

            <Whiteboard/>
              {/* draw -> it becomes a nanousar  -> gen 3 diagrams -> explorable */}

              {/* <TeleGuidanceFrame link={list_of_links[2]}/> */}
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