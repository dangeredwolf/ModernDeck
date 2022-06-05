/*
	main.js
	Copyright (c) 2014-2022 dangeredwolf
	Released under the MIT license

	made with love <3

*/

const electron = require("electron");

const {
	app,
	nativeTheme
} = electron;

const path = require("path");
const url = require("url");

import { initAutoUpdater } from "./autoUpdater";

import{ tryConfig, DesktopConfig, loadDesktopConfigMain } from "./config";
import { HostManager } from "./hostManager";
import { makeTray } from "./tray";
import { makeWindow } from "./mainWindow";
import { setMenuBar } from "./menubar";


// const disableCss = false; // use storage.mtd_safemode

export let desktopConfig: DesktopConfig = tryConfig();
export let autoUpdater = initAutoUpdater();

app.setAppUserModelId("com.dangeredwolf.ModernDeck");

let useDir = "common";

export const mtdSchemeHandler = async (request: Electron.ProtocolRequest, callback: (response: string | Electron.ProtocolResponse) => void) => {
	if (request.url === "moderndeck://background/") {
		callback({
			path: desktopConfig.customLoginImage
		});
		return;
	}
	let myUrl = new url.URL(request.url);
	const filePath = path.join(electron.app.getAppPath(), useDir, myUrl.hostname, myUrl.pathname);

	callback({
		path: filePath
	});
};

setMenuBar();

// Register moderndeck:// protocol for accessing moderndeck assets, like CSS, images, etc.

electron.protocol.registerSchemesAsPrivileged([{
	scheme:"moderndeck",
	privileges:{
		bypassCSP:true,
		secure:true,
		standard:true,
		allowServiceWorkers:true,
		supportFetchAPI:true,
		corsEnabled:true
	}
}]);

app.setAsDefaultProtocolClient("moderndeck");

// Make window when app is ready

app.on("ready", () => {
	try {
		makeWindow();
		loadDesktopConfigMain(desktopConfig);
		if (HostManager.enableTray) {
			makeTray();
		}
	}
	catch (e) {
		console.error(e);
	}
});

// After all windows are closed, we can quit, unless restarting for update

app.on("window-all-closed", () => {
	if (!HostManager.isRestarting && process.platform != "darwin") {
		app.quit();
	}
});

app.on("before-quit", () => {
	HostManager.closeForReal = true;
})

// Make window if it doesn't exist, if user clicks app icon

app.on("activate", () => {
	if (HostManager.mainWindow === null) {
		makeWindow();
	}
	if (HostManager.mainWindowHidden && HostManager.mainWindow && HostManager.mainWindow.show) {
		HostManager.mainWindow.show();
		HostManager.mainWindowHidden = false;
	}
});

app.on("second-instance", () => {
	if (HostManager.mainWindow) {
		if (HostManager.mainWindow.isMinimized()) {
			HostManager.mainWindow.restore();
		}
		HostManager.mainWindow.show();
		HostManager.mainWindow.focus();
	}
})

// OS inverted color scheme (high contrast) mode changed. We automatically respond to changes for accessibility

nativeTheme.on("updated", (_event: Event) => {
	HostManager.mainWindow?.webContents?.send("inverted-color-scheme-changed",nativeTheme.shouldUseInvertedColorScheme);
});

setTimeout(() => {
	HostManager.mainWindow?.webContents?.send(
		"inverted-color-scheme-changed",
		!!nativeTheme.shouldUseInvertedColorScheme
	);
}, 5000)