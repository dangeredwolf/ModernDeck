/*
	Settings/UI/Components/Button.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsButton extends UISettingsComponent {
	_value: string;
	button: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();

		this.label = make("label").addClass("control-label").html(
			UISettings.i18nString(setting.label)
		)

		this.button = make("button")
					  .text(UISettings.i18nString(setting.title))
					  .addClass("btn btn-positive mtd-settings-button")
					  .click(() => {
						  parseActions(setting.activate, true);
					  });

		projection.append(this.label, this.button);
	}

}
