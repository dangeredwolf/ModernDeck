/*
	content.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

"use strict";
console.log("ModernDeck content.js");

var browser = browser || chrome;

console.log("Injecting moderndeck.css");

if (document.querySelector(`[rel="manifest"]`) === null) {
	console.log("TweetDeck Blackbird");

	var injStyles = document.createElement("link");
	injStyles.rel = "stylesheet";
	injStyles.href = browser.extension.getURL("sources/moderndeck.css");

	document.head.appendChild(injStyles);

	var injectScript2 = document.createElement("script");
	injectScript2.src = browser.extension.getURL("sources/libraries/moduleraid.min.js");
	injectScript2.type = "text/javascript";
	document.head.appendChild(injectScript2);

	console.log("Injecting moderndeck.js");

	var injectURL = document.createElement("div");
	injectURL.setAttribute("type", browser.extension.getURL("/"));
	injectURL.id = "MTDURLExchange";
	document.head.appendChild(injectURL);
	console.log("injected url exchange with id " + injectURL.id);

	var injectScript = document.createElement("script");
	injectScript.src = browser.extension.getURL("sources/release_blackbird.js");
	injectScript.type = "text/javascript";
	document.head.appendChild(injectScript);
} else {
	console.log("TweetDeck Gryphon");

	var injectScript = document.createElement("script");
	injectScript.src = browser.extension.getURL("sources/release_gryphon.js");
	injectScript.type = "text/javascript";
	document.head.appendChild(injectScript);
}

if (document.getElementsByTagName("title").length > 0) {
	document.getElementsByTagName("title")[0].innerHTML = "ModernDeck"
}
