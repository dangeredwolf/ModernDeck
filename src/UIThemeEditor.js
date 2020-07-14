import { make } from "./Utils.js";
import { CustomThemes } from "./CustomThemes.js";
// import AColorPicker from "a-color-picker";

export class UIThemeEditor {
	panel;
	body;

	constructor() {
		this.panel = make("div").addClass("mtd-theme-editor mdl");

		this.panel.append(make("h2").addClass("mdl-alert-title").html(I18n("Theme Editor")));

		this.body = make("div").addClass("mtd-theme-editor-body");

		console.log(CustomThemes.themeParameters)

		let styles = getComputedStyle(document.querySelector(".drawer"));

		console.log(styles);

		for (let parameter in CustomThemes.themeParameters) {

			let colorPicker = make("input").attr("type","color");

			colorPicker.attr("value", styles.getPropertyValue("--" + CustomThemes.themeParameters[parameter]));

			this.body.append(make("div").addClass("mtd-settings-option mtd-theme-editor-item").append(
				make("label").addClass("control-label").html(CustomThemes.themeParameters[parameter]),
				colorPicker
			))


		}

		this.panel.append(this.body)
	}

	display() {
		$(".mtd-theme-editor").remove();
		$(body).append(this.panel);
	}

	dismiss() {
		this.panel.remove?.();
	}
}

window.UIThemeEditor = UIThemeEditor;
