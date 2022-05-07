/*
	Boot/Items/NavigationSetup.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { updateColumnTypes } from "../../Column";
import { attachColumnVisibilityEvents } from "../../ColumnVisibility";
import { getPref } from "../../StoragePreferences";
import { UILanguagePicker } from "../../UILanguagePicker";
import { UINavDrawer } from "../../UINavDrawer";
import { debugWelcome, UIWelcome } from "../../UIWelcome";
import { handleErrors } from "../../Utils";
import { hookComposer } from "./Composer";
import modalKeepOpen from "../../ModalKeepOpen";

export function navigationSetup(): void {

	if ($(".app-header-inner").length < 1) {
		setTimeout(navigationSetup,100);
		return;
	}

	handleErrors(modalKeepOpen, "Caught error in modalKeepOpen");

	if (getPref("mtd_last_lang") !== navigator.language) {
		new UILanguagePicker();
	}

	handleErrors(hookComposer, "Caught error in hookComposer");

	handleErrors((): void => {
		$(document).on("dataColumnOrder", () => {
			updateColumnTypes();
		});

		updateColumnTypes();
	}, "Caught error in updateColumnTypes event")

	UINavDrawer();

	if (!getPref("mtd_welcomed10") || debugWelcome) {
		handleErrors(() => {new UIWelcome()}, "Error in Welcome Screen");
	}

	$(".app-navigator>a").off("mouseenter").off("mouseover"); // disable tooltips for common items as they're superfluous (and also break styling)

	attachColumnVisibilityEvents();

	setInterval((): void => {
		if ($(".mtd-emoji").length <= 0) {
			handleErrors(hookComposer, "Caught error in hookComposer");
		}
	},1000);

	$(document).on("uiInlineComposeTweet",(e) => setTimeout(hookComposer, 0));
	$(document).on("uiDockedComposeTweet",(e) => setTimeout(hookComposer, 50));
	$(document).on("uiComposeClose",(e) => setTimeout(hookComposer, 50));
	$(document).on("uiComposeTweet",(e) => setTimeout(hookComposer, 0));

	$(document).on("uiComposeTweet", hookComposer);
	$(document).on("uiToggleTheme", hookComposer);
	$(document).on("uiDockedComposeTweet", hookComposer);
}
