//
// https://groups.google.com/a/chromium.org/g/chromium-extensions/c/LQ_VpMCpksw
//


chrome.runtime.sendMessage({message: 'client-load', url: window.location.href}, function(){
  console.log("CLIENT: client-load");
});

function preventClientTimeout() {
  setTimeout(function() {
    chrome.runtime.sendMessage({message: 'prevent-timeout', url: window.location.href})
      .then(console.log("good"))
      .catch(error => console.log(error))
    preventClientTimeout();
  }, 10000);
}

preventClientTimeout();
