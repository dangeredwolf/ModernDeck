/*
	Settings/UI/Components/Slider.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "../../../I18n";
import { setPref } from "../../../StoragePreferences";
import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsSlider extends UISettingsComponent {
	_value: number;
	slider: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;
	defaultButton: JQuery<HTMLElement>;
	maximum: JQuery<HTMLElement>;
	minimum: JQuery<HTMLElement>;
	sliderContainer: JQuery<HTMLElement>;

	title: string;
	displayUnit: string;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();
		this.label = make("label").addClass("control-label");

		this.slider = make("input").attr("type","range")
				.attr("min",setting.minimum)
				.attr("max",setting.maximum);

		this.title = setting.title;
		this.displayUnit = setting.displayUnit;

		this.defaultButton = make("button")
							 .addClass("btn btn-positive mtd-settings-button mtd-default-button")
							 .text(I18n("Restore default")).click(() => {
			this.slider.val(
				typeof setting.default === "function" ? setting.default() :
				setting.default
			).trigger("input").trigger("change");
		})

		this.slider.change(() => {
			parseActions(setting.activate, this.slider.val());
			if (setting.savePreference !== false) {
				setPref(setting.settingsKey, this.slider.val());
			}
		}).on("input", () => {
			this.value = this.slider.val() as number;
		});

		
		this.maximum = make("label").addClass("control-label mtd-slider-maximum").html(setting.maximum + (UISettings.i18nString(setting.displayUnit) || ""));
		this.minimum = make("label").addClass("control-label mtd-slider-minimum").html(setting.minimum + (UISettings.i18nString(setting.displayUnit) || ""));

		this.sliderContainer = make("div")
							   .addClass("mtd-slider-container")
							   .append(this.maximum, this.slider, this.minimum)

		this.populateDefaultValue(setting);

		projection.append(this.label, this.sliderContainer, this.defaultButton);
	}

	set value(value: number) {
		this._value = value;

		this.slider.val(value);

		this.label.html(
			`${UISettings.i18nString(this.title)} ` +
			`<b> ${this.slider.val()} ${(UISettings.i18nString(this.displayUnit || ""))} </b>`
		);
	}

}
