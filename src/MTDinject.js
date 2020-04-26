/*
	MTDinject.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence

	Made with <3
*/

import buildId from "./buildId.js";
import { version } from "../package.json";
const SystemVersion = version.replace(".0",""); // remove trailing .0, if present

import { make, makeN, exists, isApp, mutationObserver, getIpc } from "./utils.js";
import { diag } from "./diag.js";
import { settingsData } from "./settingsData.js";
import { allColumnsVisible, getColumnFromColumnNumber, getColumnNumber, updateColumnVisibility } from "./column.js";

import { isStylesheetExtensionEnabled, enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "./stylesheetExtensions.js";

import {debugStorageSys, hasPref, getPref, setPref, purgePrefs} from "./prefStorage.js";
import { _newLoginPage, spinnerSmall, spinnerLarge, spinnerTiny, buttonSpinner } from "./mtdMustaches.js";
let newLoginPage = _newLoginPage;

import { processForceFeatureFlags } from "./forceFeatureFlags.js";

import { initGifPanel, checkGifEligibility } from "./gifPanel.js";
import { makeEmojiPicker, pushRecentEmoji } from "./emojipicker.js";
import { fromCodePoint } from "./emojiHelper.js";

const appendTextVersion = false;
const enablePatronFeatures = true;

let debugSettings = false;

window.mtdBaseURL = "https://raw.githubusercontent.com/dangeredwolf/ModernDeck/master/ModernDeck/";
// Defaults to obtaining assets from GitHub if MTDURLExchange isn't completed properly somehow

let lastError = undefined;
let loadEmojiPicker = true;

let loginIntervalTick = 0;

const forceFeatureFlags = false;
const useRaven = false;
const debugWelcome = false;

let replacedLoadingSpinnerNew = false;
let sendingFeedback = false;

let injectedFonts = false;

let ugltStarted = false;
let useNativeContextMenus = false;
window.isDev = false;

window.useSafeMode = false;

window.isInWelcome = false;

let lastScrollAt = Date.now();
let timeout = Date.now();

let store;
let loginInterval;
let offlineNotification;

// We define these later. FYI these are jQuery objects.

window.head = undefined;
window.body = undefined;
window.html = undefined;

import {contextMenuFunctions} from "./contextMenuFunctions.js";

// This code changes the text to respond to the time of day, naturally

let mtdStarted = new Date();

if (mtdStarted.getHours() < 12) { // 12:00 / 12:00pm
	newLoginPage = newLoginPage.replace("Good evening","Good morning");
} else if (mtdStarted.getHours() < 18) { // 18:00 / 6:00pm
	newLoginPage = newLoginPage.replace("Good evening","Good afternoon");
}

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

function attachColumnVisibilityEvents() {

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

/*
	Allows copying image to the clipboard from app context menu
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

// Alerts the app itself if it becomes offline

const forceAppUpdateOnlineStatus = (e) => {
	if (!require) {return;}
	const {ipcRenderer} = require('electron');
	ipcRenderer.send('online-status-changed', e)
}

if (typeof MTDURLExchange === "object" && typeof MTDURLExchange.getAttribute === "function") {
	mtdBaseURL = MTDURLExchange.getAttribute("type");
	console.info("MTDURLExchange completed with URL " + mtdBaseURL);
}

/*
	Moduleraid became a requirement for ModernDeck after they removed jQuery from the global context
	Hence why twitter sucks
*/

//if (!document.querySelector("html").classList.contains("mtd-nitroload")) {
	let twitterSucks = document.createElement("script");
	twitterSucks.type = "text/javascript";
	twitterSucks.src = mtdBaseURL + "sources/libraries/moduleraid.min.js";
	document.head.appendChild(twitterSucks);
//}


/*
	function getProfileInfo()

	Returns object of default account profile info, used to show your profile pic and background in nav drawer
*/

function getProfileInfo() {
	if (
		exists(TD) &&
		exists(TD.cache) &&
		exists(TD.cache.twitterUsers) &&
		exists(TD.cache.twitterUsers.getByScreenName) &&
		exists(TD.storage) &&
		exists(TD.storage.accountController) &&
		exists(TD.storage.accountController.getPreferredAccount) &&
		exists(TD.storage.accountController.getPreferredAccount("twitter")) &&
		exists(TD.storage.accountController.getPreferredAccount("twitter").state) &&
		exists(TD.storage.accountController.getPreferredAccount("twitter").state.username) &&
		TD.cache.twitterUsers.getByScreenName(TD.storage.accountController.getPreferredAccount("twitter").state.username).results.length > 0
	)
	{
		return TD.cache.twitterUsers.getByScreenName(TD.storage.accountController.getPreferredAccount("twitter").state.username).results[0];
	}
	else
	{
		return null;
	}
}

/*
	function loadPreferences()

	Loads preferences from storage and activates them
*/

function loadPreferences() {

	for (let key in settingsData) {

		if (!settingsData[key].enum) {
			for (let i in settingsData[key].options) {
				let prefKey = settingsData[key].options[i].settingsKey;
				let pref = settingsData[key].options[i];

				if (exists(prefKey)) {
					let setting;
					if (!hasPref(prefKey)) {
						if (debugStorageSys)
							console.log(`loadPreferences is setting default of ${prefKey} to ${pref.default}`);
						setPref(prefKey, pref.default);
						setting = pref.default;
					} else {
						setting = getPref(prefKey);
					}

					switch(pref.type) {
						case "checkbox":
							if (setting === true) {
								parseActions(pref.activate, undefined, true);
							} else {
								parseActions(pref.deactivate, undefined, true);
							}
							break;
						case "dropdown":
						case "textbox":
						case "textarea":
						case "array":
						case "slider":
							parseActions(pref.activate, setting, true);
							break;
						/* button/link controls we can skip, they don't do anything other than in the settings menu */
						case "button":
						case "link":
							break;
					}
				}
			}
		}
	}
}

/*
	https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server

	function download(filename, text)

	Initiates virtual browser download of filename __filename__ with contents __text__
*/

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}


function fontParseHelper(a) {
	if (typeof a !== "object" || a === null)
		throw "you forgot to pass the object";

	return "@font-face{font-family:'"+(a.family||"Roboto")+"';font-style:"+(a.style||"normal")+";font-weight:"+(a.weight || "400")+";src:url("+mtdBaseURL+"sources/fonts/"+a.name+"."+(a.extension || "woff2")+") format('"+(a.format || "woff2")+"');"+"unicode-range:"+(a.range||"U+0000-FFFF")+"}\n";
}

/*
	Here, we inject our fonts

	ModernDeck uses Roboto as its general font for Latin (and Cyrillic?) scripts
	Noto Sans is used for whatever scripts Roboto doesn't cover

	font family Material is short for Material icons
	font family MD is short for ModernDeck. It contains ModernDeck supplemental icons
*/

function injectFonts() {
	$(document.head).append(make("style").html(
		fontParseHelper({family:"MD",name:"mdvectors"}) +
		fontParseHelper({family:"Material",name:"MaterialIcons"}) +
		fontParseHelper({name:"Roboto-Regular"}) +
		fontParseHelper({weight:"500",name:"Roboto-Medium"}) +
		fontParseHelper({name:"Roboto-Italic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-Light"}) +
		fontParseHelper({weight:"500",name:"Roboto-MediumItalic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-LightItalic",style:"italic"}) +
		fontParseHelper({weight:"100",name:"Roboto-Thin"}) +
		fontParseHelper({weight:"100",name:"Roboto-ThinIalic",style:"italic"}) +
		fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansCJKjp-Medium",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans CJK",name:"NotoSansCJKjp-Regular",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHI-Medium",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHI-Regular",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArabic-Medium",
			range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArabic-Regular",
			range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArmenian-Medium",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArmenian-Regular",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBrahmi",range:"U+11000-1107F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBuginese",range:"U+1A00-1A1B,U+1A1E-1A1F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBuhid-Regular",range:"U+1740-1753"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCanadianAboriginal",range:"U+1400-167F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCarian-Regular",range:"U+102A0-102DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansChakma-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansCherokee-Medium",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansEthiopic-Medium",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansEthiopic-Regular",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGeorgian-Medium",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGeorgian-Regular",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGujaratiUI-Bold",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGujaratiUI",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHebrew-Bold",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHebrew-Regular",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansJavanese",range:"U+A980-A9DF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansKannadaUI-Bold",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKannadaUI",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKayahLi-Regular",range:"U+A900-A92F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansKhmerUI-Medium",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKhmerUI-Regular",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansLaoUI-Medium",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansLaoUI-Regular",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansLisu-Regular",range:"U+A4D0-A4FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansMalayalamUI-Bold",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansMalayalamUI",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansMyanmarUI-Bold",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansMyanmarUI-Regular",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansOriyaUI-Medium",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOriyaUI",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansOriyaUI-Bold",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOsage-Regular",range:"U+104B0-104FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOsmanya-Regular",range:"U+10480-104AF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansPhagsPa",range:"U+A840-A87F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansNewTaiLue-Regular",range:"U+1980-19DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansNKo-Regular",range:"U+07C0-07FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOlChiki-Regular",range:"U+1C50–1C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansRunic-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansShavian-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSinhalaUI-Regular",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansSinhalaUI-Medium",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSundanese",range:"U+1B80-1BBF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacEastern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacWestern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacEstrangela",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTagalog",range:"U+1700-171F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTagbanwa",range:"U+1760-177F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiLe",range:"U+1950-197F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiTham",range:"U+1A20-1AAF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiViet",range:"U+AA80-AADF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTamilUI-Regular",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTamilUI-Medium",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTeluguUI",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTeluguUI-Bold",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansThaana",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansThaana-Bold",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansThaiUI-Regular",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansThaiUI-Medium",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTibetan",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTibetan-Bold",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTifinagh-Regular",range:"U+2D30-2D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansVai-Regular",range:"U+A500-A63F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansYi-Regular",range:"U+A000-A48F"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono-Regular"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono-Medium"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono-Italic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"300",name:"RobotoMono-Light"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono-MediumItalic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"300",name:"RobotoMono-LightItalic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"100",name:"RobotoMono-Thin"}) +
		fontParseHelper({family:"RobotoMono",weight:"100",name:"RobotoMono-ThinIalic",style:"italic"})
	));
}
// This makes numbers appear nicer by overriding tweetdeck's original function which did basically nothing

