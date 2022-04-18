/*
	UISettings.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";
import { I18n } from "./I18n";
import { AutoUpdateController } from "./AutoUpdateController";

// opens legacy tweetdeck settings

export function openLegacySettings() {
	$(".mtd-settings-panel").remove();
	new TD.components.GlobalSettings;
}
/*
	function openSettings()
	opens and settings panel, open to first page

	function openSettings(openMenu)
	opens and returns settings panel with string openMenu, the tabId of the corresponding settings page
*/

/*
	Event function to update the UI as the update status changes
*/

function updateUIChanged() {
	if (AutoUpdateController.h2) {
		$(window.updateh2).removeClass("hidden");
		$(window.updateh2).html(AutoUpdateController.h2);
	} else {
		$(window.updateh2).addClass("hidden");
	}

	if (AutoUpdateController.h3) {
		$(window.updateh3).removeClass("hidden");
		$(window.updateh3).html(AutoUpdateController.h3);
	} else {
		$(window.updateh3).addClass("hidden");
	}

	if (AutoUpdateController.installButton) {
		$(window.installButton).removeClass("hidden");
		$(window.installButton).html(AutoUpdateController.installButton);
	} else {
		$(window.installButton).addClass("hidden");
	}

	if (AutoUpdateController.tryAgain) {
		$(window.tryAgain).removeClass("hidden");
		$(window.tryAgain).html(AutoUpdateController.tryAgain);
	} else {
		$(window.tryAgain).addClass("hidden");
	}

	if (AutoUpdateController.restartNow) {
		$(window.restartNow).removeClass("hidden");
	} else {
		$(window.restartNow).addClass("hidden");
	}

	if (AutoUpdateController.icon) {
		$(window.updateIcon).removeClass("hidden");
		$(window.updateIcon).html(AutoUpdateController.icon);
	} else {
		$(window.updateIcon).addClass("hidden");
	}

	if (AutoUpdateController.spinner === true) {
		$(window.updateSpinner).removeClass("hidden");
	} else {
		$(window.updateSpinner).addClass("hidden");
	}
}

/*
	Controller function for app update page
*/

function mtdAppUpdatePage() {

	$(document).on("mtdUpdateUIChanged", updateUIChanged);

	const { ipcRenderer } = window.require("electron");

	setTimeout(() => {
		$(window.tryAgain).click(() => {
			ipcRenderer.send("checkForUpdates");
		})

		$(window.installButton).click(() => {
			ipcRenderer.send("downloadUpdates");
		})

		$(window.restartNow).click(() => {
			ipcRenderer.send("restartAndInstallUpdates");
		});

		if (!AutoUpdateController.isCheckingForUpdates && window.desktopConfig.autoUpdatePolicy !== "disabled" && window.desktopConfig.autoUpdatePolicy !== "manual") {
			console.log("heck");
			ipcRenderer.send("checkForUpdates");
		}

		updateUIChanged();
	})
}


/*
	Creates the update container
*/

export function makeUpdateContTodoGetRidOfThisLegacyThing() {
	let updateCont = make("div").addClass("mtd-update-container").html('<div class="mtd-update-spinner preloader-wrapper small active" id="updateSpinner"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>').attr("id","updateCont");
	let updateIcon = make("i").addClass("material-icon hidden").attr("id","updateIcon");
	let updateh2 = make("h2").addClass("mtd-update-h2").html(I18n("Checking for updates...")).attr("id","updateh2");
	let updateh3 = make("h3").addClass("mtd-update-h3 hidden").html("").attr("id","updateh3");
	let tryAgain = make("button").addClass("btn hidden").html(I18n("Try Again")).attr("id","tryAgain");
	let installButton = make("button").addClass("btn hidden").html(I18n("Download")).attr("id","installButton");

	let restartNow = make("button").addClass("btn hidden").attr("id","restartNow");
	let restartNowHtml = I18n("Restart Now");

	restartNow.html(restartNowHtml);

	updateCont.append(updateIcon,updateh2,updateh3,tryAgain,installButton,restartNow);

	if (typeof require !== "undefined" && !html.hasClass("mtd-flatpak") && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
		mtdAppUpdatePage();
	}

	return updateCont;
}
