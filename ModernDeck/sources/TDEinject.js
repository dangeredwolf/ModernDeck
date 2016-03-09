// TDEinject.js
// Copyright (c) 2015 Dangered Wolf, Jumono

// made with love <3

var SystemVersion = "5.4.1";
var TDEBaseURL = "https://dangeredwolf.com/assets/tdetest/"; // Defaults to streaming if nothing else is available (i.e. legacy firefox)

var msgID = 0;
var messagesAccounted = [];

var TDEDark = true;

var addedColumnsLoadingTagAndIsWaiting = false;
var progress = null;
var FindProfButton;

var TreatGeckoWithCare = false;
var profileProblem = false;
var WantsToBlockCommunications = false;
var WantsToDisableSecureStylesheets = false;

var FetchProfileInfo = 0;

var elements = function(a,b,c){return $(document.getElementsByClassName(a,b,c))};
var find1Obj = function(selector){return $(document.querySelector(selector))};

var Preferences = [];

var make = function(a){return $(document.createElement(a))};
var head = $(document.head);
var body = $(document.body);
var html = $(document.querySelector("html")); // Only 1 result; faster to find

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
}

if (typeof chrome === "undefined" && typeof safari === "undefined") {
	TreatGeckoWithCare = true;
}

function getPref(id) {
	return localStorage[id] === "true" && true || localStorage[id] === "false" && false || localStorage[id];
}

function setPref(id,p) {
	localStorage[id] = p;
}

function GetURL(url) {
	return TDEBaseURL + url;
}

function fontParseHelper(a) {
	if (typeof a !== "object" || a === null) {
		throw "you forgot to pass the object";
	}

	return "@font-face{font-family:'" + (a.family || "Roboto") + "';font-style:" + (a.style || "normal") + ";font-weight:" + (a.weight || "300") + ";src:url(" + TDEBaseURL + "sources/fonts/" + a.name + ".woff2) format('woff2');unicode-range:" + (a.range || "U+0100-024F,U+1E00-1EFF,U+20A0-20AB,U+20AD-20CF,U+2C60-2C7F,U+A720-A7FF") + "}";
}