function replacePrettyNumber() {

	TD.util.prettyNumber = (e) => {
		let howPretty = parseInt(e, 10);

		if (howPretty >= 100000000) {
			return parseInt(howPretty/1000000) + "M";
		} else if (howPretty >= 10000000) {
			return parseInt(howPretty/100000)/10 + "M";
		} else if (howPretty >= 1000000) {
			return parseInt(howPretty/10000)/100 + "M";
		} else if (howPretty >= 100000) {
			return parseInt(howPretty/1000) + "K";
		} else if (howPretty >= 10000) {
			return parseInt(howPretty/100)/10 + "K";
		} else if (howPretty >= 1000) {
			howPretty = howPretty.toString().substring(0,1) + "," + howPretty.toString().substring(1);
		}
		return howPretty;
	}
}

/*
	Enters safe mode, disabling most ModernDeck custom CSS. App-only right now.
*/

function enterSafeMode() {
	setPref("mtd_safemode",true);
	getIpc().send("restartApp");
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

/* modifies tweetdeck mustaches, replacing spinners, etc */

function processMustaches() {
	if (typeof TD_mustaches["settings/global_setting_filter_row.mustache"] !== "undefined")
		TD_mustaches["settings/global_setting_filter_row.mustache"] =
			'<li class="list-filter cf"> {{_i}}\
				<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div>\
				{{>text/global_filter_value}}{{/i}}\
				<input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative">\
			</li>';

	if (typeof TD_mustaches["column/column_options.mustache"] !== "undefined")
		TD_mustaches["column/column_options.mustache"] =
		TD_mustaches["column/column_options.mustache"].replace(
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn {{^isClearable}}is-invisible{{/isClearable}}" data-action="clear"> <i class="icon icon-clear-timeline"></i> <span class="label">{{_i}}Clear{{/i}}</span> </button> </div>`,
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn" data-action="mtd_collapse"> <i class='icon material-icon'>first_page</i> <span class="label">{{_i}}Collapse{{/i}}</span> </button> </div>` +
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn {{^isClearable}}is-invisible{{/isClearable}}" data-action="clear"> <i class="icon icon-clear-timeline"></i> <span class="label">{{_i}}Clear{{/i}}</span> </button> </div>`
		)

	if (!html.hasClass("mtd-disable-css")) {

		if (typeof TD_mustaches["column_loading_placeholder.mustache"] !== "undefined")
			TD_mustaches["column_loading_placeholder.mustache"] =
				TD_mustaches["column_loading_placeholder.mustache"].replace("<span class=\"spinner-small\"></span>",spinnerSmall);

		if (typeof TD_mustaches["spinner_large.mustache"] !== "undefined")
			TD_mustaches["spinner_large.mustache"] = spinnerLarge;

		if (typeof TD_mustaches["spinner_large_white.mustache"] !== "undefined")
			TD_mustaches["spinner_large_white.mustache"] = spinnerLarge;

		if (typeof TD_mustaches["spinner.mustache"] !== "undefined")
			TD_mustaches["spinner.mustache"] = spinnerSmall;

		if (typeof TD_mustaches["column.mustache"] !== "undefined")
			TD_mustaches["column.mustache"] =
				TD_mustaches["column.mustache"].replace("Loading...","");

		if (typeof TD_mustaches["media/media_gallery.mustache"] !== "undefined")
			TD_mustaches["media/media_gallery.mustache"] =
				TD_mustaches["media/media_gallery.mustache"].replace(
					'<div class="js-embeditem med-embeditem"> ',
					'<div class="js-embeditem med-embeditem"> ' + spinnerLarge
				);

		if (typeof TD_mustaches["modal.mustache"] !== "undefined")
			TD_mustaches["modal.mustache"] =
				TD_mustaches["modal.mustache"].replace(
					'<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}" />',
					spinnerSmall
				);

		if (typeof TD_mustaches["twitter_profile.mustache"] !== "undefined")
			TD_mustaches["twitter_profile.mustache"] =
				TD_mustaches["twitter_profile.mustache"].replace(
					'<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}">',
					spinnerSmall
				);

		if (typeof TD_mustaches["follow_button.mustache"] !== "undefined")
			TD_mustaches["follow_button.mustache"] =
				TD_mustaches["follow_button.mustache"].replace(
					'<img src="{{#asset}}/web/assets/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ',
					spinnerTiny
				);

		if (typeof TD_mustaches["video_preview.mustache"] !== "undefined")
			TD_mustaches["video_preview.mustache"] =
				TD_mustaches["video_preview.mustache"].replace(
					'<div class="processing-video-spinner"></div>',
					spinnerSmall
				);

		if (typeof TD_mustaches["login/2fa_verification_code.mustache"] !== "undefined")
			TD_mustaches["login/2fa_verification_code.mustache"] =
				TD_mustaches["login/2fa_verification_code.mustache"].replace(
					'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner"></i>',
					buttonSpinner
				);

		if (typeof TD_mustaches["login/login_form_footer.mustache"] !== "undefined")
			TD_mustaches["login/login_form_footer.mustache"] =
				TD_mustaches["login/login_form_footer.mustache"].replace(
					'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner"></i>',
					buttonSpinner
				);

		if (typeof TD_mustaches["compose/compose_inline_reply.mustache"] !== "undefined")
			TD_mustaches["compose/compose_inline_reply.mustache"] =
				TD_mustaches["compose/compose_inline_reply.mustache"].replace(
					'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>',
					buttonSpinner
				);

		if (typeof TD_mustaches["buttons/favorite.mustache"] !== "undefined")
			TD_mustaches["buttons/favorite.mustache"] =
				TD_mustaches["buttons/favorite.mustache"].replace(
					'<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>',
					buttonSpinner
				);

		if (typeof TD_mustaches["embed_tweet.mustache"] !== "undefined")
			TD_mustaches["embed_tweet.mustache"] =
				TD_mustaches["embed_tweet.mustache"].replace(
					'<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" class="embed-loading" alt="{{_i}}Loading…{{/i}}" />',
					spinnerSmall
				);

		if (typeof TD_mustaches["follow_button.mustache"] !== "undefined")
			TD_mustaches["follow_button.mustache"] =
				TD_mustaches["follow_button.mustache"].replace(
					'<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>',
					buttonSpinner
				);

		if (typeof TD_mustaches["lists/member.mustache"] !== "undefined")
			TD_mustaches["lists/member.mustache"] =
				TD_mustaches["lists/member.mustache"].replace(
					'<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>',
					buttonSpinner
				);

		if (typeof TD_mustaches["keyboard_shortcut_list.mustache"] !== "undefined")
			TD_mustaches["keyboard_shortcut_list.mustache"] =
				TD_mustaches["keyboard_shortcut_list.mustache"].replace(
					"<kbd class=\"text-like-keyboard-key\">X</kbd>  Expand/Collapse navigation</dd>",
					"<kbd class=\"text-like-keyboard-key\">Q</kbd> Open Navigation Drawer/Menu</dd>"
				)
	}
	if (typeof TD_mustaches["compose/docked_compose.mustache"] !== "undefined")
		TD_mustaches["compose/docked_compose.mustache"] =
			TD_mustaches["compose/docked_compose.mustache"].replace(
				'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>',
				buttonSpinner
			).replace("\"js-add-image-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled\"","\"js-add-image-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled\" data-original-title=\"Add images or video\"");


	if (typeof TD_mustaches["media/native_video.mustache"] !== "undefined")
		TD_mustaches["media/native_video.mustache"] =
			"<div class=\"position-rel\">\
			<iframe src=\"{{videoUrl}}\" class=\"js-media-native-video {{#isPossiblySensitive}}is-invisible{{/isPossiblySensitive}}\"\
			height=\"{{height}}\" width=\"{{width}}\" frameborder=\"0\" scrolling=\"no\" allowfullscreen style=\"margin: 0px; padding: 0px; border: 0px;\">\
			</iframe> {{> status/media_sensitive}} </div>";

	if (typeof TD_mustaches["menus/actions.mustache"] !== "undefined") {
		TD_mustaches["menus/actions.mustache"] =
			TD_mustaches["menus/actions.mustache"]
			.replace("Embed this Tweet","Embed Tweet")
			.replace("Copy link to this Tweet","Copy link address")
			.replace("Share via Direct Message","Share via message")
			//.replace("Like from accounts…","Like from...") // yeah idk why but this isn't in the context menu by default???
			.replace("Send a Direct Message","Send message")
			.replace("Add or remove from Lists…","Add/remove from list...")
			.replace("See who quoted this Tweet","View quotes")
			.replace("Flagged (learn more)","Flagged")
			.replace("Mute this conversation","Mute conversation")
			.replace("Unmute this conversation","Unmute conversation")
			.replace("Translate this Tweet","Translate Tweet")
			.replace("{{_i}}Delete{{/i}}","{{_i}}Delete Tweet{{/i}}")
			.replace(/\…/g,"...")
		;
	}
}

// Fixes a bug in TweetDeck's JS caused by ModernDeck having different animations in column settings

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

// replaces login page with moderndeck one

function loginTextReplacer() {
	if ($(".app-signin-wrap:not(.mtd-signin-wrap)").length > 0) {
		console.info("oh no, we're too late!");
		$(".app-signin-wrap:not(.mtd-signin-wrap)").remove();
		$(".login-container .startflow").html(newLoginPage);
		startUpdateGoodLoginText();
	}
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

	if (!injectedFonts) {
		try {
			injectFonts()
			injectedFonts = true;
		} catch (e) {
			console.error("Caught error in injectFonts");
			console.error(e);
			lastError = e;
		}
	}


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

	try {
		replacePrettyNumber()
	} catch(e) {
		console.error("Caught error in replacePrettyNumber");
		console.error(e);
		lastError = e;
	}

	try {
		overrideFadeOut()
	} catch(e) {
		console.error("Caught error in overrideFadeOut");
		console.error(e);
		lastError = e;
	}

	try {
		processMustaches()
	} catch(e) {
		console.error("Caught error in processMustaches");
		console.error(e);
		lastError = e;
	}

	try {
		loginTextReplacer();
		setTimeout(() => {
			loginTextReplacer();
		},200);
	} catch(e) {
		console.error("Caught error in loginTextReplacer");
		console.error(e);
		lastError = e;
	}

	setInterval(() => {
		if ($(".mtd-emoji").length <= 0 && loadEmojiPicker) {
			try {
				hookComposer()
			} catch(e) {
				console.error("Caught error in hookComposer");
				console.error(e);
				lastError = e;
			}
		}
	},1000);

	$(document).on("uiInlineComposeTweet",(e) => {
		setTimeout(() => {
			hookComposer();
		},0)
	});

	$(document).on("uiDockedComposeTweet",(e) => {
		setTimeout(() => {
			hookComposer();
		},50)
	});

	$(document).on("uiComposeClose",(e) => {
		setTimeout(() => {
			hookComposer();
		},50)
	});

	$(document).on("uiComposeTweet",(e) => {
		setTimeout(() => {
			hookComposer();
		},0)
	});

	try {
		fixColumnAnimations()
	} catch(e) {
		console.error("Caught error in fixColumnAnimations");
		console.error(e);
		lastError = e;
	}

	$(document).on("uiComposeTweet",hookComposer);
	$(document).on("uiToggleTheme",hookComposer);
	$(document).on("uiDockedComposeTweet",hookComposer);

	$(document).off("uiShowGlobalSettings");
	$(document).on("uiShowGlobalSettings",() => {
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

// Updates the "Good morning!" / "Good afternoon!" / "Good evening!"
// text on the login screen every once in a while (10s, ish)


function startUpdateGoodLoginText() {

	// Don't run if we already started
	if (ugltStarted) {
		return;
	}

	ugltStarted = true;


	// we've gotta update the image URL
	// we can't do this in the new login mustache because when it's initialised,
	// MTDURLExchange hasn't completed yet

	$(".startflow-background").attr("style",`background-image:url(${mtdBaseURL}sources/img/bg1.jpg)`)

	setInterval(() => {
		let text;
		let newDate = new Date();

		if (newDate.getHours() < 12) {
			text = "Good morning!";
		} else if (newDate.getHours() < 18) {
			text = "Good afternoon!";
		} else {
			text = "Good evening!";
		}

		$(".form-login h2").html(text);
	},10000);
}

// opens legacy tweetdeck settings

async function openLegacySettings() {
	await TD;
	await TD.components;
	await TD.components.GlobalSettings;

	$(".mtd-settings-panel").remove();
	new TD.components.GlobalSettings;
}

/*
	Processes Tweeten Settings import
	obj = object converted from the raw JSON
*/
function importTweetenSettings(obj) {

	setPref("mtd_customcss",(!!obj.dev ? obj.dev.customCSS || "" : ""))

	if (exists(obj.dev)) {
		setPref("mtd_inspectElement",obj.dev.mode);
	}

	if (exists(obj.TDSettings)) {
		TD.settings.setAutoPlayGifs(obj.TDSettings.gifAutoplay);
		if (exists(obj.TDSettings.gifAutoplay)) {
			TD.settings.setAutoPlayGifs(obj.TDSettings.gifAutoplay);
		}
		if (exists(obj.TDSettings.sensitiveData)) {
			TD.settings.setDisplaySensitiveMedia(obj.TDSettings.sensitiveData);
		}
		if (exists(obj.TDSettings.tweetStream)) {
			TD.settings.setUseStream(obj.TDSettings.tweetStream);
		}
		if (exists(obj.TDSettings.linkShortener)) {
			TD.settings.setLinkShortener(obj.TDSettings.linkShortener ? "bitly" : "twitter");
			if (obj.TDSettings.linkShortener.toggle === true && !!obj.TDSettings.linkShortener.bitlyApiKey && !!obj.TDSettings.linkShortener.bitlyUsername) {
				TD.settings.setBitlyAccount({
					login:obj.TDSettings.linkShortener.bitlyUsername || TD.settings.getBitlyAccount().login,
					apiKey:obj.TDSettings.linkShortener.bitlyApiKey || TD.settings.getBitlyAccount().apiKey
				});
			}
		}
	}

	if (exists(obj.customTitlebar)) {
		setPref("mtd_nativetitlebar",!obj.customTitlebar);
	}

	if (exists(obj.customization)) {
		setPref("mtd_columnwidth",obj.customization.columnWidth || getPref("mtd_columnwidth"));

		if (obj.customization.completeBlack === true) {
			setPref("mtd_theme","amoled");
		}

		setPref("mtd_noemojipicker",exists(obj.customization.emojis) ? obj.customization.emojis : false);
		setPref("mtd_newcharindicator",exists(obj.customization.charCount) ? !obj.customization.charCount : true);
		TD.settings.setTheme(obj.customization.theme || TD.settings.getTheme());

		if (exists(obj.customization.thinSB)) {
			setPref("mtd_scrollbar_style", (obj.customization.thinSB ? "scrollbarsnarrow" : "scrollbarsdefault"));
		}

		setPref("mtd_round_avatars",exists(obj.customization.roundAvi) ? obj.customization.roundAvi : true);

		if (exists(obj.customization.font)) {
			let percentage = 100;

			switch(obj.customization.font) {
				case "smallest":
					percentage = 90;
					break;
				case "smaller":
					percentage = 95;
					break;
				case "small":
					percentage = 100;
					break;
				case "large":
					percentage = 105;
					break;
				case "largest":
					percentage = 110;
					break;
			}

			setPref("mtd_fontsize",percentage);
		}
	}
}

/*
	Sanitises a string so we don't get silly XSS exploits (i sure as hell hope)
*/

function sanitiseString(str) {
	return str.replace(/\</g,"&lt;").replace(/\&/g,"&amp;").replace(/\>/g,"&gt;").replace(/\"/g,"&quot;")
}

/*
	Renders the patron display in the about page
*/

function renderPatronInfo(info, patronBox) {

	let scroller = make("div").addClass("mtd-auto-scroll scroll-v");

	let isInline = false;

	let metadataAvailable = typeof info.meta === "object";

	if (metadataAvailable) {
		if (exists(info.meta.inline)) {
			if (info.meta.inline === "true" || info.meta.inline === true) {
				isInline = true;
			}
		}
	}

	if ((exists(info.l1)) || (exists(info.l2))) {
		patronBox.append(make("h3").html(
			(metadataAvailable && typeof info.meta.title === "string") ? sanitiseString(info.meta.title) : "ModernDeck is made possible by people like you"
		))
	}

	if (exists(info.l1)) {

		let patronList = make("div").addClass("mtd-patron-list mtd-patron-list-level1");

		if (isInline) {
			patronList.addClass("mtd-patron-list-inline");
		}

		$(info.l1).each((a, b) => {
			patronList.append(
				make("p").addClass("mtd-patron-level mtd-patron-level-1").html(sanitiseString(b))
			)
		});

		scroller.append(patronList);
	}

	if (exists(info.l2)) {

		let patronList = make("div").addClass("mtd-patron-list mtd-patron-list-level2");

		if (isInline) {
			patronList.addClass("mtd-patron-list-inline");
		}

		$(info.l2).each((a, b) => {
			patronList.append(
				make("p").addClass("mtd-patron-level mtd-patron-level-2").html(sanitiseString(b))
			)
		});

		scroller.append(patronList);
	}

	patronBox.append(scroller);

	if ((exists(info.l1)) || (exists(info.l2))) {
		patronBox.append(
			make("button")
			.click(function() {
				window.open(this.getAttribute("data-url"))
			})
			.addClass("btn btn-primary mtd-patreon-button")
			.html((metadataAvailable && typeof info.meta.buttonText === "string") ? sanitiseString(info.meta.buttonText) : "Support on Patreon")
			.attr("data-url",(metadataAvailable && typeof info.meta.buttonLink === "string") ? sanitiseString(info.meta.buttonLink) : "https://www.patreon.com/ModernDeck")

		)
	}
}

/*
	Begins construction of the patron view for those who contribute on Patreon
*/

function makePatronView() {
	let patronBox = make("div").addClass("mtd-patron-render");

	$.ajax(
		{
			url:"https://api.moderndeck.org/v1/patrons/"
		}
	).done((e) => {
		let parsedJson;

		try {
			parsedJson = JSON.parse(e);
		} catch (e) {
			console.error("Error occurred while parsing JSON of patron data");
			console.error(e);
			lastError = e;
		} finally {
			renderPatronInfo(parsedJson, patronBox)
		}
	})
	.error((e) => {
		console.error("Error trying to fetch patron data");
		console.error(e);
		lastError = e;
	});

	return patronBox;
}

/*
	function openSettings()
	opens and settings panel, open to first page

	function openSettings(openMenu)
	opens and returns settings panel with string openMenu, the tabId of the corresponding settings page
*/

function openSettings(openMenu) {

	mtdPrepareWindows();

	let tabs = make("div").addClass("mtd-settings-tab-container mtd-tabs");
	let container = make("div").addClass("mtd-settings-inner");
	let panel = make("div").addClass("mdl mtd-settings-panel").append(tabs).append(container);


	for (var key in settingsData) {

		// if set to false (NOT UNDEFINED, this is an optional parameter), skip it
		if (settingsData[key].enabled === false || settingsData[key].visible === false) {
			continue;
		}

		var tab = make("button").addClass("mtd-settings-tab").attr("data-action",key).html(settingsData[key].tabName).click(function() {
			$(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected");
			$(this).addClass("mtd-settings-tab-selected");

			var theKey = key;

			/*
				calculates how far to move over the settings menu
				good thing arrays start at 0, as 0 would be 0px, it's the first one
			*/

			container.attr("data-page-selected", $(this).attr("data-action"));

			container.css("margin-left","-"+($(this).index()*700)+"px");
		});

		container.on("transitionend", () => {
			let visiblePage = container.attr("data-page-selected");
			container.children().filter(`:not([id=${visiblePage}])`).addClass("hidden");
		})

		container.on("transitionstart", () => {
			container.children().removeClass("hidden");
		})

		let subPanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id",key);

		if (!settingsData[key].enum && settingsData[key].enabled !== false && settingsData[key].visible !== false) {

			for (let prefKey in settingsData[key].options) {

				let pref = settingsData[key].options[prefKey];
				let option = make("div").addClass("mtd-settings-option").addClass("mtd-settings-option-"+pref.type);

				if (exists(pref.addClass)) {
					option.addClass(pref.addClass);
				}

				if (pref.enabled === false || pref.visible === false) {
					continue;
				}

				if (exists(pref.headerBefore)) {
					subPanel.append(
						make("h3").addClass("mtd-settings-panel-subheader").html(pref.headerBefore)
					);
				}

				if (exists(pref.settingsKey) && exists(pref.default) && !hasPref(pref.settingsKey)) {
					setPref(pref.settingsKey, pref.default);
				}

				let input,select,label,minimum,maximum,button,link;


				switch(pref.type) {

					case "checkbox":
						input = make("input").attr("type","checkbox").attr("id",prefKey).change(function() {
							if (pref.savePreference !== false) {
								setPref(pref.settingsKey,$(this).is(":checked"));
							}

							parseActions($(this).is(":checked") ? pref.activate : pref.deactivate, $(this).val());

						});

						if (exists(pref.settingsKey) && getPref(pref.settingsKey) === true) {
							input.attr("checked","checked");
						}

						if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							if (pref.queryFunction()) {
								input.attr("checked","checked");
							}
						}

						label = make("label").addClass("checkbox").html(pref.title).append(input);

						option.append(label);

						if (exists(pref.initFunc)) {
							pref.initFunc(select);
						}

						break;

					case "dropdown":
						select = make("select").attr("type","select").attr("id",prefKey).change(function() {
							if (pref.savePreference !== false) {
								setPref(pref.settingsKey,$(this).val());
							}
							parseActions(pref.activate, $(this).val());
						});

						for (let prefKey in pref.options) {
							if (!!(pref.options[prefKey].value)) {
								let newPrefSel = pref.options[prefKey];
								let newoption = make("option").attr("value",newPrefSel.value).html(newPrefSel.text);

								select.append(newoption);
							} else {

								let group = make("optgroup").attr("label",pref.options[prefKey].name)

								for (let subkey in pref.options[prefKey].children) {
									let newSubPrefSel = pref.options[prefKey].children[subkey];
									let newsuboption = make("option").attr("value",newSubPrefSel.value).html(newSubPrefSel.text);

									group.append(newsuboption);
								}

								select.append(group);
							}
						}

						if (exists(pref.settingsKey)) {
							select.val(getPref(pref.settingsKey));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							select.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(pref.title);

						option.append(label,select);

						if (exists(pref.initFunc)) {
							pref.initFunc(select);
						}

						break;

					case "textbox":
						input = make("input").attr("type","text").attr("id",prefKey);

						if (pref.instantApply === true) {
							input.on("input",function() {
								if (pref.savePreference !== false) {
									setPref(pref.settingsKey, $(this).val());
								}
								parseActions(pref.activate, $(this).val());
							});
						} else {
							input.change(function() {
								if (pref.savePreference !== false) {
									setPref(pref.settingsKey, $(this).val());
								}
								parseActions(pref.activate, $(this).val());
							});
						}

						if (exists(pref.settingsKey)) {
							input.val(getPref(pref.settingsKey));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(pref.title);

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,input);

						break;

					case "textarea":
						input = make("textarea").addClass("mtd-textarea").attr("id",prefKey).attr("rows","10").attr("cols","80").attr("placeholder",pref.placeholder || "").attr("spellcheck",false);

						if (pref.instantApply === true) {
							input.on("input",function() {
								if (pref.savePreference !== false) {
									setPref(pref.settingsKey, $(this).val());
								}
								parseActions(pref.activate, $(this).val());
							});
						} else {
							input.change(function() {
								if (pref.savePreference !== false) {
									setPref(pref.settingsKey, $(this).val());
								}
								parseActions(pref.activate, $(this).val());
							});
						}


						// https://sumtips.com/snippets/javascript/tab-in-textarea/
						input.keydown((e) =>
						{

							let kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
							if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey)
								// If it's a tab, but not Ctrl+Tab, Super+Tab, Shift+Tab, or Alt+Tab
							{
								let oS = input[0].scrollTop;
								if (input[0].setSelectionRange)
								{
									let sS = input[0].selectionStart;
									let sE = input[0].selectionEnd;
									input[0].value = input[0].value.substring(0, sS) + "\t" + input[0].value.substr(sE);
									input[0].setSelectionRange(sS + 1, sS + 1);
									input[0].focus();
								}
								input[0].scrollTop = oS;

								e.preventDefault();

								return false;
							}
							return true;
						});

						if (exists(pref.settingsKey)) {
							input.val(getPref(pref.settingsKey));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(pref.title);

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,input);

						break;

					case "slider":
						label = make("label").addClass("control-label");

						input = make("input").attr("type","range")
						.attr("min",pref.minimum)
						.attr("max",pref.maximum)
						.change(function() {
							if (pref.savePreference !== false) {
								setPref(pref.settingsKey, $(this).val());
							}
							parseActions(pref.activate, $(this).val());
						}).on("input",function() {
							label.html(`${pref.title} <b> ${$(this).val()} ${(pref.displayUnit || "")} </b>`);
						});

						if (exists(pref.settingsKey)) {
							input.val(parseInt(getPref(pref.settingsKey)));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction());
						} else if (exists(pref.default)) {
							input.val(pref.default);
						}

						label.html(pref.title + " <b> "+ input.val() + " " + (pref.displayUnit || "") + "</b>");

						maximum = make("label").addClass("control-label mtd-slider-maximum").html(pref.maximum + (pref.displayUnit || ""));
						minimum = make("label").addClass("control-label mtd-slider-minimum").html(pref.minimum + (pref.displayUnit || ""));

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,maximum,input,minimum);

						break;

					case "button":
						label = make("label").addClass("control-label").html(pref.label || "");

						button = make("button").html(pref.title).addClass("btn btn-positive mtd-settings-button")
						.click(() => {
							parseActions(pref.activate,true);
						});

						if (exists(pref.initFunc)) {
							pref.initFunc(button);
						}

						option.append(label,button);

						break;

					case "link":
						link = make("a").html(pref.label).addClass("mtd-settings-link")
						.click(() => {
							parseActions(pref.activate,true);
						});

						if (exists(pref.initFunc)) {
							pref.initFunc(link);
						}

						option.append(link);

						break;
				}

				subPanel.append(option);
			}
		} else if (settingsData[key].enum === "aboutpage") {
			let logo = make("i").addClass("mtd-logo icon-moderndeck icon");
			let h1 = make("h1").addClass("mtd-about-title").html("ModernDeck");
			let h2 = make("h2").addClass("mtd-version-title").html((appendTextVersion ? "Version " : "") + SystemVersion + " (Build " + buildId + ")");
			let logoCont = make("div").addClass("mtd-logo-container");

			if (!isApp) {
				logoCont.append(
					make("p").addClass("mtd-check-out-app").html("Did you know ModernDeck has a native app now? <a href='https://moderndeck.org/download'>Check it out!</a>")
				)
			}

			let info = make("p").html("Made with <i class=\"icon icon-heart mtd-about-heart\"></i> by <a href=\"https://twitter.com/dangeredwolf\" rel=\"user\" target=\"_blank\">dangeredwolf</a> in Columbus, OH since 2014<br><br>ModernDeck is <a href=\"https://github.com/dangeredwolf/ModernDeck/\" target=\"_blank\">an open source project</a> released under the MIT license.");
			let infoCont = make("div").addClass("mtd-about-info").append(info);

			logoCont.append(logo,h1,h2);

			subPanel.append(logoCont);

			let updateCont = makeUpdateCont();

			let patronInfo = make("div").addClass("mtd-patron-info").append(
				makePatronView()
			)

			if (isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
				subPanel.append(updateCont);
			}

			if (html.hasClass("mtd-winstore")) {
				subPanel.append(
					make("div").append(
						make("h2").addClass("mtd-update-h3 mtd-update-managed").html("Updates for this version of ModernDeck are managed by the Microsoft Store."),
						make("button").addClass("btn mtd-settings-button").html("Check for Updates").click(() => {
							open("ms-windows-store://updates");
						})
					)
				);
			} else if (html.hasClass("mtd-macappstore")) {
				subPanel.append(
					make("div").append(
						make("h2").addClass("mtd-update-h3 mtd-update-managed").html("Updates for this version of ModernDeck are managed by the App Store."),
						make("button").addClass("btn mtd-settings-button").html("Check for Updates").click(() => {
							open("macappstore://showUpdatesPage");
						})
					)
				);
			}

			subPanel.append(infoCont);

			if (enablePatronFeatures)
				subPanel.append(patronInfo);

		} else if (settingsData[key].enum === "mutepage") {

			let filterInput = make("input").addClass("js-filter-input").attr("name","filter-input").attr("size",30).attr("type","text").attr("placeholder","Enter a word or phrase")

			let selectFilterType = make("select").attr("name","filter").addClass("js-filter-types").append(
				make("option").attr("value","phrase").html("Words or phrases"),
				make("option").attr("value","source").html("Tweet source")
			).change(function() {
				filterInput.attr("placeholder", $(this).val() === "phrase" ? "Enter a word or phrase" : "eg Tweeten")
			});

			let muteButton = make("button").attr("name","add-filter").addClass("js-add-filter btn-on-dark disabled").html("Mute").click(() => {
				if (filterInput.val().length > 0) {
					TD.controller.filterManager.addFilter(selectFilterType.val(),filterInput.val(),false);

					updateFilterPanel(filterList);
				}
			});

			let muteTypes = make("div").addClass("control-group").append(
				make("label").attr("for","filter-types").addClass("control-label").html("Mute"),
				make("div").addClass("controls").append(selectFilterType)
			)

			let muteInput = make("div").addClass("control-group").append(
				make("label").attr("for","filter-input").addClass("control-label").html("Matching"),
				make("div").addClass("controls").append(filterInput)
			).on("input",function() {
				if ($(this).val().length > 0) {
					muteButton.removeClass("disabled");
				} else {
					muteButton.addClass("disabled");
				}
			});

			let muteAdd = make("div").addClass("control-group").append(
				make("div").addClass("controls js-add-filter-container").append(muteButton)
			)

			let filterList = make("ul");
			let filterListGroup = make("div").addClass("js-filter-list").append(filterList)

			let form = make("form").addClass("js-global-settings frm").attr("id","global-settings").attr("action","#").append(
				make("fieldset").attr("id","global_filter_settings").append(
					muteTypes,
					muteInput,
					muteAdd,
					filterListGroup
				)
			)

			updateFilterPanel(filterList);

			subPanel.append(form);
		}

		tabs.append(tab);
		container.append(subPanel);

		if (!exists(openMenu) && tab.index() === 0) {
			tab.addClass("mtd-settings-tab-selected");
			tab.click();
		}

		if (exists(openMenu) && openMenu === key) {
			tab.click();
		}
	}

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(panel);

	return panel;
}

/*
	mtdAlert(Object alertProps)

	alertProps is an object with the following options:

	String title: Title of the alert
	String message: Body message of the alert
	String buttonText: Button 1 text
	String button2Text: Button 2 text

	function button1Click: Button 1 click function
	function button2Click: Button 2 click function

	Note: make sure you call mtdPrepareWindows afterward to close the alert box

	String type: supported types are "confirm", "alert"
*/

function mtdAlert(obj) {

	var obj = obj || {};

	let alert = make("div").addClass("mdl mtd-alert");
	let alertTitle = make("h2").addClass("mtd-alert-title").html(obj.title || "ModernDeck");
	let alertBody = make("p").addClass("mtd-alert-body").html(obj.message || "Alert");
	let alertButtonContainer = make("div").addClass("mtd-alert-button-container");

	let alertButton = make("button").addClass("btn-primary btn mtd-alert-button").html(obj.buttonText || "OK");
	var alertButton2;

	alertButtonContainer.append(alertButton);

	if (exists(obj.button2Text) || obj.type === "confirm") {
		alertButton2 = make("button").addClass("btn-primary btn mtd-alert-button mtd-alert-button-secondary").html(obj.button2Text || "Cancel");
		alertButtonContainer.append(alertButton2);
		alertButton2.click(obj.button2Click || mtdPrepareWindows);
	}

	alertButton.click(obj.button1Click || mtdPrepareWindows);

	alert.append(alertTitle,alertBody,alertButtonContainer);

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(alert);
}

function updateFilterPanel(filterList) {
	let filters = TD.controller.filterManager.getAll();
	filterList.html("");

	for (let n in filters) {
		let myFilter = filters[n];

		filterList.append(
			make("li").addClass("list-filter").append(
				make("div").addClass("mtd-mute-text mtd-mute-text-" + (myFilter.type === "source" ? "source" : "")),
				make("em").html(myFilter.value),
				make("input").attr("type","button").attr("name","remove-filter").attr("value","Remove").addClass("js-remove-filter small btn btn-negative").click(() => {
					TD.controller.filterManager.removeFilter(myFilter);
					updateFilterPanel(filterList);
				})
			)
		);

	}

	return filterList;
}

/*
	Creates the update container
*/

function makeUpdateCont() {
	let updateCont = make("div").addClass("mtd-update-container").html('<div class="mtd-update-spinner preloader-wrapper small active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	let updateSpinner = $(".mtd-update-spinner");
	let updateIcon = make("i").addClass("material-icon hidden");
	let updateh2 = make("h2").addClass("mtd-update-h2").html("Checking for updates...");
	let updateh3 = make("h3").addClass("mtd-update-h3 hidden").html("");
	let tryAgain = make("button").addClass("btn hidden").html("Try Again");
	let restartNow = make("button").addClass("btn hidden").html("Restart Now")


	updateCont.append(updateIcon,updateh2,updateh3,tryAgain,restartNow);

	if (isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
		if (!html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
			mtdAppUpdatePage(updateCont,updateh2,updateh3,updateIcon,updateSpinner,tryAgain,restartNow);
		}
	}

	return updateCont;
}

let demoColumn = `<section class="column js-column will-animate"><div class="column-holder js-column-holder"><div class="flex flex-column height-p--100 column-panel"><header class="flex-shrink--0 column-header"><i class="pull-left icon column-type-icon icon-home"></i><div class="flex column-title flex-justify-content--space-between"><div class="flex column-header-title flex-align--center flex-grow--2 flex-wrap--wrap"><span class=column-heading>Home</span> <span class="txt-ellipsis attribution txt-mute txt-sub-antialiased vertical-align--baseline">@dangeredwolf</span></div></div></header><div class="flex flex-column height-p--100 mtd-example-column column-content flex-auto position-rel"><div class="position-rel column-scroller scroll-v"><div class="chirp-container js-chirp-container"><article class="is-actionable stream-item"><div class="item-box js-show-detail js-stream-item-content"><div class="js-tweet tweet"><header class="flex flex-align--baseline flex-row js-tweet-header tweet-header"><a class="account-link block flex-auto link-complex"><div class="position-rel item-img obj-left tweet-img"><img class="avatar pin-top-full-width tweet-avatar"src=https://pbs.twimg.com/profile_images/1134136444577091586/LBv0Nhjq_normal.png style=border-radius:10px!important></div><div class=nbfc><span class="txt-ellipsis account-inline"><b class="fullname link-complex-target">ModernDeck</b> <span class="txt-mute username">@ModernDeck</span></span></div></a><time class="txt-mute flex-shrink--0 tweet-timestamp"><a class="no-wrap txt-size-variable--12">now</a></time></header><div class="js-tweet-body tweet-body"><div class="txt-ellipsis nbfc txt-size-variable--12"></div><p class="js-tweet-text tweet-text with-linebreaks"style=padding-bottom:0>This tweet is quite light!</div></div><footer class="cf tweet-footer"><ul class="full-width js-tweet-actions tweet-actions"><li class="pull-left margin-r--10 tweet-action-item"><a class="position-rel tweet-action js-reply-action"href=# rel=reply><i class="pull-left icon txt-center icon-reply"></i> <span class="margin-t--1 pull-right txt-size--12 margin-l--2 icon-reply-toggle js-reply-count reply-count">1</span> <span class=is-vishidden>Reply</span> <span class=reply-triangle></span></a><li class="pull-left margin-r--10 tweet-action-item"><a class=tweet-action href=# rel=retweet><i class="pull-left icon txt-center icon-retweet icon-retweet-toggle js-icon-retweet"></i> <span class="margin-t--1 pull-right txt-size--12 icon-retweet-toggle js-retweet-count margin-l--3 retweet-count">4</span></a><li class="pull-left margin-r--10 tweet-action-item"><a class="position-rel tweet-action js-show-tip"href=# rel=favorite data-original-title=""><i class="pull-left icon txt-center icon-favorite icon-favorite-toggle js-icon-favorite"></i> <span class="margin-t--1 pull-right txt-size--12 margin-l--2 icon-favorite-toggle js-like-count like-count">20</span></a><li class="pull-left margin-r--10 tweet-action-item position-rel"><a class=tweet-action href=# rel=actionsMenu><i class="icon icon-more txt-right"></i></a></ul></footer><div class=js-show-this-thread></div></div></article></div></div></div></div><div class="flex flex-column height-p--100 column-panel column-detail js-column-detail"></div><div class="flex flex-column height-p--100 column-panel column-detail-level-2 js-column-social-proof"></div></div></section>`

let welcomeData = {
	welcome: {
		title: "<i class='icon icon-moderndeck icon-xxlarge mtd-welcome-head-icon' style='color:var(--secondaryColor)'></i>Welcome to ModernDeck!",
		body: "We're glad to have you here. Click Next to continue.",
		nextFunc: () => {
			if (!isApp || html.hasClass("mtd-winstore") || html.hasClass("mtd-macappstore")) {
				return;
			}
			const {ipcRenderer} = require('electron');
			ipcRenderer.send('checkForUpdates');
		}
	},
	update: {
		title: "Checking for updates...",
		body: "This should only take a few seconds.",
		html: "",
		enabled: false,
		nextText: "Skip"
	},
	theme: {
		title: "Pick a core theme",
		body: "There are additional options for themes in <i class='icon icon-settings'></i> <b>Settings</b>",
		html: `<div class="obj-left mtd-welcome-theme-picker">
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" onclick="parseActions(settingsData.themes.options.coretheme.activate,'dark');$('.mtd-welcome-inner .tweet-text').html('This tweet is quite dark!')" value="dark">
				Dark
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" onclick="parseActions(settingsData.themes.options.coretheme.activate,'light');$('.mtd-welcome-inner .tweet-text').html('This tweet is quite light!')" value="light">
				Light
			</label>
		</div>` + demoColumn,
		prevFunc: () => {
			if (!isApp || html.hasClass("mtd-winstore") || html.hasClass("mtd-macappstore")) {
				return;
			}
			const {ipcRenderer} = require('electron');
			ipcRenderer.send('checkForUpdates');
		},
		nextFunc: () => {
			let pos = getPref("mtd_headposition");
			if (pos === "top") {
				$("input[value='top']").click();
			} else if (pos === "classic") {
				$("input[value='classic']").click();
			} else {
				$("input[value='left']").click();
			}
		}
	},
	layout: {
		title: "Select a layout",
		body: "<b>Top:</b> Your column icons are laid out along the top. Uses navigation drawer.<br><b>Left:</b> Your column icons are laid out along the left side. Uses navigation drawer.<br><b>Left (Classic):</b> Left, but uses classic TweetDeck navigation methods instead of drawer.",
		html: `<div class="obj-left mtd-welcome-theme-picker">
			<label class="fixed-width-label radio">
			<input type="radio" name="layout" onclick="parseActions(settingsData.appearance.options.headposition.activate,'top')" value="top">
				Top
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="layout" onclick="parseActions(settingsData.appearance.options.headposition.activate,'left')" value="left">
				Left
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="layout" onclick="parseActions(settingsData.appearance.options.headposition.activate,'classic')" value="classic">
				Left (Classic)
			</label>
		</div>`,
		nextFunc: () => {
			if (getPref("mtd_headposition") === "classic") {
				$(".mtd-settings-subpanel:last-child .mtd-welcome-body").html(welcomeData.done.body.replace("YOU_SHOULDNT_SEE_THIS","the settings menu <i class='icon icon-settings'></i>"));
			}
			else {
				$(".mtd-settings-subpanel:last-child .mtd-welcome-body").html(welcomeData.done.body.replace("YOU_SHOULDNT_SEE_THIS","the navigation drawer <i class='icon mtd-nav-activator'></i>"));
			}
		}
	},
	done: {
		title: "You're set for now!",
		body: "Don't worry, there are plenty of other options to make ModernDeck your own.<br><br>These options are located in <i class='icon icon-settings'></i> <b>Settings</b>, accessible via YOU_SHOULDNT_SEE_THIS",
		html: ""
	}

}

/* Main thread for welcome screen */

function welcomeScreen() {

	isInWelcome = true;

	try {
		allColumnsVisible();
	} catch(e) {}

	welcomeData.update.enabled = isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore");
	welcomeData.update.html = makeUpdateCont();

	mtdPrepareWindows();

	disableStylesheetExtension("light");
	enableStylesheetExtension("dark");

	setTimeout(() => {
		$("#settings-modal").off("click");
	},0);
	$(".app-content,.app-header").remove();

	$(".application").attr("style",`background-image:url(${mtdBaseURL}sources/img/bg1.jpg)`)

	let container = make("div").addClass("mtd-settings-inner mtd-welcome-inner");
	let panel = make("div").addClass("mdl mtd-settings-panel").append(container);

	for (var key in welcomeData) {

		let welc = welcomeData[key];

		if (welc.enabled === false) {
			continue;
		}

		let subPanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id",key);


		subPanel.append(
			make("h1").addClass("mtd-welcome-head").html(welc.title),
			make("p").addClass("mtd-welcome-body").html(welc.body)
		);

		if (welc.html) {
			subPanel.append(
				make("div").addClass("mtd-welcome-html").html(welc.html)
			)
		}

		let button = make("button").html("<i class='icon icon-arrow-l'></i>Previous").addClass("btn btn-positive mtd-settings-button mtd-welcome-prev-button")
		.click(function() {
			$(".mtd-settings-inner").css("margin-left",((subPanel.index()-1) * -700)+"px")
			if (typeof welc.prevFunc === "function") {
				welc.prevFunc();
			}
		});

		let button2 = make("button").html((key === "update" ? "Skip" : "Next") + "<i class='icon icon-arrow-r'></i>").addClass("btn btn-positive mtd-settings-button mtd-welcome-next-button")
		.click(function() {
			$(".mtd-settings-inner").css("margin-left",((subPanel.index()+1) * -700)+"px");
			if (typeof welc.nextFunc === "function") {
				welc.nextFunc();
			}
		});

		if (key === "done") {
			button2.html("Done").off("click").click(() => {
				setPref("mtd_welcomed",true);
				window.location.reload();
			});
		}

		subPanel.append(button,button2);

		container.append(subPanel);
	}

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(panel);

	let theme = TD.settings.getTheme();
	if (theme === "dark") {
		$("input[value='dark']").click();
	} else if (theme === "light") {
		$("input[value='light']").click();
	}

	return panel;
}

/* Puts your profile picture and header in the navigation drawer :)  */

function profileSetup() {
	let profileInfo = getProfileInfo();
	if (profileInfo === null || typeof profileInfo === "undefined" || typeof profileInfo._profileBannerURL === "undefined" || profileInfo.profileImageURL === "undefined") {
		setTimeout(profileSetup,150);
		return;
	}
	let bannerPhoto = profileInfo._profileBannerURL.search("empty") > 0 ? "" : profileInfo._profileBannerURL;
	let avatarPhoto = profileInfo.profileImageURL.replace("_normal","");
	let name = profileInfo.name;
	let username = profileInfo.screenName;

	$(mtd_nd_header_image).attr("style","background-image:url(" + bannerPhoto + ");"); // Fetch header and place in nav drawer
	$(mtd_nd_header_photo).attr("src",avatarPhoto) // Fetch profile picture and place in nav drawer
	.mouseup(() => {
		let profileLinkyThing = $(document.querySelector(".account-settings-bb a[href=\"https://twitter.com/"+getProfileInfo().screenName+"\"]"));

		mtdPrepareWindows();
		if (profileLinkyThing.length > -1) {
			setTimeout(() => {
				profileLinkyThing.click();
			},200);
		}
	});
	$(mtd_nd_header_username).html(name); // Fetch twitter handle and place in nav drawer

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
	return getPref("mtd_nativeEmoji") && require("electron") && require("electron").remote && require("electron").remote.app && require("electron").remote.app.isEmojiPanelSupported();
}


/*
	Hooks the composer every time it resets to add the GIF and Emoji buttons, as well as fix the layout
*/

function hookComposer() {

	if (html.hasClass("mtd-disable-css")) {
		return;
	}

	if (isApp && useNativeEmojiPicker() && loadEmojiPicker) {
		$(".compose-text").after(
			make("div").addClass("mtd-emoji").append(
				make("div").addClass("mtd-emoji-button btn").append(
					make("div").addClass("mtd-emoji-button-open").click(() => {
						try {
							require("electron").remote.app.showEmojiPanel();
						} catch(e) {
							console.error("Falling back to custom emoji area")
							try {
								makeEmojiPicker();
							} catch (e) {
								console.error("emoji area failed to initialise");
								console.error(e);
							}
						}
					})
				)
			)
		);
	} else if (loadEmojiPicker) {
		try {
			makeEmojiPicker();
		} catch (e) {
			console.error("emoji area failed to initialise");
			console.error(e);
		}
	}

	if ($(".compose-text-container .js-add-image-button,.compose-text-container .js-schedule-button,.compose-text-container .mtd-gif-button").length <= 0) {
		$(".compose-text-container").append($(".js-add-image-button,.mtd-gif-button,.js-schedule-button,.js-dm-button,.js-tweet-button"));

		if ($(".inline-reply").length > 0) {
			setTimeout(()=> {
				$(".compose-text-container").append($(".drawer .js-send-button-container.spinner-button-container"));
			},800)
		} else {
			$(".compose-text-container").append($(".drawer .js-send-button-container.spinner-button-container"));
		}
	}

	$(document).on("uiDrawerShowDrawer",(e) => {
		setTimeout(hookComposer,0) // initialise one cycle after tweetdeck does its own thing
	});

	$(".drawer[data-drawer=\"compose\"]>div>div").on("uiComposeImageAdded",(e) => {
		setTimeout(checkGifEligibility,0) // initialise one cycle after tweetdeck does its own thing

	}).on("uiComposeTweetSent",(e) => {
		$(".mtd-emoji-picker").addClass("hidden");
		setTimeout(checkGifEligibility,0);
		setTimeout(checkGifEligibility,510);
	}).on("uiComposeSendTweet",() => {
	});

	$(document).on("uiSendDm uiResetImageUpload uiComposeTweet",(e) => {
		setTimeout(checkGifEligibility,0)
	});

	$(document).off("uiShowConfirmationDialog");

	$(document).on("uiShowConfirmationDialog",(a,b,c) => {
		mtdAlert({
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
		})
	});


	if ($(".mtd-gif-button").length <= 0) {
		initGifPanel();
	}
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

	try {
		loadPreferences()
	} catch(e) {
		console.error("Caught error in loadPreferences");
		console.error(e);
		lastError = e;
	}

	try {
		hookComposer()
	} catch(e) {
		console.error("Caught error in hookComposer");
		console.error(e);
		lastError = e;
	}

	enableStylesheetExtension("donors");

	$(".app-header-inner").append(
		make("a").attr("id","mtd-navigation-drawer-button").attr("data-original-title","Navigation Drawer").addClass("js-header-action mtd-drawer-button link-clean cf app-nav-link").html('<div class="obj-left"><div class="mtd-nav-activator"></div><div class="nbfc padding-ts"></div>')
		.click(() => {
			if (exists(mtd_nav_drawer_background)) {
				$("#mtd_nav_drawer_background").removeClass("hidden");
			}
			if (exists(mtd_nav_drawer)) {
				$("#mtd_nav_drawer").attr("class","mtd-nav-drawer");
			}
		})
	);

	$("body").append(
		make("div")
		.attr("id","mtd_nav_drawer")
		.addClass("mtd-nav-drawer hidden")
		.append(
			make("img").attr("id","mtd_nd_header_image").addClass("mtd-nd-header-image").attr("style",""),
			make("img").addClass("avatar size73 mtd-nd-header-photo").attr("id","mtd_nd_header_photo").attr("src","").click(() => {
				$('a[data-user-name="dangeredwolf"][rel="user"][href="#"]').click();
			}),
			make("div").addClass("mtd-nd-header-username").attr("id","mtd_nd_header_username").html("PROFILE ERROR<br>Tell @dangeredwolf i said hi"),
			make("button").addClass("btn mtd-nav-button mtd-nav-first-button").attr("id","tdaccsbutton").append(make("i").addClass("icon icon-user-switch")).click(() => {mtdPrepareWindows();$(".js-show-drawer.js-header-action").click();}).append("Your Accounts"),
			make("button").addClass("btn mtd-nav-button").attr("id","addcolumn").append(make("i").addClass("icon icon-plus")).click(() => {mtdPrepareWindows();TD.ui.openColumn.showOpenColumn()}).append("Add Column"),
			make("div").addClass("mtd-nav-divider"),
			make("button").addClass("btn mtd-nav-button").attr("id","kbshortcuts").append(make("i").addClass("icon icon-keyboard")).click(() => {
				mtdPrepareWindows();
				setTimeout(() => {$(".js-app-settings").click()},10);
				setTimeout(() => {$("a[data-action='keyboardShortcutList']").click()},20);
			}).append("Keyboard Shortcuts"),
			make("button").addClass("btn mtd-nav-button").attr("id","mtdsettings").append(make("i").addClass("icon icon-settings")).click(() => {openSettings()}).append("Settings"),
			make("div").addClass("mtd-nav-divider"),
			make("button").addClass("btn mtd-nav-button mtd-nav-group-expand").attr("id","mtd_nav_expand").append(make("i").addClass("icon mtd-icon-arrow-down").attr("id","mtd_nav_group_arrow")).click(() => {
				$("#mtd_nav_group").toggleClass("mtd-nav-group-expanded");
				$("#mtd_nav_group_arrow").toggleClass("mtd-nav-group-arrow-flipped");
				$("#mtd_nav_drawer").toggleClass("mtd-nav-drawer-group-open");
			}).append("More..."),
			make("div").addClass("mtd-nav-group mtd-nav-group-expanded").attr("id","mtd_nav_group").append(
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-changelog")).click(() => {
					mtdPrepareWindows();
					window.open("https://twitter.com/i/tweetdeck_release_notes");
				}).append("TweetDeck Release Notes"),
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon icon-search")).click(() => {
					mtdPrepareWindows();
					setTimeout(() => {$(".js-app-settings").click()},10);
					setTimeout(() => {$("a[data-action=\"searchOperatorList\"]").click()},20);
				}).append("Search Tips"),
				make("div").addClass("mtd-nav-divider"),
				make("button").addClass("btn mtd-nav-button").attr("id","mtd_signout").append(make("i").addClass("icon icon-logout")).click(() => {
					TD.controller.init.signOut();
				}).append("Sign Out"),
			),
			make("div").addClass("mtd-nav-divider mtd-nav-divider-feedback"),
			make("button").addClass("btn mtd-nav-button mtd-nav-button-feedback").attr("id","mtdfeedback").append(make("i").addClass("icon icon-feedback")).click(() => {
				window.open("https://github.com/dangeredwolf/ModernDeck/issues");
			}).append("Send Feedback")
		),
		make("div").attr("id","mtd_nav_drawer_background").addClass("mtd-nav-drawer-background hidden").click(function() {
			$(this).addClass("hidden");
			$(mtd_nav_drawer).addClass("hidden");

			$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
			$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
		})
	);
	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");

	$(".app-header-inner").append(
		make("div").addClass("mtd-appbar-notification mtd-appbar-notification-hidden").attr("id","MTDNotification")
	)

	try {
		if ((!!TD.config && !!TD.config.config_overlay && !!TD.config.config_overlay && !!TD.config.config_overlay.tweetdeck_dogfood)) {
			if (!!TD.config.config_overlay.tweetdeck_dogfood.value) {
				$(".mtd-nav-group").append(
					make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-command-pallete")).click(() => {
						mtdPrepareWindows();
						$(document).trigger("uiShowCommandPalette");
					}).append("Command Pallete"),
					make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-developer")).click(() => {
						mtdPrepareWindows();

						$(document).trigger("uiReload", {
							params: {
								no_dogfood: 1
							}
						});

					}).append("Disable Dev/Dogfood")
				)
			}
		}
	} catch(e) {
		console.error("An error occurred in navigationSetup while trying to verify if dev/dogfood features are enabled or not");
		console.error(e);
		lastError = e;
	}
	$(".mtd-nav-group-expanded").attr("style","height:"+$(".mtd-nav-group-expanded").height()+"px");

	if (!getPref("mtd_welcomed") || debugWelcome) {
		try {
			welcomeScreen();
		} catch(e) {
			console.error("Error in Welcome screen");
			console.error(e);
			lastError = e;
		}
	}

	$(".app-navigator>a").off("mouseenter").off("mouseover"); // disable tooltips for common items as they're superfluous (and also break styling)

	profileSetup();
	attachColumnVisibilityEvents();
}

