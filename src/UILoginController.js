/*
	UILoginController.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import { enableStylesheetExtension, disableStylesheetExtension } from "./StylesheetExtensions.js";
import { I18n } from "./I18n.js";
import { UILanguagePicker } from "./UILanguagePicker.js";
import { openSettings } from "./UISettings.js";
import { getPref } from "./StoragePreferences.js";

let ugltStarted = false;
window.loginIntervalTick = 0;

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

	$(".startflow-background").attr("style",`background-image:url(${mtdBaseURL}resources/img/bg1.jpg)`)

	if (window.enterpriseConfig.customLoginImage) {
		if (window.enterpriseConfig.customLoginImage.match(/https:\/\//gm) !== null) {
			$(".startflow-background").attr("style",`background-image:url(${window.enterpriseConfig.customLoginImage})`)
		} else {
			$(".startflow-background").attr("style",`background-image:url(moderndeck://background)`)
		}
	}

	setInterval(() => {
		let text;
		let newDate = new Date();

		if (newDate.getHours() < 12) {
			text = I18n("Good morning!");
		} else if (newDate.getHours() < 18) {
			text = I18n("Good afternoon!");
		} else {
			text = I18n("Good evening!");
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
		html.addClass("signin-sheet-now-present");

		window.loginIntervalTick++;
		enableStylesheetExtension("loginpage");

		if (window.loginIntervalTick > 5) {
			clearInterval(loginInterval);
		}
	} else {
		// console.log("Not on signin sheet anymore");
		disableStylesheetExtension("loginpage");
		html.removeClass("signin-sheet-now-present");
	}

}
// replaces login page with moderndeck one

export function loginTextReplacer() {
	if ($(".app-signin-wrap:not(.mtd-signin-wrap)").length > 0) {
		console.info("oh no, we're too late!");
		window.UILanguagePicker = UILanguagePicker;

		if (getPref("mtd_last_lang") !== navigator.language) {
			new UILanguagePicker();
		}
		$(".app-signin-wrap:not(.mtd-signin-wrap)").remove();
		$(".login-container .startflow").html(newLoginPage);
		startUpdateGoodLoginText();

		$(".mtd-login-info-button").click(() => openSettings(undefined, true))
	}
}
