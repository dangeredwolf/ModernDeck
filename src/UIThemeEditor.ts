/*
	UIThemeEditor.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";
import { CustomThemes } from "./CustomThemes";

import { I18n } from "./I18n";

export class UIThemeEditor {
	panel: JQuery<HTMLElement>;
	body: JQuery<HTMLElement>;

	constructor() {
		this.panel = make("div").addClass("mtd-theme-editor mdl");
		this.panel.append(make("h2").addClass("mdl-alert-title").html(I18n("Theme Editor")));

		this.body = make("div").addClass("mtd-theme-editor-body");

		console.log(CustomThemes.themeParameters)

		let styles = getComputedStyle(document.querySelector(".drawer"));

		console.log(styles);

		for (let parameter in CustomThemes.themeParameters) {

			let colorPicker: JQuery<HTMLElement> = make("input").attr("type","color");

			colorPicker.attr("value", styles.getPropertyValue("--" + CustomThemes.themeParameters[parameter]));

			this.body.append(make("div").addClass("mtd-settings-option mtd-theme-editor-item").append(
				make("label").addClass("control-label").html(CustomThemes.themeParameters[parameter]),
				colorPicker
			))


		}

		this.panel.append(this.body)
	}

	display(): void {
		$(".mtd-theme-editor").remove();
		$(window.body).append(this.panel);
	}

	dismiss(): void {
		this.panel.remove?.();
	}
}