/*
	Handles Keyboard shortcuts

	Ctrl+Shift+A -> Toggle outline accessibility option
	Ctrl+Shift+C -> Disable custom CSS (in case something went wrong and the user is unable to return to settings to clear it)
	Ctrl+Alt+D -> Enter diagnostic menu (for helping developers)
	Q -> Toggle navigation drawer (except Left Classic view)
*/

function keyboardShortcutHandler(e) {

	if (e.key.toUpperCase() === "A" && (e.ctrlKey) && e.shiftKey) { //pressing Ctrl+Shift+A toggles the outline accessibility option

		if ($("#accoutline").length > 0) {
			$("#accoutline").click();
		} else {
			settingsData.accessibility.options.accoutline.activate.func();
		}

	}
	if (e.key.toUpperCase() === "C" && (e.ctrlKey) && e.shiftKey) { //pressing Ctrl+Shift+C disabled user CSS
		console.info("User disabled custom CSS!");

		disableStylesheetExtension("customcss")

	}
	if (e.code === "KeyD" && (e.ctrlKey) && e.altKey) { //pressing Ctrl+Shift+C disabled user CSS
		console.info("Triggering diag!");

		try {
			diag()
		} catch (e) {
			console.error("An error occurred while creating the diagnostic report");
			console.error(e);
			lastError = e;
		}

	}
	if (e.key.toUpperCase() === "H" && (e.ctrlKey) && e.shiftKey) { //pressing Ctrl+Shift+H toggles high contrast
		console.info("User has pressed the proper key combination to toggle high contrast!");

		if ($("#highcont").length > 0) {
			$("#highcont").click();
		} else {
			if (getPref("mtd_highcontrast") === true) {
				settingsData.accessibility.options.highcont.deactivate.func();
			} else {
				settingsData.accessibility.options.highcont.activate.func();
			}
		}

	}
	if (e.keyCode === 81 && document.querySelector("input:focus,textarea:focus") === null) {
		if (getPref("mtd_headposition") !== "classic") {
			if ($(mtd_nav_drawer).hasClass("hidden")) {
				$("#mtd-navigation-drawer-button").click();
			} else {
				$(mtd_nav_drawer_background).click();
			}
		}
	}

}

