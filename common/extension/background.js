/*
	background.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

var browser = browser || chrome;

console.log("TEST");


browser.webRequest.onHeadersReceived.addListener(
	details => {
		if (details.type !== "main_frame" && details.type !== "sub_frame") {
			return;
		}

		for (i = 0; i < details.responseHeaders.length; i++) {
			if (typeof details.responseHeaders[i].name !== "undefined" && details.responseHeaders[i].name === "content-security-policy") {
				details.responseHeaders[i].value =
					"default-src 'self'; connect-src * moderndeck:; "+
					"font-src https: blob: data: * moderndeck:; "+
					"frame-src https: moderndeck:; "+
					"frame-ancestors 'self' https: moderndeck:; "+
					"img-src https: data: blob: moderndeck:; "+
					"media-src * moderndeck: blob: https:; "+
					"object-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://moderndeck.app moderndeck: https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com blob:; "+
					"style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck: blob:;";

					console.log(details)

				return {responseHeaders:details.responseHeaders};
			}
		}

		console.error("The browser did not report the proper headers to us :(")
	},
	{urls:["https://tweetdeck.twitter.com/*"]},
	["responseHeaders","blocking"] /* For some reason, Chrome still requires blocking for modifying headers. */
);
