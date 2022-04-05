/*
	AppController.js
	
	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make, exists, getIpc } from "./Utils.js";
import { UIAlert } from "./UIAlert.js";
import { UIUpdateNotify } from "./UIUpdateNotify.js";
import { AutoUpdateController } from "./AutoUpdateController.js";
import { openSettings } from "./UISettings.js";
import { buildContextMenu } from "./UIContextMenu.js";
import { parseActions } from "./PrefHandler.js";
import { parseConfig } from "./EnterpriseConfigParser.js";
import { importTweetenSettings } from "./StorageTweetenImport.js";
import { I18n } from "./I18n.js";

let offlineNotification;

/*
	Notifies users of an app update
*/

function notifyUpdate() {
	if (isDev || desktopConfig.disableUpdateNotification) {
		return;
	}
	UIUpdateNotify();
}

/*
	Create offline notification (probably because we're offline)
*/

function notifyOffline() {

	if (exists(offlineNotification)) {
		return;
	}

	let notifRoot = mR.findFunction("showErrorNotification")[0].showNotification({title:I18n("Internet Disconnected"),timeoutDelayMs:9999999999});
	let notifId = notifRoot._id;
	offlineNotification = $("li.Notification[data-id=\""+notifId+"\"]");
	let notifContent = $("li.Notification[data-id=\""+notifId+"\"] .Notification-content");
	let notifIcon = $("li.Notification[data-id=\""+notifId+"\"] .Notification-icon .Icon");

	if (offlineNotification.length > 0) {
		notifIcon.removeClass("Icon--notifications").addClass("mtd-icon-disconnected");

		notifContent.append(
			make("p").attr("style","max-width:initial!important").html(I18n("We detected that you are disconnected from the internet. Many actions are unavailable without an internet connection."))
		)
	}
}

/*
	Dismiss offline notification (probably because we're online again)
*/

function dismissOfflineNotification() {
	if (!exists(window.offlineNotification)) {return;}
	mR.findFunction("showErrorNotification")[0].removeNotification({notification:offlineNotification});
}

/*
	mtdAppFunctions() consists of functions to help interface
	from here (the renderer process) to the main process
*/

