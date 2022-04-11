/*
	ModalKeepOpen.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License

	Based off the work of chylex's TweetDuck, MIT-licensed
	https://github.com/chylex/TweetDuck
	https://github.com/chylex/TweetDuck/blob/master/LICENSE.md
*/

import { getPref } from "./StoragePreferences";

export default function() {
	const prevSetTimeout = window.setTimeout;

	const getEvents = function(target) {
		const jqData = $._data(target);
		return jqData.events;
	}
	
	const overrideState = function() {
		if (!getPref("mtd_modalKeepOpen")) {
			return
		}
		
		window.setTimeout = function(func, timeout) {
			return timeout !== 500 && prevSetTimeout.apply(this, arguments);
		};
	};
	
	const restoreState = function(context, key) {
		window.setTimeout = prevSetTimeout;
		
		if (getPref("mtd_modalKeepOpen") && key in context.state) {
			context.state[key] = false;
		}
	};
	
	$(document).on("uiShowFavoriteFromOptions", function() {
		$(".js-btn-fav", ".js-modal-inner").each(function() {
			const event = getEvents(this).click[0];
			const handler = event.handler;
			
			event.handler = function() {
				overrideState();
				handler.apply(this, arguments);
				restoreState(getEvents(document)["dataFavoriteState"][0].handler.context, "stopSubsequentLikes");
			};
		});
	});
	
	$(document).on("uiShowFollowFromOptions", function() {
		$(".js-component", ".js-modal-inner").each(function() {
			const event = getEvents(this).click[0];
			const handler = event.handler;
			const context = handler.context;
			
			event.handler = function() {
				overrideState();
				handler.apply(this, arguments);
				restoreState(context, "stopSubsequentFollows");
			};
		});
	});
};