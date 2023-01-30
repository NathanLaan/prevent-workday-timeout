# ![Prevent-Workday-Timeout Icon](/src/images/changes-black-32.png) Prevent-Workday-Timeout

A simple Google Chrome extension to prevent session timeouts on the Workday website.

By default, the Workday session is configured to timeout within ten minutes. Although the Workday website has a session timeout warning message, the Workday user interface includes a number of overlay windows that frequently hide this warning message.

This extension will reliably prevent your Workday session from timing out for a minimum of two hours, and up to a maximum of approximately eight hours. If your computer goes to sleep, or if Google Chrome is inactive for a significant period of time, the extension will no longer be able to keep your Workday session alive.

This extension is not affiliated with [Workday](http://workday.com), or any [Workday products or services](https://www.workday.com/en-us/legal/workday-trademark-usage-guidelines.html).

## Usage

1. Install the [Prevent-Workday-Timeout extension from the Google Chrome web store](https://chrome.google.com/webstore/detail/prevent-workday-timeout/mcliokdljpofldmihgimfcnkmgifckki).
2. Pin the Prevent-Timeout-Workday extension to the Google Chrome toolbar.
3. Login to Workday.
4. Click the Prevent-Timeout-Workday button in the Google Chrome toolbar. The icon colour should change from black to <span style="color:blue">blue</span>.
5. Click the Prevent-Timeout-Workday button again to stop the extension from keeping your Workday session alive. The icon colour should change to black.
6. Logout from Workday. Or look away for a few seconds and Workday will log you out :)

## Roadmap

- [x] Narrow `host_permissions` to `https://wd5.workday.com`.

  ```json
  "host_permissions": [
    "*://*/*"
  ]
  ```

- [x] Clear Interval when browser is closed or addon is disabled.
- [x] Remove all of the console debug statements.
- [ ] User notification when cookie is not found. Change icon to red.
- [ ] Automatically detect the Workday cookies and turn on the session timeout prevention.
- [ ] Automatically stop the session timeout prevention when the Workday cookies are no longer detected.

## References

- Icons by [Radhe Icon - Flaticon](https://www.flaticon.com/free-icons/changes)
- [JavaScript setInterval clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [JavaScript Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Chrome.Action.setTitle()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setTitle)
- [Host Permissions requirements for Manifest v3](https://stackoverflow.com/questions/19124015/chrome-extension-no-permission-for-cookies-at-url)
- [Host Permissions documentation for Manifest v3](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)
- [Cookies Permissions documentation for Manifest v3](https://developer.chrome.com/docs/extensions/reference/cookies/)
- This project loosely follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
