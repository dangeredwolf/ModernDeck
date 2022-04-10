/*
	UIWelcome.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/* Main thread for welcome screen */

import { _welcomeData } from "./DataWelcome";
import { makeUpdateCont } from "./UISettings";
import { isApp, make } from "./Utils";
import { enableStylesheetExtension, disableStylesheetExtension } from "./StylesheetExtensions";
import { setPref } from "./StoragePreferences";
import { I18n } from "./I18n";
import { UIModal } from "./UIModal";
let welcomeData = _welcomeData;

export const debugWelcome = false;

export function welcomeScreen() {
	return new UIWelcome();
}

export class UIWelcome extends UIModal {
	constructor() {
		super();

		if (desktopConfig && desktopConfig.disableOOBE) {
			return;
		}

		window.isInWelcome = true;

		try {
			allColumnsVisible();
		} catch(e) {}

		welcomeData.update.enabled = isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore") && !html.hasClass("mtd-flatpak");
		welcomeData.update.html = makeUpdateCont();

		mtdPrepareWindows();

		disableStylesheetExtension("light");
		enableStylesheetExtension("dark");

		$(".message-banner").attr("style","display: none;");

		if ($(".mtd-language-picker").length > 0) { //language > welcome
			return;
		}

		this.container = make("div").addClass("mtd-settings-inner mtd-welcome-inner");
		this.element = make("div").addClass("mdl mtd-settings-panel").append(this.container);

		for (var key in welcomeData) {

			let welc = welcomeData[key];

			if (welc.enabled === false) {
				continue;
			}

			let subPanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id",key);


			subPanel.append(
				make("h1").addClass("mtd-welcome-head").html(welc.title),
				make("p").addClass("mtd-welcome-body").html(welc.body)
			);

			if (welc.html) {
				subPanel.append(
					make("div").addClass("mtd-welcome-html").html(welc.html)
				)
			}

			let button = make("button").html("<i class='icon icon-arrow-l'></i>" + I18n("Previous")).addClass("btn btn-positive mtd-settings-button mtd-welcome-prev-button")
			.click(function() {
				$(".mtd-settings-inner").css("margin-left",((subPanel.index()-1) * -700)+"px")
				if (typeof welc.prevFunc === "function") {
					welc.prevFunc();
				}
			});

			let button2 = make("button").html((key === "update" ? I18n("Skip") : I18n("Next")) + "<i class='icon icon-arrow-r'></i>").addClass("btn btn-positive mtd-settings-button mtd-welcome-next-button")
			.click(function() {
				$(".mtd-settings-inner").css("margin-left",((subPanel.index()+1) * -700)+"px");
				if (typeof welc.nextFunc === "function") {
					welc.nextFunc();
				}
			});

			if (key === "done") {
				button2.html(I18n("Done")).off("click").click(() => {
					setPref("mtd_welcomed",true);
					$(document).trigger("uiCloseModal");
				});
			}

			subPanel.append(button,button2);

			this.container.append(subPanel);
		}

		this.display();

		let theme = TD.settings.getTheme();
		if (theme === "dark") {
			$("input[value='dark']").click();
		} else if (theme === "light") {
			$("input[value='light']").click();
		}

		return this;
	}
}
