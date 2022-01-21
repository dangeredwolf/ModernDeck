/*
	NFTActionQueue.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref } from "./StoragePreferences";

export default class NFTActionQueue {
	queue = [];
	recentMutes = [];
	isThreadRunning = false;
	lastAction = 0;

	_randomTime() {
		return 10000 + (Math.random() * 5000);
	}

	addUser(user) {
		console.log(`NFTActionQueue: Checking if user ${user.screen_name} is already dealt with`);

		let dealtWith = false;

		// Check if we've already dealt with this user
		this.recentMutes.forEach(mutedUser => {
			if (mutedUser.screen_name === user.screen_name) {
				dealtWith = true;
			}
		});

		// Check if already muted or blocked
		if (TD.controller.clients.getPreferredClient().mutes[user.id_str] || TD.controller.clients.getPreferredClient().blocks[user.id_str]) {
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

		switch(getPref("mtd_nftAvatarAction")) {
			case "nothing":
				break;
			case "mute":
				console.log(TD.controller.clients.getPreferredClient().muteUser(user.id_str));
				TD.controller.clients.getPreferredClient().mutes[user.id_str] = true;
				TD.controller.clients.getPreferredClient().addIdToMuteList(user.id_str);
				console.log(`NFTActionQueue: Muted user ${user.screen_name}`);
				break;
		}

		this.queue = this.queue.filter(u => u.id_str !== user.id_str);

		if (this.queue.length > 0) {
			setTimeout(() => {
				this.takeUserAction(this.queue[0]);
			}, this._randomTime())
		} else {
			this.isThreadRunning = false;
		}
	}

	

}