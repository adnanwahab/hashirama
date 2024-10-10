// https://github.com/balloch/awesome-robotics-ai-companies

//import { get_all_papers } from "./5000-papers.js";

// async function parseURL_capture_video() {
//   const browser = await chromium.launch();
//   const context = await browser.newContext({
//     recordVideo: { dir: VIDEOS_DIR },
//   });

//   const page = await context.newPage();

//   const gotoPage = async (url) => {
//     console.log(`Visiting ${url}`);
//     await page.goto(url);
//     console.log(`Visited ${url}`);
//   };

//   await gotoPage("https://playwright.dev");
//   await gotoPage("https://github.com");
//   await gotoPage("https://microsoft.com");

//   await page.close();
//   const path = await page.video().path();
//   console.log(`Saved to ${path}`);

//   await browser.close();
// }

async function scrapeLinkedIn(companyName) {
  //const browser = await chromium.connectOverCDP('http://localhost:9222');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");

  // Enter the username
  await page.fill("input#username", "mail@adnanwahab.com");

  // Enter the password
  await page.fill("input#password", "sicp.123");

  // Click the login button
  await page.click('button[type="submit"]');
  const people_selector =
    ".ember-view.lt-line-clamp.lt-line-clamp--single-line.org-people-profile-card__profile-title.t-black";
  await page.screenshot({
    path: "static/living_papers/screenshot.png",
    fullPage: true,
  });

  // Wait for navigation to complete
  await page.waitForNavigation();
  console.log(companyName);
  if (companyName in special_case) {
    await page.goto(special_case[companyName]);
  } else {
    await page.goto();
  }

  // TODO: Implement scrolling to load all employees
  // Scroll to load all employees
  let previousHeight;
  let currentHeight = await page.evaluate("document.body.scrollHeight");
  //await page.screenshot({  fullPage: true });
  await page.screenshot({
    path: "static/living_papers/screenshot.png",
    fullPage: true,
  });
}

//scrapeAllCompanies();

const fileNames = {
  companies_list: "data/cognition_engine/5000_robotics_companies_list.json",

  engineers_list: "data/cognition_engine/200_000_engineers.json", //20,000

  // careers_profile: 'data/cognition_engine/careers_profile.json',
  // research_papers: 'data/cognition_engine/5000_research_papers.json',
};

import { chromium } from "playwright";
import fs from "fs/promises";

// async function loginToLinkedIn(page) {
//   await page.goto("https://www.linkedin.com/login");
//   await page.fill('input[name="session_key"]', "mail@adnanwahab.com");
//   await page.fill('input[name="session_password"]', "sicp.123");
//   await page.click('button[type="submit"]');
//   await page.waitForNavigation();
// }

