/*
	MTDinject.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence

	Made with <3
*/

window.ModernDeck = 8;
import { version } from "../package.json";
window.SystemVersion = version.replace(".0.0",".0"); // remove trailing .0, if present

import { AsciiArtController } from "./AsciiArtController.js"
import { I18n, startI18nEngine } from "./I18n.js";
import { getPref, setPref } from "./StoragePreferences.js";
import { make, exists, isApp, mutationObserver, getIpc, handleErrors, formatNumberI18n } from "./Utils.js";
import { diag } from "./UIDiag.js";
import { _welcomeData } from "./DataWelcome.js";
import { debugWelcome, UIWelcome } from "./UIWelcome.js";
import { initGifPanel, checkGifEligibility } from "./UIGifPicker.js";
import { openSettings } from "./UISettings.js";
import { UINavDrawer } from "./UINavDrawer.js";
import { FunctionPatcher } from "./FunctionPatcher.js";
import { UILanguagePicker } from "./UILanguagePicker.js";
import { loginTextReplacer, checkIfSigninFormIsPresent } from "./UILoginController.js";
let welcomeData = _welcomeData;
import { allColumnsVisible, getColumnFromColumnNumber, getColumnNumber, updateColumnVisibility } from "./Column.js";
import i18nData from "./DataI18n.js";
window.i18nData = i18nData;

