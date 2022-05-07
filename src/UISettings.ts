/*
	UISettings.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { SettingsTab } from "./Settings/SettingsData";
import { UISettings } from "./Settings/UISettings";

export function openSettings(openMenu?: SettingsTab, limitedMenu?: boolean): void {
    new UISettings(openMenu, limitedMenu).display();
}

// opens legacy tweetdeck settings

export function openLegacySettings(): void {
	$(".mtd-settings-panel").remove();
	new TD.components.GlobalSettings;
}
