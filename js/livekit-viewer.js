// This code sets up a LiveKit sender to stream video from a phone camera

// Check if the browser supports media devices
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Access the camera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      // Get the video element to display the stream
      const videoElement = document.getElementById('livekit-video');
      videoElement.srcObject = stream;
      videoElement.play();

      // Connect to LiveKit server
      const room = new LiveKit.Room();
      const url = 'wss://your-livekit-server-url'; // Replace with your LiveKit server URL
      const token = 'your-access-token'; // Replace with your access token

      room.connect(url, token)
        .then(() => {
          // Publish the video stream to the room
          room.localParticipant.publishTrack(stream.getVideoTracks()[0]);
          console.log('Camera stream is being sent to LiveKit');
        })
        .catch(error => {
          console.error('Error connecting to LiveKit:', error);
        });
    })
    .catch(function(error) {
      console.error('Error accessing camera:', error);
    });
} else {
  console.error('Media devices are not supported in this browser.');
}

// HTML element to display the video stream
// <video id="livekit-video" autoplay playsinline></video>
