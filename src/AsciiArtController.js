/*
	AsciiArtController.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import ModernDeck from "./Init/ModernDeckConst.js";

export class AsciiArtController {

	static draw() {

		let text = `
    █████████████████████████████████████████
   ███████████████████████████████████████████
  █████████████████████████████████████████████
  █████████████     ████████      ▐████████████
  ███████████▌     ███████         ▐███████████
  ██████████      ███████     ██    ▐██████████
  ████████▌     ████████     ████    ▐█████████ 	ModernDeck ${window.ModernDeck.versionFriendlyString}
  ███████▌     ███████     ███████     ████████ 	Build ${window.ModernDeck.buildNumber}
  ████████     ██████     ███████     ▐████████ 	${window.ModernDeck.platformName}
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
	}
}
