/*
	ModalKeepOpen.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License

	Based off the work of chylex's TweetDuck, MIT-licensed
	https://github.com/chylex/TweetDuck
	https://github.com/chylex/TweetDuck/blob/master/LICENSE.md
*/

import { SettingsKey } from "./Settings/SettingsKey";
import { getPref } from "./StoragePreferences";

export default function() {
	const prevSetTimeout = window.setTimeout;

	const getEvents = function(target: HTMLElement | Document) {
		// @ts-ignore This definitely does exist
		const jqData = $._data(target);
		return jqData.events;
	}
	
	const overrideState = function(): void {
		if (!getPref(SettingsKey.KEEP_MODALS_OPEN)) {
			return
		}
		
		// @ts-ignore TypeScript hates me redefining setTimeout
		window.setTimeout = function(_func: Function, timeout: number) {
			return timeout !== 500 && prevSetTimeout.apply(this, arguments);
		};
	};
	
	const restoreState = function(context: { state: { [x: string]: boolean; }; }, key: string): void {
		window.setTimeout = prevSetTimeout;
		
		if (getPref(SettingsKey.KEEP_MODALS_OPEN) && key in context.state) {
			context.state[key] = false;
		}
	};
	
	$(document).on("uiShowFavoriteFromOptions", function(): void {
		$(".js-btn-fav", ".js-modal-inner").each(function(): void {
			const event = getEvents(this).click[0];
			const handler = event.handler;
			
			event.handler = function() {
				overrideState();
				handler.apply(this, arguments);
				restoreState(getEvents(document)["dataFavoriteState"][0].handler.context, "stopSubsequentLikes");
			};
		});
	});
	
	$(document).on("uiShowFollowFromOptions", function(): void {
		$(".js-component", ".js-modal-inner").each(function(): void {
			const event = getEvents(this).click[0];
			const handler = event.handler;
			const context = handler.context;
			
			event.handler = function(): void {
				overrideState();
				handler.apply(this, arguments);
				restoreState(context, "stopSubsequentFollows");
			};
		});
	});
};