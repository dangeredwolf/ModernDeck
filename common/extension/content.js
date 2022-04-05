/*
	content.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

"use strict";
console.log("ModernDeck content.js");

var browser = browser || chrome;

console.log("Injecting moderndeck.css");

if (document.querySelector(`[rel="manifest"]`) === null) {

	document.querySelector("link[rel=\"stylesheet\"]").remove();

	var injStyles = document.createElement("link");
	injStyles.rel = "stylesheet";
	injStyles.href = browser.runtime.getURL("resources/moderndeck.css");

	document.head.appendChild(injStyles);

	// Gross hack for 9.4 because modenrdeck.css is not being loaded

	var injStyles2 = document.createElement("link");
	injStyles2.rel = "stylesheet";
	injStyles2.href = browser.runtime.getURL("resources/moderndeck.css");

	document.head.appendChild(injStyles2);

	var injectScript2 = document.createElement("script");
	injectScript2.src = browser.runtime.getURL("resources/libraries/moduleraid.min.js");
	injectScript2.type = "text/javascript";
	document.head.appendChild(injectScript2);

	console.log("Injecting moderndeck.js");

	var injectScript = document.createElement("script");

	var injectURL = document.createElement("div");
	injectURL.setAttribute("type", browser.runtime.getURL("/"));
	injectURL.id = "MTDURLExchange";
	document.head.appendChild(injectURL);
	console.log("injected url exchange with id " + injectURL.id);

	injectScript.src = browser.runtime.getURL("resources/moderndeck.js");

	document.getElementsByClassName("js-signin-ui block")[0].innerHTML =
	`<img class="mtd-loading-logo" src="${browser.runtime.getURL("/resources/img/moderndeck.svg")}" style="display: none;">
	<div class="preloader-wrapper active">
		<div class="spinner-layer">
			<div class="circle-clipper left">
				<div class="circle"></div>
			</div>
			<div class="gap-patch">
				<div class="circle"></div>
			</div>
			<div class="circle-clipper right">
				<div class="circle"></div>
			</div>
		</div>
	</div>`

	if (typeof mtdLoadStyleCSS === "undefined") {
		var mtdLoadStyleCSS = `
			img.spinner-centered {
				display:none!important
			}
		`
		var mtdLoadStyle = document.createElement("style");
		mtdLoadStyle.appendChild(document.createTextNode(mtdLoadStyleCSS))
		document.head.appendChild(mtdLoadStyle);
	}

	if (document.getElementsByClassName("spinner-centered")[0]) {
		document.getElementsByClassName("spinner-centered")[0].remove();
	}

	document.getElementsByTagName("html")[0].style = "background: #111;";
	document.getElementsByTagName("body")[0].style = "background: #111;";

	injectScript.type = "text/javascript";
	document.head.appendChild(injectScript);

	if (document.getElementsByTagName("title").length > 0) {
		document.getElementsByTagName("title")[0].innerHTML = "ModernDeck"
	}
}