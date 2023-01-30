//
// Pre-pad num < 10 with a "0".
//
function pad(num){
  return (num<10 ? "0" : "") + num;
}
//
// Console log with date and time.
//
function clog(m) {
  const d = new Date();
  console.log(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${m}`);
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
// Increment the specified cookieValue by sleepTime.
//
function incrementCookie(details, cookieValue) {
  details.value = (parseInt(cookieValue) + sleepTime).toString();
  chrome.cookies.set(details)
    //.then(cookie => clog("Update: " + details.name + " -> " + cookie.value))
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

//
// Listener for the Google Chrome extension button.
//
chrome.action.onClicked.addListener(function (tab) {
  try {
    if(running) {
      running = false;
      //clog("Stopping Prevent-Timeout-Workday.");
      clearInterval(intervalFunction);
      chrome.action.setTitle({ title: "Prevent-Workday-Timeout STOPPED" });
      chrome.action.setIcon({ path: icon_red })
        .catch(error => console.log(error));
    } else {
      running = true;
      //clog("Starting Prevent-Timeout-Workday.");
      intervalFunction = setInterval(preventWorkdayTimeout, sleepTime);
      chrome.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING"});
      chrome.action.setIcon({ path: icon_blue })
        .catch(error => console.log(error));
    }
  } catch(err) {
    clog(err);
    clearInterval(intervalFunction);
    running = false;
  }
  // NOT NEEDED return true;
});

//
// Run clearInterval on browser close.
//
chrome.runtime.onSuspend.addListener(() => {
  clearInterval(intervalFunction).catch(error => console.log(error));
});