/*
	Checks if the signin form is available.

	If so, it activates the login page stylesheet extension
*/

function checkIfSigninFormIsPresent() {

	if ($(".app-signin-form").length > 0 || $("body>.js-app-loading.login-container:not([style])").length > 0) {
		if (!html.hasClass("signin-sheet-now-present")) {
			html.addClass("signin-sheet-now-present");
		}

		loginIntervalTick++;
		enableStylesheetExtension("loginpage");

		if (loginIntervalTick > 5) {
			clearInterval(loginInterval);
		}
	} else {
		disableStylesheetExtension("loginpage");
		html.removeClass("signin-sheet-now-present");
	}

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
	} else if ($(e[0].addedNodes[0]).hasClass("sentry-error-embed-wrapper")) {

		$(e[0].addedNodes[0]).addClass("overlay");
		$(".sentry-error-embed").addClass("mdl");
		$(".sentry-error-embed-wrapper>style").remove();
		$("#id_email").parent().addClass("is-hidden");
		$("#id_email")[0].value = "a@a.com";

		if (sendingFeedback) {
			$(".form-submit>button.btn[type='submit']").html("Send Feedback");
			$(".sentry-error-embed>header>h2").html("Send feedback about ModernDeck");
			$(".sentry-error-embed>header>p").html("Other than your input, no personally identifiable information will be sent.");
			sendingFeedback = false;
		} else
			$(".sentry-error-embed>header>p").html("This tool lets you send a crash report to help improve ModernDeck.<br>Other than your input, no personally identifiable information will be sent.");

	}
}

