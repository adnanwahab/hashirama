const { RoomServiceClient, AccessToken } = require('livekit-server-sdk');
//const { connect, createLocalVideoTrack, MediaStreamTrack } = require('livekit/client');
const { spawn } = require('child_process');
const fetch = require('node-fetch');



const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_WS_URL;
// ... existing code ...
// Replace with your LiveKit server info
// const API_KEY = 'your_api_key';
// const API_SECRET = 'your_api_secret';
// const LIVEKIT_URL = 'https://your-livekit-server-url';
const ROOM_NAME = 'test-room';
const IDENTITY = 'video-publisher';

// Step 1: Generate an access token for the room
const generateAccessToken = () => {
  const at = new AccessToken(API_KEY, API_SECRET, {
    identity: IDENTITY,
  });
  at.addGrant({ roomJoin: true, room: ROOM_NAME });
  return at.toJwt();
};

// Step 2: Create a video stream using FFmpeg
const streamVideoFromFile = (filePath) => {
  return spawn('ffmpeg', [
    '-re',               // Real-time mode
    '-i', filePath,      // Input file path
    '-f', 'rawvideo',    // Raw video format
    '-pix_fmt', 'yuv420p', // Pixel format
    '-',                 // Output to stdout (pipe mode)
  ]);
};

// Step 3: Connect to the room and publish the video stream
const publishVideo = async (filePath) => {
  try {
    const token = generateAccessToken();
    const room = await connect(`${LIVEKIT_URL}?access_token=${token}`);

    console.log('Connected to LiveKit room:', ROOM_NAME);

    // Create a video track from the file stream
    const ffmpegProcess = streamVideoFromFile(filePath);
    const videoTrack = await createLocalVideoTrack({
      name: 'video-file',
      mediaStreamTrack: new MediaStreamTrack(ffmpegProcess.stdout),
    });

    // Publish the video track to the room
    room.localParticipant.publishTrack(videoTrack);
    console.log('Video track published from file!');

    // Handle exit and cleanup
    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      room.disconnect();
    });
  } catch (error) {
    console.error('Error publishing video:', error);
  }
};

// Run the publish function with the path to the video file
publishVideo('./day1.mp4');