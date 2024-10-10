cgi-backend.js

function particlesMorphTarget() {
    return new Response(JSON.stringify({}));
  }
  
  function vitDiceFrames() {
    return new Response(JSON.stringify({}));
  }
  
  function roboticsUiData() {
    return new Response(JSON.stringify({}));
  }
  
  function fluxImplantImages() {
    return new Response(JSON.stringify({}));
  }
  
  function dynamiclandStaircase() {
    return new Response(JSON.stringify({}));
  }
  
  const cgiHandlers = [
    particlesMorphTarget,
    vitDiceFrames,
    roboticsUiData,
    fluxImplantImages,
    dynamiclandStaircase
  ];

  function replayAnalyzer() {
    const html = `
      <div class="container">
        <div class="panel">
          <input class="replay" type="text" placeholder="Enter YouTube URL" style="width: 100%;">
          <button style="margin-top: 10px;" onclick="loadVideo()">Load Video</button>
          <iframe class="iframe" id="youtubeIframe"></iframe>
        </div>
        <div class="panel">
          <svg class="svg"></svg>
        </div>
      </div>
    `;

  }
  function observableCursor() {
    return new Response(JSON.stringify({}));
  }
  
    const js = `
      function loadVideo() {
        const input = document.querySelector('input');
        const iframe = document.getElementById('youtubeIframe');
        const url = input.value;
        const videoId = url.split('v=')[1];
        iframe.src = 'https://www.youtube.com/embed/' + videoId;
      }
      setTimeout(() => {
        document.querySelector('.replay').addEventListener('change', loadVideo);
      }, 1000);
    `;
  
    return new Response(JSON.stringify({ type: 'both', js, html }));
  }