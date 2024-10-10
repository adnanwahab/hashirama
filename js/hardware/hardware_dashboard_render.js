
const bun = require('bun');

const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../data/hardware');
let content_body = '';

fs.readdirSync(directoryPath).forEach(file => {
    if (file.endsWith('.db')) {
        content_body += `
            <div style="overflow-y: scroll; height: 300px; border: 1px solid #ccc; margin-bottom: 10px;">
                <h3>${file}</h3>
                <pre>${fs.readFileSync(path.join(directoryPath, file), 'utf-8')}</pre>
            </div>
            <a href="../data/hardware/${file}" download>Download ${file}</a>
        `;
    }
});

function renderHTMLString() {
    const htmlString = `
        <html>
            <head>
                <title>Hardware Dashboard</title>
            </head>
            <body>

            ${content_body}
            </body>
        </html>
    `;
    return bun.render(htmlString);
}

bun.serve({
    fetch(req) {
        return new Response(renderHTMLString(), {
            headers: { "Content-Type": "text/html" }
        });
    },
    port: 3009,
});
//use rescue time + replay anaylzer - to 10 hours on hardware
//3 hours - maintain ---blog

console.log(renderHTMLString());
















//2014 - bret changed the world <- old profile
//2024 - bret said his work was cool but dynamicland was cooler <- shiny