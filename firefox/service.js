//
// Chrome supports only chrome.api
// Firefox supports browser.api and chrome.api
// Edge supports only browser.api
//
browser = browser || chrome;

//
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background#browser_support
//
if (typeof browser == "undefined") {
  // Chrome does not support the browser namespace yet.
  globalThis.browser = chrome;
}
browser.runtime.onInstalled.addListener(() => {
  //browser.tabs.create({ url: "http://example.com/firstrun.html" });
});


/**
 * Log the message to the console with timestamp.
 * @param {String} m - The message to be logged.
 */
function clog(m) {
  console.log(`${new Date().toISOString()} PWT ${m}`);
} 

//
// CONSTANTS: Using Google Style Guide for naming conventions.
// https://google.github.io/styleguide/javascriptguide.xml
//
//const wdCookieURL = "https://wd5.myworkday.com";
const COOKIE_DOMAIN = "myworkday.com";
const LUA = "LastUserActivity";
const STM = "SessionTimeoutMS";
const ICON_RED = "/images/changes-red-128.png";
const ICON_BLUE = "/images/changes-blue-128.png";
const ICON_BLACK = "/images/changes-black-128.png";
//
// Sleep time needs to be <30 because extension idle time is 30s: 
// https://developer.chrome.com/docs/extensions/mv3/service_workers/
//
const SLEEP_TIME = 20000;

//
// GLOBALS
//
let running = false;
let intervalFunction;

/**
 * Log the error, and notify the user about the error.
 * @param {Object} error - The error{name, message} to log and notify.
 */
function captureError(error) {
  console.log(error);
  browser.notifications.create("prevent-workday-timeout-cookie-error", {
    type: "basic",
    iconUrl: ICON_RED,
    title: "PWT: Error",
    message: error.message,
    priority: 2
  });
}

/**
 * Increment the specified cookie value by SLEEP_TIME.
 * @param {Object} cookie - The cookie{domain, name, value} to be updated.
 * @returns 
 */
function updateCookie(cookie) {
  //
  // Test if cookie is valid...
  //
  if(typeof cookie === "object" && cookie !== null && cookie.value) {
    let newCookie = {
      //domain: cookie.domain, // BUG: chrome prepends a period to the domain
      url: (cookie.domain.indexOf('://') === -1) ? 'https://' + cookie.domain : cookie.domain, 
      name: cookie.name,
      value: (parseInt(cookie.value) + SLEEP_TIME).toString(),
      secure: true
    }
    browser.cookies.set(newCookie)
      //.then(c => clog("Cookie Updated: " + newCookie.name + " - " +  + newCookie.value)) // debugging only
      .catch(error => captureError(error));
  } else {
    stopInterval();
  }
  return true; // Needed for async
}

//
// Modify cookies to prevent session timeout. Function is run on interval timer.
//
function updateWorkdayCookies() {
  clog("updateWorkdayCookies: intervalFunction - " + intervalFunction);
  browser.cookies.getAll({domain: COOKIE_DOMAIN}, function (cookieList) {
    cookieList.forEach(function (cookie) {
      switch(cookie.name) {
        case LUA:
          updateCookie(cookie);
          break;
        case STM:
          updateCookie(cookie);
          break;
      }
    });
  });
  return true; // Needed for async
}

function setActionIconOn() {
  browser.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING"});
  browser.action.setIcon({ path: ICON_BLUE })
    .catch(error => console.log(error));
}

function setActionIconOff() {
  browser.action.setTitle({ title: "Prevent-Workday-Timeout STOPPED" });
  browser.action.setIcon({ path: ICON_RED })
    .catch(error => console.log(error));
}

function startInterval() {
  running = true;
  intervalFunction = setInterval(updateWorkdayCookies, SLEEP_TIME);
  setActionIconOn();
  clog("Starting Prevent-Timeout-Workday - " + intervalFunction);
}

function stopInterval() {
  running = false;
  //clog("Stopping Prevent-Timeout-Workday.");
  clog("Stopping Prevent-Timeout-Workday - " + intervalFunction);
  clearInterval(intervalFunction);
  setActionIconOff();
}

//
// Content script is using Promise instead of callback, but 
// the callback (and sender) parameters are still defined. 
//
browser.runtime.onMessage.addListener((request, sender, callback) => {
  switch (request.message) {
    case 'prevent-timeout':
      clog("Message Received: prevent-timeout URL: " + request.url);
      callback();
      break;
    case 'content-load':
      browser.notifications.create("prevent-workday-timeout-content-load", {
        type: "basic",
        iconUrl: ICON_BLUE,
        title: "Prevent-Workday-Timeout",
        message: "Workday website loaded",
        priority: 2
      });
      clog("Message Received: content-load URL: " + request.url);
      startInterval();
      callback();
      break;
    case 'content-unload':
      clog("Message Received: content-unload URL: " + request.url);
      stopInterval();
      callback();
      break;
    case 'update-workday-cookies':
      clog("Message Received: update-workday-cookies URL: " + request.url);
      if(!running) {
        clog("Message Received: update-workday-cookies STARTING");
        startInterval();
      }
      break;
    default:
      clog("Unexpected Message: " + request.message);
  }
  /*
   * Return true to keep response function in scope for async calls
   * https://stackoverflow.com/questions/20077487/
   */
  return true;
});
