/*
	UIWelcome.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/* Main thread for welcome screen */

import { isApp, make } from "./Utils";
import { UIModal } from "./UIModal";
import { I18n } from "./I18n";
import { getPref, setPref } from "./StoragePreferences";
import { TwitterUserInternal } from "./Types/TweetDeck";
import { SettingsDropdown } from "./Settings/UI/Components/Dropdown";
import themeSettings from "./Settings/Data/Themes";

export const debugWelcome = true;

export function welcomeScreen() {
	return new UIWelcome();
}

export class UIWelcome extends UIModal {
	container: JQuery<HTMLElement>;
	leftPane: JQuery<HTMLElement>;
	rightPane: JQuery<HTMLElement>;
	themeBox: JQuery<HTMLElement>;

	developerInfoHTML(profile: TwitterUserInternal): string {
		return `<header class="tweet-header js-tweet-header flex flex-row flex-align--baseline">
			<a class="account-link link-complex block flex-auto" href="${profile.profileURL}" rel="user" target="_blank">
				<div class="obj-left item-img tweet-img position-rel">
					<img class="tweet-avatar avatar pin-top-full-width" src="${profile.profileImageURL}" alt="${profile.screenName}">
				</div>
				<div class="mtd-welcome-profile-text">
					<b class="fullname link-complex-target">${profile.emojifiedName}</b>
					<span class="username txt-mute">@${profile.screenName}</span>
				</div>
			</a>
		</header>
		<div id="mtd_follow_btn_${profile.id_str}" class="js-follow-button pull-left js-show-tip follow-btn margin-r--4 Button--tertiary" title="" data-original-title="${profile.screenName}">
			<button class="action-text follow-text btn-on-dark">
				<i class="Icon icon-follow"></i>
				<span class="label">${I18n("Follow")}</span>
			</button>
			<button class="action-text Button--primary following-text">
				${I18n("Following")}
			</button>
		</div>`
	}

	renderDeveloperInfo() {
		// @ts-ignore types/jquery don't have addCallback under Deferred for some reason
		TD.cache.twitterUsers.getById("2927859037").addCallback((profile: TwitterUserInternal) => { // @ModernDeck
			console.log("Got details for ModernDeck", profile);
			$("#moderndeck-profile").html(this.developerInfoHTML(profile));
		});
		// @ts-ignore types/jquery don't have addCallback under Deferred for some reason
		TD.cache.twitterUsers.getById("3784131322").addCallback((profile: TwitterUserInternal) => { // @dangeredwolf
			console.log("Got details for dangeredwolf", profile);
			$("#dangeredwolf-profile").html(this.developerInfoHTML(profile));
		});
	}

	constructor() {
		super();

		if (window.desktopConfig && window.desktopConfig.disableOOBE) {
			return;
		}

		window.isInWelcome = true;

		window.mtdPrepareWindows();

		if ($(".mtd-language-picker").length > 0) { // language > welcome
			return;
		}

		$(".message-banner").attr("style","display: none;");

		this.container = make("div").addClass("mtd-welcome-inner");
		this.element = make("div").addClass("mdl mtd-welcome-panel").append(this.container);

		this.container.append(
			make("h1").text(I18n(`Welcome to {productName}`).replace("{productName}", window.ModernDeck.productName)),
			make("p").text(I18n(`Welcome to {productName}, a free and open-source Twitter client, built on the power of TweetDeck, enhanced with a modern UI and more customization features.`).replace("{productName}", window.ModernDeck.productName))
		)

		this.leftPane = make("div").addClass("mtd-welcome-pane mtd-welcome-pane-left").appendTo(this.container);
		this.rightPane = make("div").addClass("mtd-welcome-pane mtd-welcome-pane-right").appendTo(this.container);

		$("#settings-modal").click(() => {
			setPref("mtd_welcomed", true);
		})

		if (true || getPref("mtd_welcomed") === false) {

			this.leftPane.append(
				make("h2").text(I18n("New to ModernDeck?")),
				make("p").html(I18n("Pick a theme you'd like to use. You can customize colors and more about your ModernDeck experience in <i class='icon icon-settings'></i> <b>Settings</b>.")),
			)

			this.themeBox = make("select").attr("type", "select")

			const dropdown = new SettingsDropdown(themeSettings.options.theme, this.leftPane);
			dropdown.label.remove();

			if (isApp) {
				this.leftPane.append(
					make("h2").text(I18n("Been here before?")),
					make("p").html(I18n("If you exported your settings from ModernDeck before, you can restore those in <i class='icon icon-settings'></i> <b>Settings › System › Load Backup</b>"))
				);
			}
			
		} else if (getPref("mtd_welcomed") === true) {
			this.leftPane.append(
				make("h2").text(I18n("You've been upgraded to ModernDeck 10")),
				make("p").text(I18n("Things should look familiar around here, but with new features and a lot of under-the-hood changes. I hope you like it!"))
			);
		}

		this.rightPane.append(
			make("h2").text(I18n("Follow ModernDeck on Twitter")),
			make("p").addClass("mtd-welcome-follow-header").text(I18n("Follow ModernDeck or its developer to learn about the latest updates or to contact for help.")),
			make("div").addClass("mtd-welcome-developer-profile").attr("id","moderndeck-profile"),
			make("div").addClass("mtd-welcome-developer-profile").attr("id","dangeredwolf-profile"),
			make("h2").text(I18n("Help support ModernDeck")),
			make("p").addClass("mtd-welcome-donation-header").text(I18n("ModernDeck has been developed since 2014 over countless hours of work and released for free. If you'd like to help continue its development, consider leaving a donation or becoming a sponsor.")),
			make("a").addClass("mtd-kofi-button").append(
				make("img").attr("src", window.mtdBaseURL + "assets/img/kofi.webp"),
			).attr("href", "https://ko-fi.com/dangeredwolf").attr("target","_blank"),
			make("button").addClass("mtd-sponsor-button").append(
				make("i").addClass("Icon icon-favorite"),
				I18n("Sponsor")
			).click(() => open("https://github.com/sponsors/dangeredwolf/", "_blank"))
		)

		this.display();

		this.renderDeveloperInfo();

		return this;
	}
}
