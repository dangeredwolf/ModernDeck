/*
	SafeMode.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { SettingsKey } from "./Settings/SettingsKey";
import { setPref } from "./StoragePreferences";
import { getIpc } from "./Utils";

/*
	Enters safe mode, disabling most ModernDeck custom CSS. App-only right now.
*/

export const enterSafeMode = (): void => {
	setPref(SettingsKey.SAFE_MODE, true);
	getIpc().send("restartApp");
}
