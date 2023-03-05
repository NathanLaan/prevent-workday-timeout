# ![Prevent-Workday-Timeout Icon](/src/images/changes-black-32.png) Prevent-Workday-Timeout

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/mcliokdljpofldmihgimfcnkmgifckki.svg?style=flat-square)](https://chrome.google.com/webstore/detail/prevent-workday-timeout/mcliokdljpofldmihgimfcnkmgifckki)
[![Chrome Web Store Downloads](https://img.shields.io/chrome-web-store/d/mcliokdljpofldmihgimfcnkmgifckki.svg?style=flat-square)](https://chrome.google.com/webstore/detail/prevent-workday-timeout/mcliokdljpofldmihgimfcnkmgifckki)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/mcliokdljpofldmihgimfcnkmgifckki.svg?style=flat-square)](https://chrome.google.com/webstore/detail/prevent-workday-timeout/mcliokdljpofldmihgimfcnkmgifckki)
[![Chrome Web Store Rating Count](https://img.shields.io/chrome-web-store/rating-count/mcliokdljpofldmihgimfcnkmgifckki.svg?style=flat-square)](https://chrome.google.com/webstore/detail/prevent-workday-timeout/mcliokdljpofldmihgimfcnkmgifckki/reviews)

A simple Google Chrome extension to prevent session timeouts on the Workday website.

By default, the Workday session is configured to timeout within ten minutes. Although the Workday website has a session timeout warning message, the Workday user interface includes a number of overlay windows that frequently hide this warning message.

This extension will reliably prevent your Workday session from timing out for a minimum of two hours, and up to a maximum of approximately eight hours. If your computer goes to sleep, or if Google Chrome is inactive for a significant period of time, the extension will no longer be able to keep your Workday session alive.

This extension is not affiliated with [Workday](http://workday.com), or any [Workday products or services](https://www.workday.com/en-us/legal/workday-trademark-usage-guidelines.html).

## Usage

1. Install the [Prevent-Workday-Timeout extension from the Google Chrome web store](https://chrome.google.com/webstore/detail/prevent-workday-timeout/mcliokdljpofldmihgimfcnkmgifckki).
2. Pin the Prevent-Timeout-Workday extension to the Google Chrome toolbar.
3. Login to Workday.
4. The Prevent-Timeout-Workday button icon should change from black ![Prevent-Workday-Timeout Icon](/src/images/changes-black-32.png) to blue ![Prevent-Workday-Timeout Icon](/src/images/changes-blue-32.png).
5. Click the Prevent-Timeout-Workday button to display the pop-up window. The pop-up doesn't do anything right now. In the future, it will display info on the Workday session.
6. Logout from Workday. Or look away for a few seconds and Workday will log you out :)

![Prevent-Workday-Timeout Extension in Google Chrome](/screenshot.png)

## Roadmap

- [x] Narrow `host_permissions` to `https://wd5.workday.com`.

  ```json
  "host_permissions": [
    "*://*/*"
  ]
  ```

- [x] Clear interval when browser is closed or addon is disabled.
- [x] Remove all of the console debug statements.
- [ ] User notifications. TBD.
- [ ] Review, assess, and keep minimal number of console debug statements.
- [ ] Issue: [Service worker script is inactive and not activating where the action button is clicked](https://bugs.chromium.org/p/chromium/issues/detail?id=1316588Possible) and [`Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received`](https://stackoverflow.com/questions/72494154/a-listener-indicated-an-asynchronous-response-by-returning-true-but-the-messag) is generated when service worker script becomes inactive in between executing an event and returning an async result.
  - [x] Fix: Create client script on Workday domain tabs. Send message from content script to service script update cookies. Interval functions on content and service scripts. Content script activates service script and keeps it active.
    - content -> load -> send: content-load
    - content -> load -> startInterval
    - content -> interval (20s) -> send: update-workday-cookies
    - content -> unload -> send: content-unload
    - service -> receive: update-workday-cookies -> startInterval if not running
    - service -> receive: content-unload -> stopInterval
  - [x] Test 1: Login to Workday while service worker is active.
    - [x] Test 1a: Does the background script receive the message from the client script?
    - [x] Test 1b: Does the background script start the interval function?
    - [x] Test 1c: Does the Workday session stay alive for at least one hour?
  - [ ] Test 2: Login to Workday while service worker is inactive.
    - [ ] Test 2a: Does the background script receive the message from the client script?
    - [ ] Test 2b: Does the background script start the interval function?
    - [ ] Test 2c: Does the Workday session stay alive for at least one hour?
- [ ] Add Workday session info to the pop-up button.
- [x] Clear service interval when cookie error occurs in the service.
- [ ] Clear content interval when cookie error occurs in the service.
  - [ ] Test 1: Login to Workday. Let the extension run for a while. Delete the cookie without closing the Workday website. An error should be generated, the interval should be stopped, the error notification should be displayed, and the extension action icon should change to red.
- [ ] Issue: The content-unload message is received, and the `Stopping Prevent-Timeout-Workday` function is triggered, but the service interval continues running.
  - `2023-02-09T19:07:20.981Z PWT Message Received: content-unload URL: ...`
  - `2023-02-09T19:07:20.982Z PWT Stopping Prevent-Timeout-Workday.`
  - `2023-02-09T19:07:21.391Z PWT updateCookie: LastUserActivity - ...`
  - `2023-02-09T19:07:21.391Z PWT updateCookie: SessionTimeoutMS - ...`
- [ ] v1.1.x
  - [x] Add support for cookies on domains other than WD5.
  - [x] *.workday.com Host Permissions.
  - [ ] Detect cookies using chrome.cookies.onChanged
    - [chrome.cookies.onChanged](https://developer.chrome.com/docs/extensions/reference/cookies/#event-onChanged)
    - [chrome.cookies.OnChangedCause](https://developer.chrome.com/docs/extensions/reference/cookies/#type-OnChangedCause)
    - [ ] Add cookie info to popup.

## References

- Icons by [Radhe Icon - Flaticon](https://www.flaticon.com/free-icons/changes)
- Blue Icon Colour: #0091FF, Red Icon Colour: #FF2500
- [JavaScript setInterval clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [JavaScript Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Chrome.Action.setTitle()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setTitle)
- [Host Permissions requirements for Manifest v3](https://stackoverflow.com/questions/19124015/chrome-extension-no-permission-for-cookies-at-url)
- [Host Permissions documentation for Manifest v3](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)
- [Cookies Permissions documentation for Manifest v3](https://developer.chrome.com/docs/extensions/reference/cookies/)
- This project loosely follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)
