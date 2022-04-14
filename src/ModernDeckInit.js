/*
	ModernDeckInit.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { AsciiArtController } from "./AsciiArtController";

import ModuleRaid from "moduleraid";
const mR = new ModuleRaid();
window.mR = mR;

import { AutoUpdateController } from "./AutoUpdateController";
import { PWAManifest } from "./PWAManifest";
import { I18n, startI18nEngine } from "./I18n";
import { getPref, setPref } from "./StoragePreferences";
import { make, exists, isApp, mutationObserver, getIpc, handleErrors, formatNumberI18n } from "./Utils";
import { debugWelcome, UIWelcome } from "./UIWelcome";
import { openSettings } from "./UISettings";
import { UINavDrawer } from "./UINavDrawer";
import { FunctionPatcher } from "./FunctionPatcher";
import { LanguageFunctionPatcher } from "./LanguageFunctionPatcher";
import { UILanguagePicker } from "./UILanguagePicker";
import { setupAME } from "./AME/AdvancedMuteEngine";
import { loginTextReplacer, checkIfSigninFormIsPresent } from "./UILoginController";
import { getColumnNumber, updateColumnTypes } from "./Column";
import i18nData from "./DataI18n";
window.i18nData = i18nData;
window.AutoUpdateController = AutoUpdateController;
import modalKeepOpen from "./ModalKeepOpen";
import NFTActionQueue from "./NFTActionQueue";
import { hookComposer } from "./Boot/Items/Composer";
import { overrideFadeOut } from "./Boot/Items/FadeOut"; 

import { enableStylesheetExtension, enableCustomStylesheetExtension } from "./StylesheetExtensions";

window.getPref = getPref;
window.setPref = setPref;
import { _newLoginPage } from "./DataMustaches";
window.newLoginPage = _newLoginPage;

import { processForceFeatureFlags } from "./ForceFeatureFlags";
import { loadPreferences, parseActions } from "./Settings/SettingsInit";
window.parseActions = parseActions;

import { injectFonts } from "./FontHandler";

import { clearContextMenu } from "./UIContextMenu";

import { keyboardShortcutHandler } from "./KeyboardShortcutHandler";
import { UIAlert } from "./UIAlert";
import { processMustaches } from "./MustachePatcher";
import { mtdAppFunctions } from "./AppController";

import { attachColumnVisibilityEvents } from "./ColumnVisibility";

import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

window.mtdBaseURL = null;

let loadEmojiPicker = false;

const forceFeatureFlags = false;
window.useSentry = true;

let replacedLoadingSpinnerNew = false;
window.useNativeContextMenus = false;
window.isDev = false;
window.useSafeMode = false;
window.isInWelcome = false;

window.loginInterval = undefined;
let store;

// We define these later. FYI these are jQuery objects.

window.head = null;
window.body = null;
window.html = null;

// This code changes the text to respond to the time of day, naturally

let mtdStarted = new Date();

if (mtdStarted.getHours() < 12) { // 12:00 / 12:00pm
	newLoginPage = newLoginPage.replace("Good evening",I18n("Good morning"));
} else if (mtdStarted.getHours() < 18) { // 18:00 / 6:00pm
	newLoginPage = newLoginPage.replace("Good evening",I18n("Good afternoon"));
} else {
	newLoginPage = newLoginPage.replace("Good evening",I18n("Good evening"));
}





// Fixes a bug (or oversight) in TweetDeck's JS caused by ModernDeck having different animations in column settings

function fixColumnAnimations() {
	$(".column-scroller,.more-tweets-btn-container").each((a,b) => {
		let c = $(b);
		mutationObserver(b,() => {
			if (typeof c.attr("style") !== "undefined") {
				let num = parseInt(c.attr("style").match(/[\-\d]+/g));
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

function hookNFTActions() {
	window.nftActionQueue = new NFTActionQueue;

	setTimeout(() => {
		console.log("Starting NFT actions module...");
		TD.services.TwitterUser.prototype.fromJSONObject_original = TD.services.TwitterUser.prototype.fromJSONObject;

		TD.services.TwitterUser.prototype.fromJSONObject = function(blob) {
			// console.log("fromJSONObject called", blob);
			const jsonObject = this.fromJSONObject_original(blob);

			jsonObject.hasNftAvatar = blob.ext_has_nft_avatar;

			if (blob.ext_has_nft_avatar === true) {
				// console.log("WARNING: NFT PERSON " + blob.screen_name);
				// console.log(blob);
				nftActionQueue.addUser(blob);
			}
			
			return jsonObject;
		};
	}, 0)
}

// begin moderndeck initialisation

function mtdInit() {
	if (typeof TD === "undefined" || typeof TD_mustaches === "undefined" || typeof TD_mustaches["login/login_form.mustache"] === "undefined" || typeof TD.util === "undefined") {
		setTimeout(mtdInit,0);
		return;
	}

	console.log("mtdInit");

	

	// The default is dark for the loading screen, once the TD settings load it can use the user preference

	if (html.hasClass("mtd-disable-css")) {
		enableStylesheetExtension("micro");
	} else {
		enableStylesheetExtension("dark");
	}
	html.addClass("dark");


	// These check to see if critical TD variables are in place before proceeding

	TD_mustaches["login/login_form.mustache"] = newLoginPage;

	/*
		In ModernDeck 8.0+ for extensions, we need to remove the TweetDeck
		stylesheet as it is no longer blocked with webRequest 
	*/

	let beGone = document.querySelector("link[rel='apple-touch-icon']+link[rel='stylesheet']");

	if (getPref("mtd_safemode")) {
		useSafeMode = true;
		html.addClass("mtd-disable-css");
		setPref("mtd_safemode",false)
	}

	if (exists(beGone) && !html.hasClass("mtd-disable-css")) {
		beGone.remove();
	}

	if (forceFeatureFlags)
		handleErrors(processForceFeatureFlags, "Caught error in processForceFeatureFlags");

	handleErrors(processMustaches, "Caught error in processMustaches");
	handleErrors(hookNFTActions, "Caught error in hookNFTActions");
	handleErrors(setupAME, "Caught error in Advanced Mute Engine");
	handleErrors(loginTextReplacer, "Caught error in loginTextReplacer");
	setTimeout(()=>handleErrors(loginTextReplacer, "Caught error in loginTextReplacer"),200);
	setTimeout(()=>handleErrors(loginTextReplacer, "Caught error in loginTextReplacer"),500);
	handleErrors(startI18nEngine, "Caught error in I18n Engine");

	setInterval(() => {
		if ($(".mtd-emoji").length <= 0 && loadEmojiPicker) {
			handleErrors(hookComposer, "Caught error in hookComposer");
		}
	},1000);

	$(document).on("uiInlineComposeTweet",(e) => setTimeout(hookComposer, 0));
	$(document).on("uiDockedComposeTweet",(e) => setTimeout(hookComposer, 50));
	$(document).on("uiComposeClose",(e) => setTimeout(hookComposer, 50));
	$(document).on("uiComposeTweet",(e) => setTimeout(hookComposer, 0));

	handleErrors(fixColumnAnimations, "Caught error in fixColumnAnimations");

	$(document).on("uiComposeTweet", hookComposer);
	$(document).on("uiToggleTheme", hookComposer);
	$(document).on("uiDockedComposeTweet", hookComposer);

	$(document).off("uiShowGlobalSettings");
	$(document).on("uiShowGlobalSettings", () => {
		openSettings();
	});

	$(document).on("mouseup",(e) => {
		try {
			if ($(e.target.parentElement).is("[data-action=\"mtd_collapse\"]")) {
				//                        i or span     button  .button-group   .button-tray     form .js-column-options .column-options .column-content .column-panel .column-holder .column
				let ohGodThisIsHorrible = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

				if ($(ohGodThisIsHorrible).hasClass("column-holder")) {
					ohGodThisIsHorrible = ohGodThisIsHorrible.parentElement;
				}
				$(ohGodThisIsHorrible).toggleClass("mtd-collapsed").find("[data-testid=\"optionsToggle\"],[data-action=\"options\"]").click();

				$(document).trigger("uiMTDColumnCollapsed");

				let arr = getPref("mtd_collapsed_columns", []);
				if ($(ohGodThisIsHorrible).hasClass("mtd-collapsed")) {
					arr.push(getColumnNumber($(ohGodThisIsHorrible)));
				} else {
					let colNum = getColumnNumber($(ohGodThisIsHorrible));
					arr = arr.filter(num => num !== colNum)
				}

				setPref("mtd_collapsed_columns",arr);

			} else if ($(e.target.parentElement).is("[data-testid=\"optionsToggle\"],[data-action=\"options\"]") &&
			$(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement).hasClass("mtd-collapsed")) {
				let ohGodThisIsEvenWorseWhatTheHeck = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
				if ($(ohGodThisIsEvenWorseWhatTheHeck).hasClass("column-holder")) {
					ohGodThisIsEvenWorseWhatTheHeck = ohGodThisIsEvenWorseWhatTheHeck.parentElement;
				}
				$(ohGodThisIsEvenWorseWhatTheHeck).removeClass("mtd-collapsed");
				$(document).trigger("uiMTDColumnCollapsed");
				let arr = getPref("mtd_collapsed_columns", []);
	 			let colNum = getColumnNumber($(ohGodThisIsEvenWorseWhatTheHeck));
	 			arr = arr.filter(num => num !== colNum)
				setPref("mtd_collapsed_columns",arr);
			}
		} catch (e) {

		}
	});

	navigationSetup();

}


