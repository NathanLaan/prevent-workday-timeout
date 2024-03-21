//
// Chrome supports only chrome.api
// Firefox supports browser.api and chrome.api
// Edge supports only browser.api
//
browser = browser || chrome;

msg('popup');

/**
 * Log the specified message in the background.js console
 * @param {string} m  Message to log.
 */
function msg(m) {
  browser.runtime.sendMessage({message: m});
}
