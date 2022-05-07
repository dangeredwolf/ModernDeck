/*
	ColumnVisibility.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { updateColumnVisibility } from "./Column";

let lastScrollAt: number = Date.now();
let timeout: number = Date.now();

// https://gist.github.com/timhudson/5484248#file-jquery-scrollstartstop-js

const scrollStartStop = function() : void {
	var $this: JQuery = $(this)

	if (Date.now() - lastScrollAt > 150)
		$this.trigger('scrollstart')

	lastScrollAt = Date.now()

	clearTimeout(timeout)

	timeout = window.setTimeout(function() {

	if (Date.now() - lastScrollAt > 149)
		$this.trigger('scrollend')
	}, 150)
}

export const attachColumnVisibilityEvents = () : void => {

	$(window).on("resize", updateColumnVisibility);

	$(".app-columns-container").on("scroll", scrollStartStop);
	$(".app-columns-container").on("scrollend", updateColumnVisibility);

	$(document).on(
		"uiInlineComposeTweet " +
		"uiDockedComposeTweet " +
		"uiComposeClose " +
		"uiDrawerHideDrawer " +
		"uiDrawerShowDrawer " +
		"uiColumnFocus " +
		"uiKeyLeft " +
		"uiKeyRight " +
		"uiMoveColumnAction " +
		"uiReload " +
		"uiNavigate " +
		"uiComposeTweet " +
		"uiMTDColumnCollapsed " +
		"uiColumnsScrollToColumn ",
		() => {
			setTimeout(() => {
				updateColumnVisibility();
			},400)
		}
	);
	updateColumnVisibility();
}
