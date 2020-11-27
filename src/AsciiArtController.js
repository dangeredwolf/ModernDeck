/*
	AsciiArtController.js

	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT License
*/

import buildId from "./buildId.js";

// Side effect of the build process: This is loaded first, so to compensate, we put this here
window.ModernDeck = 9;

const isEnterprise = function() {
	return typeof process !== "undefined" && process.execPath.match(/:\\Program Files/g) !== null;
}

export class AsciiArtController {

	static systemName() {
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
	}
	static platformName() {
		let browserName = "Unknown Browser";

		if (navigator.userAgent.indexOf("ModernDeck/") > 0) {
			browserName = AsciiArtController.systemName();

			browserName += ` (${(process.arch === "x64" ? "amd64" : process.arch)})`;

			if (isEnterprise()) {
				browserName += " Enterprise";
			}
			if (typeof process.windowsStore !== "undefined") {
				browserName += " Microsoft Store";
			}
			if ($("html").hasClass("mtd-macappstore")) {
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

			return `${browserName} (${AsciiArtController.systemName()})`
		}

	}
	static draw() {

		let text = `
    █████████████████████████████████████████
   ███████████████████████████████████████████
  █████████████████████████████████████████████
  █████████████     ████████      ▐████████████
  ███████████▌     ███████         ▐███████████
  ██████████      ███████     ██    ▐██████████
  ████████▌     ████████     ████    ▐█████████ 	ModernDeck ${SystemVersion}
  ███████▌     ███████     ███████     ████████ 	Build ${buildId}
  ████████     ██████     ███████     ▐████████ 	${AsciiArtController.platformName()}
  █████████▌     ███     ███████     ▐█████████
  ███████████           ███████     ███████████ 	Made with love
  ████████████        ███████     ▐████████████ 	by dangered wolf
  █████████████████████████████████████████████
  ████████████████████████████████████████████▌
   ██████████████████████████████████████████▌
    ████████████████████████████████████████▌
                 ██████████████▌
                   ██████████▌
                     ██████▌
`

		// https://twitter.com/dangeredwolf/status/1263968859637395466
		if (navigator.userAgent.indexOf("Chrome/") > 0) {
			document.getElementsByTagName("html")[0].prepend(document.createComment(text))
		}

		console.log(text);

		// let lines = [
		// 	"",
		// 	"    █████████████████████████████████████████",
		// 	"   ███████████████████████████████████████████",
		// 	"  █████████████████████████████████████████████",
		// 	"  █████████████     ████████      ▐████████████",
		// 	"  ███████████▌     ███████         ▐███████████",
		// 	"  ██████████      ███████     ██    ▐██████████",
		// 	"  ████████▌     ████████     ████    ▐█████████ 	ModernDeck " + SystemVersion,
		// 	"  ███████▌     ███████     ███████     ████████ 	Build " + buildId,
		// 	"  ████████     ██████     ███████     ▐████████ 	" + AsciiArtController.platformName(),
		// 	"  █████████▌     ███     ███████     ▐█████████",
		// 	"  ███████████           ███████     ███████████ 	Made with love",
		// 	"  ████████████        ███████     ▐████████████ 	by dangered wolf",
		// 	"  █████████████████████████████████████████████",
		// 	"  ████████████████████████████████████████████▌",
		// 	"   ██████████████████████████████████████████▌",
		// 	"    ████████████████████████████████████████▌",
		// 	"                 ██████████████▌",
		// 	"                   ██████████▌",
		// 	"                     ██████▌",
		// 	""
		// ]
		//
		// let htmlTag = document.getElementsByTagName("html")[0];
		//
		// for (let i = lines.length; i > 0; i--) {
		// 	htmlTag.prepend(document.createComment(lines[i]));
		// }

	}
}
