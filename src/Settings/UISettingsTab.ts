/*
	Settings/UISettingsTab.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsEnumPage, ModernDeckSettingsOption, ModernDeckSettingsType } from "../Types/ModernDeckSettings";
import { isApp, make } from "../Utils";
import { settingsData, SettingsTab } from "./SettingsData";
import { SettingsButton } from "./UI/Components/Button";
import { SettingsButtonGroup } from "./UI/Components/ButtonGroup";
import { SettingsCheckbox } from "./UI/Components/Checkbox";
import { SettingsDropdown } from "./UI/Components/Dropdown";
import { SettingsLink } from "./UI/Components/Link";
import { SettingsSlider } from "./UI/Components/Slider";
import { SettingsSubtext } from "./UI/Components/Subtext";
import { SettingsTextarea } from "./UI/Components/Textarea";
import { SettingsTextbox } from "./UI/Components/Textbox";
import { AboutEnumPage } from "./UI/EnumPage/About";
import { MuteEnumPage } from "./UI/EnumPage/Mutes";
import { UISettings } from "./UISettings";

export class UISettingsTab {
	tab: JQuery;
	subpanel: JQuery;
	tabType: SettingsTab;
	parentSettings: UISettings;

	get index(): number {
		let keys = Object.keys(settingsData);
		
		if (this.parentSettings.limitedMenu) {
			keys = keys.filter(key => {
				switch(key) {
					case SettingsTab.APPEARANCE:
					case SettingsTab.TWEETS:
					case SettingsTab.MUTES:
						return false;
				}

				return true;
			})
		}

		if (!isApp) {
			keys = keys.filter(key => {
				switch(key) {
					case SettingsTab.APP:
						return false;
				}

				return true;
			})
		}

		return keys.indexOf(this.tabType);
	}

	constructor(tabType: SettingsTab, parentSettings: UISettings, rerender?: boolean) {
		this.tabType = tabType;
		this.parentSettings = parentSettings;

		if (rerender) {
			this.tab = $(`.mtd-settings-tab[data-action="${tabType}"]`);
			this.subpanel = $(`.mtd-settings-subpanel#${tabType}`);
		} else {
			this.tab = make("div").addClass("mtd-settings-tab");
			this.subpanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id", tabType);
			this.constructTab();
			this.parentSettings.container.append(this.subpanel);
		}

        this.tabBuildout();
	}

	constructTab(): JQuery {

		this.tab = make("button")
			.addClass("mtd-settings-tab")
			.attr("data-action", this.tabType)
			.html(UISettings.i18nString(settingsData[this.tabType as SettingsTab].tabName)).click(() => {
				$(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected").attr("aria-selected","false");
				$(this).addClass("mtd-settings-tab-selected");
				$(this).attr("aria-selected","true");

				/*
					calculates how far to move over the settings menu
					good thing arrays start at 0, as 0 would be 0px, it's the first one
				*/

				this.parentSettings.container.data("page-selected", $(this.tab).attr("data-action"));
				this.parentSettings.tabSelection.css("top",(this.index*50)+"px");
				this.parentSettings.container.css("margin-top","-"+(this.index*545)+"px");
			});

		this.parentSettings.tabsElement.append(this.tab);

		return this.tab;
	}

	tabBuildout() {
		this.subpanel.empty();

		let settingTab = settingsData[this.tabType];

		if (settingTab.enum) {
			try {
				console.log(`Processing enum settings pane for ${this.tabType}`);

				switch(settingTab.enum) {
					case ModernDeckSettingsEnumPage.ABOUT:
						new AboutEnumPage(this.subpanel);
						break;
					case ModernDeckSettingsEnumPage.MUTES:
						new MuteEnumPage(this.subpanel);
						break;
					default:
						throw "Unknown Settings tab enum";
				}
			} catch(error: unknown) {

			}
			return;
		}

		for (let optionKey in settingTab.options) {

			let settingsOption: ModernDeckSettingsOption = settingTab.options[optionKey];
			let option = make("div").addClass("mtd-settings-option").addClass(`mtd-settings-option-${String(settingsOption.type)}`);
			
			if (typeof (settingsOption.headerBefore) === "string") {
				this.subpanel.append(
					make("h3").addClass("mtd-settings-panel-subheader").html(UISettings.i18nString(settingsOption.headerBefore))
				);
			}

			if (settingsOption.enabled === false) {
				continue;
			} else if (typeof settingsOption.enabled === "function") {
				try {
					if (!settingsOption.enabled()) {
						continue;
					}
				} catch(error: unknown) {
					console.error("Caught error while processing enabled on settingsOption", error);
				}
			}

			switch(settingsOption.type) {
				case ModernDeckSettingsType.CHECKBOX:
					new SettingsCheckbox(settingsOption, option);
					break;
				case ModernDeckSettingsType.DROPDOWN:
					new SettingsDropdown(settingsOption, option);
					break;
				case ModernDeckSettingsType.TEXTAREA:
					new SettingsTextarea(settingsOption, option);
					break;
				case ModernDeckSettingsType.TEXTBOX:
					new SettingsTextbox(settingsOption, option);
					break;
				case ModernDeckSettingsType.SLIDER:
					new SettingsSlider(settingsOption, option);
					break;
				case ModernDeckSettingsType.BUTTON:
					new SettingsButton(settingsOption, option);
					break;
				case ModernDeckSettingsType.BUTTONGROUP:
					new SettingsButtonGroup(settingsOption, option);
					break;
				case ModernDeckSettingsType.LINK:
					new SettingsLink(settingsOption, option);
					break;
				case ModernDeckSettingsType.SUBTEXT:
					new SettingsSubtext(settingsOption, option);
					break;
			}

			this.subpanel.append(option);
		}
	}
}

