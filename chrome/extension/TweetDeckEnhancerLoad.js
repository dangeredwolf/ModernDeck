// TweetDeckEnhancerLoad.js
// Copyright (c) 2014 Ryan Dolan (ryandolan123)

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

function TDEwelcomeinit() {
  if (!ShouldDisplayTDEWelcomeScreen) {
    return;
  }
  var welcometde = '<div id="WelcomeToTweetDeckEnhancer" class="js-modal-panel mdl s-short is-inverted-dark js-modal-context js-click-trap overlay overlay-super scroll-v" style="/* position: absolute; */ top: 100px; left:36%; height: 500px;z-index: 500;">    <header style="top:0;bottom:0;margin-top:-78%" class="js-mdl-header mdl-header"> <h3 class="mdl-header-title js-header-title">TweetDeck Enhancer</h3> <a href="#" class="mdl-drag-handle js-drag-handle"><i class="sprite sprite-drag"></i></a>  </header> <div class="mdl-inner" id="TDEwelcomeinner"><h1 style="font-weight:100;font-size:24px;text-align:center;margin-top:15px">Thanks for downloading TweetDeck Enhancer</h1><h2 style="margin-top:35px;margin-left:15px;font-size:20px;font-weight:400">Let\'s get started:</h2><p style="margin-left:15px;font-size:16px"><br>If you aren\'t familiar with TweetDeck for web, TweetDeck will be available at tweetdeck.twitter.com. Here, TweetDeck Enhancer will immediately take effect.<img src="https://ryandolan123.com/assets/tweetdeck/img/where.png" height="95px"><br><br>Just log in with your TweetDeck or Twitter account if you need to, and you\'ll be good to go.<br><br><br><a id="TDEwelcomelink" href="#">Next, Using TweetDeck with TweetDeck Enhancer</a></p></div></div>';
  if (typeof document.getElementsByClassName("js-modal-container")[0] !== "undefined")
    document.getElementsByClassName("js-modal-container")[0].innerHTML = welcometde;
  if (typeof document.getElementsByClassName("js-modals-container")[0] !== "undefined")
    document.getElementsByClassName("js-modals-container")[0].innerHTML = welcometde;

  if (typeof document.getElementsByClassName("application")[0] !== "undefined") {
    document.getElementsByClassName("application")[0].remove();
  }
}

var ShouldDisplayTDEWelcomeScreen = false;

setTimeout(function() {
	document.getElementsByTagName("html")[0].class = document.getElementsByTagName("html")[0].class + " ryandolan123TweetDeckEnhancerExtensionChrome"; // I thought += worked in javascript? guess not. Either isn't not or I am really bad at this
  TDEwelcomeinit();
}, 1000);

setTimeout(function() {
  if (typeof WelcomeToTweetDeckEnhancer === "undefined") {
    TDEwelcomeinit();
  }
  if (typeof document.getElementsByClassName("application")[0] !== "undefined" && ShouldDisplayTDEWelcomeScreen) {
    document.getElementsByClassName("application")[0].remove();
  }
},2000);

setTimeout(function() {
  if (typeof WelcomeToTweetDeckEnhancer === "undefined") {
    TDEwelcomeinit();
  }
  if (typeof document.getElementsByClassName("application")[0] !== "undefined" && ShouldDisplayTDEWelcomeScreen) {
    document.getElementsByClassName("application")[0].remove();
  }
},3000);

setTimeout(function() {
  if (typeof WelcomeToTweetDeckEnhancer === "undefined") {
    TDEwelcomeinit();
  }
  if (typeof document.getElementsByClassName("application")[0] !== "undefined" && ShouldDisplayTDEWelcomeScreen) {
    document.getElementsByClassName("application")[0].remove();
  }
},4000);

setTimeout(function() {
  if (typeof WelcomeToTweetDeckEnhancer === "undefined") {
    TDEwelcomeinit();
  }
  if (typeof document.getElementsByClassName("application")[0] !== "undefined" && ShouldDisplayTDEWelcomeScreen) {
    document.getElementsByClassName("application")[0].remove();
  }
},5000);