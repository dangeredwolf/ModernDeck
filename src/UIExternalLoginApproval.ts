/*
	UIExternalLoginApproval.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/* Main thread for welcome screen */

import { spinnerLarge } from "./DataMustaches";
import { I18n } from "./I18n";
import { UIModal } from "./UIModal";
import { make } from "./Utils";

export class UIExternalLoginApproval extends UIModal {

	alertTitle: JQuery<HTMLElement>;
	alertBody: JQuery<HTMLElement>;
	alertButtonContainer: JQuery<HTMLElement>;
	loginButton: JQuery<HTMLElement>;
	closeButton: JQuery<HTMLElement>;
	loading: JQuery<HTMLElement>;

	finishedHandshake: boolean = false;

	connectToModernDeckDesktop() {
		const ws = new WebSocket("ws://127.0.0.1:13325/");
		ws.onopen = () => {
			ws.send("HELLO");
		}
		ws.onmessage = (e: MessageEvent<any>) => {
			if (e.data === "READY" && this.finishedHandshake === false) {
				this.finishedHandshake = true;
				this.alertBody.html(I18n("Are you trying to sign in to ModernDeck Desktop? If not, just close this tab."));
				this.loginButton.html(I18n("Sign in"));
			}
		}
	}
	
	constructor() {
		super();

		this.element = make("div").addClass("mdl mtd-alert mtd-external-login");
		this.alertBody = make("p").addClass("mtd-alert-body").html(I18n("Connecting to ModernDeck Desktop..."));
		this.alertButtonContainer = make("div").addClass("mtd-alert-button-container");
		this.loading = $(spinnerLarge);

		this.loginButton = make("button").addClass("btn-primary btn mtd-alert-button").html(I18n("OK"));
		this.closeButton = make("button").addClass("btn-primary btn mtd-alert-button").html(I18n("Close"));

		$(".application,.login-container,.message-banner").remove();

		this.alertButtonContainer.append(this.loginButton);

		this.element.append(this.alertTitle, this.alertBody, this.loading, this.alertButtonContainer);

		this.display();
		this.connectToModernDeckDesktop();

		return this;
	}
}