import { isStylesheetExtensionEnabled, enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "./StylesheetExtensions.js";

window.getPref = getPref;
window.setPref = setPref;
import { _newLoginPage } from "./DataMustaches.js";
window.newLoginPage = _newLoginPage;

import { processForceFeatureFlags } from "./ForceFeatureFlags.js";
import { loadPreferences, parseActions } from "./PrefHandler.js";

import { fromCodePoint } from "./EmojiHelper.js";
import { injectFonts } from "./FontHandler.js";


import { contextMenuFunctions } from "./ContextMenuFunctions.js";
import { clearContextMenu } from "./UIContextMenu.js";

import { keyboardShortcutHandler } from "./KeyboardShortcutHandler.js";
import { download } from "./DownloadController.js";
import { UIAlert } from "./UIAlert.js";
import { processMustaches } from "./MustachePatcher.js";
import { mtdAppFunctions } from "./AppController.js";

import { attachColumnVisibilityEvents } from "./ColumnVisibility.js";

window.mtdBaseURL = "https://raw.githubusercontent.com/dangeredwolf/ModernDeck/master/ModernDeck/";
// Defaults to obtaining assets from GitHub if MTDURLExchange isn't completed properly somehow

let loadEmojiPicker = false;

const forceFeatureFlags = false;

let replacedLoadingSpinnerNew = false;
let sendingFeedback = false;
window.useNativeContextMenus = false;
window.isDev = false;

window.useSafeMode = false;

window.isInWelcome = false;

window.loginInterval = undefined;
let store;

// We define these later. FYI these are jQuery objects.

window.head = undefined;
window.body = undefined;
window.html = undefined;

// This code changes the text to respond to the time of day, naturally

let mtdStarted = new Date();

if (mtdStarted.getHours() < 12) { // 12:00 / 12:00pm
	newLoginPage = newLoginPage.replace("Good evening!",I18n("Good morning!"));
} else if (mtdStarted.getHours() < 18) { // 18:00 / 6:00pm
	newLoginPage = newLoginPage.replace("Good evening!",I18n("Good afternoon!"));
} else {
	newLoginPage = newLoginPage.replace("Good evening!",I18n("Good evening!"));
}


/*
	Allows copying image to the clipboard from pasting, via context menu or Ctrl/Cmd + V
*/

function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {

	let items = pasteEvent.clipboardData.items;

	if(items == undefined || pasteEvent.clipboardData == false){
		return;
	};

	for (let i = 0; i < items.length; i++) {

		// Skip content if not image
		if (items[i].type.indexOf("image") == -1) continue;

		let blob = items[i].getAsFile();

		if (typeof(callback) == "function"){
			callback(blob);
		}
	}
}

/*
	Paste event to allow for pasting images in TweetDeck
*/

window.addEventListener("paste", (e) => {

	retrieveImageFromClipboardAsBlob(e, imageBlob => {

		if (imageBlob) {

			let buildEvent = jQuery.Event("dragenter",{originalEvent:{dataTransfer:{files:[imageBlob]}}});
			let buildEvent2 = jQuery.Event("drop",{originalEvent:{dataTransfer:{files:[imageBlob]}}});

			$(document).trigger(buildEvent);
			$(document).trigger(buildEvent2);
		}

	});

}, false);

if (typeof MTDURLExchange === "object" && typeof MTDURLExchange.getAttribute === "function") {
	mtdBaseURL = MTDURLExchange.getAttribute("type");
	console.info("MTDURLExchange completed with URL " + mtdBaseURL);
}

/*
	Moduleraid became a requirement for ModernDeck after they removed jQuery from the global context
	Hence why twitter sucks
*/

// let twitterSucks = document.createElement("script");
// twitterSucks.type = "text/javascript";
// twitterSucks.src = mtdBaseURL + "sources/libraries/moduleraid.min.js";
// document.head.appendChild(twitterSucks);



// This makes numbers appear nicer by overriding tweetdeck's original function which did basically nothing

function replacePrettyNumber() {

	TD.util.prettyNumber = (e) => {
		let howPretty = parseInt(e, 10);

		if (howPretty >= 100000000) {
			return formatNumberI18n(parseInt(howPretty/1000000)) + I18n("M");
		} else if (howPretty >= 10000000) {
			return formatNumberI18n(parseInt(howPretty/100000)/10) + I18n("M");
		} else if (howPretty >= 1000000) {
			return formatNumberI18n(parseInt(howPretty/10000)/100) + I18n("M");
		} else if (howPretty >= 100000) {
			return formatNumberI18n(parseInt(howPretty/1000)) + I18n("K");
		} else if (howPretty >= 10000) {
			return formatNumberI18n(parseInt(howPretty/100)/10) + I18n("K");
		}
		return formatNumberI18n(howPretty);
	}
}

/*
	Overrides removeChild functions of modals, tooltips, and dropdown menus to have a fade out effect
*/

function overrideFadeOut() {

	// here we add event listeners to add a fading out animation when a modal dialog is closed

	document.querySelectorAll(".js-modals-container")[0].removeChild = (rmnode) => {
		$(rmnode).addClass("mtd-fade-out");
		setTimeout(() => {
			rmnode.remove();
		},200);
	};

	// let's make sure we get any that might have initialised before mtdInit began

	$(document.querySelector(".application").childNodes).each((obj) => {
		($(document.querySelector(".application").childNodes)[obj] || obj).removeChild = (rmnode) => {
			$(rmnode).addClass("mtd-fade-out");
			setTimeout(() => {
				rmnode.remove();
			},200);
		};
	})

	$(".js-modal").on("removeChild", (rmnode) => {
		$(rmnode).addClass("mtd-fade-out");
		setTimeout(() => {
			rmnode.remove();
		},200);
	});

	// body's removeChild function is overriden to give tooltips their fade out animation

	body.removeChild = (i) => {
		if ($(i).hasClass("tooltip")) {
			setTimeout(() => {
				i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
			},300);
		} else {
			i.remove();
		}
	};
	setTimeout(() => {
		if (exists($(".app-navigator")[0])) {
			$(".app-navigator")[0].removeChild = (i) => {
				if ($(i).hasClass("dropdown-menu")) {
					$(i).addClass("mtd-fade-out");
					setTimeout(() => {
						i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
					},200);
				} else {
					i.remove();
				}
			};
		}
	},1000)

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

// begin moderndeck initialisation

async function mtdInit() {

	console.log("mtdInit");

	if (typeof document.getElementsByClassName("js-signin-ui block")[0] !== "undefined" && !replacedLoadingSpinnerNew && !html.hasClass("mtd-disable-css")) {
		document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
		replacedLoadingSpinnerNew = true;
	}

	// The default is dark for the loading screen, once the TD settings load it can use the user preference

	if (html.hasClass("mtd-disable-css")) {
		enableStylesheetExtension("micro");
	} else {
		enableStylesheetExtension("dark");
	}
	html.addClass("dark");

	handleErrors(injectFonts, "Caught error in injectFonts");


	// These check to see if critical TD variables are in place before proceeding


	await TD_mustaches;
	await TD;
	await TD.util;
	await TD_mustaches["login/login_form.mustache"];

	TD_mustaches["login/login_form.mustache"] = newLoginPage;

	/*
		Especially on Edge, but also on Chrome shortly after launch,
		sometimes the stylesheet isn't blocked by the network, which breaks the page heavily.
		This ensures that the stylesheet is manually removed so that it doesn't cause problems
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

	if (forceFeatureFlags) try {
		processForceFeatureFlags()
	} catch (e) {
		console.error("Caught error in processForceFeatureFlags");
		console.error(e);
		lastError = e;
	}

	handleErrors(replacePrettyNumber, "Caught error in replacePrettyNumber");
	handleErrors(overrideFadeOut, "Caught error in overrideFadeOut");
	handleErrors(processMustaches, "Caught error in processMustaches");
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

				let arr = getPref("mtd_collapsed_columns",[]);
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
				let arr = getPref("mtd_collapsed_columns",[]);
	 			let colNum = getColumnNumber($(ohGodThisIsEvenWorseWhatTheHeck));
	 			arr = arr.filter(num => num !== colNum)
				setPref("mtd_collapsed_columns",arr);
			}
		} catch (e) {

		}
		if ($(e.target).hasClass("mtd-emoji-code")) {
			let emojibtn = $(e.target.parentElement)
			let theEmoji = fromCodePoint(emojibtn.attr("data-code"));//twemoji.convert.fromCodePoint(emoji);
			let theInput = $(".compose-text")[0];
			let oS = theInput.scrollTop;

			if (!emojibtn.is(`.mtd-emoji-category[name="recent"]>.emojibtn`))
				pushRecentEmoji(theEmoji);

			if (theInput.setSelectionRange) {
				let sS = theInput.selectionStart;
				let sE = theInput.selectionEnd;
				theInput.value = theInput.value.substr(0, sS) + theEmoji + theInput.value.substr(sE);
				theInput.setSelectionRange(sS + theEmoji.length, sS + theEmoji.length);
			} else if (theInput.createTextRange) {
				document.selection.createRange().text = theEmoji;
			}

			theInput.focus();
			theInput.scrollTop = oS;
		}
	});

	navigationSetup();

}

// https://staxmanade.com/2017/02/how-to-download-and-convert-an-image-to-base64-data-url/

async function getBlobFromUrl(imageUrl) {
	let res = await fetch(imageUrl);
	let blob = await res.blob();

	return new Promise((resolve, reject) => {
		resolve(blob);
		return blob;
	})
}

function useNativeEmojiPicker() {
	return /*getPref("mtd_nativeEmoji") && */require?.("electron")?.remote?.app?.isEmojiPanelSupported?.();
}


/*
	Hooks the composer every time it resets to add the GIF and Emoji buttons, as well as fix the layout
*/

function hookComposer() {

	if (html.hasClass("mtd-disable-css")) {
		return;
	}

	// if (isApp && useNativeEmojiPicker() && loadEmojiPicker) {
	// 	$(".compose-text").after(
	// 		make("div").addClass("mtd-emoji").append(
	// 			make("div").addClass("mtd-emoji-button btn").append(
	// 				make("div").addClass("mtd-emoji-button-open").click(() => {
	// 					try {
	// 						require?.("electron")?.remote?.app?.showEmojiPanel?.();
	// 					} catch(e) {
	// 						console.error("Falling back to custom emoji area");
	// 						handleErrors(makeEmojiPicker, "Emoji Picker failed to initialise");
	// 					}
	// 				})
	// 			)
	// 		)
	// 	);
	// } else if (loadEmojiPicker) {
	// 	handleErrors(makeEmojiPicker, "Emoji Picker failed to initialise");
	// }

	// if ($(".compose-text-container .js-add-image-button,.compose-text-container .js-schedule-button,.compose-text-container .mtd-gif-button").length <= 0) {
	// 	$(".compose-text-container").append($(".js-add-image-button,.mtd-gif-button,.js-schedule-button,.js-dm-button,.js-tweet-button"));
	//
	// 	if ($(".inline-reply").length > 0) {
	// 		setTimeout(()=> {
	// 			$(".compose-text-container").append($(".drawer .js-send-button-container.spinner-button-container"));
	// 		},800)
	// 	} else {
	// 		$(".compose-text-container").append($(".drawer .js-send-button-container.spinner-button-container"));
	// 	}
	// }

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
		setTimeout(checkGifEligibility,0)
	});

	$(document).off("uiShowConfirmationDialog");

	$(document).on("uiShowConfirmationDialog", (a,b,c) => new UIAlert({
		title:b.title,
		message:b.message,
		buttonText:b.okLabel,
		button2Text:b.cancelLabel,
		button1Click:() => {
			$(document).trigger("uiConfirmationAction", {id:b.id, result:true});
			mtdPrepareWindows();
		},
		button2Click:() => {
			$(document).trigger("uiConfirmationAction", {id:b.id, result:false});
			mtdPrepareWindows();
		}
	}));


	initGifPanel();
}