function TDEInit(){
	if (
		typeof $ === "undefined" ||
		typeof TD_mustaches === "undefined" ||
		typeof TD === "undefined" ||
		typeof TD.util === "undefined" ||
		typeof TD.util.prettyTimeString === "undefined" ||
		typeof TD_mustaches["settings/global_setting_filter_row.mustache"] === "undefined" ||
		typeof document.querySelector("js-modals-container") === "undefined"
	) {
		setTimeout(TDEInit,500);
		return;
	}

	TD.controller.stats.dataminrApiRequest = function(){};
	TD.controller.stats.dataminrAuthRequest = function(){};
	TD.controller.stats.dataminrClickImpression = function(){};

	$(document.head).append(make("style").html(
		fontParseHelper({name:"Roboto300latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({name:"Roboto300latinext"}) +
		fontParseHelper({weight:"400",name:"Roboto400latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"400",name:"Roboto400latinext"}) +
		fontParseHelper({weight:"500",name:"Roboto500latin",range:"U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000"}) +
		fontParseHelper({weight:"500",name:"Roboto500latinext"}) +
		fontParseHelper({family:"Material Icons",weight:"400",name:"MaterialIcons",range:"U+0000-F000"}) +
		fontParseHelper({family:"Font Awesome",weight:"400",name:"fontawesome",range:"U+0000-F000"})
	));

	document.querySelector("js-modals-container").removeChild(function(rmnode){
		if (typeof rmnode === "undefined") {
			return;
		}
		$(rmnode).attr("class","js-modal-context tde-modal-window-fade-out overlay overlay-super scroll-v").delay(300).queue(function(){$(this).remove()});
	}

	if ($("js-modal").length > 0) {

		elements("js-modal")[0].removeChild = function(rmnode){
			if (typeof rmnode === "undefined") {
				return;
			}
			$(rmnode).attr("class","js-modal-context tde-modal-window-fade-out overlay overlay-super scroll-v").delay(300).queue(function(){$(this).remove()});
		}
	}

	body.on("removeChild",function(i) {
		if ($(i).hasClass("tooltip")) {
			setTimeout(function(){
				i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
			},500);
		} else {
	 		i.remove();
		}
 	});

	$("link[rel=\"shortcut icon\"]").attr("href",TDEBaseURL + "sources/favicon.ico");
	$(document.querySelector("audio")).attr("src",GetURL("sources/alert_2.mp3"));
	TD_mustaches["settings/global_setting_filter_row.mustache"]='<li class="list-filter cf"> {{_i}}<div class="tde-mute-text tde-mute-text-{{getDisplayType}}"></div> {{>text/global_filter_value}}{{/i}} <input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative"> </li>'

	if (getPref("tde_round_avatars") === false) {
		html.addClass("tde-no-round-avatars");
	} else
		setPref("tde_round_avatars",true);
	}

	if (getPref("tde_dark_media") === true) {
		html.addClass("tde-dark-media-previews");
	} else
		setPref("tde_dark_media",false);
	}

	if (getPref("tde_outlines") === true) {
		html.addClass("tde-acc-focus-ring");
	} else
		setPref("tde_outlines",false);
	}

	TD.util.prettyTimeString = function(e) {
		return TD.i("{{hours12}}:{{minutes}} {{amPm}}, {{day}} {{month}} {{fullYear}}", TD.util.prettyTime(e))
	}

	NavigationSetup();

}

function WaitForLogin() {
	if (find1Obj(".app-signin-form").length > 0) {
		//document.getElementsByTagName("html")[0].setAttribute("class",document.getElementsByTagName("html")[0].getAttribute("class").replace(" signin-sheet-now-present",""));
		//lmao

		html.removeClass("signin-sheet-now-present");
		return;
	}
	setTimeout(WaitForLogin,500);
}

function SendNotificationMessage(txt) {
	var knotty = $(TDENotification);
	if (knotty.hasClass("tde-appbar-notification-hidden")) {
		knotty.removeClass("tde-appbar-notification-hidden");
	} else {
		knotty.addClass("tde-appbar-notification-hidden");
		knotty.delay(300).queue(function(){knotty.html("").removeClass("tde-appbar-notification-hidden")});
	}
 	/*if (TDENotification.className === "tde-appbar-notification") {
		TDENotification.className = "tde-appbar-notification tde-appbar-notification-hidden";
		setTimeout(function(){
			TDENotification.className = "tde-appbar-notification";
			TDENotification.innerHTML = txt;
		},300);
	} else {
		TDENotification.className = "tde-appbar-notification";
		TDENotification.innerHTML = txt;
	}*/
}

function WaitForNotificationDismiss(node,prevmsgID) {
	if (typeof node === "undefined" || node === null || typeof node.parentNode === "undefined" || node.parentNode === null) {
		if (msgID === prevmsgID) {
			$(TDENotification).addClass("tde-appbar-notification-hidden");
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

	$(".tweet-action-item,.tweet-detail-action-item,.app-navigator.margin-bm.padding-ts").each(function(index){
		$(this).addClass("tde-dropdown-fade-out").delay(200).queue(function(){$(this).remove()});
	})

	/*for (i = 0; i < elms.length; i++) {
		elms[i].removeChild = function(dropdown){
			dropdown.setAttribute("class",dropdown.getAttribute("class") + " tde-dropdown-fade-out");
			setTimeout(function(){
				dropdown.remove();
			},200)
		}
	}*/
	if (find1Obj(".status-message").length > 0) {
		$(".status-message").each(function(index){
			if (typeof messagesAccounted[this] === "undefined") {
				var thing = this;

				msgID++;

				SendNotificationMessage(this.childNodes[1].innerHTML);
				WaitForNotificationDismiss(thing,msgID);

				messagesAccounted[this] = true;
			}
		})
	}

	/*if (typeof document.querySelector(".status-message") !== "undefined") {
		for (i = 0; i < elements("status-message").length; i++) {
			if (typeof messagesAccounted[elements("status-message")[i]] === "undefined") {
				var thing = elements("status-message")[i];

				msgID++;

				SendNotificationMessage(thing.childNodes[1].innerHTML);
				WaitForNotificationDismiss(thing,msgID);

				messagesAccounted[elements("status-message")[i]] = true;
			}
		}
	}*/
}

setInterval(WorldTick,600);

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

function PrepareLoginStuffs() {
	console.log("Start prepare login stuffs");
	if (typeof $ === "undefined") {
		setTimeout(PrepareLoginStuffs,200);
		return;
	}

	FindProfButton = find1Obj(".account-settings-row:first-child a[rel='user']");
	if (FindProfButton.length === -1) {
		find1Obj(".js-show-drawer.js-header-action").click();
		profileProblem = true;
		setTimeout(PrepareLoginStuffs,100);
		return;
	}
	FindProfButton.click();
	setTimeout(FinaliseLoginStuffs,0);

	find1Obj(".js-click-trap").addClass("is-hidden").delay(50).queue(function(){$(this).addClass("is-hidden")});
}

function FinaliseLoginStuffs() {
	find1Obj(".js-click-trap").addClass("is-hidden");

	if (find1Obj("prf-header").length < 0) {
		FetchProfileInfo++;

		if (FetchProfileInfo > 10) {
			console.log("this is not even working, uh lets try again");
			setTimeout(PrepareLoginStuffs,0);
			return;
		}
		setTimeout(FinaliseLoginStuffs,150);
		return;
	}

	if (find1Obj(".prf-header").css("background-image").search("td_profile_empty") > 0) {
		$(tde_nd_header_image).attr("style",find1Obj(".prf-header").attr(style)); // Fetch header and place in nav drawer
	}
	$(tde_nd_header_photo).attr("src",find1Obj(".prf-img").attr("src")); // Fetch profile picture and place in nav drawer
	$(tde_nd_header_username).html($(".prf-card-inner").children()[1].childNodes[5].childNodes[0].textContent); // Fetch twitter handle and place in nav drawer

	console.log("Finished login stuffs! you are in the nav drawer, I think!");

	if (profileProblem) {
		profileProblem = false;
		find1Obj(".js-show-drawer.btn-compose").click();
		console.log("repaired profile problem with tweet thing");
	}
}

function NavigationSetup() {
	if (find1Obj(".app-header-inner").length < 1) {
		setTimeout(NavigationSetup,100);
		return;
	}



	find1Obj("app-header-inner").append(
		make("a")
		.attr("id","tde-navigation-drawer-button")
		.addClass("js-header-action tde-drawer-button link-clean cf app-nav-link")
		.html('<div class="obj-left"><div class="tde-nav-activator"></div><div class="nbfc padding-ts"></div>');
		.click(function(){
			// TODO: Wire button to open navigation drawer
			// TODO: Remove the above TODO from back when i was developing tde 5.0

			if (typeof tde_nav_drawer_background !== "undefined") {
				find1Obj("#tde_nav_drawer_background").attr("class","tde-nav-drawer-background");
			}
			if (typeof tde_nav_drawer !== "undefined") {
				find1Obj("#tde_nav_drawer").attr("class","tde-nav-drawer");
			}
		})
	);

	body.append(
		make("div")
		.attr("id","tde_nav_drawer")
		.addClass("tde-nav-drawer tde-nav-drawer-hidden")
		.append(
			make("img")
			.attr("id","tde_nd_header_image"),
			make("img")
			.addClass("avatar size73 tde-nd-header-photo")
			.attr("id","tde_nd_header_photo"),
			make("div")
			.addClass("tde-nd-header-username")
			.attr("id","tde_nd_header_username"),
			make("button")
			.addClass("htn tde-nav-button tde-settings-button")
			.attr("id","tdset")
			.html("TweetDeck Settings")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/tweetdecksmall.png")
				.addClass("tde-nav-drawer-icon")
			),
			make("button")
			.addClass("htn tde-nav-button")
			.attr("id","tdesettings")
			.html("ModernDeck Settings")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/TDEsmall.png")
				.addClass("tde-nav-drawer-icon")
			),
			make("button")
			.addClass("htn tde-nav-button")
			.attr("id","btdsettings")
			.html("Better TweetDeck Settings")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/BTDsmall.png")
				.addClass("tde-nav-drawer-icon")
			),
			make("div")
			.addClass("tde-nav-divider"),
			make("button")
			.addClass("htn tde-nav-button")
			.attr("id","tde_signout")
			.html("Sign Out")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/logout.png")
				.addClass("tde-nav-drawer-icon")
			),
			make("button")
			.addClass("htn tde-nav-button")
			.attr("id","tdaccsbutton")
			.html("Your Accounts")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/accounts.png")
				.addClass("tde-nav-drawer-icon")
			),
			make("div")
			.addClass("tde-nav-divider"),
			make("button")
			.addClass("htn tde-nav-button")
			.attr("id","kbshortcuts")
			.html("Keyboard Shortcuts")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/KBshortcuts.png")
				.addClass("tde-nav-drawer-icon")
			),
			make("button")
			.addClass("htn tde-nav-button")
			.attr("id","addcolumn")
			.html("AddColumn")
			.append(
				make("img")
				.attr("src",TDEBaseURL + "sources/AddColumn.png")
				.addClass("tde-nav-drawer-icon")
			),
		)
	)

	/*var TDENavigationDrawer = document.createElement("div");
	TDENavigationDrawer.id = "tde_nav_drawer";
	TDENavigationDrawer.setAttribute("class","tde-nav-drawer tde-nav-drawer-hidden");
	TDENavigationDrawer.innerHTML = '<img id="tde_nd_header_image" class="tde-nd-header-image"><img class="avatar size73 tde-nd-header-photo" id="tde_nd_header_photo"><div class="tde-nd-header-username" id="tde_nd_header_username"></div><button class="btn tde-nav-button tde-settings-button waves-effect waves-light" id="tdset"><img src="'+ GetURL("sources") + '/tweetdecksmall.png" class="tde-nav-drawer-icon">TweetDeck Settings</button><button class="btn tde-nav-button waves-effect waves-light" id="tdesettings"><img src="'+ GetURL("sources") +'/TDEsmall.png" class="tde-nav-drawer-icon">ModernDeck Settings</button><button class="btn tde-nav-button waves-effect waves-light" id="btdsettings"><img src="' + GetURL("sources") + '/BTDsmall.png" class="tde-nav-drawer-icon">Better TweetDeck Settings</button><div class="tde-nav-divider"></div><button id="tde_signout" class="btn tde-nav-button waves-effect waves-light"><img src="' + GetURL("sources") + '/logout.png" class="tde-nav-drawer-icon">Sign Out</button><button id="tdaccsbutton" class="btn tde-nav-button waves-effect waves-light"><img src="' + GetURL("sources") +'/accounts.png" class="tde-nav-drawer-icon">Your Accounts</button><div class="tde-nav-divider"></div><button id="kbshortcuts" class="btn tde-nav-button waves-effect waves-light"><img src="'+ GetURL("sources") +'/KBshortcuts.png" class="tde-nav-drawer-icon">Keyboard Shortcuts</button><button id="addcolumn" class="btn tde-nav-button waves-effect waves-light"><img src="' + GetURL("sources") + '/AddColumn.png" class="tde-nav-drawer-icon">Add Column</button>';

	document.body.appendChild(TDENavigationDrawer)*/;

	$("#tde_nd_header_image").attr("style","background:#00BCD4");
	$("#tde_nd_header_photo").attr("src","");
	$("#tde_nd_header_username").html("PROFILE ERROR<br>Tell @dangeredwolf i said hi");

	setTimeout(PrepareLoginStuffs,0);

	window.TDEPrepareWindows = function() {
		document.getElementById("update-sound").click();

		$(".js-click-trap").click();
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
	<br>FetchProfileInfo: ' + FetchProfileInfo + '\
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
