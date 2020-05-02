import { make, exists } from "./Utils.js";

/*
	mtdAlert(Object alertProps)

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

export function mtdAlert(obj) {

	var obj = obj || {};

	let alert = make("div").addClass("mdl mtd-alert");
	let alertTitle = make("h2").addClass("mtd-alert-title").html(obj.title || "ModernDeck");
	let alertBody = make("p").addClass("mtd-alert-body").html(obj.message || "Alert");
	let alertButtonContainer = make("div").addClass("mtd-alert-button-container");

	let alertButton = make("button").addClass("btn-primary btn mtd-alert-button").html(obj.buttonText || "OK");
	var alertButton2;

	alertButtonContainer.append(alertButton);

	if (exists(obj.button2Text) || obj.type === "confirm") {
		alertButton2 = make("button").addClass("btn-primary btn mtd-alert-button mtd-alert-button-secondary").html(obj.button2Text || "Cancel");
		alertButtonContainer.append(alertButton2);
		alertButton2.click(obj.button2Click || mtdPrepareWindows);
	}

	alertButton.click(obj.button1Click || mtdPrepareWindows);

	alert.append(alertTitle,alertBody,alertButtonContainer);

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(alert);
}
