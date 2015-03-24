// TDELoad.js
// Copyright (c) 2015 Dangered Wolf

console.log("TDELoad loaded");
console.log("Enhancer 5.0.5");

function ReplaceLoadingIndicator() {
  console.log("Waiting for TweetDeck so I can replace loading spinner (TDELoad)");

  if (typeof document.getElementsByClassName("app-signin-form")[0] !== "undefined") {
    return; // Can't do this with a sign in sheet there
  }

  if (typeof document.getElementsByClassName("js-startflow-content startflow")[0] === "undefined") {
    setTimeout(ReplaceLoadingIndicator,30);
    return;
  }
  console.log("Replacing Loading Spinner (TDELoad)");

  console.log((isChromium && chrome.extension.getURL("sources/spinner.mov")) || (isSafari && safari.extension.baseURI + "sources/spinner.mov"));

  document.getElementsByClassName("js-startflow-content startflow")[0].className += " tde-upgrading";
  document.getElementsByClassName("js-startflow-content startflow")[0].innerHTML = '<video class="spinner-centered spinner-fade-in" width="74" height="76" src="' + (isChromium && chrome.extension.getURL("sources/spinner.mov")) || (isSafari && safari.extension.baseURI + "sources/spinner.mov") + '" autoplay loop></video>';
}

function TDEURLExchange(url) {
  injurl = document.createElement("div");
  injurl.setAttribute("type",url);
  injurl.id = "TDEURLExchange";
  document.head.appendChild(injurl);
  console.log("injected url exchange with id " + injurl.id);
}

if (typeof chrome !== "undefined") {
  var isChromium = true;
  console.log("Chromium Detected");
} else {
  console.log("Not Chromium");
}

if (typeof safari !== "undefined") {
  var isSafari = true;
  console.log("Safari Detected: This is experimental!!");
} else {
  console.log("Not Safari");
}

var isWebKit = isSafari || isChromium;

if (!isWebKit) {
  console.log("Not WebKit");
  console.log("Gecko Detected: This is experimental!!");
  var isGecko = true;
} else {
  console.log("WebKit Detected");
  setTimeout(ReplaceLoadingIndicator,0);
}

var links = document.getElementsByTagName("link");

for (i = 0; i < links.length; i++) { 
    if (typeof links[i].href !== "undefined") {
    	if (links[i].href.substring(0,52) === "https://ton.twimg.com/tweetdeck-web/web/css/app-dark") {
      	links[i].href = (isChromium && chrome.extension.getURL("sources/app-dark.css")) || (isSafari && safari.extension.baseURI + "sources/app-dark.css") || "https://dangeredwolf.com/assets/tdetest/app-dark.css";
      }
      if (links[i].href.substring(0,53) === "https://ton.twimg.com/tweetdeck-web/web/css/app-light") {
        links[i].href = (isChromium && chrome.extension.getURL("sources/app-light.css")) || (isSafari && safari.extension.baseURI + "sources/app-light.css") || "https://dangeredwolf.com/assets/tdetest/app-light.css";
      }
    }
}

console.log("Bootstrapping TDEinject");
InjectScript = document.createElement("script");

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

/*

================================================ Note (Mainly to Opera extension reviewers) ================================================

TweetDeck Enhancer has cross-browser support, which is why you see references such as "isGecko" and "isSafari" in addition to "isChromium".

This is also why there are "chrome.manifest" / "install.rdf" files (Firefox) and "Info.plist" and "Settings.plist" (Safari). Enhancer is available for Chrome/Chromium, Opera, Safari, Firefox, Windows Desktop, and soon OS X desktop.

Keeping the files here makes Enhancer a lot easier to maintain and update for people using all platforms faster!

*/