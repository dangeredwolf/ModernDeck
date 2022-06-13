/*
	Settings/Data/Appearance.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/


import { enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "../../StylesheetExtensions";
import { getPref, setPref } from "../../StoragePreferences";

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";

import { TweetDeckObject } from "../../Types/TweetDeck";
import { SettingsTab } from "../SettingsData";
import { SettingsKey } from "../SettingsKey";
declare let TD: TweetDeckObject;

let tab: ModernDeckSettingsTab = {
	tabName:"<i class='material-icon' aria-hidden='true'>rounded_corner</i> {{Appearance}}",
	options:{
		 navigationStyle:{
			headerBefore:"{{Navigation}}",
			title:"{{Navigation Style}}",
			type: ModernDeckSettingsType.DROPDOWN,
			activate:{
				func: (opt: string) => {
					if (opt === "simplified") {
						window.html.addClass("mtd-head-left");
						window.html.removeClass("mtd-classic-nav");
					} else if (opt === "classic") {
						window.html.addClass("mtd-head-left");
						window.html.addClass("mtd-classic-nav");
					}
					setPref(SettingsKey.NAVIGATION_STYLE,opt)
				}
			},
			options:{
				simplified:{value:"simplified",text:"{{Simplified}}"},
				classic:{value:"classic",text:"{{Classic (TweetDeck)}}"},
			},
			settingsKey:SettingsKey.NAVIGATION_STYLE,
			default:"left"
		},
		fixedArrows:{
			title:"{{Use fixed-location media arrows for tweets with multiple photos}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				enableStylesheet:"fixedarrows"
			},
			deactivate:{
				disableStylesheet:"fixedarrows"
			},
			settingsKey:SettingsKey.FIXED_ARROWS,
			default:true
		},
		enableNewTweetsButton:{
			title:"{{Enable \"New Tweets\" indicator}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				disableStylesheet:"nonewtweetsbutton"
			},
			deactivate:{
				enableStylesheet:"nonewtweetsbutton"
			},
			settingsKey:SettingsKey.ENABLE_NEW_TWEETS_BUTTON,
			default:true
		},
		enableEmojiPicker:{
			title:"{{Enable Emoji picker}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				htmlRemoveClass:"mtd-no-emoji-picker"
			},
			deactivate:{
				htmlAddClass:"mtd-no-emoji-picker"
			},
			settingsKey:SettingsKey.ENABLE_EMOJI_PICKER,
			enabled:false,
			default:true
		},
		modalKeepOpen:{
			title:"{{Keep modals open to like/follow from multiple accounts}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{},
			deactivate:{},
			settingsKey:SettingsKey.KEEP_MODALS_OPEN,
			default:true
		},
		sensitiveMedia:{
			headerBefore:"{{Display}}",
			title:"{{Display media that may contain sensitive content}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				func: (): void => {
					TD.settings.setDisplaySensitiveMedia(true);
					setTimeout(() => window.renderTab(SettingsTab.APPEARANCE));
				}
			},
			deactivate:{
				func: (): void => {
					TD.settings.setDisplaySensitiveMedia(false);
					setTimeout(() => window.renderTab(SettingsTab.APPEARANCE));
				}
			},
			savePreference:false,
			queryFunction: (): boolean => {
				return TD.settings.getDisplaySensitiveMedia();
			}
		},
		blurMessages:{
			title:"{{Blur direct message contents unless hovered over}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				enableStylesheet:"hideMessages"
			},
			deactivate:{
				disableStylesheet:"hideMessages"
			},
			settingsKey:SettingsKey.BLUR_MESSAGES,
			default:false
		},
		threadIndicator:{
			title:`{{Display "Thread" on Tweets that are part of a thread}}`,
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				enableStylesheet:"threadIndicator"
			},
			deactivate:{
				disableStylesheet:"threadIndicator"
			},
			settingsKey:SettingsKey.THREAD_INDICATOR,
			default:false
		},
		altSensitiveMedia:{
			title:"{{Use alternative sensitive media workflow}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				enableStylesheet:"altsensitive",
				htmlAddClass:"mtd-altsensitive"
			},
			deactivate:{
				disableStylesheet:"altsensitive",
				htmlRemoveClass:"mtd-altsensitive"
			},
			enabled:() => !TD.settings.getDisplaySensitiveMedia(),
			settingsKey:SettingsKey.ALT_SENSITIVE,
			default:true
		},
		scrollbarStyle:{
			title:"{{Scrollbar Style}}",
			type: ModernDeckSettingsType.DROPDOWN,
			activate:{
				func: (opt: string): void => {
					disableStylesheetExtension("scrollbarsnarrow");
					disableStylesheetExtension("scrollbarsnone");
					enableStylesheetExtension(opt || "scrollbarsdefault");
				}
			},
			options:{
				scrollbarsdefault:{value:"scrollbarsdefault",text:"{{Original}}"},
				scrollbarsnarrow:{value:"scrollbarsnarrow",text:"{{Narrow}}"},
				scrollbarsnone:{value:"scrollbarsnone",text:"{{Hidden}}"}
			},
			settingsKey:SettingsKey.SCROLLBAR_STYLE,
			default:"scrollbarsnarrow"
		},
		columnWidth:{
			title:"{{Column width}}",
			type:ModernDeckSettingsType.SLIDER,
			activate:{
				func: (opt: number): void => {
					enableCustomStylesheetExtension("columnwidth",`:root{--columnSize:${opt}px!important}`);
				}
			},
			minimum:275,
			maximum:500,
			settingsKey:SettingsKey.COLUMN_WIDTH,
			displayUnit:"px",
			default:325
		},
		fontSize:{
			title:"{{Font size}}",
			type:ModernDeckSettingsType.SLIDER,
			activate:{
				func: (opt: number): void => {
					enableCustomStylesheetExtension("fontsize",`html{font-size:${(opt/100)*16}px!important}`);
				}
			},
			minimum:75,
			maximum:130,
			settingsKey:SettingsKey.FONT_SIZE,
			displayUnit:"{{%}}",
			default:100
		},
		avatarSize:{
			title:"{{Profile picture size}}",
			type:ModernDeckSettingsType.SLIDER,
			activate:{
				func: (opt: number): void => {
					enableCustomStylesheetExtension("avatarsize",`:root{--avatarSize:${opt}px!important}`);
				}
			},
			minimum:24,
			maximum:64,
			settingsKey:SettingsKey.AVATAR_SIZE,
			displayUnit:"px",
			enabled: () => getPref(SettingsKey.DISABLE_AVATARS, false) === false,
			default:48
		},
		roundAvatars:{
			title:"{{Use round profile pictures}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				disableStylesheet:"squareavatars"
			},
			deactivate:{
				enableStylesheet:"squareavatars"
			},
			settingsKey:SettingsKey.ROUND_AVATARS,
			enabled: () => getPref(SettingsKey.DISABLE_AVATARS, false) === false,
			default:true
		},
		disableAvatars:{
			title:"{{Hide profile pictures}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				enableStylesheet:"hideavatars",
				func: (): void => {
					setTimeout(() => window.renderTab(SettingsTab.APPEARANCE));
				}
			},
			deactivate:{
				disableStylesheet:"hideavatars",
				func: (): void => {
					setTimeout(() => window.renderTab(SettingsTab.APPEARANCE));
				}
			},
			settingsKey:SettingsKey.DISABLE_AVATARS,
			default:false
		},
		newCharIndicator:{
			title:"{{Use new character limit indicator}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				enableStylesheet:"newcharacterindicator"
			},
			deactivate:{
				disableStylesheet:"newcharacterindicator"
			},
			settingsKey:SettingsKey.NEW_CHARACTER_INDICATOR,
			default:true
		},
		contextMenuIcons:{
			title:"{{Display contextual icons in menus}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				disableStylesheet:"nocontextmenuicons"
			},
			deactivate:{
				enableStylesheet:"nocontextmenuicons"
			},
			settingsKey:SettingsKey.CONTEXT_MENU_ICONS,
			default:true
		}
	}
}

export default tab;