/*
	SafeMode.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { setPref } from "./StoragePreferences.js";
import { getIpc } from "./Utils.js";

/*
	Enters safe mode, disabling most ModernDeck custom CSS. App-only right now.
*/

export const enterSafeMode = () => {
	setPref("mtd_safemode",true);
	getIpc().send("restartApp");
}
