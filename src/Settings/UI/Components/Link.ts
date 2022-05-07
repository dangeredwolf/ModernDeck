/*
	Settings/UI/Components/Link.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsLink extends UISettingsComponent {
	_value: string;
	link: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();

		this.link =
			make("a")
			.html(UISettings.i18nString(setting.label))
			.addClass("mtd-settings-link")
			.click(() => {
				parseActions(setting.activate, true);
			});

		projection.append(this.link);

	}

}