export function mtdAppFunctions() {

	if (typeof require === "undefined") {return;}

	const { ipcRenderer } = require("electron");

	const Store = require("electron-store");
	let store = new Store({name:"mtdsettings"});


	// Enable high contrast if system is set to high contrast


	$(document).on("uiDrawerHideDrawer",(e) => {
		getIpc().send("drawerClose");
	});

	$(document).on("uiDrawerActive",(e) => {
		if (!$(".application").hasClass("hide-detail-view-inline"))
			getIpc().send("drawerOpen");
	});


	ipcRenderer.on("desktopConfig", (e, config) => {
		window.desktopConfig = config;
		parseConfig(config);
	});


	ipcRenderer.on("inverted-color-scheme-changed", (e, enabled) => {
		if (enabled && getPref("mtd_highcontrast") !== true) {
			try {
				settingsData.accessibility.options.highcont.activate.func();
			} catch(e){}
		}
	});

	ipcRenderer.on("color-scheme-changed", (e, theme) => {
		parseActions(settingsData.themes.options.coretheme.activate, theme);

	});

	ipcRenderer.on("disable-high-contrast", (e) => {
		console.info("DISABLING HIGH CONTRAST ");
		try {
			settingsData.accessibility.options.highcont.deactivate.func();
		} catch(e){}
	});

	ipcRenderer.on("aboutMenu", (e,args) => {
		if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0 && $("#settings-modal").attr("style") === "display: block;"){
			$(".mtd-settings-tab[data-action=\"about\"]").click();
		} else {
			openSettings();
			if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0){
				$(".mtd-settings-tab[data-action=\"about\"]").click();
			}
		}
	});

	ipcRenderer.on("checkForUpdatesMenu", (e,args) => {
		if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0 && $("#settings-modal").attr("style") === "display: block;"){
			$(".mtd-settings-tab[data-action=\"about\"]").click();
		} else {
			openSettings();
			if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0){
				$(".mtd-settings-tab[data-action=\"about\"]").click();
			}
		}

		if (!AutoUpdateController.isCheckingForUpdates && window.desktopConfig.updatePolicy !== "disabled") {
			ipcRenderer.send("checkForUpdates");
		}
	});

	ipcRenderer.on("update-downloaded", (e,args) => {
		if ($("#settings-modal[style='display: block;']>.mtd-settings-panel").length <= 0 && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-flatpak") && !html.hasClass("mtd-macappstore")) {
			notifyUpdate()
		}
	});

	ipcRenderer.on("openSettings", (e,args) => {
		openSettings();
	});

	ipcRenderer.on("accountsMan", (e,args) => {
		$(".js-show-drawer.js-header-action").click();
	});

	ipcRenderer.on("sendFeedback", (e,args) => {
		window.open("https://github.com/dangeredwolf/ModernDeck/issues");
	});

	ipcRenderer.on("msgModernDeck", (e,args) => {
		$(document).trigger("uiComposeTweet", {
			type: "message",
			messageRecipients: [{
				screenName: "ModernDeck"
			}]
		})
	});

	ipcRenderer.on("newTweet", (e,args) => {
		mtdPrepareWindows();
		$(document).trigger("uiComposeTweet");
	});

	ipcRenderer.on("newDM", (e,args) => {
		mtdPrepareWindows();
		$(document).trigger("uiComposeTweet");
		$(".js-dm-button").click();
	});

	let minimise, maximise, closeButton;

	if (html.hasClass("mtd-js-app")) {
		if ($(".windowcontrols").length <= 0) {
			minimise = make("button")
			.addClass("windowcontrol min")
			.html("&#xE15B")


			maximise = make("button")
			.addClass("windowcontrol max")
			.html("&#xE3C6")

			if (html.hasClass("mtd-maximized")) {
				maximise.html("&#xE3E0")
			}

			closeButton = make("button")
			.addClass("windowcontrol close")
			.html("&#xE5CD")

			let windowcontrols = make("div")
			.addClass("windowcontrols")
			.append(minimise)
			.append(maximise)
			.append(closeButton);

			body.append(windowcontrols,
				make("div").addClass("mtd-app-drag-handle")
			);
		} else {
			minimise = $(".windowcontrol.min");
			maximise = $(".windowcontrol.max");
			closeButton = $(".windowcontrol.close");

			if (html.hasClass("mtd-maximized")) {
				maximise.html("&#xE3E0")
			}
		}

		minimise.click(() => {
			ipcRenderer.send("minimize");
		});

		maximise.click(() => {
			ipcRenderer.send("maximizeButton");
		});

		closeButton.click(() => {
			window.close();
		});

	}

	ipcRenderer.on("context-menu", (event, p) => {
		let theMenu = buildContextMenu(p);
		let Menu = require("@electron/remote").Menu;

		if (useNativeContextMenus || useSafeMode) {
			Menu.buildFromTemplate(theMenu).popup();
			return;
		} else {
			if (exists(theMenu))
				body.append(theMenu);
		}
	});

	ipcRenderer.on("failedOpenUrl", (event, p) => {
		new UIAlert({
			title:I18n("Failed to open link in browser"),
			message:I18n("ModernDeck failed to open a link you clicked in the default browser.\n\n(Sometimes, this can be caused if you have the Twitter for Windows app installed)"),
			buttonText:I18n("OK")
		})
	});

	ipcRenderer.on("settingsReceived", (_, load) => {
		console.log("settingsReceived");
		store.store = load;
		ipcRenderer.send("restartApp");
	});

	ipcRenderer.on("tweetenSettingsReceived", (_, load) => {
		importTweetenSettings(load);
		setTimeout(() => {
			ipcRenderer.send("restartApp");
		},500); // We wait to make sure that native TweetDeck settings have been propagated
	});

	const updateOnlineStatus = () => {

		if (!navigator.onLine) {
			// notifyOffline();
		} else {
			dismissOfflineNotification();
		}

	}

	window.addEventListener("online", updateOnlineStatus);
	window.addEventListener("offline", updateOnlineStatus);

	updateOnlineStatus();
}