/*
	Helper function that rounds a number to the nearest hundredth (2nd decimal)
*/

function roundMe(val) {
	return Math.floor(val * 100)/100;
}

/*
	function formatBytes(int val)

	Returns string: Number of bytes formatted into larger units (KB, MB, GB, TB)

	i.e. formatBytes(1000) -> "1 KB"
*/

function formatBytes(val) {
	if (val < 10**3) {
		return val + " bytes"
	} else if (val < 10**6) {
		return roundMe(val/10**3) + " KB"
	} else if (val < 10**9) {
		return roundMe(val/10**6) + " MB"
	} else if (val < 10**12) {
		return roundMe(val/10**9) + " GB"
	} else {
		return roundMe(val/10**12) + " TB"
	}
}

/* Controller function for app update page */

function mtdAppUpdatePage(updateCont, updateh2, updateh3, updateIcon, updateSpinner, tryAgain, restartNow) {

	const {ipcRenderer} = require('electron');

	ipcRenderer.on("error",(e,args,f,g) => {

		$(".mtd-welcome-inner").addClass("mtd-enable-update-next");

		updateh2.html("There was a problem checking for updates. ");
		$(".mtd-update-spinner").addClass("hidden");

		if (exists(args.code)) {
			updateh3.html(`${args.domain || ""} ${args.code || ""} ${args.errno || ""} ${args.syscall || ""} ${args.path || ""}`).removeClass("hidden");
		} else if (exists(f)) {
			updateh3.html(f.match(/^(Cannot check for updates: )(.)+\n/g)).removeClass("hidden")
		} else {
			updateh3.html("We couldn't interpret the error info we received. Please try again later or DM @ModernDeck on Twitter for further help.").removeClass("hidden");
		}

		updateIcon.html("error_outline").removeClass("hidden");
		tryAgain.removeClass("hidden").html("Try Again");
		restartNow.addClass("hidden");

	});

	ipcRenderer.on("checking-for-update", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html("Checking for updates...");
		updateh3.addClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
		$("[id='update'] .mtd-welcome-next-button").html("Skip<i class='icon icon-arrow-r'></i>");
	});

	ipcRenderer.on("update-available", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html("Updating...");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
	});

	ipcRenderer.on("download-progress", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html("Downloading update...");
		updateh3.html(Math.floor(args.percent)+"% complete ("+formatBytes(args.transferred)+"/"+formatBytes(args.total)+", "+formatBytes(args.bytesPerSecond)+"/s)").removeClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
	});


	ipcRenderer.on("update-downloaded", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		$(".mtd-update-spinner").addClass("hidden");
		updateIcon.html("update").removeClass("hidden");
		updateh2.html("Update downloaded");
		updateh3.html("Restart ModernDeck to complete the update").removeClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.removeClass("hidden");
	});


	ipcRenderer.on("update-not-available", (e,args) => {
		console.log(args);
		$(".mtd-update-spinner").addClass("hidden");
		updateh2.html("You're up to date");
		updateIcon.html("check_circle").removeClass("hidden");
		updateh3.html(SystemVersion + " is the latest version.").removeClass("hidden");
		tryAgain.removeClass("hidden").html("Check Again");
		restartNow.addClass("hidden");
		$(".mtd-welcome-inner").addClass("mtd-enable-update-next");
		$("[id='update'] .mtd-welcome-next-button").html("Next<i class='icon icon-arrow-r'></i>");
	});

	tryAgain.click(() => {
		ipcRenderer.send('checkForUpdates');
	})

	restartNow.click(() => {
		ipcRenderer.send('restartAndInstallUpdates');
	});

	ipcRenderer.send('checkForUpdates');
}

