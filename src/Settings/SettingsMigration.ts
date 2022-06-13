/*
	SettingsMigration.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref, setPref } from "../StoragePreferences";
import { SettingsKey } from "./SettingsKey";

export class SettingsMigration {
	static migrate() : void {
		let theme : string = getPref(SettingsKey.THEME_COLOR);

		switch (theme) {
			case "grey":
			case "red":
			case "orange":
			case "yellow":
			case "green":
			case "teal":
			case "cyan":
			case "blue":
			case "violet":
			case "pink":
				setPref(SettingsKey.THEME_COLOR, theme);
				setPref(SettingsKey.THEME, TD.settings.getTheme());
				break;

			case "black":
		}

		let headPosition: string = getPref(SettingsKey.NAVIGATION_STYLE);

		switch(headPosition) {
			case "top":
			case "left":
				setPref(SettingsKey.NAVIGATION_STYLE, "simplified");
				break;
		}
	}
}
