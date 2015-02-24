// TDELoad.js
// Copyright (c) 2015 Dangered Wolf

console.log("TDELoad loaded");
console.log("Enhancer 5.0")

if (typeof chrome !== "undefined") {
  var isChrome = true;
  console.log("Chromium Detected");
}

if (typeof chrome === "undefined") {
  chrome = [];
  chrome.extension = [];
  console.log("Not Chromium");
}

if (typeof safari !== "undefined") {
  var isSafari = true;
  chrome.extension.getURL = function(url){return safari.extension.baseURI + url;} //wow i am lazy
  console.log("Safari Detected: This is experimental!!");
}

if (typeof safari === "undefined") {
  console.log("Not Safari");
}

var isWebKit = isSafari || isChrome;

if (!isWebKit) {
  console.log("Not WebKit");
}

if (!isWebKit) {
  console.log("Gecko Detected: This is experimental!!");
  var isGecko = true;
  chrome.extension.getURL = function(url){return "https://dangeredwolf.com/assets/tdetest/" + url} 
}

function ReplaceLoadingIndicator() {
  console.log("waiting to replace logo (tdeload)")
  if (typeof document.getElementsByClassName("app-signin-form")[0] !== "undefined") {
    return;
  }

  if (typeof document.getElementsByClassName("js-startflow-content startflow")[0] === "undefined") {
    setTimeout(ReplaceLoadingIndicator,30);
    return;
  }
  console.log("done waiting, replacing logo (tdeload)")

  document.getElementsByClassName("js-startflow-content startflow")[0].className += " tde-upgrading";
  document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="' + chrome.extension.getURL("resources/spinner.mov") + '" autoplay loop></video>';
  console.log(document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML);
  //window.tde5loadingreplaced = true;
}

function TDEURLExchange(url) {
  injurl = document.createElement("div");
  injurl.setAttribute("type",url);
  injurl.id = "TDEURLExchange";
  document.head.appendChild(injurl);
  console.log("injected url exchange with id " + injurl.id);
}

if (isWebKit) {
  setTimeout(ReplaceLoadingIndicator,0);
}

var links = document.getElementsByTagName("link");

for (i = 0; i < links.length; i++) { 
    if (typeof links[i].href !== "undefined") {
    	if (links[i].href.substring(0,52) === "https://ton.twimg.com/tweetdeck-web/web/css/app-dark") {
        if (isChrome) {
      		links[i].href = chrome.extension.getURL("resources/app-dark.css"); // Inject custom style sheet (Dark Theme)
        }
        if (isSafari) {
          links[i].href = safari.extension.baseURI + "resources/app-dark.css";
        }
        if (isGecko) {
          links[i].href = "https://dangeredwolf.com/assets/tdetest/app-dark.css";
        }
      }
      if (links[i].href.substring(0,53) === "https://ton.twimg.com/tweetdeck-web/web/css/app-light") {
        if (isChrome) {
          links[i].href = chrome.extension.getURL("resources/app-light.css"); // Inject custom style sheet (Light Theme)
        } else {
          if (isSafari) {
            links[i].href = safari.extension.baseURI + "resources/app-light.css";
          }
          if (isGecko) {
            links[i].href = "https://dangeredwolf.com/assets/tdetest/app-light.css";
          }
        }
      }
    }
}

if (isChrome) {
  TDEURLExchange(chrome.extension.getURL(""));
  console.log(chrome.extension.getURL(""));
  console.log(window.TDEExtBaseURL);

  console.log("Bootstrapping TDEinject");
  InjectScript = document.createElement("script");
  InjectScript.src = chrome.extension.getURL("resources/TDEinject.js");
  InjectScript.type = "text/javascript";
  document.head.appendChild(InjectScript);
}

if (isSafari) {
  TDEURLExchange(safari.extension.baseURI);
  InjectScript = document.createElement("script");
  InjectScript.src = safari.extension.baseURI + "resources/TDEinject.js";
  InjectScript.type = "text/javascript";
  document.head.appendChild(InjectScript);
}

if (isGecko) {
  TDEURLExchange("https://dangeredwolf.com/assets/tdetest/");
  InjectScript = document.createElement("script");
  InjectScript.src = "https://dangeredwolf.com/assets/tdetest/TDEinject.js"; // TODO: Figure out how to make this local // maybe
  InjectScript.type = "text/javascript";
  document.head.appendChild(InjectScript);
}


/*var scrs = document.getElementsByTagName("script");

for (i = 0; i < scrs.length; i++) { 
    if (typeof scrs[i].src !== "undefined") {
      if (scrs[i].src.substring(0,55) === "https://ton.twimg.com/tweetdeck-web/web/scripts/default") {
        scrs[i].src = chrome.extension.getURL("resources/default-debug.js"); // testing
      }
    }
}*/
/**
InjectFonts = document.createElement("style");
InjectFonts.innerHTML = "@font-face{font-family:'RobotoDraft';font-style:normal;font-weight: 300;src:local('RobotoDraft Light'),local('RobotoDraft-Light'),url(" + chrome.extension.getURL("resources/fonts/Roboto300latinext.woff2") + ") format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF;}@font-face{font-family:'RobotoDraft';\
  font-style: normal;\
  font-weight: 300;\
  src: local('RobotoDraft Light'), local('RobotoDraft-Light'), url(" + chrome.extension.getURL("resources/fonts/Roboto300latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}\
/* latin-ext /\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 400;\
  src: local('RobotoDraft'), local('RobotoDraft-Regular'), url(" + chrome.extension.getURL("resources/fonts/Roboto400latinext.woff2") + ") format('woff2');\
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
}\
/* latin /\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 400;\
  src: local('RobotoDraft'), local('RobotoDraft-Regular'), url(" + chrome.extension.getURL("resources/fonts/Roboto400latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}\
/* latin-ext /\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 500;\
  src: local('RobotoDraft Medium'), local('RobotoDraft-Medium'), url(" + chrome.extension.getURL("resources/fonts/Roboto500latinext.woff2") + ") format('woff2');\
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
}\
/* latin /\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 500;\
  src: local('RobotoDraft Medium'), local('RobotoDraft-Medium'), url(" + chrome.extension.getURL("resources/fonts/Roboto500latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}\
/* latin-ext /\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 700;\
  src: local('RobotoDraft Bold'), local('RobotoDraft-Bold'), url(" + chrome.extension.getURL("resources/fonts/Roboto700latinext.woff2") + ") format('woff2');\
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
}\
/* latin /\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 700;\
  src: local('RobotoDraft Bold'), local('RobotoDraft-Bold'), url(" + chrome.extension.getURL("resources/fonts/Roboto700latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}";

document.head.appendChild(InjectFonts);
*/