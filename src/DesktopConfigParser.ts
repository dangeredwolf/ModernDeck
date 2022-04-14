/*
	DesktopConfigParser.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { setPref } from "./StoragePreferences";
import { settingsData } from "./Settings/SettingsData";

export const parseConfig = (config: DesktopConfig): void => {
	console.log("Parsing desktop config...");
	for (let option in config) {
		console.log(option);
		let value: any = config[option];

		if (option === "disableDevTools" && value === true) {
			setPref("mtd_inspectElement", false);
		}

		if (typeof option === "object") {
			for (let val in value) {
				console.log(val, val[option]);
				console.log(settingsData[option]);
				console.log(settingsData[option][val]);
			}
		}
	}
}
