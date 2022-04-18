/*
	Settings/UI/Components/Textarea.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import {  setPref } from "../../../StoragePreferences";
import { ModernDeckSettingsOption } from "../../../Types/ModernDeckSettings";
import { make } from "../../../Utils";
import { parseActions } from "../../SettingsInit";
import { UISettings } from "../../UISettings";
import { UISettingsComponent } from "../../UISettingsComponent";

export class SettingsTextarea extends UISettingsComponent {
	_value: string;
	textarea: JQuery<HTMLElement>;
	label: JQuery<HTMLElement>;

	constructor(setting: ModernDeckSettingsOption, projection: JQuery<HTMLElement>) {
		super();
		this.textarea = make("textarea")
						.addClass("mtd-textarea")
						.attr("id", setting.settingsKey)
						.attr("rows", "10")
						.attr("cols", "80")
						.attr("placeholder", setting.placeholder || "")
						.attr("spellcheck", "false");
		
		this.populateDefaultValue(setting);

		if (setting.instantApply === true) {
			this.textarea.on("input",function() {
				parseActions(setting.activate, $(this).val());
				if (setting.savePreference !== false) {
					setPref(setting.settingsKey, $(this).val());
				}
			});
		} else {
			this.textarea.change(function() {
				parseActions(setting.activate, $(this).val());
				if (setting.savePreference !== false) {
					setPref(setting.settingsKey, $(this).val());
				}
			});
		}

		// https://sumtips.com/snippets/javascript/tab-in-textarea/
		this.textarea.keydown((keydownEvent: JQuery.KeyDownEvent) => {
			let keyCode: number = keydownEvent.keyCode || keydownEvent.charCode || keydownEvent.which;
			if (keyCode == 9 &&
				!keydownEvent.shiftKey && !keydownEvent.ctrlKey &&
				!keydownEvent.metaKey && !keydownEvent.altKey) {
				// If it's a tab, but not Ctrl+Tab, Super+Tab, Shift+Tab, or Alt+Tab
				let textEditor: HTMLInputElement = this.textarea[0] as HTMLInputElement;

				let originalScroll: number = textEditor.scrollTop;
				if (textEditor.setSelectionRange)
				{
					let selectionStart = textEditor.selectionStart;
					let selectionEnd = textEditor.selectionEnd;
					textEditor.value = `${textEditor.value.substring(0, selectionStart)}\t${textEditor.value.substr(selectionEnd)}`;
					textEditor.setSelectionRange(selectionStart + 1, selectionStart + 1);
					textEditor.focus();
				}
				textEditor.scrollTop = originalScroll;

				keydownEvent.preventDefault();

				return false;
			}
			return true;
		});
		
		this.label = make("label").addClass("control-label").html(
			UISettings.i18nString(setting.title)
		)

		projection.append(this.label, this.textarea);
	}

	set value(value: string) {
		this._value = value;

		this.textarea.val(value);
	}

}
