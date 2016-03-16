// MTDLoad.js
// Copyright (c) 2015 Dangered Wolf

const isDev = true;

console.log("MTDLoad 5.4.1");

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
  console.log("boopstrapping moderndeck.css for extensibility");
  console.log("don't forget to check that moderndeck.css is in manifest.json before shipping, you goof");

  var links = document.querySelectorAll("link[title='dark'],link[title='light']");

  for (i = 0; i < links.length; i++) {
    links[i].href = "";
  }

  injStyles = document.createElement("link");
  injStyles.rel = "stylesheet";

  if (isChromium) {
    injStyles.href = chrome.extension.getURL("sources/moderndeck.css");
  } else if (isSafari) {
    injStyles.href = safari.extension.baseURI + "sources/moderndeck.css";
  } else if (isFirefox) {
    injStyles.href = self.options.ffMTDURLExchange + "sources/moderndeck.css";
  } else {
    console.log('you done goofed')
  }

  document.head.appendChild(injStyles);
}

if (typeof localStorage.mtd_stylesheet_dev_mode !== "undefined" && localStorage.mtd_stylesheet_dev_mode === "true" || isDev) {
  InjectDevStyles();
}

if (!isSafari && !isChromium) {
  InjectDevStyles();
}

console.log("Bootstrapping MTDinject");
InjectScript = document.createElement("script");

function MTDURLExchange(url) {
  injurl = document.createElement("div");
  injurl.setAttribute("type",url);
  injurl.id = "MTDURLExchange";
  document.head.appendChild(injurl);
  console.log("injected url exchange with id " + injurl.id);
}

if (isChromium) {
  MTDURLExchange(chrome.extension.getURL(""));
  InjectScript.src = chrome.extension.getURL("sources/MTDinject.js");
} else if (isSafari) {
  MTDURLExchange(safari.extension.baseURI + "/");
  InjectScript.src = safari.extension.baseURI + "sources/MTDinject.js";
} else {
  MTDURLExchange(self.options.ffMTDURLExchange);
  InjectScript.src = self.options.ffMTDURLExchange + "sources/MTDinject.js";
}

InjectScript.type = "text/javascript";
document.head.appendChild(InjectScript);
