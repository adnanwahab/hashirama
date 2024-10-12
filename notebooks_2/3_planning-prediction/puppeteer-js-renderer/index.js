const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

console.log('hi')

app.get('/', (req, res) => {
  //res.json({ message: 'alive' });
  console.log('wtf')
  res.send('hi')
  res.end()
});

app.get('/api/render', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.send('please provide url');
  }
  try {
    const browser = await puppeteer.launch(
      {
        executablePath: process.env.CHROME_BIN,
        args: [
          // Required for Docker version of Puppeteer
          '--no-sandbox',
          '--disable-setuid-sandbox',
          // This will write shared memory files into /tmp instead of /dev/shm,
          // because Docker’s default for /dev/shm is 64MB
          '--disable-dev-shm-usage'
        ],
    });
  
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0'});
    const pageContent = await page.content();
    console.log(`Response first 200 chars from ${url} : ${pageContent.substring(0, 200)}`);
    await browser.close();
    
    res.send(pageContent);
  } catch (err) {
    console.log(`Error while fetching ${url} `, err);
    res.send(`Error fetching ${url}`);
  }  
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