/*
	Prepares modal dialogs, context menus, etc for a new modal popup, so we clear those things out.
*/

window.mtdPrepareWindows = () => {
	console.info("mtdPrepareWindows called");
	$("#update-sound,.js-click-trap").click();
	$("#mtd_nav_drawer_background").click();

	$(".js-modals-container>.ovl.mtd-login-overlay").remove();

	$(".js-modal[style=\"display: block;\"]").click();

	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
	$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
}

/*
	Sets up the navigation drawer, loads preferences, etc.
*/

function navigationSetup() {

	if ($(".app-header-inner").length < 1) {
		setTimeout(navigationSetup,100);
		return;
	}

	handleErrors(modalKeepOpen, "Caught error in modalKeepOpen");

	if (getPref("mtd_last_lang") !== navigator.language) {
		new UILanguagePicker();
	}

	handleErrors(loadPreferences, "Caught error in loadPreferences");

	handleErrors(hookComposer, "Caught error in hookComposer");

	handleErrors(() => {
		$(document).on("dataColumnOrder", () => {
			updateColumnTypes();
		});

		updateColumnTypes();
	}, "Caught error in updateColumnTypes event")

	UINavDrawer();

	window.UIWelcome = UIWelcome;

	if (!getPref("mtd_welcomed") || debugWelcome) {
		handleErrors(() => {new UIWelcome()}, "Error in Welcome Screen");
	}

	$(".app-navigator>a").off("mouseenter").off("mouseover"); // disable tooltips for common items as they're superfluous (and also break styling)

	attachColumnVisibilityEvents();
}

