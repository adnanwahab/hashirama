// get search results from google -

// get blog , get linkedin
// github -> stars -> folowing

// twitter -> following

//get blog = llm in the loop

import { chromium } from "playwright";

async function getCareerProfileFromGoogle(query) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  await page.goto(searchUrl);

  const results = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a"));
    const socials = {
      github: null,
      blog: null,
      linkedin: null,
      twitter: null,
    };

    links.forEach((link) => {
      const href = link.href;
      if (href.includes("github.com")) {
        socials.github = href;
      } else if (href.includes("linkedin.com")) {
        socials.linkedin = href;
      } else if (href.includes("twitter.com")) {
        socials.twitter = href;
      } else if (href.includes("blog") || href.includes("medium.com")) {
        socials.blog = href;
      }
    });

    return socials;
  });

  await browser.close();
  return results;
}

async function main() {
  const query = "adnan wahab";
  const profile = await getCareerProfileFromGoogle(query);
  console.log(profile);
}

main().catch(console.error);

// filter the results to make sure its the same person - "use current company "
