/*
	Settings/SettingsData.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import themes from "./Data/Themes";
import appearance from "./Data/Appearance";
import tweets from "./Data/Tweets";
import mutes from "./Data/Mutes";
import accessibility from "./Data/Accessibility";
import app from "./Data/App";
import system from "./Data/System";
import language from "./Data/Language";
import about from "./Data/About";
import internalSettings from "./Data/InternalSettings";

/*
	Settings manager data.

	Serves two purposes.

	1. Managing preferences of users, able to activate and deactivate on the fly, and
	2. Serve as a guide to construct the settings UI

	https://github.com/dangeredwolf/ModernDeck/wiki/settingsData
*/

export enum SettingsTab {
	THEMES = "themes",
	APPEARANCE = "appearance",
	TWEETS = "tweets",
	MUTES = "mutes",
	ACCESSIBILITY = "accessibility",
	APP = "app",
	SYSTEM = "system",
	LANGUAGE = "language",
	ABOUT = "about",
	INTERNAL_SETTINGS = "internalSettings"
}

export let settingsData = {
	[SettingsTab.THEMES]: themes,
	[SettingsTab.APPEARANCE]: appearance,
	[SettingsTab.TWEETS]: tweets,
	[SettingsTab.MUTES]: mutes,
	[SettingsTab.ACCESSIBILITY]: accessibility,
	[SettingsTab.APP]: app,
	[SettingsTab.SYSTEM]: system,
	[SettingsTab.LANGUAGE]: language,
	[SettingsTab.ABOUT]: about,
	[SettingsTab.INTERNAL_SETTINGS]: internalSettings
}