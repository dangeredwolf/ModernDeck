const electron = require("electron");
const { app, BrowserWindow, ipcMain, session, systemPreferences, Menu, dialog, protocol } = require('electron');

const isDev = true;

const imageType = require('file-type');
const fs = require('fs');
const path = require('path');
const url = require('url');
const util = require('util');
const through2 = require('through2');

const log = require('electron-log');

const { autoUpdater } = require('electron-updater');

const Store = require('electron-store');
const store = new Store({name:"mtdsettings"});

const devBuildExpiration = {year:2019,month:5,day:4}
// months start at 0 for whatever reason, so number is essentially added by 1
const devBuildExpirationActive = false;

let mainWindow;

let updating = false;
let installLater = false;
let showWarning = false;

let isRestarting = false;

let mtdAppTag = '';

autoUpdater.setFeedURL({
	"owner": "dangeredwolf",
	"repo": "ModernDeck",
	"provider": "github"
});

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

let checkDevDate = new Date();

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
		role: 'appMenu',
		submenu: [
			{ label: 'About ModernDeck...', click(){ if (!mainWindow){return;}mainWindow.send("aboutMenu"); } },
			{ type: 'separator' },
			{ label: 'Preferences...', click(){ if (!mainWindow){return;}mainWindow.send("openSettings"); } },
			{ label: 'Accounts...', click(){ if (!mainWindow){return;}mainWindow.send("accountsMan"); } },
			{ type: 'separator' },
			{ role: 'services' },
			{ type: 'separator' },
			{ role: 'hide' },
			{ role: 'hideothers' },
			{ role: 'unhide' },
			{ type: 'separator' },
			{ role: 'quit' }
		]
	},
	{
		label: 'File',
		role: 'fileMenu',
		submenu: [
			{ label: 'New Tweet...', click(){ if (!mainWindow){return;}mainWindow.send("newTweet"); } },
			{ label: 'New Direct Message...', click(){ if (!mainWindow){return;}mainWindow.send("newDM"); } },
			{ type: 'separator' },
			{ role: 'close' }
		]
	},
	{
		label: 'Edit',
		role: 'editMenu',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'delete' },
			{ role: 'selectAll' },
			{ type: 'separator' },
			{
				label: 'Speech',
				submenu: [
					{ role: 'startspeaking' },
					{ role: 'stopspeaking' }
				]
			}
		]
	},
	{
		label: 'View',
		role: 'viewMenu',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ type: 'separator' },
			{ role: 'resetzoom' },
			{ role: 'zoomin' },
			{ role: 'zoomout' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	},
	{
		label: 'Window',
		role: 'windowMenu',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			{ type: 'separator' },
			{ role: 'front' },
			{ type: 'separator' },
			{ role: 'window' }
		]
	},
	{
		role: 'help',
		submenu: [
			{ label: 'Send Feedback', click(){ if (!mainWindow){return;}mainWindow.send("sendFeedback");}},
			{ label: 'Message @ModernDeck', click(){ if (!mainWindow){electron.shell.openExternal("https://twitter.com/messages/compose?recipient_id=2927859037");return;}mainWindow.send("msgModernDeck"); } },
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

	loginWindow.on('closed', function() {
		loginWindow = null;
	});

	loginWindow.webContents.on("will-navigate", function(event, url) {
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

	loginWindow.webContents.on("did-navigate-in-page", function(event, url) {
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

	loginWindow.loadURL(url);

	return loginWindow;

}


function saveImageAs(url) {
	if (!url) {
		throw "hey man where the URL at";
		return;
	}

	function pipePromise(source, outputPath) {
		if (!outputPath) {
			return Promise.resolve();
		}

		const stream = source.pipe(fs.createWriteStream(outputPath));

		return new Promise((resolve, reject) => {
			stream.on('finish', resolve);
			stream.on('error', reject);
		});
	};

	let path = url.match(/(([A-z_\-])+\w+\.[A-z]+)/g);
	path = path[1];

	function getOutputPath(ext) {
		return dialog.showSaveDialog({ defaultPath: path });
	};

	const got = require('got');

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


function saveWindowBounds() {
	var bounds = mainWindow.getBounds();

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


	var display = {};


	if (!store.has("mtd_nativetitlebar")) {
		store.set("mtd_nativetitlebar",false);
	}


	protocol.registerFileProtocol("moderndeck", mtdSchemeHandler);

	isRestarting = false;

	let useFrame = store.get("mtd_nativetitlebar") || process.platform === "darwin";
	let titleBarStyle = "hidden";

	if (store.get("mtd_nativetitlebar") && process.platform === "darwin") {
		titleBarStyle = "default";
	}

	if (store.has("mtd_updatechannel")) {
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
		backgroundColor:'#263238'
	});

	if (devBuildExpirationActive) {
		console.log("\n");
		console.log("Expiration date: "+devBuildExpiration.year + "/" + (devBuildExpiration.month<9?"0"+(devBuildExpiration.month+1) : devBuildExpiration.month+1) + "/" + devBuildExpiration.day);
		console.log("Today's date: "+checkDevDate.getFullYear() + "/" + (checkDevDate.getMonth()<9?"0"+(checkDevDate.getMonth()+1) : checkDevDate.getMonth()+1) + "/" + checkDevDate.getDate())

		if ((!!devBuildExpiration.year && (!!devBuildExpiration.month || devBuildExpiration.month === 0) && !!devBuildExpiration.day) &&
			checkDevDate.getFullYear() > devBuildExpiration.year ||
			(checkDevDate.getMonth() > devBuildExpiration.month && checkDevDate.getFullYear() === devBuildExpiration.year) ||
			(checkDevDate.getDate() >= devBuildExpiration.day && checkDevDate.getMonth() === devBuildExpiration.month && checkDevDate.getFullYear() === devBuildExpiration.year)) {
			dialog.showMessageBox(mainWindow,{
				title:"ModernDeck",
				message:"This development build of ModernDeck has expired. It expired on " + devBuildExpiration.year + "/" + (devBuildExpiration.month<9?"0"+(devBuildExpiration.month+1) : devBuildExpiration.month+1) + "/" + devBuildExpiration.day + ".\n\nPlease uninstall this version of ModernDeck from Programs and Features.",
				type:"error",
				buttons:["Upgrade to latest test build","Close"]
			},function(response){
				const { shell } = electron;
				if (response === 0) {
					shell.openExternal("https://github.com/dangeredwolf/ModernDeck/releases");
				}
				app.quit();
			});
			return;
		}
	}

	if (process.platform === "darwin" && !app.isInApplicationsFolder()) {
		const { dialog } = electron;

		dialog.showMessageBox({
			type: "warning",
			title: "ModernDeck",
			message: "Updates might not work correctly if you don't run ModernDeck from the Applications folder. Would you like to move it there?",
			buttons: ["Not now", "Yes, move it"]
		}, function(response) {
			if (response == 1) {
				var moveMe = app.moveToApplicationsFolder();
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

	mainWindow.on('page-title-updated', function(event,url) {
		event.preventDefault();
	})

	mainWindow.show();

	mtdAppTag += 'document.querySelector("html").classList.add("mtd-js-app");\n';

	if (!!process.windowsStore) {
		mtdAppTag += 'document.querySelector("html").classList.add("mtd-winstore");\n';
	}

	if (!!process.mas) {
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

	mainWindow.webContents.on('dom-ready', function(event, url) {
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
		var msg = "ModernDeck failed to start.\n\n";

		console.log(desc);

		if (code === -3 || code === -11 || code === -2 || code === -1) {
			return;
		}

		var addChromiumErrorCode = false;

		if (code === -13 || code === -12) {
			msg += "Your PC ran out of memory trying to start ModernDeck. Try closing some programs or restarting your PC and trying again."
		} else if ((code <= -800 && code >= -900) || code === -137 || code === -105) {
			msg += "We can't connect to Twitter due to a DNS error.\nPlease check your internet connection.";
			addChromiumErrorCode = true;
		} else if (code === -106) {
			msg += "You are disconnected from the Internet. ModernDeck requires an internet connection to start.";
		} else if (code === -201) {
			msg += "Please check that your PC's date and time are set correctly. Twitter presented us with a security certificate that either expired or not yet valid.\nIf your date and time are correct, check https://api.twitterstat.us to see if there are any problems at Twitter."
		} else if (code === -130 || code === -131 || code === -111 || code === -127 || code === -115 || code === -336) {
			msg += "We can't connect to your internet connection's proxy server.\n\nIf you don't need to connect to a proxy server, you can take the following steps on Windows:\n1. Press Windows Key + R to open the Run dialog.\n2. Enter inetcpl.cpl\n3. Go to the Connections tab\n4. Click the LAN settings button near the bottom\n5. Uncheck \"Use a proxy server for your LAN\""
			addChromiumErrorCode = true;
		} else if (code === -22) {
			msg += "Your domain administrator has blocked access to tweetdeck.twitter.com.\nIf your device is owned by an organization, you might need to ask a network administrator to unblock it.\nIf you are not logged in as part of a domain, you may need to configure your Local Group Policy settings."
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
		},function(response){
			if (response === 0) {
				mainWindow.reload();
			} else if (response === 1) {
				mainWindow.close();
			}
		});
		return;
	});

	mainWindow.webContents.session.webRequest.onHeadersReceived(
		{urls:["https://tweetdeck.twitter.com/*","https://twitter.com/i/cards/*"]},
		function(details, callback) {
			var foo = details.responseHeaders;
			foo["content-security-policy"] =[
				"default-src 'self'; connect-src * moderndeck:; font-src https: data: * moderndeck:; frame-src https: moderndeck:; frame-ancestors 'self' https: moderndeck:; img-src https: data: moderndeck:; media-src * moderndeck:; object-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://c6.patreon.com https://sentry.io https://cdn.jsdelivr.net https://ajax.googleapis.com moderndeck: https://cdn.ravenjs.com/ https://*.twitter.com https://*.twimg.com https://api-ssl.bitly.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' https: moderndeck:;"];
			callback({ responseHeaders: foo});
		}
	);


	mainWindow.webContents.session.webRequest.onBeforeRequest({urls:["https://ton.twimg.com/*"]},function(details,callback) {

		if (details.url.indexOf(".css") > -1 && (details.url.indexOf("bundle") > -1 && details.url.indexOf("dist") > -1)) {
			callback({cancel:true});
			return;
		}

		if (details.url.indexOf(".css") > -1 && details.url.indexOf("tfw") > -1 && details.url.indexOf("css") > -1 && details.url.indexOf("tweetdeck_bundle") > -1) {
			callback({redirectURL:"moderndeck://sources/cssextensions/twittercard.css"});
			return;
		}

		callback({cancel:false});
	});
	mainWindow.loadURL("https://tweetdeck.twitter.com");

	mainWindow.webContents.on("will-navigate", function(event, url) {
		const { shell } = electron;
		if (url.indexOf("https://tweetdeck.twitter.com") < 0) {
			event.preventDefault();
			console.log(url);
			if (url.indexOf("https://twitter.com/login") >= 0 || url.indexOf("https://twitter.com/logout") >= 0) {
				event.newGuest = makeLoginWindow(url,false);
			} else {
				shell.openExternal(url);
			}
		}
	});

	mainWindow.webContents.on("new-window", function(event, url) {
		const { shell } = electron;
		event.preventDefault();

		if (url.indexOf("https://twitter.com/teams/authorize") >= 0) {
			event.newGuest =makeLoginWindow(url,true);
		} else {
			shell.openExternal(url);
		}

		return event.newGuest;

	});

	mainWindow.webContents.on("context-menu", function(event, params) {
		mainWindow.send("context-menu", params);
	});
	ipcMain.on("nativeContextMenu",function(event,params){
		console.log(params);
		let newMenu = 	Menu.buildFromTemplate(params);
		console.log(newMenu);
	newMenu.popup();
	});
	ipcMain.on("copy",function(event){
		mainWindow.webContents.copy();
	});
	ipcMain.on("cut",function(event){
		mainWindow.webContents.cut();
	});
	ipcMain.on("paste",function(event){
		mainWindow.webContents.paste();
	});
	ipcMain.on("delete",function(event){
		mainWindow.webContents.delete();
	});
	ipcMain.on("selectAll",function(event){
		mainWindow.webContents.selectAll();
	});
	ipcMain.on("undo",function(event){
		mainWindow.webContents.undo();
	});
	ipcMain.on("redo",function(event){
		mainWindow.webContents.redo();
	});
	ipcMain.on("copyImage",function(event,arg){
		mainWindow.webContents.copyImageAt(arg.x,arg.y);
	});
	ipcMain.on("saveImage",function(event,arg){
		saveImageAs(arg);
	});
	ipcMain.on("inspectElement",function(event,arg){
		mainWindow.webContents.inspectElement(arg.x,arg.y);
	});
	ipcMain.on("restartApp",function(event,arg){
		setTimeout(function(){
			app.relaunch();
			app.exit();
		},100);
	});
	ipcMain.on("restartAndInstallUpdates",function(event,arg){
		autoUpdater.quitAndInstall(false,true);
	});
	ipcMain.on("destroyEverything",function(event,arg){
		var ses = session.defaultSession;
		store.clear();
		ses.flushStorageData();
		ses.clearCache(function(){});
		ses.clearHostResolverCache();
		ses.cookies.flushStore(function(){});
		ses.clearStorageData({
			storages:['appcache','cookies','filesystem','indexdb','localstorage','shadercache','websql','serviceworkers'],
			quotas: ['temporary','persistent','syncable']
		},function(){
			setTimeout(function(){
				app.relaunch();
				app.exit();
			},500);
		});


	});
	ipcMain.on("setNativeTitlebar",function(event,arg){
		mainWindow.close();
		console.warn("SETNATIVETITLEBAR CALLED");
		isRestarting = true;
		store.set("mtd_nativetitlebar",arg);

		setTimeout(function(){
			app.relaunch();
			app.exit();
		},100);

	});

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	mainWindow.on('maximize', function() {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.add("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3E0";\
		');
	});

	mainWindow.on('unmaximize', function() {
		mainWindow.webContents.executeJavaScript('\
			document.querySelector("html").classList.remove("mtd-maximized");\
			document.querySelector(".windowcontrol.max").innerHTML = "&#xE3C6";\
		');
	});

	mainWindow.on('enter-full-screen', function() {
		mainWindow.webContents.executeJavaScript('document.querySelector("html").classList.remove("mtd-app");\
			document.querySelector("html").classList.remove("mtd-app-win");\
			document.querySelector("html").classList.remove("mtd-app-mac");\
			document.querySelector("html").classList.remove("mtd-app-linux");\
		');
	});

	mainWindow.on('leave-full-screen', function() {
		mainWindow.webContents.executeJavaScript(mtdAppTag);
	});
}

electron.protocol.registerSchemesAsPrivileged([{scheme:"moderndeck",privileges:{bypassCSP:true,secure:true,standard:true,allowServiceWorkers:true,supportFetchAPI:true,corsEnabled:true}}]);


app.on('ready', makeWindow)

app.on('window-all-closed', function() {
	if (isRestarting) {
		return;
	}
	app.quit();
})

app.on('activate', function() {
	if (mainWindow === null)
		makeWindow();
})


autoUpdater.on("error",function(e,f,g){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("error",e,f,g);
});

autoUpdater.on("checking-for-update",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("checking-for-update",e);
});

autoUpdater.on("download-progress",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("download-progress",e);
});

autoUpdater.on("update-downloaded",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("update-downloaded",e);
});

autoUpdater.on("update-not-available",function(e){
	if (!mainWindow || !mainWindow.webContents){return;}
	mainWindow.webContents.send("update-not-available",e);
});

ipcMain.on('checkForUpdates',function(e){
	autoUpdater.checkForUpdates();
});

ipcMain.on('changeChannel',function(e){
	autoUpdater.channel = store.get("mtd_updatechannel");
});

systemPreferences.on("inverted-color-scheme-changed",function(e,v){
	mainWindow.webContents.send("inverted-color-scheme-changed",v);
});

setInterval(function(){
	autoUpdater.checkForUpdates();
},1000*60*15); //check for updates once every 15 minutes

setTimeout(function(){
	mainWindow.webContents.send("inverted-color-scheme-changed",systemPreferences.isInvertedColorScheme())
},10000);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
