/*
	Settings/UISettings.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "../I18n";
import { ModernDeckSettingsTab } from "../Types/ModernDeckSettings";
import { UIModal } from "../UIModal";
import { make } from "../Utils";
import { settingsData, SettingsTab } from "./SettingsData";
import { UISettingsTab } from "./UISettingsTab";

export class UISettings extends UIModal {
	tabSelection: JQuery;
	container: JQuery;
	panel: JQuery;
	tabsElement: JQuery;
	static Tab = UISettingsTab;
	limitedMenu: boolean = false;
	selectedTab: UISettingsTab;
	tabs: UISettingsTab[] = [];

	static i18nString(str: string): string {
		let matches: RegExpMatchArray = str.match(/{{.+?}}/g) || [];
		matches.forEach((i: string) => {
			let translatedString: string = I18n(i.substring(2, i.length - 2));
			str = str.replace(i, translatedString);
		});
		return str;
	}

	constructor(openMenu?: SettingsTab, limitedMenu?: boolean) {
		super();

		this.element = make("div").addClass("mdl mtd-settings-panel");
		this.tabSelection = make("button").addClass("mtd-settings-tab mtd-settings-tab-selection").css("top","0px");
		this.container = make("div").addClass("mtd-settings-inner");
		this.tabsElement = make("div").addClass("mtd-settings-tab-container mtd-tabs").append(this.tabSelection);
		this.panel = this.element.append(this.tabsElement).append(make("div").addClass("mtd-settings-inner-container").append(this.container));
		
		this.element.append(this.panel);
		
		this.limitedMenu = limitedMenu;

		this.initializeTabs(openMenu);

		// Overwrite this global when a new settings modal is created
		window.renderTab = (tab: SettingsTab) => {
			new UISettingsTab(tab, this, true);
		}

		return this;
	}

	initializeTabs(openMenu?: SettingsTab) {
		Object.keys(settingsData).map((key: SettingsTab): void => {

			const tab: ModernDeckSettingsTab = settingsData[key];

			if (typeof tab.enabled === "function") {
				if (tab.enabled() === false) {
					return;
				}
			} else if (typeof tab.enabled === "boolean") {
				if (tab.enabled === false || tab.visible === false) {
					return;
				}
			}

			if (key === SettingsTab.SYSTEM && typeof window.desktopConfig !== "undefined" && window.desktopConfig.disableSystemTab) {
				return;
			}

			switch(key) {
				case SettingsTab.APPEARANCE:
				case SettingsTab.TWEETS:
				case SettingsTab.MUTES:
					if (this.limitedMenu) {
						return;
					}
					break;
			}

			console.log(`Adding tab ${key}`);

			let tabUI = new UISettingsTab(key, this);

			if (typeof openMenu !== "undefined" && openMenu === key) {
				tabUI.tab.addClass("mtd-settings-tab-selected");
				tabUI.tab.attr("aria-selected","true");
				tabUI.tab.click();
			}

			this.tabs.push();
		});
	}
		
}

// Dummy function just so if anything calls this it doesn't affect anything
window.renderTab = (_tab: SettingsTab) => {}