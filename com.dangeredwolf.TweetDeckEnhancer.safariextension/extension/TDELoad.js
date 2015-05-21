// TDELoad.js
// Copyright (c) 2015 Dangered Wolf

console.log("Enhancer 5.2");

var links = document.querySelectorAll("link[title='dark'],link[title='light']");

for (i = 0; i < links.length; i++) {
  links[i].href = "";
}

injStyles = document.createElement("link");
injStyles.rel = "stylesheet";

if (typeof chrome !== "undefined") {
  var isChromium = true;
}

if (typeof safari !== "undefined") {
  var isSafari = true;
}

if (isChromium) {
  injStyles.href = chrome.extension.getURL("sources/enhancer.css");
} else if (isSafari) {
  injStyles.href = safari.extension.baseURI + "sources/enhancer.css";
} else {
  // TODO: FF stuff
}

document.head.appendChild(injStyles);

console.log("Bootstrapping TDEinject");
InjectScript = document.createElement("script");

function TDEURLExchange(url) {
  injurl = document.createElement("div");
  injurl.setAttribute("type",url);
  injurl.id = "TDEURLExchange";
  document.head.appendChild(injurl);
  console.log("injected url exchange with id " + injurl.id);
}

if (isChromium) {
  TDEURLExchange(chrome.extension.getURL(""));
  InjectScript.src = chrome.extension.getURL("sources/TDEinject.js");
} else if (isSafari) {
  TDEURLExchange(safari.extension.baseURI + "/");
  InjectScript.src = safari.extension.baseURI + "sources/TDEinject.js";
} else {
  TDEURLExchange("https://dangeredwolf.com/assets/tdetest/");
  InjectScript.src = "https://dangeredwolf.com/assets/tdetest/TDEinject.js"; // Firefox version can't update properly yet
}

InjectScript.type = "text/javascript";
document.head.appendChild(InjectScript);