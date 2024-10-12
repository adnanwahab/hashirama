function initWebSocket(handleMessage) {
  const socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
  });

  socket.addEventListener('message', handleMessage);

  socket.addEventListener('close', (event) => {
    console.log('Disconnected from WebSocket server');
  });

  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });
}

function main() {
  initWebSocket(handleMessage)
}

function handleMessageOnObservable(event) {
  if (data.command === 'keybind') {
    executeKeybind(data.key, data.ctrl, data.alt, data.shift);
  }

 else  if (data.command === 'dumpContent') {
  } else {
    socket.send(JSON.stringify({ data: 'opps, method missing' }));
  }
}


;(function() {
    if (isAgentDashboard()) { main(handleMessageOnObservable) }
    else {
      //initWebSocket()   
      //console.log('not on observablehq')
    }
  
})();

function sendMessage(message) {
  //console.log("sending message", message)
}


function isAgentDashboard(window) {
  return window.location.href === 'https://observablehq.com/@roboticsuniversity/agent-dashboard';
}


function executeKeybind(key, ctrl = false, alt = false, shift = false) {
  const event = new KeyboardEvent('keydown', {
    key: key,
    ctrlKey: ctrl,
    altKey: alt,
    shiftKey: shift,
    bubbles: true,
    cancelable: true
  });

  document.dispatchEvent(event);
}