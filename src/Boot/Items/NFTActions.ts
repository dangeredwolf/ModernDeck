/*
	Boot/Items/NFTActions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import NFTActionQueue from "../../NFTActionQueue";
import { TwitterUserInternal } from "../../Types/TweetDeck";

export function hookNFTActions() {
	window.nftActionQueue = new NFTActionQueue;

	setTimeout(() => {
		console.log("Starting NFT actions module...");
		TD.services.TwitterUser.prototype.fromJSONObject_original = TD.services.TwitterUser.prototype.fromJSONObject;

		TD.services.TwitterUser.prototype.fromJSONObject = function(blob: TwitterUserInternal) {
			// console.log("fromJSONObject called", blob);
			const jsonObject = this.fromJSONObject_original(blob);

			jsonObject.hasNftAvatar = blob.ext_has_nft_avatar;

			if (blob.ext_has_nft_avatar === true) {
				// console.log("WARNING: NFT PERSON " + blob.screen_name);
				// console.log(blob);
				window.nftActionQueue.addUser(blob);
			}
			
			return jsonObject;
		};
	}, 0)
}
