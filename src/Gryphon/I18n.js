/*
	TweetDeck i18n v2
	Copyright (c) 2018-2021 dangered wolf, et al.
	Released under the MIT license
*/

"use strict";

let displayWarning = false;
let debugI18n = false;

// Import the language data (common to tweetdeck-i18n and ModernDeck)
import languageData from "./DataI18n.js";

let langFull;
let langRoot;

console.log("I18n: Detected TweetDeck i18n");
langFull = navigator.language.replace("-","_");
langRoot = navigator.language.substring(0,2);

export const getFullLanguage = () => langFull;
export const getMainLanguage = () => langRoot;
export const getFallbackLanguage = () => "en_US";


const mustachePatches = {
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

export const I18n = function(a, b, c, d, e, f) {

	if (!a) {
		// console.warn("The I18n function was supposed to receive data but didn't. Here's some other information, if they aren't undefined: ", a, b, c, d, e);
		return "";
	}

	a = String(a);

	if (debugI18n) {
		console.log(a, b, c, d, e, f)
	}

	if ((a.includes("{{{") || a.includes("{{")) && !f){
		let hmm = I18n(a, b, c, d, e, 1);
		let no = I18n(hmm, b, c, d, e, 2);
		return no;
	}

	if (a.substr(0,6) === "From @") { // 2020-05-04: I don't remember if this edge case is still necessary
		return I18n(a.substr(0,4)) + " @" + a.substr(6);
	}

	if (!b || f === 1) {
		if (languageData[a]) {
			let result = languageData[a][getFullLanguage()]||languageData[a][getMainLanguage()]||languageData[a][getFallbackLanguage()];
			if (typeof result === "undefined") {
				console.error("Can't find English US translation of this string? " + a);
				return a;
			}
			if (result.indexOf("hours12") > -1 || result.indexOf("hours24") > -1) {
				if (I18n.customTimeHandler) {
					return I18n.customTimeHandler(result);
				}
			}
			return result;
		} else {
			console.warn("Missing string translation: " + a);
			return (displayWarning ? "⚠" : "") + a;
		}
	} else {
		for (const key in b) {
			a = a.replace("{{" + key + "}}", b[key]);
		}
		return a;
	}

}

window.I18n = I18n;
window.I18n.getFullLanguage = getFullLanguage;
window.I18n.getMainLanguage = getMainLanguage;
