/*
	UILanguagePicker.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";
import DataI18n from "./DataI18n";
import { UIModal } from "./UIModal";
import { getFullLanguage, getMainLanguage } from "./I18n";
import unsupportedCodeTable from "./DataUnsupportedLanguage";
import inaccuraciesCodeTable from "./DataTranslationsMayBeInaccurate";
import { setPref } from "./StoragePreferences";
import { UIWelcome } from "./UIWelcome";

import languageData from "./DataI18n";

export class UILanguagePicker extends UIModal {
	hasMadeChange: boolean;
	alertTitle: JQuery<HTMLElement>;
	alertButton: JQuery<HTMLElement>;
	inaccuracy: JQuery<HTMLElement>;
	selectLanguage: JQuery<HTMLElement>;
	alertBody: JQuery<HTMLElement>;
	alertButtonContainer: JQuery<HTMLElement>;
	unsupportedLang: JQuery<HTMLElement>;
	constructor() {
		super();
		window.languageData = languageData;

		this.hasMadeChange = false;

		this.element = make("div").addClass("mdl mtd-alert mtd-language-picker");

		this.element.append(
			make("span").addClass("mtd-language-hello").text("Hello"),
			make("span").addClass("mtd-language-hello").text("你好"),
			make("span").addClass("mtd-language-hello").text("こんにちは"),
			make("span").addClass("mtd-language-hello").text("Hola"),
			make("span").addClass("mtd-language-hello").text("Bonjour"),
			make("span").addClass("mtd-language-hello").text("Hallo"),
			make("span").addClass("mtd-language-hello").text("Привет"),
			make("span").addClass("mtd-language-hello").text("Привіт"),
			make("span").addClass("mtd-language-hello").text("Olá"),
			make("span").addClass("mtd-language-hello").text("Ciao"),
			make("span").addClass("mtd-language-hello").text("안녕하세요"),
			make("span").addClass("mtd-language-hello").text("Witam"),
		)
		// @ts-ignore TypeScript does not understand current format i18ndata
		this.alertButton = make("button").addClass("btn-primary btn mtd-alert-button hidden").html("OK");
		this.inaccuracy = make("div").addClass("mtd-unsupported-lang mtd-lang-inaccuracies").html((
			// @ts-ignore TypeScript does not understand current format i18ndata
			(DataI18n[navigator.language.substr(0,2)] && DataI18n[navigator.language.substr(0,2)]["Translations may be incomplete or inaccurate."] ?
			// @ts-ignore TypeScript does not understand current format i18ndata
			DataI18n[navigator.language.substr(0,2)]["Translations may be incomplete or inaccurate."] :
			// @ts-ignore TypeScript does not understand current format i18ndata
			(inaccuraciesCodeTable[navigator.language.substr(0,2)] || inaccuraciesCodeTable["en"]))) +
			" <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>")

		this.selectLanguage = make("select").attr("id","mtd_language_select").append(
			make("option").val("default").html("-").attr("selected","true").attr("disabled","true"),
			make("option").val("bg").html("български"),
			make("option").val("cs").html("čeština"),
			make("option").val("de").html("Deutsch"),
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
			make("option").val("zh_CN").html("简体中文"),
			make("option").val("zh_TW").html("繁體中文"),
		).change(() => {
			this.hasMadeChange = true;

			// @ts-ignore TypeScript does not understand current format i18ndata
			this.alertButton.html(languageData.OK[this.selectLanguage.val()] || languageData.OK[this.selectLanguage.val().substr(0,2)] || "OK");
			this.alertButton.removeClass("hidden");

			// @ts-ignore TypeScript does not understand current format i18ndata
			let langCode = DataI18n["Translations may be incomplete or inaccurate."][this.selectLanguage.val()];
			// @ts-ignore TypeScript does not understand current format i18ndata
			let langCodeBase = DataI18n["Translations may be incomplete or inaccurate."][this.selectLanguage.val().substr(0,2)];
			const footer = " <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>";

			if (typeof langCode !== "undefined") {
				this.inaccuracy.html(langCode + footer);
			} else if (typeof langCodeBase !== "undefined" && langCodeBase === false) {
				this.inaccuracy.html(langCodeBase + footer);
			} else {
				// @ts-ignore TypeScript does not understand current format i18ndata
				this.inaccuracy.html((inaccuraciesCodeTable[this.selectLanguage.val()] || inaccuraciesCodeTable[this.selectLanguage.val().substr(0,2)] || inaccuraciesCodeTable["en"]["Translations may be incomplete or inaccurate."]) + footer);
			}
		});

		setTimeout(() => {
			let mainLang: string = navigator.language.substr(0,2);
			switch(mainLang) {
				case "en":
					mainLang = "en_US";
					break;
				case "es":
					mainLang = "es_ES";
					break;
				case "zh":
					mainLang = "zh_CN";
					break;
				case "fr":
					mainLang = "fr_FR";
					break;
			}
			
			console.log(mainLang);

			let mainLangElement = $(`#mtd_language_select>option[value="${mainLang}"]`);
			console.log(`mainLangElement.length ${mainLangElement.length}`)
			if (mainLangElement.length > 0) {
				mainLangElement.attr("selected","true");
				this.selectLanguage.trigger("change");
			}

			let localLang = $(`#mtd_language_select>option[value="${navigator.language.replace(/\-/g,"_")}"]`);

			if (localLang.length > 0) {
				localLang.attr("selected","true");
				this.selectLanguage.trigger("change");
			}

			this.hasMadeChange = false;

			setTimeout(() => {
				this.hasMadeChange = false;
			})
		})


		this.alertBody = make("p").addClass("mtd-alert-body").append(this.selectLanguage);
		this.alertButtonContainer = make("div").addClass("mtd-alert-button-container");
		// @ts-ignore TypeScript does not understand current format i18ndata
		this.unsupportedLang = make("div").addClass("mtd-unsupported-lang").html((unsupportedCodeTable[navigator.language.substr(0,2)] || unsupportedCodeTable["en"]) + " <a href='https://translate.moderndeck.org'>translate.moderndeck.org</a>")



		this.alertButtonContainer.append(this.alertButton);

		this.alertButton.click(() => {
			setPref("mtd_last_lang", navigator.language);
			setPref("mtd_lang", this.selectLanguage.val());

			if (getFullLanguage() !== this.selectLanguage.val() && getMainLanguage() !== this.selectLanguage.val()) {
				setTimeout(() => {
					if (typeof require !== "undefined") {
						const { ipcRenderer } = window.require("electron");
						ipcRenderer.send("restartApp");
					} else {
						location.reload();
					}
				}, 200);
			} else {
				this.dismiss();
			}

			if (window.isInWelcome) {
				setTimeout(() => new UIWelcome, 100)
			}
		});

		this.element.append(this.alertTitle, this.alertBody, this.alertButtonContainer);

		// @ts-ignore TypeScript does not understand current format i18ndata
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
