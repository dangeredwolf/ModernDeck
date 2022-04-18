/*
	Functions/VersionController.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export enum SystemName {
	WINDOWS = "Windows",
	MAC = "macOS",
	LINUX = "Linux",
	IOS = "iOS",
	ANDROID = "Android",
	UNKNOWN = "Unknown System"
}

export enum BrowserName {
	CHROME = "Chrome",
	FIREFOX = "Firefox",
	SAFARI = "Safari",
	OPERA = "Opera",
	EDGE = "Edge",
	UNKNOWN = "Unknown Browser"
}

export enum VersionStrings {
	VERSION = "Version",
	BETA = "Beta",
	DEVELOPER_VERSION = "Developer Version"
}

export const versionString = VersionStrings.BETA;

export const getSystemName = (): SystemName => {

	if (navigator.userAgent.indexOf("Windows NT") > 0) {
		return SystemName.WINDOWS
	} else if (navigator.userAgent.indexOf("Mac OS X") > 0 && navigator.userAgent.indexOf("Mobile") > 0) {
		return SystemName.IOS
	} else if (navigator.userAgent.indexOf("Mac OS X") > 0) {
		return SystemName.MAC
	} else if (navigator.userAgent.indexOf("Android") > 0) {
		return SystemName.ANDROID
	} else if (navigator.userAgent.indexOf("Linux") > 0) {
		return SystemName.LINUX
	}

	return SystemName.UNKNOWN;
}

export const getPlatformName = (): BrowserName | string => {
	let browserName: BrowserName = BrowserName.UNKNOWN;

	if (navigator.userAgent.indexOf("ModernDeck/") > 0) {
		let platformName: string = String(getSystemName());

		platformName += ` (${(process.arch === "x64" ? "amd64" : process.arch)})`;

		if (document.getElementsByTagName("html")[0].classList.contains("mtd-winstore")) {
			platformName += " Microsoft Store";
		}
		if (document.getElementsByTagName("html")[0].classList.contains("mtd-macappstore")) {
			platformName += " Mac App Store";
		}

		return platformName;
	} else {
		if (navigator.userAgent.indexOf("Gecko/") > 0) {
			browserName = BrowserName.FIREFOX;
		} else if (navigator.userAgent.indexOf("Edg/") > 0) {
			browserName = BrowserName.EDGE;
		} else if (navigator.userAgent.indexOf("OPR/") > 0) {
			browserName = BrowserName.OPERA;
		} else if (navigator.userAgent.indexOf("Chrome/") > 0) {
			browserName = BrowserName.CHROME;
		} else if (navigator.userAgent.indexOf("Safari/") > 0) {
			browserName = BrowserName.SAFARI;
		}

		return `${browserName} (${getSystemName()})`
	}
}

export function getProductName(): string {
	return "ModernDeck 10";
}
