/*
	Boot/Items/SettingsHook.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { openSettings } from "../../UISettings";

export const initSettingsHook = () => {
	$(document).off("uiShowGlobalSettings");
	$(document).on("uiShowGlobalSettings", () => {
		openSettings();
	});
}