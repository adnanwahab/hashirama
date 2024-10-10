import { sleep, echo} from 'bun';
import { Database } from 'bun:sqlite';
import { chromium } from 'playwright';
import fs from 'fs/promises';

// File system path constants
const STATIC_DATA_DIR = './static/data';
const VIDEOS_DIR = 'videos/';
const PDF_OUTPUT_PATH = 'playwright-example.pdf';
const SCREENSHOT_OUTPUT_PATH = 'foo.png';

// move inputs + outputs up here
// fix caching 
// dont put spaces in files  - small things make life easier - high quality (fs/infra/backend) - 



// get new reserach from twitter / redit? 
// 

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
  
  page.on('request', request => {
    console.log(`>> ${request.method()} ${request.url()}`);
  });
  
  page.on('response', response => {
    console.log(`<< ${response.status()} ${response.url()}`);
  });
  
  await page.goto("http://todomvc.com/examples/react/", { waitUntil: 'networkidle' });
  
  await browser.close();
}

async function parseURL_capture_video() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { dir: VIDEOS_DIR }
  });
  
  const page = await context.newPage();
  
  const gotoPage = async (url) => {
    console.log(`Visiting ${url}`);
    await page.goto(url);
    console.log(`Visited ${url}`);
  };
  
  await gotoPage("https://playwright.dev");
  await gotoPage("https://github.com");
  await gotoPage("https://microsoft.com");
  
  await page.close();
  const path = await page.video().path();
  console.log(`Saved to ${path}`);
  
  await browser.close();
}

async function parseURL_screenshot_url() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("https://playwright.dev/", { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: SCREENSHOT_OUTPUT_PATH });
  
  await browser.close();
}

async function ParsePage() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("https://news.ycombinator.com");
  
  const entries = await page.$$('.athing');
  
  for (let i = 0; i < entries.length; i++) {
    const title = await entries[i].$eval('td.title > span > a', el => el.textContent);
    console.log(`${i + 1}: ${title}`);
  }
  
  await browser.close();
}

async function ParseGoogle(person_name, params) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const searchURL = `https://www.google.com/search?q=${encodeURIComponent(person_name)}`;
  await page.goto(searchURL);
  
  const results = await page.$$('div.g');
  
  const searchResults = [];
  for (const result of results) {
    const titleElement = await result.$('h3');
    if (!titleElement) continue;
    
    const title = await titleElement.textContent();
    const linkElement = await result.$('a');
    if (!linkElement) continue;
    
    const link = await linkElement.getAttribute('href');
    searchResults.push(`${title}\n${link}`);
  }
  
  await browser.close();
  return searchResults.join('\n\n');
}


async function ParseHN(person_name, params) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto("https://news.ycombinator.com");
  
  const entries = await page.$$('.athing');
  
  for (let i = 0; i < entries.length; i++) {
    const title = await entries[i].$eval('td.title > span > a', el => el.textContent);
    console.log(`${i + 1}: ${title}`);
  }
  
  await browser.close();
  return entries.length.toString();
}

  async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error("Please provide the company name as a command line argument.");
      process.exit(1);
    }
    const companyName = args[0];
    console.log(`Company name provided: ${companyName}`);
    const result = await parse_gscholar_company(companyName);
    console.log(result);
  }
  
  main().catch(console.error);
  