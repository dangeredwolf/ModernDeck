/*
	ColumnVisibility.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

import { updateColumnVisibility } from "./Column.js";

let lastScrollAt = Date.now();
let timeout = Date.now();

// https://gist.github.com/timhudson/5484248#file-jquery-scrollstartstop-js

function scrollStartStop() {
	var $this = $(this)

	if (Date.now() - lastScrollAt > 150)
		$this.trigger('scrollstart')

	lastScrollAt = Date.now()

	clearTimeout(timeout)

	timeout = setTimeout(function() {

	if (Date.now() - lastScrollAt > 149)
		$this.trigger('scrollend')
	}, 150)
}

export function attachColumnVisibilityEvents() {

	$(window).on("resize",updateColumnVisibility);

	$(".app-columns-container").on("scroll",scrollStartStop);
	$(".app-columns-container").on("scrollend",updateColumnVisibility);

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
