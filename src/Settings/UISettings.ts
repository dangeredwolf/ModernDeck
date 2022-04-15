import { I18n } from "../I18n";
import { ModernDeckSettingsOption } from "../Types/ModernDeckSettings";
import { UIModal } from "../UIModal";
import { make } from "../Utils";
import { settingsData, SettingsTab } from "./SettingsData";

class UISettingsTab {
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
	}

	constructTab() {
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

	tabBuildout() {
		this.subpanel.empty();

		for (let optionKey in settingsData[this.tabType].options) {

			let settingsOption: ModernDeckSettingsOption = settingsData[this.tabType].options[optionKey];
			let option = make("div").addClass("mtd-settings-option").addClass("mtd-settings-option-" + settingsOption.type);
			option;
		}
	}
}

export class UISettings extends UIModal {
	tabSelection: JQuery;
	container: JQuery;
	panel: JQuery;
	tabsElement: JQuery;
	static Tab = UISettingsTab;
	limitedMenu: boolean = false;
	selectedTab: UISettingsTab;
	tabs: UISettingsTab[] = [];

	static internationalizeSettingString(str: string) {
		let matches: RegExpMatchArray = str.match(/{{.+?}}/g) || [];
		matches.forEach((i: string) => {
			let translatedString: string = I18n(i.substring(2, i.length - 2));
			str = str.replace(i, translatedString);
		});
		return str;
	}

	constructor() {
		super();

		this.element = make("div").addClass("mdl mtd-settings-panel");
		this.tabSelection = make("button").addClass("mtd-settings-tab mtd-settings-tab-selection").css("top","0px");
		this.container = make("div").addClass("mtd-settings-inner");
		this.tabsElement = make("div").addClass("mtd-settings-tab-container mtd-tabs").append(this.tabSelection);
		this.panel = make("div").addClass("mdl mtd-settings-panel").append(this.tabsElement).append(make("div").addClass("mtd-settings-inner-container").append(this.container));
		
		this.element.append(this.panel);

		this.initializeTabs();

		return this;
	}

	initializeTabs() {
		Object.keys(settingsData).map((key: SettingsTab): void => {

			const tab = settingsData[key];

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
				case SettingsTab.THEMES:
				case SettingsTab.APPEARANCE:
				case SettingsTab.TWEETS:
				case SettingsTab.MUTES:
					if (this.limitedMenu) {
						return;
					}
					break;
			}

			console.log(`Adding tab ${key}`);

			this.tabs.push(new UISettingsTab(key, this));
		});
	}
		
}

window.settingsUIRefactorTest = UISettings;