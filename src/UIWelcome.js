/*
	UIWelcome.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

/* Main thread for welcome screen */

import { _welcomeData } from "./DataWelcome.js";
import { settingsData } from "./DataSettings.js";
import { makeUpdateCont } from "./UISettings.js";
import { isApp, make } from "./Utils.js";
import { enableStylesheetExtension, disableStylesheetExtension } from "./StylesheetExtensions.js";
import { setPref } from "./StoragePreferences.js";
import { I18n } from "./I18n.js";
import { UIModal } from "./UIModal.js";
let welcomeData = _welcomeData;

export const debugWelcome = false;

export function welcomeScreen() {
	return new UIWelcome();
}

export class UIWelcome extends UIModal {
	constructor() {
		super();

		window.isInWelcome = true;

		try {
			allColumnsVisible();
		} catch(e) {}

		welcomeData.update.enabled = isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore");
		welcomeData.update.html = makeUpdateCont();

		mtdPrepareWindows();

		disableStylesheetExtension("light");
		enableStylesheetExtension("dark");

		setTimeout(() => {
			$("#settings-modal").off("click");
		},0);
		$(".app-content,.app-header").remove();

		$(".application").attr("style",`background-image:url(${mtdBaseURL}resources/img/bg1.jpg)`);

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
					window.location.reload();
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
