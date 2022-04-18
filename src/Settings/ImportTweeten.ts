/*
	Settings/ImportTweeten.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref, setPref } from "../StoragePreferences";

enum TweetDeckTheme {
	light = "light",
	dark = "dark"
}

enum TweetenFontSize {
	smallest = "smallest",
	smaller = "smaller",
	small = "small",
	large = "large",
	largest = "largest",
}

export interface TweetenSettingsJSON {
	dev: {
		mode: boolean;
		customCSS: string;
	};

	customTitlebar: boolean;

	TDSettings: {
		gifAutoplay: boolean;
		sensitiveData: boolean;
		tweetStream: boolean;
		linkShortener: {
			toggle: boolean;
			bitlyApiKey: string;
			bitlyUsername: string;
		};
	};
	
	customization: {
		completeBlack: boolean;
		columnWidth: number;
		thinSB: boolean;
		roundAvi: boolean;
		font: TweetenFontSize;
		theme: TweetDeckTheme;
		emojis: boolean;
		charCount: boolean;
	}
}

/*
	Processes Tweeten Settings import
	obj = object converted from the raw JSON
*/
export function importTweetenSettings(obj: TweetenSettingsJSON) {

	setPref("mtd_customcss",(!!obj.dev ? obj.dev.customCSS || "" : ""))

	if (typeof obj.dev !== "undefined") {
		setPref("mtd_inspectElement",obj.dev.mode);
	}

	if (typeof obj.TDSettings !== "undefined") {
		TD.settings.setAutoPlayGifs(obj.TDSettings.gifAutoplay);
		if (typeof obj.TDSettings.gifAutoplay !== "undefined") {
			TD.settings.setAutoPlayGifs(obj.TDSettings.gifAutoplay);
		}
		if (typeof obj.TDSettings.sensitiveData !== "undefined") {
			TD.settings.setDisplaySensitiveMedia(obj.TDSettings.sensitiveData);
		}
		if (typeof obj.TDSettings.tweetStream !== "undefined") {
			TD.settings.setUseStream(obj.TDSettings.tweetStream);
		}
		if (typeof obj.TDSettings.linkShortener !== "undefined") {
			TD.settings.setLinkShortener(obj.TDSettings.linkShortener ? "bitly" : "twitter");
			if (obj.TDSettings.linkShortener.toggle === true && !!obj.TDSettings.linkShortener.bitlyApiKey && !!obj.TDSettings.linkShortener.bitlyUsername) {
				TD.settings.setBitlyAccount({
					login:obj.TDSettings.linkShortener.bitlyUsername || TD.settings.getBitlyAccount().login,
					apiKey:obj.TDSettings.linkShortener.bitlyApiKey || TD.settings.getBitlyAccount().apiKey
				});
			}
		}
	}

	if (typeof obj.customTitlebar !== "undefined") {
		setPref("mtd_nativetitlebar",!obj.customTitlebar);
	}

	if (typeof obj.customization !== "undefined") {
		setPref("mtd_columnwidth",obj.customization.columnWidth || getPref("mtd_columnwidth"));

		if (obj.customization.completeBlack === true) {
			setPref("mtd_theme","amoled");
		}

		setPref("mtd_noemojipicker",typeof obj.customization.emojis !== "undefined" ? obj.customization.emojis : false);
		setPref("mtd_newcharindicator",typeof obj.customization.charCount !== "undefined" ? !obj.customization.charCount : true);
		TD.settings.setTheme(obj.customization.theme || TD.settings.getTheme());

		if (typeof obj.customization.thinSB !== "undefined") {
			setPref("mtd_scrollbar_style", (obj.customization.thinSB ? "scrollbarsnarrow" : "scrollbarsdefault"));
		}

		setPref("mtd_round_avatars",typeof obj.customization.roundAvi !== "undefined" ? obj.customization.roundAvi : true);

		if (typeof obj.customization.font !== "undefined") {
			let percentage = 100;

			switch(obj.customization.font) {
				case "smallest":
					percentage = 90;
					break;
				case "smaller":
					percentage = 95;
					break;
				case "small":
					percentage = 100;
					break;
				case "large":
					percentage = 105;
					break;
				case "largest":
					percentage = 110;
					break;
			}

			setPref("mtd_fontsize",percentage);
		}
	}
}
