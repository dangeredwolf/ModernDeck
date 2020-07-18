/*
	UIDiag.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

import buildId from "./buildId.js";
import { isApp, make } from "./Utils.js";
import { dumpPreferences } from "./StoragePreferences.js";
import { settingsData } from "./DataSettings.js";
import { version } from "../package.json";
import { I18n } from "./I18n.js";
import { UIAlert } from "./UIAlert.js";

/*
	diag makes it easier for developers to narrow down user-reported bugs.
	You can call this via command line, or by pressing Ctrl+Alt+D
*/

export function diag() {
	let log = "";

	log += "\nModernDeck " + version + " (Build "+ buildId +")";

	log += "\n\nPlatform: ";

	if (isApp) {
		log += "Electron";

		if (html.hasClass("mtd-winstore")) {
			log += " (Microsoft Store)";
		}
		if (html.hasClass("mtd-macappstore")) {
			log += " (App Store)"
		}
		log += "\nOS: " + process.platform + "\nArchitecture: " + (process.arch === "x64" ? "amd64" : process.arch);
	} else {
		log += AsciiArtController.platformName();
	}

	log += ("\n\nTD.buildID: " + ((TD && TD.buildID) ? TD.buildID : "[not set]"));
	log += ("\nTD.version: " + ((TD && TD.version) ? TD.version : "[not set]"));
	
	log += "\nUser agent: " + navigator.userAgent;


	log += "\n\nLoaded extensions:\n";

	let loadedExtensions = [];

	$(".mtd-stylesheet-extension").each((e) => {
		loadedExtensions[loadedExtensions.length] =
		$(".mtd-stylesheet-extension")[e].href.match(/(([A-z0-9_\-])+\w+\.[A-z0-9]+)/g);
	});

	log += loadedExtensions.join(", ");

	log += "\n\nUser preferences: \n" + dumpPreferences();

	console.log(log);

	try {
		showDiag(log);
	} catch (e) {
		console.error("An error occurred trying to show the diagnostic menu");
		console.error(e);
		lastError = e;
	}
}


/*
	Helper for diag() which renders the diagnostic results on screen if possible
*/

export function showDiag(str) {

	return new UIAlert({title:I18n("Diagnostics"), message:str.replace(/\n/g,"<br>")}).alertButton.remove()

	mtdPrepareWindows();

	let diagText = make("p").addClass('mtd-diag-text').html(str.replace(/\n/g,"<br>"));
	let container = make("div").addClass("mtd-settings-inner mtd-diag-inner scroll-v").append(diagText);
	let panel = make("div").addClass("mdl mtd-settings-panel").append(container);

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(panel);

	return panel;
}
