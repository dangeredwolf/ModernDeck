import { getPref } from "../StoragePreferences";
import { ModernDeckSettingsOption } from "../Types/ModernDeckSettings";
import { make } from "../Utils";
import { settingsData, SettingsTab } from "./SettingsData";
import { SettingsCheckbox } from "./UI/Components/Checkbox";
import { UISettings } from "./UISettings";

export class UISettingsTab {
	tab: JQuery;
	subpanel: JQuery;
	tabType: SettingsTab;
	parentSettings: UISettings;

	get index(): number {
		return Object.keys(settingsData).indexOf(this.tabType);
	}

	constructor(tabType: SettingsTab, parentSettings: UISettings) {
		this.tab = make("div").addClass("mtd-settings-tab");
		this.subpanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id", String(tabType));
		this.tabType = tabType;
		this.parentSettings = parentSettings;

		this.constructTab();
        this.tabBuildout();
		this.parentSettings.container.append(this.subpanel);
	}

	constructTab(): JQuery {

		this.tab = make("button").addClass("mtd-settings-tab").attr("data-action", this.tabType).html(UISettings.internationalizeSettingString(settingsData[this.tabType as SettingsTab].tabName)).click(() => {
			$(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected").attr("aria-selected","false");
			$(this).addClass("mtd-settings-tab-selected");
			$(this).attr("aria-selected","true");

			/*
				calculates how far to move over the settings menu
				good thing arrays start at 0, as 0 would be 0px, it's the first one
			*/

			this.parentSettings.container.attr("data-page-selected", $(this).attr("data-action"));
			this.parentSettings.tabSelection.css("top",(this.index*50)+"px");
			this.parentSettings.container.css("margin-top","-"+(this.index*545)+"px");
		});

		this.parentSettings.tabsElement.append(this.tab);

		return this.tab;
	}

	static getFallbackForType(type: string): any {
		switch(type) {
			case "string":
				return "";
			case "boolean":
				return false;
			case "number":
				return 0;
			case "object":
				return {};
			case "undefined":
				return undefined;
			default:
				return null;
		}
	}

	static getInitialSetting(setting: ModernDeckSettingsOption): any {
		let result = null;
		
		if (setting?.settingsKey && typeof setting.queryFunction === "undefined") {
			let storedPref = getPref(setting?.settingsKey);

			switch(typeof storedPref) {
				case "boolean":
				case "string":
				case "number":
					result = storedPref;
			}
		} else {
			if (setting?.queryFunction) {
				try {
					result = setting.queryFunction();
				} catch(e) {
					console.error("Failed to execute queryFunction");
					console.error(e);
					result = setting.default || null;
				}
	
			}
		}

		return result;
	}

	tabBuildout() {
		this.subpanel.empty();

		for (let optionKey in settingsData[this.tabType].options) {

			let settingsOption: ModernDeckSettingsOption = settingsData[this.tabType].options[optionKey];
			let option = make("div").addClass("mtd-settings-option").addClass(`mtd-settings-option-${String(settingsOption.type)}`);
			
			switch(settingsOption.type) {
				case "checkbox":
					new SettingsCheckbox(settingsOption, option);
					break;
			}

			this.subpanel.append(option);
		}
	}
}