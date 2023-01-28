# prevent-timeout-workday

A simple Google Chrome extension to prevent session timeouts on the Workday website.

## Roadmap

- [x] Narrow `host_permissions` to `https://wd5.workday.com`.

  ```
  "host_permissions": [
    "*://*/*"
  ]
  ```

- [ ] Clear Interval when browser is closed or addon is disabled.

## References

- [JavaScript setInterval clearInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
- [JavaScript Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Chrome.Action.setTitle()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/browserAction/setTitle)
- [Host Permissions for Manifest v3](https://stackoverflow.com/questions/19124015/chrome-extension-no-permission-for-cookies-at-url)
- This project loosely follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
