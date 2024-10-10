import {
  AudioFrame,
  AudioSource,
  LocalAudioTrack,
  Room,
  TrackPublishOptions,
  TrackSource,
  dispose,
} from "@livekit/rtc-node";
import { config } from "dotenv";
import { AccessToken } from "livekit-server-sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";

config();

async function execLiveKit() {
  // create access token from API credentials
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: "example-participant",
    },
  );
  token.addGrant({
    room: "example-room",
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
  });
  const jwt = await token.toJwt();

  // set up room
  const room = new Room();
  await room.connect(process.env.LIVEKIT_URL, jwt, {
    autoSubscribe: true,
    dynacast: true,
  });
  console.log("connected to room", room);

  // read relevant metadata from wav file
  // this example assumes valid encoding little-endian
  const sample = readFileSync(join(process.cwd(), "./speex.wav"));
  const channels = sample.readUInt16LE(22);
  const sampleRate = sample.readUInt32LE(24);
  const dataSize = sample.readUInt32LE(40) / 2;

  // set up audio track
  const source = new AudioSource(sampleRate, channels);
  const track = LocalAudioTrack.createAudioTrack("audio", source);
  const options = new TrackPublishOptions();
  const buffer = new Int16Array(sample.buffer);
  options.source = TrackSource.SOURCE_MICROPHONE;

  await room.localParticipant
    ///.publishTrack(track, options)
    .then((pub) => pub.waitForSubscription());

  // let written = 44; // start of WAVE data stream
  // const FRAME_DURATION = 1; // write 1s of audio at a time
  // const numSamples = sampleRate * FRAME_DURATION;
  // while (written < dataSize) {
  //   const available = dataSize - written;
  //   const frameSize = Math.min(numSamples, available);

  //   const frame = new AudioFrame(
  //     buffer.slice(written, written + frameSize),
  //     sampleRate,
  //     channels,
  //     Math.trunc(frameSize / channels),
  //   );
  //   await source.captureFrame(frame);
  //   written += frameSize;
  // }
  // await source.waitForPlayout();

  // await room.disconnect();
  // await dispose();
}

module.exports.execLiveKit = execLiveKit;
