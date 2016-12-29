// MTDinject.js
// Copyright (c) 2016 Dangered Wolf

// made with love <3

"use strict";

var SystemVersion = "6.1.2 Dev Build 2016.12.28";
var MTDBaseURL = "https://raw.githubusercontent.com/dangeredwolf/ModernDeck/master/ModernDeck/"; // Defaults to streaming if nothing else is available (i.e. legacy firefox)

var msgID,
FetchProfileInfo,
loginIntervalTick = 0;

var messagesAccounted = [];

var MTDDark = true;

var addedColumnsLoadingTagAndIsWaiting,
replacedLoadingSpinnerNew,
loadedPreferences,
wasTweetSheetOpen,
profileProblem,
TreatGeckoWithCare = false;

var progress = null;

var FindProfButton,
loginInterval,
openModal;

var isChrome = typeof chrome !== "undefined";
var isOpera = typeof opera !== "undefined";
var isSafari = typeof safari !== "undefined";
var isFireFox = !isChrome && !isOpera && !isSafari;

var make = function(a){return $(document.createElement(a))};
var head = $(document.head);
var body = $(document.body);
var html = $(document.querySelector("html")); // Only 1 result; faster to find

var welcomeScreenHtml = '<div class="mdl-content horizontal-flow-container"><div style="width:100%"class="l-column mdl-column mdl-column-lrg"><div class="l-column-scrollv scroll-v	scroll-alt"><h1>New in ModernDeck 6.0</h1><h2>Themes</h2><header class="js-column-header js-action-header column-header mtd-colours-demo"><i class="pull-left margin-hs column-type-icon icon icon-home"></i><h1 class="column-title txt-ellipsis"><span class="column-head-title">Home</span><span class="attribution txt-mute txt-sub-antialiased">@dangeredwolf</span></h1><a class="js-action-header-button column-header-link column-settings-link"><i class="icon icon-sliders"></i></a></header><p>People\'s personalities are far more than just black and white. Make your TweetDeck experience truly personal with a variety of styles to suit whatever your tastes might be. This and many of the other options are adjustable with <i class="icon icon-mtd-settings"></i><b>ModernDeck Settings</b></p><h2>Refreshed Icons</h2><br><i class="icon icon-tweetdeck icon-xxlarge"></i><i class="icon icon-moderndeck icon-xxlarge"></i><i class="icon icon-hashtag icon-xxlarge"></i><i class="icon icon-retweet icon-xxlarge"></i><i class="icon icon-mtd-settings icon-xxlarge"></i><p style="padding-top:0">As of this release, 100% of icons are either created inhouse for ModernDeck, or are borrowed from the material design icon library. This includes the new Retweet icon, which was obvious from the beginning that an inhouse solution was mandatory.</p><h2>Refreshed UI</h2><p style="padding-top:0">ModernDeck 6.0 has a refreshed UI, taking advantage of an all-new edge-to-edge design that snaps to the left side. This helps take better advantage of screen real estate while still being elegant to use, and isn\'t a bad match with ModernDeck\'s navigation drawer.</p><h2>Tweet Shortener Assistant</h2><p style="padding-top:0">Have you ever dealt with a moment where you\'re just barely over the 140 character limit and need to cut down the size a bit? In ModernDeck 6.0, we have you covered. If you go over the 140 character limit, we\'ll prompt you with suggestions of what ways it detects will help shorten your tweet. This uses a number of algorithms such as checking for excess spacing and punctuation, to more advanced ones such as detecting and replacing applicable letters with liguatures, a Unicode feature that allows combining of certain letters to replace 2, 3, or sometimes even 4 characters, into what Twitter registers as just 1 character, and oftentimes looks about the same. All of these are suggestions, so you can click on the one you want, and you\'ll get no more, no less, than you asked for. Then you can finally send that Tweet, and you\'ve saved some precious time.</p><h3>Hearts or Stars</h3><p style="padding-top:0">ModernDeck allows you to pick between hearts and stars. The new default is hearts.</p><h3>Change How the Scroll Bar Looks</h3><p style="padding-top:0">In ModernDeck 6.0, you now have the option to change the scroll bar\'s appearance, such as either making it narrower, or making it never appear outright, to help build a cleaner TweetDeck experience to your specification.</p><h3>A New Option for dealing with Sensitive Media</h3><p style="padding-top:0">ModernDeck 6.0 also introduces another new feature, which changes the workflow of dealing with sensitive media, if you have it enabled to ask beforehand. Before, you had to click a tiny "View" link beforehand. Now, simply click anywhere on the designated background, and it will open up a preview of the image, as expected, but the thumbnail itself never shows content marked as sensitive.</p><h3>Faster and More Reliable CSS Extension Engine</h3><p style="padding-top:0">Building a truly versatile theming system wasn\'t as easy as slapping a feature on top of the old codebase. It\'s possible to do it that way, but it\'d hurt performance by creating extra overhead created by having to load all themes into memory at once, only to render one. Much of ModernDeck\'s CSS/UI codebase, kept in one single CSS file, has been broken up and componentified into separate silos, called CSS extensions, and besides critical system extensions, most of these extensions can be swapped in or out at any time, making it easier for the browser to discard an old theme, and load a new theme into memory, all transparently, in real-time, with virtually no hiccup on average, modern hardware. Any UI tweaks from themes to hearts to even more are now all extensions that run on top of ModernDeck. This architecture carries through much of the system now. For example, all animations are kept in animations.css. By keeping similar items in the same place, it makes it easier for the CSS to reference, as well as making it easier to develop ModernDeck in the future. This took an enormous amount of work, but now we\'re left with a more functional, stable, as well as modular ModernDeck.</p></div></div></div>';
// Asks MTDLoad for the storage
window.postMessage({
	type: "getStorage"
}, "*");

