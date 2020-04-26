import buildId from "./buildId.js";
import { isApp, make } from "./utils.js";
import { dumpPreferences } from "./prefStorage.js";
import { settingsData } from "./settingsData.js";
import { version } from "../package.json";

/*
	diag makes it easier for developers to narrow down user-reported bugs.
	You can call this via command line, or by pressing Ctrl+Alt+D
*/

export function diag() {
	let log = "";

	log += "The following diagnostic report contains information about your version of ModernDeck.\
	It contains a list of your preferences, but does not contain information related to your Twitter account(s).\
	A ModernDeck developer may request a copy of this diagnostic report to help diagnose problems.\n\n";

	log += "======= Begin ModernDeck Diagnostic Report =======\n\n";

	log += "\nModernDeck Version " + version + " (Build "+ buildId +")";

	log += ("\nTD.buildID: " + ((TD && TD.buildID) ? TD.buildID : "[not set]"));
	log += ("\nTD.version: " + ((TD && TD.version) ? TD.version : "[not set]"));

	log += "\nisDev: " + isDev;
	log += "\nisApp: " + isApp;
	log += "\nmtd-winstore: " + html.hasClass("mtd-winstore");
	log += "\nmtd-macappstore: " + html.hasClass("mtd-macappstore");
	log += "\nUser agent: " + navigator.userAgent;


	log += "\n\nLoaded extensions:\n";

	let loadedExtensions = [];

	$(".mtd-stylesheet-extension").each((e) => {
		loadedExtensions[loadedExtensions.length] =
		$(".mtd-stylesheet-extension")[e].href.match(/(([A-z0-9_\-])+\w+\.[A-z0-9]+)/g);
	});

	log += loadedExtensions.join(", ");

	log += "\n\nLoaded external components:\n"


	let loadedComponents = [];

	$(".mtd-stylesheet-component").each((e) => {
		loadedComponents[loadedComponents.length] =
		$(".mtd-stylesheet-component")[e].href.match(/(([A-z0-9_\-])+\w+\.[A-z0-9]+)/g);
	});

	log += loadedComponents.join(", ");

	log += "\n\nUser preferences: \n" + dumpPreferences();

	log += "\n\n======= End ModernDeck Diagnostic Report =======\n";

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

	mtdPrepareWindows();

	let diagText = make("p").addClass('mtd-diag-text').html(str.replace(/\n/g,"<br>"));
	let container = make("div").addClass("mtd-settings-inner mtd-diag-inner scroll-v").append(diagText);
	let panel = make("div").addClass("mdl mtd-settings-panel").append(container);

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(panel);

	return panel;
}
