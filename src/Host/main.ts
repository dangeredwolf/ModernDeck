/*
	main.js
	Copyright (c) 2014-2022 dangeredwolf
	Released under the MIT license

	made with love <3

*/

const electron = require("electron");

const {
	app,
	BrowserWindow,
	ipcMain,
	session,
	Menu,
	dialog,
	nativeTheme,
	nativeImage,
	protocol,
	Tray,
	globalShortcut
} = electron;

const fs = require("fs");
const path = require("path");
const url = require("url");
const https = require("https");

import { I18n } from "./i18n";
import { store } from "./store";

const remote = require('@electron/remote/main');

import { initAutoUpdater } from "./autoUpdater";

const separator = process.platform === "win32" ? "\\" : "/";

import{ tryConfig, DesktopConfig } from "./config";


// const disableCss = false; // use storage.mtd_safemode

const isAppX = !!process.windowsStore;
export const isFlatpak = (process.platform === "linux" && process.env.FLATPAK_HOST === "1")

const isMAS = !!process.mas;

const isDev = false;

let enableTray = true;
let enableBackground = true;
let shouldQuitIfErrorClosed = true;

let hidden = false;
let mainWindow: Electron.BrowserWindow;
let errorWindow: Electron.BrowserWindow;
let tray: Electron.Tray = null;

let isRestarting = false;
let closeForReal = false;

let mtdAppTag = '';

export let desktopConfig: DesktopConfig = tryConfig();
let autoUpdater = initAutoUpdater();

app.setAppUserModelId("com.dangeredwolf.ModernDeck");

let useDir = "common";

