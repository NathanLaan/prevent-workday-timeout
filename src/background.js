//
// Pre-pad num < 10 with a "0".
//
function pad(num){
  return (num<10 ? "0" : "") + num;
}
//
// Return formatted timestamp: hh:mm:ss.
//
function getTimeFormatted() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} `;
}
//
// Console log with timestamp and message.
//
function clog(m) {
  console.log(getTimeFormatted() + m);
}

//
// Globals
//
let running = false;
let intervalFunction;
const wdCookieURL = "https://wd5.myworkday.com";
const sleepTime = 30000;
const icon_red = "/images/changes-red-128.png";
const icon_blue = "/images/changes-blue-128.png";
const icon_black = "/images/changes-black-128.png";

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
function incrementCookie(details, cookieValue) {
  clog("incrementCookie: " + details);
  details.value = (parseInt(cookieValue) + sleepTime).toString();
  chrome.cookies.set(details)
    .then(cookie => checkCookie(cookie))
    .catch(error => console.log(error));
}

//
// Modify cookies to prevent session timeout. Function is run on interval timer.
//
function preventWorkdayTimeout() {
  if(running) {
    //
    // Constants are scoped here and not globally, because 
    // incrementCookie() adds a 'value' field to details.
    //
    const detailsLUA = { url: wdCookieURL, name: "LastUserActivity" };
    const detailsSTM = { url: wdCookieURL, name: "SessionTimeoutMS" };
    chrome.cookies.get(detailsLUA)
      .then(cookie => incrementCookie(detailsLUA, cookie.value))
      .catch(error => console.log(error));
    chrome.cookies.get(detailsSTM)
      .then(cookie => incrementCookie(detailsSTM, cookie.value))
      .catch(error => console.log(error));
  }
  return true; // For async
}

function startPreventWorkdayTimeoutInterval() {
  running = true;
  //clog("Starting Prevent-Timeout-Workday.");
  intervalFunction = setInterval(preventWorkdayTimeout, sleepTime);
  chrome.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING"});
  chrome.action.setIcon({ path: icon_blue })
    .catch(error => console.log(error));
}

function stopPreventWorkdayTimeoutInterval() {
  running = false;
  //clog("Stopping Prevent-Timeout-Workday.");
  clearInterval(intervalFunction);
  chrome.action.setTitle({ title: "Prevent-Workday-Timeout STOPPED" });
  chrome.action.setIcon({ path: icon_red })
    .catch(error => console.log(error));
}

//
// Listener for the Google Chrome extension button.
//
chrome.action.onClicked.addListener(function (tab) {
  try {
    if(running) {
      stopPreventWorkdayTimeoutInterval();
    } else {
      startPreventWorkdayTimeoutInterval();
    }
  } catch(err) {
    clog(err);
    clearInterval(intervalFunction);
    running = false;
  }
  // NOT NEEDED return true;
});


chrome.runtime.onMessage.addListener((request, sender, callback) => {
  switch (request.message) {
    case 'prevent-timeout':
      clog("Message Received: prevent-timeout URL: " + request.url);
      callback();
      break;
    case 'client-load':
      startPreventWorkdayTimeoutInterval();
      clog("Message Received: client-load URL: " + request.url);
      callback();
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

//
// https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
//

//
// Run clearInterval on browser close.
//
chrome.runtime.onSuspend.addListener(() => {
  clearInterval(intervalFunction).catch(error => console.log(error));
});
