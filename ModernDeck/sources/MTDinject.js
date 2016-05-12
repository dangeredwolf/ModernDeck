// MTDinject.js
// Copyright (c) 2016 Dangered Wolf, Jumono

// made with love <3

"use strict";

var SystemVersion = "6.0 Beta Build 2016.05.11.1";
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

const make = function(a){return $(document.createElement(a))};
const head = $(document.head);
const body = $(document.body);
const html = $(document.querySelector("html")); // Only 1 result; faster to find

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
	var url = MTDBaseURL + "sources/cssextensions/" + name + ".css";

	if (document.querySelector('head>link[href="' + url + '"]') === null) {
		head.append(
			make("link")
			.attr("rel","stylesheet")
			.attr("href",url)
			.addClass("mtd-stylesheet-extension")
		)
	} else {
		return;
	}
}

function disableStylesheetExtension(name) {
	$('head>link[href="' + MTDBaseURL + "sources/cssextensions/" + name + '.css"]').remove();
}

function disableExtraStylesheetExtensions() {
	$("head>link.mtd-stylesheet-extension:not([href='" + MTDBaseURL + "sources/cssextensions/dark.css']):not([href='" + MTDBaseURL + "sources/cssextensions/light.css'])").remove();
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
	if (getPref("mtd_round_avatars") === false)
		html.addClass("mtd-no-round-avatars");
	else
		setPref("mtd_round_avatars",true);

	if (getPref("mtd_dark_media") === true)
		html.addClass("mtd-dark-media-previews");
	else
		setPref("mtd_dark_media",false);

	if (getPref("mtd_outlines") === true)
		html.addClass("mtd-acc-focus-ring");
	else
		setPref("mtd_outlines",false);

		disableExtraStylesheetExtensions();

	if (getPref("mtd_theme") !== "" && getPref("mtd_theme") !== null && typeof getPref("mtd_theme") !== "undefined")
		enableStylesheetExtension(getPref("mtd_theme"));
}

function getPref(id) {
	if (localStorage[id] === "true") {
		return true;
	} else if (localStorage[id] === "false") {
		return false;
	} else {
		return localStorage[id];
	}
}

function setPref(id,p) {
	localStorage[id] = p;
}

function GetURL(url) {
	return MTDBaseURL + url;
}

