//
// Pre-pad num < 10 with a "0".
//
function pad(num) {
  return (num<10 ? "0" : "") + num;
}
//
// Return formatted timestamp: hh:mm:ss.
//
function getTimeFormatted() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
//
// Console log with timestamp and message.
//
function clog(m) {
  console.log(getTimeFormatted() + " PWT " + m);
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

//
// Called on successful incrementCookie(). Updates browser action tooltip.
//
function checkCookie(cookie) {
  if(cookie) {
    chrome.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING: Last updated " + getTimeFormatted()});
  } else {
    //
    // TODO: Change icon to red? Maybe need a 
    // yellow icon for "running" but with "error"?
    //
    chrome.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING: Unable to update Workday session " + getTimeFormatted()});
  }
}

//
// Increment the specified cookieValue by sleepTime.
//
function updateCookie(details, cookieValue) {
  details.value = (parseInt(cookieValue) + sleepTime).toString();
  clog("updateCookie: " + details.name + " - " + details.value);
  chrome.cookies.set(details)
    .then(cookie => checkCookie(cookie))
    .catch(error => console.log(error));
  return true; // Needed for async
}

//
// Modify cookies to prevent session timeout. Function is run on interval timer.
//
function updateWorkdayCookies() {
  //
  // Constants are scoped here and not globally, because 
  // updateCookie() adds a 'value' field to details.
  //
  const detailsLUA = { url: wdCookieURL, name: "LastUserActivity" };
  const detailsSTM = { url: wdCookieURL, name: "SessionTimeoutMS" };
  chrome.cookies.get(detailsLUA)
    .then(cookie => updateCookie(detailsLUA, cookie.value))
    .catch(error => console.log(error));
  chrome.cookies.get(detailsSTM)
    .then(cookie => updateCookie(detailsSTM, cookie.value))
    .catch(error => console.log(error));
  return true; // Needed for async
}

//
// Listener for the Google Chrome extension button.
//
// chrome.action.onClicked.addListener(function (tab) {
//   try {
//     if(running) {
//       //stopPreventWorkdayTimeoutInterval();
//     } else {
//       //startPreventWorkdayTimeoutInterval();
//     }
//   } catch(err) {
//     clog(err);
//     clearInterval(intervalFunction);
//     running = false;
//   }
//   // NOT NEEDED return true;
// });

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
  clog("Starting Prevent-Timeout-Workday.");
  intervalFunction = setInterval(updateWorkdayCookies, sleepTime);
}

function stopInterval() {
  running = false;
  clog("Stopping Prevent-Timeout-Workday.");
  clearInterval(intervalFunction);
}

//
// Client is using Promise instead of callback, but callback is still defined. 
//
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  switch (request.message) {
    case 'prevent-timeout':
      clog("Message Received: prevent-timeout URL: " + request.url);
      callback();
      break;
    case 'content-load':
      clog("Message Received: content-load URL: " + request.url);
      startInterval();
      callback();
      break;
    case 'content-unload':
      clog("Message Received: content-unload URL: " + request.url);
      setActionIconOff();
      stopInterval();
      callback();
      break;
    case 'update-workday-cookies':
      clog("Message Received: update-workday-cookies URL: " + request.url);
      setActionIconOn();
      if(!running) {
        startInterval();
      }
      break;
    default:
      clog("Error - Unexpected Message: " + request.message);
  }
  /*
   * Return true to keep response function in scope for async calls
   * https://stackoverflow.com/questions/20077487/
   */
  return true;
});