/*
	Notifies users of an app update
*/

function notifyUpdate() {
	mtdAlert({
		title:"Update ModernDeck",
		message:"An update is available for ModernDeck! Would you like to restart the app to install the update?",
		buttonText:"Restart Now",
		button2Text:"Later",
		button1Click:() => {
			mtdPrepareWindows();
			require("electron").ipcRenderer.send("restartAndInstallUpdates")
		}
	});
}

/*
	Create offline notification (probably because we're offline)
*/

function notifyOffline() {

	if (exists(offlineNotification)) {
		return;
	}

	let notifRoot = mR.findFunction("showErrorNotification")[0].showNotification({title:"Internet Disconnected",timeoutDelayMs:9999999999});
	let notifId = notifRoot._id;
	offlineNotification = $("li.Notification[data-id=\""+notifId+"\"]");
	let notifContent = $("li.Notification[data-id=\""+notifId+"\"] .Notification-content");
	let notifIcon = $("li.Notification[data-id=\""+notifId+"\"] .Notification-icon .Icon");

	if (offlineNotification.length > 0) {
		notifIcon.removeClass("Icon--notifications").addClass("mtd-icon-disconnected");

		notifContent.append(
			make("p").html("We detected that you are disconnected from the internet. Many actions are unavailable without an internet connection.")
		)
	}
}

