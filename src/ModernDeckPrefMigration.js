/*
	ModernDeckPrefMigration.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

export class ModernDeckPrefMigration {
	static migrate() {
		let theme = getPref("mtd_theme");

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
				setPref("mtd_color_theme", theme);
				setPref("mtd_theme", TD.settings.getTheme());
				break;

			case "black":
		}

		let headPosition = getPref("mtd_headposition");

		switch(headPosition) {
			case "top":
			case "left":
				setPref("mtd_headposition", "simplified");
				break;
		}
	}
}
