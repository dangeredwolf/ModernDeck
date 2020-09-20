/*
	ModernDeckVersionController.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

import { isEnterprise, isApp } from "./Utils.js";

let verTextId = 2;

export function getPlatformName() {
	let browserName = "Unknown Browser";
	let systemName = "Unknown System";

	if (navigator.userAgent.indexOf("ModernDeck/") > 0) {
		browserName = "App"
	} else if (navigator.userAgent.indexOf("Gecko/") > 0) {
		browserName = "Firefox"
	} else if (navigator.userAgent.indexOf("Edg/") > 0) {
		browserName = "Edge"
	} else if (navigator.userAgent.indexOf("OPR/") > 0) {
		browserName = "Opera"
	} else if (navigator.userAgent.indexOf("Chrome/") > 0) {
		browserName = "Chrome"
	} else if (navigator.userAgent.indexOf("Edge/") > 0) {
		browserName = "Edge (Legacy)"
	} else if (navigator.userAgent.indexOf("Safari/") > 0) {
		browserName = "Safari"
	}

	if (navigator.userAgent.indexOf("Windows NT") > 0) {
		systemName = "Windows"
	} else if (navigator.userAgent.indexOf("Mac OS X") > 0 && navigator.userAgent.indexOf("Mobile") > 0) {
		systemName = "iOS"
	} else if (navigator.userAgent.indexOf("Mac OS X") > 0) {
		systemName = "macOS"
	} else if (navigator.userAgent.indexOf("Android") > 0) {
		systemName = "Android"
	} else if (navigator.userAgent.indexOf("Linux") > 0) {
		systemName = "Linux"
	}

	return `${browserName} (${systemName})`
}

export function getVersionTextSettings() {
	switch(verTextId) {
		case 0:
			return "";
		case 1:
			return I18n("Version");
		case 2:
			return I18n("Beta");
		case 3:
			return I18n("Developer Version");
	}
}

export function getVersionText() {
	switch(verTextId) {
		case 0:
			return "";
		case 1:
			return "";
		case 2:
			return I18n("Beta");
		case 3:
			return I18n("Developer Version");
	}
}

export function getProductName() {
	return isEnterprise() ? "ModernDeck Enterprise" : "ModernDeck";
}
