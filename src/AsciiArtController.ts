/*
	AsciiArtController.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeck } from "./Functions/ModernDeckConst";

export class AsciiArtController {

	static draw(): void {

		let text = `
    █████████████████████████████████████████
   ███████████████████████████████████████████
  █████████████████████████████████████████████
  █████████████     ████████      ▐████████████
  ███████████▌     ███████         ▐███████████
  ██████████      ███████     ██    ▐██████████
  ████████▌     ████████     ████    ▐█████████   ModernDeck ${ModernDeck.versionFriendlyString}
  ███████▌     ███████     ███████     ████████   Build ${ModernDeck.buildNumber}
  ████████     ██████     ███████     ▐████████   ${ModernDeck.platformName}
  █████████▌     ███     ███████     ▐█████████
  ███████████           ███████     ███████████   Made with love
  ████████████        ███████     ▐████████████   by dangered wolf
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
			document.getElementsByTagName("html")[0].prepend(document.createComment(text));
      console.log(text);
		}

    if (navigator.userAgent.indexOf("Firefox/") > 0) {
      console.log(text);
    }
	}
}