/*
	Controls certain things after they're added to the DOM
	Example: Dismissing dropdown menus, sentry error notification
*/

function onElementAddedToDOM(e) {
	let tar = $(e.target);

	if (tar.hasClass("dropdown")) {
		e.target.parentNode.removeChild = (dropdown) => {
			$(dropdown).addClass("mtd-fade-out");
			setTimeout(() => {
				dropdown.remove();
			},200);
		}
	} else if (tar.hasClass("overlay")) {
		if (!tar.hasClass("is-hidden")) {
			let observer = mutationObserver(e.target, (mutations) => {
				if (tar.hasClass("is-hidden")) {
					tar.addClass("mtd-fade-out");
					setTimeout(() => {
						tar.remove();
						observer.disconnect();
					},300);
				}
			},{ attributes: true, childList: false, characterData: false });
		}
	}
}

/*
	The first init function performed, even before mtdInit
	Also controls error reporting
*/

function coreInit() {
	handleErrors(PWAManifest.injectManifest, "Caught error while injecting PWA manifest");
	handleErrors(AutoUpdateController.initialize, "Caught error while initialising AutoUpdateController");

	try {
		let jQuery = mR.findConstructor("jQuery")[0][1];

		window.$ = jQuery;
		window.jQuery = jQuery;
	} catch (e) {
		console.error("jQuery failed. This will break approximately... everything.");
	}

	head = $(document.head);
	body = $(document.body);
	html = $(document.querySelector("html"));

	window.desktopConfig = {};




	if (isApp) {
		try {
			mtdAppFunctions();
			getIpc().send("getDesktopConfig");
			window.addEventListener('mousedown', (e) => {
				clearContextMenu();
			}, false);
		} catch(e) {
			console.error("An error occurred while running mtdAppFunctions");
			console.error(e);
			window.lastError = e;
		}
	}

	FunctionPatcher();
	LanguageFunctionPatcher();

	I18n.customTimeHandler = function(timeString) {
		if (window.mtdTimeHandler === "h12") {
			return timeString.replace(/\{\{hours24\}\}\:\{\{minutes\}\}/g,"{{hours12}}:{{minutes}} {{amPm}}")
		} else if (window.mtdTimeHandler === "h24") {
			return timeString.replace(/\{\{hours12\}\}\:\{\{minutes\}\} ?\{\{amPm\}\}/g,"{{hours24}}:{{minutes}}")
		} else {
			return timeString;
		}
	}


	mtdInit();

	window.addEventListener("keyup", keyboardShortcutHandler, false);
	mutationObserver(html[0], onElementAddedToDOM, {attributes: false, subtree: true, childList: true})

	checkIfSigninFormIsPresent();
	loginInterval = setInterval(checkIfSigninFormIsPresent, 500);
	console.info(`ModernDeck ${window.ModernDeck.versionFriendlyString}`);
	console.info("ModernDeckInit.coreInit completed. Good job.");

}

coreInit();
