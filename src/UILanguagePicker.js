import { make } from "./Utils.js";
import { I18n } from "./I18n.js";
import DataI18n from "./DataI18n.js";
import { getPref, setPref } from "./StoragePreferences.js";
import unsupportedCodeTable from "./DataUnsupportedLanguage.js";
import languageText from "./DataTextThatSaysLanguage.js";

import languageData from "./DataI18n.js";

export function UILanguagePicker() {
	window.languageData = languageData;
	let alert = make("div").addClass("mdl mtd-alert mtd-language-picker");
	let alertTitle = make("h2").addClass("mtd-alert-title").html("<i class='material-icon'>language</i>" + (languageText[navigator.language.substr(0,2)] || languageText["en"]));
	let alertButton = make("button").addClass("btn-primary btn mtd-alert-button hidden").html("OK");
	let selectLanguage = make("select").attr("id","mtd_language_select").append(
		make("option").val("default").html("-").attr("selected","true").attr("disabled","true"),
		make("option").val("bg").html("български"),
		make("option").val("de").html("Deutsche"),
		make("option").val("en_CA").html("English (Canada)"),
		make("option").val("en_US").html("English (United States)"),
		make("option").val("en_GB").html("English (United Kingdom)"),
		make("option").val("es_ES").html("Español (España)"),
		make("option").val("es_US").html("Español (Estados Unidos)"),
		make("option").val("es_419").html("Español (México)"),
		make("option").val("fr_CA").html("Français (Canada)"),
		make("option").val("fr_FR").html("Français (France)"),
		make("option").val("hr").html("Hrvatski"),
		make("option").val("pl").html("Polskie"),
		make("option").val("pt_BR").html("Português (Brasil)"),
		make("option").val("ja").html("日本語"),
		make("option").val("ru").html("русский"),
		make("option").val("zh_CN").html("简体中文")
	).change(() => {
		if (languageData.OK[selectLanguage.val()]) {
			alertTitle.html("<i class='material-icon'>language</i> " + languageData.Language[selectLanguage.val()]);
			alertButton.removeClass("hidden");
		}
		alertButton.html(languageData.OK[selectLanguage.val()] || "OK");
	});

	setTimeout(() => {
		let mainLang = $("#mtd_language_select>option[value=\"" + navigator.language.substr(0,2) + "\"]");
		if (mainLang.length > 0) {
			mainLang.attr("selected","true");
			selectLanguage.trigger("change");
		}

		let localLang = $("#mtd_language_select>option[value=\"" + navigator.language.replace(/\-/g,"_") + "\"]");

		if (localLang.length > 0) {
			localLang.attr("selected","true");
			selectLanguage.trigger("change");
		}
	})



	let alertBody = make("p").addClass("mtd-alert-body").append(selectLanguage);
	let alertButtonContainer = make("div").addClass("mtd-alert-button-container");
	let unsupportedLang = make("div").addClass("mtd-unsupported-lang").html((unsupportedCodeTable[navigator.language.substr(0,2)] || unsupportedCodeTable["en"]) + " <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>")


	alertButtonContainer.append(alertButton);

	alertButton.click(() => {
		setPref("mtd_last_lang", navigator.language);
		setPref("mtd_lang", selectLanguage.val());
		setTimeout(() => location.reload(), 500);
	});

	alert.append(alertTitle,alertBody,alertButtonContainer);

	if (!DataI18n.GIF[navigator.language.substr(0,2)]) {
		alert.append(unsupportedLang);
	}

	$("#splash-modal>.mdl").remove();
	$("#splash-modal").attr("style", "display: block;")
	$("#splash-modal").append(alert);
}
