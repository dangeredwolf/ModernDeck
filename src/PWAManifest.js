export class PWAManifest {
	static injectManifest() {
		let link = document.createElement("link");
		link.setAttribute("rel", "manifest");
		link.setAttribute("href", window.mtdBaseURL + "resources/pwa.json")
		document.head.appendChild(link);

		document.querySelector("meta[name=\"application-name\"]").setAttribute("content","ModernDeck");
	}
}
