import { HostManager } from "./hostManager";

const electron = require("electron");
const { BrowserWindow } = electron;

export function makeLoginWindow(url: string, teams: boolean) {

	let originalUrl = url;

	HostManager.loginWindow = new BrowserWindow({
		width: 710,
		height: 490,
		webPreferences: {
			scrollBounce: true,
			nodeIntegration: false
		},
		parent:HostManager.mainWindow || null,
		modal:true,
		autoHideMenuBar:true
	});

	HostManager.loginWindow.on("closed", () => {
		HostManager.loginWindow = null;
	});

	HostManager.loginWindow.webContents.on("will-navigate", (event: Electron.Event, url: string) => {

		console.log("will-navigate", url);
		const { shell } = electron;

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0 && !teams) {
			console.log("Hello tweetdeck!");
			HostManager.loginWindow?.close?.();
			HostManager.mainWindow?.reload?.();
			event.preventDefault();
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0) {
			console.log("Hello logout!");
			HostManager.loginWindow?.close?.();
			HostManager.mainWindow?.reload?.();
			event.preventDefault();
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0 || url.indexOf("twitter.com/login") >= 0  || url.indexOf("twitter.com/i/flow/login") >= 0 ||url.indexOf("twitter.com/account/login_verification") >= 0 || teams) {
			return;
		}

		if (url.indexOf("twitter.com/account") >= 0 || url.indexOf("twitter.com/signup") >= 0|| url.indexOf("twitter.com/signup") >= 0) {
			event.preventDefault();
			shell.openExternal(url);
			return;
		}

		if (url.indexOf("twitter.com/sessions") >= 0) {
			return;
		}

		event.preventDefault();
	});

	HostManager.loginWindow.webContents.on("did-navigate-in-page", (event: Electron.Event, url: string) => {
		console.log("did-navigate-in-page", url);

		if (url === "https://mobile.twitter.com/") {
			event.preventDefault();
			HostManager.loginWindow?.close?.();
			return;
		}

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0) {
			console.log("Hello tweetdeck2!");
			HostManager.mainWindow?.loadURL?.(url);
			HostManager.loginWindow?.close?.();
			event.preventDefault();
			return;
		}

		if (url.indexOf("/i/flow/signup") >= 0 || url.indexOf("/i/flow/password_reset") >= 0) {
			event.preventDefault();
			HostManager.loginWindow?.webContents?.goBack?.();
			const {shell} = electron;
			shell.openExternal(url);
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0 || url.indexOf("twitter.com/login") >= 0 || url.indexOf("twitter.com/i/flow/login") >= 0) {
			return;
		}

		if (HostManager.loginWindow) {
			HostManager.loginWindow.loadURL(originalUrl);
		}
	});

	HostManager.loginWindow.webContents.on("new-window", (event: Electron.Event, url: string) => {
		console.log("new-window", url);
		event.preventDefault();
		electron.shell.openExternal(url);
	});

	HostManager.loginWindow.loadURL(url);

	return HostManager.loginWindow;

}
