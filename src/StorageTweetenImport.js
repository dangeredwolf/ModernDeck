/*
	StorageTweetenImport.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

import { getPref, setPref } from "./StoragePreferences.js";
import { exists } from "./Utils.js"

/*
	Processes Tweeten Settings import
	obj = object converted from the raw JSON
*/
export function importTweetenSettings(obj) {

	setPref("mtd_customcss",(!!obj.dev ? obj.dev.customCSS || "" : ""))

	if (exists(obj.dev)) {
		setPref("mtd_inspectElement",obj.dev.mode);
	}

	if (exists(obj.TDSettings)) {
		TD.settings.setAutoPlayGifs(obj.TDSettings.gifAutoplay);
		if (exists(obj.TDSettings.gifAutoplay)) {
			TD.settings.setAutoPlayGifs(obj.TDSettings.gifAutoplay);
		}
		if (exists(obj.TDSettings.sensitiveData)) {
			TD.settings.setDisplaySensitiveMedia(obj.TDSettings.sensitiveData);
		}
		if (exists(obj.TDSettings.tweetStream)) {
			TD.settings.setUseStream(obj.TDSettings.tweetStream);
		}
		if (exists(obj.TDSettings.linkShortener)) {
			TD.settings.setLinkShortener(obj.TDSettings.linkShortener ? "bitly" : "twitter");
			if (obj.TDSettings.linkShortener.toggle === true && !!obj.TDSettings.linkShortener.bitlyApiKey && !!obj.TDSettings.linkShortener.bitlyUsername) {
				TD.settings.setBitlyAccount({
					login:obj.TDSettings.linkShortener.bitlyUsername || TD.settings.getBitlyAccount().login,
					apiKey:obj.TDSettings.linkShortener.bitlyApiKey || TD.settings.getBitlyAccount().apiKey
				});
			}
		}
	}

	if (exists(obj.customTitlebar)) {
		setPref("mtd_nativetitlebar",!obj.customTitlebar);
	}

	if (exists(obj.customization)) {
		setPref("mtd_columnwidth",obj.customization.columnWidth || getPref("mtd_columnwidth"));

		if (obj.customization.completeBlack === true) {
			setPref("mtd_theme","amoled");
		}

		setPref("mtd_noemojipicker",exists(obj.customization.emojis) ? obj.customization.emojis : false);
		setPref("mtd_newcharindicator",exists(obj.customization.charCount) ? !obj.customization.charCount : true);
		TD.settings.setTheme(obj.customization.theme || TD.settings.getTheme());

		if (exists(obj.customization.thinSB)) {
			setPref("mtd_scrollbar_style", (obj.customization.thinSB ? "scrollbarsnarrow" : "scrollbarsdefault"));
		}

		setPref("mtd_round_avatars",exists(obj.customization.roundAvi) ? obj.customization.roundAvi : true);

		if (exists(obj.customization.font)) {
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
