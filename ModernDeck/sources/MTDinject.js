// MTDinject.js
// Copyright (c) 2019 Dangered Wolf

// made with love <3

"use strict";

var SystemVersion = "6.5.2E";
var MTDBaseURL = "https://rawgit.com/dangeredwolf/ModernDeck/stable/ModernDeck/"; // Defaults to streaming if using online client

var msgID,
FetchProfileInfo,
loginIntervalTick = 0;

var contextMenuNum = 0;

const forceFeatureFlags = false;

var messagesAccounted = [];

var MTDDark = true;

var addedColumnsLoadingTagAndIsWaiting,
replacedLoadingSpinnerNew,
loadedPreferences,
wasTweetSheetOpen,
profileProblem,
sendingFeedback,
hasOutCache,
TreatGeckoWithCare = false;

const welcomeEnabled = false;

var progress = null;

var isDev = false;

var FindProfButton,
loginInterval,
openModal;

var isChrome = typeof chrome !== "undefined"; // may also return true on chromium-based browsers like opera and edge chromium
var isOpera = typeof opera !== "undefined";
var isSafari = typeof safari !== "undefined";
var isEdge = typeof MSGesture !== "undefined";
var isFirefox = typeof mozInnerScreenX !== "undefined";
var isApp = typeof require !== "undefined";

var twitterSucks = document.createElement("script");
twitterSucks.type = "text/javascript";

var make = function(a){return $(document.createElement(a))};
var head,body,html = undefined;

var MTDStorage = {};

var contextMenuFunctions;


var welcomeScreenHtml = '<div class="mdl-content horizontal-flow-container"><div style="width:100%"class="l-column mdl-column mdl-column-lrg"><div class="l-column-scrollv scroll-v	scroll-alt"><h1>New in ModernDeck 6.0</h1><h2>Themes</h2><header class="js-column-header js-action-header column-header mtd-colours-demo"><i class="pull-left margin-hs column-type-icon icon icon-home"></i><h1 class="column-title txt-ellipsis"><span class="column-head-title">Home</span><span class="attribution txt-mute txt-sub-antialiased">@dangeredwolf</span></h1><a class="js-action-header-button column-header-link column-settings-link"><i class="icon icon-sliders"></i></a></header><p>People\'s personalities are far more than just black and white. Make your TweetDeck experience truly personal with a variety of styles to suit whatever your tastes might be. This and many of the other options are adjustable with <i class="icon icon-mtd-settings"></i><b>ModernDeck</b></p><h2>Refreshed Icons</h2><br><i class="icon icon-tweetdeck icon-xxlarge"></i><i class="icon icon-moderndeck icon-xxlarge"></i><i class="icon icon-hashtag icon-xxlarge"></i><i class="icon icon-retweet icon-xxlarge"></i><i class="icon icon-mtd-settings icon-xxlarge"></i><p style="padding-top:0">As of this release, 100% of icons are either created inhouse for ModernDeck, or are borrowed from the material design icon library. This includes the new Retweet icon, which was obvious from the beginning that an inhouse solution was mandatory.</p><h2>Refreshed UI</h2><p style="padding-top:0">ModernDeck 6.0 has a refreshed UI, taking advantage of an all-new edge-to-edge design that snaps to the left side. This helps take better advantage of screen real estate while still being elegant to use, and isn\'t a bad match with ModernDeck\'s navigation drawer.</p><h2>Tweet Shortener Assistant</h2><p style="padding-top:0">Have you ever dealt with a moment where you\'re just barely over the 140 character limit and need to cut down the size a bit? In ModernDeck 6.0, we have you covered. If you go over the 140 character limit, we\'ll prompt you with suggestions of what ways it detects will help shorten your tweet. This uses a number of algorithms such as checking for excess spacing and punctuation, to more advanced ones such as detecting and replacing applicable letters with liguatures, a Unicode feature that allows combining of certain letters to replace 2, 3, or sometimes even 4 characters, into what Twitter registers as just 1 character, and oftentimes looks about the same. All of these are suggestions, so you can click on the one you want, and you\'ll get no more, no less, than you asked for. Then you can finally send that Tweet, and you\'ve saved some precious time.</p><h3>Hearts or Stars</h3><p style="padding-top:0">ModernDeck allows you to pick between hearts and stars. The new default is hearts.</p><h3>Change How the Scroll Bar Looks</h3><p style="padding-top:0">In ModernDeck 6.0, you now have the option to change the scroll bar\'s appearance, such as either making it narrower, or making it never appear outright, to help build a cleaner TweetDeck experience to your specification.</p><h3>A New Option for dealing with Sensitive Media</h3><p style="padding-top:0">ModernDeck 6.0 also introduces another new feature, which changes the workflow of dealing with sensitive media, if you have it enabled to ask beforehand. Before, you had to click a tiny "View" link beforehand. Now, simply click anywhere on the designated background, and it will open up a preview of the image, as expected, but the thumbnail itself never shows content marked as sensitive.</p><h3>Faster and More Reliable CSS Extension Engine</h3><p style="padding-top:0">Building a truly versatile theming system wasn\'t as easy as slapping a feature on top of the old codebase. It\'s possible to do it that way, but it\'d hurt performance by creating extra overhead created by having to load all themes into memory at once, only to render one. Much of ModernDeck\'s CSS/UI codebase, kept in one single CSS file, has been broken up and componentified into separate silos, called CSS extensions, and besides critical system extensions, most of these extensions can be swapped in or out at any time, making it easier for the browser to discard an old theme, and load a new theme into memory, all transparently, in real-time, with virtually no hiccup on average, modern hardware. Any UI tweaks from themes to hearts to even more are now all extensions that run on top of ModernDeck. This architecture carries through much of the system now. For example, all animations are kept in animations.css. By keeping similar items in the same place, it makes it easier for the CSS to reference, as well as making it easier to develop ModernDeck in the future. This took an enormous amount of work, but now we\'re left with a more functional, stable, as well as modular ModernDeck.</p></div></div></div>';
// Asks MTDLoad for the storage
// window.postMessage({
// 	type: "getStorage"
//}, "*");

// Adds each key in the extension storage to MTDStorage
window.addEventListener("message", function(e) {
	console.log("Message received");
	console.log(e);
	if (e.source == window) {
		if (e.data.type == "sendStorage") {
			var settings = e.data.message;
			for (var key in settings) {
				MTDStorage.setItem(key, settings[key]);
			}
		}
	}
});

window.addEventListener("beforeunload",savePreferencesToDisk);

if (typeof MTDURLExchange === "object" && typeof MTDURLExchange.getAttribute === "function") {
	MTDBaseURL = MTDURLExchange.getAttribute("type") || "https://dangeredwolf.com/assets/mtdtest/";
	console.info("MTDURLExchange completed with URL " + MTDBaseURL);
}

twitterSucks.src = MTDBaseURL + "sources/libraries/moduleraid.min.js";
document.head.appendChild(twitterSucks);

if (typeof chrome === "undefined" && typeof safari === "undefined") {
	TreatGeckoWithCare = true;
}

function mutationObserver(obj,func,parms) {
	if (typeof MutationObserver !== "undefined") {
		(new MutationObserver(func)).observe(obj,parms);
	} else {
		if (parms.attributes) {
			html.on("DOMAttrModified",func);
			html.on("DOMAttributeNameChanged",func);
			html.on("DOMElementNameChanged",func);
		}
		if (parms.characterData) {
			html.on("DOMCharacterDataModified",func);
		}
		if (parms.subtree) {
			html.on("DOMSubtreeModified",func);
		}
		if (parms.childList) {
			html.on("DOMNodeInserted",func);
			html.on("DOMNodeRemoved",func);
		}
	}
}

