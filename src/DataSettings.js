/*
	DataSettings.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	Settings manager data.

	Serves two purposes.

	1. Managing preferences of users, able to activate and deactivate on the fly, and
	2. Serve as a guide to construct the settings UI

	https://github.com/dangeredwolf/ModernDeck/wiki/settingsData
*/

import themes from "./SettingsData/Themes.js";
import appearance from "./SettingsData/Appearance.js";
import tweets from "./SettingsData/Tweets.js";
import mutes from "./SettingsData/Mutes.js";
import accessibility from "./SettingsData/Accessibility.js";
import app from "./SettingsData/App.js";
import system from "./SettingsData/System.js";
import language from "./SettingsData/Language.js";
import about from "./SettingsData/About.js";
import internalSettings from "./SettingsData/InternalSettings.js";

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
