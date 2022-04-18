/*
	Settings/UI/Components/Dropdown.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { setPref } from "../../../StoragePreferences";
import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsDropdown extends UISettingsComponent {
	_value: string;
	select: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();
		this.select = make("select").attr("type","select");
		
		for (let prefKey in setting.options) {
			const opts = setting.options[prefKey];
			if (!!(opts.value)) {
				let newPrefSel = opts;
				let newoption = make("option")
								.attr("value", newPrefSel.value)
								.html(UISettings.i18nString(newPrefSel.text));

				this.select.append(newoption);
			} else {
				let group = make("optgroup").attr("label", UISettings.i18nString(opts.name))

				for (let subKey in opts.children) {
					let subSelector = opts.children[subKey];
					let subOption = make("option")
									   .attr("value",subSelector.value)
									   .html(UISettings.i18nString(subSelector.text));
					group.append(subOption);
				}
				this.select.append(group);
			}
		}

		this.populateDefaultValue(setting);

		this.select.change(function() {
			parseActions(setting.activate, $(this).val());

			if (setting.savePreference !== false) {
				setPref(setting.settingsKey, $(this).val());
			}
		});

		
		this.label = make("label").addClass("control-label").html(
			UISettings.i18nString(setting.title)
		)

		projection.append(this.label, this.select);
	}

	set value(value: string) {
		this._value = value;

		this.select.val(value);
	}

}
