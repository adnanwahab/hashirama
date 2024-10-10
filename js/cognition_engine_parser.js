// const { serve } = require('bun');


// const wsServer = serve({
//   port: 3000,
//   websocket: {
//     open(ws) {
//       console.log('A client connected.');
//       ws.send('Welcome to the Bun WebSocket server!');

//       setInterval(() => {
//         const randomMessage = Math.random().toString(36).substring(2, 15);
//         ws.send(JSON.stringify({ message: randomMessage }));
//         console.log(`Sent random message: ${randomMessage}`);
//       }, 1000);

//       setInterval(() => {
//         ws.send(JSON.stringify({ 
//           command: "getContent",
//           selector: '.entity-result__title-text'
//         }));  
//       }, 1000);

//       // New interval to scroll to the bottom and send a selector for '*'
//       setInterval(() => {
//         ws.send(JSON.stringify({
//           command: "scrollToBottom"
//         }));
//         ws.send(JSON.stringify({
//           command: "getContent",
//           selector: '*'
//         }));
//         console.log('Scrolled to bottom and sent selector for *');
//       }, 5000);
//     },
//     message(ws, message) {
//       console.log('Received message from client:', message);
//       ws.send(`Server response to: ${message}`);
//     },
//     close(ws) {
//       console.log('A client disconnected.');
//     },
//   },
// });
// console.log(wsServer);
// console.log('WebSocket server is running on ws://localhost:3000');


// Since the error indicates a redeclaration of the variable 'server', we should rename the variable to avoid conflicts.
// Additionally, since the original code seems to be using Bun, ensure that Bun is imported if needed.
function get_all_contacts() {
  let contacts = [];
  setInterval(() => {
    let this_page_contacts = Array.from(document.querySelectorAll('.entity-result__title-text'))
      .map(_ => {
        return {
          name: _.firstElementChild.firstElementChild.firstChild.textContent,
          'profile_link': ''
        }; // Corrected: Added closing bracket and semicolon
      });

    contacts.push(...this_page_contacts); // Corrected: Spread operator to push array elements

    document.querySelector(next_button).click();

    console.log(contacts);
  }, 5000);

  setTimeout(() => {
    console.log('dl', contacts);
    downloadBlob(JSON.stringify(contacts), `${company_name}.txt`, 'text/plain'); // Corrected: Template literal syntax
  }, 100 * 5000);
}


  
  // Example usage:
  //const text = 'Hello, world!';
  //downloadBlob(text, 'hello.txt', 'text/plain');
  
  
  
  function get_all_contacts() {
     let contacts = [];
     setInterval(() => {
       let this_page_contacts = Array.from(document.querySelectorAll('.entity-result__title-text'))
         .map(_ => {
           return {
             name: _.firstElementChild.firstElementChild.firstChild.textContent,
             'profile_link': ''
           }; // Corrected: Added closing bracket and semicolon
         });

       contacts.push(...this_page_contacts); // Corrected: Spread operator to push array elements

       document.querySelector(next_button).click();

       console.log(contacts);
     }, 5000);

     setTimeout(() => {
       console.log('dl', contacts);
       downloadBlob(JSON.stringify(contacts), `${company_name}.txt`, 'text/plain'); // Corrected: Template literal syntax
     }, 100 * 5000);
  }
  


  const company_name = 'waymo' 


  function downloadBlob(content, fileName, contentType) {
      const blob = new Blob([content], { type: contentType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);  // Free memory
  }
  
  // Example usage:
  //const text = 'Hello, world!';
  //downloadBlob(text, 'hello.txt', 'text/plain');
  
  
  
  //callLama


const steps = [
  function () {
    
    //window.location.href = 'https://www.linkedin.com/company/waymo/people/'
console.log('step 1')
  },
  //get_all_contacts
]


const bunServer = Bun.serve({
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds

      const randomMessage = Math.random().toString(36).substring(2, 15);
      // Convert the message object to a JSON string before sending
      server.websocket.send(JSON.stringify({ message: randomMessage }));
      //console.log(`Sent random message: ${randomMessage}`);
    
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    open(ws) {
      console.log('A client connected.');
      ws.send('Welcome to the Bun WebSocket server!');

      setInterval(() => {
        const randomMessage = Math.random().toString(36).substring(2, 15);
        // Convert the message object to a JSON string before sending
        ws.send(JSON.stringify({ message: randomMessage }));
        console.log(`Sent random message: ${randomMessage}`);
      }, 1000);

      setInterval(() => {
        ws.send(JSON.stringify({ 
          //command: "eval",
          //code:  'alert("hello")'
          command: "getContent",
          selector: '.entity-result__title-text'
        }));  
      }, 1000);

      // New interval to scroll to the bottom and send a selector for '*'
      setInterval(() => {
        ws.send(JSON.stringify({
          command: "scrollToBottom"
        }));
        ws.send(JSON.stringify({
          command: "getContent",
          selector: '*'
        }));
        console.log('Scrolled to bottom and sent selector for *');
      }, 5000);
    },
    // this is called when a message is received
    async message(ws, message) {
      console.log(`Received ${message}`);
      console.log('get content PLS');

      
      //ws.send(`You said: ${message}`);
    },
  },
});

