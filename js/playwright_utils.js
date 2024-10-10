const { Ollama } = require("ollama");

async function vision_transformer(input) {
  const ollama = new Ollama("llava:7b", "8dd30f6b0cb1");

  try {
    const result = await ollama.callFunction1(input);
    console.log("Function1 Result:", result);
    return result;
  } catch (error) {
    console.error("Error calling Function1:", error);
  }
}

async function llama(input) {
  const ollama = new Ollama("llama3.2:latest", "a80c4f17acd5");

  try {
    const result = await ollama.callFunction2(input);
    console.log("Function2 Result:", result);
    return result;
  } catch (error) {
    console.error("Error calling Function2:", error);
  }
}

module.exports = {
  llama,
  vision_transformer,
};

// Function to download PDF content and save it
async function downloadPDF(url, saveDir) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const filename = basename(url);
    await ensureDirectoryExists(saveDir);
    await writeFile(`${saveDir}/${filename}`, buffer);
    console.log(`PDF saved: ${saveDir}/${filename}`);
  } catch (error) {
    console.error(`Failed to download PDF ${url}: ${error.message}`);
  }
}

// Function to scrape content from a URL
async function useLLamaToGuessWhatToDoBetterThanHUman(url, saveDir) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // use extension - in the console - download all images - tailwind - make tool
  return data;
}

// Save scraped data to JSON file
async function saveDataToFile(url, data, saveDir) {
  const filename = `${url.replace(/https?:\/\//, "").replace(/\W+/g, "_")}.json`;
  const jsonContent = JSON.stringify(data, null, 2);
  await ensureDirectoryExists(saveDir);
  try {
    await writeFile(`${saveDir}/${filename}`, jsonContent);
    console.log(`Data saved to ${saveDir}/${filename}`);
  } catch (error) {
    console.error(`Failed to write file ${filename}: ${error.message}`);
  }
}

// Main function to run the scraper
async function main() {
  let url =
    "https://tinlizzie.org/IA/index.php/Papers_from_Viewpoints_Research_Institute";
  let saveDir = "static/alan_kay/";

  try {
    console.log(`Scraping content from ${url}`);
    const data = await scrapePage(url, saveDir);
    await saveDataToFile(url, data, saveDir);
  } catch (error) {
    console.error(`Failed to scrape ${url}: ${error.message}`);
  }
}

// main();

// ////// new module
// const { chromium } = require("playwright");

async function fetchGitHubSecrets(secretNames) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    console.error(
      "Missing GitHub configuration. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.",
    );
    process.exit(1);
  }
  const octokit = new Octokit({ auth: token });

  try {
    const secrets = await Promise.all(
      secretNames.map(async (secretName) => {
        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/actions/secrets/{secret_name}",
          {
            owner,
            repo,
            secret_name: secretName,
          },
        );
        return { name: secretName, value: data.value };
      }),
    );

    secrets.forEach(({ name, value }) => {
      process.env[name] = value;
    });
  } catch (error) {
    console.error("Error fetching GitHub secrets:", error.message);
    process.exit(1);
  }
}
