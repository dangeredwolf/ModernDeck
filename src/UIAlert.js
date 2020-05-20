import { make, exists } from "./Utils.js";
import { I18n } from "./I18n.js";
import { UIModal } from "./UIModal.js";

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

export class UIAlert extends UIModal {
	constructor(obj) {
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
			this.alertButton2.click(obj.button2Click || mtdPrepareWindows);
		}

		this.alertButton.click(obj.button1Click || mtdPrepareWindows);

		this.element.append(this.alertTitle, this.alertBody, this.alertButtonContainer);

		this.display();
	}
}

export function mtdAlert(obj) {
	console.warn("Someone tried to access the ModernDeck 7 Alert API. Please upgrade to ModernDeck 8 UIAlert.");
	return new UIAlert(obj);
}