function exists(thing) {
	return ((typeof thing === "object" && thing !== null && thing.length > 0) || !!thing === true || (typeof thing === "string") || (typeof thing === "number"));
}

function savePreferencesToDisk() {
	// var storage = {}
	// for(var i = 0; i < MTDStorage.length; i++){
	// 	var key = MTDStorage.key(i);
	// 	storage[key] = MTDStorage[key];
	// }

	// window.postMessage({
	// 	type: "setStorage",
	// 	message: MTDStorage
	// }, "*");
}

function isEnabledStylesheetExtension(name) {
	return !!document.querySelector("link.mtd-stylesheet-extension[href=\"" + MTDBaseURL + "sources/cssextensions/" + name + ".css\"\]");
}

function enableStylesheetExtension(name) {
	if (name === "default" || !exists($))
		return;

	var url = MTDBaseURL + "sources/cssextensions/" + name + ".css";

	if (!isEnabledStylesheetExtension(name)) {
		head.append(
			make("link")
			.attr("rel","stylesheet")
			.attr("href",url)
			.addClass("mtd-stylesheet-extension")
		)

		console.log("enableStylesheetExtension(\""+name+"\")");
	} else return;
}

function disableStylesheetExtension(name) {
	if (!isEnabledStylesheetExtension(name))
		return;
	console.log("disableStylesheetExtension(\""+name+"\")");
	$('head>link[href="' + MTDBaseURL + "sources/cssextensions/" + name + '.css"]').remove();
}

function getProfileInfo() {
	return TD.cache.twitterUsers.getByScreenName(TD.storage.accountController.getPreferredAccount("twitter").state.username).results[0];
}

function getAccountStatus() {
	return TD.storage.accountController.getPreferredAccount("twitter");
}

function getAllAccountStatus() {
	return TD.storage.accountController.getAccountsForService("twitter");
}

function loadPreferences() {
	disableStylesheetExtension("loginpage");

	if (getPref("mtd_round_avatars") === false)
		enableStylesheetExtension("squareavatars");
	else
		setPref("mtd_round_avatars",true);

	if (getPref("mtd_undocked_modals") === true)
		enableStylesheetExtension("undockedmodals");
	else
		setPref("mtd_undocked_modals",false);

	if (getPref("mtd_hearts") === true)
		enableStylesheetExtension("hearticon");
	else if (getPref("mtd_hearts") !== false)
		setPref("mtd_hearts",true);

	if (getPref("mtd_sensitive_alt") === true)
		enableStylesheetExtension("altsensitive");
	else if (getPref("mtd_sensitive_alt") !== false)
		setPref("mtd_sensitive_alt",false);

	if (getPref("mtd_outlines") === true)
		html.addClass("mtd-acc-focus-ring");
	else
		setPref("mtd_outlines",false);

	if (getPref("mtd_theme") !== "" && getPref("mtd_theme") !== null && typeof getPref("mtd_theme") !== "undefined")
		enableStylesheetExtension(getPref("mtd_theme"));

	if (getPref("mtd_scrollbar_style") !== "" && getPref("mtd_scrollbar_style") !== null && typeof getPref("mtd_scrollbar_style") !== "undefined")
		enableStylesheetExtension(getPref("mtd_scrollbar_style"));
}

function getPref(id) {
	if ((localStorage[id] ? localStorage[id] : MTDStorage[id]) === "true")
		return true;
	else if ((localStorage[id] ? localStorage[id] : MTDStorage[id]) === "false")
		return false;
	else
		return (localStorage[id] ? localStorage[id] : MTDStorage[id]);
}

function setPref(id,p) {
	//MTDStorage[id] = p;
	localStorage[id] = p;
	//savePreferencesToDisk();
}

function GetURL(url) {
	return MTDBaseURL + url;
}

function fontParseHelper(a) {
	if (typeof a !== "object" || a === null)
		throw "you forgot to pass the object";

	return "@font-face{font-family:'"+(a.family||"Roboto")+"';font-style:"+(a.style||"normal")+";font-weight:"+(a.weight || "400")+";src:url("+MTDBaseURL+"sources/fonts/"+a.name+"."+(a.extension || "woff2")+") format('"+(a.format || "woff2")+"');"+"unicode-range:"+(a.range||"U+0000-FFFF")+"}\n";
}

