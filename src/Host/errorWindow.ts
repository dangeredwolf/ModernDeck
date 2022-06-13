import { separator } from "./utils";
import { HostManager } from "./hostManager";

const electron = require("electron");
const { app, BrowserWindow, shell } = electron;

export function makeErrorWindow() {

	shell.beep();

	HostManager.errorWindow = new BrowserWindow({
		width: 600,
		height: 260,
		webPreferences: {
			scrollBounce: true,
			contextIsolation: false,
			nodeIntegration: true
		},
		parent:HostManager.mainWindow,
		autoHideMenuBar:true
	});

	HostManager.shouldQuitIfErrorClosed = true;

	HostManager.errorWindow.webContents.on("new-window", (event: Event, url: string) => {
		event.preventDefault();
		shell.openExternal(url);
	});

	HostManager.errorWindow.on("closed", () => {
		HostManager.errorWindow = null;
		if (HostManager.shouldQuitIfErrorClosed) {
			app.quit();
		}
	});

	HostManager.errorWindow.loadURL(`file://${__dirname}${separator}..${separator}..${separator}..${separator}sadmoderndeck.html`);

	HostManager.errorWindow.webContents.on("did-start-navigation", (event, url) => {
		event.preventDefault();
	});


}