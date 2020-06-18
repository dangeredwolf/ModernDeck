/*
	main.js
	Copyright (c) 2014-2020 dangeredwolf
	Released under the MIT licence

	made with love <3

*/

const electron = require("electron");

const {
	app,
	BrowserWindow,
	BrowserView,
	ipcMain,
	session,
	systemPreferences,
	Menu,
	dialog,
	nativeTheme,
	nativeImage,
	protocol,
	Tray
}		= require("electron");

const fs = require("fs");
const path = require("path");
const url = require("url");
const util = require("util");

const separator = process.platform === "win32" ? "\\" : "/";

const packagedUsesDifferentDir = false;

const log = require("electron-log");

const { autoUpdater } = require("electron-updater");

const Store = require("electron-store");
const store = new Store({name:"mtdsettings"});

// const disableCss = false; // use storage.mtd_safemode

const isAppX = !!process.windowsStore;

const isMAS = !!process.mas;

const isDev = false;

let enableTray = true;
let enableBackground = true;

let hidden = false;
let mainWindow;
let tray = null;
let mR;

let isRestarting = false;
let closeForReal = false;
let interval;

let mtdAppTag = '';

autoUpdater.setFeedURL({
	"owner": "dangeredwolf",
	"repo": "ModernDeck",
	"provider": "github"
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

app.setAppUserModelId("com.dangeredwolf.ModernDeck");

let useDir = "common";

const mtdSchemeHandler = async (request, callback) => {
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
			{ label: "About ModernDeck", click() { if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("aboutMenu"); } },
			{ label: "Check for Updates...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("checkForUpdatesMenu"); } },
			{ type: "separator" },
			{ label: "Preferences...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("openSettings"); } },
			{ label: "Accounts...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("accountsMan"); } },
			{ type: "separator" },
			{ role: "services" },
			{ type: "separator" },
			{ role: "hide" },
			{ role: "hideothers" },
			{ role: "unhide" },
			{ type: "separator" },
			{ label: "Quit ModernDeck", click(){ console.log("it's time to quit NOW"); closeForReal = true; app.quit(); } }
		]
	},
	{
		role: "fileMenu",
		submenu: [
			{ label: "New Tweet...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("newTweet"); } },
			{ label: "New Direct Message...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("newDM"); } },
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
				label: "Speech",
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
			{ label: "Send Feedback", click(){ electron.shell.openExternal("https://github.com/dangeredwolf/ModernDeck/issues");}},
			{ label: "Message @ModernDeck", click(){ if (!mainWindow){electron.shell.openExternal("https://twitter.com/messages/compose?recipient_id=2927859037");return;}mainWindow.show();mainWindow.webContents.send("msgModernDeck"); } },
		]
	}
]


const menu = Menu.buildFromTemplate(template);

if (process.platform === "darwin")
	Menu.setApplicationMenu(menu);

/*try {
	if (require('electron-squirrel-startup')) return app.quit();
} catch(e) {
	console.error(e);
}*/


function makeLoginWindow(url,teams) {

	let originalUrl = url;

	let loginWindow = new BrowserWindow({
		width: 710,
		height: 490,
		webPreferences: {
			nodeIntegration: false
		},
		parent:mainWindow || null,
		scrollBounce:true,
		autoHideMenuBar:true
	});

	loginWindow.on('closed', () => {
		loginWindow = null;
	});

	loginWindow.webContents.on("will-navigate", (event, url) => {

		console.log(url);
		const { shell } = electron;

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0 && !teams) {
			console.log("Hello tweetdeck!");
			if (loginWindow) {
				loginWindow.close();
			}
			if (mainWindow) {
				mainWindow.reload();
			}
			event.preventDefault();
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0) {
			console.log("Hello logout!");
			if (mainWindow) {
				mainWindow.reload();
			}
			if (loginWindow) {
				loginWindow.close();
			}
			event.preventDefault();
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0 || url.indexOf("twitter.com/login") >= 0 || teams) {
			return;
		}

		if (url.indexOf("twitter.com/account") >= 0 || url.indexOf("twitter.com/signup") >= 0) {
			shell.openExternal(url);
			event.preventDefault();
			return;
		}

		event.preventDefault();
	});

	loginWindow.webContents.on("did-navigate-in-page", (event, url) => {
		console.log(url);



		if (url.indexOf("https://tweetdeck.twitter.com") >= 0) {
			console.log("Hello tweetdeck2!");
			if (mainWindow) {
				mainWindow.loadURL(url);
			}
			if (loginWindow) {
				loginWindow.close();
			}
			event.preventDefault();
			return;
		}

		if (url.indexOf("twitter.com/logout") >= 0 || url.indexOf("twitter.com/login") >= 0) {
			return;
		}

		if (loginWindow) {
			loginWindow.loadURL(originalUrl);
		}
	});

	loginWindow.webContents.on("new-window", (event, url) => {
		const {shell} = electron;
		shell.openExternal(url);
	});

	loginWindow.loadURL(url);

	return loginWindow;

}


function saveImageAs(url) {
	if (!url) {
		throw "saveImageAs requires \"URL\" as an argument";
		return;
	}

	let fileType = url.match(/(?<=format=)(\w{3,4})|(?<=\.)(\w{3,4}(?=\?))/g)[0] || "file";
	let fileName = url.match(/(?<=media\/)[\w\d_\-]+|[\w\d_\-]+(?=\.m)/g)[0] || "jpg";

	console.log("saveImageAs");

	let savePath = dialog.showSaveDialogSync({defaultPath:fileName + "." + fileType});
	console.log(savePath);
	if (savePath) {
		try {
			const https = require("https");
			const fs = require("fs");

			const file = fs.createWriteStream(savePath);
			const request = https.get(url, function(response) {
				console.log("Piping file...");
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


function makeWindow() {

	const lock = app.requestSingleInstanceLock();

	if (!lock) {
		closeForReal = true;
		app.quit();
		return;
	}

	let display = {};

	if (!store.has("mtd_nativetitlebar")) {
		store.set("mtd_nativetitlebar",false);
	}

	protocol.registerFileProtocol("moderndeck", mtdSchemeHandler);

	isRestarting = false;

	let useFrame = store.get("mtd_nativetitlebar") || store.get("mtd_safemode") || process.platform === "darwin";
	let titleBarStyle = "hidden";

	if (store.get("mtd_nativetitlebar") && process.platform === "darwin") {
		titleBarStyle = "default";
	}

	if (store.has("mtd_updatechannel")) {
		if (store.get("mtd_updatechannel") === "beta") {
			autoUpdater.allowPrerelease = true;
		}
		autoUpdater.channel = store.get("mtd_updatechannel");
	}

	let bounds = store.get("mtd_windowBounds") || {};
	let useXY = !!bounds.x && !!bounds.y

	mainWindow = new BrowserWindow({
		width: bounds.width || 1024,
		height: bounds.height || 660,
		x: useXY ? bounds.x : undefined,
		y: useXY ? bounds.y : undefined,
		webPreferences: {
			defaultFontFamily:"Roboto",
			nodeIntegration: true,
			contextIsolation: false,
			webgl: false,
			plugins: false,
			scrollBounce:true,
			webviewTag:true,
			nodeIntegrationInSubFrames:true
			// preload: __dirname+separator+useDir+separator+"resources"+separator+"moderndeck.js"
		},
		autoHideMenuBar:true,
		nodeIntegrationInSubFrames:false,
		title:"ModernDeck",
		// icon:__dirname+useDir+"/resources/favicon.ico",
		frame:useFrame,
		titleBarStyle:titleBarStyle,
		minWidth:375,
		show:false,
		enableRemoteModule:true,
		backgroundThrottling:true,
		backgroundColor:"#263238"
	});

	// macOS specific: Don't run from DMG, move to Applications folder.

	if (process.platform === "darwin" && !app.isInApplicationsFolder() && !isDev) {
		const { dialog } = electron;

		dialog.showMessageBox({
			type: "warning",
			title: "ModernDeck",
			message: "Updates might not work correctly if you aren't running ModernDeck from the Applications folder.\n\nWould you like to move it there?",
			buttons: ["Not Now", "Yes, Move It"]
		}, (response) => {
			if (response == 1) {
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
						message: "We couldn't automatically move ModernDeck to the applications folder. You may need to move it yourself.",
						buttons: ["OK"]
					});
				}
			}
		});

	}

	// Prevent changing the Page Title

	mainWindow.on("page-title-updated", (event,url) => {
		event.preventDefault();
	});

	// Save window bounds if it's closed, or otherwise occasionally

	mainWindow.on("close",(e) => {
		setTimeout(saveWindowBounds,0);
	});

	setInterval(saveWindowBounds,60 * 1000);

	mainWindow.show();

	hidden = false;

	updateAppTag();

	try {
		mainWindow.webContents.executeJavaScript(`document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';`)
	} catch(e) {

	}


	mainWindow.webContents.on('dom-ready', (event, url) => {

		mainWindow.webContents.executeJavaScript(`document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';`)

		mainWindow.webContents.executeJavaScript(
			'\
			var injurl = document.createElement("div");\
			injurl.setAttribute("type","moderndeck://");\
			injurl.id = "MTDURLExchange";\
			document.head.appendChild(injurl);\
			\
			var InjectScript2 = document.createElement("script");\
			InjectScript2.src = "moderndeck://resources/libraries/moduleraid.min.js";\
			InjectScript2.type = "text/javascript";\
			document.head.appendChild(InjectScript2);'
			+
			(store.get("mtd_safemode") ? 'document.getElementsByTagName("html")[0].classList.add("mtd-disable-css");' :
			'var injStyles = document.createElement("link");\
			injStyles.rel = "stylesheet";\
			injStyles.href = "moderndeck://resources/moderndeck.css";\
			document.head.appendChild(injStyles);')
			+
			'var InjectScript = document.createElement("script");\
			InjectScript.src = "moderndeck://resources/moderndeck.js";\
			InjectScript.type = "text/javascript";\
			document.head.appendChild(InjectScript);\
		');

		updateAppTag();

	});

	mainWindow.webContents.on('did-fail-load', (event, code, desc) => {
		let msg = "ModernDeck failed to start.\n\n";

		console.log(desc);

		// These codes aren't necessarily fatal errors, so we ignore them instead of forcing the user to shut down ModernDeck.

		if (code === -3 || code === -11 || code === -2 || code === -1) {
			return;
		}

		/*
			This variable is used to display the chromium error code.

			This isn't necessary for obvious errors, such as ERR_INTERNET_DISCONNECTED,
			so we don't bother showing it in such cases.
		*/

		let addChromiumErrorCode = false;

		if (code === -13 || code === -12) {
			msg += "Your PC ran out of memory trying to start ModernDeck. Try closing some programs or restarting your PC and trying again."
		} else if ((code <= -800 && code >= -900) || code === -137 || code === -105) {
			msg += "We can't connect to Twitter due to a DNS error.\nPlease check your internet connection.";
			addChromiumErrorCode = true;
		} else if (code === -106) {
			msg += "You are disconnected from the Internet. ModernDeck requires an internet connection.";
		} else if (code === -201) {
			msg += "Please check that your PC's date and time are set correctly. Twitter presented us with a security certificate that either expired or not yet valid.\nIf your date and time are correct, check https://api.twitterstat.us to see if there are any problems at Twitter."
		} else if (code === -130 || code === -131 || code === -111 || code === -127 || code === -115 || code === -336) {
			msg += "We can't connect to your internet connection's proxy server."

			if (process.platform === "win32") {
				msg += "\n\nIf you don't need to connect to a proxy server, you can take the following steps on Windows:\n1. Press Windows Key + R to open the Run dialog.\n2. Enter inetcpl.cpl\n3. Go to the Connections tab\n4. Click the LAN settings button near the bottom\n5. Uncheck \"Use a proxy server for your LAN\""
			}

			addChromiumErrorCode = true;
		} else if (code === -22) {
			msg += "Your domain administrator has blocked access to tweetdeck.twitter.com.\nIf your device is owned by an organization, you might need to ask an administrator to unblock it."

			if (process.platform === "win32") {
				msg += "\nIf you are not logged in as part of a domain, you may need to configure your Local Group Policy settings."
			}
		} else if (code === -7 || code === -118) {
			msg += "We can't connect to Twitter because the request timed out.\nPlease check your internet connection.\nIf it still doesn't work, check https://api.twitterstat.us to see if there are any problems at Twitter."
		} else if (code === -29 || code === -107 || (code <= -110 && code >= -117) || code === -123 || (code <= -125 && code >= -129) || code === -134 || code === -135 || code === -141 || (code <= -148 && code >= -153) || code === -156 || code === -159 || code === -164 || code === -167 || code === -172 || code === -175 || (code <= -177 && code >= -181) || (code <= -501 && code >= -504)) {
			msg += "We can't establish a secure connection to Twitter.\nThis may be caused by network interference or a problem at Twitter.\n\nIf it still doesn't work, but other HTTPS websites appear to load (such as google.com), check https://api.twitterstat.us to see if there are any problems at Twitter.";
			addChromiumErrorCode = true;
		} else if (code <= -200 && code >= -220) {
			msg += "We can't establish a secure connection to Twitter.\nThere is a problem with the digital certificate that was presented to us by Twitter.\n\nPlease try again, or if it persists, check https://api.twitterstat.us to see if there are any problems at Twitter.";
			addChromiumErrorCode = true;
		} else if (code <= -1 && code >= -99) {
			msg += "We can't connect to Twitter due to an unexpected system error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -100 && code >= -199) {
			msg += "We can't connect to Twitter due to an unexpected connection error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -200 && code >= -299) {
			msg += "We can't connect to Twitter due to an unexpected certificate error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -300 && code >= -399) {
			msg += "We can't connect to Twitter due to an unexpected protocol error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else if (code <= -400 && code >= -499) {
			msg += "We can't connect to Twitter due to an unexpected caching error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		} else {
			msg += "We can't connect to Twitter due to an unexpected error. Please refer to the error code below.";
			addChromiumErrorCode = true;
		}

		if (addChromiumErrorCode) {
			msg += "\n\n" + desc + " " + code
		}


		console.log(code);

		dialog.showMessageBox(mainWindow,{
			title:"ModernDeck",
			message:msg,
			type:"error",
			buttons:["Retry","Close"]
		}, (response) => {
			if (response === 0) { // Retry
				mainWindow.reload();
			} else if (response === 1) { // Close
				closeForReal = true;
				mainWindow.close();
			}
		});
		return;
	});

	/*
		We need to replace the content security policy in order to load any third-party content, including JS, CSS, fonts
	*/

	mainWindow.webContents.session.webRequest.onHeadersReceived(
		{urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]},
		(details, callback) => {
			let foo = details.responseHeaders;
			foo["content-security-policy"] =[
				"default-src 'self'; connect-src * moderndeck:; font-src https: blob: data: * moderndeck:; frame-src https: moderndeck:; frame-ancestors 'self' https: moderndeck:; img-src https: data: blob: moderndeck:; media-src * moderndeck: blob: https:; object-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://moderndeck.org https://c6.patreon.com https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com moderndeck: https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com blob:; style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck: blob:;"];
			callback({ responseHeaders: foo});
		}
	);

	// mainWindow.webContents.session.webRequest.onHeadersReceived(
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

	/*
		Block original tweetdeck css bundle, just in case. Plus, it saves bandwidth.
		We also replace twitter card CSS to make those look pretty
	*/

	mainWindow.webContents.session.webRequest.onBeforeRequest({urls:["https://ton.twimg.com/*"]}, (details,callback) => {

		if (details.url.indexOf(".css") > -1 && (details.url.indexOf("bundle") > -1 && details.url.indexOf("dist") > -1) && !store.get("mtd_safemode")) {
			callback({cancel:true});
			return;
		}

		// if (details.url.indexOf(".css") > -1 && details.url.indexOf("tfw") > -1 && details.url.indexOf("css") > -1 && details.url.indexOf("tweetdeck_bundle") > -1) {
		// 	callback({redirectURL:"moderndeck://resources/cssextensions/twittercard.css"});
		// 	return;
		// }

		callback({cancel:false});
	});

	mainWindow.webContents.loadURL("https://tweetdeck.twitter.com");

	/*

		Web content requests to navigate away from page.

		If this is not a TweetDeck URL, we will instead pass
		it on to the browser, unless...

		...if it is a Twitter URL, we pop it up in a login Window.

	*/

	mainWindow.webContents.on("will-navigate", (event, url) => {

		const { shell } = electron;
		console.log(url);

		if (url.indexOf("https://tweetdeck.twitter.com") < 0 && url.indexOf("moderndeck://.") < 0) {
			event.preventDefault();
			console.log(url);
			if (url.indexOf("twitter.com/login") >= 0 || url.indexOf("twitter.com/logout") >= 0) {
				console.log("this is a login window! will-navigate");
				event.newGuest = makeLoginWindow(url,false);
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

	mainWindow.webContents.on("new-window", (event, url) => {
		const { shell } = electron;
		event.preventDefault();
		console.log(url);

		if (url.indexOf("https://twitter.com/teams/authorize") >= 0) {
			console.log("this is a login teams window! new-window");
			event.newGuest = makeLoginWindow(url,true);
		} else if (url.indexOf("twitter.com/login") >= 0 || url.indexOf("twitter.com/logout") >= 0) {
			console.log("this is a login non-teams window! new-window");
			event.newGuest = makeLoginWindow(url,false);
		} else {
			shell.openExternal(url);
		}

		return event.newGuest;

	});

	// i actually forget why this is here

	mainWindow.webContents.on("context-menu", (event, params) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.send("context-menu", params);
	});

	/*
		If a user uses native context menus, this is mtdInject telling us
		to put up a native context menu with the given commands, instead
		of it doing it itself.
	*/

	ipcMain.on("nativeContextMenu", (event, params) => {
		console.log(params);
		let newMenu = Menu.buildFromTemplate(params);
		console.log(newMenu);
		newMenu.popup();
	});

	ipcMain.on("drawerOpen", (event, params) => {
		console.log("open");

		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.executeJavaScript("document.querySelector(\"html\").classList.add(\"mtd-drawer-open\");");
	});

	ipcMain.on("drawerClose", (event, params) => {
		console.log("close");

		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.executeJavaScript("document.querySelector(\"html\").classList.remove(\"mtd-drawer-open\");");
	});


	ipcMain.on("maximizeButton", (event) => {
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

	ipcMain.on("minimize", (event) => {
		BrowserWindow.getFocusedWindow().minimize();
	});

	/*
		The options below are for right click menu actions
	*/

	ipcMain.on("copy", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.copy();
	});

	ipcMain.on("cut", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.cut();
	});

	ipcMain.on("paste", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.paste();
	});

	ipcMain.on("delete", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.delete();
	});

	ipcMain.on("selectAll", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.selectAll();
	});

	ipcMain.on("undo", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.undo();
	});

	ipcMain.on("redo", (event) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.redo();
	});

	ipcMain.on("copyImage", (event,arg) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.copyImageAt(arg.x,arg.y);
	});

	ipcMain.on("saveImage", (event,arg) => {
		saveImageAs(arg);
	});

	ipcMain.on("inspectElement", (event,arg) => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.inspectElement(arg.x,arg.y);
	});

	// mtdInject initiated app restart

	ipcMain.on("restartApp", (event,arg) => {
		setTimeout(() => {
			closeForReal = true;
			app.relaunch();
			app.exit();
		},100);
	});

	// mtdInject initiated app restart, after user clicks to restart to install updates

	ipcMain.on("restartAndInstallUpdates", (event,arg) => {
		closeForReal = true;
		autoUpdater.quitAndInstall(false,true);
	});

	// When user elects to erase all of their settings, we wipe everything clean, including caches

	ipcMain.on("destroyEverything", (event,arg) => {
		let ses = session.defaultSession;
		store.clear();
		ses.flushStorageData();
		ses.clearCache(() => {});
		ses.clearHostResolverCache();
		ses.cookies.flushStore(() => {});
		ses.clearStorageData({
			storages:['appcache','cookies','filesystem','indexdb','localstorage','shadercache','websql','serviceworkers'],
			quotas: ['temporary','persistent','syncable']
		},() => {
			setTimeout(() => {
				closeForReal = true;
				app.relaunch();
				app.exit();
			},500);
		});


	});

	// Changing from immersive titlebar to native

	ipcMain.on("setNativeTitlebar", (event,arg) => {

		isRestarting = true;

		if (mainWindow) {
			closeForReal = true;
			mainWindow.close();
		}

		store.set("mtd_nativetitlebar",arg);

		setTimeout(() => {
			closeForReal = true;
			app.relaunch();
			app.exit();
		},100);

	});

	mainWindow.on("close", e => {
		if (enableBackground && !closeForReal) {
			e.preventDefault();
			mainWindow.hide();
			hidden = true;

			// If tray disabled, show tray only if background is enabled
			if (!enableTray && process.platform !== "darwin") {
				makeTray();
			}
		}
	})

	// Enable tray icon

	ipcMain.on("enableTray", (event,arg) => {
		enableTray = true;
		makeTray();
	});

	// Disable tray icon

	ipcMain.on("disableTray", (event,arg) => {
		enableTray = false;
		destroyTray();
	});

	// Enable tray icon

	ipcMain.on("enableBackground", (event,arg) => {
		enableBackground = true;
	});

	// Disable tray icon

	ipcMain.on("disableBackground", (event,arg) => {
		enableBackground = false;
	});

	// Upon closing, set mainWindow to null

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	// Change maximise to restore size window

	mainWindow.on("maximize", () => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.add("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3E0";\
		');
	});

	// Change restore size window to maximise

	mainWindow.on("unmaximize", () => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.remove("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3C6";\
		');
	});

	if (store.get("mtd_maximised")) {
		if (!mainWindow) { return }

		mainWindow.maximize();
	}

	/*
		Upon entering full screen, remove app-specific CSS Classes,
		as there is less reason for a huge drag bar in full screen,
		at least in comparison to in windowed. Chrome itself does this too.
	*/

	mainWindow.on("enter-full-screen", () => {
		if (!mainWindow || !mainWindow.webContents) { return }

		mainWindow.webContents.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");\
			document.querySelector("html").classList.remove("mtd-app-win");\
			document.querySelector("html").classList.remove("mtd-app-mac");\
			document.querySelector("html").classList.remove("mtd-app-linux");\
		');
	});


	if (store.get("mtd_fullscreen")) {
		mainWindow.webContents.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");');
		mainWindow.setFullScreen(true)
	}

	mainWindow.on("leave-full-screen", () => {
		if (!mainWindow || !mainWindow.webContents) { return }

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

	let pathName = __dirname + separator + "common" + separator + "app" + separator + (process.platform === "darwin" ? "macOSTrayTemplate.png" : "Tray.png");

	const image = nativeImage.createFromPath(pathName);
	image.setTemplateImage(true);
	tray = new Tray(pathName);

	const contextMenu = Menu.buildFromTemplate([
		{ label: "Open ModernDeck", click(){ showHiddenWindow() } },
		{ label: (process.platform === "darwin" ? "Preferences..." : "Settings..."), click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("openSettings"); } },
		{ label: "Check for Updates...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("checkForUpdatesMenu"); } },

		{ type: "separator" },

		{ label: "New Tweet...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("newTweet"); } },
		{ label: "New Direct Message...", click(){ if (!mainWindow){return;}mainWindow.show();mainWindow.webContents.send("newDM"); } },

		{ type: "separator" },

		{ label: (process.platform === "darwin" ? "Quit" : "Exit"), click(){ if (!mainWindow){return;} closeForReal = true; mainWindow.close(); } },
	]);

	tray.setToolTip("ModernDeck");
	tray.setContextMenu(contextMenu);

	tray.on("click", () => {
		showHiddenWindow();
	});
}

function destroyTray() {
	if (tray) {
		tray.destroy();
	}
	tray = null;
}

// Register moderndeck:// protocol for accessing moderndeck resources, like CSS

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

// Make window when app is ready

app.on("ready", () => {
	try {
		makeWindow();
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
	if (isRestarting) {
		return;
	}
	app.quit();
});

app.on("quit", () => {
	console.log("aaaadfsfds");
})

app.on("before-quit", () => {
	if (process.platform === "darwin")
		app.quit();
})

// Make window if it doesn't exist, if user clicks app icon

app.on("activate", () => {
	if (mainWindow === null)
		makeWindow();
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

// Tell mtdInject that there was an update error

autoUpdater.on("error", (e,f,g) => {
	if (!mainWindow || !mainWindow || !mainWindow.webContents) {
		return;
	}
	mainWindow.webContents.send("error",e,f,g);
});

// Let moderndeck.js know that we are...

// ... actively checking for updates

autoUpdater.on("checking-for-update", (e) => {
	if (!mainWindow || !mainWindow || !mainWindow.webContents) {
		return;
	}
	mainWindow.webContents.send("checking-for-update",e);
});

// ...currently downloading updates
autoUpdater.on("download-progress", (e) => {
	if (!mainWindow || !mainWindow || !mainWindow.webContents) {
		return;
	}
	mainWindow.webContents.send("download-progress",e);
});

// ...have found an update
autoUpdater.on("update-available", (e) => {
	if (!mainWindow || !mainWindow || !mainWindow.webContents) {
		return;
	}
	mainWindow.webContents.send("update-available",e);
});

// ...have already downloaded updates
autoUpdater.on("update-downloaded", (e) => {
	if (!mainWindow || !mainWindow || !mainWindow.webContents) {
		return;
	}
	mainWindow.webContents.send("update-downloaded",e);
});

// ...haven't found any updates
autoUpdater.on("update-not-available", (e) => {
	if (!mainWindow || !mainWindow || !mainWindow.webContents) {
		return;
	}
	mainWindow.webContents.send("update-not-available",e);
});

// mtdInject can send manual update check requests
ipcMain.on("checkForUpdates", (e) => {
	if (autoUpdater) {
		autoUpdater.checkForUpdates();
	}
});

// Main -> Beta and vice versa
ipcMain.on("changeChannel", (e) => {
	if (autoUpdater) {
		autoUpdater.allowPrerelease = store.get("mtd_updatechannel") === "beta";
		autoUpdater.channel = store.get("mtd_updatechannel");
	}
});

function updateAppTag() {
	mainWindow.webContents.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");\
		document.querySelector("html").classList.remove("mtd-app-win");\
		document.querySelector("html").classList.remove("mtd-app-mac");\
		document.querySelector("html").classList.remove("mtd-app-linux");\
	');

	// Here, we add platform-specific tags to html, to help moderndeck CSS know what to do

	mtdAppTag = 'document.querySelector("html").classList.add("mtd-js-app");\n';

	if (isAppX) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-winstore");\n';
	}

	if (isMAS) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-macappstore");\n';
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

	mainWindow.webContents.executeJavaScript(
		(store.get("mtd_fullscreen") ? 'document.querySelector("html").classList.add("mtd-js-app");' : mtdAppTag)
	)
}

// OS inverted colour scheme (high contrast) mode changed. We automatically respond to changes for accessibility

// nativeTheme.on("updated", (e,v) => {
// 	mainWindow.webContents.send("inverted-color-scheme-changed",nativeTheme.shouldUseInvertedColorScheme);
// 	mainWindow.webContents.send("color-scheme-changed", nativeTheme.shouldUseDarkColors ? "dark" : "light");
// });

systemPreferences.on("inverted-color-scheme-changed", (e,v) => {
	mainWindow.webContents.send("inverted-color-scheme-changed",v);
});

if (process.platform === "darwin") {
	try {
		systemPreferences.subscribeNotification(
			"AppleInterfaceThemeChangedNotification",
			() => {
				if (!mainWindow || !mainWindow.webContents) { return }
				mainWindow.webContents.send("color-scheme-changed", systemPreferences.isDarkMode() ? "dark" : "light");
			}
		)
	} catch(e) {
		console.error(e);
	}
}

setInterval(() => {
	try {
		autoUpdater.checkForUpdates();
	} catch(e) {
		console.error(e);
	}
},1000*60*15); //check for updates once every 15 minutes

setTimeout(() => {
	try {
		autoUpdater.checkForUpdates();

		if (!mainWindow) {
			return;
		}

		mainWindow.webContents.send(
			"inverted-color-scheme-changed",
			systemPreferences.isInvertedColorScheme()//!!nativeTheme.shouldUseInvertedColorScheme
		);
	} catch(e) {
		console.error(e);
	}
}, 5000);
