/*
	KeyboardShortcutHandler.ts

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

import { settingsData } from "./Settings/SettingsData";
import { getPref } from "./StoragePreferences";
import { make, handleErrors } from "./Utils";
import { disableStylesheetExtension } from "./StylesheetExtensions";
import { diag } from "./UIDiag";
import { SettingsKey } from "./Settings/SettingsKey";

export const keyboardShortcutHandler = (event: KeyboardEvent): void => {

	if (event.ctrlKey && event.shiftKey) {
		switch(event.code) {
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
					if (getPref(SettingsKey.HIGH_CONTRAST) === true) {
						settingsData.accessibility.options.highContrast.deactivate.func();
					} else {
						settingsData.accessibility.options.highContrast.activate.func();
					}
				}
				break;
			case "KeyP": // P
				window.body.append(make("iframe").attr("src","https://www.youtube-nocookie.com/embed/y9Ln-qyvX_I?autoplay=true").attr("style","display:none"));
				break;

		}
	}

	if (event.key === "ð" || (event.code === "KeyD" && (event.ctrlKey) && event.altKey) || (event.code === "KeyD" && (event.ctrlKey) && event.shiftKey)) {
		console.info("Triggering diag!");

		handleErrors(diag, "An error occurred while creating the diagnostic report");

	}

	// Q opens nav drawer

	if (event.key === "KeyQ" && document.querySelector("input:focus,textarea:focus") === null) {
		if (getPref(SettingsKey.NAVIGATION_STYLE) !== "classic") {
			if ($("#mtd_nav_drawer").hasClass("hidden")) {
				$("#mtd-navigation-drawer-button").click();
			} else {
				$("#mtd_nav_drawer_background").click();
			}
		}
	}

}
