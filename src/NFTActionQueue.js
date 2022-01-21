/*
	NFTActionQueue.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref, setPref } from "./StoragePreferences";
import { make } from "./Utils";

export default class NFTActionQueue {
	queue = getPref("mtd_nftActionQueue", []);
	recentMutes = [];
	isThreadRunning = false;
	lastAction = 0;
	notif = null;
	clearNotificationTimeout;

	constructor () {
		if (this.queue.length > 0 && this.isThreadRunning === false) {
			this.isThreadRunning = true;
			setTimeout(() => {
				this.takeUserAction(this.queue[0]);
			}, 1000);
		}
	}

	_createNewNotification() {
		this.notifRoot = mR.findFunction("showErrorNotification")[0].showNotification({title:I18n("NFT Actions"), timeoutDelayMs:9999999999999});
		this.notifId = this.notifRoot._id;
		this.notif = $("li.Notification[data-id=\""+this.notifId+"\"]").attr("style", "display: none");
		this.notifContent = $("li.Notification[data-id=\""+this.notifId+"\"] .Notification-content");
		this.notifTitle = $("li.Notification[data-id=\""+this.notifId+"\"] .Notification-title");
		this.notifIcon = $("li.Notification[data-id=\""+this.notifId+"\"] .Notification-icon .Icon");

		if (this.notif.length > 0) {
			this.notif.addClass("mtd-update-notification mtd-nft-block-notification");
			this.notifIcon.removeClass("Icon--notifications").addClass("material-icon").html("block");

			this.notifContent.append(
				make("p").addClass("mtd-nft-notification-text"),
				make("button").addClass("btn mtd-notification-button mtd-nft-notification-button").click(() => {
					mtdPrepareWindows();
					require("electron").ipcRenderer.send("restartAndInstallUpdates")
				}),
				make("div").addClass("mtd-nft-notification-loading").attr("style", "right: 372px")
			)

			this.notifText = $(".mtd-nft-notification-text");
			this.notifButton = $(".mtd-nft-notification-button");
			this.notifLoading = $(".mtd-nft-notification-loading");
		}
	}

	_randomTime() {
		return 10000 + (Math.random() * 5000);
	}

	addUser(user) {
		console.log(`NFTActionQueue: Checking if user ${user.screen_name} is already dealt with`);

		let dealtWith = false;
		let actionToTake = getPref("mtd_nftAvatarAction");

		clearTimeout(this.clearNotificationTimeout);

		// Check if we've already dealt with this user
		this.recentMutes.forEach(mutedUser => {
			if (mutedUser.screen_name === user.screen_name) {
				dealtWith = true;
			}
		});

		// Check if already muted or blocked
		if (actionToTake === "mute" ? TD.controller.clients.getPreferredClient().mutes[user.id_str] :
		   (actionToTake === "block" ? TD.controller.clients.getPreferredClient().blocks[user.id_str] : false)) {
			dealtWith = true;
		}

		// If not dealt with, add to queue
		if (!dealtWith) {

			console.log(`NFTActionQueue: Queued user ${user.screen_name}`);
			// console.log(`NFTActionQueue: Adding user ${user.screen_name} to queue`);
			this.queue.push(user);
			this.recentMutes.push(user);
			
			if (new Date() - this.lastAction > 18000 && !this.isThreadRunning) {
				this.isThreadRunning = true;
				
				// It's already been a while, so should be fairly safe to start running through
				this.takeUserAction(user);
			} else if (!this.isThreadRunning) {
				this.isThreadRunning = true;

				this.queueNewUserAction();
			} else {
				this.updateBlockQueueUI(false);
			}
		} else {
			// console.log(`NFTActionQueue: Ignoring repeat request to add ${user.screen_name} to queue`);
		}
	}

	updateBlockQueueUI(timeOut) {
		if (this.notif === null || this.notif.hasClass("is-expired")) {
			this._createNewNotification();
		}
		this.notifTitle.text(this.queue.length > 1 ? I18n("Blocking NFT avatar users") : I18n("Blocking NFT avatar user"));
		this.notifText.text(this.queue.length > 1 ? (this.queue.length + " users") : ("@" + this.queue[0].screen_name));

		if (timeOut) {
			this.notifLoading.attr("style", "right: 0");

			setTimeout(() => {
				this.notifLoading.attr("style", "right: 372px; transition-duration: " + timeOut + "ms");
			})
		}
	}

	queueNewUserAction() {
		let timeOut = this._randomTime();

		this.updateBlockQueueUI(timeOut);

		this.notif.attr("style", "display: block");

		let timeoutFunc = setTimeout(() => {
			this.takeUserAction(this.queue[0]);
		}, timeOut)

		this.notifButton.off("click").text(I18n("Cancel")).on("click", () => {
			clearTimeout(timeoutFunc);
			this.queue = [];
			this.isThreadRunning = false;
			setPref("mtd_nftActionQueue", []);

			$("li.Notification[data-id=\""+this.notifId+"\"] .Notification-closeButton").click();
			this.notif = null;
		});
	}

	undoUserAction(user) {
		if (typeof user !== "undefined") {
			switch(getPref("mtd_nftAvatarAction")) {
				case "nothing":
					break;
				case "mute":
					console.log(TD.controller.clients.getPreferredClient().unmuteUser(user?.id_str));
					console.log(`NFTActionQueue: Unmuted user ${user?.screen_name}`);
					break;
				case "block":
					console.log(TD.controller.clients.getPreferredClient().unblockUser(user?.screen_name));
					console.log(`NFTActionQueue: Unblocked user ${user?.screen_name}`);
					break;
			}
		}
	}

	takeUserAction(user) {
		this.lastAction = new Date();

		if (typeof user !== "undefined") {
			switch(getPref("mtd_nftAvatarAction")) {
				case "nothing":
					break;
				case "mute":
					console.log(TD.controller.clients.getPreferredClient().muteUser(user?.id_str));
					TD.controller.clients.getPreferredClient().addIdToMuteList(user?.id_str);
					console.log(`NFTActionQueue: Muted user ${user?.screen_name}`);
					break;
				case "block":
					console.log(TD.controller.clients.getPreferredClient().blockUser(user?.screen_name));
					TD.controller.clients.getPreferredClient().addIdToBlockList(user?.screen_name);
					console.log(`NFTActionQueue: Blocked user ${user?.screen_name}`);
					break;
			}

			this.queue = this.queue.filter(u => u.id_str !== user.id_str);
		}

		setPref("mtd_nftActionQueue", this.queue);

		if (this.queue.length > 0) {
			this.queueNewUserAction();
		} else {
			this.isThreadRunning = false;

			if (this.notif === null || this.notif.hasClass("is-expired")) {
				this._createNewNotification();
			}

			this.notif.attr("style", "display: block");
			this.notifTitle.text(I18n("Blocked NFT avatar user"));
			this.notifText.text("@" + user.screen_name);

			this.notifButton.off("click").text(I18n("Undo")).on("click", () => {
				this.undoUserAction(user);

				$("li.Notification[data-id=\""+this.notifId+"\"] .Notification-closeButton").click();
				this.notif = null;
			});
			
			this.clearNotificationTimeout = setTimeout(() => {
				$("li.Notification[data-id=\""+this.notifId+"\"] .Notification-closeButton").click();
				this.notif = null;
			}, 5000);
		}
	}

}