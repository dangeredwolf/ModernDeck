/*
	Boot/Items/PrettyNumber.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// This makes numbers appear nicer by overriding tweetdeck's original function which did basically nothing

import { formatNumberI18n } from "../../Utils";

import { I18n } from "../../I18n";

export const replacePrettyNumber = () => {

	TD.util.prettyNumber = (numberStr: string) => {
		let howPretty: number = parseInt(numberStr, 10);

		if (!window.mtdAbbrevNumbers) {
			return formatNumberI18n(howPretty);
		}

		if (howPretty >= 100000000) {
			return formatNumberI18n((howPretty/1000000)) + I18n("M");
		} else if (howPretty >= 10000000) {
			return formatNumberI18n((howPretty/100000)/10) + I18n("M");
		} else if (howPretty >= 1000000) {
			return formatNumberI18n((howPretty/10000)/100) + I18n("M");
		} else if (howPretty >= 100000) {
			return formatNumberI18n((howPretty/1000)) + I18n("K");
		} else if (howPretty >= 10000) {
			return formatNumberI18n((howPretty/100)/10) + I18n("K");
		}
		return formatNumberI18n(howPretty);
	}
}