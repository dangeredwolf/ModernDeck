// TDELoad.js
// Copyright (c) 2015 Dangered Wolf 

console.log("Enhancer 5.3.3");

if (typeof chrome !== "undefined") {
  var isChromium = true;
}

if (typeof safari !== "undefined") {
  var isSafari = true;
}

if (typeof chrome == "undefined" && typeof safari == "undefined") {
  var isFirefox = true;
}


function InjectDevStyles() {
  console.log("*boops your nose* hey there developer :3");
  console.log("boopstrapping enhancer.css for extensibility");
  console.log("don't forget to check that enhancer.css is in manifest.json before shipping, you goof");

  var links = document.querySelectorAll("link[title='dark'],link[title='light']");

  for (i = 0; i < links.length; i++) {
    links[i].href = "";
  }

  injStyles = document.createElement("link");
  injStyles.rel = "stylesheet";

  if (isChromium) {
    injStyles.href = chrome.extension.getURL("sources/enhancer.css");
  } else if (isSafari) {
    injStyles.href = safari.extension.baseURI + "sources/enhancer.css";
  } else if (isFirefox) {
    injStyles.href = self.options.ffTDEURLExchange + "sources/enhancer.css";
  } else {
    console.log('you done goofed')
  }

  document.head.appendChild(injStyles);
}

if (typeof localStorage.tde_stylesheet_dev_mode !== "undefined" && localStorage.tde_stylesheet_dev_mode === "true") {
  InjectDevStyles();
}

if (!isSafari && !isChromium) {
  InjectDevStyles();
}

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
  TDEURLExchange(self.options.ffTDEURLExchange);
  InjectScript.src = self.options.ffTDEURLExchange + "sources/TDEinject.js";
}

InjectScript.type = "text/javascript";
document.head.appendChild(InjectScript);