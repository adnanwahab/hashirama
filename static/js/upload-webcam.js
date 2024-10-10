import {
  Room,
  RoomEvent,
  VideoPresets,
  Track,
} from "https://unpkg.com/livekit-client@2.5.4/dist/livekit-client.esm.mjs?module";
// creates a new room with options
console.log("click");
document.body.addEventListener("click", handleClick);
async function handleClick() {
  console.log("click");

  // const saveStream = await fetch("/save-stream");
  // console.log("storage", await saveStream.text());

  const room = new Room({
    // automatically manage subscribed video quality
    adaptiveStream: true,
    // optimize publishing bandwidth and CPU for published tracks
    dynacast: true,
    // default capture settings
    videoCaptureDefaults: {
      resolution: VideoPresets.h720.resolution,
    },
  });
  const url = "wss://omnissiah-university-kmuz0plz.livekit.cloud";
  const response = await fetch("/getToken");
  const token = await response.text();
  console.log("token", token);
  // pre-warm connection, this can be called as early as your page is loaded
  room.prepareConnection(url, token);
  // set up event listeners
  room
    .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
    .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
    .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
    .on(RoomEvent.Disconnected, handleDisconnect)
    .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished);
  // connect to room
  await room.connect(url, token);
  console.log("connected to room", room.name);
  // publish local camera and mic tracks
  await room.localParticipant.enableCameraAndMicrophone();
  function handleTrackSubscribed(track, publication, participant) {
    if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
      // attach it to a new HTMLVideoElement or HTMLAudioElement
      const element = track.attach();
      const parentElement = document.body;

      parentElement.appendChild(element);
    }
  }
  function handleTrackUnsubscribed(track, publication, participant) {
    // remove tracks from all attached elements
    track.detach();
  }
  function handleLocalTrackUnpublished(publication, participant) {
    // when local tracks are ended, update UI to remove them from rendering
    publication.track.detach();
  }
  function handleActiveSpeakerChange(speakers) {
    // show UI indicators when participant is speaking
  }
  function handleDisconnect() {
    console.log("disconnected from room");
  }
}
