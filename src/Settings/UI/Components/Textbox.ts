/*
	Settings/UI/Components/Textbox.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { setPref } from "../../../StoragePreferences";
import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsTextbox extends UISettingsComponent {
	_value: string;
	textbox: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();
		this.textbox = make("input").attr("type","text");
		
		this.populateDefaultValue(setting);

		this.textbox.change(() => {
			parseActions(setting.activate, this.textbox.val());
			if (setting.savePreference !== false) {
				setPref(setting.settingsKey, this.textbox.val());
			}
		});
		
		this.label = make("label").addClass("control-label").html(
			UISettings.i18nString(setting.title)
		)

		projection.append(this.label, this.textbox);
	}

	set value(value: string) {
		this._value = value;

		this.textbox.val(value);
	}

}
