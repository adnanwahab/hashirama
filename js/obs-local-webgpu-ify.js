
import { serve } from "bun";
// draw -> create animations vector? ? ?? ? 

// sims dynamic land - sory its not real - just a reaseearch concept  -- will take 20 years like nvdia :((( 


// JUST KDIDIGN ITS NINT YORU HOUSE )))
// store a different joke 0 render each time 

const whitboard = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Whiteboard Canvas</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    #whiteboard {
      border: 1px solid #000;
      cursor: crosshair;
      display: block;
      margin: 20px auto;
    }
    .controls {
      text-align: center;
    }
      #web-rtc-webgpu-desktop {
  display:none;
      }
  </style>
</head>
<body>
<iframe width="560" height="315" src="https://www.youtube.com/embed/lX6JcybgDFo?si=TVUWRerWKKnL2sla" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <div class="controls">
    <button onclick="clearCanvas()">Clear</button>
    <button onclick="saveImage()">Save as Image</button>
  </div>
  <canvas id="whiteboard" width="800" height="600"></canvas>


  <canvas id="web-rtc-webgpu-desktop" width="800" height="600"></canvas>
// boot and dolly
<style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0;
            perspective: 1000px;
        }

        .plane-container {
            width: 100vh;
            height: 100vh;
            position: absolute;
            z-index: 1000;
            border: 1px solid #000;
            pointer-events: none;
        }

        .plane {
            width: 200px;
            height: 200px;
            position: absolute;
            transform-origin: center;
        }

        .red-plane {
            background-color: rgba(242, 139, 130, 0.8); /* Red plane with slight transparency */
            transform: rotateX(45deg);
        }

        .blue-plane {
            background-color: rgba(130, 139, 242, 0.8); /* Blue plane with slight transparency */
            transform: rotateY(45deg);
        }
    </style>



    <div class="plane-container">
        <div class="plane red-plane"></div>
        <div class="plane blue-plane"></div>
    </div>

    <script>
    console.log('12312312')
      window.direction = 0 
        function animatePlanes() {
            const redPlane = document.querySelector('.red-plane');
            const bluePlane = document.querySelector('.blue-plane');
            
            let angleX = 0;
            let angleY = 0;

            function animate() {
                angleX += 1; // Rotate the red plane
                angleY += 1.5; // Rotate the blue plane at a different speed
  window.direction
                redPlane.style.transform = "rotateY(" + window.direction + "deg)";
                bluePlane.style.transform = "rotateY(" + window.direction + "deg)";
                requestAnimationFrame(animate);
            }


            animate();
        }

        animatePlanes();
    </script>


  <script>
    const canvas = document.getElementById('whiteboard');
    const ctx = canvas.getContext('2d');

    function calculateDirection(start, end) {
        const deltaX = end.x - start.x;
        const deltaY = end.y - start.y;
        const radians = Math.atan2(deltaY, deltaX);
        const degrees = radians * (180 / Math.PI);
        return degrees;
    }
    let painting = false;

    function startPosition(e) {
      painting = true;
        firstPoint = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };

      draw(e);
    }

    function endPosition() {
      painting = false;
      ctx.beginPath(); // Reset path

          const direction = calculateDirection(firstPoint, lastPoint);
          window.direction = direction
        console.log('Direction from first to last point: ' + direction);
    }

    function draw(e) {
      if (!painting) return;
  lastPoint = { x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop };

      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';

      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    // Mouse Events
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    // Clear the canvas
    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Save canvas as an image
    function saveImage() {
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      link.click();
    }
  </script>
</body>
</html>
`;






const htmlContent = `<div>aasdfsdf</div>`;

serve({
fetch(req) {
    console.log('12312312')


     if (req.url === '/whitboard') {
        return new Response(whitboard, {
            headers: {
              "Content-Type": "text/html",
            },
          });
    }

  return new Response(whitboard, {
    headers: {
      "Content-Type": "text/html",
    },
  });
},
port: 8080, // You can change the port if needed
});

console.log("Bun server is running on http://localhost:8080");

// https://madebyevan.com/webgl-water/