function MTDInit(){
	console.log("MTDInit");
	if (typeof document.getElementsByClassName("js-signin-ui block")[0] !== "undefined" && !replacedLoadingSpinnerNew) {
		document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
		replacedLoadingSpinnerNew = true;
	}
	if (
		typeof TD_mustaches === "undefined" ||
		typeof TD === "undefined" ||
		typeof TD.util === "undefined" ||
		typeof TD.util.prettyTimeString === "undefined" ||
		typeof TD_mustaches["settings/global_setting_filter_row.mustache"] === "undefined"
	) {
		setTimeout(MTDInit,500);
			console.log("waiting on something in order to start MTDInit...");
		return;
	}

	if (isEdge) {
		var beGoneThot = $("link[rel='apple-touch-icon']+link[rel='stylesheet'")[0];
		if (exists(beGoneThot)) {
			beGoneThot.remove();
		}
	}

	enableStylesheetExtension("dark");

	if (forceFeatureFlags) {
		TD.config.config_overlay = { 
			tweetdeck_devel: { value: true },
			tweetdeck_dogfood: { value: true },
			tweetdeck_insights: { value: true },
			tweetdeck_content_user_darkmode: { value: true },
			tweetdeck_subscriptions_debug: { value: true },
			tweetdeck_locale: { value: true },
			tweetdeck_live_engagements: { value: true },
			tweetdeck_content_search_darkmode: { value: true },
			tweetdeck_content_user_darkmode: { value: true },
			tweetdeck_content_render_search_tweets: { value: true },
			tweetdeck_content_render_user_tweets: { value: true },
			tweetdeck_uiv: { value: true },
			tweetdeck_premium_trends: { value: true },
			tweetdeck_create_moment_pro: { value: true },
			tweetdeck_gdpr_consent: { value: true },
			tweetdeck_gdpr_updates: { value: true },
			tweetdeck_premium_analytics: { value: true },
			tweetdeck_whats_happening: { value: true },
			tweetdeck_activity_polling: { value: true },
			tweetdeck_beta: { value: true },
			tweetdeck_system_font_stack: { value: true },
			tweetdeck_show_release_notes_link: { value: true },
			tweetdeck_searches_with_negation: { value: true },
			twitter_text_emoji_counting_enabled: { value: true },
			tweetdeck_trends_column: { value: true },
			tweetdeck_scheduled_tweet_ephemeral: { value: true },
			twitter_weak_maps: { value: true },
			tweetdeck_activity_value_polling: { value: true },
			tweetdeck_activity_streaming: { value: true },
			tweetdeck_rweb_composer: { value: true }
		}
		TD.config.scribe_debug_level = 4
		TD.config.debug_level = 4
		TD.config.debug_menu = true
		TD.config.debug_trace = true
		TD.config.debug_checks = true
		TD.config.flight_debug = true
		TD.config.sync_period = 600
		TD.config.force_touchdeck = true
		TD.config.internal_build = true 
		TD.config.help_configuration_overlay = true
		TD.config.disable_metrics_error = true
		TD.config.disable_metrics_event = true 
		TD.controller.stats.setExperiments({
			config: {
				live_engagement_in_column_8020: {
					value: 'live_engagement_enabled'
				},
				hosebird_to_rest_activity_7989: {
					value: 'rest_instead_of_hosebird'
				},
				tweetdeck_uiv_7739: {
					value: 'uiv_images'
				},
				hosebird_to_content_search_7673: {
					value: 'search_content_over_hosebird'
				}
			}
		});
	}

	$(document.head).append(make("style").html(
		// fontParseHelper({name:"Roboto300latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		// fontParseHelper({name:"Roboto300latinext"}) +
		// fontParseHelper({weight:"400",name:"Roboto400latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		// fontParseHelper({weight:"400",name:"Roboto400latinext"}) +
		// fontParseHelper({weight:"500",name:"Roboto500latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		// fontParseHelper({weight:"500",name:"Roboto500latinext"}) +
		// fontParseHelper({family:"Material",weight:"400",name:"MaterialIcons",range:"U+0000-F000"}) +
		// fontParseHelper({family:"MD",weight:"400",name:"mdvectors",range:"U+E000-FFFF"})
		// fontParseHelper({family:"Font Awesome",weight:"400",name:"fontawesome",range:"U+0000-F000"})
		fontParseHelper({name:"Roboto-Regular"}) +
		fontParseHelper({family:"MD",name:"mdvectors"}) +
		fontParseHelper({family:"Material",name:"MaterialIcons"}) +
		fontParseHelper({weight:"500",name:"Roboto-Medium"}) +
		fontParseHelper({name:"Roboto-Italic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-Light"}) +
		fontParseHelper({weight:"500",name:"Roboto-MediumItalic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-LightItalic",style:"italic"}) +
		fontParseHelper({weight:"100",name:"Roboto-Thin"}) +
		fontParseHelper({weight:"100",name:"Roboto-ThinIalic",style:"italic"}) +
		//fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansJP-Medium",range:"U+3000-303F,U+3040-309F,U+30A0-30FF,U+FF00-FFEF,U+4E00-9FAF"}) +
		//fontParseHelper({family:"Noto Sans CJK",name:"NotoSansJP-Regular",range:"U+3000-303F,U+3040-309F,U+30A0-30FF,U+FF00-FFEF,U+4E00-9FAF"}) +
		//fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansKR-Medium",format:"opentype",extension:"otf",range:"U+2E80–2EFF,U+2F00–2FDF,U+2FF0–2FFF,U+3000–303F,U+3130–318F,U+3300–33FF,U+F900–FAFF,U+1100–11FF,U+A960–A97F,U+D7B0–D7FF"}) +
		//fontParseHelper({family:"Noto Sans CJK",name:"NotoSansKR-Regular",format:"opentype",extension:"otf",range:"U+2E80–2EFF,U+2F00–2FDF,U+2FF0–2FFF,U+3000–303F,U+3130–318F,U+3300–33FF,U+F900–FAFF,U+1100–11FF,U+A960–A97F,U+D7B0–D7FF"}) +
		fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansCJKjp-Medium",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans CJK",name:"NotoSansCJKjp-Regular",format:"opentype",extension:"otf"}) +
		//fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansSC-Medium",format:"opentype",extension:"otf",range:"U+4E00-9FFF,U+3400–4DBF,U+20000-2A6DF,U+2A700–2B73F,U+2B740–2B81F,U+2B820–2CEAF,U+2CEB0–2EBEF,U+2E80–303F,U+31C0-31EF,U+3200-33FF,U+F900-FAFF,U+FE30-FE4F,U+1F200-2F800"}) +
		//fontParseHelper({family:"Noto Sans CJK",name:"NotoSansSC-Regular",format:"opentype",extension:"otf",range:"U+4E00-9FFF,U+3400–4DBF,U+20000-2A6DF,U+2A700–2B73F,U+2B740–2B81F,U+2B820–2CEAF,U+2CEB0–2EBEF,U+2E80–303F,U+31C0-31EF,U+3200-33FF,U+F900-FAFF,U+FE30-FE4F,U+1F200-2F800"}) +
		//fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansTC-Medium",format:"opentype",extension:"otf",range:"U+4E00-9FFF,U+3400–4DBF,U+20000-2A6DF,U+2A700–2B73F,U+2B740–2B81F,U+2B820–2CEAF,U+2CEB0–2EBEF,U+2E80–303F,U+31C0-31EF,U+3200-33FF,U+F900-FAFF,U+FE30-FE4F,U+1F200-2F800"}) +
		//fontParseHelper({family:"Noto Sans CJK",name:"NotoSansTC-Regular",format:"opentype",extension:"otf",range:"U+4E00-9FFF,U+3400–4DBF,U+20000-2A6DF,U+2A700–2B73F,U+2B740–2B81F,U+2B820–2CEAF,U+2CEB0–2EBEF,U+2E80–303F,U+31C0-31EF,U+3200-33FF,U+F900-FAFF,U+FE30-FE4F,U+1F200-2F800"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHI-Medium",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHI-Regular",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArabic-Medium",range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArabic-Regular",range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
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
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansCherokee-Medium",range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansEthiopic-Medium",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansEthiopic-Regular",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGeorgian-Medium",range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGeorgian-Regular",range:"U+10A0-10FF,U+2D00-2D2F"}) +
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
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansYi-Regular",range:"U+A000-A48F"})

	));

	document.querySelectorAll(".js-modals-container")[0].removeChild = function(rmnode){
		$(rmnode).addClass("mtd-modal-window-fade-out");
		setTimeout(function(){
			rmnode.remove();
		},200);
	};

	$(document.querySelector(".application").childNodes).each(function(obj){
		($(document.querySelector(".application").childNodes)[obj] || obj).removeChild = function(rmnode){
			$(rmnode).addClass("mtd-modal-window-fade-out");
			setTimeout(function(){
				rmnode.remove();
			},200);
		};
	})

	if ($(".js-modal").length > 0) {
		$(".js-modal").on("removeChild",function(rmnode){
			$(rmnode).addClass("mtd-modal-window-fade-out");
			setTimeout(function(){
				rmnode.remove();
			},200);
		});
	}

	body.removeChild = function(i) {
		if ($(i).hasClass("tooltip")) {
			setTimeout(function(){
				i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
			},500);
		} else {
	 		i.remove();
		}
 	};

	$("link[rel=\"shortcut icon\"]").attr("href",MTDBaseURL + "sources/favicon.ico");
	$(document.querySelector("audio")).attr("src",GetURL("sources/alert_2.mp3"));
	if (typeof TD_mustaches["settings/global_setting_filter_row.mustache"] !== "undefined")
		TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}"class="js-remove-filter small btn btn-negative"> </li>';
	if (typeof TD_mustaches["column_loading_placeholder.mustache"] !== "undefined")
		TD_mustaches["column_loading_placeholder.mustache"] = TD_mustaches["column_loading_placeholder.mustache"].replace("<span class=\"spinner-small\"></span>",'<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["spinner_large.mustache"] !== "undefined")
		TD_mustaches["spinner_large.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	if (typeof TD_mustaches["spinner_large_white.mustache"] !== "undefined")
		TD_mustaches["spinner_large_white.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	if (typeof TD_mustaches["spinner.mustache"] !== "undefined")
		TD_mustaches["spinner.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	if (typeof TD_mustaches["column.mustache"] !== "undefined")
		TD_mustaches["column.mustache"] = TD_mustaches["column.mustache"].replace("Loading...","");
	if (typeof TD_mustaches["media/media_gallery.mustache"] !== "undefined")
		TD_mustaches["media/media_gallery.mustache"] = TD_mustaches["media/media_gallery.mustache"].replace('<div class="js-embeditem med-embeditem"> ','<div class="js-embeditem med-embeditem"> <div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["modal.mustache"] !== "undefined")
		TD_mustaches["modal.mustache"] = TD_mustaches["modal.mustache"].replace('<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}" />','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["twitter_profile.mustache"] !== "undefined")
		TD_mustaches["twitter_profile.mustache"] = TD_mustaches["twitter_profile.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["follow_button.mustache"] !== "undefined")
		TD_mustaches["follow_button.mustache"] = TD_mustaches["follow_button.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ','<div class="preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>')
	if (typeof TD_mustaches["login/2fa_verification_code.mustache"] !== "undefined")
		TD_mustaches["login/2fa_verification_code.mustache"] = TD_mustaches["login/2fa_verification_code.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["login/login_form_footer.mustache"] !== "undefined")
		TD_mustaches["login/login_form_footer.mustache"] = TD_mustaches["login/login_form_footer.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["compose/docked_compose.mustache"] !== "undefined")
		TD_mustaches["compose/docked_compose.mustache"] = TD_mustaches["compose/docked_compose.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["compose/compose_inline_reply.mustache"] !== "undefined")
		TD_mustaches["compose/compose_inline_reply.mustache"] = TD_mustaches["compose/compose_inline_reply.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["buttons/favorite.mustache"] !== "undefined")
		TD_mustaches["buttons/favorite.mustache"] = TD_mustaches["buttons/favorite.mustache"].replace('<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["embed_tweet.mustache"] !== "undefined")
		TD_mustaches["embed_tweet.mustache"] = TD_mustaches["embed_tweet.mustache"].replace('<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" class="embed-loading" alt="{{_i}}Loading…{{/i}}" />','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["follow_button.mustache"] !== "undefined")
		TD_mustaches["follow_button.mustache"] = TD_mustaches["follow_button.mustache"].replace('<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	if (typeof TD_mustaches["lists/member.mustache"] !== "undefined")
		TD_mustaches["lists/member.mustache"] = TD_mustaches["lists/member.mustache"].replace('<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

	if (typeof TD.i !== "undefined") {
		TD.util.prettyTimeString = function(e) {
			return TD.i("{{hours12}}:{{minutes}} {{amPm}}, {{day}} {{month}} {{fullYear}}", TD.util.prettyTime(e));
		};	
	}

	// setTimeout(MTDAFCheckDate,1000);
	// setInterval(MTDAFCheckDate,3000);

	TD.util.prettyNumber = function(e) {
		//if (!TD.util.isValidNumber(e) || typeof e !== "string")
			//return "";
			var yip = parseInt(e, 10)
		if (yip >= 100000000) {
			return parseInt(yip/1000000) + "M";
		} else if (yip >= 10000000) {
			return parseInt(yip/100000)/10 + "M";
		} else if (yip >= 1000000) {
			return parseInt(yip/10000)/100 + "M";
		} else if (yip >= 100000) {
			return parseInt(yip/1000) + "K";
		} else if (yip >= 10000) {
			return parseInt(yip/100)/10 + "K";
		} else if (yip >= 1000) {
			yip = yip.toString().substring(0,1) + "," + yip.toString().substring(1);
		}
		return yip;
	}

	NavigationSetup();

}

function SendNotificationMessage(txt) {
	var knotty = $(MTDNotification);
	if (knotty.hasClass("mtd-appbar-notification-hidden")) {
		knotty.removeClass("mtd-appbar-notification-hidden").html(txt);
	} else {
		knotty.addClass("mtd-appbar-notification-hidden").delay(300).queue(function(){knotty.html(txt).removeClass("mtd-appbar-notification-hidden")});
	}
}

function WaitForNotificationDismiss(node,prevmsgID) {
	if (typeof node === "undefined" || node === null || typeof node.parentNode === "undefined" || node.parentNode === null) {
		if (msgID === prevmsgID) {
			$(MTDNotification).addClass("mtd-appbar-notification-hidden");
			messagesAccounted[node] = undefined;
		}
		return;
	}

	setTimeout(function(){WaitForNotificationDismiss(node,prevmsgID);},500);
}

function ResetSettingsUI() {
	$("#mtd-appearance-form,#mtd-accessibility-form,#mtd-about-form").css("display","none");
	$("#mtd-appearance-li,#mtd-accessibility-li,#mtd-about-li").removeClass("selected");
}

function PrefsListener() {
	if (document.querySelector("#mtd-round-avatars-control") !== null ) {

		if (getPref("mtd_round_avatars") && !$("#mtd-round-avatars-control").is(":checked")) {
			console.log("someone unticked me!!");
			setPref("mtd_round_avatars",false);
			enableStylesheetExtension("squareavatars");
		}

		if (!getPref("mtd_round_avatars") && $("#mtd-round-avatars-control").is(":checked")) {
			console.log("someone ticked me!!");
			setPref("mtd_round_avatars",true);
			disableStylesheetExtension("squareavatars");
		}

		if (!getPref("mtd_hearts") && $("#mtd-hearts").is(":checked")) {
			console.log("someone ticked me!!");
			setPref("mtd_hearts",true);
			enableStylesheetExtension("hearticon");
		}

		if (getPref("mtd_hearts") && !$("#mtd-hearts").is(":checked")) {
			console.log("someone unticked me!!");
			setPref("mtd_hearts",false);
			disableStylesheetExtension("hearticon");
		}

		if (!getPref("mtd_sensitive_alt") && $("#mtd-sensitive-alt").is(":checked")) {
			console.log("someone ticked me!!");
			setPref("mtd_sensitive_alt",true);
			enableStylesheetExtension("altsensitive");
		}

		if (getPref("mtd_sensitive_alt") && !$("#mtd-sensitive-alt").is(":checked")) {
			console.log("someone unticked me!!");
			setPref("mtd_sensitive_alt",false);
			disableStylesheetExtension("altsensitive");
		}

		if (!getPref("mtd_undocked_modals") && $("#mtd-undocked-modals").is(":checked")) {
			console.log("someone ticked me!!");
			setPref("mtd_undocked_modals",true);
			enableStylesheetExtension("undockedmodals");
		}

		if (getPref("mtd_undocked_modals") && !$("#mtd-undocked-modals").is(":checked")) {
			console.log("someone unticked me!!");
			setPref("mtd_undocked_modals",false);
			disableStylesheetExtension("undockedmodals");
		}

		if (!getPref("mtd_outlines") && $("#mtd-outlines-control").is(":checked")) {
			console.log("someone ticked me!!");
			setPref("mtd_outlines",true);
			html.addClass("mtd-acc-focus-ring");
		}

		if (getPref("mtd_outlines") && !$("#mtd-outlines-control").is(":checked")) {
			console.log("someone unticked me!!");
			setPref("mtd_outlines",false);
			html.removeClass("mtd-acc-focus-ring");
		}

		if ($("#mtd-theme-control option:selected").length > 0 && getPref("mtd_theme") !== $("#mtd-theme-control option:selected").val() && (getPref("mtd_theme") !== "AF_2019_fabulous")) {
			disableStylesheetExtension(getPref("mtd_theme"));
			setPref("mtd_theme",$("#mtd-theme-control option:selected").val())
			enableStylesheetExtension($("#mtd-theme-control option:selected").val() || "default");
		}

		if ($("#mtd-scrollbar-style option:selected").length > 0 && getPref("mtd_scrollbar_style") !== $("#mtd-scrollbar-style option:selected").val()) {
			disableStylesheetExtension(getPref("mtd_scrollbar_style"));
			setPref("mtd_scrollbar_style",$("#mtd-scrollbar-style option:selected").val());
			enableStylesheetExtension($("#mtd-scrollbar-style option:selected").val() || "default");
		}

		setTimeout(PrefsListener,500);
	}
}

function MTDSettings() {
	MTDPrepareWindows();
		setTimeout(function(){$(".js-app-settings").click();},10);
		setTimeout(function(){
			$("a[data-action='globalSettings']").click();
			var mtdsettingsmodalview = $("#settings-modal .mdl");
			mtdsettingsmodalview.addClass("mtd-settings-panel");
			var mtdsettingsmodalinner = $("#settings-modal .mdl .mdl-inner");
			$("#settings-modal .mdl .js-header-title").removeClass("js-header-title");
			$("#settings-modal .mdl .mdl-header-title").html("ModernDeck");
			mtdsettingsmodalinner.html('<div class="mdl-content js-mdl-content horizontal-flow-container"> <div class="l-column mdl-column mdl-column-sml"> <div class="l-column-scrollv scroll-v	scroll-alt "> <ul class="lst-group js-setting-list">\
			<li id="mtd-appearance-li"class="selected"><a href="#"class="list-link" id="mtd_settings_appearance_button" data-action="general"><strong>Appearance</strong></a></li>\
			\
			<li id="mtd-accessibility-li"><a href="#"class="list-link" id="mtd_settings_accessibility_button" data-action="general"><strong>Accessibility</strong></a></li>\
			\
			<li id="mtd-about-li"><a href="#"class="list-link" id="mtd_settings_about_button" data-action="general"><strong>About</strong></a></li>\
			\
			\
			</ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v	scroll-alt mdl-col-settings">\
			\
			\
			<form action="#" id="mtd-appearance-form" accept-charset="utf-8"class="frm"><fieldset id="general_settings"><div class="control-group" style="padding-top:10px;">\
			<label class="checkbox">Use rounded profile pictures<input type="checkbox" checked="checked" id="mtd-round-avatars-control"></label>\
			<label class="checkbox">Undocked windowing/nav drawer<input type="checkbox" id="mtd-undocked-modals"></label>\
			<label class="checkbox">Use alternate sensitive media workflow<input type="checkbox" checked="checked" id="mtd-sensitive-alt"></label>\
			<label class="checkbox" style="margin-bottom:30px">Use Hearts instead of Stars<input type="checkbox" checked="checked" id="mtd-hearts"></label>\
			<label class="control-label">Theme</label>\
			<select id="mtd-theme-control" type="select">\
			<option value="default" selected="selected">Default</option>\
			<optgroup label="Complete Themes">\
			<option value="paper">Paper</option>\
			<option value="amoled" style="color:#fff!important">AMOLED</option>\
			</optgroup><optgroup label="Complementary Themes">\
			<option value="grey" style="color:#fff!important">Grey</option>\
			<option value="red">Red</option>\
			<option value="pink">Pink</option>\
			<option value="orange">Orange</option>\
			<option value="violet">Violet</option>\
			<option value="teal">Teal</option>\
			<option value="green">Green</option>\
			<option value="yellow">Yellow</option>\
			<option value="cyan">Cyan</option>\
			<option value="black" style="color:#fff!important">Black</option>\
			<option value="blue">Blue</option>\
			</optgroup></select>\
			\
			\
			\
			\
			<label class="control-label" style="margin-top:50px;margin-left:-58px">Scroll Bar Style</label><select id="mtd-scrollbar-style" type="select">\
			<option value="default" selected="selected">Default</option>\
			<option value="scrollbarsnarrow">Narrow</option>\
			<option value="scrollbarsnone">Hidden</option>\
			</select></div></fieldset></form>\
			\
			<form action="#" id="mtd-accessibility-form" accept-charset="utf-8"class="frm" style="display:none;"><fieldset id="general_settings"><label class="checkbox">Always show outlines on focused items (Ctrl+Shift+A to toggle)<input type="checkbox" style="margin-top:-15px" checked="checked" id="mtd-outlines-control"> </label></fieldset></form>\
			\
			<form action="#" id="mtd-about-form" accept-charset="utf-8"class="frm" style="display:none;"><fieldset id="general_settings"><i class="icon icon-moderndeck mtd-logo"></i><h1 class="list-placeholder mtd-about-title">ModernDeck</h1><h2 class="mtd-version-title">You have ModernDeck version ' + SystemVersion + '</h2></fieldset></form>\
			\
			</div> </div> </div>');

			$("#mtd-round-avatars-control").attr("checked",getPref("mtd_round_avatars"));
			$("#mtd-undocked-modals").attr("checked",getPref("mtd_undocked_modals"));
			$("#mtd-sensitive-alt").attr("checked",getPref("mtd_sensitive_alt"));
			$("#mtd-outlines-control").attr("checked",getPref("mtd_outlines"));
			$("#mtd-hearts").attr("checked",getPref("mtd_hearts"));
			if (getPref("mtd_theme") !== "AF_2019_fabulous")
				$("#mtd-theme-control").val(getPref("mtd_theme"));
			$("#mtd-scrollbar-style").val(getPref("mtd_scrollbar_style"));

			PrefsListener();

			$("#mtd_settings_about_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#mtd-about-li").addClass("selected");
				$("#mtd-about-form").css("display","block");
			});

			$("#mtd_settings_appearance_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#mtd-appearance-li").addClass("selected");
				$("#mtd-appearance-form").css("display","block");
			});

			$("#mtd_settings_accessibility_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#mtd-accessibility-li").addClass("selected");
				$("#mtd-accessibility-form").css("display","block");
			});
		},100);
}

function LoginStuffs() {
	var profileInfo = getProfileInfo();
	if (profileInfo === null || typeof profileInfo === "undefined" || typeof profileInfo._profileBannerURL === "undefined" || profileInfo.profileImageURL === "undefined") {
		setTimeout(LoginStuffs,150);
		return;
	}
	var bannerPhoto = profileInfo._profileBannerURL.search("empty") > 0 ? "" : profileInfo._profileBannerURL;
	var avatarPhoto = profileInfo.profileImageURL.replace("_normal","");
	var name = profileInfo.name;
	var username = profileInfo.screenName;

	$(mtd_nd_header_image).attr("style","background-image:url(" + bannerPhoto + ");"); // Fetch header and place in nav drawer
	$(mtd_nd_header_photo).attr("src",avatarPhoto)
	.mouseup(function(){
		var profileLinkyThing = $("a[href=\"https://twitter.com/"+getProfileInfo().screenName+"\"]");

				MTDPrepareWindows();
		if (profileLinkyThing.length > -1) {
			setTimeout(function(){
				profileLinkyThing.click();
			},200);
		}
	}); // Fetch profile picture and place in nav drawer
	$(mtd_nd_header_username).html(name); // Fetch twitter handle and place in nav drawer

	if (!getPref("has_opened_mtd6") && welcomeEnabled) {
		setTimeout(function(){$(".js-app-settings").click()},10);
		setTimeout(function() {
			$("a[data-action='globalSettings']").click();
			$("#settings-modal .mdl-header-title").html("Welcome to ModernDeck 6.0").removeClass("js-header-title");
			$("#settings-modal .mdl").addClass("mtd-whats-new");
			$("#settings-modal .mdl-inner").html(welcomeScreenHtml);
		},20);
		setPref("has_opened_mtd6",true)
	}

	//loadPreferences();
}

function NavigationSetup() {
	if ($(".app-header-inner").length < 1) {
		setTimeout(NavigationSetup,100);
		return;
	}

	loadPreferences();

	$(".column-scroller,.more-tweets-btn-container").each(function(a,b){ // Fixes a bug in TweetDeck's JS caused by ModernDeck having different animations in column preferences
		var c = $(b);
		mutationObserver(b,function(){
			if (typeof c.attr("style") !== "undefined") {
				var num = parseInt(c.attr("style").match(/[\-\d]+/g));
				var hasFilterOptionsVisible = false;
				try {
					hasFilterOptionsVisible = parseInt(c.parent().children(".column-options").children('.js-column-message[style]')[0].style.height.replace("px","")) > 0;
				} catch (e){}

				if ((!hasFilterOptionsVisible && num < 0) || (hasFilterOptionsVisible && num < 21))
					c.attr("style","top: " + ((!hasFilterOptionsVisible && "0") || "22") + "px;")
			}
		},{attributes:true});
	})

	$(".app-header-inner").append(
		make("a")
		.attr("id","mtd-navigation-drawer-button")
		.addClass("js-header-action mtd-drawer-button link-clean cf app-nav-link")
		.html('<div class="obj-left"><div class="mtd-nav-activator"></div><div class="nbfc padding-ts"></div>')
		.click(function(){
			// TODO: Wire button to open navigation drawer
			// TODO: Remove the above TODO from back when i was developing mtd 5.0

			if (typeof mtd_nav_drawer_background !== "undefined") {
				$("#mtd_nav_drawer_background").attr("class","mtd-nav-drawer-background");
			}
			if (typeof mtd_nav_drawer !== "undefined") {
				$("#mtd_nav_drawer").attr("class","mtd-nav-drawer");
			}
		})
	);

	$("body").append(
		make("div")
		.attr("id","mtd_nav_drawer")
		.addClass("mtd-nav-drawer mtd-nav-drawer-hidden")
		.append(
			make("img")
			.attr("id","mtd_nd_header_image")
			.addClass("mtd-nd-header-image")
			.attr("style",""),
			make("img")
			.addClass("avatar size73 mtd-nd-header-photo")
			.attr("id","mtd_nd_header_photo")
			.attr("src",""),
			make("div")
			.addClass("mtd-nd-header-username")
			.attr("id","mtd_nd_header_username")
			.html("PROFILE ERROR<br>Tell @dangeredwolf i said hi"),
			make("button")
			.addClass("btn mtd-nav-button mtd-settings-button")
			.attr("id","tdset")
			.append(
				make("i")
				.addClass("icon icon-td-settings")
			)
			.click(function(){
				MTDPrepareWindows();

				setTimeout(function(){$(".js-app-settings").click()},10);
				setTimeout(function(){$("a[data-action='globalSettings']").click()},20);
			})
			.append("TweetDeck Settings"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","mtdsettings")
			.append(
				make("i")
				.addClass("icon icon-mtd-settings")
			)
			.click(MTDSettings)
			.append("ModernDeck Settings"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","btdsettings")
			.append(
				make("i")
				.addClass("icon icon-btd-settings")
			)
			.click(function(){
				MTDPrepareWindows();
				setTimeout(function(){
					var opn = window.open("chrome-extension://micblkellenpbfapmcpcfhcoeohhnpob/options/options.html", '_blank');
					opn.focus();
				},200);
			})
			.append("Better TweetDeck Settings"),
			make("div")
			.addClass("mtd-nav-divider"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","tdaccsbutton")
			.append(
				make("i")
				.addClass("icon icon-twitter-bird")
			)
			.click(function(){
				MTDPrepareWindows();
				$(".js-show-drawer.js-header-action").click();
			})
			.append("Your Accounts"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","addcolumn")
			.append(
				make("i")
				.addClass("icon icon-plus")
			)
			.click(function(){
				MTDPrepareWindows();
				$(".js-header-add-column").click();
			})
			.append("Add Column"),
			make("div")
			.addClass("mtd-nav-divider"),
			make("button")
			.addClass("btn mtd-nav-button mtd-nav-group-expand")
			.attr("id","mtd_nav_expand")
			.append(
				make("i")
				.addClass("icon mtd-icon-arrow-down")
				.attr("id","mtd_nav_group_arrow")
			)
			.click(function(){
				$("#mtd_nav_group").toggleClass("mtd-nav-group-expanded");
				$("#mtd_nav_group_arrow").toggleClass("mtd-nav-group-arrow-flipped");
				$("#mtd_nav_drawer").toggleClass("mtd-nav-drawer-group-open");
			})
			.append("More..."),
			make("div")
			.addClass("mtd-nav-group mtd-nav-group-expanded")
			.attr("id","mtd_nav_group")
			.append(
				make("button")
				.addClass("btn mtd-nav-button")
				.append(
					make("i")
					.addClass("icon mtd-icon-changelog")
				)
				.click(function(){
					MTDPrepareWindows();
					setTimeout(function(){$(".js-app-settings").click()},10);
					setTimeout(function(){$("a[href=\"https://twitter.com/i/tweetdeck_release_notes\"]").click()},20);
				})
				.append("TweetDeck Release Notes"),
				make("button")
				.addClass("btn mtd-nav-button")
				.attr("id","kbshortcuts")
				.append(
					make("i")
					.addClass("icon icon-keyboard")
				)
				.click(function(){
					MTDPrepareWindows();
					setTimeout(function(){$(".js-app-settings").click()},10);
					setTimeout(function(){$("a[data-action='keyboardShortcutList']").click()},20);
				})
				.append("Keyboard Shortcuts"),
				make("button")
				.addClass("btn mtd-nav-button")
				.append(
					make("i")
					.addClass("icon icon-search")
				)
				.click(function(){
					MTDPrepareWindows();
					setTimeout(function(){$(".js-app-settings").click()},10);
					setTimeout(function(){$("a[data-action=\"searchOperatorList\"]").click()},20);
				})
				.append("Search Tips"),
				make("div")
				.addClass("mtd-nav-divider"),
				make("button")
				.addClass("btn mtd-nav-button")
				.attr("id","mtd_signout")
				.append(
					make("i")
					.addClass("icon icon-logout")
				)
				.click(function(){
					MTDPrepareWindows();
					setTimeout(function(){$(".js-app-settings").click()},10);
					setTimeout(function(){$("a[data-action='signOut']").click()},20);
				})
				.append("Sign Out"),
			),
			
			make("div")
			.addClass("mtd-nav-divider mtd-nav-divider-feedback"),
			make("button")
			.addClass("btn mtd-nav-button mtd-nav-button-feedback")
			.attr("id","mtdfeedback")
			.append(
				make("i")
				.addClass("icon icon-feedback")
			)
			.click(function(){
				sendingFeedback = true;
				try {
					throw "Manually triggered feedback button";
				} catch(e) {
					Raven.captureException(e);
					Raven.showReportDialog();
				}
			})
			.append("Send Feedback")
		),
		make("div")
		.attr("id","mtd_nav_drawer_background")
		.addClass("mtd-nav-drawer-background mtd-nav-drawer-background-hidden")
		.click(function(){
			$(this).addClass("mtd-nav-drawer-background-hidden");
			$(mtd_nav_drawer).addClass("mtd-nav-drawer-hidden");
		})
	);

	$(".mtd-nav-group-expanded").attr("style","height:"+$(".mtd-nav-group-expanded").height()+"px");
	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");

	$(".app-header-inner").append(
		make("div")
		.addClass("mtd-appbar-notification mtd-appbar-notification-hidden")
		.attr("id","MTDNotification")
	)

	window.MTDPrepareWindows = function() {
		$("#update-sound,.js-click-trap").click();
		mtd_nav_drawer_background.click();

		$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
		$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
	}

	if (TreatGeckoWithCare) {
		btdsettings.remove();
	}

	LoginStuffs();
}

function KeyboardShortcutHandler(e) {
	if (e.key.toUpperCase() === "A" && e.ctrlKey && e.shiftKey) { //pressing Ctrl+Shift+A toggles the outline accessibility option
		console.log("User has pressed the proper key combination to toggle accessibility!");
		if (!getPref("mtd_outlines")) {
			setPref("mtd_outlines",true);
			html.addClass("mtd-acc-focus-ring");
		} else {
			setPref("mtd_outlines",false);
			html.removeClass("mtd-acc-focus-ring");
		}
		if (document.querySelector("#mtd-outlines-control") !== null) {
			$("#mtd-outlines-control").click();
		}
	}
	if (e.keyCode === 81 && document.querySelector("input:focus,textarea:focus") === null) {
		if ($(mtd_nav_drawer).hasClass("mtd-nav-drawer-hidden")) {
			$("#mtd-navigation-drawer-button").click();
		} else {
			$(mtd_nav_drawer_background).click();
		}
	}


}

function checkIfUserSelectedNewTheme() {
		if (html.hasClass("dark")) {
			enableStylesheetExtension("dark");
			disableStylesheetExtension("light");
			html.addClass("mtd-dark").removeClass("mtd-light")
			MTDDark = true;
			// if (typeof getPref("mtd_theme") !== "undefined" && getPref("mtd_theme") === "paper") {
			// 	setPref("mtd_theme","default");
			// 	disableStylesheetExtension("paper");
			// }
		} else {
			disableStylesheetExtension("dark");
			enableStylesheetExtension("light");
			html.addClass("mtd-light").removeClass("mtd-dark")
			MTDDark = false;
			// if (typeof getPref("mtd_theme") !== "undefined" && getPref("mtd_theme") ==="amoled") {
			// 	setPref("mtd_theme","default");
			// 	disableStylesheetExtension("amoled");
			// }
		}


		enableStylesheetExtension(getPref("mtd_theme") || "default");
}

function diag() {
	try {
		attemptdiag();
	}
	catch(err) {
		$("#open-modal,.js-app-loading").append(
			make("div")
			.addClass("mdl s-tall-fixed")
			.append(
				make("header")
				.addClass("mdl-header")
				.append(
					make("h3")
					.addClass("mdl-header-title")
					.html("Diagnostics")
				),
				make("div")
				.addClass("mdl-inner")
				.append(
					make("div")
					.addClass("mdl-content")
					.css("padding-left","20px")
					.html("Well, that's unfortuate. I can't seem to be able to fetch diagnostics right now. Maybe refresh and try again?<br><br>(P.S. the error is " + (err ? err.toString() : "[miraculously, undefined.]") + ")")
				)
			)
		)
		.css("display","block");
	}
}

function closediag() {
	$("#open-modal,.js-app-loading").css("display","none");
}

function attemptdiag() {
	openModal = $("#open-modal,.js-app-loading");

	openModal.append(
			make("div")
			.addClass("mdl s-tall-fixed")
			.append(
					make("header")
					.addClass("mdl-header")
					.append(
							make("h3")
							.addClass("mdl-header-title")
							.html("Diagnostics")
					),
					make("div")
					.addClass("mdl-inner")
					.append(
							make("div")
							.addClass("mdl-content")
							.css("padding-left","20px")
							.html('\
							\
							\
							\
							<button class="btn" onclick="closediag();">Close Diagnostics</button>\
							<br>SystemVersion: ' + SystemVersion + '\
							<br>userAgent: ' + navigator.userAgent + '\
							<br>vendor: ' + navigator.vendor + '\
							<br>vendorSub: ' + navigator.vendorSub + '\
							<br>appCodeName: ' + navigator.appCodeName + '\
							<br>appName: ' + navigator.appName + '\
							<br>cookieEnabled: ' + navigator.cookieEnabled + '\
							<br>language: ' + navigator.language + '\
							<br>platform: ' + navigator.platform + '\
							<br>TreatGeckoWithCare: ' + TreatGeckoWithCare + '\
							<br>audiosrc: ' + document.getElementsByTagName("audio")[0].src + '\
							<br>MTDBaseURL: ' + MTDBaseURL + '\
							<br>MTDDark: ' + MTDDark + '\
							<br>FetchProfileInfo: ' + FetchProfileInfo + '\
							<br>mtd_round_avatars: ' + getPref("mtd_round_avatars") + '\
							<br>mtd_flag_block_secure_ss: ' + getPref("mtd_flag_block_secure_ss") + '\
							<br>mtd_flag_block_communications: ' + getPref("mtd_flag_block_communications") + '\
							<br>mtd_nd_header_image: ' + (typeof $("#mtd_nd_header_image")[0] !== "undefined" && $("#mtd_nd_header_image")[0].style.cssText) + '\
							<br>mtd_nd_header_username: ' + (typeof $("#mtd_nd_header_username")[0] !== "undefined" && $("#mtd_nd_header_username")[0].innerHTML) + '\
							<br>mtd_nd_header_photo: ' + (typeof $("#mtd_nd_header_photo")[0] !== "undefined" && $("#mtd_nd_header_photo")[0].src) + '\
							<br>guestID: ' + (TD.storage.store._backend.guestID) + '\
							<br>msgID: ' + (msgID) + '\
							<br>InjectFonts?: ' + (typeof InjectFonts !== "undefined") + '\
							\
							\
							\
							')
					)
			)
	)
	.css("display","block");
}

function dxdiag() {

		openModal = $("#open-modal,.js-app-loading");

		openModal.append(
				make("div")
				.addClass("mdl s-tall-fixed")
				.append(
						make("header")
						.addClass("mdl-header")
						.append(
								make("h3")
								.addClass("mdl-header-title")
								.html("DxDiag Help")
						),
						make("div")
						.addClass("mdl-inner")
						.append(
								make("div")
								.addClass("mdl-content")
								.css("padding-left","20px")
								.html('\
								This is a guide to help you acquire your DxDiag if asked by a developer.\
								<br><br>\
								Warning: This only applies for Windows. If you\'re running OS X / Linux / etc., this won\'t work.\
								<br><br>\
								Step 1: Press the Windows key + R key to open the Run dialog.<br>\
								Step 2: In the box of the new window, type in "dxdiag", and press the Enter key.<br>\
								Step 3: In the DirectX Diagnostic window, click the "Save All Information..." button at the bottom.<br>\
								Step 4: Save this file somewhere you\'ll remember, like the Desktop.<br>\
								Step 5: Upload the file to a file hosting site, for example, <a target="_blank" href="https://mega.nz">Mega</a> (no signup needed), or whereever you can easily share the link for the file with developers.\
								')
						)
				)
		)
		.css("display","block");
}


var rtbutton;

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
	}
}

function checkIfBTDIsInstalled() {
	if (body.hasClass("btd-ready")) {
		enableStylesheetExtension("btdsupport");
	}
}

function onElementAddedToDOM(e) {
	var tar = $(e.target);
	if (tar.hasClass("dropdown")) {
		console.log("dropdown!!!");
		e.target.parentNode.removeChild = function(dropdown){
			$(dropdown).addClass("mtd-dropdown-fade-out");
			setTimeout(function(){
				dropdown.remove();
			},200);
		}
	} else if (tar.hasClass("overlay")) {
		console.log("overlay!!!");
		if (!tar.hasClass("is-hidden")) {
			var observer = mutationObserver(e.target,function(mutations) {
				console.log("its gone now!");
				if (tar.hasClass("is-hidden")) {
					tar.addClass("mtd-modal-window-fade-out");
					setTimeout(function(){
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

function mtdAppFunctions() {

	const {remote,ipcRenderer} = require('electron');

	var minimise = make("button")
	.addClass("windowcontrol min")
	.html("&#xE15B")
	.click(function(data,handler){
		var window = remote.BrowserWindow.getFocusedWindow();
    	window.minimize();
	});

	var maximise = make("button")
	.addClass("windowcontrol max")
	.html("&#xE3C6")
	.click(function(data,handler){
		var window = remote.BrowserWindow.getFocusedWindow();
		if (window.isMaximized()) {
			window.unmaximize();
		} else {
			window.maximize();
		}
	});

	var closefunc = function() {
		window.close();
	}

	var close = make("button")
	.addClass("windowcontrol close")
	.html("&#xE5CD")
	.click(closefunc);


	var windowcontrols = make("div")
	.addClass("windowcontrols")
	.append(minimise)
	.append(maximise)
	.append(close);

	body.append(windowcontrols);

	ipcRenderer.on('context-menu', (event, p) => {
	  console.log(p); // prints "pong"
	  body.append(buildContextMenu(p));
	})
}

function getIpc() {
	const {ipcRenderer} = require('electron');
	return ipcRenderer;
}

contextMenuFunctions = {
	cut:function(){
		getIpc().send("cut");
	},
	copy:function(){
		getIpc().send("copy");
	},
	paste:function(){
		getIpc().send("paste");
	},
	undo:function(){
		getIpc().send("undo");
	},
	redo:function(){
		getIpc().send("redo");
	},
	selectAll:function(){
		getIpc().send("selectAll");
	},
	delete:function(){
		getIpc().send("delete");
	},
	openLink:function(e){
		window.open(e);
	},
	copyLink:function(e){
		const { clipboard } = require('electron');
		clipboard.writeText(e);
	},
	openImage:function(e){
		window.open(e);
	},
	copyImageURL:function(e){
		const { clipboard } = require('electron');
		clipboard.writeText(e);
	},
	copyImage:function(e){
		getIpc().send("copyImage",e);
	}

}

function makeCMItem(p) {
	var a = make("a").attr("href","#").attr("data-action",p.dataaction).html(p.text);
	var li = make("li").addClass("is-selectable").append(a);

	if (p.enabled === false) {
		a.attr("disabled","disabled");
	} else {
		//a.click(contextMenuFunctions[p.dataaction]);

		a.click(function(){
			console.log("Performing action "+p.dataaction+"...");
			if (p.mousex && p.mousey) {
				document.elementFromPoint(p.mousex, p.mousey).focus();
				console.log("Got proper info, keeping context (x="+p.mousex+",y="+p.mousey+")");
				console.log(document.elementFromPoint(p.mousex, p.mousey));
			}
			contextMenuFunctions[p.dataaction](p.data);
			clearContextMenu();
		});
	}

	return li;
}

function clearContextMenu() {
	var removeMenu = $(".mtd-context-menu")
	removeMenu.addClass("mtd-dropdown-fade-out").on("animationend",function(){
		removeMenu.remove();
	});
}

function makeCMDivider() {
	return make("div").addClass("drp-h-divider");
}

function buildContextMenu(p) {
	var items = [];
	var x=p.x;
	var y=p.y;

	const xOffset = 2;
	const yOffset = 12;

	if ($(".mtd-context-menu").length > 0) {
		var removeMenu = $(".mtd-context-menu");
		removeMenu.addClass("mtd-dropdown-fade-out");
		removeMenu.on("animationend",function(){
			removeMenu.remove();
		})
	}

	if (p.isEditable) {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"undo",text:"Undo",enabled:p.editFlags.canUndo}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"redo",text:"Redo",enabled:p.editFlags.canRedo}));
		items.push(makeCMDivider());
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"cut",text:"Cut",enabled:p.editFlags.canCut}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copy",text:"Copy",enabled:p.editFlags.canCopy}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"paste",text:"Paste",enabled:p.editFlags.canPaste}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"selectAll",text:"Select All",enabled:p.editFlags.canSelectAll}));
		items.push(makeCMDivider());
	}

	if (p.linkURL !== '') {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openLink",text:"Open link in browser",enabled:true,data:p.linkURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyLink",text:"Copy link address",enabled:true,data:p.linkURL}));
		items.push(makeCMDivider());
	}

	if (p.srcURL !== '') {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openImage",text:"Open image in browser",enabled:true,data:p.srcURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImage",text:"Copy image",enabled:true,data:{x:x,y:y}}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImageURL",text:"Copy image address",enabled:true,data:p.srcURL}));
		items.push(makeCMDivider());
	}

	var ul = make("ul");

	for(var i = 0; i < items.length; i++){
		ul.append(items[i]);
	}


	var menu = make("menu").addClass("mtd-context-menu dropdown-menu").append(ul).attr("style","opacity:0;animation:none;transition:none");


	console.log("x: "+x+" y: "+y+" ul.width(): "+ ul.width() +" ul.height(): "+ ul.height() +" $(document).width(): " + $(document).width() + " $(document).height(): " + $(document).height())

	setTimeout(function(){
		if (x+xOffset+ul.width() > $(document).width()){
			console.log("you're too wide!");
			x = $(document).width() - ul.width() - xOffset;
		}

		if (y+yOffset+ul.height() > $(document).height()){
			console.log("you're too tall!");
			y = $(document).height() - ul.height() - yOffset;
		}

		menu.attr("style","left:"+(x+xOffset)+"px!important;top:"+(y+yOffset)+"px!important")


	},0)

	return menu;
}

function CoreInit() {
	if (typeof Raven === "undefined" || typeof mR === "undefined") {
		setTimeout(CoreInit,10);
		console.log("waiting on raven or moduleRaid...");
		return;
	}

	if (typeof $ === "undefined") {
		var jQuery = mR.findFunction('jQuery')[0];

		window.$ = jQuery;
		window.jQuery = jQuery;
	}

	head = $(document.head);
	body = $(document.body);
	html = $(document.querySelector("html")); // Only 1 result; faster to find

	if (html.hasClass("mtd-app") && typeof require !== "undefined") {
		mtdAppFunctions();
	}

	Raven.config('https://92f593b102fb4c1ca010480faed582ae@sentry.io/242524', {
	    release: SystemVersion
	}).install();

	if (isApp) {
		window.addEventListener('mousedown', function(e) {
			clearContextMenu();
		}, false);
	}

	setTimeout(Raven.context(MTDInit),10);

	Raven.context(function(){
		window.addEventListener("keyup",KeyboardShortcutHandler,false);
		html.addClass("mtd-api-ver-6-2 mtd-js-loaded");
		mutationObserver(html[0],checkIfUserSelectedNewTheme,{attributes:true});
		mutationObserver(body[0],checkIfBTDIsInstalled,{attributes:true});
		mutationObserver(html[0],onElementAddedToDOM,{attributes:false,subtree:true,childList:true})

		checkIfUserSelectedNewTheme();
		checkIfSigninFormIsPresent();
		checkIfBTDIsInstalled();
		loginInterval = setInterval(checkIfSigninFormIsPresent,500);
		console.log("MTDinject loaded");
	});
}

CoreInit();