/*
	Prepares modal dialogs, context menus, etc for a new modal popup, so we clear those things out.
*/

window.mtdPrepareWindows = () => {
	console.info("mtdPrepareWindows called");
	$("#update-sound,.js-click-trap").click();
	mtd_nav_drawer_background.click();

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

	if (getPref("mtd_last_lang") !== navigator.language) {
		new UILanguagePicker();
	}

	handleErrors(loadPreferences, "Caught error in loadPreferences");
	handleErrors(hookComposer, "Caught error in hookComposer");

	enableStylesheetExtension("donors");

	UINavDrawer();

	if (!getPref("mtd_welcomed") || debugWelcome) {
		handleErrors(new UIWelcome, "Error in Welcome Screen");
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

	if (typeof mR === "undefined") {
		setTimeout(coreInit,10);
		console.info("waiting on moduleRaid...");
		return;
	}

	handleErrors(AsciiArtController.draw, "Error occurred while trying to draw ModernDeck version easter egg")

	if (typeof $ === "undefined") {
		try {
			let jQuery = mR.findFunction('jQuery')[0];

			window.$ = jQuery;
			window.jQuery = jQuery;
		} catch (e) {
			console.error("jQuery failed. This will break approximately... everything.");
		}
	}

	head = $(document.head);
	body = $(document.body);
	html = $(document.querySelector("html"));




	if (isApp) {
		try {
			mtdAppFunctions();
			window.addEventListener('mousedown', (e) => {
				clearContextMenu();
			}, false);
		} catch(e) {
			console.error("An error occurred while running mtdAppFunctions");
			console.error(e);
			lastError = e;
		}
	}
	// append extra scripts
	head.append(
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/nquery.min.js"),
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/emojidata.js"),
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/twemoji.min.js"),
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/jquery.visible.js")
	);

	enableCustomStylesheetExtension("i18nCSS",`
	.recent-search-clear.list-item-last span:after {
		content:"${I18n("Clear")}";
	}
	.js-column-detail .column-title-back:before,.js-column-detail .column-title-back:after,.js-tweet-results .column-title-back:after,.js-tweet-social-proof-back:after {
		content:"${I18n("Tweet")}";
	}
	.js-tweet-social-proof-back:after {
		content:"${I18n("Interactions")}";
	}
	.js-hide-drawer.app-nav-tab:after {
		content:"${I18n("Close Account List")}";
	}
	.js-dm-participants-back:after {
		content:"${I18n("People")}";
	}
	.js-display-sensitive-media span:after {
		content:"${I18n("Show potentially sensitive media")}"
	}
	.contributor-detail>a:before {
		content:"${I18n("Change")}";
	}
	.microsoft-logo:after {
		content:"${I18n("Microsoft")}";
	}
	.pull-right>button[data-action="quote"]:after {
		content:"${I18n("Quote Tweet")}";
	}
	.mtd-mute-text-:before {
		content:"${I18n("Text ")}"
	}
	.mtd-mute-text-source:before {
		content:"${I18n("Source ")}"
	}
`)

	FunctionPatcher();


	mtdInit();

	window.addEventListener("keyup", keyboardShortcutHandler, false);
	mutationObserver(html[0], onElementAddedToDOM, {attributes: false, subtree: true, childList: true})

	checkIfSigninFormIsPresent();
	loginInterval = setInterval(checkIfSigninFormIsPresent, 500);
	console.info(`MTDinject ${SystemVersion} loaded`);

}

coreInit();
