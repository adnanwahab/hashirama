const { chromium } = require('playwright');


const email_logins = [
{ email: 'mail@adnanwahab.com', password: 'sicp.123' },
{ email: 'adnan.f.wahab@gmail.com', password: 'sicp.123' },
{ email: 'eggnog.wahab@gmail.com', password: 'sicp.123' },
{ email: 'shel.bernstein123@gmail.com', password: 'sicp.123' },
]


(async () => {
  // Launch a new browser
  const browser = await chromium.launch({ headless: false }); // set headless to true if you want it to run without UI
  const context = await browser.newContext();

  // Open a new page
  const page = await context.newPage();

  // Go to Gmail login page
  await page.goto('https://mail.google.com');

  // Fill the email field
  await page.fill('input[type="email"]', 'your-email@gmail.com');
  await page.click('#identifierNext');

  // Wait for the password field and fill it
  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.fill('input[type="password"]', 'your-password');
  await page.click('#passwordNext');

  // Wait for Gmail inbox to load
  await page.waitForSelector('table[role="grid"]', { timeout: 60000 });

  // You are now logged in; you can extract data or perform actions
  console.log('Logged in and inbox loaded.');

  // Close the browser
  await browser.close();
})();
