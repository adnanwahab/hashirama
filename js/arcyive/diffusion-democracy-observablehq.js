//diffusion-democracy-observablehq
const port = 7777;
console.log("diffusion-democracy-observablehq port ", port);
// try deno - webgpu  ---- llm rendienr ??
//tailswind
//3 obs
// ->>>>  (iframe + add style + attribution )
// 1 figma
// finish by 7
// 7 - 10 tools time
// 11 airport?
// 2030 ---show user -> dashboards (calaity ,, ??? )
//12 ------ nanosuar --------------------           midnight
const diffusion_policy = () => `
  <div>
    <h1>Diffusion Policy</h1>
    <p>This is a simple HTML string indicating diffusion policy.</p>
  </div>
`;

const democracy_mode = () => `
  <div>
    <h1>Democracy Mode</h1>
    <p>This is a simple HTML string indicating democracy mode.</p>
    <style>
         body {
             font-family: 'Courier New', Courier, monospace;
             background-color: black;
             color: white;
             text-align: center;
         }

         .container {
             width: 300px;
             margin: auto;
             margin-top: 50px;
         }

         .slider-container {
             display: flex;
             justify-content: space-between;
             margin-bottom: 20px;
         }

         .bar-chart {
             margin-bottom: 20px;
         }

         .votes-list {
             text-align: left;
             margin: auto;
             width: 200px;
         }
     </style>
    <div class="container">
         <h1>Twitch Plays Pokémon</h1>
         <h2>5d 13h 45m 21s</h2>

         <div class="slider-container">
             <span>Anarchy</span>
             <input type="range" min="0" max="100" value="50" class="slider" id="anarchy-democracy-slider">
             <span>Democracy</span>
         </div>

         <div id="bar-chart" class="bar-chart"></div>

         <div class="votes-list" id="votes-list">
             <!-- Dynamic vote list will be inserted here -->
         </div>
     </div>

     <script>
         // Bar Chart Data
         const voteData = [
             { action: 'down', votes: 90 },
             { action: 'left', votes: 41 },
             { action: 'right', votes: 6 },
             { action: 'b', votes: 3 },
             { action: 'start', votes: 3 },
             { action: 'start9', votes: 2 },
             { action: 'a', votes: 1 },
         ];

         // Set up dimensions for the bar chart
         const chartWidth = 300;
         const chartHeight = 200;

         const svg = d3.select("#bar-chart")
             .append("svg")
             .attr("width", chartWidth)
             .attr("height", chartHeight);

         const xScale = d3.scaleLinear()
             .domain([0, d3.max(voteData, d => d.votes)])
             .range([0, chartWidth]);

         const yScale = d3.scaleBand()
             .domain(voteData.map(d => d.action))
             .range([0, chartHeight])
             .padding(0.1);

         // Add bars
         svg.selectAll(".bar")
             .data(voteData)
             .enter()
             .append("rect")
             .attr("class", "bar")
             .attr("x", 0)
             .attr("y", d => yScale(d.action))
             .attr("width", d => xScale(d.votes))
             .attr("height", yScale.bandwidth())
             .attr("fill", "white");

         // Add labels
         svg.selectAll(".label")
             .data(voteData)
             .enter()
             .append("text")
             .attr("x", d => xScale(d.votes) + 5)
             .attr("y", d => yScale(d.action) + yScale.bandwidth() / 2 + 5)
             .text(d => d.votes)
             .attr("fill", "white");

         // Vote List rendering
         const voteListContainer = d3.select("#votes-list");

         voteData.forEach(vote => {
             voteListContainer.append("div")
                 .text(\`${vote.action} -> ${vote.votes}\`)
                 .style("margin-bottom", "5px");
         });

         // Slider functionality
         const slider = document.getElementById("anarchy-democracy-slider");
         slider.addEventListener("input", function() {
             const sliderValue = slider.value;
             console.log(\`Slider is at ${sliderValue}% Anarchy / ${100 - sliderValue}% Democracy\`);
         });
     </script>

  </div>
`;

const idk = () => `
  <div>
    <h1>IDK</h1>
    <p>This is a simple HTML string indicating IDK.</p>
  </div>
`;

const dynamicland_org = () => `
  <div>
    <h1>Dynamic Land</h1>
    <p>This is a simple HTML string indicating Dynamic Land.</p>
  </div>
`;
const how = () => `
  <div>
    <h1>How</h1>
    <p>This is a simple HTML string indicating How.</p>
  </div>
`;

const pages = {
  "diffusion-policy": diffusion_policy(),
  "democracy-mode": democracy_mode(),
  idk: idk(),
  "dynamicland.org": dynamicland_org(),
  how: how(),
};

Bun.serve({
  port: port,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/diffusion-policy") {
      return new Response(pages["diffusion-policy"], {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (url.pathname === "/democracy-mode") {
      return new Response(pages["democracy-mode"], {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (url.pathname === "/idk") {
      return new Response(pages.idk, {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (url.pathname === "/dynamicland.org") {
      return new Response(pages["dynamicland.org"], {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (url.pathname === "/how") {
      return new Response(pages.how, {
        headers: { "Content-Type": "text/html" },
      });
    }

    // Default response if no path matches
    const color = "red";
    console.log("hi");
    return new Response(
      `
      <html>
        <body style="background-color: ${color};">
          <h1>Welcome to the ${color} page!</h1>
        </body>
      </html>
    `,
      { headers: { "Content-Type": "text/html" } },
    );
  },
});