/*
	Dismiss offline notification (probably because we're online again)
*/

function dismissOfflineNotification() {
	if (!exists(offlineNotification)) {return;}
	mR.findFunction("showErrorNotification")[0].removeNotification({notification:offlineNotification});
}

/*
	mtdAppFunctions() consists of functions to help interface
	from here (the renderer process) to the main process
*/

function mtdAppFunctions() {

	if (typeof require === "undefined") {return;}

	const { remote, ipcRenderer } = require('electron');

	const Store = require('electron-store');
	store = new Store({name:"mtdsettings"});


	// Enable high contrast if system is set to high contrast


	$(document).on("uiDrawerHideDrawer",(e) => {
		getIpc().send("drawerClose");
	});

	$(document).on("uiDrawerActive",(e) => {
		if (!$(".application").hasClass("hide-detail-view-inline"))
			getIpc().send("drawerOpen");
	});


	ipcRenderer.on("inverted-color-scheme-changed", (e, enabled) => {
		if (enabled && getPref("mtd_highcontrast") !== true) {
			try {
				settingsData.accessibility.options.highcont.activate.func();
			} catch(e){}
		}
	});

	ipcRenderer.on("color-scheme-changed", (e, theme) => {
		parseActions(settingsData.themes.options.coretheme.activate, theme);

	});

	ipcRenderer.on("disable-high-contrast", (e) => {
		console.info("DISABLING HIGH CONTRAST ");
		try {
			settingsData.accessibility.options.highcont.deactivate.func();
		} catch(e){}
	});

	ipcRenderer.on("aboutMenu", (e,args) => {
		if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0){
			$(".mtd-settings-tab[data-action=\"about\"]").click();
		} else {
			openSettings("about");
		}
	});

	ipcRenderer.on("update-downloaded", (e,args) => {
		if ($("#settings-modal[style='display: block;']>.mtd-settings-panel").length <= 0 && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
			notifyUpdate()
		}
	});

	ipcRenderer.on("openSettings", (e,args) => {
		openSettings();
	});

	ipcRenderer.on("accountsMan", (e,args) => {
		$(".js-show-drawer.js-header-action").click();
	});

	ipcRenderer.on("sendFeedback", (e,args) => {
		try {
			throw "Manually triggered feedback button";
		} catch(e) {
			Raven.captureException(e);
			Raven.showReportDialog();
		}
	});

	ipcRenderer.on("msgModernDeck", (e,args) => {
		$(document).trigger("uiComposeTweet", {
			type: "message",
			messageRecipients: [{
				screenName: "ModernDeck"
			}]
		})
	});

	ipcRenderer.on("newTweet", (e,args) => {
		$(document).trigger("uiComposeTweet");
	});

	ipcRenderer.on("newDM", (e,args) => {
		$(document).trigger("uiComposeTweet");
		$(".js-dm-button").click();
	});

	let minimise, maximise, closeButton;

	if (html.hasClass("mtd-js-app")) {
		if ($(".windowcontrols").length <= 0) {
			minimise = make("button")
			.addClass("windowcontrol min")
			.html("&#xE15B")


			maximise = make("button")
			.addClass("windowcontrol max")
			.html("&#xE3C6")


			if (html.hasClass("mtd-maximized")) {
				maximise.html("&#xE3E0")
			}

			closeButton = make("button")
			.addClass("windowcontrol close")
			.html("&#xE5CD")



			let windowcontrols = make("div")
			.addClass("windowcontrols")
			.append(minimise)
			.append(maximise)
			.append(closeButton);
			body.append(windowcontrols,
				make("div").addClass("mtd-app-drag-handle")
			);
		} else {
			minimise = $(".windowcontrol.min");
			maximise = $(".windowcontrol.max");
			closeButton = $(".windowcontrol.close");

			if (html.hasClass("mtd-maximized")) {
				maximise.html("&#xE3E0")
			}
		}

		minimise.click((data,handler) => {
			ipcRenderer.send('minimize');
		});

		maximise.click((data,handler) => {
			ipcRenderer.send('maximizeButton');
		});

		closeButton.click(() => {
			window.close();
		});

	}

	ipcRenderer.on('context-menu', (event, p) => {
		const electron = require("electron")
		let theMenu = buildContextMenu(p);
		let menu = electron.remote.menu;
		let Menu = electron.remote.Menu;

		if (useNativeContextMenus || useSafeMode) {
			//ipcRenderer.send('nativeContextMenu',theMenu);
			Menu.buildFromTemplate(theMenu).popup();
			return;
		} else {
			if (exists(theMenu))
				body.append(theMenu);
		}

	})

	const updateOnlineStatus = () => {

		if (!navigator.onLine) {
			notifyOffline();
		} else {
			dismissOfflineNotification();
		}

	}

	window.addEventListener("online", updateOnlineStatus);
	window.addEventListener("offline", updateOnlineStatus);

	updateOnlineStatus();
}

