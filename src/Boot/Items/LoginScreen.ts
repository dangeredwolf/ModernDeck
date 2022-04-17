/*
	Boot/Items/LoginScreen.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { checkIfSigninFormIsPresent, loginTextReplacer } from "../../UILoginController";

import { loginPage } from "../../DataMustaches";
import { I18n } from "../../I18n";
import { handleErrors } from "../../Utils";

let newLoginPage = loginPage;

// This code changes the text to respond to the time of day, naturally

let mtdStarted = new Date();

if (mtdStarted.getHours() < 12) { // 12:00 / 12:00pm
	newLoginPage = loginPage.replace("Good evening",I18n("Good morning"));
} else if (mtdStarted.getHours() < 18) { // 18:00 / 6:00pm
	newLoginPage = loginPage.replace("Good evening",I18n("Good afternoon"));
} else {
	newLoginPage = loginPage.replace("Good evening",I18n("Good evening"));
}

export const initLoginScreen = () => {
	checkIfSigninFormIsPresent();
	window.loginInterval = setInterval(checkIfSigninFormIsPresent, 500);

	// @ts-ignore
	window.loginTextReplacer = loginTextReplacer;

	handleErrors(loginTextReplacer, "Caught error in loginTextReplacer");
	setTimeout(()=>handleErrors(loginTextReplacer, "Caught error in loginTextReplacer"),200);
	setTimeout(()=>handleErrors(loginTextReplacer, "Caught error in loginTextReplacer"),500);


	// These check to see if critical TD variables are in place before proceeding

	TD.mustaches["login/login_form.mustache"] = newLoginPage;
}