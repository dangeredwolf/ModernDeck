/*
	Boot/Items/KeyboardShortcutHandler.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { keyboardShortcutHandler } from "../../KeyboardShortcutHandler";

export const keyboardShortcutHandlerInit = () => {
	window.addEventListener("keyup", keyboardShortcutHandler, false);
}