/*
	Helper function to create a context menu item
*/

function makeCMItem(p) {
	if (useNativeContextMenus) {
		let dataact = p.dataaction;
		let data = p.data;
		let nativemenu = { label:p.text, click() {contextMenuFunctions[dataact](data)}, enabled:p.enabled };
		//nativemenu.click = ;
		return nativemenu;
	}
	let a = make("a").attr("href","#").attr("data-action",p.dataaction).html(p.text).addClass("mtd-context-menu-item");
	let li = make("li").addClass("is-selectable").append(a);

	if (p.enabled === false) { // Crucially, also not undefined!
		a.attr("disabled","disabled");
	} else {
		//a.click(contextMenuFunctions[p.dataaction]);

		a.click(() => {
			if (p.mousex && p.mousey) {
				document.elementFromPoint(p.mousex, p.mousey).focus();
			}
			contextMenuFunctions[p.dataaction](p.data);
			clearContextMenu();
		});
	}

	return li;
}

/*
	Function that clears a context menu after it's been dismissed
*/

function clearContextMenu() {
	let removeMenu = $(".mtd-context-menu")
	removeMenu.addClass("mtd-fade-out").on("animationend",() => {
		removeMenu.remove();
	});
}

/*
	Helper function to create a context menu divider
*/

function makeCMDivider() {
	if (useNativeContextMenus) {
		return {type:'separator'}
	}
	return make("div").addClass("drp-h-divider");
}

/*
	Helper function for the app to construct context menus that will be displayed
*/

function buildContextMenu(p) {
	let items = [];
	let x = p.x;
	let y = p.y;

	const xOffset = 2;
	const yOffset = 12;

	if ($(".mtd-context-menu").length > 0) {
		let removeMenu = $(".mtd-context-menu");
		removeMenu.addClass("mtd-fade-out");
		removeMenu.on("animationend", () => {
			removeMenu.remove();
		})
	}

	if ($(document.elementFromPoint(x,y)).hasClass("mtd-context-menu-item")) {
		return;
	}

	if (p.isEditable || (exists(p.selectionText) && p.selectionText.length > 0)) {
		if (p.isEditable) {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"undo",text:"Undo",enabled:p.editFlags.canUndo}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"redo",text:"Redo",enabled:p.editFlags.canRedo}));
			items.push(makeCMDivider());
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"cut",text:"Cut",enabled:p.editFlags.canCut}));
		}
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copy",text:"Copy",enabled:p.editFlags.canCopy}));
		if (p.isEditable) {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"paste",text:"Paste",enabled:p.editFlags.canPaste}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"selectAll",text:"Select All",enabled:p.editFlags.canSelectAll}));
		}
		items.push(makeCMDivider());
	}

	if (p.linkURL !== '' && p.linkURL !== "https://tweetdeck.twitter.com/#") {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openLink",text:"Open link in browser",enabled:true,data:p.linkURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyLink",text:"Copy link address",enabled:true,data:p.linkURL}));
		items.push(makeCMDivider());
	}

	if (p.srcURL !== '') {
		if (exists(p.mediaType) && p.mediaType === "video") {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openImage",text:"Open video in browser",enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"saveImage",text:"Save video...",enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImageURL",text:"Copy video address",enabled:true,data:p.srcURL}));
		} else {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openImage",text:"Open image in browser",enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImage",text:"Copy image",enabled:true,data:{x:x,y:y}}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"saveImage",text:"Save image...",enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImageURL",text:"Copy image address",enabled:true,data:p.srcURL}));
		}

		items.push(makeCMDivider());
	}

	if (getPref("mtd_inspectElement") || isDev) {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"inspectElement",text:"Inspect element",enabled:true,data:{x:x,y:y}}));
	}

	if (debugSettings) {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"newSettings",text:"Settings",enabled:true,data:{x:x,y:y}}));
	}

	if (useNativeContextMenus) {
		return items;
	}

	let ul = make("ul");

	for(let i = 0; i < items.length; i++){
		ul.append(items[i]);
	}


	let menu = make("menu")
	.addClass("mtd-context-menu dropdown-menu")
	.attr("style","opacity:0;animation:none;transition:none")
	.append(ul);


	if (items.length > 0) {
		setTimeout(() => {

			if (x + xOffset + menu.width() > $(document).width()) {
				x = $(document).width() - menu.width() - xOffset - xOffset;
			}

			if (y + yOffset + menu.height() > $(document).height()) {
				y = $(document).height() - menu.height();
			}

			menu.attr("style",`left:${x + xOffset}px!important;top:${y + yOffset}px!important`)


		},20);
	} else {
		menu.addClass("hidden");
	}

	return menu;
}

/*
	This is used by the preference management system to activate preferences

	This allows for many simple preferences to be done completely in object notation with no extra JS
*/

function parseActions(a,opt,load) {
	for (let key in a) {
		switch(key) {
			case "enableStylesheet":
				enableStylesheetExtension(a[key]);
				break;
			case "disableStylesheet":
				disableStylesheetExtension(a[key]);
				break;
			case "htmlAddClass":
				if (!html.hasClass(a[key]))
					html.addClass(a[key]);
				break;
			case "htmlRemoveClass":
				html.removeClass(a[key]);
				break;
			case "func":
				if (typeof a[key] === "function") {
					try {
						a[key](opt, load);
					} catch (e) {
						console.error("Error occurred processing action function.");
						console.error(e);
						lastError = e;
						console.error("Dump of naughty function attached below");
						console.log(a[key])
					}
				} else {
					throw "There's a func action, but it isn't a function? :thinking:";
				}
				break;
		}
	}
}

/*
	The first init function performed, even before mtdInit
	Also controls error reporting
*/

function coreInit() {
	if (useRaven && typeof Raven === "undefined") {
		setTimeout(coreInit,10);
		console.info("waiting on raven...");
		return;
	}

	if (typeof mR === "undefined") {
		setTimeout(coreInit,10);
		console.info("waiting on moduleRaid...");
		return;
	}

	if (typeof $ === "undefined") {
		try {
			let jQuery = mR.findFunction('jQuery')[0];

			window.$ = jQuery;
			window.jQuery = jQuery;
		} catch (e) {
			console.error("jQuery failed. This will break approximately... everything.");
			//alert("ModernDeck was unable to find the page's jQuery runtime. This will result in application instability. Please notify @ModernDeck or @dangeredwolf of this issue immediately.");
		}
	}

	head = $(document.head);
	body = $(document.body);
	html = $(document.querySelector("html")); // Only 1 result; faster to find



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
	// append the emoji picker script
	head.append(
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/nquery.min.js"),
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/emojidata.js"),
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/twemoji.min.js"),
		make("script").attr("type", "text/javascript").attr("src", mtdBaseURL + "sources/libraries/jquery.visible.js")
	);


	if (useRaven) {
		Sentry.init({
			dsn: "https://92f593b102fb4c1ca010480faed582ae@sentry.io/242524",
		 	blacklistUrls: [
				/ton\.twimg\.com/i
		 	]
		});

		setTimeout(() => {
			try {
				mtdInit();
			} catch (e) {
				console.error(e);
				Sentry.captureException(e);
			}
		}, 10);

		try {
			window.addEventListener("keyup",keyboardShortcutHandler, false);
			mutationObserver(html[0], onElementAddedToDOM, {attributes: false, subtree: true, childList: true})

			checkIfSigninFormIsPresent();
			loginInterval = setInterval(checkIfSigninFormIsPresent, 500);
			console.info(`MTDinject ${SystemVersion} loaded`);
		} catch (e) {
			console.error(e);
			Sentry.captureException(e);
		}

	} else {

		mtdInit();

		window.addEventListener("keyup", keyboardShortcutHandler, false);
		mutationObserver(html[0], onElementAddedToDOM, {attributes: false, subtree: true, childList: true})

		checkIfSigninFormIsPresent();
		loginInterval = setInterval(checkIfSigninFormIsPresent, 500);
		console.info(`MTDinject ${SystemVersion} loaded`);
	}

}

coreInit();
