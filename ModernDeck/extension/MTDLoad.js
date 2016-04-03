// MTDLoad.js
// Copyright (c) 2016 Ryan Dolan (dangered wolf)

"use strict";
console.log("MTDLoad 6.0");

var isDev = true;
var isApp = typeof require !== "undefined";
var isChromium = typeof chrome !== "undefined"; // NOTE TO SELF: This probably triggers on Microsoft Edge but idk
var isSafari = typeof safari !== "undefined";
var isFirefox = !isChromium && !isSafari && !isApp;
var electron,app,BrowserWindow,mainWindow;

if (isApp) {

  electron = require('electron');
  app = electron.app;
  BrowserWindow = electron.BrowserWindow;

  app.on('ready',function(){
    mainWindow = new BrowserWindow({width: 1280, height: 720, autoHideMenuBar: true, frame:true});

    mainWindow.loadURL('file://' + __dirname + '../../../index.html');

    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    //mainWindow.webContents.executeJavaScript("var links=document.querySelectorAll(\"link[title='dark'],link[title='light']\");for(i=0;i<links.length;i++){links[i].href=\"\"}");

    mainWindow.on('closed', function() {
      app.quit();
    });
  });
}

function InjectDevStyles() {
  console.log("*boops your nose* hey there developer :3");
  console.log("boopstrapping moderndeck.css for extensibility");
  console.log("don't forget to check that moderndeck.css is in manifest.json before shipping, you goof");

  if (isFirefox) {
    var links = document.querySelectorAll("link[title='dark'],link[title='light']");

    for (i = 0; i < links.length; i++) {
      links[i].href = "";
    }
  }

  var injStyles = document.createElement("link");
  injStyles.rel = "stylesheet";

  if (isChromium && !isApp) {
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

if ((!isApp && typeof localStorage.mtd_stylesheet_dev_mode !== "undefined" && localStorage.mtd_stylesheet_dev_mode === "true") || isDev || isFirefox) {
  InjectDevStyles();
}

console.log("Bootstrapping MTDinject");
var InjectScript = document.createElement("script");

function MTDURLExchange(url) {
  var injurl = document.createElement("div");
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
