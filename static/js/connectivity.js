

// const audioTrack = await room.localParticipant.createAudioTrack();
// room.localParticipant.publishTrack(audioTrack);

// // Access the webcam video stream
// const videoTrack = await room.localParticipant.createVideoTrack({
//   frameRate: 24,
//   width: 640,
//   height: 480,
// });

// // Publish the video track to the room
// room.localParticipant.publishTrack(videoTrack);



//const room = new Room();

// Connect to LiveKit server

// Get local audio track
//const audioTrack = await room.localParticipant.createAudioTrack();

// Start audio transmission
//room.localParticipant.publishTrack(audioTrack);

// Set up audio processing
// const audioContext = new AudioContext();
// const source = audioContext.createMediaStreamSource(
//   audioTrack.mediaStream,
// );
// const processor = audioContext.createScriptProcessor(1024, 1, 1);

// source.connect(processor);
// processor.connect(audioContext.destination);

// let audioChunks = [];

// processor.onaudioprocess = (e) => {
//   const inputData = e.inputBuffer.getChannelData(0);
//   audioChunks.push(...inputData);

//   // Send audio chunks to server every 5 seconds
//   if (audioChunks.length > audioContext.sampleRate * 5) {
//     sendAudioToServer(audioChunks);
//     audioChunks = [];
//   }
// };

// async function sendAudioToServer(audioData) {
//   const blob = new Blob([Float32Array.from(audioData)], {
//     type: "audio/wav",
//   });
//   const formData = new FormData();
//   formData.append("audio", blob, "speech.wav");

//   try {
//     const response = await fetch("http://localhost:3000/whisper", {
//       method: "POST",
//       body: formData,
//     });
//     const transcript = await response.text();
//     console.log("Transcript:", transcript);
//   } catch (error) {
//     console.error("Error sending audio to server:", error);
//   }
// }
// vue code animation - reshuffles code + shuffles -
// const token = await response.text();
// console.log("token", token);

//const url = wsURL;

// async function beginStream() {
//   const pubishStream = await fetch("/begin-stream");
//   console.log(await pubishStream.text());
// }
// beginStream();
// setInterval(function () {
//   beginStream();
// }, 20 * 1000);

// function applyProps(videoElement, track) {
//   videoElement.loop = true;
//   videoElement.autoplay = true;
//   videoElement.muted = true;
//   videoElement.controls = true;
//   //document.body.appendChild(videoElement);
//   track.attach(videoElement);
// }

// Function to handle remote tracks
// function handleTrackSubscribed(track, publication, participant) {
//   console.log(track);
//   if (track.kind === "video") {
//     //const videoElement = document.createElement("video");
//     const videoElement = document.querySelector("video.one");
//     const videoElementTwo = document.querySelector("video.two");

//     applyProps(videoElement, track);
//     //applyProps(videoElementTwo, track);
//   }
// }
//const room = new Room();

// Function to connect to the room and subscribe to a specific track
// async function connectAndSubscribe() {
//   try {
//     room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

//     await room.connect(url, token);
//     console.log("Connected to room:", room.name);
//     room.on("participantConnected", (participant) => {
//       console.log("A RemoteParticipant joined:", participant);
//     });

//     room.on("participantDisconnected", (participant) => {
//       console.log("A RemoteParticipant left:", participant);
//     });

//     // Connection Events
//     room.on("reconnecting", () => {
//       console.log("Reconnecting to the server...");
//     });

//     room.on("reconnected", () => {
//       console.log("Reconnection successful.");
//     });

//     room.on("disconnected", () => {
//       console.log("Disconnected from the room.");
//     });

//     // Track Events
//     room.on("trackPublished", (track, publication, participant) => {
//       console.log("A new track was published:", track);
//     });

//     room.on("trackUnpublished", (track, publication, participant) => {
//       console.log("A track was unpublished:", track);
//     });

//     // room.on('trackSubscribed', (track, publication, participant) => {
//     //   console.log('Subscribed to a track:', track);
//     // });

//     room.on("trackUnsubscribed", (track, publication, participant) => {
//       console.log("Unsubscribed from a track:", track);
//     });

//     room.on("trackMuted", (publication, participant) => {
//       console.log("A track was muted:", publication);
//     });

//     room.on("trackUnmuted", (publication, participant) => {
//       console.log("A track was unmuted:", publication);
//     });

//     room.on("localTrackPublished", (publication) => {
//       console.log("A local track was published successfully:", publication);
//     });

//     room.on("localTrackUnpublished", (publication) => {
//       console.log("A local track was unpublished:", publication);
//     });

//     // Speaker Events
//     room.on("activeSpeakersChanged", (speakers) => {
//       console.log("Active speakers changed:", speakers);
//     });

//     room.on("isSpeakingChanged", (participant, speaking) => {
//       console.log(
//         "Participant speaking status changed:",
//         participant,
//         "is speaking:",
//         speaking,
//       );
//     });

//     // Connection Quality Events
//     room.on("connectionQualityChanged", (participant, quality) => {
//       console.log(
//         "Connection quality changed for participant:",
//         participant,
//         "Quality:",
//         quality,
//       );
//     });

//     // Metadata Events
//     room.on("participantMetadataChanged", (participant, metadata) => {
//       console.log(
//         "Participant metadata changed:",
//         participant,
//         "New metadata:",
//         metadata,
//       );
//     });

//     room.on("roomMetadataChanged", (metadata) => {
//       console.log("Room metadata changed:", metadata);
//     });

//     // Data Events
//     room.on("dataReceived", (payload, participant) => {
//       console.log(
//         "Data received from participant:",
//         participant,
//         "Payload:",
//         payload,
//       );
//     });

//     // Track State Events
//     room.on("trackStreamStateChanged", (publication, streamState) => {
//       console.log(
//         "Track stream state changed:",
//         publication,
//         "State:",
//         streamState,
//       );
//     });

//     room.on("trackSubscriptionPermissionChanged", (publication, permission) => {
//       console.log(
//         "Track subscription permission changed:",
//         publication,
//         "Permission:",
//         permission,
//       );
//     });

//     // Permissions Events
//     room.on("participantPermissionsChanged", (participant, permissions) => {
//       console.log(
//         "Participant permissions changed:",
//         participant,
//         "New permissions:",
//         permissions,
//       );
//     });

//     // Hardcoded track and participant SIDs
//     const trackSid = "TR_XXXXXXXXXXXXXXXX"; // Replace with actual Track SID
//     const participantSid = "file-publisher";

//     // Subscribe to the specific track
//     if (room.subscribeToTrack)
//       await room.subscribeToTrack(trackSid, {
//         participantIdentity: participantSid,
//       });
//   } catch (error) {
//     console.error("Error connecting to room or subscribing to track:", error);
//   }
// }

// await connectAndSubscribe();
