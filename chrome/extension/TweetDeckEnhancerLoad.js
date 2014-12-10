// TweetDeckEnhancerLoad.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

var links = document.getElementsByTagName("link");

for (i = 0; i < links.length; i++) { 
    if (typeof links[i].href !== "undefined") {
    	if (links[i].href.substring(0,52) === "https://ton.twimg.com/tweetdeck-web/web/css/app-dark") {
    		links[i].href = chrome.extension.getURL("resources/app-dark.css"); // Inject custom style sheet (Dark Theme)
    	}
    	if (links[i].href.substring(0,53) === "https://ton.twimg.com/tweetdeck-web/web/css/app-light") {
    		links[i].href = chrome.extension.getURL("resources/app-light.css"); // Inject custom style sheet (Light Theme)
    	}
    }
}

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

setTimeout(function() {
	document.getElementsByTagName("html")[0].class = document.getElementsByTagName("html")[0].class + " ryandolan123TweetDeckEnhancerExtensionChrome"; // I thought += worked in javascript? guess not. Either isn't not or I am really bad at this
}, 1000);