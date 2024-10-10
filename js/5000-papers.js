import { sleep, echo } from "bun";
import { Database } from "bun:sqlite";
import { chromium } from "playwright";
import fs from "fs/promises";

// File system path constants
const STATIC_DATA_DIR = "./static/data";
const VIDEOS_DIR = "videos/";
const PDF_OUTPUT_PATH = "playwright-example.pdf";
const SCREENSHOT_OUTPUT_PATH = "foo.png";

// move inputs + outputs up here
// fix caching

async function assertErrorToNilf(message, err) {
  if (err) {
    console.error(message, err);
    process.exit(1);
  }
}

async function parseURL_render_PDF() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://github.com/microsoft/playwright");
  await page.pdf({ path: PDF_OUTPUT_PATH });

  await browser.close();
}

async function parseURL_benchmark_network() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on("request", (request) => {
    console.log(`>> ${request.method()} ${request.url()}`);
  });

  page.on("response", (response) => {
    console.log(`<< ${response.status()} ${response.url()}`);
  });

  await page.goto("http://todomvc.com/examples/react/", {
    waitUntil: "networkidle",
  });

  await browser.close();
}

async function parseURL_screenshot_url() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://playwright.dev/", { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: SCREENSHOT_OUTPUT_PATH });

  await browser.close();
}

async function ParsePage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://news.ycombinator.com");

  const entries = await page.$$(".athing");

  for (let i = 0; i < entries.length; i++) {
    const title = await entries[i].$eval(
      "td.title > span > a",
      (el) => el.textContent,
    );
    console.log(`${i + 1}: ${title}`);
  }

  await browser.close();
}

async function ParseGoogle(person_name, params) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const searchURL = `https://www.google.com/search?q=${encodeURIComponent(person_name)}`;
  await page.goto(searchURL);

  const results = await page.$$("div.g");

  const searchResults = [];
  for (const result of results) {
    const titleElement = await result.$("h3");
    if (!titleElement) continue;

    const title = await titleElement.textContent();
    const linkElement = await result.$("a");
    if (!linkElement) continue;

    const link = await linkElement.getAttribute("href");
    searchResults.push(`${title}\n${link}`);
  }

  await browser.close();
  return searchResults.join("\n\n");
}

async function ParseGscholar(person_name, params) {
  console.log("parsing", person_name);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const searchURL = `https://scholar.google.com/scholar?q=${encodeURIComponent(person_name)}`;
  await page.goto(searchURL);

  const results = await page.$$(".gs_r");

  const pdfLinks = [];
  for (const result of results) {
    const linkElement = await result.$('a[href$=".pdf"]');
    if (!linkElement) continue;

    const href = await linkElement.getAttribute("href");
    pdfLinks.push(href);
  }

  await browser.close();
  return pdfLinks.join("\n");
}

async function ParseHN(person_name, params) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("https://news.ycombinator.com");

  const entries = await page.$$(".athing");

  for (let i = 0; i < entries.length; i++) {
    const title = await entries[i].$eval(
      "td.title > span > a",
      (el) => el.textContent,
    );
    console.log(`${i + 1}: ${title}`);
  }

  await browser.close();
  return entries.length.toString();
}

async function parse_gscholar_company(company_name) {
  try {
    const companyData = await fs.readFile(
      `${STATIC_DATA_DIR}/${company_name}.json`,
      "utf-8",
    );

    // Parse JSON data
    const zooxNestedEmployees = JSON.parse(companyData);

    // Flatten the nested array
    const companyEmployees = zooxNestedEmployees.flat();

    console.log(`Loaded ${companyEmployees.length} ${company_name} employees`);

    let existingPapers = {};

    //console.log(companyEmployees);

    //  return existingPapers;

    // Create a promise to signal when parsing is complete
    const done = new Promise(async (resolve) => {
      for (const person_name of companyEmployees) {
        if (Object.keys(existingPapers).includes(person_name)) {
          console.log(`Skipping ${person_name} as papers already parsed`);

          continue;
        }

        try {
          // Read existing contents of the file
          const existingDataPath = `${STATIC_DATA_DIR}/${company_name}_papers.json`;
          let existingData;
          try {
            existingData = await fs.readFile(existingDataPath, "utf-8");
          } catch (err) {
            if (err.code !== "ENOENT") {
              console.error(`Error reading ${company_name}_papers.json:`, err);
              continue;
            }
          }

          // Parse existing JSON data
          if (existingData) {
            try {
              existingPapers = JSON.parse(existingData);
            } catch (err) {
              console.error(
                `Error parsing existing ${company_name}_papers.json:`,
                err,
              );
              existingPapers = {};
            }
          }

          // Get new papers for the current person
          const allPapers = await ParseGscholar(
            `${person_name} ${company_name}`,
            "",
          );
          await sleep(500);

          // Add or update papers for the current person
          existingPapers[person_name] = allPapers;

          // Convert updated map to JSON
          const jsonData = JSON.stringify(existingPapers, null, 2);

          // Write updated JSON data to file
          await fs.writeFile(
            `${STATIC_DATA_DIR}/${company_name}_papers.json`,
            jsonData,
          );

          console.log(
            `Updated papers for ${person_name} in ${company_name}_papers.json`,
          );
        } catch (err) {
          console.error(`Error processing ${person_name}:`, err);
        }
      }

      // Signal that parsing is complete
      resolve();
    });

    // Wait for parsing to complete before returning
    await done;

    return existingPapers;
  } catch (err) {
    console.error(`Error in parse_gscholar_company:`, err);
    return null;
  }
}
async function get_all_papers(companyName) {
  // const companyName = args[0];
  console.log(`Company name provided: ${companyName}`);
  const result = await parse_gscholar_company(companyName);
  console.log(result);
}

//main().catch(console.error);

export { get_all_papers };
