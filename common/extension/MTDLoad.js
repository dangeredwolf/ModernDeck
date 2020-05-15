/*
	MTDLoad.js
	Copyright (c) 2014-2020 dangered wolf, et al

	Released under the MIT licence
*/

"use strict";
console.log("MTDLoad 8.0");

var isDev = true;
var storage = {};

var browser = browser || chrome;

console.log("bootstrapping moderndeck.css for extensibility");

var injStyles = document.createElement("link");
injStyles.rel = "stylesheet";
injStyles.href = browser.extension.getURL("sources/moderndeck.css");

document.head.appendChild(injStyles);

console.log("Bootstrapping Sentry");

var injectScript2 = document.createElement("script");
injectScript2.src = browser.extension.getURL("sources/libraries/moduleraid.min.js");
injectScript2.type = "text/javascript";
document.head.appendChild(injectScript2);

console.log("Bootstrapping MTDinject");

var injectScript = document.createElement("script");

function MTDURLExchange(url) {
	var injectURL = document.createElement("div");
	injectURL.setAttribute("type",url);
	injectURL.id = "MTDURLExchange";
	document.head.appendChild(injectURL);
	console.log("injected url exchange with id " + injectURL.id);
}

MTDURLExchange(browser.extension.getURL(""));
injectScript.src = browser.extension.getURL("sources/moderndeck.js");

injectScript.type = "text/javascript";
document.head.appendChild(injectScript);

browser.runtime.sendMessage("getStorage");

browser.runtime.onMessage.addListener((m) => {
	if (m.name === "sendStorage") {
		storage = m.storage;
	}
});

if (document.getElementsByTagName("title").length > 0) {
	document.getElementsByTagName("title")[0].innerHTML = "ModernDeck"
}

window.addEventListener("message", (event) => {
	if (event.source === window && event.data.type) {
		if (event.data.type === "setStorage") {
			browser.runtime.sendMessage({"name": "setStorage", "content": event.data.message});
		}
		else if (event.data.type === "getStorage") {
			window.postMessage({
				type: "sendStorage",
				message: storage
			}, "*");
		}
	}
});
