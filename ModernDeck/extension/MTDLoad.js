// MTDLoad.js
// Copyright (c) 2019 dangered wolf

"use strict";
console.log("MTDLoad 7.0");

var isDev = true;
var isEdge = typeof MSGesture !== "undefined";
var storage = {};
var electron,app,BrowserWindow,mainWindow;

var browser = browser || chrome;

function InjectDevStyles() {
  console.log("bootstrapping moderndeck.css for extensibility");

  if (isEdge) {
    var links = document.querySelectorAll("link[title='dark'],link[title='light']");

    for (var i = 0; i < links.length; i++) {
      links[i].href = "";
    }
  }

  var injStyles = document.createElement("link");
  injStyles.rel = "stylesheet";
  injStyles.href = browser.extension.getURL("sources/moderndeck.css");


  document.head.appendChild(injStyles);
}

if ((typeof localStorage.mtd_stylesheet_dev_mode !== "undefined" && localStorage.mtd_stylesheet_dev_mode === "true") || isDev) {
  InjectDevStyles();
}

console.log("Bootstrapping Raven uwu");

var InjectScript2 = document.createElement("script");
InjectScript2.src = "https://cdn.ravenjs.com/3.19.1/raven.min.js";
InjectScript2.type = "text/javascript";
document.head.appendChild(InjectScript2);

console.log("Bootstrapping MTDinject");

var InjectScript = document.createElement("script");

function MTDURLExchange(url) {
  var injurl = document.createElement("div");
  injurl.setAttribute("type",url);
  injurl.id = "MTDURLExchange";
  document.head.appendChild(injurl);
  console.log("injected url exchange with id " + injurl.id);
}

MTDURLExchange(browser.extension.getURL(""));
InjectScript.src = browser.extension.getURL("sources/MTDinject.js");

InjectScript.type = "text/javascript";
document.head.appendChild(InjectScript);

browser.runtime.sendMessage("getStorage");

browser.runtime.onMessage.addListener(function(m) {
  if (m.name == "sendStorage") {
    storage = m.storage;
  }
});

window.addEventListener("message", function(event) {
  if (event.source == window &&
      event.data.type) {
    if (event.data.type == "setStorage") {
      browser.runtime.sendMessage({"name": "setStorage", "content": event.data.message});
    }
    else if (event.data.type == "getStorage") {
      window.postMessage({
        type: "sendStorage",
        message: storage
      }, "*");
    }
  }
});
