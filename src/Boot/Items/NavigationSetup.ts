/*
	Boot/Items/NavigationSetup.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { updateColumnTypes } from "../../Column";
import { attachColumnVisibilityEvents } from "../../ColumnVisibility";
import { getPref, setPref } from "../../StoragePreferences";
import { UILanguagePicker } from "../../UILanguagePicker";
import { UINavDrawer } from "../../UINavDrawer";
import { debugWelcome } from "../../UIWelcome";
import { handleErrors } from "../../Utils";
import { hookComposer } from "./Composer";
import modalKeepOpen from "../../ModalKeepOpen";
import { SettingsKey } from "../../Settings/SettingsKey";
import { UIAlert } from "../../UIAlert";
import { I18n } from "../../I18n";

export function navigationSetup(): void {

	if ($(".app-header-inner").length < 1) {
		setTimeout(navigationSetup,100);
		return;
	}

	handleErrors(modalKeepOpen, "Caught error in modalKeepOpen");

	if (getPref(SettingsKey.LAST_LANGUAGE) !== navigator.language) {
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

	if (!getPref(SettingsKey.WELCOMED_10) || debugWelcome) {
		// handleErrors(() => {new UIWelcome()}, "Error in Welcome Screen");
	}

	if (!getPref(SettingsKey.EOL_WARNING)) {
		// Create UIAlert warning of the halt of feature development

		new UIAlert({title:I18n("ModernDeck is no longer being developed"),
		message:I18n("ModernDeck will no longer receive feature updates after over 8 years of development. You can still use ModernDeck until Twitter breaks it, but it will not receive new features and bug fixes will be limited."),
		buttonText:I18n("Learn More"),
		button1Click: () => {
			window.open("https://github.com/dangeredwolf/ModernDeck/issues/357")
		},
		button2Text:I18n("Dismiss"),
		button2Click: () => {
			window.mtdPrepareWindows();
			setPref(SettingsKey.EOL_WARNING, true);
		}
		});
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
