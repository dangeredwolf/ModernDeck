/*
	Settings/UISettingsComponent.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref } from "../StoragePreferences";
import { ModernDeckSettingsOption } from "../Types/ModernDeckSettings";

export class UISettingsComponent {
    element: JQuery;
    _value: any;

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

    populateDefaultValue(setting: ModernDeckSettingsOption): void {
        if (typeof setting.queryFunction === "function") {
			try {
				this.value = setting.queryFunction();
			} catch(error: unknown) {
				console.error(error);
			}
		} else {
			this.value = getPref(setting.settingsKey);
		}
    }
}