/*
	AsciiArtController.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeck } from "./Functions/ModernDeckConst";

export class AsciiArtController {

	static draw(): void {

    let consoleStyle = `
        color: #00aaff;
        line-height: 1.35;
    `

    let text = `
    ▄███████████████████████████████████████▄
  ▄███████████████████████████████████████████▄
  █████████████████████████████████████████████
  ████████████▀  ▀███████████▀   ▀█████████████
  ███████████      ████████▀       ▀███████████
  ██████████     ▄████████     ▄     ██████████   ModernDeck ${ModernDeck.versionFriendlyString}
  █████████     ████████▀     ███     ▀████████   Build ${ModernDeck.buildNumber}
  ███████▀     ████████     ▄█████     ▀███████   ${ModernDeck.platformName}
  ███████     ███████▀     ████████     ███████
  ███████▌     █████▀     ████████     ████████
  █████████     ▀██     ▄███████▀     █████████   Made with love
  ██████████           ████████▀     ██████████   by dangered wolf
  ███████████▄       ▄████████▌     ███████████
  ██████████████▄▄▄█████████████▄▄█████████████
  █████████████████████████████████████████████
  ▀███████████████████████████████████████████▀
    ▀███████████████████████████████████████▀ 
                 ▀███████████▀
                   ▀███████▀
                     ▀███▀
  `

		// https://twitter.com/dangeredwolf/status/1263968859637395466
		if (navigator.userAgent.indexOf("Chrome/") > 0) {
			document.getElementsByTagName("html")[0].prepend(document.createComment(text));
		} else if (navigator.userAgent.indexOf("Safari/") > 0) {
      consoleStyle += `font-family: "SF Mono Regular", monospace !important;`;
    }
    
    console.log(`%c${text}`, consoleStyle);
	}
}
