/*
	UIDiag.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { isApp } from "./Utils";
import { dumpPreferencesString } from "./StoragePreferences";
import { version } from "../package.json";
import { I18n } from "./I18n";
import { UIAlert } from "./UIAlert";
import { getSystemName, getPlatformName } from "./Functions/VersionController";

/*
	diag makes it easier for developers to narrow down user-reported bugs.
	You can call this via command line, or by pressing Ctrl+Alt+D
*/

export const diag = (): void => {
	let log = "";

	log += `\nModernDeck ${version} (Build ${window.ModernDeck.buildNumber})`;
	log += `\nBuilt ${window.ModernDeck.buildDate}`;

	log += `\n\nPlatform: `;

	if (isApp) {
		log += "Electron";

		if (window.html.hasClass("mtd-winstore")) {
			log += " (Microsoft Store)";
		}
		if (window.html.hasClass("mtd-flatpak")) {
			log += " (Flatpak)";
		}
		if (window.html.hasClass("mtd-macappstore")) {
			log += " (App Store)"
		}
		log += `\nOS: ${getSystemName()}\nArchitecture: ${(process.arch === "x64" ? "amd64" : process.arch)}`;
	} else {
		log += getPlatformName();
	}

	log += `\n\nTD.buildID: ${((TD && TD.buildID) ? TD.buildID : "[not set]")}`;
	log += `\nTD.version: ${((TD && TD.version) ? TD.version : "[not set]")}`;

	log += `\nUser agent: ${navigator.userAgent}`;


	log += `\n\nLoaded extensions:\n`;

	let loadedExtensions: string[] = [];

	$(".mtd-stylesheet-extension").each((e) => {
		loadedExtensions[loadedExtensions.length] = String($(".mtd-stylesheet-extension")[e].getAttribute("href").match(/(([A-z0-9_\-])+\w+\.[A-z0-9]+)/g));
	});

	log += loadedExtensions.join(", ");

	log += `\n\nUser preferences: \n${dumpPreferencesString()}`;

	console.log(log);

	try {
		showDiag(log);
	} catch (e) {
		console.error("An error occurred trying to show the diagnostic menu");
		console.error(e);
		window.lastError = e;
	}
}


/*
	Helper for diag() which renders the diagnostic results on screen if possible
*/

export function showDiag(diagString: string): JQuery<HTMLElement> {
	return new UIAlert({title:I18n("Diagnostics"), message:diagString.replace(/\n/g,"<br>")}).alertButton.remove()
}
