/*
	main.js
	Copyright (c) 2019 dangeredwolf
	Released under the MIT licence

	made with love <3

*/

const electron = require("electron");

const {
	app,
	BrowserWindow,
	ipcMain,
	session,
	systemPreferences,
	Menu,
	dialog,
	protocol
}		= require("electron");

const imageType = require("file-type");
const fs = require("fs");
const path = require("path");
const url = require("url");
const util = require("util");
const through2 = require("through2");

const log = require("electron-log");

const { autoUpdater } = require("electron-updater");

const Store = require("electron-store");
const store = new Store({name:"mtdsettings"});

/*
	Note: Due to a bug in electron, process.windowsStore is undefined even for AppX distributions
	https://github.com/electron/electron/issues/18161
*/

const isAppX = !!process.windowsStore;

const isMAS = !!process.mas;

const isDev = false;

let mainWindow;

let isRestarting = false;

let mtdAppTag = '';

autoUpdater.setFeedURL({
	"owner": "dangeredwolf",
	"repo": "ModernDeck",
	"provider": "github"
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

app.setAppUserModelId("com.dangeredwolf.ModernDeck");

const mtdSchemeHandler = async (request, callback) => {
	let myUrl = new url.URL(request.url);
	const filePath = path.join(electron.app.getAppPath(), "ModernDeck", myUrl.hostname, myUrl.pathname);

	callback({
		path: filePath
	});
};

const template = [
	{
		label: "ModernDeck",
		role: "appMenu",
		submenu: [
			{ label: "About ModernDeck...", click(){ if (!mainWindow){return;}mainWindow.send("aboutMenu"); } },
			{ type: "separator" },
			{ label: "Preferences...", click(){ if (!mainWindow){return;}mainWindow.send("openSettings"); } },
			{ label: "Accounts...", click(){ if (!mainWindow){return;}mainWindow.send("accountsMan"); } },
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
		label: "File",
		role: "fileMenu",
		submenu: [
			{ label: "New Tweet...", click(){ if (!mainWindow){return;}mainWindow.send("newTweet"); } },
			{ label: "New Direct Message...", click(){ if (!mainWindow){return;}mainWindow.send("newDM"); } },
			{ type: "separator" },
			{ role: "close" }
		]
	},
	{
		label: "Edit",
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
		label: "View",
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
		label: "Window",
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
			{ label: "Send Feedback", click(){ if (!mainWindow){return;}mainWindow.send("sendFeedback");}},
			{ label: "Message @ModernDeck", click(){ if (!mainWindow){electron.shell.openExternal("https://twitter.com/messages/compose?recipient_id=2927859037");return;}mainWindow.send("msgModernDeck"); } },
		]
	}
]


const menu = Menu.buildFromTemplate(template);

if (process.platform === 'darwin')
	Menu.setApplicationMenu(menu);


function makeLoginWindow(url,teams) {

	let originalUrl = url;

	let loginWindow = new BrowserWindow({
		width: 710,
		height: 490,
		webPreferences: {
			nodeIntegration: true
		},
		scrollBounce:true,
		autoHideMenuBar:true,
		icon:__dirname+"ModernDeck/sources/favicon.ico",
	});

	loginWindow.on('closed', () => {
		loginWindow = null;
	});

	loginWindow.webContents.on("will-navigate", (event, url) => {

		console.log(url);
		const { shell } = electron;

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0 && !teams) {
			if (url.indexOf("https://tweetdeck.twitter.com/web/success.html") < 0) {
				mainWindow.loadURL(url);
			}
			loginWindow.close();
			event.preventDefault();
			return;
		}

		if (url.indexOf("https://twitter.com/?logout") >= 0) {
			mainWindow.reload();
			loginWindow.close();
			event.preventDefault();
			return;
		}

		if (url.indexOf("https://twitter.com/logout") >= 0 || url.indexOf("https://twitter.com/login") >= 0 || teams) {
			return;
		}

		if (url.indexOf("https://twitter.com/account") >= 0 || url.indexOf("https://twitter.com/signup") >= 0) {
			shell.openExternal(url);
			event.preventDefault();
			return;
		}

		event.preventDefault();
	});

	loginWindow.webContents.on("did-navigate-in-page", (event, url) => {
		console.log(url);

		if (url.indexOf("https://tweetdeck.twitter.com") >= 0) {
			mainWindow.loadURL(url);
			loginWindow.close();
			event.preventDefault();
			return;
		}

		if (url.indexOf("https://twitter.com/logout") >= 0 || url.indexOf("https://twitter.com/login") >= 0) {
			return;
		}
		loginWindow.loadURL(originalUrl);
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

	const pipePromise = (source, outputPath) => {
		if (!outputPath) {
			return Promise.resolve();
		}

		const stream = source.pipe(fs.createWriteStream(outputPath));

		return new Promise((resolve, reject) => {
			stream.on("finish", resolve);
			stream.on("error", reject);
		});
	};

	let path = url.match(/(([A-z0-9_\-])+\w+\.[A-z0-9]+)/g);
	path = path[1];

	const getOutputPath = (ext) => {
		return dialog.showSaveDialog({ defaultPath: path });
	};

	const got = require("got");

	const promise = new Promise(resolve => {
		let resolved;

		const stream = got.stream(url).pipe(
			through2(function(chunk, enc, callback) {
				if (!resolved) {
					resolve({ ext: imageType(chunk).ext, stream });
					resolved = true;
				}

				this.push(chunk);
				callback();
			}
		));
	});

	return promise
	.then(result => pipePromise(result.stream, getOutputPath(result.ext)));

};

// we should make use of this soon

function saveWindowBounds() {
	let bounds = mainWindow.getBounds();

	store.set("fullscreen", mainWindow.isFullScreen());
	store.set("maximised", mainWindow.isMaximized());
	store.set("windowBounds", mainWindow.getBounds());

	const matchedDisplay = electron.screen.getDisplayMatching({
		x: bounds.x,
		y: bounds.y,
		width: bounds.width,
		height: bounds.height
	});

	store.set("usedDisplay", matchedDisplay.id);
}


function makeWindow() {

	let display = {};

	if (!store.has("mtd_nativetitlebar")) {
		store.set("mtd_nativetitlebar",false);
	}

	let devTron;

	try {
		devTron = require("devtron");
	} catch (e) {
		// ¯\_(ツ)_/¯
	} finally {
		if (devTron) {
			devTron.install();
		}
	}

	protocol.registerFileProtocol("moderndeck", mtdSchemeHandler);

	isRestarting = false;

	let useFrame = store.get("mtd_nativetitlebar") || process.platform === "darwin";
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

	mainWindow = new BrowserWindow({
		width: 975,
		height: 650,
		webPreferences: {
			nodeIntegration: true
		},
		scrollBounce:true,
		autoHideMenuBar:true,
		title:"ModernDeck",
		icon:__dirname+"ModernDeck/sources/favicon.ico",
		frame:useFrame,
		titleBarStyle:titleBarStyle,
		minWidth:400,
		show:false,
		enableRemoteModule:true,
		backgroundColor:"#263238"
	});

	// macOS specific: Don't run from DMG, move to Applications folder.

	if (process.platform === "darwin" && !app.isInApplicationsFolder() && !isDev) {
		const { dialog } = electron;

		dialog.showMessageBox({
			type: "warning",
			title: "ModernDeck",
			message: "Updates might not work correctly if you don't run ModernDeck from the Applications folder. Would you like to move it there?",
			buttons: ["Not now", "Yes, move it"]
		}, (response) => {
			if (response == 1) {
				let moveMe = app.moveToApplicationsFolder();
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
	})

	mainWindow.show();

	// Here, we add platform-specific tags to html, to help moderndeck CSS know what to do

	mtdAppTag += 'document.querySelector("html").classList.add("mtd-js-app");\n';

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

	mainWindow.webContents.on('dom-ready', (event, url) => {
		mainWindow.webContents.executeJavaScript(
			mtdAppTag + '\
			var injurl = document.createElement("div");\
			injurl.setAttribute("type","moderndeck://");\
			injurl.id = "MTDURLExchange";\
			document.head.appendChild(injurl);\
			\
			var InjectScript2 = document.createElement("script");\
			InjectScript2.src = "https://cdn.ravenjs.com/3.19.1/raven.min.js";\
			InjectScript2.type = "text/javascript";\
			document.head.appendChild(InjectScript2);\
			\
			var injStyles = document.createElement("link");\
			injStyles.rel = "stylesheet";\
			injStyles.href = "moderndeck://sources/moderndeck.css";\
			document.head.appendChild(injStyles);\
			\
			var InjectScript = document.createElement("script");\
			InjectScript.src = "moderndeck://sources/MTDinject.js";\
			InjectScript.type = "text/javascript";\
			document.head.appendChild(InjectScript);\
			');
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
				"default-src 'self'; connect-src * moderndeck:; font-src https: blob: data: * moderndeck:; frame-src https: moderndeck:; frame-ancestors 'self' https: moderndeck:; img-src https: data: moderndeck:; media-src * moderndeck: blob: https:; object-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://c6.patreon.com https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com moderndeck: https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com blob:; style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck: blob:;"];
			callback({ responseHeaders: foo});
		}
	);

	/*
		Block original tweetdeck css bundle, just in case. Plus, it saves bandwidth.
		We also replace twitter card CSS to make those look pretty
	*/

	mainWindow.webContents.session.webRequest.onBeforeRequest({urls:["https://ton.twimg.com/*"]}, (details,callback) => {

		if (details.url.indexOf(".css") > -1 && (details.url.indexOf("bundle") > -1 && details.url.indexOf("dist") > -1)) {
			callback({cancel:true});
			return;
		}

		if (details.url.indexOf(".css") > -1 && details.url.indexOf("tfw") > -1 && details.url.indexOf("css") > -1 && details.url.indexOf("tweetdeck_bundle") > -1) {
			callback({redirectURL:"moderndeck://sources/csscomponents/twittercard.css"});
			return;
		}

		callback({cancel:false});
	});

	// this is pretty self-explanatory
	mainWindow.loadURL("https://tweetdeck.twitter.com");


	/*

		Web content requests to navigate away from page.

		If this is not a TweetDeck URL, we will instead pass
		it on to the browser, unless...

		...if it is a Twitter URL, we pop it up in a login Window.

	*/

	mainWindow.webContents.on("will-navigate", (event, url) => {
		const { shell } = electron;
		console.log(url);
		if (url.indexOf("https://tweetdeck.twitter.com") < 0) {
			event.preventDefault();
			console.log(url);
			if (url.indexOf("https://twitter.com/login") >= 0 || url.indexOf("https://twitter.com/logout") >= 0) {
				console.log("this is a login window! will-navigate");
				event.newGuest = makeLoginWindow(url,false);
			} else {
				shell.openExternal(url);
			}
		}
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
		} else if (url.indexOf("https://twitter.com/login") >= 0 || url.indexOf("https://twitter.com/logout") >= 0) {
			console.log("this is a login non-teams window! new-window");
			event.newGuest = makeLoginWindow(url,false);
		} else {
			shell.openExternal(url);
		}

		return event.newGuest;

	});

	// i actually forget why this is here

	mainWindow.webContents.on("context-menu", (event, params) => {
		mainWindow.send("context-menu", params);
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

	ipcMain.on("maximizeButton", (event) => {
		let window = BrowserWindow.getFocusedWindow();

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
		mainWindow.webContents.copy();
	});

	ipcMain.on("cut", (event) => {
		mainWindow.webContents.cut();
	});

	ipcMain.on("paste", (event) => {
		mainWindow.webContents.paste();
	});

	ipcMain.on("delete", (event) => {
		mainWindow.webContents.delete();
	});

	ipcMain.on("selectAll", (event) => {
		mainWindow.webContents.selectAll();
	});

	ipcMain.on("undo", (event) => {
		mainWindow.webContents.undo();
	});

	ipcMain.on("redo", (event) => {
		mainWindow.webContents.redo();
	});

	ipcMain.on("copyImage", (event,arg) => {
		mainWindow.webContents.copyImageAt(arg.x,arg.y);
	});

	ipcMain.on("saveImage", (event,arg) => {
		saveImageAs(arg);
	});

	ipcMain.on("inspectElement", (event,arg) => {
		mainWindow.webContents.inspectElement(arg.x,arg.y);
	});

	// mtdInject initiated app restart

	ipcMain.on("restartApp", (event,arg) => {
		setTimeout(() => {
			app.relaunch();
			app.exit();
		},100);
	});

	// mtdInject initiated app restart, after user clicks to restart to install updates

	ipcMain.on("restartAndInstallUpdates", (event,arg) => {
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
				app.relaunch();
				app.exit();
			},500);
		});


	});

	// Changing from immersive titlebar to native

	ipcMain.on("setNativeTitlebar", (event,arg) => {

		isRestarting = true;

		mainWindow.close();
		store.set("mtd_nativetitlebar",arg);

		setTimeout(() => {
			app.relaunch();
			app.exit();
		},100);

	});

	// Before closing, save window bounds

	mainWindow.on("close", () => {
		saveWindowBounds();
	});

	// Upon closing, set mainWindow to null

	mainWindow.on("closed", () => {
		mainWindow = null;
	});

	// Change maximise to restore size window

	mainWindow.on("maximize", () => {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.add("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3E0";\
		');
	});

	// Change restore size window to maximise

	mainWindow.on("unmaximize", () => {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.remove("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3C6";\
		');
	});

	/*
		Upon entering full screen, remove app-specific CSS Classes,
		as there is less reason for a huge drag bar in full screen,
		at least in comparison to in windowed. Chrome itself does this too.
	*/

	mainWindow.on("enter-full-screen", () => {
		mainWindow.webContents.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");\
			document.querySelector("html").classList.remove("mtd-app-win");\
			document.querySelector("html").classList.remove("mtd-app-mac");\
			document.querySelector("html").classList.remove("mtd-app-linux");\
		');
	});

	mainWindow.on("leave-full-screen", () => {
		mainWindow.webContents.executeJavaScript(mtdAppTag);
	});
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

app.on("ready", makeWindow);

// After all windows are closed, we can quit, unless restarting for update

app.on("window-all-closed", () => {
	if (isRestarting) {
		return;
	}
	app.quit();
});

// Make window if it doesn't exist, if user clicks app icon

app.on("activate", () => {
	if (mainWindow === null)
		makeWindow();
});

// Tell mtdInject that there was an update error

autoUpdater.on("error", (e,f,g) => {
	if (!mainWindow || !mainWindow.webContents){
		return;
	}
	mainWindow.webContents.send("error",e,f,g);
});

// Let MTDinject know that we are...

// ... actively checking for updates

autoUpdater.on("checking-for-update", (e) => {
	if (!mainWindow || !mainWindow.webContents){
		return;
	}
	mainWindow.webContents.send("checking-for-update",e);
});

// ...currently downloading updates
autoUpdater.on("download-progress", (e) => {
	if (!mainWindow || !mainWindow.webContents){
		return;
	}
	mainWindow.webContents.send("download-progress",e);
});

// ...have already downloaded updates
autoUpdater.on("update-downloaded", (e) => {
	if (!mainWindow || !mainWindow.webContents){
		return;
	}
	mainWindow.webContents.send("update-downloaded",e);
});

// ...haven't found any updates
autoUpdater.on("update-not-available", (e) => {
	if (!mainWindow || !mainWindow.webContents){
		return;
	}
	mainWindow.webContents.send("update-not-available",e);
});

// mtdInject can send manual update check requests
ipcMain.on("checkForUpdates", (e) => {
	autoUpdater.checkForUpdates();
});

// Main -> Beta and vice versa
ipcMain.on("changeChannel", (e) => {
	autoUpdater.allowPrerelease = store.get("mtd_updatechannel") === "beta";
	autoUpdater.channel = store.get("mtd_updatechannel");
});

// OS inverted colour scheme (high contrast) mode changed. We automatically respond to changes for accessibility

systemPreferences.on("inverted-color-scheme-changed", (e,v) => {
	mainWindow.webContents.send("inverted-color-scheme-changed",v);
});

if (process.platform === 'darwin') {
	systemPreferences.subscribeNotification(
		'AppleInterfaceThemeChangedNotification',
			mainWindow.webContents.send("color-scheme-changed",systemPreferences.isDarkMode() ? "dark" : "light");
		}
	)
}

setInterval(() => {
	autoUpdater.checkForUpdates();
},1000*60*15); //check for updates once every 15 minutes

setTimeout(() => {
	autoUpdater.checkForUpdates();

	mainWindow.webContents.send(
		"inverted-color-scheme-changed",
		systemPreferences.isInvertedColorScheme()
	);
},10000);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
