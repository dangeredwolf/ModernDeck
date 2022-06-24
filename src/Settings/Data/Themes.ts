/*
	Settings/Data/Themes.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "../../StylesheetExtensions";
import { getPref, setPref } from "../../StoragePreferences";
import { ctrlShiftText } from "../../Utils";

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";
import { SettingsTab } from "../SettingsData";
import { SettingsKey } from "../SettingsKey";

let tab: ModernDeckSettingsTab = {
	tabName:"<i class='material-icon' aria-hidden='true'>format_paint</i> {{Themes}}",
	options:{
		theme:{
			headerBefore:"{{Themes}}",
			title:"{{Theme}}",
			type:ModernDeckSettingsType.DROPDOWN,
			activate:{
				func: (opt: string): void => {
					if (window.useSafeMode) {
						return;
					}

					// Migration for ModernDeck pre-Oasis (8.0.x or before)
					if (opt === "default") {
						opt = TD.settings.getTheme();
					}

					setTimeout(() => window.renderTab(SettingsTab.THEMES));

					if (getPref(SettingsKey.HIGH_CONTRAST) === true) {
						disableStylesheetExtension("light");
						disableStylesheetExtension("darker");
						disableStylesheetExtension("discorddark");
						disableStylesheetExtension("twitterdark");
						disableStylesheetExtension("paper");
						enableStylesheetExtension("dark");
						enableStylesheetExtension("amoled");
						enableStylesheetExtension("highcontrast");
						return;
					}

					switch (opt) {
						case "light":
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("twitterdark");
							disableStylesheetExtension("dark");
							disableStylesheetExtension("paper");
							enableStylesheetExtension("light");
							window.html.addClass("mtd-light").removeClass("mtd-dark");
							break;
						case "paper":
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("twitterdark");
							disableStylesheetExtension("dark");
							enableStylesheetExtension("light");
							enableStylesheetExtension("paper");
							window.html.addClass("mtd-light").removeClass("mtd-dark");
							break;
						case "dark":
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("twitterdark");
							disableStylesheetExtension("light");
							disableStylesheetExtension("paper");
							enableStylesheetExtension("dark");
							window.html.addClass("mtd-dark").removeClass("mtd-light");
							break;
						case "darker":
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("light");
							disableStylesheetExtension("paper");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("twitterdark");
							enableStylesheetExtension("dark");
							enableStylesheetExtension("darker");
							window.html.addClass("mtd-dark").removeClass("mtd-light");
							break;
						case "discorddark":
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("light");
							disableStylesheetExtension("paper");
							disableStylesheetExtension("twitterdark");
							enableStylesheetExtension("dark");
							enableStylesheetExtension("darker");
							enableStylesheetExtension("discorddark");
							window.html.addClass("mtd-dark").removeClass("mtd-light");
							break;
						case "twitterdark":
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("light");
							disableStylesheetExtension("paper");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							enableStylesheetExtension("dark");
							enableStylesheetExtension("twitterdark");
							window.html.addClass("mtd-dark").removeClass("mtd-light");
							break;
						case "amoled":
							disableStylesheetExtension("light");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("twitterdark");
							disableStylesheetExtension("paper");
							enableStylesheetExtension("dark");
							enableStylesheetExtension("amoled");
							window.html.addClass("mtd-dark").removeClass("mtd-light");

							/* Dirty hack to fix amoled theme being reset by the high contrast setting later on upon loading */
							setTimeout(() => enableStylesheetExtension("amoled"), 0);
							
							break;
						case "custom":
							disableStylesheetExtension("light");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("twitterdark");
							disableStylesheetExtension("paper");
							disableStylesheetExtension("dark");
							disableStylesheetExtension("amoled");
							disableStylesheetExtension("highcontrast");
							break;

					}
				}
			},
			options:{
				lightThemes:{
					name:"{{Light Themes}}",
					children:{
						light:{value:"light",text:"{{Light}}"},
						paper:{value:"paper",text:"{{Paperwhite}}"}
					}
				},
				darkThemes:{
					name:"{{Dark Themes}}",
					children:{
						darker:{value:"darker",text:"{{Dark}}"},
						// discorddark:{value:"discorddark",text:"{{Discord Dark}}"},
						twitterdark:{value:"twitterdark",text:"{{Twitter Dark}}"},
						dark:{value:"dark",text:"{{Material Dark}}"},
						amoled:{value:"amoled",text:"{{AMOLED}}"},
					}
				},
				// custom:{value:"custom",text:"{{Custom...}}"}
			},
			settingsKey:SettingsKey.THEME,
			default:"darker"
		},
		themeColor:{
			title:"{{Theme Color}}",
			type: ModernDeckSettingsType.DROPDOWN,
			activate:{
				func: (opt: string) => {

					if (window.useSafeMode) {
						return;
					}

					for (let i in window.settingsData.themes.options.themeColor.options) {
						if (opt !== i)
							disableStylesheetExtension(i);
					}

					enableStylesheetExtension(opt);
				}
			},
			options:{
				default:{value:"default",text:"{{Default}}"},
				black:{value:"black",text:"{{Black}}"},
				grey:{value:"grey",text:"{{Grey}}"},
				red:{value:"red",text:"{{Red}}"},
				orange:{value:"orange",text:"{{Orange}}"},
				yellow:{value:"yellow",text:"{{Yellow}}"},
				green:{value:"green",text:"{{Green}}"},
				teal:{value:"teal",text:"{{Teal}}"},
				cyan:{value:"cyan",text:"{{Cyan}}"},
				blue:{value:"blue",text:"{{Blue}}"},
				violet:{value:"violet",text:"{{Violet}}"},
				pink:{value:"pink",text:"{{Pink}}"}
			},
			enabled:() => (getPref(SettingsKey.THEME) !== "custom"),
			settingsKey:SettingsKey.THEME_COLOR,
			default:"default"
		}, selectedFont:{
			title:"{{Preferred Font}}",
			type: ModernDeckSettingsType.DROPDOWN,
			options:{
				Roboto:{value:"Roboto",text:"Roboto"},
				RobotoCondensed:{value:"RobotoCondensed",text:"Roboto Condensed"},
				RobotoSlab:{value:"RobotoSlab",text:"Roboto Slab"},
				"Noto Sans CJK":{value:"Noto Sans CJK",text:"Noto Sans"},
				OpenSans:{value:"OpenSans",text:"Open Sans"},
				Lato:{value:"Lato",text:"Lato"},
				Jost:{value:"Jost",text:"Jost"},
				Inter:{value:"Inter",text:"Inter"},
				SystemUI:{value:"SystemUI", text:"{{System UI}}"}
			},
			activate:{
				func: (opt: string): void => {
					window.html.removeClass("mtd-linux-system-font");

					if (opt === "RobotoMono") {
						setPref(SettingsKey.SELECTED_FONT, "Roboto")
						opt = "Roboto";
					}

					if (opt === "SystemUI") {
						if (navigator.userAgent.match("Windows NT")) {
							enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:Segoe UI,Tahoma,sans-serif!important}");
						} else if (navigator.userAgent.match("Mac OS X")) {
							enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:San Francisco,Helvetica Neue,Lucida Grande!important}");
						} else {
							disableStylesheetExtension("selectedFont");
							window.html.addClass("mtd-linux-system-font");
						}
					} else {
						enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:"+ opt +"!important}");
					}
				}
			},
			settingsKey:SettingsKey.SELECTED_FONT,
			default:"Roboto"
		}, customCss:{
			title:"{{Custom CSS (}}" + ctrlShiftText + "{{C disables it in case something went wrong)}}",
			type: ModernDeckSettingsType.TEXTAREA,
			placeholder:":root {\n"+
			"	--retweetColor:red;\n"+
			"	--primaryColor:#00ff00!important;\n"+
			"	--defaultFontOrder:Comic Sans MS;\n"+
			"}\n\n"+
			"a:hover {\n"+
			"	text-decoration:underline\n"+
			"}",
			activate:{
				func: (opt: string): void => {
					enableCustomStylesheetExtension("customcss",opt);
				}
			},
			settingsKey:SettingsKey.CUSTOM_CSS,
			enabled:(): boolean => window.desktopConfig === undefined ? true : !window.desktopConfig.disableCustomCSS,
			default:""
		}
	}
}

export default tab;