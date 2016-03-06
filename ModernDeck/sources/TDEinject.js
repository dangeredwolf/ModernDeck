// TDEinject.js
// Copyright (c) 2015 Dangered Wolf, Jumono

// made with love <3

var msgID = 0;
var messagesAccounted = [];

var profileProblem = false;

var TDEDark = true;

var addedColumnsLoadingTagAndIsWaiting = false;
var TDEBaseURL = "https://dangeredwolf.com/assets/tdetest/"; // Defaults to streaming if nothing else is available (i.e. legacy firefox)
var progress = null;
var tde_fetch_profile_info_for_nav_drawer = 0;

var SystemVersion = "5.4.1";

var TreatGeckoWithCare = false;

var FindProfButton;

var WantsToBlockCommunications = false;
var WantsToDisableSecureStylesheets = false;

var elements = function(a,b,c){return document.getElementsByClassName(a,b,c)};

var Preferences = []

Preferences.Appearance = [
	[
		"flag",
		"tde-round-avatars",
		"tde_round_avatars",
		"tde-rounded-profiles-control",
		"Use rounded profile pictures",
		true
	],
]

Preferences.Accessibility = [
	[
		"flag",
		"tde-outlines",
		"tde_outlines",
		"tde-outlines-control",
		"Always show outlines on focussed items",
		false
	]
]

if (typeof TDEURLExchange !== "undefined") {
	TDEBaseURL = TDEURLExchange.getAttribute("type") || "https://dangeredwolf.com/assets/tdetest/";
	console.info("TDEURLExchange completed with URL " + TDEBaseURL);
} else {
	console.warn("TDEURLExchange failed :( defaulting to streamed sources, may not work... but we'll try...");
}

if (typeof chrome === "undefined" && typeof safari === "undefined") {
	TreatGeckoWithCare = true;
}

function GetURL(url) {
	return TDEBaseURL + url;
}

