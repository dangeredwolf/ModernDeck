/*
	content.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

"use strict";

var browser = browser || chrome;

function setCookies() {
	// TweetDeck Preview is loading, so we need to revert it to legacy
	document.cookie = "tweetdeck_version=; domain=.twitter.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	document.cookie = "tweetdeck_version=; domain=tweetdeck.twitter.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
	document.cookie = "tweetdeck_version=legacy; domain=.twitter.com; path=/; expires=Thu, 01 Jan 2099 00:00:00 GMT";
	document.cookie = "tweetdeck_version=legacy; domain=tweetdeck.twitter.com; path=/; expires=Thu, 01 Jan 2099 00:00:00 GMT";
}

if (document.querySelector(`[rel="manifest"]`) === null) {

	setCookies();

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

	const injectScript = document.createElement("script");

	const baseUrl = document.createElement("meta");
	baseUrl.setAttribute("name", "moderndeck-base-url");
	baseUrl.setAttribute("content", browser.runtime.getURL("/"));
	document.head.appendChild(baseUrl);

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
} else {
	setCookies();
	location.reload();
}