// Adds each key in the extension storage to localStorage
window.addEventListener("message", function(e) {
	console.log(e.data);
	if (e.source == window) {
		if (e.data.type == "sendStorage") {
			var settings = e.data.message;
			for (var key in settings) {
				localStorage.setItem(key, settings[key]);
			}
		}
	}
});

window.addEventListener("beforeunload",savePreferencesToDisk);

if (typeof MTDURLExchange === "object" && typeof MTDURLExchange.getAttribute === "function") {
	MTDBaseURL = MTDURLExchange.getAttribute("type") || "https://dangeredwolf.com/assets/mtdtest/";
	console.info("MTDURLExchange completed with URL " + MTDBaseURL);
}

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
	if (thing === true || (typeof thing === "object" && thing !== null && thing.length > 0)) {
		return true;
	}
	return false;
}

function savePreferencesToDisk() {
	var storage = {}
	for(var i = 0; i < localStorage.length; i++){
		var key = localStorage.key(i);
		if (key == "guestID" || key == "metrics.realtimeData") {
			continue;
		} else {
			storage[key] = localStorage[key];
		}
	}

	window.postMessage({
		type: "setStorage",
		message: storage
	}, "*");
}

function enableStylesheetExtension(name) {
	if (name === "default")
		return;

	var url = MTDBaseURL + "sources/cssextensions/" + name + ".css";

	if (document.querySelector('head>link[href="' + url + '"]') === null) {
		head.append(
			make("link")
			.attr("rel","stylesheet")
			.attr("href",url)
			.addClass("mtd-stylesheet-extension")
		)
	} else return;
}

function disableStylesheetExtension(name) {
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
	if (localStorage[id] === "true")
		return true;
	else if (localStorage[id] === "false")
		return false;
	else
		return localStorage[id];
}

function setPref(id,p) {
	localStorage[id] = p;
	savePreferencesToDisk();
}

function GetURL(url) {
	return MTDBaseURL + url;
}

function fontParseHelper(a) {
	if (typeof a !== "object" || a === null)
		throw "you forgot to pass the object";

	return "@font-face{font-family:'"+(a.family||"Roboto")+"';font-style:"+(a.style||"normal")+";font-weight:"+(a.weight || "300")+";src:url("+MTDBaseURL+"sources/fonts/"+a.name+".woff) format('woff');unicode-range:"+(a.range||
		"U+0100-024F,U+1E00-1EFF,U+20A0-20CF,U+2C60-2C7F,U+A720-A7FF")+"}";
}

