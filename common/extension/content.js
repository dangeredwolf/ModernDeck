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

	const injStyles = document.createElement("link");
	injStyles.rel = "stylesheet";
	injStyles.href = browser.runtime.getURL("assets/css/moderndeck.css");

	document.head.appendChild(injStyles);

	// Gross hack for 9.4 because modenrdeck.css is not being loaded

	const injStyles2 = document.createElement("link");
	injStyles2.rel = "stylesheet";
	injStyles2.href = browser.runtime.getURL("assets/css/moderndeck.css");

	document.head.appendChild(injStyles2);

	const injectScript2 = document.createElement("script");
	injectScript2.src = browser.runtime.getURL("assets/libraries/moduleraid.min.js");
	injectScript2.type = "text/javascript";
	document.head.appendChild(injectScript2);

	console.log("Injecting moderndeck.js");

	const injectScript = document.createElement("script");

	const baseUrl = document.createElement("meta");
	baseUrl.setAttribute("name", "moderndeck-base-url");
	baseUrl.setAttribute("content", browser.runtime.getURL("/"));
	document.head.appendChild(baseUrl);
	console.log(`Injected baseUrl ${baseUrl.getAttribute("content")}`);

	injectScript.src = browser.runtime.getURL("assets/js/moderndeck.js");

	document.getElementsByClassName("js-signin-ui block")[0].innerHTML =
	`<img class="mtd-loading-logo" src="${browser.runtime.getURL("/assets/img/moderndeck.svg")}" style="display: none;">
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
		const mtdLoadStyleCSS = `
			img.spinner-centered {
				display:none!important
			}
		`
		const mtdLoadStyle = document.createElement("style");
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