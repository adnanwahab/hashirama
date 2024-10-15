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
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//joshua bloch - get a comment - re-organizer - llm
async function connect() {
    const data = { identity: "worrydream" + Math.random() }
    const post_data_options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
    }
    const {wsUrl, token} = await d3.json('connect', post_data_options)
    if (wsUrl === '404') {
        console.log('404')
        throw new Error('404')
    }
    console.log(wsUrl, token)

    return {wsUrl, token}
}

async function initializeRoom() {
    const connection = await connect();
    console.log('render audio to particles');

    const room = new Room();
    room.prepareConnection(connection.wsUrl, connection.token);
    await room.connect(connection.wsUrl, connection.token);

    const localParticipant = room.localParticipant;
    // publish local camera and mic tracks
    await localParticipant.enableCameraAndMicrophone();
    // ... existing event listeners and functions ...
    const tracks = await createLocalTracks({
        audio: true,
        video: true,
        //facingMode: { exact: "environment" } // Use the environment (rear-facing) camera
    });

    // Render local camera track before publishing
    const localVideoElement = document.createElement('video');
    localVideoElement.autoplay = true;
    localVideoElement.muted = true;
    localVideoElement.srcObject = new MediaStream([tracks[0].mediaStreamTrack]); // Assuming video track is at index 1
    document.body.appendChild(localVideoElement);
}

initializeRoom().catch(console.error);
