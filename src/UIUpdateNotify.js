/*
	UIUpdateNotify.js

	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils.js";
import { I18n } from "./I18n.js";
import DataI18n from "./DataI18n.js";
import { getPref, setPref } from "./StoragePreferences.js";

export function UIUpdateNotify() {
	if (window.mtdHasNotifiedUpdate) {
		return;
	}
	window.mtdHasNotifiedUpdate = true;

	let notifRoot = mR.findFunction("showErrorNotification")[0].showNotification({title:I18n("Update ModernDeck"),timeoutDelayMs:9999999999});
	let notifId = notifRoot._id;
	let notif = $("li.Notification[data-id=\""+notifId+"\"]");
	let notifContent = $("li.Notification[data-id=\""+notifId+"\"] .Notification-content");
	let notifIcon = $("li.Notification[data-id=\""+notifId+"\"] .Notification-icon .Icon");

	window.updateNotifyID = notifRoot._id;

	if (notif.length > 0) {
		notif.addClass("mtd-update-notification");
		notifIcon.removeClass("Icon--notifications").addClass("material-icon").html("update");

		notifContent.append(
			make("p").html(I18n("An update is available for ModernDeck")),
			make("button").addClass("btn mtd-notification-button").html(I18n("Relaunch")).click(() => {
				mtdPrepareWindows();
				require("electron").ipcRenderer.send("restartAndInstallUpdates")
			})
		)
	}
}
