/*
	NFTActionQueue.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref, setPref } from "./StoragePreferences";

export default class NFTActionQueue {
	queue = getPref("mtd_nftActionQueue", []);
	recentMutes = [];
	isThreadRunning = false;
	lastAction = 0;

	_randomTime() {
		return 10000 + (Math.random() * 5000);
	}

	addUser(user) {
		console.log(`NFTActionQueue: Checking if user ${user.screen_name} is already dealt with`);

		let dealtWith = false;
		let actionToTake = getPref("mtd_nftAvatarAction")

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
			console.log(`NFTActionQueue: Adding user ${user.screen_name} to queue`);
			this.queue.push(user);
			this.recentMutes.push(user);
			
			if (new Date() - this.lastAction > 18000 && !this.isThreadRunning) {
				// It's already been a while, so should be fairly safe to start running through
				this.takeUserAction(user);
			} else {
				setTimeout(() => {
					this.takeUserAction(user);
				}, this._randomTime());
			}
		} else {
			console.log(`NFTActionQueue: Ignoring repeat request to add ${user.screen_name} to queue`);
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
			setTimeout(() => {
				this.takeUserAction(this.queue[0]);
			}, this._randomTime())
		} else {
			this.isThreadRunning = false;
		}
	}

}