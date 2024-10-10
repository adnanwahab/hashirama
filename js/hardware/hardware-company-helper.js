const fs = require('fs');
const { chromium } = require('playwright');
const sqlite3 = require('sqlite3').verbose();

const companies_known= [
    'robotis',
    'universal robots',
    'ufactory',
    'adlink',
    'sparkfun',
    'adafruit',wsed3rf4t5gU
    'hiwonder',
    'openrobotics',
    'icon',
    'boston dynamics',
    'softbank robotics',
    //'nvidia isaac',
]

const current_instructions = `
    find all hardware companies that are known to be in the robotics industry.
    read their homepages and dsicover their products.
    make an entry in the database for each product.
    make a json and then use the logHardwareComponentDatabase in this file to store it.
`

async function findAllHardwareCompanies(){}

function message_owners_or_support_of_each_hardware_company(){}

async function annotateLinks() {
    const links = fs.readFileSync('data/hardware/links.txt', 'utf-8').split('\n').filter(Boolean);
    // Launch a browser
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Iterate over each link
    for (const link of links) {
        try {
            // Visit the link
            await page.goto(link);

            // Extract information (e.g., title of the page)
            const title = await page.title();

            // Annotate the link with the extracted information
            console.log(`Link: ${link}, Title: ${title}`);
        } catch (error) {
            console.error(`Failed to process ${link}: ${error.message}`);
        }
    }
    // Close the browser
    await browser.close();
}

// Function to log data to SQLite database
function logDataToSQLite(logData, filePath) {
    const dbPath = path.join(__dirname, '../../data/hardware/' + filePath);
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });

    db.serialize(() => {
        // Create table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            log TEXT
        )`);

        // Insert log data
        const stmt = db.prepare("INSERT INTO logs (log) VALUES (?)");
        stmt.run(logData, (err) => {
            if (err) {
                console.error('Error inserting log data:', err.message);
            } else {
                console.log('Log data inserted successfully.');
            }
        });
        stmt.finalize();
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Closed the database connection.');
        }
    });
}

// Example usage: logDataToSQLite('This is a test log entry.');
//seemingly solved --- linear - no obvious blockers
//. Limited Human-Robot Interaction (HRI) Capabilities

async function main() {
    const companies = await findAllHardwareCompanies()
    const annotated_links = await annotateLinks()


    logDataToSQLite(annotated_links, 'product-component.db')
    logDataToSQLite(companies, 'companies.db')
}

main()

// https://chatgpt.com/share/670702f8-0b78-8013-8d92-09527e541aa9
//setInterval(main, 1000 * 60 * 5)

///goal - import nanosaur as easy as import jquery - eta (2031) 