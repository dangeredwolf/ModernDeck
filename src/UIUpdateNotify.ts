/*
	UIUpdateNotify.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";
import { I18n } from "./I18n";

export const UIUpdateNotify = (): void => {
	if (window.mtdHasNotifiedUpdate) {
		return;
	}
	window.mtdHasNotifiedUpdate = true;

	let notifRoot = window.mR.findConstructor("showErrorNotification")[0][1].showNotification({ title: I18n("Update ModernDeck"), timeoutDelayMs: 9999999999 });
	let notifId = notifRoot._id;
	let notif = $(`li.Notification[data-id="${notifId}"]`);
	let notifContent = $(`li.Notification[data-id="${notifId}"] .Notification-content`);
	let notifIcon = $(`li.Notification[data-id="${notifId}"] .Notification-icon .Icon`);

	window.updateNotifyID = notifRoot._id;

	if (notif.length > 0) {
		notif.addClass("mtd-update-notification");
		notifIcon.removeClass("Icon--notifications").addClass("material-icon").html("update");

		notifContent.append(
			make("p").html(I18n("An update is available for ModernDeck")),
			make("button").addClass("btn mtd-notification-button").html(I18n("Relaunch")).click((): void => {
				window.mtdPrepareWindows();
				window.require("electron").ipcRenderer.send("restartAndInstallUpdates")
			})
		)
	}
}
