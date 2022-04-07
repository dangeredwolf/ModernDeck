/*
	AutoUpdateController.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "./I18n.js";
import { formatBytes } from "./Utils.js";

export class AutoUpdateController {
	h3;
	h2;
	tryAgain;
	restartNow;
	installButton;
	spinner;
	icon;

	isCheckingForUpdates;

	static initialize() {

		if (typeof require === "undefined") {
			return;
		}

		const { ipcRenderer } = require("electron");

		AutoUpdateController.h2 = I18n("Check for updates");
		AutoUpdateController.spinner = false;
		AutoUpdateController.h3 = I18n("ModernDeck updates help keep you secure and add new features.");
		AutoUpdateController.icon = "info_outline";
		AutoUpdateController.tryAgain = I18n("Check now");
		AutoUpdateController.restartNow = false;
		AutoUpdateController.installButton = undefined;
		AutoUpdateController.isCheckingForUpdates = false;

		ipcRenderer.on("error",(e, args, f, g) => {
			AutoUpdateController.h2 = I18n("There was a problem checking for updates.");
			AutoUpdateController.spinner = false;

			if (args?.code) {
				AutoUpdateController.h3 = `${args.domain || ""} ${args.code || ""} ${args.errno || ""} ${args.syscall || ""} ${args.path || ""}`;
			} else if (f) {
				AutoUpdateController.h3 = f.match(/^(Cannot check for updates: )(.)+\n/g)
			} else {
				AutoUpdateController.h3 = I18n("An unknown error occurred. Please try again shortly.");
			}

			AutoUpdateController.icon = "error_outline";
			AutoUpdateController.tryAgain = I18n("Try Again");
			AutoUpdateController.restartNow = false;
			AutoUpdateController.installButton = undefined;
			AutoUpdateController.isCheckingForUpdates = false;
			$(document).trigger("mtdUpdateUIChanged");

		});

		ipcRenderer.on("checking-for-update", (e,args) => {
			AutoUpdateController.icon = undefined;
			AutoUpdateController.spinner = true;
			AutoUpdateController.h2 = I18n("Checking for updates...");
			AutoUpdateController.h3 = undefined;
			AutoUpdateController.updateh3 = undefined;
			AutoUpdateController.tryAgain = undefined;
			AutoUpdateController.installButton = undefined;
			AutoUpdateController.restartNow = false;
			$("[id='update'] .mtd-welcome-next-button").html(I18n("Skip") + "<i class='icon icon-arrow-r'></i>");

			AutoUpdateController.isCheckingForUpdates = true;
			$(document).trigger("mtdUpdateUIChanged");
		});

		ipcRenderer.on("update-available", (e,args) => {
			if (typeof window.desktopConfig !== "undefined" && (window.desktopConfig.autoUpdatePolicy === "checkOnly" || window.desktopConfig.autoUpdatePolicy === "manual")) {
				AutoUpdateController.h2 = I18n("An update for ModernDeck is available");
				AutoUpdateController.h3 = I18n("ModernDeck updates help keep you secure and add new features.");
				AutoUpdateController.spinner = false;
				AutoUpdateController.icon = "error_outline";
				AutoUpdateController.installButton = I18n("Download");
			} else {
				AutoUpdateController.h2 = I18n("Updating...");
				AutoUpdateController.h3 = undefined;
				AutoUpdateController.spinner = true;
				AutoUpdateController.icon = undefined;
				AutoUpdateController.installButton = undefined;
			}
			AutoUpdateController.tryAgain = undefined;
			AutoUpdateController.restartNow = false;

			AutoUpdateController.isCheckingForUpdates = true;
			$(document).trigger("mtdUpdateUIChanged");
		});

		ipcRenderer.on("download-progress", (e,args) => {
			AutoUpdateController.icon = undefined;
			AutoUpdateController.spinner = true;
			AutoUpdateController.h2 = I18n("Downloading update...");
			AutoUpdateController.h3 = Math.floor(args.percent) + I18n("% complete (") +
									  formatBytes(args.transferred) + I18n("/") + formatBytes(args.total) + I18n("; ") +
									  formatBytes(args.bytesPerSecond) + ("/s)");

			AutoUpdateController.tryAgain = undefined;
			AutoUpdateController.installButton = undefined;
			AutoUpdateController.restartNow = false;

			AutoUpdateController.isCheckingForUpdates = true;
			$(document).trigger("mtdUpdateUIChanged");
		});


		ipcRenderer.on("update-downloaded", (e,args) => {
			AutoUpdateController.spinner = false;
			AutoUpdateController.icon = "update";
			AutoUpdateController.h2 = I18n("Update downloaded");
			AutoUpdateController.h3 = I18n("Restart ModernDeck to complete the update");

			AutoUpdateController.tryAgain = undefined;
			AutoUpdateController.installButton = undefined;
			AutoUpdateController.restartNow = true;

			AutoUpdateController.isCheckingForUpdates = false;
			$(document).trigger("mtdUpdateUIChanged");
		});


		ipcRenderer.on("update-not-available", (e,args) => {
			AutoUpdateController.spinner = false;
			AutoUpdateController.h2 = I18n("You're up to date");
			AutoUpdateController.icon = "check_circle";
			AutoUpdateController.h3 = window.ModernDeck.versionFriendlyString + I18n(" is the latest version.");

			AutoUpdateController.tryAgain = I18n("Check Again");
			AutoUpdateController.installButton = undefined;
			AutoUpdateController.restartNow = false;
			$("[id='update'] .mtd-welcome-next-button").html(I18n("Next") + "<i class='icon icon-arrow-r'></i>");

			AutoUpdateController.isCheckingForUpdates = false;
			$(document).trigger("mtdUpdateUIChanged");
		});
	}

}
