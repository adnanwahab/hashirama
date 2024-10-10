

  // const code_gen = await llama(prompt);
  // const code_gen = await callOpenAI(prompt);
  // console.log(code_gen);

  // let jsCodeBlocks = extractJavaScriptCode(code_gen).join('\n\n');
  // const companyName = "waymo";
  // console.log(jsCodeBlocks);
  // const actual_url = `https://www.linkedin.com/company/${companyName}/people/`;
  // jsCodeBlocks = jsCodeBlocks.replace('URL_TO_COMPANY_LINKEDIN_PAGE', actual_url);
  
  // const llama_output = await call_llama(` please edit this code to subsitste any LINKEDIN_URL with ${actual_url} in this----> ${jsCodeBlocks}`);
  // console.log(llama_output);

  // // Ensure llama_output is a string of JavaScript code
  // const filePath = "./generated_code.js";
  // await fs.writeFile(filePath, llama_output.edited_content); // Use edited_content if it contains the JavaScript code

  // exec(`bun run ${filePath}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error executing file: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });


async function callOpenAI(prompt) {
  const key = `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`;
  const openai = new OpenAI({ apiKey: key });
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
  });
  return response.choices[0].message.content;
}



const { exec } = require("child_process");

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

async function micro_devin(task) {}

async function scrapeLinkedIn(companyName) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");
  await page.fill("input#username", "mail@adnanwahab.com");
  await page.fill("input#password", "sicp.123");
  await page.click('button[type="submit"]');
  const people_selector = ".ember-view.lt-line-clamp.lt-line-clamp--single-line.org-people-profile-card__profile-title.t-black";
  await page.screenshot({ path: "static/living_papers/screenshot.png", fullPage: true });
  await page.waitForNavigation();
  console.log(companyName);
  if (companyName in special_case) {
    await page.goto(special_case[companyName]);
  } else {
    await page.goto();
  }
  let previousHeight;
  let currentHeight = await page.evaluate("document.body.scrollHeight");
  await page.screenshot({ path: "static/living_papers/screenshot.png", fullPage: true });
}

const fileNames = {
  companies_list: "data/cognition_engine/5000_robotics_companies_list.json",
  engineers_list: "data/cognition_engine/200_000_engineers.json",
};

import { chromium } from "playwright";

async function get_employeees_from_company(page) {
  await loginToLinkedIn(page, username, password);
  await page.goto(`https://www.linkedin.com/company/${companyName}/people/`);
  await page.waitForSelector(".org-people-profile-card");
  let previousHeight = 0;
  while (previousHeight !== currentHeight) {
    previousHeight = currentHeight;
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForTimeout(2000);
    currentHeight = await page.evaluate("document.body.scrollHeight");
  }
  await page.waitForSelector(people_selector);
  const employees = await page.evaluate(() => {
    const people = document.querySelectorAll(people_selector);
    return Array.from(people).map((person) => ({
      name: person.textContent,
      profileUrl: person.querySelector("a")?.href,
    }));
  });
  return employees;
}

function get_all_companies_from_topic(topic) {
  const another_list_of_companies = {
    companies: [
      { name: "NVIDIA", focus: "AI hardware and software, GPUs for robotics applications", source: "https://www.builtin.com" },
      { name: "ABB", focus: "Industrial automation and robotics", source: "https://www.finbold.com" },
      { name: "Boston Dynamics", focus: "Advanced robots like Spot and Atlas", source: "https://www.builtin.com" },
      { name: "Intuitive Surgical", focus: "Minimally invasive surgery robots (da Vinci)", source: "https://www.finbold.com" },
      { name: "Teradyne", focus: "Automation equipment for semiconductor and electronic devices", source: "https://www.finbold.com" },
      { name: "Locus Robotics", focus: "Autonomous mobile robots for warehouse automation", source: "https://www.fastcompany.com" },
      { name: "Symbotic", focus: "Warehouse robots for 24-hour operation", source: "https://www.fastcompany.com" },
      { name: "Anduril", focus: "AI-backed security and defense robots", source: "https://www.builtin.com" },
      { name: "Rapid Robotics", focus: "Affordable robots for manufacturing", source: "https://www.builtin.com" },
      { name: "Agility Robotics", focus: "Robots for human-robot collaboration in factories", source: "https://www.fastcompany.com" },
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
  const second_list = another_list_of_companies.companies.map((company) => company.name);
  const merge_list = [...get_100_companies_from_topic, ...second_list];
  return merge_list;
}const readFileAsString = async (filePath) => {
  try {
    const data = await readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
};
const call_llama = async (user_instructions) => {
  const good_prompt = ` ${user_instructions}`
  const responseStream = ollama.chat({
    model: 'llama3.2',
    messages: [
      { role: 'user', content: good_prompt }
    ],
    format: 'json'
  });

  let responseContent = ''
  const message = { role: 'user', content: good_prompt }
const response = await ollama.chat({ model: 'llama3.2', messages: [message], stream: true })
for await (const part of response) {
//  console.log(part.message.content.length)
  responseContent += part.message.content
}

  //console.log(response.message.content, 'response.message.content')
  return responseContent
}
function extractJavaScriptCode(text) {
  const jsCodeBlocks = [];
  const jsRegex = /```javascript\n([\s\S]*?)```/g; // Matches JS code blocks wrapped in ```javascript
  let match;

  // Extract code blocks labeled as 'javascript'
  while ((match = jsRegex.exec(text)) !== null) {
      jsCodeBlocks.push(match[1].trim());
  }

  return jsCodeBlocks;
}