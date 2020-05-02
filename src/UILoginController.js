

import { enableStylesheetExtension, disableStylesheetExtension } from "./StylesheetExtensions.js";

let ugltStarted = false;

let loginIntervalTick = 0;

// Updates the "Good morning!" / "Good afternoon!" / "Good evening!"
// text on the login screen every once in a while (10s, ish)

function startUpdateGoodLoginText() {

	// Don't run if we already started
	if (ugltStarted) {
		return;
	}

	ugltStarted = true;


	// we've gotta update the image URL
	// we can't do this in the new login mustache because when it's initialised,
	// MTDURLExchange hasn't completed yet

	$(".startflow-background").attr("style",`background-image:url(${mtdBaseURL}sources/img/bg1.jpg)`)

	setInterval(() => {
		let text;
		let newDate = new Date();

		if (newDate.getHours() < 12) {
			text = "Good morning!";
		} else if (newDate.getHours() < 18) {
			text = "Good afternoon!";
		} else {
			text = "Good evening!";
		}

		$(".form-login h2").html(text);
	},10000);
}

/*
	Checks if the signin form is available.

	If so, it activates the login page stylesheet extension
*/

export function checkIfSigninFormIsPresent() {

	if ($(".app-signin-form").length > 0 || $("body>.js-app-loading.login-container:not([style])").length > 0) {
		if (!html.hasClass("signin-sheet-now-present")) {
			html.addClass("signin-sheet-now-present");
		}

		loginIntervalTick++;
		enableStylesheetExtension("loginpage");

		if (loginIntervalTick > 5) {
			clearInterval(loginInterval);
		}
	} else {
		disableStylesheetExtension("loginpage");
		html.removeClass("signin-sheet-now-present");
	}

}
// replaces login page with moderndeck one

export function loginTextReplacer() {
	if ($(".app-signin-wrap:not(.mtd-signin-wrap)").length > 0) {
		console.info("oh no, we're too late!");
		$(".app-signin-wrap:not(.mtd-signin-wrap)").remove();
		$(".login-container .startflow").html(newLoginPage);
		startUpdateGoodLoginText();
	}
}
