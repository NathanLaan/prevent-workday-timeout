//
// Chrome supports only chrome.api
// Firefox supports browser.api and chrome.api
// Edge supports only browser.api
//
//browser = browser || chrome;

//
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background#browser_support
//
//if (typeof browser == "undefined") {
  // Chrome does not support the browser namespace yet.
//  globalThis.browser = chrome;
//}
browser.runtime.onInstalled.addListener(() => {
  console.log("onInstalled");
  browser.tabs.create({ url: "https://www.example.com" });
});

browser.runtime.onMessage.addListener((message, sender, callback) => {
  console.log("onMessage", message);
  if (message === "ping") {
    callback("pong");
  }
});
