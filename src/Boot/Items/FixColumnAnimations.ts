/*
	Boot/Items/FixColumnAnimations.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// Fixes a bug (or oversight) in TweetDeck's JS caused by ModernDeck having different animations in column settings

import { mutationObserver } from "../../Utils";

export const fixColumnAnimations = () => {
	$(".column-scroller,.more-tweets-btn-container").each((a,b) => {
		let c: JQuery<HTMLElement> = $(b);
		mutationObserver(b,() => {
			if (typeof c.attr("style") !== "undefined") {
				let num = parseInt(c.attr("style").match(/[\-\d]+/g)[0]);
				let hasFilterOptionsVisible = false;
				try {
					hasFilterOptionsVisible = parseInt(c.parent().children(".column-options").children('.js-column-message[style]')[0].style.height.replace("px","")) > 0;
				} catch (e){}

				if ((!hasFilterOptionsVisible && num < 0) || (hasFilterOptionsVisible && num < 21))
					c.attr("style","top: " + ((!hasFilterOptionsVisible && "0") || "22") + "px;")
			}
		},{attributes:true});
	})
}