function TDEInit(){
	if (typeof $ === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	if (typeof TD_mustaches === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	if (typeof TD === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	if (typeof TD.util === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	if (typeof TD.util.prettyTimeString === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	if (typeof TD_mustaches["settings/global_setting_filter_row.mustache"] === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	if (typeof elements("js-modals-container")[0] === "undefined") {
		setTimeout(TDEInit,500);
		return;
	}

	/*if ((typeof localStorage.tde_flag_block_secure_ss !== "undefined" && !localStorage.tde_flag_block_secure_ss) || (typeof localStorage.tde_flag_block_secure_ss === "undefined")) { // Please just disable this by DisableSecureStylesheets() as it resets the whole thing for you
		injStyles = document.createElement("link");
		injStyles.rel = "stylesheet";
		if (navigator.userAgent.indexOf("Windows NT 5.1") > -1 || navigator.userAgent.indexOf("Windows NT 5.2") > -1) {
			injStyles.href = "http://tweetdeckenhancer.com/additionscss";
		} else {
			injStyles.href = "https://tweetdeckenhancer.com/additionscss";
		}
		document.head.appendChild(injStyles);
	}*/

	InjectFonts = document.createElement("style");
	InjectFonts.innerHTML = "\
	@font-face {\
		font-family:'Roboto';\
		font-style:normal;\
		font-weight: 300;\
		src: url(" + TDEBaseURL + "sources/fonts/Roboto300latinext.woff2) format('woff2');\
		unicode-range:U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF;\
	}\
	@font-face {\
		font-family:'Roboto';\
		font-style: normal;\
		font-weight: 300;\
		src: url(" + TDEBaseURL + "sources/fonts/Roboto300latin.woff2) format('woff2');\
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
	}\
	@font-face {\
		font-family: 'Roboto';\
		font-style: normal;\
		font-weight: 400;\
		src: url(" + TDEBaseURL + "sources/fonts/Roboto400latinext.woff2) format('woff2');\
		unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
	}\
	@font-face {\
		font-family: 'Roboto';\
		font-style: normal;\
		font-weight: 400;\
		src: url(" + TDEBaseURL + "sources/fonts/Roboto400latin.woff2) format('woff2');\
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
	}\
	@font-face {\
		font-family: 'Roboto';\
		font-style: normal;\
		font-weight: 500;\
		src: url(" + TDEBaseURL + "sources/fonts/Roboto500latinext.woff2) format('woff2');\
		unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;\
	}\
	@font-face {\
		font-family: 'Roboto';\
		font-style: normal;\
		font-weight: 500;\
		src: url(" + TDEBaseURL + "sources/fonts/Roboto500latin.woff2) format('woff2');\
		unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;\
	}\
	@font-face {\
		font-family: 'Material Icons';\
		font-style: normal;\
		font-weight: 400;\
		src: url(" + TDEBaseURL + "sources/fonts/MaterialIcons.woff2) format('woff2');\
	}\
	@font-face {\
		font-family: 'Font Awesome';\
		font-style: normal;\
		font-weight: 400;\
		src: url(" + TDEBaseURL + "sources/fonts/fontawesome.woff2) format('woff2');\
	}";


	document.head.appendChild(InjectFonts);

	elements("js-modals-container")[0].removeChild = function(rmnode){
		if (typeof rmnode === "undefined") {
			console.log("what");
			return;
		}
		rmnode.setAttribute("class","js-modal-context tde-modal-window-fade-out overlay overlay-super scroll-v");
		setTimeout(function(){rmnode.remove();},200);
	}

	if (typeof elements("js-modal")[0] !== "undefined") {

		elements("js-modal")[0].removeChild = function(rmnode){
			if (typeof rmnode === "undefined") {
				console.log("what");
				return;
			}
			rmnode.setAttribute("class","js-modal-context tde-modal-window-fade-out overlay overlay-super scroll-v");
			setTimeout(function(){rmnode.remove();},200);
		}
	}

	document.body.removeChild = function(i) {
		if (typeof i.getAttribute("class") !== "undefined" && i.getAttribute("class") !== null && i.getAttribute("class").indexOf("tooltip") > -1) {
			setTimeout(function(){
				i.remove(); // Tooltips automatically animate themselves out. But here we clean them up as well ourselves.
			},500);
		}
		else {
 		i.remove();
	}
 	}

	$("link[rel=\"shortcut icon\"]")[0].href = TDEBaseURL + "sources/favicon.ico";

	var AudioSources = document.getElementsByTagName("source");

	for (i = 0; i < AudioSources.length; i++) {
		AudioSources[i].remove();
	}

	var NotificationSound = document.getElementsByTagName("audio")[0];
	NotificationSound.src = GetURL("sources/alert_2.mp3");

	TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="tde-mute-text tde-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative"> </li>'

	if (localStorage.tde_round_avatars === "false") {
		document.getElementsByTagName("html")[0].className += " tde-no-round-avatars";
	} else if (typeof localStorage.tde_round_avatars === "undefined") {
		localStorage.tde_round_avatars = true;
	}

	if (localStorage.tde_dark_media === "true") {
		document.getElementsByTagName("html")[0].className += " tde-dark-media-previews";
	} else if (typeof localStorage.tde_dark_media === "undefined") {
		localStorage.tde_dark_media = true;
	}

	if (localStorage.tde_outlines === "true") {
		document.getElementsByTagName("html")[0].className += " tde-acc-focus-ring";
	} else if (typeof localStorage.tde_outlines === "undefined"){
		localStorage.tde_outlines = false;
	}

	TD.util.prettyTimeString = function(e) {
		return TD.i("{{hours12}}:{{minutes}} {{amPm}}, {{day}} {{month}} {{fullYear}}", TD.util.prettyTime(e))
	}

	NavigationSetup();

}

function WaitForLogin() {
	if (typeof elements("app-signin-form")[0] === "undefined") {
		document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class").replace(" signin-sheet-now-present",""));
		return;
	}
	setTimeout(WaitForLogin,500);
}

function SendNotificationMessage(txt) {
	if (TDENotification.className === "tde-appbar-notification") {
		TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
		setTimeout(function(){
			TDENotification.className = "tde-appbar-notification";
			TDENotification.innerHTML = txt;
		},300);
	} else {
		TDENotification.className = "tde-appbar-notification";
		TDENotification.innerHTML = txt;
	}
}

function WaitForNotificationDismiss(node,prevmsgID) {
	if (typeof node === "undefined" || node === null || typeof node.parentNode === "undefined" || node.parentNode === null) {
		if (msgID === prevmsgID) {
			TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
			messagesAccounted[node] = undefined;
			return;
		} else {
			return;
		}
	}

	setTimeout(function(){WaitForNotificationDismiss(node,prevmsgID);},500);
}

function WorldTick(){

	var elms = document.querySelectorAll(".tweet-action-item,.tweet-detail-action-item,.app-navigator.margin-bm.padding-ts");

	for (i = 0; i < elms.length; i++) {
		elms[i].removeChild = function(dropdown){
			dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
			setTimeout(function(){
				dropdown.remove();
			},200)
		}
	}

	/*var elms2 = document.querySelectorAll(".chirp-container");

	for (i = 0; i < elms2.length; i++) {
		elms2[i].removeChild = function(tweetarticle){
			tweetarticle.setAttribute("class",tweetarticle.getAttribute("class") + " tde-tweet-fade-out");
			setTimeout(function(){
				tweetarticle.remove();
			},500)
		}
	}*/

	if (typeof document.querySelector(".status-message") !== "undefined") {
		for (i = 0; i < elements("status-message").length; i++) {
			if (typeof messagesAccounted[elements("status-message")[i]] === "undefined") {
				var thing = elements("status-message")[i];

				msgID++;

				SendNotificationMessage(thing.childNodes[1].innerHTML);
				WaitForNotificationDismiss(thing,msgID);

				messagesAccounted[elements("status-message")[i]] = true;
			}
		}
	}

	setTimeout(WorldTick,600);
}

function ResetSettingsUI() {
	$("#tde-appearance-form")[0].style.cssText = "display:none;";
	$("#tde-accessibility-form")[0].style.cssText = "display:none;";
	$("#tde-about-form")[0].style.cssText = "display:none;";
	$("#tde-appearance-li")[0].className = "";
	$("#tde-accessibility-li")[0].className = "";
	$("#tde-about-li")[0].className = "";
}

function PrefsListener() {
	console.log("Testing...");
	if ($("#tde-round-avatars-control").length > 0) {
		console.log("waiting...");

		if (localStorage.tde_round_avatars === "false" && $("#tde-round-avatars-control")[0].checked) {
			console.log("Hey true!!");
			localStorage.tde_round_avatars = true;
			document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className.replace(" tde-no-round-avatars","");
		}

		if (localStorage.tde_round_avatars === "true" && !$("#tde-round-avatars-control")[0].checked) {
			console.log("Hey false!!");
			localStorage.tde_round_avatars = false;
			document.getElementsByTagName("html")[0].className += " tde-no-round-avatars";
		}


		if (localStorage.tde_dark_media === "false" && $("#tde-dark-media-control")[0].checked) {
			console.log("Hey true!!");
			localStorage.tde_dark_media = true;
			document.getElementsByTagName("html")[0].className += " tde-dark-media-previews";
		}

		if (localStorage.tde_dark_media === "true" && !$("#tde-dark-media-control")[0].checked) {
			console.log("Hey false!!");
			localStorage.tde_dark_media = false;
			document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className.replace(" tde-dark-media-previews","");
		}

		if (localStorage.tde_outlines === "false" && $("#tde-outlines-control")[0].checked) {
			console.log("Hey true!!");
			localStorage.tde_outlines = true;
			document.getElementsByTagName("html")[0].className += " tde-acc-focus-ring";
		}

		if (localStorage.tde_outlines === "true" && !$("#tde-outlines-control")[0].checked) {
			console.log("Hey false!!");
			localStorage.tde_outlines = false;
			document.getElementsByTagName("html")[0].className = document.getElementsByTagName("html")[0].className.replace(" tde-acc-focus-ring","");
		}

		setTimeout(PrefsListener,500);
	}
}

function TDESettings() {
	TDEPrepareWindows();
		setTimeout(function(){
			elements("js-app-settings")[0].click();
		},25);
		setTimeout(function(){
			elements("app-navigator margin-bm padding-ts")[0].childNodes[elements("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[7].childNodes[1].click();
		},50);
		setTimeout(function(){
			var tdesettingsmodalview = $("#settings-modal .mdl")[0];
			tdesettingsmodalview.className = "js-modal-panel mdl s-short is-inverted-dark tde-settings-panel";
			var tdesettingsmodalinner = $("#settings-modal .mdl .mdl-inner")[0];
			$("#settings-modal .mdl .js-header-title")[0].className = "mdl-header-title";
			$("#settings-modal .mdl .mdl-header-title")[0].innerHTML = "ModernDeck Settings";
			tdesettingsmodalinner.innerHTML = '<div class="mdl-content js-mdl-content horizontal-flow-container"> <div class="l-column mdl-column mdl-column-sml"> <div class="l-column-scrollv scroll-v	scroll-alt "> <ul class="lst-group js-setting-list">\
			<li id="tde-appearance-li" class="selected"><a href="#" class="list-link" id="enhancer_settings_appearance_button" data-action="general"><strong>Appearance</strong></a></li>\
			\
			<li id="tde-accessibility-li"><a href="#" class="list-link" id="enhancer_settings_accessibility_button" data-action="general"><strong>Accessibility</strong></a></li>\
			\
			<li id="tde-about-li"><a href="#" class="list-link" id="enhancer_settings_about_button" data-action="general"><strong>About</strong></a></li>\
			\
			\
			</ul> </div> </div> <div class="l-column mdl-column mdl-column-lrg"> <div class="l-column-scrollv scroll-v	scroll-alt mdl-col-settings">\
			\
			\
			<form action="#" id="tde-appearance-form" accept-charset="utf-8" class="frm"><fieldset id="general_settings"><div class="control-group" style="padding-top:10px;"><label class="checkbox">Use rounded profile pictures<input type="checkbox" name="streaming-updates" checked="checked" id="tde-round-avatars-control"> </label><label class="checkbox">Dark media viewer in light mode<input type="checkbox" name="streaming-updates" checked="checked" id="tde-dark-media-control"> </label></div></fieldset></form>\
			\
			<form action="#" id="tde-accessibility-form" accept-charset="utf-8" class="frm" style="display:none;"><fieldset id="general_settings"><label class="checkbox">Always show outlines on focussed items<input type="checkbox" checked="checked" id="tde-outlines-control"> </label></fieldset></form>\
			\
			<form action="#" id="tde-about-form" accept-charset="utf-8" class="frm" style="display:none;"><fieldset id="general_settings"><img src="' + TDEBaseURL + 'sources/mtdabout.png" class="tde-logo"><h1 class="list-placeholder tde-about-title">ModernDeck</h1><h2 class="tde-version-title">You\'re running version ' + SystemVersion + '</h2><div class="mdl-links" style="margin-bottom:-10px"> <a href="https://dangeredwolf.com/TweetDeckEnhancer/privacy.txt" style="display:none" target="_blank">Privacy Policy</a> </div></fieldset></form>\
			\
			</div> </div> </div>';

			$("#tde-round-avatars-control")[0].checked = (localStorage.tde_round_avatars === "true" && true || false);
			$("#tde-outlines-control")[0].checked = (localStorage.tde_outlines === "true" && true || false);
			$("#tde-dark-media-control")[0].checked = (localStorage.tde_dark_media === "true" && true || false);


			PrefsListener();

			$("#enhancer_settings_about_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#tde-about-li")[0].className = "selected";
				$("#tde-about-form")[0].style.cssText = "display:block;";
			});

			$("#enhancer_settings_appearance_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#tde-appearance-li")[0].className = "selected";
				$("#tde-appearance-form")[0].style.cssText = "display:block;";
			});

			$("#enhancer_settings_accessibility_button").on("mouseup",function() {
				ResetSettingsUI();
				$("#tde-accessibility-li")[0].className = "selected";
				$("#tde-accessibility-form")[0].style.cssText = "display:block;";
			});
		},100);
}

function ReplaceLoadingIndicator() {
	if (typeof elements("app-signin-form")[0] !== "undefined") {
		return;
	}

	if (window.tde5loadingreplaced) {
		console.log("we're too late, bye");
		return;
	}

	if (typeof elements("js-startflow-content startflow")[0] === "undefined") {
		setTimeout(ReplaceLoadingIndicator,30);
		return;
	}

}

function Analytics() {
	if (localStorage.tde_flag_block_communications) { // Please just enable this flag via executing DisableCommunications() as it resets everything related to it
		return;
	}

	if (typeof $ === "undefined") {
		setTimeout(Analytics,500);
		return;
	}
	if (typeof $.ajax === "undefined") {
		setTimeout(Analytics,500);
		return;
	}
	$.ajax({url:"https://tweetdeckenhancer.com/analytics/TDE5/?v=" + SystemVersion + "&release=beta"});
}

function PrepareLoginStuffs() {
	console.log("Start prepare login stuffs");
	if (typeof $ === "undefined") {
		setTimeout(PrepareLoginStuffs,200);
		return;
	}

	FindProfButton = $(".account-settings-row:first-child a[rel='user']")[0];
	if (typeof FindProfButton === "undefined") {
		$(".js-show-drawer.js-header-action").click();
		profileProblem = true;
		setTimeout(PrepareLoginStuffs,100);
		return;
	}
	FindProfButton.click();
	setTimeout(FinaliseLoginStuffs,0);

	setTimeout(function(){
		if (typeof $(".js-click-trap")[0] !== "undefined") {
			$(".js-click-trap")[0].className += " is-hidden";
		}
	},50);
	if (typeof $(".js-click-trap")[0] !== "undefined") {
		$(".js-click-trap")[0].className += " is-hidden";
	}
}

function FinaliseLoginStuffs() {
	if (typeof $(".js-click-trap")[0] !== "undefined") {
		$(".js-click-trap")[0].className += " is-hidden";
	}

	if (typeof elements("prf-header")[0] === "undefined") {
		if (typeof tde_fetch_profile_info_for_nav_drawer === "undefined") {
			tde_fetch_profile_info_for_nav_drawer = 0;
		}
		tde_fetch_profile_info_for_nav_drawer++;

		if (tde_fetch_profile_info_for_nav_drawer > 10) {
			console.log("this is not even working, bye");
			setTimeout(PrepareLoginStuffs,0);
			return;
		}
		setTimeout(FinaliseLoginStuffs,150);
		return;
	}

	if ($(".prf-header")[0].style.cssText.search("td_profile_empty") > -1) {
		tde_nd_header_image.setAttribute("style",$(".prf-header")[0].style.cssText); // Fetch header and place in nav drawer
	}
	tde_nd_header_photo.setAttribute("src",$(".prf-img")[0].childNodes[1].src); // Fetch profile picture and place in nav drawer
	tde_nd_header_username.innerHTML = $(".prf-card-inner")[0].childNodes[1].childNodes[5].childNodes[0].textContent; // Fetch twitter handle and place in nav drawer

	console.log("Finished login stuffs! you are in the nav drawer, I think!");

	if (profileProblem) {
		profileProblem = false;
		$(".js-show-drawer.btn-compose")[0].click();
		console.log("repaired profile problem with tweet thing");
	}
}

function NavigationSetup() {
	if (typeof elements("app-header-inner")[0] === "undefined") {
		setTimeout(NavigationSetup,100);
		return;
	}

	var TDENavigationDrawerButton = document.createElement("a");
	TDENavigationDrawerButton.id = "tde-navigation-drawer-button";
	TDENavigationDrawerButton.setAttribute("class","js-header-action tde-drawer-button link-clean cf app-nav-link");
	TDENavigationDrawerButton.innerHTML = '<div class="obj-left"><div class="tde-nav-activator"></div><div class="nbfc padding-ts"></div>';

	elements("app-header-inner")[0].appendChild(TDENavigationDrawerButton);



	TDENavigationDrawerButton.onclick = function(){
		// TODO: Wire button to open navigation drawer
		// TODO: Remove the above TODO from back when i developed tde 5.0

		if (typeof tde_nav_drawer_background !== "undefined") {
			$("#tde_nav_drawer_background").attr("class","tde-nav-drawer-background");
		}
		if (typeof tde_nav_drawer !== "undefined") {
			$("#tde_nav_drawer").attr("class","tde-nav-drawer");
		}
	};

	var TDENavigationDrawer = document.createElement("div");
	TDENavigationDrawer.id = "tde_nav_drawer";
	TDENavigationDrawer.setAttribute("class","tde-nav-drawer tde-nav-drawer-hidden");
	TDENavigationDrawer.innerHTML = '<img id="tde_nd_header_image" class="tde-nd-header-image"><img class="avatar size73 tde-nd-header-photo" id="tde_nd_header_photo"><div class="tde-nd-header-username" id="tde_nd_header_username"></div><button class="btn tde-nav-button tde-settings-button waves-effect waves-light" id="tdset"><img src="'+ GetURL("sources") + '/tweetdecksmall.png" class="tde-nav-drawer-icon">TweetDeck Settings</button><button class="btn tde-nav-button waves-effect waves-light" id="tdesettings"><img src="'+ GetURL("sources") +'/TDEsmall.png" class="tde-nav-drawer-icon">ModernDeck Settings</button><button class="btn tde-nav-button waves-effect waves-light" id="btdsettings"><img src="' + GetURL("sources") + '/BTDsmall.png" class="tde-nav-drawer-icon">Better TweetDeck Settings</button><div class="tde-nav-divider"></div><button id="tde_signout" class="btn tde-nav-button waves-effect waves-light"><img src="' + GetURL("sources") + '/logout.png" class="tde-nav-drawer-icon">Sign Out</button><button id="tdaccsbutton" class="btn tde-nav-button waves-effect waves-light"><img src="' + GetURL("sources") +'/accounts.png" class="tde-nav-drawer-icon">Your Accounts</button><div class="tde-nav-divider"></div><button id="kbshortcuts" class="btn tde-nav-button waves-effect waves-light"><img src="'+ GetURL("sources") +'/KBshortcuts.png" class="tde-nav-drawer-icon">Keyboard Shortcuts</button><button id="addcolumn" class="btn tde-nav-button waves-effect waves-light"><img src="' + GetURL("sources") + '/AddColumn.png" class="tde-nav-drawer-icon">Add Column</button>';

	document.body.appendChild(TDENavigationDrawer);

	$("#tde_nd_header_image").attr("style","background:#00BCD4");
	$("#tde_nd_header_photo").attr("src","");
	$("#tde_nd_header_username").html("PROFILE ERROR<br>Tell @dangeredwolf i said hi");

	setTimeout(PrepareLoginStuffs,0);

	window.TDEPrepareWindows = function() {
		document.getElementById("update-sound").click();

		for (i = 0; i < elements("js-click-trap").length; i++) {
			elements("js-click-trap")[i].click();
		}

		tde_nav_drawer_background.click();
	}

	tdset.onclick = function(){
		TDEPrepareWindows();

		setTimeout(function(){
			elements("js-app-settings")[0].click();
		},25);
		setTimeout(function(){
			elements("app-navigator margin-bm padding-ts")[0].childNodes[elements("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[7].childNodes[1].click();
		},50);
	}

	tdesettings.onclick = TDESettings;

	btdsettings.onclick = function(){
		TDEPrepareWindows();
		setTimeout(function(){
			var opn = window.open("chrome-extension://micblkellenpbfapmcpcfhcoeohhnpob/options/options.html", '_blank');
			opn.focus();
		},200);
	}

	if (TreatGeckoWithCare) {
		btdsettings.remove();
	}

	kbshortcuts.onclick = function(){
		TDEPrepareWindows();

		setTimeout(function(){
			elements("js-app-settings")[0].click();
		},25);
		setTimeout(function(){
			elements("app-navigator margin-bm padding-ts")[0].childNodes[elements("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[5].childNodes[1].click();
		},50);
	}

	addcolumn.onclick = function(){
		TDEPrepareWindows();

		setTimeout(function(){
			elements("js-header-add-column")[0].click();
		},50);
	}

	tdaccsbutton.onclick = function(){
		TDEPrepareWindows();

		setTimeout(function(){
			elements("js-show-drawer js-header-action")[0].click();
		},50);
	}

	tde_signout.onclick = function(){
		TDEPrepareWindows();

		setTimeout(function(){
			elements("js-app-settings")[0].click();
		},25);

		if (parseInt(TD.storage.store._backend.tweetdeckAccount).toString() === "NaN") {
			setTimeout(function(){
				elements("app-navigator margin-bm padding-ts")[0].childNodes[elements("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[15].childNodes[1].click(); // TODO: Add TD acc check and make it click childNodes[13] instead of childNodes[11]
			},50);
		} else {
			setTimeout(function(){
				elements("app-navigator margin-bm padding-ts")[0].childNodes[elements("app-navigator margin-bm padding-ts")[0].childNodes.length-2].childNodes[3].childNodes[1].childNodes[11].childNodes[1].click(); // TODO: Add TD acc check and make it click childNodes[13] instead of childNodes[11]
			},50);
		}
	}

	var TDENavigationDrawerBackground = document.createElement("div");
	TDENavigationDrawerBackground.id = "tde_nav_drawer_background";
	TDENavigationDrawerBackground.setAttribute("class","tde-nav-drawer-background tde-nav-drawer-background-hidden");

	TDENavigationDrawerBackground.onclick = function(){
		// TODO: Add things to close navigation drawer
		this.setAttribute("class","tde-nav-drawer-background tde-nav-drawer-background-hidden");
		if (typeof tde_nav_drawer !== "undefined") {
			tde_nav_drawer.setAttribute("class","tde-nav-drawer tde-nav-drawer-hidden");
		}
	};

	document.body.appendChild(TDENavigationDrawerBackground);

	var TDENotification = document.createElement("div");
	TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
	TDENotification.id = "TDENotification";

	elements("app-header-inner")[0].appendChild(TDENotification);
}

function KeyboardShortcutHandler(e) {
	if ($("input:focus,textarea:focus").length > 0) {
		return;
	}

	if (e.keyCode === 81) {
		if (typeof tde_nav_drawer !== "undefined") {
			if (tde_nav_drawer.className === "tde-nav-drawer tde-nav-drawer-hidden") {
				if (typeof document.getElementById("tde-navigation-drawer-button") !== "undefined") {
					document.getElementById("tde-navigation-drawer-button").click();
				}
			} else {
				if (typeof tde_nav_drawer_background !== "undefined") {
					tde_nav_drawer_background.click();
				}
			}
		}
	}
}

function ReloadTheme() {
		document.querySelector("html").className = document.querySelector("html").className.replace(" tde-dark","").replace(" tde-light","")
		document.querySelector(".application").className = document.querySelector(".application").className.replace(" tde-dark","").replace(" tde-light","")
		if (document.querySelector("link[title='dark'][disabled]") !== null) {
				document.querySelector("html").className += " tde-light";
				document.querySelector(".application").className += " tde-light";
				TDEDark = false;
		} else {
				document.querySelector("html").className += " tde-dark";
				document.querySelector(".application").className += " tde-dark";
				TDEDark = true;
		}
}

function DisableCommunications() {
	if (!WantsToBlockCommunications) {
		console.log("Sorry to see you go :(");
		console.log("Do keep in mind that no personal information at all is sent in any requests.");
		console.log("Because of Cloudflare, your real IP address is not logged either.");
		console.log("Operating system data is only used to help optimise it for your device in the future.");
		console.log("Privacy Policy available in privacy.txt");
		console.log("If you're positive you want to block communications, please run this command a second time.");
		WantsToBlockCommunications = true;
		return;
	} else {
		localStorage.tde_flag_block_communications = true;
		console.log("Thanks. The block communications flag has been set.");
	}
}

function EnableCommunications() {
	localStorage.tde_flag_block_communications = false;
	console.log("Thanks! To improve updates and optimisation in the future, you have now enabled communications.");
}

function DisableSecureStylesheets() {
	if (!WantsToDisableSecureStylesheets) {
		console.log("Are you sure you want to disable secure stylesheets?");
		console.log("Bugfix and security updates will become slower and rely on core extension updates.");
		console.log("Run this command again to disable it.");
		WantsToDisableSecureStylesheets = true;
		return;
	} else {
		localStorage.tde_flag_block_secure_ss = true;
		console.log("Secure stylesheets have been disabled");
	}
}

function EnableSecureStylesheets() {
	localStorage.tde_flag_block_secure_ss = false;
	console.log("Thanks! For quicker updates and improvements, you have now enabled optional secure stylesheets.");
}

function diag() {
	try {
		attemptdiag();
	}
	catch(err) {
		var openmodal = document.getElementById("open-modal") || elements("js-app-loading")[0];;
	openmodal.innerHTML = '<div class="mdl s-tall-fixed"><header class="mdl-header"><h3 class="mdl-header-title">Diagnostics Failed</h3></header><div class="mdl-inner"><div class="mdl-content"style="padding-left:20px">\
	\
	Well, that\'s unfortunate. I can\'t seem to be able to fetch diagnostics right now. Maybe refresh and try again?\
	<br><br>\
	(P.S. the error is ' + ((typeof err === "undefined" && "[miraculously, undefined.]") || (err.toString())).toString() + ')';
	openmodal.setAttribute("style","display: block;");
	}
}

function closediag() {
	if (typeof openmodal !== "undefined") {
		openmodal.style.cssText = "display: none;";
		openmodal.innerHTML = "";
	}
}

function attemptdiag() {
	var openmodal = document.getElementById("open-modal") || elements("js-app-loading")[0];
	openmodal.innerHTML = '<div class="mdl s-tall-fixed"><header class="mdl-header"><h3 class="mdl-header-title">Diagnostics</h3></header><div class="mdl-inner"><div class="mdl-content"style="padding-left:20px">\
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
	<br>TDEBaseURL: ' + TDEBaseURL + '\
	<br>TDEDark: ' + TDEDark + '\
	<br>tde_fetch_profile_info_for_nav_drawer: ' + tde_fetch_profile_info_for_nav_drawer + '\
	<br>tde_round_avatars: ' + localStorage.tde_round_avatars + '\
	<br>tde_flag_block_secure_ss: ' + localStorage.tde_flag_block_secure_ss + '\
	<br>tde_flag_block_communications: ' + localStorage.tde_flag_block_communications + '\
	<br>tde_nd_header_image: ' + (typeof $("#tde_nd_header_image")[0] !== "undefined" && $("#tde_nd_header_image")[0].style.cssText) + '\
	<br>tde_nd_header_username: ' + (typeof $("#tde_nd_header_username")[0] !== "undefined" && $("#tde_nd_header_username")[0].innerHTML) + '\
	<br>tde_nd_header_photo: ' + (typeof $("#tde_nd_header_photo")[0] !== "undefined" && $("#tde_nd_header_photo")[0].src) + '\
	<br>guestID: ' + (TD.storage.store._backend.guestID) + '\
	<br>msgID: ' + (msgID) + '\
	<br>InjectFonts?: ' + (typeof InjectFonts !== "undefined") + '\
	\
	\
	\
	';
	openmodal.setAttribute("style","display: block;");
}

function dxdiag() {
	var openmodal = document.getElementById("open-modal") || elements("js-app-loading")[0];
	openmodal.innerHTML = '<div class="mdl s-tall-fixed"><header class="mdl-header"><h3 class="mdl-header-title">DxDiag Help</h3></header><div class="mdl-inner"><div class="mdl-content"style="padding-left:20px">\
	\
	\
	\
	This is a guide to help you acquire your DxDiag if asked by a developer.\
	<br><br>\
	Warning: This only applies for Windows. If you\'re running OS X / Linux / etc., this won\'t work.\
	<br><br>\
	Step 1: Press the Windows key + R key to open the Run dialog.<br>\
	Step 2: In the box of the new window, type in "dxdiag", and press the Enter key.<br>\
	Step 3: In the DirectX Diagnostic window, click the "Save All Information..." button at the bottom.<br>\
	Step 4: Save this file somewhere you\'ll remember, like the Desktop.<br>\
	Step 5: Upload the file to a file hosting site, for example, <a target="_blank" href="https://mega.co.nz">Mega</a> (no signup needed), or whereever you can easily share the link for the file with developers.\
	';
	openmodal.setAttribute("style","display: block;");
}

function addSpaceSuggestion(tdetxt,clickd) {
	suggestion = document.createElement("button");
	suggestion.className = "btn tde-no-transform-case";
	suggestion.innerHTML = tdetxt;
	suggestion.addEventListener("click", clickd);
	suggestion.addEventListener("click", function(){this.remove()});
	$(".tde-no-chars-suggestions")[0].appendChild(suggestion);
}

function checkSpaceSuggestions() {
	var tweetTxt = $(".compose-text")[0].value;

	if (tweetTxt.match(/ ( )+/g) !== null) {
		addSpaceSuggestion("Trim excess space inside",function(){
			$(".compose-text")[0].value = tweetTxt.replace(/ ( )+/g," ")
		});
	}

	if (tweetTxt.match(/(^\s+)|([^\w|.|\.|\!|\?]+?$)/gm) !== null) {
		addSpaceSuggestion("Trim excess space around edges",function(){
			$(".compose-text")[0].value = tweetTxt.replace(/(^\s+)|([^\w|.|\.|\!|\?]+?$)/gm,"")
		});
	}

}

function outtaSpaceSuggestions() {

	if (typeof $(".js-media-added")[0] !== "undefined" && typeof $(".character-count-compose")[0] !== "undefined") {
		if (parseInt($(".character-count-compose")[0].value) < 0) {

			if (typeof $(".tde-out-of-space-suggestions")[0] === "undefined") {
				NoCharsNotification = document.createElement("div");
				NoCharsNotification.className = "compose-media-bar-holder padding-al tde-out-of-space-suggestions";
				NoCharsNotification.innerHTML = '<div class="compose-media-bar"><div class="tde-no-chars-suggestions"><div class="txt weight-light txt-extra-large margin-b--10">Oops, you\'re over the character limit.</div>Here are suggestions to help:<br></div></div>';

				$(".js-media-added")[0].appendChild(NoCharsNotification);
				$(".js-media-added")[0].className = "js-media-added";

				checkSpaceSuggestions();
			}

		} else if (typeof $(".tde-out-of-space-suggestions")[0] !== "undefined" && parseInt($(".character-count-compose")[0].value) >= 0) {
			$(".tde-out-of-space-suggestions")[0].remove();
			$(".js-media-added")[0].className = "js-media-added is-hidden";
		}
	}

	setTimeout(outtaSpaceSuggestions,2000);
}

function spawnModule(fun,del) {
	if (typeof fun === "undefined") {
		console.error("WARNING: TDE attempted to spawn a module that doesn't exist. This is a software bug.");
	} else {
		setTimeout(fun,del)
	}
}

spawnModule(TDEInit,0);
spawnModule(WorldTick,0);
//spawnModule(outtaSpaceSuggestions,7000);

document.getElementsByTagName("html")[0].className += " tde-preferences-differentiator tde-api-ver-5-3 tde-js-loaded ";

ReloadTheme();

window.addEventListener("keyup", KeyboardShortcutHandler, false);

(new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		ReloadTheme();
	});
})).observe(document.querySelector("link[title='dark']"), {attributes:true});

console.log("TDEinject loaded");
