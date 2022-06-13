/*
	Boot/Items/Composer.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	Hooks the composer every time it resets to add the GIF and Emoji buttons, as well as fix the layout
*/

import { UIAlert } from "../../UIAlert";
import { isApp } from "../../Utils";
import { initGifPanel, checkGifEligibility } from "../../UIGifPicker";
// import { SettingsKey } from "../../Settings/SettingsKey";

const useNativeEmojiPicker = (): boolean => {
	return /*getPref(SettingsKey.NATIVE_EMOJI) && */ window.html.hasClass("mtd-supportsNativeEmojiPicker");
}

export const hookComposer = (): void => {

	if (window.html.hasClass("mtd-disable-css")) {
		return;
	}

	if (isApp && useNativeEmojiPicker()) {
		$(".mtd-emoji").click(() => {
			$(".js-compose-text").focus();
			window.require("electron").ipcRenderer.send("showEmojiPanel")
			$(".js-compose-text").focus();
		})
	}

	$(document).on("uiDrawerShowDrawer", () => {
		setTimeout(hookComposer,0) // initialise one cycle after tweetdeck does its own thing
	});

	$(".drawer[data-drawer=\"compose\"]>div>div").on("uiComposeImageAdded", () => {
		setTimeout(checkGifEligibility,0) // initialise one cycle after tweetdeck does its own thing

	}).on("uiComposeTweetSent",(e) => {
		$(".mtd-emoji-picker").addClass("hidden");
		setTimeout(checkGifEligibility,0);
		setTimeout(checkGifEligibility,510);
	}).on("uiComposeSendTweet",() => {
	});

	$(document).on("uiSendDm uiResetImageUpload uiComposeTweet", () => {
		setTimeout(checkGifEligibility, 0)
	});

	$(document).off("uiShowConfirmationDialog");

	$(document).on("uiShowConfirmationDialog", (a,b,c) => new UIAlert({
		title:b.title,
		message:b.message,
		buttonText:b.okLabel,
		button2Text:b.cancelLabel,
		button1Click:() => {
			$(document).trigger("uiConfirmationAction", {id:b.id, result:true});
			window.mtdPrepareWindows();
		},
		button2Click:() => {
			$(document).trigger("uiConfirmationAction", {id:b.id, result:false});
			window.mtdPrepareWindows();
		}
	}));


	initGifPanel();
	// UIEmojiPanel.attachEvents();
}