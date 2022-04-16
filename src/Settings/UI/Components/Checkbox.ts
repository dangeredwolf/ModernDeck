import { setPref } from "../../../StoragePreferences";
import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsTab } from "../../UISettingsTab";

export class SettingsCheckbox {
	_value: boolean;
	input: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery) {
		this.input = make("input").attr("type","checkbox").attr("id", setting.settingsKey)
		this.value = UISettingsTab.getInitialSetting(setting);
		this.input.change(function() {
			if (setting.savePreference !== false) {
				setPref(setting.settingsKey, $(this).is(":checked"));
			}

			if ($(this).is(":checked")) {
				parseActions(setting.activate, $(this).val());
			} else {
				parseActions(setting.deactivate, $(this).val());
			}
		});

		// TODO: fix @types/jquery so I can get rid of the [0]
		this.label = make("label").addClass("checkbox").html(
			make("span").html(
				UISettings.internationalizeSettingString(setting.title)
			)[0]
		)

		this.input.append(this.label);

		projection.append(this.input);
	}
	
	get value() {
		return this._value;
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
