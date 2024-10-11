(function() {

  console.log("content.js loaded");

  const socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
  });

  socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);

    try {
      const data = JSON.parse(event.data);
      console.log('Parsed data:', data);

      // Add handlers for specific commands
      if (data.command === 'getContent') {
        const content = document.querySelector(data.selector)?.innerHTML;
        socket.send(JSON.stringify({ command: 'getContent', content }));
      } else if (data.command === 'scrollToBottom') {
        window.scrollTo(0, document.body.scrollHeight);
        socket.send(JSON.stringify({ command: 'scrollToBottom', status: 'done' }));
      } else if (data.command === 'eval') {
        try {
          const result = eval(data.code);
          console.log('eval result:', result);
          socket.send(JSON.stringify({ command: 'eval', result }));
        } catch (evalError) {
          socket.send(JSON.stringify({ command: 'eval', error: evalError.message }));
        }
      }

    } catch (parseError) {
      console.error('Error parsing message:', parseError);
    }
  });

  socket.addEventListener('close', (event) => {
    console.log('Disconnected from WebSocket server');
  });

  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

})();
