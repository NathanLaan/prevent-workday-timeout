//
// Chrome supports only chrome.api
// Firefox supports browser.api and chrome.api
// Edge supports only browser.api
//
//browser = browser || chrome;

alert("hi!");

console.log("PWT-Firefox-Test Loading");
var button = document.createElement("button");
button.innerText = "Send message";
button.addEventListener("click", sendMessage);
document.body.append(button);

function sendMessage(){
  console.log("Sending ping");
  browser.runtime.sendMessage("ping", (response) => {
    console.log(`Received ${response}`);
  });
}
