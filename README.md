# Prevent-Timeout-Workday

A simple Google Chrome extension to prevent session timeouts on the Workday website. Workday seems to log you out if you so much as blink. In testing this extension works reliably to prevent logout for at least two-three hours. If your computer goes to sleep, or if Google Chrome is inactive for a significant period of time, the extension will likely not be able to keep your Workday session alive.

## Usage

1. Install the Google Chrome extension from the Google Chrome web store.
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
- [ ] User notification when cookie is not found. Change icon to red.
- [ ] Remove all of the console debug statements.

## References

- [JavaScript setInterval clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [JavaScript Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Chrome.Action.setTitle()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setTitle)
- [Host Permissions for Manifest v3](https://stackoverflow.com/questions/19124015/chrome-extension-no-permission-for-cookies-at-url)
- This project loosely follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
