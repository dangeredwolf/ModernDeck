/*
	StylesheetExtensions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";

/*
	Returns true if specified stylesheet extension is enabled, false otherwise.
	Works with custom stylesheets. (see enableCustomStylesheetExtension for more info)
*/

export const isStylesheetExtensionEnabled = (name: string): boolean => {
	if ($(`#mtd_custom_css_${name}`).length > 0) {
		return true;
	}
	return !!document.querySelector(`link.mtd-stylesheet-extension[href="${window.mtdBaseURL}assets/css/extensions/${name}.css"]`);
}

/*
	Enables a certain stylesheet extension.
	Stylesheet extensions are loaded from assets/css/extensions/[name].css

	These are the predefined ModernDeck ones including colour themes, default light and dark themes, and various preferences

	For custom or dynamically defined ones, see enableCustomStylesheetExtension
*/

export const enableStylesheetExtension = (name: string): void => {
	if (name === "default" || $(`#mtd_custom_css_${name}`).length > 0)
		return;

	// This is where components are located
	let url = `${window.mtdBaseURL}assets/css/extensions/${name}.css`;

	if (!isStylesheetExtensionEnabled(name)) {
		window.head.append(
			make("link")
			.attr("rel","stylesheet")
			.attr("href",url)
			.addClass("mtd-stylesheet-extension")
		)
	} else return;
}

/*
	disableStylesheetExtension(string name)

	Disables stylesheet extension by name. Function also works with custom stylesheet extensions
*/

export const disableStylesheetExtension = (name: string): void => {
	if (!isStylesheetExtensionEnabled(name))
		return;

	$(`head>link[href="${window.mtdBaseURL}assets/css/extensions/${name}.css"]`).remove();

	if ($(`#mtd_custom_css_${name}`).length > 0) {
		$(`#mtd_custom_css_${name}`).remove();
	}
}

// Custom stylesheet extensions are used for custom user CSS and for certain sliders, such as column width

export const enableCustomStylesheetExtension = (name: string, styles: string): void => {

	if (isStylesheetExtensionEnabled(name)) {
		$(`#mtd_custom_css_${name}`).html(styles);
		return;
	}

	window.head.append(make("style").html(styles).attr("id", `mtd_custom_css_${name}`))
}


window.ModernDeck.enableStylesheetExtension = enableStylesheetExtension;
window.ModernDeck.disableStylesheetExtension = disableStylesheetExtension;