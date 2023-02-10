/**
 * Log the message to the console with timestamp.
 * @param {String} m - The message to be logged.
 */
function clog(m) {
  console.log(`${new Date().toISOString()} PWT ${m}`);
} 

//
// Globals
//
const wdCookieURL = "https://wd5.myworkday.com";
const icon_red = "/images/changes-red-128.png";
const icon_blue = "/images/changes-blue-128.png";
const icon_black = "/images/changes-black-128.png";
let running = false;
let intervalFunction;
//
// Idle is 30s: 
// https://developer.chrome.com/docs/extensions/mv3/service_workers/
//
const sleepTime = 20000;

/**
 * Log the error, and notify the user about the error.
 * @param {Object} error - The error{name, message} to log and notify.
 */
function captureError(error) {
  console.log(error);
  chrome.notifications.create("prevent-workday-timeout-cookie-error", {
    type: "basic",
    iconUrl: icon_red,
    title: "PWT: Error",
    message: error.message,
    priority: 2
  });
}

//
// Increment the specified cookieValue by sleepTime.
//
/**
 * 
 * @param {Object} details - Object containing the cookie URL and name.
 * @param {Objects} cookie - Object containing the cookie value as a string.
 * @returns 
 */
function updateCookie(details, cookie) {
  //
  // Test if cookie is valid...
  //
  if(typeof cookie === "object" && cookie !== null && cookie.value) {
    details.value = (parseInt(cookie.value) + sleepTime).toString();
    clog("updateCookie: " + details.name + " - " + details.value);
    chrome.cookies.set(details)
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
  clog("intervalFunction - " + intervalFunction);
  //
  // Constants are scoped here and not globally, because 
  // updateCookie() adds a 'value' field to details.
  //
  const detailsLUA = { url: wdCookieURL, name: "LastUserActivity" };
  const detailsSTM = { url: wdCookieURL, name: "SessionTimeoutMS" };
  chrome.cookies.get(detailsLUA)
    .then(cookie => updateCookie(detailsLUA, cookie))
    .catch(error => captureError(error));
  chrome.cookies.get(detailsSTM)
    .then(cookie => updateCookie(detailsSTM, cookie))
    .catch(error => captureError(error));
  return true; // Needed for async
}

function setActionIconOn() {
  chrome.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING"});
  chrome.action.setIcon({ path: icon_blue })
    .catch(error => console.log(error));
}

function setActionIconOff() {
  chrome.action.setTitle({ title: "Prevent-Workday-Timeout STOPPED" });
  chrome.action.setIcon({ path: icon_red })
    .catch(error => console.log(error));
}

function startInterval() {
  running = true;
  intervalFunction = setInterval(updateWorkdayCookies, sleepTime);
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
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  switch (request.message) {
    case 'prevent-timeout':
      clog("Message Received: prevent-timeout URL: " + request.url);
      callback();
      break;
    case 'content-load':
      chrome.notifications.create("prevent-workday-timeout-content-load", {
        type: "basic",
        iconUrl: icon_blue,
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
