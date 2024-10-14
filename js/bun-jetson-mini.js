const { RoomServiceClient } = require('livekit-server-sdk');
const { spawn } = require('child_process');
const WebSocket = require('ws');
require('dotenv').config(); // For managing environment variables

// Load environment variables
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL || 'wss://omnissiah-university-kmuz0plz.livekit.cloud';
const ROOM_NAME = 'test-room'; // Room to publish the stream

// Initialize LiveKit room service
const svc = new RoomServiceClient(LIVEKIT_URL, API_KEY, API_SECRET);

// Start streaming the ZED RTSP stream using FFmpeg
function startRTSPStream() {
  console.log('Starting FFmpeg to read ZED RTSP stream...');
  
  const ffmpeg = spawn('ffmpeg', [
    '-i', 'rtsp://127.0.0.1:8554/zed-stream', // Input from ZED RTSP server
    '-c:v', 'libx264', // Encode video using H.264 codec
    '-preset', 'ultrafast', // Speed optimization
    '-f', 'webm', // WebRTC-compatible format
    '-an', 'pipe:1' // Disable audio, output via pipe
  ]);

  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg error: ${data}`);
  });

  return ffmpeg.stdout;
}

// Publish the video stream to LiveKit
async function publishVideoTrack(ffmpegStream) {
  console.log('Publishing video track to LiveKit...');

  const ws = new WebSocket(`${LIVEKIT_URL}/rtc`);

  ws.on('open', () => {
    console.log('Connected to LiveKit WebSocket.');

    ws.send(JSON.stringify({
      type: 'join',
      room: ROOM_NAME,
      identity: 'server-streamer',
      video: true,
    }));

    // Pipe FFmpeg stream to LiveKit WebSocket
    ffmpegStream.on('data', (chunk) => {
      ws.send(chunk);
    });

    ffmpegStream.on('end', () => {
      console.log('FFmpeg stream ended.');
      ws.close();
    });
  });

  ws.on('error', (err) => {
    console.error(`WebSocket error: ${err.message}`);
  });

  ws.on('close', () => {
    console.log('LiveKit WebSocket closed.');
  });
}

// Main function to start the stream
async function main() {
  try {
    const ffmpegStream = startRTSPStream();
    await publishVideoTrack(ffmpegStream);
  } catch (error) {
    console.error('Error publishing video track:', error);
  }
}

main(); 