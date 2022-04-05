/*
	PWAManifest.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export class PWAManifest {
	static injectManifest() {
		let link = document.createElement("link");
		link.setAttribute("rel", "manifest");
		link.setAttribute("href", window.mtdBaseURL + "assets/pwa.json")
		document.head.appendChild(link);

		document.querySelector("meta[name=\"application-name\"]").setAttribute("content","ModernDeck");
	}
}