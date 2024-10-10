// import {
//     AudioFrame,
//     AudioSource,
//     LocalAudioTrack,
//     Room,
//     TrackPublishOptions,
//     TrackSource,
//     dispose,
//   } from '@livekit/rtc-node';
  import { config } from 'dotenv';
  import { AccessToken } from 'livekit-server-sdk';
//   import { readFileSync } from 'node:fs';
//   import { join } from 'node:path';

import { serve } from "bun";
import { LocalParticipant } from 'livekit-client'; // Add import for LocalParticipant

config();

// create access token from API 
const apiKey = 'APIXi25c9hddrpj'
const apiSecret = '1HfgfXWoORWUUN5jM0SxUcLjiGa4HqXJPKZKcvyjkNi'
//const wsUrl = "wss://omnissiah-university-kmuz0plz.livekit.cloud";
const wsUrl = 'wss://omnissiah-university-kmuz0plz.livekit.cloud'



const token = new AccessToken(apiKey, apiSecret, {
  identity: Math.random().toString(36).substring(2, 15)
});
console.log(token)
token.addGrant({
    room: 'example-room',
    roomJoin: true,
    canPublish: true,
  });
const jwt = await token.toJwt();
console.log(jwt, wsUrl);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun LiveKit Server</title>
</head>
<body>
    <h1>Welcome to the Bun ___ Server</h1>
    <div id="livekit-token">${jwt}</div>
    <div id="livekit-ws-url">${wsUrl}</div>

    <p>This is a simple HTML page served by Bun.</p>
    <script type="module">
import {
  createLocalTracks,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  RoomEvent,
  VideoPresets,
  Track,
  LocalTrackPublication,
  LocalParticipant,
  Room
} from 'https://unpkg.com/livekit-client@2.5.7/dist/livekit-client.esm.mjs?module'

const token = document.getElementById("livekit-token").textContent;
const wsUrl = document.getElementById("livekit-ws-url").textContent;
console.log(wsUrl, 12312);

const room = new Room();
room.prepareConnection(wsUrl, token);
await room.connect(wsUrl, token);

// Create local tracks with back-facing camera
const localTracks = await createLocalTracks({
  video: { facingMode: { exact: "environment" } } // Use back-facing camera
});

localTracks.forEach(track => {
  room.localParticipant.publishTrack(track);
});

room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  console.log('Track Subscribed:', track, publication, participant);
  if (track.kind === 'video' || track.kind === 'audio') {
    // attach it to a new HTMLVideoElement or HTMLAudioElement
    const element = track.attach();
    document.body.appendChild(element);
  }
});

room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
  console.log('Track Unsubscribed:', track, publication, participant);
  track.detach();
});

room.on(RoomEvent.ParticipantJoined, (participant) => {
  console.log('Participant Joined:', participant);
});

room.on(RoomEvent.ParticipantLeft, (participant) => {
  console.log('Participant Left:', participant);
});

room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
  console.log('Active Speakers Changed:', speakers);
});

room.on(RoomEvent.Disconnected, () => {
    

  console.log('Disconnected from room');
});
console.log('room', room)


function handleTrackSubscribed(track, publication, participant) {

console.log(track, publication, participant)
  if (track.kind === 'video' || track.kind === 'audio') {
    const element = track.attach();
    document.body.appendChild(element);
  }
}

function handleTrackUnsubscribed(track, publication, participant) {
  track.detach();
}

function handleDisconnect() {
  console.log('disconnected from room');
}
    </script>
</body>
</html>
`;



serve({
  fetch(req) {
    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
  port: 3004, // You can change the port if needed
});

console.log("Bun server is running on http://localhost:3002");
