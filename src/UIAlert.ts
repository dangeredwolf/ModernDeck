/*
	UIAlert.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make, exists } from "./Utils";
import { I18n } from "./I18n";
import { UIModal } from "./UIModal";

/*
	UIAlert(Object alertProps)

	alertProps is an object with the following options:

	String title: Title of the alert
	String message: Body message of the alert
	String buttonText: Button 1 text
	String button2Text: Button 2 text

	function button1Click: Button 1 click function
	function button2Click: Button 2 click function

	Note: make sure you call mtdPrepareWindows afterward to close the alert box

	String type: supported types are "confirm", "alert"
*/

export interface AlertOptions {
	title?: string;
	message?: string;
	buttonText?: string;
	button2Text?: string;
	button1Click?: () => void;
	button2Click?: () => void;
	type?: "confirm" | "alert";
}

export class UIAlert extends UIModal {
	alertTitle: JQuery;
	alertBody: JQuery;
	alertButtonContainer: JQuery;
	alertButton: JQuery;
	alertButton2: JQuery;
	constructor(obj: AlertOptions) {
		super();

		obj = obj || {};

		this.element = make("div").addClass("mdl mtd-alert");
		this.alertTitle = make("h2").addClass("mtd-alert-title").html(obj.title || I18n("ModernDeck"));
		this.alertBody = make("p").addClass("mtd-alert-body").html(obj.message || I18n("Alert"));
		this.alertButtonContainer = make("div").addClass("mtd-alert-button-container");

		this.alertButton = make("button").addClass("btn-primary btn mtd-alert-button").html(obj.buttonText || I18n("OK"));

		this.alertButtonContainer.append(this.alertButton);

		if (exists(obj.button2Text) || obj.type === "confirm") {
			this.alertButton2 = make("button").addClass("btn-primary btn mtd-alert-button mtd-alert-button-secondary").html(obj.button2Text || I18n("Cancel"));
			this.alertButtonContainer.append(this.alertButton2);
			this.alertButton2.click(obj.button2Click || window.mtdPrepareWindows);
		}

		this.alertButton.click(obj.button1Click || window.mtdPrepareWindows);

		this.element.append(this.alertTitle, this.alertBody, this.alertButtonContainer);

		this.display();
	}
}

window.originalAlert = window.alert;
window.alert = (text): UIAlert => {
	return new UIAlert({message:text})
}
