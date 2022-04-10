/*
	DataSettings.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import themes from "./SettingsData/Themes";
import appearance from "./SettingsData/Appearance";
import tweets from "./SettingsData/Tweets";
import mutes from "./SettingsData/Mutes";
import accessibility from "./SettingsData/Accessibility";
import app from "./SettingsData/App";
import system from "./SettingsData/System";
import language from "./SettingsData/Language";
import about from "./SettingsData/About";
import internalSettings from "./SettingsData/InternalSettings";

/*
	Settings manager data.

	Serves two purposes.

	1. Managing preferences of users, able to activate and deactivate on the fly, and
	2. Serve as a guide to construct the settings UI

	https://github.com/dangeredwolf/ModernDeck/wiki/settingsData
*/

export let settingsData = {
	themes: themes,
	appearance: appearance,
	tweets: tweets,
	mutes: mutes,
	accessibility: accessibility,
	app: app,
	system: system,
	language: language,
	about: about,
	internalSettings: internalSettings
}