/*
	I18n.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

"use strict";

let displayWarning = false;
let tweetDeckTranslateInitial: Function;
let debugI18n = false;

// ModernDeck specific import, dummy function in tweetdeck-i18n
import { getPref } from "./StoragePreferences";
// Import the language data (common to tweetdeck-i18n and ModernDeck)
import _languageData from "./DataI18n";
import { SettingsKey } from "./Settings/SettingsKey";
let languageData = _languageData as any;

let langFull: string;
let langRoot: string;

langFull = getPref(SettingsKey.LANGUAGE);
if (!langFull) {
	langFull = navigator.language.replace("-","_");

	// Some generic languages only have local versions in ModernDeck so we use these as fallbacks
	switch(langFull) {
		case "en":
			langFull = "en_US";
			break;
		case "es":
			langFull = "es_ES";
			break;
		case "zh":
			langFull = "zh_CN";
			break;
		case "fr":
			langFull = "fr_FR";
			break;
	}
}
langRoot = langFull.substring(0,2);

export const getFullLanguage = () => langFull;
export const getMainLanguage = () => langRoot;
export const getFallbackLanguage = () => {
	switch(langRoot) {
		case "zh":
			return "zh_CN";
		case "fr":
			return "fr";
		case "pt":
			return "pt_BR";
		default:
			return "en_US";
	}
};

const mustachePatches: { [key: string]: { [value: string]: 1 } } = {
	"keyboard_shortcut_list.mustache": {
		"Open Navigation Drawer/Menu":1,
		"Command palette — <b>NEW!</b>":1,
		"Cmd &#8984;":1,
		"Like":1,
		"Add Column":1,
		"Actions":1,
		"Reply":1,
		"Retweet":1,
		"New Tweet":1,
		"Direct Message":1,
		"View user profile":1,
		"View Tweet details":1,
		"Close Tweet details":1,
		"Send Tweet":1,
		"Enter":1,
		"Backspace":1,
		"Ctrl":1,
		"Add column":1,
		"This menu":1,
		"Right":1,
		"Left":1,
		"Down":1,
		"Up":1,
		"Navigation":1,
		"Column 1－9":1,
		"Final column":1,
		"Expand/Collapse navigation":1,
		"Search":1,
		"Return":1
	},
	"twitter_profile_social_proof.mustache": {
		"and":1
	},
	"status/tweet_detail.mustache": {
		"Reply to":1
	},
	"menus/quality_filter_info.mustache": {
		"Quality filter {{qualityFilterText}}":1
	},
	"lists/edit_list_details.mustache": {
		"Under 100 characters, optional":1
	},
	"customtimeline/edit_customtimeline.mustache": {
		"Under 160 characters, optional":1
	},
	"menus/dm_conversations_menu.mustache": {
		"Delete conversation":1
	}
}

export const I18n = (translateString: string, mustacheSubstitutions?: {[str: string]: string}, c?: string, d?: string, e?: string, f?: number): string => {

	if (!translateString) {
		// console.warn("The I18n function was supposed to receive data but didn't. Here's some other information, if they aren't undefined: ", a, b, c, d, e);
		return "";
	}

	translateString = String(translateString);

	if (debugI18n) {
		console.log(translateString, mustacheSubstitutions, c, d, e, f)
	}

	if ((translateString.includes("{{{") || translateString.includes("{{")) && !f){
		let hmm = I18n(translateString, mustacheSubstitutions, c, d, e, 1);
		let no = I18n(hmm, mustacheSubstitutions, c, d, e, 2);
		return no;
	}

	// if (a.includes("{{{") && f === 2) {
	// 	for (const key in b) {
	// 		const replaceMe = b[key][getFullLanguage()] || b[key][getMainLanguage()] || b[key][getFallbackLanguage()];
	//
	// 		a = a.replace(/\{\{\{"+key+"\}\}\}/g,"\{\{\{"+replaceMe+"\}\}\}");
	// 	}
	// 	return a;
	// }

	if (translateString.includes("{{") && f === 2) {
		return tweetDeckTranslateInitial(translateString, mustacheSubstitutions, c, d, e);
	}

	if (translateString.substr(0,6) === "From @") { // 2020-05-04: I don't remember if this edge case is still necessary
		return I18n(translateString.substr(0,4)) + " @" + translateString.substr(6);
	}

	if (!mustacheSubstitutions || f === 1) {
		if (languageData[translateString]) {
			let result = languageData[translateString][getFullLanguage()]||languageData[translateString][getMainLanguage()]||languageData[translateString][getFallbackLanguage()];
			if (typeof result === "undefined") {
				console.error("Can't find English US translation of this string? " + translateString);
				return translateString;
			}
			if (result.indexOf("hours12") > -1 || result.indexOf("hours24") > -1) {
				if (I18n.customTimeHandler) {
					return I18n.customTimeHandler(result);
				}
			}
			return result;
		} else {
			console.warn("Missing string translation: " + translateString);
			return (displayWarning ? "⚠" : "") + translateString;
		}
	} else {
		for (const key in mustacheSubstitutions) {
			translateString = translateString.replace("{{" + key + "}}", mustacheSubstitutions[key]);
		}
		return translateString;
	}

}

const patchColumnTitle = () => {
	if (window.TD && window.mR) {
		var columnData = window.mR.findConstructor("getColumnTitleArgs")[0][1].columnMetaTypeToTitleTemplateData;
		for (var key in columnData) {
			columnData[key].title = I18n(columnData[key].title);
		}
	} else {
		console.log("Waiting for mR to be ready...");
		setTimeout(patchColumnTitle,10);
		return;
	}
}

const patchButtonText = () => {
	if (window.TD && window.mR) {
		let buttonData = window.mR.findModule("tooltipText");

		for (let i = 0; i < buttonData.length; i++) {
			if (buttonData[i]) {
				if (buttonData[i].buttonText) {
					for (const key in buttonData[i].buttonText) {
						buttonData[i].buttonText[key] = I18n(buttonData[i].buttonText[key]);
					}
				}
				if (buttonData[i].tooltipText) {
					for (const key in buttonData[i].tooltipText) {
						buttonData[i].tooltipText[key] = I18n(buttonData[i].tooltipText[key]);
					}
				}
			}
		}
	} else {
		console.log("Waiting for mR to be ready...");
		setTimeout(patchButtonText, 10);
		return;
	}
}

const patchColumnTitleAddColumn = () => {
	if (window.TD && TD.controller && TD.controller.columnManager && TD.controller.columnManager.DISPLAY_ORDER) {
		let columnData = TD.controller.columnManager.DISPLAY_ORDER;

		for (const key in columnData) {
			columnData[key].title = I18n(columnData[key].title);
			if (columnData[key].attribution) {
				columnData[key].attribution = I18n(columnData[key].attribution);
			}
		}
	} else {
		console.log("Waiting for DISPLAY_ORDER and etc to be ready...");
		setTimeout(patchColumnTitleAddColumn,10);
		return;
	}
}

const patchMustaches = () => {
	if (window.TD_mustaches) {
		for (const key in mustachePatches) {
			if (window.TD_mustaches[key]) {
				for (const key2 in mustachePatches[key]) {
					try {
						window.TD_mustaches[key] = window.TD_mustaches[key].replace(new RegExp(key2, "g"), I18n(key2))
					} catch(e) {
						console.error("An error occurred while replacing mustache " + key2 + " in " + key);
						console.error(e);
					}
				}
			} else {
				console.warn("Mustache "+key+" was specified but was not found");
			}
		}
	} else {
		console.log("Waiting on TD_mustaches...");
		setTimeout(patchMustaches,10);
		return;
	}
}

const patchMiscStrings = () => {
	if (TD && TD.constants && TD.constants.TDApi) {
		for (const key2 in TD.constants.TDApi) {
			TD.constants.TDApi[key2] = I18n(key2);
		}
	} else {
		console.log("Waiting on TDApi...");
		setTimeout(patchMiscStrings,10);
		return;
	}
	if (TD && TD.controller && TD.controller.columnManager) {
		if (TD.controller.columnManager.DISPLAY_ORDER_PROFILE) {
			for (const key2 in TD.controller.columnManager.DISPLAY_ORDER_PROFILE) {
				let prof = TD.controller.columnManager.DISPLAY_ORDER_PROFILE[key2];
				prof.title = I18n(prof.title);
			}
		}
		if (TD.controller.columnManager.MENU_TITLE) {
			for (const key2 in TD.controller.columnManager.MENU_TITLE) {
				TD.controller.columnManager.MENU_TITLE[key2] = I18n(TD.controller.columnManager.MENU_TITLE[key2]);
			}
		}
		if (TD.controller.columnManager.MENU_ATTRIBUTION) {
			for (const key2 in TD.controller.columnManager.MENU_ATTRIBUTION) {
				TD.controller.columnManager.MENU_ATTRIBUTION[key2] = I18n(TD.controller.columnManager.MENU_ATTRIBUTION[key2]);
			}
		}
		if (TD.controller.columnManager.MODAL_TITLE) {
			for (const key2 in TD.controller.columnManager.MODAL_TITLE) {
				TD.controller.columnManager.MODAL_TITLE[key2] =
				I18n(TD.controller.columnManager.MODAL_TITLE[key2]);
			}
		}
		// let apiErrors = mR.findConstructor("This user has been")[0][1];
		// if (apiErrors[0]) {
		// 	for (const key2 in apiErrors[0]) {
		// 		console.log(key2);
		// 		apiErrors[0][key2] =
		// 		I18n(apiErrors[0][key2]);
		// 	}
		// }
		// if (apiErrors[1]) {
		// 	for (const key2 in apiErrors[1]) {
		// 		console.log(key2);
		// 		apiErrors[1][key2] =
		// 		I18n(apiErrors[1][key2]);
		// 	}
		// }
	} else {
		console.log("Waiting on TDApi...");
		setTimeout(patchMiscStrings,10);
		return;
	}
}

const patchTDFunctions = () => {
	if (typeof window.mR !== "undefined" && window.mR.findConstructor && window.mR.findConstructor("en-x-psaccent")[0] && window.mR.findConstructor("en-x-psaccent")[0][1]) {
		tweetDeckTranslateInitial = window.mR.findConstructor("en-x-psaccent")[0][1].default;
		// @ts-ignore Seems to work? TODO: Check if this is still necessary
		window.mR.findConstructor("en-x-psaccent")[0][1].default = I18n;

		const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		let newMonths: string[] = [];
		months.forEach(month => newMonths.push(I18n(month)));

		const shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		let newShortMonths: string[] = [];
		shortMonths.forEach(month => newShortMonths.push(I18n(month)));

		const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		let newDays: string[] = [];
		days.forEach(day => newDays.push(I18n(day)));

		const shortDays = [
			"ABBREV_SUNDAY",
			"ABBREV_MONDAY",
			"ABBREV_TUESDAY",
			"ABBREV_WEDNESDAY",
			"ABBREV_THURSDAY",
			"ABBREV_FRIDAY",
			"ABBREV_SATURDAY"
		];

		const englishShortDays = ["S","M","T","W","T","F","S"];

		let newShortDays: string[] = [];
		shortDays.forEach((day, i) => {
			let translatedDay = I18n(day);
			if (translatedDay.match("ABBREV") !== null) {
				translatedDay = englishShortDays[i];
			}
			 newShortDays.push(translatedDay);
		});

		window.mR.findConstructor("jQuery")[0][1].tools.dateinput.localize("en",{
			months: newMonths.join(","),
			shortMonths: newShortMonths.join(","),
			days: newDays.join(","),
			shortDays: newShortDays.join(",")
		});
		let firstDay = parseInt(I18n("CALENDAR_FIRST_DAY_NUMBER"));

		if (isNaN(firstDay)) {
			firstDay = 0;
		}

		window.mR.findConstructor("jQuery")[0][1].tools.dateinput.conf.firstDay = firstDay;
	} else {
		setTimeout(patchTDFunctions,10);
	}
}

export const startI18nEngine = () => {
	if (window.TweetDecki18nStarted) {
		return;
	}

	window.TweetDecki18nStarted = true;
	// Developer helper function to find strings within the mustache cluster
	window.findMustaches = (str: string) => {
		let results: { [key: string]: string } = {
			
		};
		for (let mustache in window.TD_mustaches) {
			if (window.TD_mustaches[mustache].match(str)) {
				results[mustache] = window.TD_mustaches[mustache];
			}
		}
		return results;
	}

	patchTDFunctions();
	patchMiscStrings();
	patchColumnTitle();
	patchButtonText();
	patchColumnTitleAddColumn();
	patchMustaches();
}

I18n.customTimeHandler = function(timeString: string) {
	if (window.mtdTimeHandler === "h12") {
		return timeString.replace(/\{\{hours24\}\}\:\{\{minutes\}\}/g,"{{hours12}}:{{minutes}} {{amPm}}")
	} else if (window.mtdTimeHandler === "h24") {
		return timeString.replace(/\{\{hours12\}\}\:\{\{minutes\}\} ?\{\{amPm\}\}/g,"{{hours24}}:{{minutes}}")
	} else {
		return timeString;
	}
}

I18n.getFullLanguage = getFullLanguage;
I18n.getMainLanguage = getMainLanguage;

window.I18n = I18n;

startI18nEngine();
