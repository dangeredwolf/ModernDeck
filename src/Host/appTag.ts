import { HostManager } from "./hostManager";
import { store } from "./store";
import { isAppX, isFlatpak, isMAS } from "./utils";

const { app } = require("electron");

let mtdAppTag = '';

// App tags control browser behavior like CSS layouts and sometimes JS
export function updateAppTag() {
	HostManager.mainWindow?.webContents?.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");\
		document.querySelector("html").classList.remove("mtd-app-win");\
		document.querySelector("html").classList.remove("mtd-app-mac");\
		document.querySelector("html").classList.remove("mtd-app-linux");\
	');

	// Here, we add platform-specific tags to html, to help moderndeck CSS know what to do

	mtdAppTag = 'document.querySelector("html").classList.add("mtd-js-app");\n';

	if (isAppX) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-winstore");\n';
	}

	if (isFlatpak) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-flatpak");\n';
	}

	if (isMAS) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-macappstore");\n';
	}

	if (app.isEmojiPanelSupported()) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-supportsNativeEmojiPicker");\n';
	}

	if (!store.get("mtd_nativetitlebar")) {

		mtdAppTag += 'document.querySelector("html").classList.add("mtd-app");\n';

		if (process.platform === "darwin") {
			mtdAppTag += 'document.querySelector("html").classList.add("mtd-app-mac");\n'
		}

		if (process.platform === "linux") {
			mtdAppTag += 'document.querySelector("html").classList.add("mtd-app-linux");\n'
		}

		if (process.platform === "win32") {
			mtdAppTag += 'document.querySelector("html").classList.add("mtd-app-win");\n'
		}

	}

	HostManager.mainWindow?.webContents?.executeJavaScript(
		(store.get("mtd_fullscreen") ? 'document.querySelector("html").classList.add("mtd-js-app");' : mtdAppTag)
	)
}
