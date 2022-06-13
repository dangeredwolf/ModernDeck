import { store } from "./store";

import { default as I18nData } from "./i18nMain";
import { SettingsKey } from "../Settings/SettingsKey";
let lang = store.get(SettingsKey.LANGUAGE);

export const I18n = function(key: string) {
	// @ts-expect-error TODO: fix this
	let foundStr = I18nData[key];
	if (!foundStr) {
		console.warn("Main process missing translation: " + key);
		return key;
	}
	return foundStr[lang] || key;
}