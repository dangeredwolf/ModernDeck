/*
	DataSettings.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import themes from "./Settings/Data/Themes";
import appearance from "./Settings/Data/Appearance";
import tweets from "./Settings/Data/Tweets";
import mutes from "./Settings/Data/Mutes";
import accessibility from "./Settings/Data/Accessibility";
import app from "./Settings/Data/App";
import system from "./Settings/Data/System";
import language from "./Settings/Data/Language";
import about from "./Settings/Data/About";
import internalSettings from "./Settings/Data/InternalSettings";

/*
	Settings manager data.

	Serves two purposes.

	1. Managing preferences of users, able to activate and deactivate on the fly, and
	2. Serve as a guide to construct the settings UI

	https://github.com/dangeredwolf/ModernDeck/wiki/settingsData
*/

enum SettingsTabs {
	themes = "themes",
	appearance = "appearance",
	tweets = "tweets",
	mutes = "mutes",
	accessibility = "accessibility",
	app = "app",
	system = "system",
	language = "language",
	about = "about",
	internalSettings = "internalSettings"
}

export let settingsData = {
	[SettingsTabs.themes]: themes,
	[SettingsTabs.appearance]: appearance,
	[SettingsTabs.tweets]: tweets,
	[SettingsTabs.mutes]: mutes,
	[SettingsTabs.accessibility]: accessibility,
	[SettingsTabs.app]: app,
	[SettingsTabs.system]: system,
	[SettingsTabs.language]: language,
	[SettingsTabs.about]: about,
	[SettingsTabs.internalSettings]: internalSettings
}