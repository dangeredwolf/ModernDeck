/*
	UIWelcome.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/* Main thread for welcome screen */

import { make } from "./Utils";
import { UIModal } from "./UIModal";
import { I18n } from "./I18n";
import { setPref } from "./StoragePreferences";

export const debugWelcome = false;

export function welcomeScreen() {
	return new UIWelcome();
}

export class UIWelcome extends UIModal {
	container: JQuery<HTMLElement>;
	leftPane: JQuery<HTMLElement>;
	rightPane: JQuery<HTMLElement>;

	constructor() {
		super();

		if (window.desktopConfig && window.desktopConfig.disableOOBE) {
			return;
		}

		window.isInWelcome = true;

		window.mtdPrepareWindows();

		if ($(".mtd-language-picker").length > 0) { //language > welcome
			return;
		}

		$(".message-banner").attr("style","display: none;");

		this.container = make("div").addClass("mtd-welcome-inner");
		this.element = make("div").addClass("mdl mtd-welcome-panel").append(this.container);

		this.container.append(
			make("h1").text(I18n(`Welcome to {productName}`).replace("{productName}", window.ModernDeck.productName)),
			make("p").text(I18n(`Welcome to {productName}, a free and open-source Twitter client, built on the power of TweetDeck but enhanced with a modern UI and more customization.`).replace("{productName}", window.ModernDeck.productName))
		)

		this.leftPane = make("div").addClass("mtd-welcome-pane mtd-welcome-pane-left");
		this.rightPane = make("div").addClass("mtd-welcome-pane mtd-welcome-pane-right");

		$("#settings-modal").click(() => {
			setPref("mtd_welcomed", true);
		})

		this.display();

		return this;
	}
}
