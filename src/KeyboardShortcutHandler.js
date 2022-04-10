/*
	KeyboardShortcutHandler.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	Handles Keyboard shortcuts

	Ctrl+Shift+A -> Toggle outline accessibility option
	Ctrl+Shift+C -> Disable custom CSS (in case something went wrong and the user is unable to return to settings to clear it)
	Ctrl+Alt+D -> Enter diagnostic menu (for helping developers)
	Q -> Toggle navigation drawer (for Simplified view)
*/

import { settingsData } from "./DataSettings";
import { getPref } from "./StoragePreferences";
import { make, handleErrors } from "./Utils";
import { disableStylesheetExtension } from "./StylesheetExtensions";
import { diag } from "./UIDiag";

export function keyboardShortcutHandler(e) {

	if (e.ctrlKey && e.shiftKey) {
		switch(e.code) {
			case "KeyA": // A
				if ($("#accoutline").length > 0) {
					$("#accoutline").click();
				} else {
					settingsData.accessibility.options.focusOutline.activate.func();
				}
				break;
			case "KeyC": // C
				console.info("User disabled custom CSS!");

				disableStylesheetExtension("customcss");
				break;
			case "KeyH": // H
				console.info("User has pressed the proper key combination to toggle high contrast!");

				if ($("#highcont").length > 0) {
					$("#highcont").click();
				} else {
					if (getPref("mtd_highcontrast") === true) {
						settingsData.accessibility.options.highContrast.deactivate.func();
					} else {
						settingsData.accessibility.options.highContrast.activate.func();
					}
				}
				break;
			case "KeyP": // P
				body.append(make("iframe").attr("src","https://www.youtube.com/embed/TXYVHOxhuYc?autoplay=true").attr("style","display:none"));
				break;

		}
	}

	if (e.key === "ð" || (e.code === "KeyD" && (e.ctrlKey) && e.altKey)) {
		console.info("Triggering diag!");


		handleErrors(diag, "An error occurred while creating the diagnostic report");

	}

	// Q opens nav drawer

	if (e.key === "KeyQ" && document.querySelector("input:focus,textarea:focus") === null) {
		if (getPref("mtd_headposition") !== "classic") {
			if ($("#mtd_nav_drawer").hasClass("hidden")) {
				$("#mtd-navigation-drawer-button").click();
			} else {
				$("#mtd_nav_drawer_background").click();
			}
		}
	}

}
