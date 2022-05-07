/*
	Settings/UI/Components/ButtonGroup.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsButtonGroup extends UISettingsComponent {
	_value: string;
	label: JQuery<HTMLElement>;
	buttonGroup: JQuery<HTMLElement>[] = [];

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();

		this.label = make("label").addClass("control-label").html(
			UISettings.i18nString(setting.label)
		)

		projection.append(this.label);

		setting.buttons.forEach(button => {
			const buttonElement = make("button")
			.html(UISettings.i18nString(button.text))
			.addClass("btn btn-positive mtd-settings-button")
			.click(() => button.func());

			this.buttonGroup.push(buttonElement);
			projection.append(buttonElement);
		});
	}

}
