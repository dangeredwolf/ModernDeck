/*
	NFTActionQueue.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export default class NFTActionQueue {
    queue = [];
    recentMutes = [];
    isThreadRunning = false;
    lastAction = 0;

    addUser(user) {
        console.log(`NFTActionQueue: Checking if user ${user.screen_name} is already dealt with`);
        if (this.queue.indexOf(user) === -1 && this.recentMutes.indexOf(user) === -1) {
            console.log(`NFTActionQueue: Adding user ${user.screen_name} to queue`);
            this.queue.push(user);
            this.recentMutes.push(user);

            if (new Date() - lastAction > 18000 && !this.isThreadRunning) {
                // It's already been a while, so should be fairly safe to start running through
                this.takeUserAction(user);
            }
        }
    }

    takeUserAction(user) {
        switch(getPref("mtd_nftAvatarAction")) {
            case "nothing":
                break;
            case "mute":
                // console.log(TD.controller.clients.getPreferredClient().muteUser(user.id_str));
                // TD.controller.clients.getPreferredClient().addIdToMuteList(user.id_str);
                console.log(`NFTActionQueue: Muted user ${user.screen_name}`);
                break;
        }

        this.queue = this.queue.filter(u => u.id_str !== user.id_str);

        if (this.queue.length > 0) {
            setTimeout(() => {
                this.takeUserAction(this.queue[0]);
            }, 15000 + (Math.random() * 5000))
        } else {
            this.isThreadRunning = false;
        }
    }

    

}