function fontParseHelper(a) {
	if (typeof a !== "object" || a === null) {
		throw "you forgot to pass the object";
	}

	return "@font-face{font-family:'"+(a.family||"Roboto")+"';font-style:"+(a.style||"normal")+";font-weight:"+(a.weight || "300")+";src:url("+MTDBaseURL+"sources/fonts/"+a.name+".woff2) format('woff2');unicode-range:"+(a.range||
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

	$(document.head).append(make("style").html(
		fontParseHelper({name:"Roboto300latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({name:"Roboto300latinext"}) +
		fontParseHelper({weight:"400",name:"Roboto400latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"400",name:"Roboto400latinext"}) +
		fontParseHelper({weight:"500",name:"Roboto500latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"500",name:"Roboto500latinext"}) +
		fontParseHelper({family:"Material",weight:"400",name:"MaterialIcons",range:"U+0000-F000"}) +
		fontParseHelper({family:"Font Awesome",weight:"400",name:"fontawesome",range:"U+0000-F000"})
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
	TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative"> </li>';
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

	head.append(
		make("script")
			.attr("type","text/javascript")
			.attr("src",MTDBaseURL + "sources/libraries/waves.js")
	)

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

		if (localStorage.mtd_round_avatars === "true" && !$("#mtd-round-avatars-control")[0].checked) {
			console.log("someone unchecked me!!");
			localStorage.mtd_round_avatars = false;
			html.addClass("mtd-no-round-avatars");
			savePreferencesToDisk();
		}

		if (localStorage.mtd_round_avatars === "false" && $("#mtd-round-avatars-control")[0].checked) {
			console.log("someone checked me!!");
			localStorage.mtd_round_avatars = true;
			html.removeClass("mtd-no-round-avatars");
			savePreferencesToDisk();
		}

		if (localStorage.mtd_dark_media === "false" && $("#mtd-dark-media-control")[0].checked) {
			console.log("someone checked me!!");
			localStorage.mtd_dark_media = true;
			html.addClass("mtd-dark-media-previews");
			savePreferencesToDisk();
		}

		if (localStorage.mtd_dark_media === "true" && !$("#mtd-dark-media-control")[0].checked) {
			console.log("someone unchecked me!!");
			localStorage.mtd_dark_media = false;
			html.removeClass("mtd-dark-media-previews");
			savePreferencesToDisk();
		}

		if (localStorage.mtd_outlines === "false" && $("#mtd-outlines-control")[0].checked) {
			console.log("someone checked me!!");
			localStorage.mtd_outlines = true;
			html.addClass("mtd-acc-focus-ring");
			savePreferencesToDisk();
		}

		if (localStorage.mtd_outlines === "true" && !$("#mtd-outlines-control")[0].checked) {
			console.log("someone unchecked me!!");
			localStorage.mtd_outlines = false;
			html.removeClass("mtd-acc-focus-ring");
			savePreferencesToDisk();
		}

		if ($("#mtd-theme-control option:selected").length > 0 && localStorage.mtd_theme !== $("#mtd-theme-control option:selected")[0].value) {
			//html.removeClass("mtd-back-" + localStorage.mtd_theme);
			localStorage.mtd_theme = $("#mtd-theme-control option:selected")[0].value;
			html.addClass("mtd-back-" + $("#mtd-theme-control option:selected")[0].value);
			enableStylesheetExtension($("#mtd-theme-control option:selected")[0].value || "default");
			savePreferencesToDisk();
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
			<li id="mtd-appearance-li" class="selected"><a href="#" class="list-link" id="mtd_settings_appearance_button" data-action="general"><strong>Appearance</strong></a></li>\
			\
			<li id="mtd-accessibility-li"><a href="#" class="list-link" id="mtd_settings_accessibility_button" data-action="general"><strong>Accessibility</strong></a></li>\
			\
			<li id="mtd-about-li"><a href="#" class="list-link" id="mtd_settings_about_button" data-action="general"><strong>About</strong></a></li>\
			\
			\
			</ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v	scroll-alt mdl-col-settings">\
			\
			\
			<form action="#" id="mtd-appearance-form" accept-charset="utf-8" class="frm"><fieldset id="general_settings"><div class="control-group" style="padding-top:10px;"><label class="checkbox">Use rounded profile pictures<input type="checkbox" name="streaming-updates" checked="checked" id="mtd-round-avatars-control"> </label><label class="checkbox">Dark media viewer in light mode<input type="checkbox" name="streaming-updates" checked="checked" id="mtd-dark-media-control"> </label><label class="control-label">Theme<select id="mtd-theme-control" type="select"><option value="default" selected="selected">Default</option><option value="paper">Paper</option><option value="grey">Grey</option><option value="red">Red</option><option value="pink">Pink</option><option value="orange">Orange</option><option value="violet">Violet</option><option value="teal">Teal</option><option value="green">Green</option><option value="yellow">Yellow</option><option value="cyan">Cyan</option><option value="black">Black</option><option value="blue">Blue</option></select></label></div></fieldset></form>\
			\
			<form action="#" id="mtd-accessibility-form" accept-charset="utf-8" class="frm" style="display:none;"><fieldset id="general_settings"><label class="checkbox">Always show outlines on focussed items<input type="checkbox" checked="checked" id="mtd-outlines-control"> </label></fieldset></form>\
			\
			<form action="#" id="mtd-about-form" accept-charset="utf-8" class="frm" style="display:none;"><fieldset id="general_settings"><img src="' + MTDBaseURL + 'sources/mtdabout.png" class="mtd-logo"><h1 class="list-placeholder mtd-about-title">ModernDeck</h1><h2 class="mtd-version-title">You\'re running version ' + SystemVersion + '</h2><div class="mdl-links" style="margin-bottom:-10px"> <a href="https://dangeredwolf.com/TweetDeckEnhancer/privacy.txt" style="display:none" target="_blank">Privacy Policy</a> </div></fieldset></form>\
			\
			</div> </div> </div>');

			$("#mtd-round-avatars-control").attr("checked",localStorage.mtd_round_avatars === "true" && true || false);
			$("#mtd-outlines-control").attr("checked",localStorage.mtd_outlines === "true" && true || false);
			$("#mtd-dark-media-control").attr("checked",localStorage.mtd_dark_media === "true" && true || false);
			$("#mtd-theme-control").val(localStorage.mtd_theme || "default");


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

function PrepareLoginStuffs() {
	var profileInfo = getProfileInfo();
	if (profileInfo === null || typeof profileInfo === "undefined" || typeof profileInfo._profileBannerURL === "undefined" || profileInfo.profileImageURL === "undefined") {
		setTimeout(PrepareLoginStuffs,150);
		return;
	}
	var bannerPhoto = profileInfo._profileBannerURL.search("empty") > 0 ? "" : profileInfo._profileBannerURL();
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

	loadPreferences();
}

function NavigationSetup() {
	if ($(".app-header-inner").length < 1) {
		setTimeout(NavigationSetup,100);
		return;
	}

	loadPreferences();

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
			.attr("style","background:#00BCD4"),
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
				make("img")
				.attr("src",MTDBaseURL + "sources/tweetdecksmall.png")
				.addClass("mtd-nav-drawer-icon")
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
				make("img")
				.attr("src",MTDBaseURL + "sources/MTDsmall.png")
				.addClass("mtd-nav-drawer-icon")
			)
			.click(MTDSettings)
			.append("ModernDeck Settings"),
			make("button")
			.addClass("btn mtd-nav-button")
			.attr("id","btdsettings")
			.append(
				make("img")
				.attr("src",MTDBaseURL + "sources/BTDsmall.png")
				.addClass("mtd-nav-drawer-icon")
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
				make("img")
				.attr("src",MTDBaseURL + "sources/logout.png")
				.addClass("mtd-nav-drawer-icon")
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
				make("img")
				.attr("src",MTDBaseURL + "sources/accounts.png")
				.addClass("mtd-nav-drawer-icon")
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
				make("img")
				.attr("src",MTDBaseURL + "sources/KBshortcuts.png")
				.addClass("mtd-nav-drawer-icon")
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
				make("img")
				.attr("src",MTDBaseURL + "sources/AddColumn.png")
				.addClass("mtd-nav-drawer-icon")
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

	PrepareLoginStuffs();
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

		enableStylesheetExtension(localStorage.mtd_theme || "default");
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
							<br>mtd_round_avatars: ' + localStorage.mtd_round_avatars + '\
							<br>mtd_flag_block_secure_ss: ' + localStorage.mtd_flag_block_secure_ss + '\
							<br>mtd_flag_block_communications: ' + localStorage.mtd_flag_block_communications + '\
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
		.click(function(){this.remove()})
	);
}

function checkSpaceSuggestions() {
	var tweetTxt = $(".compose-text").val();

	if (tweetTxt.match(/ ( )+/g) !== null) {
		addSpaceSuggestion("Trim excess space inside",function(){
			$(".compose-text").val(tweetTxt.replace(/ ( )+/g," "));
		});
	}

	if (tweetTxt.match(/(^\s+)|([^\w|.|\.|\!|\?]+?$)/gm) !== null) {
		addSpaceSuggestion("Trim excess space around edges",function(){
			$(".compose-text").val(tweetTxt.replace(/(^\s+)|([^\w|.|\.|\!|\?]+?$)/gm,""));
		});
	}

}

// TODO: write this future library as jquery

function outtaSpaceSuggestions() {

	if (typeof $(".js-media-added")[0] !== "undefined" && typeof $(".character-count-compose")[0] !== "undefined") {
		if (parseInt($(".character-count-compose")[0].value) < 0) {

			if (typeof $(".mtd-out-of-space-suggestions")[0] === "undefined") {

				NoCharsNotification = document.createElement("div");
				NoCharsNotification.className = "compose-media-bar-holder padding-al mtd-out-of-space-suggestions";
				NoCharsNotification.innerHTML = '<div class="compose-media-bar"><div class="mtd-no-chars-suggestions"><div class="txt weight-light txt-extra-large margin-b--10">Oops, you\'re over the character limit.</div>Here are suggestions to help:<br></div></div>';

				$(".js-media-added")[0].appendChild(NoCharsNotification);
				$(".js-media-added")[0].className = "js-media-added";

				checkSpaceSuggestions();
			}

		} else if (typeof $(".mtd-out-of-space-suggestions")[0] !== "undefined" && parseInt($(".character-count-compose")[0].value) >= 0) {
			$(".mtd-out-of-space-suggestions")[0].remove();
			$(".js-media-added")[0].className = "js-media-added is-hidden";
		}
	}

	setTimeout(outtaSpaceSuggestions,2000);
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
			var observer = new MutationObserver(function(mutations) {
				console.log("its gone now!");
				if (tar.hasClass("is-hidden")) {
					tar.addClass("mtd-modal-window-fade-out");
					setTimeout(function(){
						tar.remove();
						observer.disconnect();
					},300);
				}
			});
			observer.observe(e.target, { attributes: true, childList: false, characterData: false });
		}
	}
}

setTimeout(MTDInit,0);
//setTimeout(outtaSpaceSuggestions,7000);

html.addClass("mtd-preferences-differentiator mtd-api-ver-6-0 mtd-js-loaded");

window.addEventListener("keyup",KeyboardShortcutHandler,false);

(new MutationObserver(checkIfUserSelectedNewTheme)).observe(document.querySelector("meta[http-equiv='default-style']"),{attributes:true});
(new MutationObserver(checkIfBTDIsInstalled)).observe(body[0],{attributes:true});
(new MutationObserver(onElementAddedToDOM)).observe(html[0],{attributes:false,subtree:true,childList:true});

var insertedNodes = [];
new MutationObserver(function(mutations) {
	console.log("new thing!");
    mutations.forEach(function(mutation) {
			console.log("new thing!!");
      for (var i = 0; i < mutation.addedNodes.length; i++)
				if ($(mutation.addedNodes[i]).hasClass("btn") || $(mutation.addedNodes[i]).hasClass("list-link"))
          console.log("new button!");
    })
}).observe(body[0], {
    childList: true
});

checkIfUserSelectedNewTheme();
checkIfSigninFormIsPresent();
checkIfBTDIsInstalled();
loginInterval = setInterval(checkIfSigninFormIsPresent,500);

console.log("MTDinject loaded");
