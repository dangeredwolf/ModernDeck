/*
	Settings/UI/Components/Checkbox.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { setPref } from "../../../StoragePreferences";
import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsCheckbox extends UISettingsComponent {
	_value: boolean;
	input: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();

		this.input = make("input").attr("type", "checkbox");

		this.populateDefaultValue(setting);

		this.input.change(() => {
			if (setting.savePreference !== false) {
				setPref(setting.settingsKey, this.input.is(":checked"));
			}

			if (this.input.is(":checked")) {
				parseActions(setting.activate, this.input.val());
			} else {
				parseActions(setting.deactivate, this.input.val());
			}
		});

		this.label = make("label").addClass("checkbox").append(
			make("span").html(
				UISettings.i18nString(setting.title)
			),
			this.input
		)

		projection.append(this.label);
	}

	set value(value: boolean) {
		this._value = value;

		if (value) {
			this.input.attr("checked","checked");
		} else {
			this.input.removeAttr("checked");
		}
	}

}