console.log(`Listening on ${bunServer.hostname}:${bunServer.port}`);
// const server = Bun.serve<{ authToken: string }>({
//   fetch(req, server) {
//     const success = server.upgrade(req);
//     if (success) {
//       // Bun automatically returns a 101 Switching Protocols
//       // if the upgrade succeeds
//       return undefined;
//     }

//     // handle HTTP request normally
//     return new Response("Hello world!");
//   },
//   websocket: {
//     // this is called when a message is received
//     async message(ws, message) {
//       console.log(`Received ${message}`);
//       // send back a message
//       ws.send(`You said: ${message}`);
//     },
//   },
// });

// console.log(`Listening on ${server.hostname}:${server.port}`);





// const path = require("path");
// import { chromium } from "playwright";
// //main()
// let count = 0
// const username = "mail@adnanwahab.com";
// const password = "sicp.123";
// const showMoreButtonSelector = 'button.scaffold-finite-scroll__load-button';
// async function main(prompt) {
//   const userDataDir = path.join(process.env.HOME, "Library", "Application Support", "Google", "Chrome");
//   const browser = await chromium.launch({
//     headless: false,
//     devtools: true, // Add this line to open DevTools

//     viewport: {
//       width: 1000,
//       height: 2000,
//     },
//   });
//   const page = await browser.newPage(); // Corrected to use newPage instead of newContext

//   await login_to_linkedin(page)
//   // const browser = await chromium.launchPersistentContext(userDataDir, {
//   //   headless: false,
//   //   viewport: {
//   //     width: 1000,
//   //     height: 2000,
//   //   },
//   // });
//   //await page.goto("https://www.linkedin.com/company/waymo/people/", { waitUntil: 'networkidle' });

//   //await new Promise(resolve => setTimeout(resolve, 5000));
//   //await page.goto("https://www.linkedin.com/company/waymo/people/", { waitUntil: 'networkidle' });
//   await page.waitForSelector('input', { state: 'visible' });

//   console.log('waiting for networkidle');
//   await page.fill('input', 'Waymo');
//   await page.press('input', 'Enter');


//   try {
//     const employees = await page.evaluate(async() => {
//       console.log("Evaluating employees");
//             document.body.style.zoom = '0.5';
//       await new Promise(resolve => setTimeout(resolve, 3000));
//       const employees = [];
//       document.querySelectorAll(".entity-result__content").forEach((element) => {
//         const nameElement = element.querySelector(".entity-result__title-text a span span");
//         if (nameElement) {
//           employees.push({
//             name: nameElement.textContent.trim(),
//           });
//         }
//       });
//       // console.log(employees);
//       // return employees;
//     });

//     // if (count < 10) {
//     //   console.log('clicking next page in to LinkedIn');
//     //   await click_show_more_button(page);
//     //   console.log(employees);
//     //   count += 1;
//     // }
//     //console.error("An error occurred:", error);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   } finally {
//     console.log("closing browser");
//     //await browser.close();
//   }
// }


// async function click_show_more_button(page) {
//   const showMoreButton = await page.$(showMoreButtonSelector);
//   if (showMoreButton) {
//     console.log('Clicking "Show more results" button');
//     await showMoreButton.click();
//     await page.waitForTimeout(2000); // Wait for more results to load
//   } else {
//     console.log('No "Show more results" button found');
//   }
//   await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
//   await page.waitForTimeout(2000);
//   let currentHeight = await page.evaluate("document.body.scrollHeight");
//   console.log(`Scrolled to height: ${currentHeight}`);
// } 
// import ollama from 'ollama'
// import { readFile, writeFile } from 'fs/promises';
// import OpenAI from "openai";
// const _prompt = `given a company, search on linkedin page and get all their employees, generate javascript code to be passed as an agent and record their detials into a json array of names this code will be executed on the page so return a url and ill watch it using playwright safari and how do i use playwright safari and - on a mac - by connecting to safari instead of opening a headless tab for now. and can you get the html tool and save it to output.html`;
// const prompt = `Write JavaScript code to${_prompt} for using Playwright to navigate to a webpage, please DO NOT RETURN ANY ENGLISH - ONLY JAVASCRIPT I CAN EXECTUTE!!!!!.`
// const login_to_linkedin = async (page) => {
//   console.log('Logging in to LinkedIn');
//   await page.goto('https://www.linkedin.com/login');
//   await page.fill('input#username', username);
//   await page.fill('input#password', password);
//   await page.click('button[type="submit"]');
//   await page.waitForNavigation({waitUntil: 'networkidle'});
//   console.log('Logged in to LinkedIn');
// }