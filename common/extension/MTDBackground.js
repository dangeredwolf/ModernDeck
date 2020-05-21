/*
	MTDBackground.js
	Copyright (c) 2014-2020 dangered wolf, et al

	Released under the MIT licence
*/

var browser = browser || chrome;

if (browser !== "undefined") {

	browser.webRequest.onHeadersReceived.addListener((details) => {
		if (details.type !== "main_frame" && details.type !== "sub_frame") {
			return;
		}

		for (i = 0; i < details.responseHeaders.length; i++) {
			if (typeof details.responseHeaders[i].name !== "undefined" && details.responseHeaders[i].name === "content-security-policy") {
				details.responseHeaders[i].value = "default-src 'self'; connect-src * https://api.moderndeck.org; font-src https: data: blob: *; frame-src https:; frame-ancestors 'self' https:; img-src https: data: blob:; media-src *; object-src 'self' https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://c6.patreon.com https://moderndeck.org https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' https:;";
				return {responseHeaders:details.responseHeaders};
			}
		}

	}, {urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]});
}
