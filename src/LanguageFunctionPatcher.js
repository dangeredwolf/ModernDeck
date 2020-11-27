/*
	LanguageFunctionPatcher.js

	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT License
*/

export function LanguageFunctionPatcher() {
	if (window.TD && window.TD.languages) {
		window.TD.languages.getSystemLanguageCode = function(e) {
            var t = getPref("mtd_lang").replace("_","-").substr(0,2);
            return e && (t = t.replace(/-[a-z]+$/i, "")),
            t
        }
	} else {
		setTimeout(LanguageFunctionPatcher, 10);
	}
}
