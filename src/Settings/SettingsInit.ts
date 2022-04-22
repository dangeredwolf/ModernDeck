/*
	Settings/SettingsInit.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { settingsData } from "./SettingsData";
import { SettingsMigration } from "./SettingsMigration";
import { disableStylesheetExtension, enableStylesheetExtension } from "../StylesheetExtensions";
import { getPref, setPref, hasPref, debugStorageSys } from "../StoragePreferences";
import { SettingsTab } from "./SettingsData";

/*
	function loadPreferences()

	Loads preferences from storage and activates them
*/

export const loadPreferences = (): void => {
	window.settingsData = settingsData;
	window.ModernDeck.settingsData = settingsData;

	SettingsMigration.migrate();

	Object.keys(settingsData).map((key: SettingsTab): void => {

		if (!settingsData[key].enum) {
			for (let i in settingsData[key].options) {
				let prefKey = settingsData[key].options[i].settingsKey;
				let pref = settingsData[key].options[i];

				if (typeof(prefKey) !== "undefined") {
					let setting;
					if (!hasPref(prefKey)) {
						if (debugStorageSys)
							console.log(`loadPreferences is setting default of ${prefKey} to ${pref.default}`);
						if (typeof pref.default === "function") {
							let def = pref.default();
							setPref(prefKey, def);
							setting = def;
						} else {
							setPref(prefKey, pref.default);
							setting = pref.default;
						}

					} else {
						setting = getPref(prefKey);
					}

					if (typeof window.desktopConfig !== "undefined" && typeof window.desktopConfig[key] !== "undefined" && typeof window.desktopConfig[key][i] !== "undefined") {
						console.log(window.desktopConfig[key]);
						console.log(window.desktopConfig[key][i]);
						setting = window.desktopConfig[key][i];
					}

					switch(pref.type) {
						case "checkbox":
							if (setting === true) {
								console.log("activate " + prefKey);
								parseActions(pref.activate, undefined, true);
							} else {
								console.log("deactivate " + prefKey);
								parseActions(pref.deactivate, undefined, true);
							}
							break;
						case "dropdown":
						case "textbox":
						case "textarea":
						case "array":
						case "slider":
							parseActions(pref.activate, setting, true);
							break;
						/* button/link controls we can skip, they don't do anything other than in the settings menu */
						case "button":
						case "link":
							break;
					}
				}
			}
		}
	});
}

interface SettingsActions {
	enableStylesheet?: string;
	disableStylesheet?: string;
	htmlAddClass?: string;
	htmlRemoveClass?: string;
	func?: Function;
}

/*
	This is used by the preference management system to activate preferences

	This allows for many simple preferences to be done completely in object notation with no extra JS
*/

export const parseActions = (actions: SettingsActions, option: any, firstLoad?: boolean): void => {
	for (let key in actions) {
		switch(key) {
			case "enableStylesheet":
				enableStylesheetExtension(actions[key]);
				break;
			case "disableStylesheet":
				disableStylesheetExtension(actions[key]);
				break;
			case "htmlAddClass":
				if (!window.html.hasClass(actions[key]))
				window.html.addClass(actions[key]);
				break;
			case "htmlRemoveClass":
				window.html.removeClass(actions[key]);
				break;
			case "func":
				if (typeof actions[key] === "function") {
					try {
						actions[key](option, firstLoad);
					} catch (e) {
						console.error("Error occurred processing action function.");
						console.error(e);
						window.lastError = e;
						console.error("Dump of naughty function attached below");
						console.log(actions[key])
					}
				} else {
					throw "There's a func action, but it isn't a function? :thinking:";
				}
				break;
		}
	}
}
