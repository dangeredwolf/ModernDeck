/*
	DataWelcome.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import { isApp } from "./Utils.js";
import { I18n } from "./I18n.js";
import { getPref, setPref } from "./StoragePreferences.js";
import { settingsData } from "./DataSettings.js";

export const demoColumn = `<section class="column js-column will-animate"><div class="column-holder js-column-holder"><div class="flex flex-column height-p--100 column-panel"><header class="flex-shrink--0 column-header"><i class="pull-left icon column-type-icon icon-home"></i><div class="flex column-title flex-justify-content--space-between"><div class="flex column-header-title flex-align--center flex-grow--2 flex-wrap--wrap"><span class=column-heading>${I18n("Home")}</span> <span class="txt-ellipsis attribution txt-mute txt-sub-antialiased vertical-align--baseline">@dangeredwolf</span></div></div></header><div class="flex flex-column height-p--100 mtd-example-column column-content flex-auto position-rel"><div class="position-rel column-scroller scroll-v"><div class="chirp-container js-chirp-container"><article class="is-actionable stream-item"><div class="item-box js-show-detail js-stream-item-content"><div class="js-tweet tweet"><header class="flex flex-align--baseline flex-row js-tweet-header tweet-header"><a class="account-link block flex-auto link-complex"><div class="position-rel item-img obj-left tweet-img"><img class="avatar pin-top-full-width tweet-avatar"src=https://pbs.twimg.com/profile_images/1134136444577091586/LBv0Nhjq_normal.png style=border-radius:10px!important></div><div class=nbfc><span class="txt-ellipsis account-inline"><b class="fullname link-complex-target">ModernDeck</b> <span class="txt-mute username">@ModernDeck</span></span></div></a><time class="txt-mute flex-shrink--0 tweet-timestamp"><a class="no-wrap txt-size-variable--12">${I18n("now")}</a></time></header><div class="js-tweet-body tweet-body"><div class="txt-ellipsis nbfc txt-size-variable--12"></div><p class="js-tweet-text tweet-text with-linebreaks"style=padding-bottom:0>This tweet is quite light!</div></div><footer class="cf tweet-footer"><ul class="full-width js-tweet-actions tweet-actions"><li class="pull-left margin-r--10 tweet-action-item"><a class="position-rel tweet-action js-reply-action"href=# rel=reply><i class="pull-left icon txt-center icon-reply"></i> <span class="margin-t--1 pull-right txt-size--12 margin-l--2 icon-reply-toggle js-reply-count reply-count">1</span> <span class=is-vishidden>${I18n("Reply")}</span> <span class=reply-triangle></span></a><li class="pull-left margin-r--10 tweet-action-item"><a class=tweet-action href=# rel=retweet><i class="pull-left icon txt-center icon-retweet icon-retweet-toggle js-icon-retweet"></i> <span class="margin-t--1 pull-right txt-size--12 icon-retweet-toggle js-retweet-count margin-l--3 retweet-count">4</span></a><li class="pull-left margin-r--10 tweet-action-item"><a class="position-rel tweet-action js-show-tip"href=# rel=favorite data-original-title=""><i class="pull-left icon txt-center icon-favorite icon-favorite-toggle js-icon-favorite"></i> <span class="margin-t--1 pull-right txt-size--12 margin-l--2 icon-favorite-toggle js-like-count like-count">20</span></a><li class="pull-left margin-r--10 tweet-action-item position-rel"><a class=tweet-action href=# rel=actionsMenu><i class="icon icon-more txt-right"></i></a></ul></footer><div class=js-show-this-thread></div></div></article></div></div></div></div><div class="flex flex-column height-p--100 column-panel column-detail js-column-detail"></div><div class="flex flex-column height-p--100 column-panel column-detail-level-2 js-column-social-proof"></div></div></section>`


export let _welcomeData = {
	welcome: {
		title: "<i class='icon icon-moderndeck icon-xxlarge mtd-welcome-head-icon' style='color:var(--secondaryColor)'></i>" + I18n("Welcome to ModernDeck!"),
		body: I18n("We're glad to have you here. Click Next to continue."),
		nextFunc: () => {

			let currentTheme = getPref("mtd_theme");

			$(window.mtd_welcome_dark).click(()=>{
				parseActions(settingsData.themes.options.theme.activate,"dark");
				setPref("mtd_theme", "dark");
				$(".mtd-welcome-inner .tweet-text").html(I18n("This tweet is quite dark!"))
			})

			$(window.mtd_welcome_darker).click(()=>{
				parseActions(settingsData.themes.options.theme.activate,"darker");
				setPref("mtd_theme", "darker");
				$(".mtd-welcome-inner .tweet-text").html(I18n("This tweet is quite dark!"))
			})

			$(window.mtd_welcome_amoled).click(()=>{
				parseActions(settingsData.themes.options.theme.activate,"amoled");
				setPref("mtd_theme", "amoled");
				$(".mtd-welcome-inner .tweet-text").html(I18n("This tweet is quite dark!"))
			})

			$(window.mtd_welcome_light).click(()=>{
				parseActions(settingsData.themes.options.theme.activate,"light");
				setPref("mtd_theme", "light");
				$(".mtd-welcome-inner .tweet-text").html(I18n("This tweet is quite light!"))
			})

			$(window.mtd_welcome_paper).click(()=>{
				parseActions(settingsData.themes.options.theme.activate,"paper");
				setPref("mtd_theme", "paper");
				$(".mtd-welcome-inner .tweet-text").html(I18n("This tweet is quite light!"))
			})

			switch(currentTheme) {
				case "dark":
					mtd_welcome_dark.click();
					break;
				case "darker":
					mtd_welcome_darker.click();
					break;
				case "amoled":
					mtd_welcome_amoled.click();
					break;
				case "light":
					mtd_welcome_light.click();
					break;
				case "paper":
					mtd_welcome_paper.click();
					break;
			}

			if (typeof require === "undefined" || !isApp || html.hasClass("mtd-winstore") || html.hasClass("mtd-macappstore")) {
				return;
			}

			const {ipcRenderer} = require("electron");
			ipcRenderer.send("checkForUpdates");
		}
	},
	update: {
		title: I18n("Checking for updates..."),
		body: I18n("This should only take a few seconds."),
		html: "",
		enabled: false,
		nextText: I18n("Skip")
	},
	theme: {
		title: I18n("Pick a theme"),
		body: I18n("You can customize the theme colors in <i class='icon icon-settings'></i> <b>Settings</b>"),
		html: `<div class="obj-left mtd-welcome-theme-picker">
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" id="mtd_welcome_light" value="light">
				${I18n("Light")}
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" id="mtd_welcome_paper" value="paper">
				${I18n("Paperwhite")}
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" id="mtd_welcome_dark" value="dark">
				${I18n("Dark")}
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" id="mtd_welcome_darker" value="darker">
				${I18n("Darker")}
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="theme" id="mtd_welcome_amoled" value="amoled">
				${I18n("AMOLED")}
			</label>

		</div>` + demoColumn,
		prevFunc: () => {
			if (!isApp || html.hasClass("mtd-winstore") || html.hasClass("mtd-macappstore")) {
				return;
			}
			const {ipcRenderer} = require("electron");
			ipcRenderer.send("checkForUpdates");
		},
		nextFunc: () => {
			$(window.mtd_welcome_simplified).click(()=>parseActions(settingsData.appearance.options.navigationStyle.activate,"simplified"))
			$(window.mtd_welcome_classic).click(()=>parseActions(settingsData.appearance.options.navigationStyle.activate,"classic"))

			let pos = getPref("mtd_headposition");
			if (pos === "classic") {
				$("input[value='classic']").click();
			} else {
				$("input[value='simplified']").click();
			}
		}
	},
	layout: {
		title: I18n("Select a layout"),
		body: I18n("<b>Simplified:</b> Common features are always displayed, like Tweet and Search. Less common options like adding columns are available in the Navigation Drawer.") + "<br><br>" +
			  I18n("<b>Classic (TweetDeck):</b> All buttons are displayed. This layout more closely resembles default TweetDeck."),
		html: `<div class="obj-left mtd-welcome-theme-picker">
			<label class="fixed-width-label radio">
			<input type="radio" name="layout" id="mtd_welcome_simplified" value="simplified">
				${I18n("Simplified")}
			</label>
			<label class="fixed-width-label radio">
			<input type="radio" name="layout" id="mtd_welcome_classic" value="classic">
				${I18n("Classic (TweetDeck)")}
			</label>
		</div>`,
		nextFunc: () => {
			if (getPref("mtd_headposition") === "classic") {
				$(".mtd-settings-subpanel:last-child .mtd-welcome-body").html(_welcomeData.done.body.replace("YOU_SHOULDNT_SEE_THIS",I18n("the settings menu <i class='icon icon-settings'></i>")));
			} else {
				$(".mtd-settings-subpanel:last-child .mtd-welcome-body").html(_welcomeData.done.body.replace("YOU_SHOULDNT_SEE_THIS",I18n("the navigation drawer <i class='icon mtd-nav-activator'></i>")));
			}
		}
	},
	done: {
		title: I18n("You're set for now!"),
		body: I18n("Don't worry, there are plenty of other options to make ModernDeck your own.<br><br>These options are located in <i class='icon icon-settings'></i> <b>Settings</b>, accessible via YOU_SHOULDNT_SEE_THIS"),
		html: ""
	}

}
