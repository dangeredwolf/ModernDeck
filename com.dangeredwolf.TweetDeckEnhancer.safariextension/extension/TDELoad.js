// TDELoad.js
// Copyright (c) 2015 Ryan Dolan (ryandolan123)

if (typeof safari !== "undefined") {
  var isSafari = true;
  chrome = [];
  chrome.extension = [];
  chrome.extension.getURL = function(url){return safari.extension.baseURI + url;} //wow i am lazy
}

if (typeof chrome !== "undefined") {
  var isChrome = true;
}

var links = document.getElementsByTagName("link");

for (i = 0; i < links.length; i++) { 
    if (typeof links[i].href !== "undefined") {
    	if (links[i].href.substring(0,52) === "https://ton.twimg.com/tweetdeck-web/web/css/app-dark") {
        if (isChrome) {
      		links[i].href = chrome.extension.getURL("resources/app-dark.css"); // Inject custom style sheet (Dark Theme)
        } else {
          if (isSafari) {
            links[i].href = safari.extension.baseURI + "resources/app-dark.css";
          }
        }
      }
      if (links[i].href.substring(0,53) === "https://ton.twimg.com/tweetdeck-web/web/css/app-light") {
        if (isChrome) {
          links[i].href = chrome.extension.getURL("resources/app-light.css"); // Inject custom style sheet (Light Theme)
        } else {
          if (isSafari) {
            links[i].href = safari.extension.baseURI + "resources/app-light.css";
          }
        }
      }
    }
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

  document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="' + chrome.extension.getURL("resources/spinner.mov") + '" autoplay loop></video>';
  console.log(document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML);
  //window.tde5loadingreplaced = true;
}

setTimeout(ReplaceLoadingIndicator,0);

/*var scrs = document.getElementsByTagName("script");

for (i = 0; i < scrs.length; i++) { 
    if (typeof scrs[i].src !== "undefined") {
      if (scrs[i].src.substring(0,55) === "https://ton.twimg.com/tweetdeck-web/web/scripts/default") {
        scrs[i].src = chrome.extension.getURL("resources/default-debug.js"); // testing
      }
    }
}*/

var AudioSources = document.getElementsByTagName("source");

for (i = 0; i < AudioSources.length; i++) { 
  AudioSources[i].remove();
}

var NotificationSound = document.getElementsByTagName("audio")[0];
NotificationSound.src = "https://ryandolan123.com/assets/tweetdeck/img/alert_2.mp3";

InjectScript = document.createElement("script");
InjectScript.src = chrome.extension.getURL("resources/TDEinject.js");
InjectScript.type = "text/javascript";
document.head.appendChild(InjectScript);

InjectFonts = document.createElement("style");
InjectFonts.innerHTML = "@font-face{font-family:'RobotoDraft';font-style:normal;font-weight: 300;src:local('RobotoDraft Light'),local('RobotoDraft-Light'),url(" + chrome.extension.getURL("resources/fonts/Roboto300latinext.woff2") + ") format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF;}@font-face{font-family:'RobotoDraft';\
  font-style: normal;\
  font-weight: 300;\
  src: local('RobotoDraft Light'), local('RobotoDraft-Light'), url(" + chrome.extension.getURL("resources/fonts/Roboto300latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}\
/* latin-ext */\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 400;\
  src: local('RobotoDraft'), local('RobotoDraft-Regular'), url(" + chrome.extension.getURL("resources/fonts/Roboto400latinext.woff2") + ") format('woff2');\
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
}\
/* latin */\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 400;\
  src: local('RobotoDraft'), local('RobotoDraft-Regular'), url(" + chrome.extension.getURL("resources/fonts/Roboto400latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}\
/* latin-ext */\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 500;\
  src: local('RobotoDraft Medium'), local('RobotoDraft-Medium'), url(" + chrome.extension.getURL("resources/fonts/Roboto500latinext.woff2") + ") format('woff2');\
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
}\
/* latin */\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 500;\
  src: local('RobotoDraft Medium'), local('RobotoDraft-Medium'), url(" + chrome.extension.getURL("resources/fonts/Roboto500latin.woff2") + ") format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}\
/* latin-ext */\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 700;\
  src: local('RobotoDraft Bold'), local('RobotoDraft-Bold'), url(" + chrome.extension.getURL("resources/fonts/Roboto700latinext.woff2") + ") format('woff2');\
  unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
}\
/* latin */\
@font-face {\
  font-family: 'RobotoDraft';\
  font-style: normal;\
  font-weight: 700;\
  src: local('RobotoDraft Bold'), local('RobotoDraft-Bold'), url(" + chrome.extension.getURL("resources/fonts/Roboto700latin.woff2") + "2) format('woff2');\
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
}";

document.head.appendChild(InjectFonts);