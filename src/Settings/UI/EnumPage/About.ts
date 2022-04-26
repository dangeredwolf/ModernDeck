/*
	Settings/UI/EnumPage/About.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "../../../I18n";
import { diag } from "../../../UIDiag";
import { isApp, make } from "../../../Utils";
import { SettingsEnumPage } from "../../SettingsEnumPage";
import { versionString } from "../../../Functions/VersionController";
import { AutoUpdateController } from "../../../AutoUpdateController";

export class AboutEnumPage extends SettingsEnumPage {
	diagClickNumber: number = 0;

	logo: JQuery<HTMLElement>;
	logoContainer: JQuery<HTMLElement>;
	h1: JQuery<HTMLElement>;
	h2: JQuery<HTMLElement>;

	info: JQuery<HTMLElement>;
	infoContainer: JQuery<HTMLElement>;

	updateContainer: JQuery<HTMLElement>;
	updateIcon: JQuery<HTMLElement>;
	updateh2: JQuery<HTMLElement>;
	updateh3: JQuery<HTMLElement>;
	tryAgain: JQuery<HTMLElement>;
	installButton: JQuery<HTMLElement>;
	restartNow: JQuery<HTMLElement>;
	updateSpinner: JQuery<HTMLElement>;

	restartNowHtml: string;

	constructor(projection: JQuery<HTMLElement>) {
		super(projection);

		this.logo = make("i").addClass("mtd-logo icon-moderndeck icon").click(() => {
			this.diagClickNumber++;
			console.log(this.diagClickNumber);
			if (this.diagClickNumber >= 5) {
				this.diagClickNumber = 0;
				diag();
			}
		});

		this.h1 = make("h1").addClass("mtd-about-title").html(`${window.ModernDeck.productName}<span>${I18n(versionString)}</span>`);
		this.h2 = make("h2").addClass("mtd-version-title").html("Version " + window.ModernDeck.versionFriendlyString + I18n(" (Build ") + window.ModernDeck.buildNumber + ")");
		this.logoContainer = make("div").addClass("mtd-logo-container");

		if (!isApp) {
			this.logoContainer.append(
				make("p").addClass("mtd-check-out-app").html(I18n(`Get background notifications and more features with the free <a href='https://moderndeck.org'>ModernDeck App</a>!`))
			)
		} else if (window.desktopConfig && window.desktopConfig.autoUpdatePolicy === "never") {
			this.logoContainer.append(
				make("p").addClass("mtd-check-out-app").html(I18n(`Updates are disabled by your organization`))
			)
		}

		this.info = make("p").html(I18n(`Made with <i class="icon icon-heart mtd-about-heart"></i> by <a href="https://twitter.com/dangeredwolf" rel="user" target="_blank">dangered wolf</a> since 2014<br>ModernDeck is <a href="https://github.com/dangeredwolf/ModernDeck/" target="_blank">an open source project</a> released under the MIT license.`));
		this.infoContainer = make("div").addClass("mtd-about-info").append(this.info);

		this.logoContainer.append(this.logo, this.h1, this.h2);

		projection.append(this.logoContainer);

		this.updateContainer = this.makeUpdateCont();

		if (isApp && !window.html.hasClass("mtd-winstore") && !window.html.hasClass("mtd-flatpak") && !window.html.hasClass("mtd-macappstore") && (window.desktopConfig && window.desktopConfig.autoUpdatePolicy !== "never")) {
			projection.append(this.updateContainer);
		}

		if (window.html.hasClass("mtd-winstore")) {
			projection.append(
				make("div").append(
					make("h2").addClass("mtd-update-h3 mtd-update-managed").html(I18n("Updates for this version of ModernDeck are managed by the Microsoft Store.")),
					make("button").addClass("btn mtd-settings-button").html(I18n("Check for Updates")).click(() => open("ms-windows-store://updates"))
				)
			);
		} else if (window.html.hasClass("mtd-macappstore")) {
			projection.append(
				make("div").append(
					make("h2").addClass("mtd-update-h3 mtd-update-managed").html(I18n("Updates for this version of ModernDeck are managed by the App Store.")),
					make("button").addClass("btn mtd-settings-button").html(I18n("Check for Updates")).click(() => {
						open("macappstore://showUpdatesPage");
					})
				)
			);
		}

		projection.append(this.infoContainer);

		console.log(this);
	}

	makeUpdateCont() {
		this.updateSpinner = make("div").addClass("mtd-update-spinner preloader-wrapper small active").html(
			'<div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>'
		)
		this.updateContainer = make("div").addClass("mtd-update-container").append(this.updateSpinner);
		this.updateIcon = make("i").addClass("material-icon hidden");
		this.updateh2 = make("h2").addClass("mtd-update-h2").html(I18n("Checking for updates..."));
		this.updateh3 = make("h3").addClass("mtd-update-h3 hidden").html("");
		this.tryAgain = make("button").addClass("btn hidden").html(I18n("Try Again"));
		this.installButton = make("button").addClass("btn hidden").html(I18n("Download"));
	
		this.restartNow = make("button").addClass("btn hidden").attr("id","restartNow");
		this.restartNowHtml = I18n("Restart Now");
	
		this.restartNow.html(this.restartNowHtml);
	
		this.updateContainer.append(
			this.updateIcon,
			this.updateh2,
			this.updateh3,
			this.tryAgain,
			this.installButton,
			this.restartNow
		);
	
		if (typeof require !== "undefined" && !window.html.hasClass("mtd-flatpak") && !window.html.hasClass("mtd-winstore") && !window.html.hasClass("mtd-macappstore")) {
			this.mtdAppUpdatePage();
		}
	
		return this.updateContainer;
	}

	mtdAppUpdatePage() {

		$(document).on("mtdUpdateUIChanged", () => {
			console.log("Update UI changed, I wonder what's new!");
			this.updateUIChanged();
		});
	
		const { ipcRenderer } = window.require("electron");
	
		setTimeout(() => {
			$(this.tryAgain).click(() => {
				ipcRenderer.send("checkForUpdates");
			})
	
			$(this.installButton).click(() => {
				ipcRenderer.send("downloadUpdates");
			})
	
			$(this.restartNow).click(() => {
				ipcRenderer.send("restartAndInstallUpdates");
			});
	
			if (!AutoUpdateController.isCheckingForUpdates && window.desktopConfig.autoUpdatePolicy !== "disabled" && window.desktopConfig.autoUpdatePolicy !== "manual") {
				console.log("heck");
				ipcRenderer.send("checkForUpdates");
			}
	
			this.updateUIChanged();
		})
	}

	updateUIChanged() {
		if (AutoUpdateController.h2) {
			$(this.updateh2).removeClass("hidden");
			$(this.updateh2).html(AutoUpdateController.h2);
		} else {
			$(this.updateh2).addClass("hidden");
		}
	
		if (AutoUpdateController.h3) {
			$(this.updateh3).removeClass("hidden");
			$(this.updateh3).html(AutoUpdateController.h3);
		} else {
			$(this.updateh3).addClass("hidden");
		}
	
		if (AutoUpdateController.installButton) {
			$(this.installButton).removeClass("hidden");
			$(this.installButton).html(AutoUpdateController.installButton);
		} else {
			$(this.installButton).addClass("hidden");
		}
	
		if (AutoUpdateController.tryAgain) {
			$(this.tryAgain).removeClass("hidden");
			$(this.tryAgain).html(AutoUpdateController.tryAgain);
		} else {
			$(this.tryAgain).addClass("hidden");
		}
	
		if (AutoUpdateController.restartNow) {
			$(this.restartNow).removeClass("hidden");
		} else {
			$(this.restartNow).addClass("hidden");
		}
	
		if (AutoUpdateController.icon) {
			$(this.updateIcon).removeClass("hidden");
			$(this.updateIcon).html(AutoUpdateController.icon);
		} else {
			$(this.updateIcon).addClass("hidden");
		}
	
		if (AutoUpdateController.spinner === true) {
			$(this.updateSpinner).removeClass("hidden");
		} else {
			$(this.updateSpinner).addClass("hidden");
		}
	}
}
