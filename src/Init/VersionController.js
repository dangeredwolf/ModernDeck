/*
	Init/VersionController.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export function getSystemName() {

	if (navigator.userAgent.indexOf("Windows NT") > 0) {
		return "Windows"
	} else if (navigator.userAgent.indexOf("Mac OS X") > 0 && navigator.userAgent.indexOf("Mobile") > 0) {
		return "iOS"
	} else if (navigator.userAgent.indexOf("Mac OS X") > 0) {
		return "macOS"
	} else if (navigator.userAgent.indexOf("Android") > 0) {
		return "Android"
	} else if (navigator.userAgent.indexOf("Linux") > 0) {
		return "Linux"
	}

	return "Unknown System";
}

export function getPlatformName() {
	let browserName = "Unknown Browser";

	if (navigator.userAgent.indexOf("ModernDeck/") > 0) {
		browserName = getSystemName();

		browserName += ` (${(process.arch === "x64" ? "amd64" : process.arch)})`;

		if (document.getElementsByTagName("html")[0].classList.contains("mtd-winstore")) {
			browserName += " Microsoft Store";
		}
		if (document.getElementsByTagName("html")[0].classList.contains("mtd-macappstore")) {
			browserName += " Mac App Store";
		}

		return browserName;
	} else {
		if (navigator.userAgent.indexOf("Gecko/") > 0) {
			browserName = "Firefox"
		} else if (navigator.userAgent.indexOf("Edg/") > 0) {
			browserName = "Edge"
		} else if (navigator.userAgent.indexOf("OPR/") > 0) {
			browserName = "Opera"
		} else if (navigator.userAgent.indexOf("Chrome/") > 0) {
			browserName = "Chrome"
		} else if (navigator.userAgent.indexOf("Safari/") > 0) {
			browserName = "Safari"
		}

		return `${browserName} (${getSystemName()})`
	}
}

export function getProductName() {
	return "ModernDeck";
}
