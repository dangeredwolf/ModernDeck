/*
	ModernDeckInit.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import { version } from "../../package.json";
window.SystemVersion = version.replace(/\.0$/,""); // remove trailing .0, if present

import i18nData from "./DataI18n.js";
window.i18nData = i18nData;

import { AsciiArtController } from "./AsciiArtController.js";
import { processForceFeatureFlags } from "./ForceFeatureFlags.js";
import { handleErrors } from "./Utils.js";

const forceFeatureFlags = true;

function mtdInit() {
	console.log("ModernDeck Gryphon");

	if (forceFeatureFlags)
		handleErrors(processForceFeatureFlags, "Caught error in processForceFeatureFlags");

	handleErrors(AsciiArtController.draw, "Caught error while trying to draw ModernDeck version easter egg");
}
/*
	The first init function performed, even before mtdInit
	Also controls error reporting
*/

function coreInit() {

	mtdInit();

}

coreInit();
