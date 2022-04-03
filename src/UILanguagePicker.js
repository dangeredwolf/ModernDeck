/*
	UILanguagePicker.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils.js";
import DataI18n from "./DataI18n.js";
import { UIModal } from "./UIModal.js";
import { getFullLanguage, getMainLanguage } from "./I18n.js";
import unsupportedCodeTable from "./DataUnsupportedLanguage.js";
import inaccuraciesCodeTable from "./DataTranslationsMayBeInaccurate.js";
import languageText from "./DataTextThatSaysLanguage.js";

import languageData from "./DataI18n.js";

export class UILanguagePicker extends UIModal {
	constructor() {
		super();
		window.languageData = languageData;

		this.hasMadeChange = false;

		this.element = make("div").addClass("mdl mtd-alert mtd-language-picker");
		this.alertTitle = make("h2").addClass("mtd-alert-title").html("<i class='material-icon'>language</i>" + (languageText[navigator.language.substr(0,2)] || languageText["en"]));
		this.alertButton = make("button").addClass("btn-primary btn mtd-alert-button hidden").html("OK");
		this.inaccuracy = make("div").addClass("mtd-unsupported-lang mtd-lang-inaccuracies").html(((DataI18n[navigator.language.substr(0,2)] && DataI18n[navigator.language.substr(0,2)]["Translations may be incomplete or inaccurate."] ? DataI18n[navigator.language.substr(0,2)]["Translations may be incomplete or inaccurate."] : (inaccuraciesCodeTable[navigator.language.substr(0,2)] || inaccuraciesCodeTable["en"]) ))+ " <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>")

		this.selectLanguage = make("select").attr("id","mtd_language_select").append(
			make("option").val("default").html("-").attr("selected","true").attr("disabled","true"),
			make("option").val("bg").html("български"),
			make("option").val("cs").html("čeština"),
			make("option").val("de").html("Deutsche"),
			make("option").val("et").html("eesti"),
			make("option").val("en_CA").html("English (Canada)"),
			make("option").val("en_GB").html("English (United Kingdom)"),
			make("option").val("en_US").html("English (United States)"),
			make("option").val("es_ES").html("Español (España)"),
			make("option").val("es_US").html("Español (Estados Unidos)"),
			make("option").val("es_419").html("Español (México)"),
			make("option").val("fr_CA").html("Français (Canada)"),
			make("option").val("fr_FR").html("Français (France)"),
			make("option").val("ko").html("한국어"),
			// make("option").val("hr").html("hrvatski"), // Language is not complete enough yet
			make("option").val("it").html("italiano"),
			make("option").val("hu").html("magyar"),
			make("option").val("ja").html("日本語"),
			make("option").val("no").html("norsk"),
			make("option").val("pl").html("polski"),
			// make("option").val("pt").html("Português"), // Language is not complete enough yet
			make("option").val("pt_BR").html("Português (Brasil)"),
			make("option").val("ru").html("русский"),
			make("option").val("sl").html("Slovenščina"),
			// make("option").val("si").html("සිංහල"), // Language is not complete enough
			make("option").val("uk").html("українська"),
			make("option").val("zh_CN").html("中文（简体）"),
			make("option").val("zh_TW").html("中文（繁體）"),
		).change(() => {
			this.alertTitle.html("<i class='material-icon'>language</i> " + (languageData.Language[this.selectLanguage.val()] || languageData.Language[this.selectLanguage.val().substr(0,2)] || "Language"));

			this.hasMadeChange = true;

			this.alertButton.html(languageData.OK[this.selectLanguage.val()] || languageData.OK[this.selectLanguage.val().substr(0,2)] || "OK");
			this.alertButton.removeClass("hidden");

			this.inaccuracy.html(((DataI18n[this.selectLanguage.val().substr(0,2)] && DataI18n[this.selectLanguage.val().substr(0,2)]["Translations may be incomplete or inaccurate."] ? DataI18n[this.selectLanguage.val().substr(0,2)]["Translations may be incomplete or inaccurate."] : (inaccuraciesCodeTable[this.selectLanguage.val().substr(0,2)] || inaccuraciesCodeTable["en"]) ))+ " <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>")
		});


		setTimeout(() => {
			let mainLang = $("#mtd_language_select>option[value=\"" + navigator.language.substr(0,2) + "\"]");
			if (mainLang.length > 0) {
				mainLang.attr("selected","true");
				this.selectLanguage.trigger("change");
			}

			let localLang = $("#mtd_language_select>option[value=\"" + navigator.language.replace(/\-/g,"_") + "\"]");

			if (localLang.length > 0) {
				localLang.attr("selected","true");
				this.selectLanguage.trigger("change");
			}

			this.hasMadeChange = false;

			setTimeout(() => {
				this.hasMadeChange = false;
			})
		})


		window.inaccuraciesCodeTable = inaccuraciesCodeTable;
		this.alertBody = make("p").addClass("mtd-alert-body").append(this.selectLanguage);
		this.alertButtonContainer = make("div").addClass("mtd-alert-button-container");
		this.unsupportedLang = make("div").addClass("mtd-unsupported-lang").html((unsupportedCodeTable[navigator.language.substr(0,2)] || unsupportedCodeTable["en"]) + " <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>")



		this.alertButtonContainer.append(this.alertButton);

		this.alertButton.click(() => {
			setPref("mtd_last_lang", navigator.language);
			setPref("mtd_lang", this.selectLanguage.val());

			if (getFullLanguage() !== this.selectLanguage.val() && getMainLanguage() !== this.selectLanguage.val()) {
				setTimeout(() => {
					if (typeof require !== "undefined") {
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("restartApp");
					} else {
						location.reload();
					}
				}, 200);
			} else {
				this.dismiss();
			}

			if (window.isInWelcome) {
				setTimeout(() => new window.UIWelcome, 100)
			}
		});

		this.element.append(this.alertTitle, this.alertBody, this.alertButtonContainer);

		if (!DataI18n.source[navigator.language.substr(0,2)]) {
			this.element.append(this.unsupportedLang);
		} else {
			this.element.append(this.inaccuracy);
		}

		if ($("#splash-modal").length < 1) {
			this.modalRoot = ".login-container";
		} else {
			this.modalRoot = "#splash-modal";
		}


		$(this.modalRoot).attr("style", "display: block;").append(this.element)
	}
}