const mtdSchemeHandler = async (request: Electron.ProtocolRequest, callback: (response: string | Electron.ProtocolResponse) => void) => {
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

export const getWebContents = () => {
	if (mainWindow) {
		return mainWindow.webContents;
	}
	return null;
}

const template = [
	{
		label: "ModernDeck",
		role: "appMenu",
		submenu: [
			{ label: I18n("About ModernDeck"), click() { if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("aboutMenu"); } },
			{ label: I18n("Check for Updates..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("checkForUpdatesMenu"); } },
			{ type: "separator" },
			{ label: I18n("Preferences..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("openSettings"); } },
			{ label: I18n("Accounts..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("accountsMan"); } },
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
			{ label: I18n("New Tweet..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("newTweet"); } },
			{ label: I18n("New Direct Message..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("newDM"); } },
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
			{ label: I18n("Message @ModernDeck"), click(){ if (!mainWindow){electron.shell.openExternal("https://twitter.com/messages/compose?recipient_id=2927859037");return;}mainWindow.show();mainWindow?.webContents?.send("msgModernDeck"); } },
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

function exitFully() {
	closeForReal = true;
	app.relaunch();
	app.exit();
}

function makeErrorWindow() {

	const { shell } = electron;
	shell.beep();

	errorWindow = new BrowserWindow({
		width: 600,
		height: 260,
		webPreferences: {
			scrollBounce: true,
			nodeIntegration: true
		},
		parent:mainWindow || null,
		autoHideMenuBar:true
	});

	shouldQuitIfErrorClosed = true;

	errorWindow.webContents.on("new-window", (event, url) => {
		const { shell } = electron;
		event.preventDefault();
		shell.openExternal(url);
	});

	errorWindow.on("closed", () => {
		errorWindow = null;
		if (shouldQuitIfErrorClosed) {
			app.quit();
		}
	});

	errorWindow.loadURL(__dirname + separator + "sadmoderndeck.html");

	errorWindow.webContents.on("did-start-navigation", (event, url) => {
		event.preventDefault();
	});


}

function makeLoginWindow(url: string, teams: boolean) {

	let originalUrl = url;

	let loginWindow = new BrowserWindow({
		width: 710,
		height: 490,
		webPreferences: {
			scrollBounce: true,
			nodeIntegration: false
		},
		parent:mainWindow || null,
		modal:true,
		autoHideMenuBar:true
	});

	loginWindow.on("closed", () => {
		loginWindow = null;
	});

	loginWindow.webContents.on("will-navigate", (event, url) => {

		console.log("will-navigate", url);
		const { shell } = electron;

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0 && !teams) {
			console.log("Hello tweetdeck!");
			loginWindow?.close?.();
			mainWindow?.reload?.();
			event.preventDefault();
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0) {
			console.log("Hello logout!");
			loginWindow?.close?.();
			mainWindow?.reload?.();
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

	loginWindow.webContents.on("did-navigate-in-page", (event, url) => {
		console.log("did-navigate-in-page", url);

		if (url === "https://mobile.twitter.com/") {
			event.preventDefault();
			loginWindow?.close?.();
			return;
		}

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0) {
			console.log("Hello tweetdeck2!");
			mainWindow?.loadURL?.(url);
			loginWindow?.close?.();
			event.preventDefault();
			return;
		}

		if (url.indexOf("/i/flow/signup") >= 0 || url.indexOf("/i/flow/password_reset") >= 0) {
			event.preventDefault();
			loginWindow?.webContents?.goBack?.();
			const {shell} = electron;
			shell.openExternal(url);
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0 || url.indexOf("twitter.com/login") >= 0 || url.indexOf("twitter.com/i/flow/login") >= 0) {
			return;
		}

		if (loginWindow) {
			loginWindow.loadURL(originalUrl);
		}
	});

	loginWindow.webContents.on("new-window", (event, url) => {
		console.log("new-window", url);
		event.preventDefault();
		electron.shell.openExternal(url);
	});

	loginWindow.loadURL(url);

	return loginWindow;

}


function saveImageAs(url: string) {
	if (!url) {
		throw "saveImageAs requires \"URL\" as an argument";
	}

	let fileType = url.match(/(?<=format=)(\w{3,4})|(?<=\.)(\w{3,4}(?=\?))/g)[0] || "file";
	let fileName = url.match(/(?<=media\/)[\w\d_\-]+|[\w\d_\-]+(?=\.m)/g)[0] || "jpg";

	// console.log("saveImageAs");

	let savePath = dialog.showSaveDialogSync({defaultPath:fileName + "." + fileType});
	// console.log(savePath);
	if (savePath) {
		try {

			const file = fs.createWriteStream(savePath);

			https.get(url, (response: any) => {
				// console.log("Piping file...");
				response.pipe(file);
			});
		} catch(e) {
			console.log(e);
		}
	}

};

function saveWindowBounds() {
	if (!mainWindow) {
		return;
	}
	try {
		let bounds = mainWindow.getBounds();

		store.set("mtd_fullscreen", mainWindow.isFullScreen());
		store.set("mtd_maximised", mainWindow.isMaximized());
		if (!mainWindow.isMaximized() && !mainWindow.isFullScreen())
			store.set("mtd_windowBounds", mainWindow.getBounds());

		const matchedDisplay = electron.screen.getDisplayMatching({
			x: bounds.x,
			y: bounds.y,
			width: bounds.width,
			height: bounds.height
		});

		store.set("mtd_usedDisplay", matchedDisplay.id);
	} catch(e) {
		console.error(e);
	}
}

enum TitleBarStyle {
	DEFAULT = "default",
	HIDDEN = "hidden",
}

interface WindowBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

function makeWindow() {
	const lock = app.requestSingleInstanceLock();

	if (!lock) {
		closeForReal = true;
		app.quit();
		return;
	}

	if (!store.has("mtd_nativetitlebar")) {
		store.set("mtd_nativetitlebar",false);
	}

	protocol.registerFileProtocol("moderndeck", mtdSchemeHandler);

	isRestarting = false;

	let useFrame: boolean = (store.get("mtd_nativetitlebar") || store.get("mtd_safemode") || process.platform === "darwin") as boolean;
	let titleBarStyle: TitleBarStyle = TitleBarStyle.HIDDEN;

	if (store.get("mtd_nativetitlebar")) {
		titleBarStyle = TitleBarStyle.DEFAULT;
	}

	if (store.has("mtd_updatechannel")) {
		if (store.get("mtd_updatechannel") === "beta") {
			autoUpdater.allowPrerelease = true;
		}
		autoUpdater.channel = store.get("mtd_updatechannel");
	}

	let bounds = (store.get("mtd_windowBounds") || {}) as WindowBounds;
	let useXY = !!bounds.x && !!bounds.y

	mainWindow = new BrowserWindow({
		width: bounds.width || 1024,
		height: bounds.height || 660,
		x: useXY ? bounds.x : undefined,
		y: useXY ? bounds.y : undefined,
		webPreferences: {
			defaultFontFamily: {
				standard: "Roboto",
				serif: "Roboto",
				sansSerif: "Roboto",
				monospace: "RobotoMono"
			},
			backgroundThrottling:true,
			nodeIntegration: true,
			contextIsolation: false,
			nodeIntegrationInSubFrames: false,
			webgl: false,
			plugins: false,
			scrollBounce: true,
			// preload: __dirname+separator+useDir+separator+"assets"+separator+"js"+separator+"moderndeck.js"
		},
		autoHideMenuBar: true,
		title: "ModernDeck",
		// icon:__dirname+useDir+"/assets/favicon.ico",
		frame: useFrame,
		titleBarStyle: titleBarStyle,
		minWidth: 350,
		show: false,
		backgroundColor: "#111"
	});

	// macOS specific: Don't run from DMG, move to Applications folder.
	if (process.platform === "darwin" && !app.isInApplicationsFolder() && !isDev) {
		const { dialog } = electron;
		dialog.showMessageBox({
			type: "warning",
			title: "ModernDeck",
			message: I18n("Updates might not work correctly if you aren't running ModernDeck from the Applications folder.\n\nWould you like to move it there?"),
			buttons: [I18n("Not Now"), I18n("Yes, Move It")]
		}).then((event: Electron.MessageBoxReturnValue) => {
			if (event.response == 1) {
				let moveMe;
				try {
					moveMe = app.moveToApplicationsFolder();
				} catch (e) {
					console.error(e);
				}

				if (!moveMe){
					dialog.showMessageBox({
						type: "error",
						title: "ModernDeck",
						message: I18n("We couldn't automatically move ModernDeck to the applications folder. You may need to move it yourself."),
						buttons: [I18n("OK")]
					});
				}
			}
		});

	}

	// Prevent changing the Page Title
	mainWindow.on("page-title-updated", (event: Event) => {
		event.preventDefault();
	});

	// Save window bounds if it's closed, or otherwise occasionally
	mainWindow.on("close", (_event: Event) => {
		setTimeout(saveWindowBounds, 0);
	});

	setInterval(saveWindowBounds, 60 * 1000);

	mainWindow.show();

	hidden = false;

	// Initialize @electron/remote and limit its scope to only electron.Menu
	// ModernDeck doesn't need @electron/remote for anything else

	remote.initialize();
	remote.enable(mainWindow.webContents);

	// @electron/remote doesn't seem to have typing. So we use "as any" for them.

	app.on("remote-require" as any, (event: Event, _moduleName: string) => {
		event.preventDefault();
	});

	app.on("remote-get-global" as any, (event: Event, _moduleName: string) => {
		event.preventDefault();
	});

	app.on("remote-get-builtin" as any, (_: any, event: Event, moduleName: string) => {
		if (moduleName !== "Menu") {
			event.preventDefault();
		}
	});

	app.on("remote-get-current-window" as any, (event: Event, _moduleName: string) => {
		event.preventDefault();
	});

	app.on("remote-get-current-web-contents" as any, (event: Event, _moduleName: string) => {
		event.preventDefault();
	});
	
	
	updateAppTag();

	try {
		mainWindow?.webContents?.executeJavaScript(`
			document.getElementsByClassName("js-signin-ui block")[0].innerHTML =
			\`<img class="mtd-loading-logo" src="moderndeck://assets/img/moderndeck.svg" style="display: none;">
			<div class="preloader-wrapper active">
				<div class="spinner-layer">
					<div class="circle-clipper left">
						<div class="circle"></div>
					</div>
					<div class="gap-patch">
						<div class="circle"></div>
					</div>
					<div class="circle-clipper right">
						<div class="circle"></div>
					</div>
				</div>
			</div>\`;

			if (typeof mtdLoadStyleCSS === "undefined") {
				mtdLoadStyleCSS = \`
					img.spinner-centered {
						display:none!important
					}
				\`
				mtdLoadStyle = document.createElement("style");
				mtdLoadStyle.appendChild(document.createTextNode(mtdLoadStyleCSS))
				document.head.appendChild(mtdLoadStyle);
			}

			if (document.getElementsByClassName("spinner-centered")[0]) {
				document.getElementsByClassName("spinner-centered")[0].remove();
			}

			document.getElementsByTagName("html")[0].style = "background: #111;";
			document.getElementsByTagName("body")[0].style = "background: #111;";
		`)
	} catch(e) {

	}


	mainWindow?.webContents?.on("dom-ready", () => {

		mainWindow?.webContents?.executeJavaScript(`
			document.getElementsByTagName("html")[0].style = "background: #111!important;";
			document.getElementsByTagName("body")[0].style = "background: #111!important;";

			if (typeof mtdLoadStyleCSS === "undefined") {
				mtdLoadStyleCSS = \`
					img.spinner-centered {
						display:none!important
					}
				\`
				mtdLoadStyle = document.createElement("style");
				mtdLoadStyle.appendChild(document.createTextNode(mtdLoadStyleCSS))
				document.head.appendChild(mtdLoadStyle);
			}

			if (document.getElementsByClassName("spinner-centered")[0]) {
				document.getElementsByClassName("spinner-centered")[0].remove();
			}

			document.getElementsByClassName("js-signin-ui block")[0].innerHTML =
			\`<img class="mtd-loading-logo" src="moderndeck://assets/img/moderndeck.svg" style="display: none;">
			<div class="preloader-wrapper active">
				<div class="spinner-layer">
					<div class="circle-clipper left">
						<div class="circle"></div>
					</div>
					<div class="gap-patch">
						<div class="circle"></div>
					</div>
					<div class="circle-clipper right">
						<div class="circle"></div>
					</div>
				</div>
			</div>\`;
		`)

		mainWindow?.webContents?.executeJavaScript(
			`
			const baseUrl = document.createElement("meta");
			baseUrl.setAttribute("name", "moderndeck-base-url");
			baseUrl.setAttribute("content", "moderndeck://");
			document.head.appendChild(baseUrl);
			console.log("Injected baseUrl " + baseUrl.getAttribute("content"));
			
			const InjectScript2 = document.createElement("script");
			InjectScript2.src = "moderndeck://assets/libraries/moduleraid.min.js";
			InjectScript2.type = "text/javascript";
			document.head.appendChild(InjectScript2);`
			+
			(store.get("mtd_safemode") ? `document.getElementsByTagName("html")[0].classList.add("mtd-disable-css");` :
			`const injStyles = document.createElement("link");
			injStyles.rel = "stylesheet";
			injStyles.href = "moderndeck://assets/css/moderndeck.css";
			document.head.appendChild(injStyles);`)
			+
			`const InjectScript = document.createElement("script");
			InjectScript.src = "moderndeck://assets/js/moderndeck.js";
			InjectScript.type = "text/javascript";
			document.head.appendChild(InjectScript);
		`);

		updateAppTag();

	});

	mainWindow?.webContents?.on("did-fail-load", (_event: Event, code: number, desc: string) => {
		// These codes aren't necessarily fatal errors, so we ignore them instead of forcing the user to shut down ModernDeck.

		if (code === -3 || code === -11 || code === -2 || code === -1) {
			return;
		}

		makeErrorWindow();

		mainWindow.hide();

		errorWindow.webContents.executeJavaScript(`
			document.getElementById("code").innerHTML = "${desc}";
			document.getElementById("close").innerHTML = "${I18n("Close")}";
			document.getElementById("retry").innerHTML = "${I18n("Retry")}";
			document.getElementById("twitterStatus").innerHTML = "${I18n("Twitter Status")}";
		`);

		console.log(desc);

		return;
	});

	/*
		The content security policy needs to be replaced to be able to interact with GIF services
	*/

	mainWindow?.webContents?.session.webRequest.onHeadersReceived(
		{urls:["https://tweetdeck.twitter.com/*"]},
		(details: Electron.OnHeadersReceivedListenerDetails, callback: any) => {
			let foo = details.responseHeaders;
			foo["content-security-policy"] =[
				"default-src 'self'; connect-src * moderndeck:; "+
				"font-src https: blob: data: * moderndeck:; "+
				"frame-src https: moderndeck:; "+
				"frame-ancestors 'self' https: moderndeck:; "+
				"img-src https: file: data: blob: moderndeck:; "+
				"media-src * moderndeck: blob: https:; "+
				"object-src 'self' https:; script-src 'self' 'unsafe-eval' https://moderndeck.org moderndeck: https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com blob:; "+
				"style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck: blob:;"];
			callback({ responseHeaders: foo});
		}
	);


	mainWindow?.webContents?.session?.webRequest?.onBeforeSendHeaders?.({urls:["https://twitter.com/i/jot*", "https://tweetdeck.twitter.com/Users*"]}, (_details: Electron.OnBeforeSendHeadersListenerDetails, callback: (beforeSendResponse: Electron.BeforeSendResponse) => void) => {
		callback({cancel: true})
	})

	// mainWindow?.webContents?.session.webRequest.onHeadersReceived(
	// 	{urls:["https://*.twitter.com/*","https://*.twimg.com/*"]},
	// 	(details, callback) => {
	// 		let foo = details.responseHeaders;
	// 		foo["Access-Control-Allow-Origin"] =[
	// 			"moderndeck://."];
	// 		foo["Access-Control-Allow-Credentials"] = [
	// 			"true"
	// 		]
	// 		callback({ responseHeaders: foo});
	// 	}
	// );

	mainWindow?.webContents?.loadURL?.("https://tweetdeck.twitter.com");

	/*

		Web content requests to navigate away from page.

		If this is not a TweetDeck URL, we will instead pass
		it on to the browser, unless...

		...if it is a Twitter URL, we pop it up in a login Window.

	*/

	mainWindow?.webContents?.on?.("will-navigate", (event: Electron.Event, url: string) => {

		const { shell } = electron;
		console.log(url);

		if (url.indexOf("https://tweetdeck.twitter.com") < 0 && url.indexOf("moderndeck://.") < 0) {
			event.preventDefault();
			if (url.indexOf("twitter.com/login") >= 0 || url.indexOf("twitter.com/i/flow/login") >= 0 || url.indexOf("twitter.com/logout") >= 0) {
				console.log("this is a login window! will-navigate");
				makeLoginWindow(url, false);
			} else {
				shell.openExternal(url);
			}

		}


		updateAppTag();
	});

	/*

		Web content requests to open a new window.

		This is redirected in browser if it is not a TweetDeck URL.

		If it is a Twitter URL, we pop it up in a login Window.

	*/

	mainWindow?.webContents?.on?.("new-window", (event: Electron.NewWindowWebContentsEvent, url: string) => {
		const { shell } = electron;
		event.preventDefault();
		console.log(url);

		if (url.indexOf("https://twitter.com/teams/authorize") >= 0) {
			console.log("this is a login teams window! new-window");
			event.newGuest = makeLoginWindow(url,true);
		} else if (url.indexOf("twitter.com/login") >= 0 || url.indexOf("twitter.com/i/flow/login") >= 0 || url.indexOf("twitter.com/logout") >= 0) {
			console.log("this is a login non-teams window! new-window");
			event.newGuest = makeLoginWindow(url,false);
		} else {
			shell.openExternal(url).catch(() => {
				mainWindow?.webContents?.send("failedOpenUrl");
			})
		}

		return event.newGuest;

	});

	// i actually forget why this is here

	mainWindow?.webContents?.on?.("context-menu", (_event: Electron.Event, params: Electron.ContextMenuParams) => {
		mainWindow?.webContents?.send("context-menu", params);
	});

	ipcMain.on("getDesktopConfig", () => {
		mainWindow?.webContents?.send("desktopConfig", desktopConfig);
	});

	ipcMain.on("focus", () => {
		console.log("Focus!");
		mainWindow?.focus?.();
	});

	/*
		If a user uses native context menus, this is browser telling us
		to put up a native context menu with the given commands, instead
		of it doing it itself.
	*/

	ipcMain.on("nativeContextMenu", (_event: Electron.IpcMainEvent, params: any) => {
		console.log(params);
		let newMenu = Menu.buildFromTemplate(params);
		console.log(newMenu);
		newMenu.popup();
	});

	ipcMain.on("errorReload", () => {
		mainWindow.reload();
		mainWindow.show();
		shouldQuitIfErrorClosed = false;
		errorWindow.close();
	});

	ipcMain.on("loadSettingsDialog", () => {
		dialog.showOpenDialog(
			{ filters: [{ name: I18n("Preferences JSON File"), extensions: ["json"] }] }
		).then((results) => {
			console.log(results);
			if (typeof results.filePaths === "undefined") {
				return;
			}

			fs.readFile(results.filePaths[0], "utf-8", (_: any, load: string) => {
				mainWindow?.webContents?.send("settingsReceived", JSON.parse(load));
			});
		});
	});

	ipcMain.on("tweetenImportDialog", () => {
		dialog.showOpenDialog(
			{ filters: [{ name: I18n("Tweeten Settings JSON"), extensions: ["json"] }] }
		).then((results) => {
			if (typeof results.filePaths === "undefined") {
				return;
			}

			fs.readFile(results.filePaths[0], "utf-8", (_: any, load: string) => {
				mainWindow?.webContents?.send("tweetenSettingsReceived", JSON.parse(load));
			});
		});
	});

	ipcMain.on("saveSettings", (_event: Electron.IpcMainEvent, params: any) => {
		dialog.showSaveDialog(
			{
				title: I18n("ModernDeck Preferences"),
				defaultPath: "settings.json",
				filters: [{ name: I18n("Preferences JSON File"), extensions: ["json"] }]
			}
		).then((results) => {
			if (results.filePath === undefined) {
				return;
			}
			fs.writeFile(results.filePath, params, (_: any) => {});
		});
	})

	ipcMain.on("errorQuit", () => {
		app.quit();
	});

	ipcMain.on("drawerOpen", () => {
		console.log("open");

		mainWindow?.webContents?.executeJavaScript("document.querySelector(\"html\").classList.add(\"mtd-drawer-open\");");
	});

	ipcMain.on("drawerClose", () => {
		console.log("close");

		mainWindow?.webContents?.executeJavaScript("document.querySelector(\"html\").classList.remove(\"mtd-drawer-open\");");
	});


	ipcMain.on("maximizeButton", () => {
		let window = BrowserWindow.getFocusedWindow();

		if (!window) {
			return;
		}

		if (window.isMaximized()) {
			window.unmaximize();
		} else {
			window.maximize();
		}
	});

	ipcMain.on("minimize", () => {
		BrowserWindow.getFocusedWindow().minimize();
	});

	/*
		The options below are for right click menu actions
	*/

	ipcMain.on("copy", () => {
		mainWindow?.webContents?.copy?.();
	});

	ipcMain.on("cut", () => {
		mainWindow?.webContents?.cut?.();
	});

	ipcMain.on("paste", () => {
		mainWindow?.webContents?.paste?.();
	});

	ipcMain.on("delete", () => {
		mainWindow?.webContents?.delete?.();
	});

	ipcMain.on("selectAll", () => {
		mainWindow?.webContents?.selectAll?.();
	});

	ipcMain.on("undo", () => {
		mainWindow?.webContents?.undo?.();
	});

	ipcMain.on("redo", () => {
		mainWindow?.webContents?.redo?.();
	});

	ipcMain.on("copyImage", (_event: Electron.IpcMainEvent, arg: { x: number, y: number}) => {
		mainWindow?.webContents?.copyImageAt?.(arg.x, arg.y);
	});

	ipcMain.on("saveImage", (_event: Electron.IpcMainEvent, arg: string) => {
		saveImageAs(arg);
	});

	ipcMain.on("inspectElement", (_event: Electron.IpcMainEvent, arg: { x: number, y: number}) => {
		mainWindow?.webContents?.inspectElement?.(arg.x, arg.y);
	});

	ipcMain.on("showEmojiPanel", () => {
		app.showEmojiPanel();
	})

	// browser initiated app restart

	ipcMain.on("restartApp", () => {
		setTimeout(exitFully, 100);
	});

	// browser initiated app restart, after user clicks to restart to install updates

	ipcMain.on("restartAndInstallUpdates", () => {
		closeForReal = true;
		autoUpdater.quitAndInstall(false, true);
	});

	// When user elects to erase all of their settings, we wipe everything clean, including caches

	ipcMain.on("destroyEverything", async() => {
		let ses = session.defaultSession;
		store.clear();
		ses.flushStorageData();
		await ses.clearCache();
		ses.clearHostResolverCache();
		await ses.cookies.flushStore();
		ses.clearStorageData({
			storages:["appcache", "cookies", "filesystem", "indexdb", "localstorage", "shadercache", "websql", "serviceworkers"],
			quotas: ["temporary", "persistent", "syncable"]
		})

		setTimeout(exitFully, 500);
	});

	// Changing from immersive titlebar to native

	ipcMain.on("setNativeTitlebar", (_event: Electron.IpcMainEvent, arg: boolean) => {
		isRestarting = true;

		if (mainWindow) {
			closeForReal = true;
			mainWindow.close();
		}

		store.set("mtd_nativetitlebar", arg);

		setTimeout(exitFully, 100);

	});

	mainWindow.on("close", (event: Electron.Event) => {
		if (enableBackground && !closeForReal) {
			event.preventDefault();
			mainWindow.hide();
			hidden = true;

			// If tray disabled, show tray only if background is enabled
			if (!enableTray && process.platform !== "darwin") {
				makeTray();
			}
		}
	})

	// Enable tray icon
	ipcMain.on("enableTray", (_event: Electron.IpcMainEvent) => {
		enableTray = true;
		makeTray();
	});

	// Disable tray icon
	ipcMain.on("disableTray", (_event: Electron.IpcMainEvent) => {
		enableTray = false;
		destroyTray();
	});

	// Enable background notifications
	ipcMain.on("enableBackground", (_event: Electron.IpcMainEvent) => {
		enableBackground = true;
	});

	// Disable background notifications
	ipcMain.on("disableBackground", (_event: Electron.IpcMainEvent) => {
		enableBackground = false;
	});

	// Upon closing, set mainWindow to null
	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	// Change maximise to restore size window
	mainWindow.on("maximize", () => {
		mainWindow?.webContents?.executeJavaScript?.('\
			document.querySelector("html").classList.add("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3E0";\
		');
	});

	// Change restore size window to maximize
	mainWindow.on("unmaximize", () => {
		mainWindow?.webContents?.executeJavaScript?.('\
			document.querySelector("html").classList.remove("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3C6";\
		');
	});

	if (store.get("mtd_maximised")) {
		mainWindow?.maximize?.();
	}

	/*
		Upon entering full screen, remove app-specific CSS Classes,
		as there is less reason for a huge drag bar in full screen,
		at least in comparison to in windowed. Chrome itself does this too.
	*/
	mainWindow.on("enter-full-screen", () => {
		mainWindow?.webContents?.executeJavaScript?.('document.querySelector("html").classList.remove("mtd-app");\
			document.querySelector("html").classList.remove("mtd-app-win");\
			document.querySelector("html").classList.remove("mtd-app-mac");\
			document.querySelector("html").classList.remove("mtd-app-linux");\
		');
	});

	if (store.get("mtd_fullscreen")) {
		mainWindow?.webContents?.executeJavaScript?.('document.querySelector("html").classList.remove("mtd-app");');
		mainWindow?.setFullScreen?.(true)
	}

	mainWindow.on("leave-full-screen", () => {
		store.set("mtd_fullscreen", false);
		updateAppTag();
	});

	updateAppTag();
}

function showHiddenWindow() {
	if (!mainWindow){
		return;
	}

	mainWindow.show();
	hidden = false;

	if (!enableTray) {
		destroyTray();
	}
}

function makeTray() {
	if (tray !== null) {
		return;
	}

	let pathName = `${__dirname}${separator}common${separator}assets${separator}` +
					`img${separator}app${separator}${(process.platform === "darwin" ? "macOSTrayTemplate.png" : "Tray.png")}`;

	const image = nativeImage.createFromPath(pathName);
	image.setTemplateImage(true);
	tray = new Tray(pathName);

	const contextMenu = Menu.buildFromTemplate([
		{ label: I18n("Open ModernDeck"), click(){ showHiddenWindow() } },
		{ label: (process.platform === "darwin" ? I18n("Preferences...") : I18n("Settings...")), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("openSettings"); } },
		{ visible: (typeof process.windowsStore === "undefined" && desktopConfig.autoUpdatePolicy !== "disabled"), label: (process.platform === "darwin" ? I18n("Check for Updates...") : I18n("Check for updates...")), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("checkForUpdatesMenu"); } },

		{ type: "separator" },

		{ label: I18n("New Tweet..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("newTweet"); } },
		{ label: I18n("New Direct Message..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow?.webContents?.send("newDM"); } },

		{ type: "separator" },

		{ label: (process.platform === "darwin" ? I18n("Quit") : I18n("Exit")), click(){
			if (!mainWindow) {
				return;
			}
			closeForReal = true;
			autoUpdater.quitAndInstall(true,true);
			
			setTimeout(() => {
				/* if auto updater is dumb and does not quit then do it anyway
				 i think electron-updater changed their behavior because previously quitAndInstall always worked */
				app.quit();
			},200)
		}},
	]);

	tray.setToolTip("ModernDeck");
	tray.setContextMenu(contextMenu);
	tray.on("click", showHiddenWindow);
}

function destroyTray() {
	tray?.destroy?.();
	tray = null;
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
		if (enableTray) {
			makeTray();
		}
	}
	catch (e) {
		console.error(e);
	}
});

// After all windows are closed, we can quit, unless restarting for update

app.on("window-all-closed", () => {
	if (!isRestarting) {
		app.quit();
	}
});

app.on("before-quit", () => {
	closeForReal = true;
})

// Make window if it doesn't exist, if user clicks app icon

app.on("activate", () => {
	if (mainWindow === null) {
		makeWindow();
	}
	if (hidden && mainWindow && mainWindow.show) {
		mainWindow.show();
		hidden = false;
	}
});

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}
		mainWindow.show();
		mainWindow.focus();
	}
})

// App tags control browser behavior like CSS layouts and sometimes JS
function updateAppTag() {
	mainWindow?.webContents?.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");\
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

	mainWindow?.webContents?.executeJavaScript(
		(store.get("mtd_fullscreen") ? 'document.querySelector("html").classList.add("mtd-js-app");' : mtdAppTag)
	)
}

// OS inverted colour scheme (high contrast) mode changed. We automatically respond to changes for accessibility

nativeTheme.on("updated", (_event: Event) => {
	mainWindow?.webContents?.send("inverted-color-scheme-changed",nativeTheme.shouldUseInvertedColorScheme);
});

// if (process.platform === "darwin") {
// 	try {
// 		systemPreferences.subscribeNotification(
// 			"AppleInterfaceThemeChangedNotification",
// 			() => {
// 				if (!mainWindow || !mainWindow.webContents) { return }
// 				// mainWindow?.webContents?.send("color-scheme-changed", systemPreferences.isDarkMode() ? "dark" : "light");
// 			}
// 		)
// 	} catch(e) {
// 		console.error(e);
// 	}
// }
setTimeout(() => {
	mainWindow?.webContents?.send(
		"inverted-color-scheme-changed",
		!!nativeTheme.shouldUseInvertedColorScheme
	);
}, 5000)