async function get_employeees_from_company(page) {
  //console.log(companyName, "starting parse");
  //const filePath = fileNames.engineers_list;

  // try {
  //   // await fs.access(filePath);
  //   // const existingData = await fs.readFile(filePath, "utf8");
  //   // employees = JSON.parse(existingData) || [];
  // } catch (err) {
  //   if (err.code === "ENOENT") {
  //     await fs.writeFile(filePath, JSON.stringify(employees));
  //     console.log(`Created ${filePath}`);
  //   } else {
  //     console.error(`Error checking file ${filePath}:`, err);
  //   }
  // }

  await loginToLinkedIn(page, username, password);

  // Navigate to company page
  await page.goto(`https://www.linkedin.com/company/${companyName}/people/`);
  await page.waitForSelector(".org-people-profile-card");

  let previousHeight = 0;

  while (previousHeight !== currentHeight) {
    previousHeight = currentHeight;
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(2000); // Wait for 2 seconds to load new content
    currentHeight = await page.evaluate("document.body.scrollHeight");
  }
  // TODO: Extract employee names and profile links
  await page.waitForSelector(people_selector);
  const employees = await page.evaluate(() => {
    // Extract employee information from the page
    // Return an array of objects with name and profileUrl
    const people = document.querySelectorAll(people_selector);
    return Array.from(people).map((person) => ({
      name: person.textContent,
      profileUrl: person.querySelector("a")?.href,
    }));
  });

  return employees;
}
function get_all_companies_from_topic(topic) {
  // https://roscon.ros.org/2024/
  //ask chatgpt for top 100 companies in robotics

  const another_list_of_companies = {
    companies: [
      {
        name: "NVIDIA",
        focus: "AI hardware and software, GPUs for robotics applications",
        source: "https://www.builtin.com",
      },
      {
        name: "ABB",
        focus: "Industrial automation and robotics",
        source: "https://www.finbold.com",
      },
      {
        name: "Boston Dynamics",
        focus: "Advanced robots like Spot and Atlas",
        source: "https://www.builtin.com",
      },
      {
        name: "Intuitive Surgical",
        focus: "Minimally invasive surgery robots (da Vinci)",
        source: "https://www.finbold.com",
      },
      {
        name: "Teradyne",
        focus: "Automation equipment for semiconductor and electronic devices",
        source: "https://www.finbold.com",
      },
      {
        name: "Locus Robotics",
        focus: "Autonomous mobile robots for warehouse automation",
        source: "https://www.fastcompany.com",
      },
      {
        name: "Symbotic",
        focus: "Warehouse robots for 24-hour operation",
        source: "https://www.fastcompany.com",
      },
      {
        name: "Anduril",
        focus: "AI-backed security and defense robots",
        source: "https://www.builtin.com",
      },
      {
        name: "Rapid Robotics",
        focus: "Affordable robots for manufacturing",
        source: "https://www.builtin.com",
      },
      {
        name: "Agility Robotics",
        focus: "Robots for human-robot collaboration in factories",
        source: "https://www.fastcompany.com",
      },
    ],
  };

  const get_100_companies_from_topic = [
    "Boston Dynamics",
    "iRobot",
    "ABB Robotics",
    "FANUC",
    "KUKA",
    "Intuitive Surgical",
    "Waymo",
    "Tesla (Autopilot/FSD)",
    "Cruise",
    "Argo AI",
    "Nuro",
    "Zoox",
    "Rethink Robotics",
    "Universal Robots",
    "Fetch Robotics",
    "Soft Robotics",
    "Cyberdyne",
    "DJI",
    "Autel Robotics",
    "Skydio",
    "Anki",
    "Sphero",
    "UBTech Robotics",
    "UBTECH Robotics",
    "Robotis",
    "SoftBank Robotics",
    "Honda Robotics",
    "Toyota Research Institute",
    "Hyundai Robotics",
    "Kawasaki Robotics",
    "Yaskawa",
    "Epson Robots",
    "Stäubli",
    "Comau",
    "Omron",
    "Mitsubishi Electric Automation",
    "Rockwell Automation",
    "Siemens (Robotics)",
    "Bosch Rexroth",
    "Festo",
    "Harmonic Drive",
    "Nabtesco",
    "Schunk",
    "Barrett Technology",
    "Shadow Robot Company",
    "Robotiq",
    "OnRobot",
    "Piab",
    "Zimmer Group",
    "Kinova Robotics",
    "Clearpath Robotics",
    "Locus Robotics",
    "6 River Systems",
    "GreyOrange",
    "Geek+",
    "inVia Robotics",
    "IAM Robotics",
    "Vecna Robotics",
    "Mobile Industrial Robots (MiR)",
    "Aethon",
    "Seegrid",
    "AutoStore",
    "Swisslog",
    "Knapp",
    "Ocado Technology",
    "Kindred AI",
    "RightHand Robotics",
    "Covariant",
    "Osaro",
    "Vicarious",
    "Embodied Intelligence",
    "Robust.AI",
    "Diligent Robotics",
    "Dusty Robotics",
    "Built Robotics",
    "Canvas Construction",
    "Sarcos Robotics",
    "Ekso Bionics",
    "ReWalk Robotics",
    "Myomo",
    "Bionik Laboratories",
    "Corindus (Siemens Healthineers)",
    "Medtronic (Surgical Robotics)",
    "Stryker (Mako Surgical)",
    "Smith+Nephew (Surgical Robotics)",
    "Zimmer Biomet (Rosa Robotics)",
    "Accuray",
    "Stereotaxis",
    "Titan Medical",
    "Vicarious Surgical",
    "CMR Surgical",
    "Auris Health (J&J)",
    "Verb Surgical (J&J and Verily)",
    "Medrobotics",
    "Restoration Robotics",
    "TransEnterix",
    "Neocis",
    "Synaptive Medical",
    "Axsis Technology",
    "Robocath",
  ];

  const second_list = another_list_of_companies.companies.map(
    (company) => company.name,
  );

  const merge_list = [...get_100_companies_from_topic, ...second_list];
  return merge_list;
  //pass through LLMAA or chatGPT structured output
}

async function main() {
  //let company_names = get_all_companies_from_topic("robotics"); //crunchbase

  // const roboticsCompaniesData = await fs.readFile(
  //   fileNames.companies_list,
  //   "utf8",
  // );
  // const roboticsCompaniesList = JSON.parse(roboticsCompaniesData);
  // //console.log(company_names, roboticsCompaniesList);
  // const mergedCompanyNames = Array.from(
  //   new Set([...company_names, ...roboticsCompaniesList]),
  // );

  //console.log(`Total number of unique companies: ${mergedCompanyNames.length}`);

  // try {
  //   await fs.writeFile(
  //     fileNames.companies_list,
  //     JSON.stringify(mergedCompanyNames, null, 2),
  //   );
  //   console.log(`Merged company names saved to ${fileNames.companies_list}`);
  // } catch (err) {
  //   console.error(`Error saving merged company names to file:`, err);
  // }

  const username = "mail@adnanwahab.com";
  const password = "sicp.123";

  //fileNames.people_list;

  //let companies = {};
  // const headless = false;
  // async function scrapeAllCompanies() {
  //   for (const companyName of companie_names.slice(0, 1)) {
  //     const employees = await scrapeLinkedIn(companyName);
  //     all_companies[`linkedin_${companyName}`] = employees;
  //   }

  //   //console.log(all_companies);
  //   fs.writeFileSync(
  //     "all_companies.json",
  //     JSON.stringify(all_companies, null, 2),
  //   );
  // }

  // const browser = await chromium.launch({ headless: false }); // Set to true for production
  // const context = await browser.newContext();
  // const userDataDir = path.join(
  const path = require("path");

  const userDataDir = path.join(
    process.env.HOME,
    "Library",
    "Application Support",
    "Google",
    "Chrome",
  );
  let company_name = ["anduril"];

  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    headless: false, // Set to true if you don't need to see the browser UI
    // Other launch options if necessary
  });

  const page_url = `https://www.linkedin.com/company/${company_name[0]}/people/`;
  console.log(page_url);
  const page = await browserContext.newPage();
  await page.goto(page_url);

  brwoserws.forEach(async (company_name) => {
    let employee_names = await get_employeees_from_company(page); // linkeidn
    // const list_of_people = (companies[company_name] = await fs.writeFile(
    //   fileNames.people_list,
    //   JSON.stringify(companies, null, 2),
    // ));
    console.log(`Company data saved to ${employee_names}`);
    //employee_names.forEach((name) => list_of_people.push(name));
  });
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

main();
//let url = "https://aiweekly.co/";
