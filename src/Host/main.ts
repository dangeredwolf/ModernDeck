/*
	main.js
	Copyright (c) 2014-2022 dangeredwolf
	Released under the MIT license

	made with love <3

*/

const electron = require("electron");

const {
	app,
	Menu,
	nativeTheme,
	globalShortcut
} = electron;

const path = require("path");
const url = require("url");

import { I18n } from "./i18n";

import { initAutoUpdater } from "./autoUpdater";

import{ tryConfig, DesktopConfig } from "./config";
import { HostManager } from "./hostManager";
import { makeTray } from "./tray";
import { makeWindow } from "./mainWindow";


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

const template = [
	{
		label: "ModernDeck",
		role: "appMenu",
		submenu: [
			{ label: I18n("About ModernDeck"), click() { if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("aboutMenu"); } },
			{ label: I18n("Check for Updates..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("checkForUpdatesMenu"); } },
			{ type: "separator" },
			{ label: I18n("Preferences..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("openSettings"); } },
			{ label: I18n("Accounts..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("accountsMan"); } },
			{ type: "separator" },
			{ role: "services" },
			{ type: "separator" },
			{ role: "hide" },
			{ role: "hideothers" },
			{ role: "unhide" },
			{ type: "separator" },
			{ role: "quit" }
		]
	},
	{
		role: "fileMenu",
		submenu: [
			{ label: I18n("New Tweet..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("newTweet"); } },
			{ label: I18n("New Direct Message..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("newDM"); } },
			{ type: "separator" },
			{ role: "close" }
		]
	},
	{
		role: "editMenu",
		submenu: [
			{ role: "undo" },
			{ role: "redo" },
			{ type: "separator" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ role: "delete" },
			{ role: "selectAll" },
			{ type: "separator" },
			{
				label: I18n("Speech"),
				submenu: [
					{ role: "startspeaking" },
					{ role: "stopspeaking" }
				]
			}
		]
	},
	{
		role: "viewMenu",
		submenu: [
			{ role: "reload" },
			{ role: "forcereload" },
			{ type: "separator" },
			{ role: "resetzoom" },
			{ role: "zoomin" },
			{ role: "zoomout" },
			{ role: "toggledevtools" },
			{ type: "separator" },
			{ role: "togglefullscreen" }
		]
	},
	{
		role: "windowMenu",
		submenu: [
			{ role: "minimize" },
			{ role: "zoom" },
			{ type: "separator" },
			{ role: "front" },
			{ type: "separator" },
			{ role: "window" }
		]
	},
	{
		role: "help",
		submenu: [
			{ label: I18n("Send Feedback"), click(){ electron.shell.openExternal("https://github.com/dangeredwolf/ModernDeck/issues");}},
			{ label: I18n("Message @ModernDeck"), click(){ if (!HostManager.mainWindow){electron.shell.openExternal("https://twitter.com/messages/compose?recipient_id=2927859037");return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("msgModernDeck"); } },
		]
	}
]


const menu = Menu.buildFromTemplate(template as Electron.MenuItemConstructorOptions[]);

// if (process.platform === "darwin")
Menu.setApplicationMenu(menu);

function loadDesktopConfigMain() {
	if (desktopConfig.disableDevTools) {
		// https://stackoverflow.com/questions/40304833/how-to-make-the-dev-tools-not-show-up-on-screen-by-default-electron
		globalShortcut.register("Control+Shift+I", () => {});
	}if (desktopConfig.disableZoom) {
		globalShortcut.register("Control+-", () => {});
		globalShortcut.register("Control+Shift+=", () => {});
	}
}

export function exitFully() {
	HostManager.closeForReal = true;
	app.relaunch();
	app.exit();
}


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
		loadDesktopConfigMain();
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

// OS inverted colour scheme (high contrast) mode changed. We automatically respond to changes for accessibility

nativeTheme.on("updated", (_event: Event) => {
	HostManager.mainWindow?.webContents?.send("inverted-color-scheme-changed",nativeTheme.shouldUseInvertedColorScheme);
});

setTimeout(() => {
	HostManager.mainWindow?.webContents?.send(
		"inverted-color-scheme-changed",
		!!nativeTheme.shouldUseInvertedColorScheme
	);
}, 5000)