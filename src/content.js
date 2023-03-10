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
let running = false;
let intervalFunction;
const sleepTime = 25000;


//
// Modify cookies to prevent session timeout. Function is run on interval timer.
//
function preventWorkdayTimeout() {
  if(running) {
    // update-workday-cookies
    chrome.runtime.sendMessage({message: 'update-workday-cookies', url: location.href})
      .then(clog("Message Sent: update-workday-cookies"))
      .catch(error => console.log(error));
    }
  return true; // For async
}

function startInterval() {
  running = true;
  clog("Starting Prevent-Timeout-Workday.");
  intervalFunction = setInterval(preventWorkdayTimeout, sleepTime);
}

function stopInterval() {
  running = false;
  clog("Stopping Prevent-Timeout-Workday.");
  clearInterval(intervalFunction);
}


// function sendPreventTimeoutMessage() {
//   setTimeout(function() {
//     chrome.runtime.sendMessage({message: 'prevent-timeout', url: window.location.href})
//       //.then(console.log("PWT - Client - sendPreventTimeoutMessage"))
//       .catch(error => console.log(error));
//       sendPreventTimeoutMessage();
//   }, 10000);
// }
// sendPreventTimeoutMessage();

window.addEventListener("unload", (event) => {
  clog("UNLOAD");
  chrome.runtime.sendMessage({message: 'content-unload', url: location.href})
    .then(clog("Background Message Sent Successfully"))
    .catch(error => console.log(error));
  stopInterval();
});

window.addEventListener("load", (event) => {
  clog("Content Script Loaded");
  
  chrome.runtime.sendMessage({message: 'content-load', url: location.href})
    .then(clog("Background Message Sent Successfully"))
    .catch(error => console.log(error));

  startInterval();

});
