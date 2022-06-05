import { separator } from "./utils";
import { HostManager } from "./hostManager";

const electron = require("electron");
const { app, BrowserWindow, shell } = electron;

let errorWindow: Electron.BrowserWindow;

export function makeErrorWindow() {

	shell.beep();

	HostManager.errorWindow = new BrowserWindow({
		width: 600,
		height: 260,
		webPreferences: {
			scrollBounce: true,
			nodeIntegration: true
		},
		parent:HostManager.mainWindow,
		autoHideMenuBar:true
	});

	HostManager.shouldQuitIfErrorClosed = true;

	errorWindow.webContents.on("new-window", (event: Event, url: string) => {
		event.preventDefault();
		shell.openExternal(url);
	});

	errorWindow.on("closed", () => {
		errorWindow = null;
		if (HostManager.shouldQuitIfErrorClosed) {
			app.quit();
		}
	});

	errorWindow.loadURL(__dirname + separator + "sadmoderndeck.html");

	errorWindow.webContents.on("did-start-navigation", (event, url) => {
		event.preventDefault();
	});


}