function MTDInit(){

	if (typeof document.getElementsByClassName("js-signin-ui block")[0] !== "undefined" && !replacedLoadingSpinnerNew) {
		document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
		replacedLoadingSpinnerNew = true;
	}
	if (
		typeof $ === "undefined" ||
		typeof TD_mustaches === "undefined" ||
		typeof TD === "undefined" ||
		typeof TD.util === "undefined" ||
		typeof TD.util.prettyTimeString === "undefined" ||
		typeof TD_mustaches["settings/global_setting_filter_row.mustache"] === "undefined"
	) {
		setTimeout(MTDInit,500);
		return;
	}

	enableStylesheetExtension("dark");

	if (isChrome) {
		if (parseInt((navigator.userAgent.match(/Chrome\/\d\d/g)+"").substring(7)) <= 42)
			enableStylesheetExtension("animations_legacy");
	}

	$(document.head).append(make("style").html(
		fontParseHelper({name:"Roboto300latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({name:"Roboto300latinext"}) +
		fontParseHelper({weight:"400",name:"Roboto400latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"400",name:"Roboto400latinext"}) +
		fontParseHelper({weight:"500",name:"Roboto500latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"500",name:"Roboto500latinext"}) +
		fontParseHelper({family:"Material",weight:"400",name:"MaterialIcons",range:"U+0000-F000"}) +
		fontParseHelper({family:"MD",weight:"400",name:"mdvectors",range:"U+E000-FFFF"})
		// fontParseHelper({family:"Font Awesome",weight:"400",name:"fontawesome",range:"U+0000-F000"})
	));

	document.querySelector(".js-modals-container").removeChild = function(rmnode){
		$(rmnode).addClass("mtd-modal-window-fade-out");
		setTimeout(function(){
			rmnode.remove();
		},200);
	};

	$(document.querySelector(".application").childNodes).each(function(obj){
		obj.removeChild = function(rmnode){
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
	TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}"class="js-remove-filter small btn btn-negative"> </li>';
	TD_mustaches["column_loading_placeholder.mustache"] = TD_mustaches["column_loading_placeholder.mustache"].replace("<span class=\"spinner-small\"></span>",'<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["spinner_large.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	TD_mustaches["spinner_large_white.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	TD_mustaches["spinner.mustache"] = '<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
	TD_mustaches["column.mustache"] = TD_mustaches["column.mustache"].replace("Loading...","");
	TD_mustaches["media/media_gallery.mustache"] = TD_mustaches["media/media_gallery.mustache"].replace('<div class="js-embeditem med-embeditem"> ','<div class="js-embeditem med-embeditem"> <div class="preloader-wrapper active"><div class="spinner-layer "><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["modal.mustache"] = TD_mustaches["modal.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}" />','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["twitter_profile.mustache"] = TD_mustaches["twitter_profile.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ','<div class="preloader-wrapper active"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["follow_button.mustache"] = TD_mustaches["follow_button.mustache"].replace('<img src="{{#asset}}/web/assets/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ','<div class="preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>')
	TD_mustaches["login/2fa_verification_code.mustache"] = TD_mustaches["login/2fa_verification_code.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["login/login_form_footer.mustache"] = TD_mustaches["login/login_form_footer.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	TD_mustaches["compose/docked_compose.mustache"] = TD_mustaches["compose/docked_compose.mustache"].replace('<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>','<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden preloader-wrapper active tiny"><div class="spinner-layer small"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

	TD.util.prettyTimeString = function(e) {
		return TD.i("{{hours12}}:{{minutes}} {{amPm}}, {{day}} {{month}} {{fullYear}}", TD.util.prettyTime(e));
	};

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

	// head.append(
	// 	make("script")
	// 		.attr("type","text/javascript")
	// 		.attr("src",MTDBaseURL + "sources/libraries/waves.js")
	// )

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
			return;
		} else {
			return;
		}
	}

	setTimeout(function(){WaitForNotificationDismiss(node,prevmsgID);},500);
}

function ResetSettingsUI() {
	$("#mtd-appearance-form,#mtd-accessibility-form,#mtd-about-form").css("display","none");
	$("#mtd-appearance-li,#mtd-accessibility-li,#mtd-about-li").removeClass("selected");
}

function PrefsListener() {
	console.log("Testing...");
	if (document.querySelector("#mtd-round-avatars-control") !== null ) {
		console.log("waiting...");

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

		if ($("#mtd-theme-control option:selected").length > 0 && getPref("mtd_theme") !== $("#mtd-theme-control option:selected").val()) {
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
			$("#settings-modal .mdl .mdl-header-title").html("ModernDeck Settings");
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
			<label class="checkbox">Undocked windowing/nav drawer (experimental)<input type="checkbox" id="mtd-undocked-modals"></label>\
			<label class="checkbox">Use alternate sensitive media workflow<input type="checkbox" checked="checked" id="mtd-sensitive-alt"></label>\
			<label class="checkbox">Use Hearts instead of Stars<input type="checkbox" checked="checked" id="mtd-hearts"></label>\
			<label class="control-label">Theme\
			<select id="mtd-theme-control" type="select">\
			<option value="default" selected="selected">Default</option>\
			<optgroup label="Complete Themes">\
			<option value="paper">Paper</option>\
			<option value="amoled">AMOLED</option>\
			</optgroup><optgroup label="Complementary Themes">\
			<option value="grey">Grey</option>\
			<option value="red">Red</option>\
			<option value="pink">Pink</option>\
			<option value="orange">Orange</option>\
			<option value="violet">Violet</option>\
			<option value="teal">Teal</option>\
			<option value="green">Green</option>\
			<option value="yellow">Yellow</option>\
			<option value="cyan">Cyan</option>\
			<option value="black">Black</option>\
			<option value="blue">Blue</option>\
			</optgroup></select>\
			\
			\
			\
			\
			<label class="control-label">Scroll Bar Style<select id="mtd-scrollbar-style" type="select">\
			<option value="default" selected="selected">Default</option>\
			<option value="scrollbarsnarrow">Narrow</option>\
			<option value="scrollbarsnone">Hidden</option>\
			</select></label></label></div></fieldset></form>\
			\
			<form action="#" id="mtd-accessibility-form" accept-charset="utf-8"class="frm" style="display:none;"><fieldset id="general_settings"><label class="checkbox">Always show outlines on focused items<input type="checkbox" checked="checked" id="mtd-outlines-control"> </label></fieldset></form>\
			\
			<form action="#" id="mtd-about-form" accept-charset="utf-8"class="frm" style="display:none;"><fieldset id="general_settings"><i class="icon icon-moderndeck mtd-logo"></i><h1 class="list-placeholder mtd-about-title">ModernDeck</h1><h2 class="mtd-version-title">You\'ve got version ' + SystemVersion + '</h2><div class="mdl-links" style="margin-bottom:-10px"> <a href="https://dangeredwolf.com/TweetDeckEnhancer/privacy.txt" style="display:none" target="_blank">Privacy Policy</a> </div></fieldset></form>\
			\
			</div> </div> </div>');

			$("#mtd-round-avatars-control").attr("checked",getPref("mtd_round_avatars"));
			$("#mtd-undocked-modals").attr("checked",getPref("mtd_undocked_modals"));
			$("#mtd-sensitive-alt").attr("checked",getPref("mtd_sensitive_alt"));
			$("#mtd-outlines-control").attr("checked",getPref("mtd_outlines"));
			$("#mtd-hearts").attr("checked",getPref("mtd_hearts"));
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
		var profileLinkyThing = $(document.querySelector('.avatar.tweet-avatar.pull-right[alt="' + username + '\'s avatar"]')).parents(".account-link");

		if (profileLinkyThing.length > -1) {
			MTDPrepareWindows();
			profileLinkyThing.click();
		}
	}); // Fetch profile picture and place in nav drawer
	$(mtd_nd_header_username).html(name); // Fetch twitter handle and place in nav drawer

	if (!getPref("has_opened_mtd6")) {
		setTimeout(function(){$(".js-app-settings").click()},10);
		setTimeout(function() {
			$("a[data-action='globalSettings']").click();
			$("#settings-modal .mdl-header-title").html("Welcome to ModernDeck 6.0").removeClass("js-header-title");
			$("#settings-modal .mdl").addClass("mtd-whats-new");
			$("#settings-modal .mdl-inner").html(welcomeScreenHtml);
		},20);
		setPref("has_opened_mtd6",true)
	}

	loadPreferences();
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
				var hasFilterOptionsVisible = parseInt(c.parent().children(".column-options").children('.js-column-message[style]')[0].style.height.replace("px","")) > 0;
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
			make("div")
			.addClass("mtd-nav-divider"),
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
			.attr("id","addcolumn")
			.append(
				make("i")
				.addClass("icon icon-plus")
			)
			.click(function(){
				MTDPrepareWindows();
				$(".js-header-add-column").click();
			})
			.append("Add Column")
		),
		make("div")
		.attr("id","mtd_nav_drawer_background")
		.addClass("mtd-nav-drawer-background mtd-nav-drawer-background-hidden")
		.click(function(){
			$(this).addClass("mtd-nav-drawer-background-hidden");
			$(mtd_nav_drawer).addClass("mtd-nav-drawer-hidden");
		})
	);

	$(".app-header-inner").append(
		make("div")
		.addClass("mtd-appbar-notification mtd-appbar-notification-hidden")
		.attr("id","MTDNotification")
	)

	window.MTDPrepareWindows = function() {
		$("#update-sound,.js-click-trap").click();
		mtd_nav_drawer_background.click();
	}

	if (TreatGeckoWithCare) {
		btdsettings.remove();
	}

	LoginStuffs();
}

function KeyboardShortcutHandler(e) {
	if (e.keyCode !== 81 || document.querySelector("input:focus,textarea:focus") !== null) {
		return; // uses querySelector for optimal speed
	}

	if ($(mtd_nav_drawer).hasClass("mtd-nav-drawer-hidden")) {
		$("#mtd-navigation-drawer-button").click();
	} else {
		$(mtd_nav_drawer_background).click();
	}
}

function checkIfUserSelectedNewTheme() {

		if (document.querySelector("meta[http-equiv='default-style']").content === "light") {
			disableStylesheetExtension("dark");
			enableStylesheetExtension("light");
			html.addClass("mtd-light").removeClass("mtd-dark")
			MTDDark = false;
		} else {
			enableStylesheetExtension("dark");
			disableStylesheetExtension("light");
			html.addClass("mtd-dark").removeClass("mtd-light")
			MTDDark = true;
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

function addSpaceSuggestion(mtdtxt,clickd) {
	$(".mtd-no-chars-suggestions").append(
		make("button")
		.addClass("btn mtd-no-transform-case")
		.html(mtdtxt)
		.click(clickd)
		.click(function(){
			this.remove();
			$(".character-count-compose").val(140-$(".compose-text").val().length);
			if ($(".compose-text").val().length>140) {
				$(".character-count-compose").addClass("invalid-char-count")
			} else {
				$(".character-count-compose").removeClass("invalid-char-count")
			}
		})
	);
}

function checkSpaceSuggestions() {
	var tweetTxt = $(".compose-text").val();

	if (tweetTxt.match(/ ( )+/g) !== null) {
		addSpaceSuggestion("Trim excess space inside",function(){
			$(".compose-text").val(tweetTxt.replace(/ ( )+/g," "));
		});
	}

	if (tweetTxt.match(/([.|\.|\?|\!|\s]$)|,(?!\D)/g) !== null) {
		addSpaceSuggestion("Trim excess punctuation",function(){
			$(".compose-text").val(tweetTxt.replace(/([.|\.|\?|\!|\s]$)|,(?!\D)/g,""));
		});
	}

	if (tweetTxt.match(/(\s\s+)|([.|\.|\!|\?|\s]+?$)/gm) !== null) {
		addSpaceSuggestion("Trim excess space around edges",function(){
			$(".compose-text").val(tweetTxt.replace(/(\s\s+)|([.|\.|\!|\?|\s]+?$)/gm,""));
		});
	}

	//if (tweetTxt.match(/(??)|(!?)|(?!)|(!!)|(\(c\))/gm) !== null) {
		addSpaceSuggestion("Use ligatures to free up some space",function(){
			$(".compose-text").val(tweetTxt
			 .replace(/\?\?/gm,"⁇")
			 .replace(/\!\?/gm,"⁉")
			 .replace(/\?\!/gm,"⁈")
			 .replace(/\!\!/gm,"‼")
			 .replace(/\(c\)/gm,"Ⓒ")
			 .replace(/\(C\)/gm,"Ⓒ")
			 .replace(/\(r\)/gm,"Ⓡ")
			 .replace(/\(R\)/gm,"Ⓡ")
			 .replace(/\(p\)/gm,"Ⓟ")
			 .replace(/\(P\)/gm,"Ⓟ")
			 .replace(/\(tm\)/gm,"™")
			 .replace(/\(TM\)/gm,"™")
			 .replace(/\(sm\)/gm,"℠")
			 .replace(/\(SM\)/gm,"℠")
			 .replace(/0\/000/gm,"‱")
			 .replace(/0\/00/gm,"‰")
			 .replace(/0\/0/gm,"%")
			 .replace(/ae/gm,"æ")
			 .replace(/AE/gm,"Æ")
			 .replace(/AU/gm,"Ꜷ")
			 .replace(/AV/gm,"Ꜹ")
			 .replace(/av/gm,"ꜹ")
			 .replace(/au/gm,"ꜷ")
			 .replace(/AO/gm,"Ꜵ")
			 .replace(/ao/gm,"ꜵ")
			 .replace(/===/gm,"⩶")
			 .replace(/==/gm,"⩵")
			 .replace(/iii/gm,"ⅲ")
			 .replace(/ii/gm,"ⅱ")
			 .replace(/10\./gm,"⒑")
			 .replace(/11\./gm,"⒒")
			 .replace(/12\./gm,"⒓")
			 .replace(/13\./gm,"⒔")
			 .replace(/14\./gm,"⒕")
			 .replace(/15\./gm,"⒖")
			 .replace(/16\./gm,"⒗")
			 .replace(/17\./gm,"⒘")
			 .replace(/18\./gm,"⒙")
			 .replace(/19\./gm,"⒚")
			 .replace(/1\./gm,"⒈")
			 .replace(/1\,/gm,"🄂")
			 .replace(/1\./gm,"⒈")
			 .replace(/2\,/gm,"🄃")
			 .replace(/2\./gm,"⒉")
			 .replace(/3\,/gm,"🄄")
			 .replace(/3\./gm,"⒊")
			 .replace(/4\,/gm,"🄅")
			 .replace(/4\./gm,"⒋")
			 .replace(/5\,/gm,"🄆")
			 .replace(/5\./gm,"⒌")
			 .replace(/6\,/gm,"🄇")
			 .replace(/6\./gm,"⒍")
			 .replace(/7\,/gm,"🄈")
			 .replace(/7\./gm,"⒎")
			 .replace(/8\,/gm,"🄉")
			 .replace(/8\./gm,"⒏")
			 .replace(/9\,/gm,"🄊")
			 .replace(/9\./gm,"⒐")
			 .replace(/0\,/gm,"🄁")
			 .replace(/0\./gm,"🄀")
			 .replace(/\.\.\./gm,"…")
			 .replace(/\\\\/gm,"⳹")
			 .replace(/\/\/\//gm,"⫻")
			 .replace(/\<\<\</gm,"⋘")
			 .replace(/\<\</gm,"≪")
			 .replace(/\>\>\>/gm,"⋙")
			 .replace(/\>\>/gm,"≫")
			 .replace(/\/\//gm,"⫽")
			 .replace(/\.\./gm,"‥")
			 .replace(/···/gm,"⋯")
			 .replace(/·,/gm,"ꓻ")
			 .replace(/\(1\)/gm,"⑴")
			 .replace(/\(10\)/gm,"⑽")
			 .replace(/\(11\)/gm,"⑾")
			 .replace(/\(12\)/gm,"⑿")
			 .replace(/\(13\)/gm,"⒀")
			 .replace(/\(14\)/gm,"⒁")
			 .replace(/\(15\)/gm,"⒂")
			 .replace(/\(16\)/gm,"⒃")
			 .replace(/\(17\)/gm,"⒄")
			 .replace(/\(18\)/gm,"⒅")
			 .replace(/\(19\)/gm,"⒆")
			 .replace(/\(20\)/gm,"⒇")
			 .replace(/\(2\)/gm,"⑵")
			 .replace(/\(3\)/gm,"⑶")
			 .replace(/\(4\)/gm,"⑷")
			 .replace(/\(5\)/gm,"⑸")
			 .replace(/\(6\)/gm,"⑹")
			 .replace(/\(7\)/gm,"⑺")
			 .replace(/\(8\)/gm,"⑻")
			 .replace(/\(9\)/gm,"⑼")
			 .replace(/\(a\)/gm,"⒜")
			 .replace(/\(A\)/gm,"🄐")
			 .replace(/\(b\)/gm,"⒝")
			 .replace(/\(B\)/gm,"🄑")
			 .replace(/\(c\)/gm,"⒞")
			 .replace(/\(C\)/gm,"🄒")
			 .replace(/\(d\)/gm,"⒟")
			 .replace(/\(D\)/gm,"🄓")
			 .replace(/\(e\)/gm,"⒠")
			 .replace(/\(E\)/gm,"🄔")
			 .replace(/\(f\)/gm,"⒡")
			 .replace(/\(F\)/gm,"🄕")
			 .replace(/\(g\)/gm,"⒢")
			 .replace(/\(G\)/gm,"🄖")
			 .replace(/\(h\)/gm,"⒣")
			 .replace(/\(H\)/gm,"🄗")
			 .replace(/\(i\)/gm,"⒤")
			 .replace(/\(I\)/gm,"🄘")
			 .replace(/\(l\)/gm,"🄘")
			 .replace(/\(j\)/gm,"⒥")
			 .replace(/\(J\)/gm,"🄙")
			 .replace(/\(k\)/gm,"⒦")
			 .replace(/\(K\)/gm,"🄚")
			 .replace(/\(L\)/gm,"🄛")
			 .replace(/\(m\)/gm,"⒨")
			 .replace(/\(M\)/gm,"🄜")
			 .replace(/\(n\)/gm,"⒩")
			 .replace(/\(N\)/gm,"🄝")
			 .replace(/\(o\)/gm,"⒪")
			 .replace(/\(O\)/gm,"🄞")
			 .replace(/\(p\)/gm,"⒫")
			 .replace(/\(P\)/gm,"🄟")
			 .replace(/\(q\)/gm,"⒬")
			 .replace(/\(Q\)/gm,"🄠")
			 .replace(/\(r\)/gm,"⒭")
			 .replace(/\(R\)/gm,"🄡")
			 .replace(/\(s\)/gm,"⒮")
			 .replace(/\(S\)/gm,"🄢")
			 .replace(/\(t\)/gm,"⒯")
			 .replace(/\(T\)/gm,"🄣")
			 .replace(/\(u\)/gm,"⒰")
			 .replace(/\(U\)/gm,"🄤")
			 .replace(/\(v\)/gm,"⒱")
			 .replace(/\(V\)/gm,"🄥")
			 .replace(/\(w\)/gm,"⒲")
			 .replace(/\(W\)/gm,"🄦")
			 .replace(/\(x\)/gm,"⒳")
			 .replace(/\(X\)/gm,"🄧")
			 .replace(/\(y\)/gm,"⒴")
			 .replace(/\(Y\)/gm,"🄨")
			 .replace(/\(z\)/gm,"⒵")
			 .replace(/\(Z\)/gm,"🄩")
			 .replace(/\(-\)/gm,"㈠")
			 .replace(/\'\'\'\'/gm,"⁗")
			 .replace(/\'\'\'/gm,"‴")
			 .replace(/\(\(/,"⸨")
			 .replace(/\(ー\)/gm,"㈠")
			 .replace(/11./gm,"⒒")
			 .replace(/oo/gm,"ꝏ")
			 .replace(/\'\'/gm,"\"")
			 .replace(/OO/gm,"Ꝏ")
			 .replace(/ls/gm,"ʪ")
			 .replace(/lt/gm,"₶")
			 .replace(/lz/gm,"ʫ")
			 .replace(/III/gm,"Ⅲ")
			 .replace(/lj/gm,"ǉ")
			 .replace(/Lj/gm,"ǈ")
			 .replace(/LJ/gm,"Ĳ")
			 .replace(/IV/gm,"Ⅳ")
			 .replace(/IX/gm,"Ⅸ")
			 .replace(/II/gm,"‖")
			 .replace(/ij/gm,"ĳ")
			 .replace(/IJ/gm,"Ĳ")
			 .replace(/iv/gm,"ⅳ")
			 .replace(/ix/gm,"ⅸ")
			 .replace(/dz/gm,"ǳ")
			 .replace(/Dz/gm,"ǲ")
			 .replace(/DZ/gm,"Ǳ")
			 .replace(/ffl/gm,"ﬄ")
			 .replace(/ffi/gm,"ﬃ")
			 .replace(/ff/gm,"ﬀ")
			 .replace(/fi/gm,"ﬁ")
			 .replace(/fl/gm,"ﬂ")
			 .replace(/aa/gm,"ꜳ")
			 .replace(/AA/gm,"Ꜳ"));
		});
	//}

}

function outtaSpaceSuggestions() {

	$("button.js-retweet-button.is-disabled.js-show-tip").removeClass("is-disabled js-show-tip").attr("title","");

	if ($(".js-media-added").length > 0 && $(".character-count-compose").length > 0) {
		if (parseInt($(".character-count-compose").val()) < 0) {

			if ($(".mtd-out-of-space-suggestions").length <= 0) {

				$(".js-media-added").append(
					make("div")
					.addClass("compose-media-bar-holder padding-al mtd-out-of-space-suggestions")
					.html('<div class="compose-media-bar"><div class="mtd-no-chars-suggestions"><div class="txt weight-light txt-extra-large margin-b--10">Oops, you\'re over the character limit.</div>Here are suggestions to help:<br></div></div>')
				).removeClass("is-hidden");

				checkSpaceSuggestions();
			} else {
				$(".mtd-no-chars-suggestions>button").remove();
				checkSpaceSuggestions();
			}

		} else if ($(".mtd-out-of-space-suggestions").length > 0 && parseInt($(".character-count-compose").val()) >= 0) {
			$(".mtd-out-of-space-suggestions").remove();
			$(".js-media-added").addClass("is-hidden");
		}
	}

}

// warning: for some shitty ass reason this doesnt work if the console.logs arent there DONT ASK WH I DONT KNOW

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
			if (tar.hasClass("is-hidden")) {
				tar.addClass("mtd-modal-window-fade-out");
				setTimeout(function(){
					tar.remove();
				},300);
			}
		} else {
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
	}
}

setTimeout(MTDInit,0);
setTimeout(function(){
	setInterval(outtaSpaceSuggestions,800);
},4000);


html.addClass("mtd-preferences-differentiator mtd-api-ver-6-0 mtd-js-loaded");

window.addEventListener("keyup",KeyboardShortcutHandler,false);

mutationObserver(document.querySelector("meta[http-equiv='default-style']"),checkIfUserSelectedNewTheme,{attributes:true});
mutationObserver(body[0],checkIfBTDIsInstalled,{attributes:true});
mutationObserver(html[0],onElementAddedToDOM,{attributes:false,subtree:true,childList:true})

// mutationObserver(body[0],
// 	function(mutations) {
// 		console.log("new thing!");
// 	    mutations.forEach(function(mutation) {
// 				console.log("new thing!!");
// 	      for (var i = 0; i < mutation.addedNodes.length; i++)
// 					if ($(mutation.addedNodes[i]).hasClass("btn") || $(mutation.addedNodes[i]).hasClass("list-link"))
// 	          console.log("new button!");
// 	    })
// 	},
// {childList:true});

// var insertedNodes = [];
// new MutationObserver(function(mutations) {
// 	console.log("new thing!");
// 		mutations.forEach(function(mutation) {
// 			console.log("new thing!!");
// 			for (var i = 0; i < mutation.addedNodes.length; i++)
// 				if ($(mutation.addedNodes[i]).hasClass("btn") || $(mutation.addedNodes[i]).hasClass("list-link"))
// 					console.log("new button!");
// 		})
// }).observe(body[0], {
//     childList: true
// });

checkIfUserSelectedNewTheme();
checkIfSigninFormIsPresent();
checkIfBTDIsInstalled();
loginInterval = setInterval(checkIfSigninFormIsPresent,500);

console.log("MTDinject loaded");
