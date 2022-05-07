/*
	Settings/UI/Components/Subtext.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsSubtext extends UISettingsComponent {
	_value: string;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();

		this.label =
			make("label")
			.addClass("control-label txt-mute mtd-settings-subtext")
			.html(UISettings.i18nString(setting.label) || "");
		
		projection.append(this.label);
	}

}
