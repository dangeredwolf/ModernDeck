/*
	EnterpriseConfigParser.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT license
*/

import { setPref } from "./StoragePreferences.js";
import { settingsData } from "./DataSettings.js"

export function parseConfig(config) {
	console.log("Parsing enterprise config...");
	for (let option in config) {
		console.log(option);
		let value = config[option];

		if (option === "disableDevTools" && value === true) {
			setPref("mtd_inspectElement", false);
		}

		if (typeof option === "object") {
			for (let val in value) {
				console.log(val, val[option]);
				console.log(settingsData[option]);
				console.log(settingsData[option][val]);
				// setPref(val, val[option]);
			}
		}
	}
}
