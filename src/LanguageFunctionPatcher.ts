/*
	LanguageFunctionPatcher.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { SettingsKey } from "./Settings/SettingsKey";
import { getPref } from "./StoragePreferences";

export const LanguageFunctionPatcher = (): void => {
	if (typeof TD !== "undefined" && typeof TD.languages !== "undefined") {
		TD.languages.getSystemLanguageCode = (e): string => {
            var t = getPref(SettingsKey.LANGUAGE, "en_US").replace("_","-").substr(0,2);
            return e && (t = t.replace(/-[a-z]+$/i, "")),
            t
        }
	} else {
		setTimeout(LanguageFunctionPatcher, 10);
	}
}
