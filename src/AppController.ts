/*
	AppController.ts
	
	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make, getIpc } from "./Utils";
import { UIAlert } from "./UIAlert";
import { UIUpdateNotify } from "./UIUpdateNotify";
import { AutoUpdateController } from "./AutoUpdateController";
import { openSettings } from "./UISettings";
import { buildContextMenu } from "./UIContextMenu";
import { parseActions } from "./Settings/SettingsInit";
import { parseConfig } from "./DesktopConfigParser";
import { importTweetenSettings, TweetenSettingsJSON } from "./Settings/ImportTweeten";
import { I18n } from "./I18n";
import { settingsData } from "./Settings/SettingsData";
import { getPref } from "./StoragePreferences";
import * as ElectronStore from "electron-store";

/*
	Notifies users of an app update
*/

const notifyUpdate = (): void => {
	if (window.desktopConfig.disableUpdateNotification) {
		return;
	}
	UIUpdateNotify();
}

/*
	mtdAppFunctions() consists of functions to help interface
	from here (the renderer process) to the main process
*/

export const mtdAppFunctions = (): void => {

	if (typeof window.require === "undefined") {return;}

	const { ipcRenderer } = window.require("electron");

	const Store = window.require("electron-store");
	let store = new Store({name:"mtdsettings"});


	// Enable high contrast if system is set to high contrast


	$(document).on("uiDrawerHideDrawer", (): void => {
		getIpc().send("drawerClose");
	});

	$(document).on("uiDrawerActive", (): void => {
		if (!$(".application").hasClass("hide-detail-view-inline"))
			getIpc().send("drawerOpen");
	});


	ipcRenderer.on("desktopConfig", (_event: Event, config: DesktopConfig): void => {
		window.desktopConfig = config;
		parseConfig(config);
	});


	ipcRenderer.on("inverted-color-scheme-changed", (_event: Event, enabled: boolean): void => {
		if (enabled && getPref("mtd_highcontrast") !== true) {
			try {
				settingsData.accessibility.options.highcont.activate.func();
			} catch(e){}
		}
	});

	ipcRenderer.on("color-scheme-changed", (_event: Event, theme: string): void => {
		parseActions(settingsData.themes.options.coretheme.activate, theme);

	});

	ipcRenderer.on("disable-high-contrast", (): void => {
		console.info("DISABLING HIGH CONTRAST ");
		try {
			settingsData.accessibility.options.highcont.deactivate.func();
		} catch(e){}
	});

	ipcRenderer.on("aboutMenu", (): void => {
		if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0 && $("#settings-modal").attr("style") === "display: block;"){
			$(".mtd-settings-tab[data-action=\"about\"]").click();
		} else {
			openSettings();
			if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0){
				$(".mtd-settings-tab[data-action=\"about\"]").click();
			}
		}
	});

	ipcRenderer.on("checkForUpdatesMenu", (): void => {
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

	ipcRenderer.on("update-downloaded", (): void => {
		if ($("#settings-modal[style='display: block;']>.mtd-settings-panel").length <= 0 && !window.html.hasClass("mtd-winstore") && !window.html.hasClass("mtd-flatpak") && !window.html.hasClass("mtd-macappstore")) {
			notifyUpdate()
		}
	});

	ipcRenderer.on("openSettings", (): void => {
		openSettings();
	});

	ipcRenderer.on("accountsMan", (): void => {
		$(".js-show-drawer.js-header-action").click();
	});

	ipcRenderer.on("sendFeedback", (): void => {
		window.open("https://github.com/dangeredwolf/ModernDeck/issues");
	});

	ipcRenderer.on("msgModernDeck", (): void => {
		$(document).trigger("uiComposeTweet", {
			type: "message",
			messageRecipients: [{
				screenName: "ModernDeck"
			}]
		})
	});

	ipcRenderer.on("newTweet", (): void => {
		window.mtdPrepareWindows();
		$(document).trigger("uiComposeTweet");
	});

	ipcRenderer.on("newDM", (): void => {
		window.mtdPrepareWindows();
		$(document).trigger("uiComposeTweet");
		$(".js-dm-button").click();
	});

	let minimize, maximize, closeButton: JQuery<HTMLElement>;

	if (window.html.hasClass("mtd-js-app")) {
		if ($(".windowcontrols").length <= 0) {
			minimize = make("button")
			.addClass("windowcontrol min")
			.html("&#xE15B")

			maximize = make("button")
			.addClass("windowcontrol max")
			.html("&#xE3C6")

			if (window.html.hasClass("mtd-maximized")) {
				maximize.html("&#xE3E0")
			}

			closeButton = make("button")
			.addClass("windowcontrol close")
			.html("&#xE5CD")

			let windowcontrols = make("div")
			.addClass("windowcontrols")
			.append(minimize)
			.append(maximize)
			.append(closeButton);

			window.body.append(windowcontrols,
				make("div").addClass("mtd-app-drag-handle")
			);
		} else {
			minimize = $(".windowcontrol.min");
			maximize = $(".windowcontrol.max");
			closeButton = $(".windowcontrol.close");

			if (window.html.hasClass("mtd-maximized")) {
				maximize.html("&#xE3E0")
			}
		}

		minimize.click((): void => {
			ipcRenderer.send("minimize");
		});

		maximize.click((): void => {
			ipcRenderer.send("maximizeButton");
		});

		closeButton.click((): void => {
			window.close();
		});

	}

	ipcRenderer.on("context-menu", (_event: Event, menuContents: any) => {
		let theMenu = buildContextMenu(menuContents);
		let Menu = window.require("@electron/remote").Menu;

		if (window.useNativeContextMenus || window.useSafeMode) {
			Menu.buildFromTemplate(theMenu).popup();
			return;
		} else {
			if (typeof (theMenu) !== "undefined")
				window.body.append(theMenu as JQuery<HTMLElement>);
		}
	});

	ipcRenderer.on("failedOpenUrl", (): void => {
		new UIAlert({
			title:I18n("Failed to open link in browser"),
			message:I18n("ModernDeck failed to open a link you clicked in the default browser.\n\n(Sometimes, this can be caused if you have the Twitter for Windows app installed)"),
			buttonText:I18n("OK")
		})
	});

	ipcRenderer.on("settingsReceived", (_event: Event, load: ElectronStore): void => {
		console.log("settingsReceived");
		store.store = load;
		ipcRenderer.send("restartApp");
	});

	ipcRenderer.on("tweetenSettingsReceived", (_event: Event, load: TweetenSettingsJSON): void => {
		importTweetenSettings(load);
		setTimeout((): void => {
			ipcRenderer.send("restartApp");
		},500); // We wait to make sure that native TweetDeck settings have been propagated
	});

}
