msg('popup');

/**
 * Log the specified message in the background.js console
 * @param {string} m  Message to log.
 */
function msg(m) {
  chrome.runtime.sendMessage({message: m});
}
