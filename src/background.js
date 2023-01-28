function clog(m) {
  const d = new Date();
  console.log(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} LOG: ${m}`);
}

let running = false;
let intervalFunction;
const wdCookieURL = "https://wd5.myworkday.com";
const sleepTime = 1000;

function incrementCookie(details, cookieValue) {
  details.value = (parseInt(cookieValue) + sleepTime).toString();
  chrome.cookies.set(details)
    .then(cookie => clog("Update: " + details.name + " -> " + cookie.value))
    .catch(error => console.log(error));
}

function preventWorkdayTimeout() {
  if(running) {
    //
    // Scoped here, not globally, because incrementCookie() adds 'value' field
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
  return true;
}

chrome.action.onClicked.addListener(function (tab) {
  try {
    if(running) {
      running = false;
      clog("Stopping Prevent-Timeout-Workday.");
      clearInterval(intervalFunction);
      chrome.action.setTitle({ title: "Prevent-Workday-Timeout STOPPED" });
      chrome.action.setIcon({ path: "/images/extension-icon-stopped-128.png" })
        .catch(error => console.log(error));
    } else {
      running = true;
      clog("Starting Prevent-Timeout-Workday.");
      intervalFunction = setInterval(preventWorkdayTimeout, sleepTime);
      chrome.action.setTitle({ title: "Prevent-Workday-Timeout RUNNING"});
      chrome.action.setIcon({ path: "/images/extension-icon-running-128.png" })
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
// TODO: clearInterval on browser close.
//
chrome.runtime.onSuspend.addListener(() => {
  clearInterval(intervalFunction).catch(error => console.log(error));
});
