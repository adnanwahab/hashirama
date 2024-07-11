document.body.style.border = "5px solid green"


setTimeout(function () {
//let tabs = browser.tabs.query({ currentWindow: true });
let port = browser.runtime.connectNative("ls");
port.onMessage.addListener((response) => {
  console.log("Received: " + response);
});


  console.log(browser)


})
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
