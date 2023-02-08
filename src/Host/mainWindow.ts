import { SettingsKey } from "../Settings/SettingsKey";
import { ProxyMode } from "../Settings/Types/Proxy";
import { updateAppTag } from "./appTag";
import { makeErrorWindow } from "./errorWindow";
import { HostManager } from "./hostManager";
import { I18n } from "./i18n";
import { makeLoginWindow } from "./loginWindow";
import { autoUpdater, desktopConfig, mtdSchemeHandler } from "./main";
import { updateProxy } from "./proxy";
import { store } from "./store";
import { destroyTray, makeTray } from "./tray";
import { saveImageAs } from "./utils";
const electron = require("electron");
const { app, BrowserWindow, protocol, ipcMain, dialog, Menu, session } = electron;

const remote = require('@electron/remote/main');
const fs = require("fs");

function exitFully() {
	HostManager.closeForReal = true;
	app.relaunch();
	app.exit();
}

function saveWindowBounds() {
	if (!HostManager.mainWindow) {
		return;
	}
	try {
		let bounds = HostManager.mainWindow.getBounds();

		store.set(SettingsKey.FULL_SCREEN, HostManager.mainWindow.isFullScreen());
		store.set(SettingsKey.MAXIMIZED, HostManager.mainWindow.isMaximized());
		if (!HostManager.mainWindow.isMaximized() && !HostManager.mainWindow.isFullScreen())
			store.set(SettingsKey.WINDOW_BOUNDS, HostManager.mainWindow.getBounds());

		const matchedDisplay = electron.screen.getDisplayMatching({
			x: bounds.x,
			y: bounds.y,
			width: bounds.width,
			height: bounds.height
		});

		store.set(SettingsKey.LAST_DISPLAY, matchedDisplay.id);
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


export const makeWindow = (): void => {
	const lock = app.requestSingleInstanceLock();

	if (!lock) {
		HostManager.closeForReal = true;
		app.quit();
		return;
	}

	if (!store.has(SettingsKey.NATIVE_TITLE_BAR)) {
		store.set(SettingsKey.NATIVE_TITLE_BAR,false);
	}

	protocol.registerFileProtocol("moderndeck", mtdSchemeHandler);

	HostManager.isRestarting = false;

	let useFrame: boolean = (store.get(SettingsKey.NATIVE_TITLE_BAR) || store.get(SettingsKey.SAFE_MODE) || process.platform === "darwin") as boolean;
	let titleBarStyle: TitleBarStyle = TitleBarStyle.HIDDEN;

	if (store.get(SettingsKey.NATIVE_TITLE_BAR)) {
		titleBarStyle = TitleBarStyle.DEFAULT;
	}

	if (store.has(SettingsKey.UPDATE_CHANNEL)) {
		if (store.get(SettingsKey.UPDATE_CHANNEL) === "beta") {
			autoUpdater.allowPrerelease = true;
		}
		autoUpdater.channel = store.get(SettingsKey.UPDATE_CHANNEL);
	}

	let bounds = (store.get(SettingsKey.WINDOW_BOUNDS) || {}) as WindowBounds;
	let useXY = !!bounds.x && !!bounds.y

	HostManager.mainWindow = new BrowserWindow({
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
	if (process.platform === "darwin" && !app.isInApplicationsFolder()) {
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
	HostManager.mainWindow.on("page-title-updated", (event: Event) => {
		event.preventDefault();
	});

	// Save window bounds if it's closed, or otherwise occasionally
	HostManager.mainWindow.on("close", (_event: Event) => {
		setTimeout(saveWindowBounds, 0);
	});

	setInterval(saveWindowBounds, 60 * 1000);

	HostManager.mainWindow.show();

	HostManager.mainWindowHidden = false;

	// Initialize @electron/remote and limit its scope to only electron.Menu
	// ModernDeck doesn't need @electron/remote for anything else

	remote.initialize();
	remote.enable(HostManager.mainWindow.webContents);

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
		HostManager.mainWindow?.webContents?.executeJavaScript(`
			if (document.querySelector("html").classList.contains("scroll-v") === false) {
				// TweetDeck Preview is loading, so we need to revert it to legacy
				document.cookie = "tweetdeck_version=; domain=.twitter.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
				document.cookie = "tweetdeck_version=; domain=tweetdeck.twitter.com; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
				document.cookie = "tweetdeck_version=legacy; domain=.twitter.com; path=/; expires=Thu, 01 Jan 2099 00:00:00 GMT";
				document.cookie = "tweetdeck_version=legacy; domain=tweetdeck.twitter.com; path=/; expires=Thu, 01 Jan 2099 00:00:00 GMT";
				location.reload();
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


	HostManager.mainWindow?.webContents?.on("dom-ready", () => {

		HostManager.mainWindow?.webContents?.executeJavaScript(`
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

		HostManager.mainWindow?.webContents?.executeJavaScript(
			`
			const baseUrl = document.createElement("meta");
			baseUrl.setAttribute("name", "moderndeck-base-url");
			baseUrl.setAttribute("content", "moderndeck://");
			document.head.appendChild(baseUrl);
			
			const InjectScript2 = document.createElement("script");
			InjectScript2.src = "moderndeck://assets/libraries/moduleraid.min.js";
			InjectScript2.type = "text/javascript";
			document.head.appendChild(InjectScript2);`
			+
			(store.get(SettingsKey.SAFE_MODE) ? `document.getElementsByTagName("html")[0].classList.add("mtd-disable-css");` :
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

	HostManager.mainWindow?.webContents?.on("did-fail-load", (_event: Event, code: number, desc: string) => {
		// These codes aren't necessarily fatal errors, so we ignore them instead of forcing the user to shut down ModernDeck.

		if (code === -3 || code === -11 || code === -2 || code === -1) {
			return;
		}

		makeErrorWindow();

		HostManager.mainWindow.hide();

		HostManager.errorWindow.webContents.executeJavaScript(`
			document.getElementById("code").innerHTML = "${desc}";
			document.getElementById("close").innerHTML = "${I18n("Close")}";
			document.getElementById("retry").innerHTML = "${I18n("Retry")}";
			document.getElementById("twitterStatus").innerHTML = "${I18n("Twitter Status")}";
			document.getElementById("resetProxy").innerHTML = "${I18n("Reset Proxy")}";
		`);

		if (store.get(SettingsKey.PROXY_MODE) === ProxyMode.AUTODETECT) {
			HostManager.errorWindow.webContents.executeJavaScript(`
				document.getElementById("resetProxy").remove();
			`);
		}

		HostManager.errorWindow.show();

		console.log(code, desc);

		return;
	});

	/*
		The content security policy needs to be replaced to be able to interact with GIF services
	*/

	HostManager.mainWindow?.webContents?.session.webRequest.onHeadersReceived(
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
				"object-src 'self' https:; script-src 'self' 'unsafe-eval' https://moderndeck.app moderndeck: https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com blob:; "+
				"style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck: blob:;"];
			callback({ responseHeaders: foo});
		}
	);


	HostManager.mainWindow?.webContents?.session?.webRequest?.onBeforeSendHeaders?.({urls:["https://twitter.com/i/jot*", "https://tweetdeck.twitter.com/Users*"]}, (_details: Electron.OnBeforeSendHeadersListenerDetails, callback: (beforeSendResponse: Electron.BeforeSendResponse) => void) => {
		callback({cancel: true})
	})

	// HostManager.mainWindow?.webContents?.session.webRequest.onHeadersReceived(
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

	// Update the proxy before attempting to load the page
	updateProxy();

	try {
		HostManager.mainWindow.webContents.loadURL("https://tweetdeck.twitter.com");
	} catch(e) {
		console.error(e)
	}

	updateProxy();

	/*

		Web content requests to navigate away from page.

		If this is not a TweetDeck URL, we will instead pass
		it on to the browser, unless...

		...if it is a Twitter URL, we pop it up in a login Window.

	*/

	HostManager.mainWindow?.webContents?.on?.("will-navigate", (event: Electron.Event, url: string) => {

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

	HostManager.mainWindow?.webContents?.on?.("new-window", (event: Electron.NewWindowWebContentsEvent, url: string) => {
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
				HostManager.mainWindow?.webContents?.send("failedOpenUrl");
			})
		}

		return event.newGuest;

	});

	// i actually forget why this is here

	HostManager.mainWindow?.webContents?.on?.("context-menu", (_event: Electron.Event, params: Electron.ContextMenuParams) => {
		HostManager.mainWindow?.webContents?.send("context-menu", params);
	});

	ipcMain.on("getDesktopConfig", () => {
		HostManager.mainWindow?.webContents?.send("desktopConfig", desktopConfig);
	});

	ipcMain.on("focus", () => {
		console.log("Focus!");
		HostManager.mainWindow?.focus?.();
	});

	ipcMain.on("changeProxy", () => {
		updateProxy();
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
		HostManager.shouldQuitIfErrorClosed = false;
		HostManager.mainWindow.reload();
		HostManager.mainWindow.show();
		HostManager.errorWindow.close();
	});

	ipcMain.on("resetProxy", () => {
		store.set(SettingsKey.PROXY_MODE, ProxyMode.AUTODETECT);
		updateProxy();
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
				HostManager.mainWindow?.webContents?.send("settingsReceived", JSON.parse(load));
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
				HostManager.mainWindow?.webContents?.send("tweetenSettingsReceived", JSON.parse(load));
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

		HostManager.mainWindow?.webContents?.executeJavaScript("document.querySelector(\"html\").classList.add(\"mtd-drawer-open\");");
	});

	ipcMain.on("drawerClose", () => {
		console.log("close");

		HostManager.mainWindow?.webContents?.executeJavaScript("document.querySelector(\"html\").classList.remove(\"mtd-drawer-open\");");
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
		HostManager.mainWindow?.webContents?.copy?.();
	});

	ipcMain.on("cut", () => {
		HostManager.mainWindow?.webContents?.cut?.();
	});

	ipcMain.on("paste", () => {
		HostManager.mainWindow?.webContents?.paste?.();
	});

	ipcMain.on("delete", () => {
		HostManager.mainWindow?.webContents?.delete?.();
	});

	ipcMain.on("selectAll", () => {
		HostManager.mainWindow?.webContents?.selectAll?.();
	});

	ipcMain.on("undo", () => {
		HostManager.mainWindow?.webContents?.undo?.();
	});

	ipcMain.on("redo", () => {
		HostManager.mainWindow?.webContents?.redo?.();
	});

	ipcMain.on("copyImage", (_event: Electron.IpcMainEvent, arg: { x: number, y: number}) => {
		HostManager.mainWindow?.webContents?.copyImageAt?.(arg.x, arg.y);
	});

	ipcMain.on("saveImage", (_event: Electron.IpcMainEvent, arg: string) => {
		saveImageAs(arg);
	});

	ipcMain.on("inspectElement", (_event: Electron.IpcMainEvent, arg: { x: number, y: number}) => {
		HostManager.mainWindow?.webContents?.inspectElement?.(arg.x, arg.y);
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
		HostManager.closeForReal = true;
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
		HostManager.isRestarting = true;

		if (HostManager.mainWindow) {
			HostManager.closeForReal = true;
			HostManager.mainWindow.close();
		}

		store.set(SettingsKey.NATIVE_TITLE_BAR, arg);

		setTimeout(exitFully, 100);

	});

	HostManager.mainWindow.on("close", (event: Electron.Event) => {
		if (HostManager.enableBackground && !HostManager.closeForReal) {
			event.preventDefault();
			HostManager.mainWindow.hide();
			HostManager.mainWindowHidden = true;

			// If tray disabled, show tray only if background is enabled
			if (!HostManager.enableTray && process.platform !== "darwin") {
				makeTray();
			}
		}
	})

	// Enable tray icon
	ipcMain.on("enableTray", (_event: Electron.IpcMainEvent) => {
		HostManager.enableTray = true;
		makeTray();
	});

	// Disable tray icon
	ipcMain.on("disableTray", (_event: Electron.IpcMainEvent) => {
		HostManager.enableTray = false;
		destroyTray();
	});

	// Enable background notifications
	ipcMain.on("enableBackground", (_event: Electron.IpcMainEvent) => {
		HostManager.enableBackground = true;
	});

	// Disable background notifications
	ipcMain.on("disableBackground", (_event: Electron.IpcMainEvent) => {
		HostManager.enableBackground = false;
	});

	ipcMain.on("start-external-server", (_event: Electron.IpcMainEvent) => {
		// startExternalLoginServer();
	})

	ipcMain.on("beam-external-login-to-browser", (_event: Electron.IpcMainEvent) => {
		const { shell } = require("electron");
		shell.openExternal("https://tweetdeck.twitter.com/?moderndeck_external_login=1");
	})

	// Upon closing, set HostManager.mainWindow to null
	HostManager.mainWindow.on("closed", () => {
		HostManager.mainWindow = null;
	});

	// Change maximise to restore size window
	HostManager.mainWindow.on("maximize", () => {
		HostManager.mainWindow?.webContents?.executeJavaScript?.('\
			document.querySelector("html").classList.add("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3E0";\
		');
	});

	// Change restore size window to maximize
	HostManager.mainWindow.on("unmaximize", () => {
		HostManager.mainWindow?.webContents?.executeJavaScript?.('\
			document.querySelector("html").classList.remove("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3C6";\
		');
	});

	if (store.get(SettingsKey.MAXIMIZED)) {
		HostManager.mainWindow?.maximize?.();
	}

	/*
		Upon entering full screen, remove app-specific CSS Classes,
		as there is less reason for a huge drag bar in full screen,
		at least in comparison to in windowed. Chrome itself does this too.
	*/
	HostManager.mainWindow.on("enter-full-screen", () => {
		HostManager.mainWindow?.webContents?.executeJavaScript?.('document.querySelector("html").classList.remove("mtd-app");\
			document.querySelector("html").classList.remove("mtd-app-win");\
			document.querySelector("html").classList.remove("mtd-app-mac");\
			document.querySelector("html").classList.remove("mtd-app-linux");\
		');
	});

	if (store.get(SettingsKey.FULL_SCREEN)) {
		HostManager.mainWindow?.webContents?.executeJavaScript?.('document.querySelector("html").classList.remove("mtd-app");');
		HostManager.mainWindow?.setFullScreen?.(true)
	}

	HostManager.mainWindow.on("leave-full-screen", () => {
		store.set(SettingsKey.FULL_SCREEN, false);
		updateAppTag();
	});

	updateAppTag();
}



export const getWebContents = () => {
	if (HostManager.mainWindow) {
		return HostManager.mainWindow.webContents;
	}
	return null;
}
