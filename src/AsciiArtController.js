import buildId from "./buildId.js";

// Side effect of the build process: This is loaded first, so to compensate, we put this here
window.ModernDeck = 8;

export class AsciiArtController {
	static platformName() {
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
	static draw() {
		document.getElementsByTagName("html")[0].prepend(document.createComment(
`
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
  ███████████           ███████     ███████████ 	Made with love by dangered wolf
  ████████████        ███████     ▐████████████
  █████████████████████████████████████████████
  ████████████████████████████████████████████▌
   ██████████████████████████████████████████▌
    ████████████████████████████████████████▌
                 ██████████████▌
                   ██████████▌
                     ██████▌
`)
		)
	}
}
