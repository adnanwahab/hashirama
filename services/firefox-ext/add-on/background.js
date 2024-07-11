document.body.style.border = "5px solid green"


// setTimeout(function () {
// //let tabs = browser.tabs.query({ currentWindow: true });
// let port = browser.runtime.connectNative("ls");
// port.onMessage.addListener((response) => {
//   console.log("Received: " + response);
// });


//   console.log(browser)


// })
/*
On startup, connect to the "ping_pong" app.


*/
function onResponse(response) {
  console.log(`Received ${response}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}
let sending = browser.runtime.sendNativeMessage("ping_pong", "ping");
  sending.then(onResponse, onError);


console.log("please work", browser);
let port = browser.runtime.connectNative("ping_pong");
console.log("buttfuck");
/*
Listen for messages from the app.
*/
port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});
console.log("buttfuck");
/*
On a click on the browser action, send the app a message.
*/
browser.browserAction.onClicked.addListener(() => {
  console.log("Sending:  ping");
  port.postMessage("ping");
});
console.log("buttfuck");
//let searching = browser.bookmarks.search({url: 'http'});
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API
//https://github.com/microsoft/playwright
//https://github.com/ArchiveBox/ArchiveBox
//https://github.com/alyssaxuu/omni
//https://github.com/akshat46/FlyingFox
//https://github.com/alyssaxuu/omni
// https://github.com/betterbrowser/arcfox
// https://github.com/akshat46/FlyingFox
// https://github.com/firefox-devtools/profiler
// https://github.com/ArchiveBox/ArchiveBox
// web-ext
