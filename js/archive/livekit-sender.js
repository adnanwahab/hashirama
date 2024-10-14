import { AccessToken } from "livekit-server-sdk";
import { serve } from "bun";
import fs from "fs";
import path from "path";

async function publishRobotStream() {
  const apiKey = "APILeUVtb79wzmW";
  const apiSecret = "suWBOvr1tqLDRlNvrDZxpERwl5b02sJ9ZNPEQHw1mnN";
  const host = "wss://omnissiah-university-kmuz0plz.livekit.cloud";
  const roomName = "my-room";
  const identity = "livekit-sender";

  const token = new AccessToken(apiKey, apiSecret, {
    identity: identity,
  });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
  });

  const jwt = await token.toJwt();
  console.log("JWT Token:", jwt);

  // Simulate connecting to a room
  console.log(`Connecting to room: ${roomName} as ${identity}`);

  // Read files in the current directory
  const files = fs.readdirSync("static/");
  console.log("Files:", files);

  files.forEach((file) => {
    //if (fs.statSync(file).isDirectory()) return;
    if (!file.endsWith(".h264") && !file.endsWith(".ivf") && !file.endsWith(".ogg") && !file.endsWith(".mp4")) return console.log('aasdfasdfasdf')

    console.log(`Publishing track: ${file}`);

    // Simulate publishing a track
    console.log(`Track ${file} published with dimensions 640x480`);
  });

  // Simulate waiting for a signal to disconnect
  console.log("Press Ctrl+C to disconnect");
  process.on("SIGINT", () => {
    console.log("Disconnected from room");
    process.exit();
  });
}

publishRobotStream();
