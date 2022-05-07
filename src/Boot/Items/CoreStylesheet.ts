/*
	Boot/Items/CoreStylesheet.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref, setPref } from "../../StoragePreferences";

export const initCoreStylesheet = () => {
	/*
		In ModernDeck 8.0+ for extensions, we need to remove the TweetDeck
		stylesheet as it is no longer blocked with webRequest 
	*/

	let beGone = document.querySelector("link[rel='apple-touch-icon']+link[rel='stylesheet']");

	if (getPref("mtd_safemode")) {
		window.useSafeMode = true;
		window.html.addClass("mtd-disable-css");
		setPref("mtd_safemode",false)
	}

	if (typeof beGone !== "undefined" && !window.html.hasClass("mtd-disable-css")) {
		beGone.remove();
	}
}