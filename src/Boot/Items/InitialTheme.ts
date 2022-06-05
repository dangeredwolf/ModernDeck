/*
	Boot/Items/InitialTheme.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { enableStylesheetExtension } from "../../StylesheetExtensions";

export const initialTheme = () => {
	// The default is dark for the loading screen, once the TD settings load it can use the user preference

	if (document.querySelector("html").classList.contains("mtd-disable-css")) {
		enableStylesheetExtension("micro");
	} else {
		enableStylesheetExtension("dark");
	}
	document.querySelector("html").classList.add("mtd-dark");
}