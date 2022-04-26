/*
	UINavDrawer.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";
import { openSettings } from "./UISettings";
import { I18n } from "./I18n";
import { TwitterUserInternal } from "./Types/TweetDeck";


/*
	function getProfileInfo()

	Returns object of default account profile info, used to show your profile pic and background in nav drawer
*/

const getProfileInfo = (): TwitterUserInternal => {
	// @ts-ignore *shrug*
	return TD?.cache?.twitterUsers?.getByScreenName?.(TD.storage?.accountController?.getPreferredAccount("twitter")?.state?.username).results[0] || null
}

/* Puts your profile picture and header in the navigation drawer :)  */

const profileSetup = (): void => {
	let profileInfo = getProfileInfo();
	if (profileInfo === null || typeof profileInfo === "undefined" || typeof profileInfo.profileBannerURL === "undefined") {
		setTimeout(profileSetup, 150);
		return;
	}
	let bannerPhoto = profileInfo._profileBannerURL.search("empty") > 0 ? "" : profileInfo._profileBannerURL;
	let avatarPhoto = profileInfo.profileImageURL.replace("_normal","");
	let name = profileInfo.name;
	let username = profileInfo.screenName;

	$(window.mtd_nd_header_image).attr("style",`background-image:url(${bannerPhoto});`); // Fetch header and place in nav drawer
	$(window.mtd_nd_header_photo).attr("src",avatarPhoto) // Fetch profile picture and place in nav drawer
	.mouseup(() => {
		let profileLinkyThing = $(document.querySelector(`.account-settings-bb a[href="https://twitter.com/${getProfileInfo().screenName}"]`));

		window.mtdPrepareWindows();
		if (profileLinkyThing.length > -1) {
			setTimeout((): void => {
				profileLinkyThing.click();
			},200);
		}
	});
	$(window.mtd_nd_header_username).html(name); // Fetch twitter handle and place in nav drawer
	$(window.mtd_nd_header_atname).html("@" + username); // Fetch twitter handle and place in nav drawer

}

export const UINavDrawer = (): void => {
	$(".app-header-inner").append(
		make("a").attr("id","mtd-navigation-drawer-button").attr("data-original-title",I18n("Navigation drawer")).addClass("js-header-action mtd-drawer-button link-clean cf app-nav-link").html('<div class="obj-left"><div class="mtd-nav-activator"></div><div class="nbfc padding-ts"></div>')
		.click(() => {
			if (typeof window.mtd_nav_drawer_background !== "undefined") {
				$("#mtd_nav_drawer_background").removeClass("hidden");
			}
			if (typeof window.mtd_nav_drawer !== "undefined") {
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
			make("img").addClass("avatar mtd-nd-header-photo").attr("id","mtd_nd_header_photo").attr("src","").click(() => {
				$('a[data-user-name="'+getProfileInfo().screenName+'"][rel="user"][href="#"]')[0].click();
			}),
			make("div").addClass("mtd-nd-header-username").attr("id","mtd_nd_header_username").html("PROFILE ERROR"),
			make("div").addClass("mtd-nd-header-atname").attr("id","mtd_nd_header_atname").html("Tell @dangeredwolf i said hi"),
			make("button").addClass("btn mtd-nav-button mtd-nav-first-button").attr("id","tdaccsbutton").append(make("i").addClass("icon icon-user-switch")).click(() => {window.mtdPrepareWindows();$(".js-show-drawer.js-header-action").click();}).append(I18n("Your accounts")),
			make("button").addClass("btn mtd-nav-button").attr("id","addcolumn").append(make("i").addClass("icon icon-plus")).click(() => {window.mtdPrepareWindows();TD.ui.openColumn.showOpenColumn()}).append(I18n("Add column")),
			make("div").addClass("mtd-nav-divider"),
			make("button").addClass("btn mtd-nav-button").attr("id","kbshortcuts").append(make("i").addClass("icon icon-keyboard")).click(() => {
				window.mtdPrepareWindows();
				setTimeout(() => {$(".js-app-settings").click()},10);
				setTimeout(() => {$("a[data-action='keyboardShortcutList']").click()},20);
			}).append(I18n("Keyboard shortcuts")),
			make("button").addClass("btn mtd-nav-button").attr("id","mtdsettings").append(make("i").addClass("icon icon-settings")).click(() => {openSettings()}).append(I18n("Settings")),
			make("div").addClass("mtd-nav-divider"),
			make("button").addClass("btn mtd-nav-button mtd-nav-group-expand").attr("id","mtd_nav_expand").append(make("i").addClass("icon mtd-icon-arrow-down").attr("id","mtd_nav_group_arrow")).click(() => {
				$("#mtd_nav_group").toggleClass("mtd-nav-group-expanded");
				$("#mtd_nav_group_arrow").toggleClass("mtd-nav-group-arrow-flipped");
				$("#mtd_nav_drawer").toggleClass("mtd-nav-drawer-group-open");
			}).append(I18n("More...")),
			make("div").addClass("mtd-nav-group mtd-nav-group-expanded").attr("id","mtd_nav_group").append(
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon icon-search")).click(() => {
					window.mtdPrepareWindows();
					setTimeout(() => {$(".js-app-settings").click()},10);
					setTimeout(() => {$("a[data-action=\"searchOperatorList\"]").click()},20);
				}).append(I18n("Search tips")),
				make("button").addClass("btn mtd-nav-button").attr("id","mtd_signout").append(make("i").addClass("icon icon-logout")).click(() => {
					TD.controller.init.signOut();
				}).append(I18n("Sign out")),
				make("div").addClass("mtd-nav-divider"),
			),
			make("div").addClass("mtd-nav-divider mtd-nav-divider-feedback"),
			make("button").addClass("btn mtd-nav-button mtd-nav-button-feedback").attr("id","mtdfeedback").append(make("i").addClass("icon icon-feedback")).click(() => {
				window.open("https://github.com/dangeredwolf/ModernDeck/issues");
			}).append(I18n("Send feedback"))
		),
		make("div").attr("id","mtd_nav_drawer_background").addClass("mtd-nav-drawer-background hidden").click(function() {
			$(this).addClass("hidden");
			$(window.mtd_nav_drawer).addClass("hidden");

			$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
			$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
		})
	);

	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");

	try {
		if ((TD?.config?.config_overlay?.tweetdeck_dogfood?.value)) {
			$(".mtd-nav-group").append(
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-command-pallete")).click(() => {
					window.mtdPrepareWindows();
					$(document).trigger("uiShowCommandPalette");
				}).append(I18n("Command palette")),
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-developer")).click(() => {
					window.mtdPrepareWindows();

					$(document).trigger("uiReload", {
						params: {
							no_dogfood: 1
						}
					});

				}).append(I18n("Disable dev/dogfood"))
			)
		}
	} catch(e) {
		console.error("An error occurred in navigationSetup while trying to verify if dev/dogfood features are enabled or not");
		console.error(e);
		window.lastError = e;
	}
	$(".mtd-nav-group-expanded").attr("style","height:"+$(".mtd-nav-group-expanded").height()+"px");


	profileSetup();

}
