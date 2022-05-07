/*
	Settings/Data/Appearance.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/


import { enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "../../StylesheetExtensions";
import { setPref } from "../../StoragePreferences";

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";

import { TweetDeckObject } from "../../Types/TweetDeck";
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
					setPref("mtd_headposition",opt)
				}
			},
			options:{
				simplified:{value:"simplified",text:"{{Simplified}}"},
				classic:{value:"classic",text:"{{Classic (TweetDeck)}}"},
			},
			settingsKey:"mtd_headposition",
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
			settingsKey:"mtd_usefixedarrows",
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
			settingsKey:"mtd_nonewtweetsbutton",
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
			settingsKey:"mtd_noemojipicker",
			enabled:false,
			default:true
		},
		modalKeepOpen:{
			title:"{{Keep modals open to like/follow from multiple accounts}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{},
			deactivate:{},
			settingsKey:"mtd_modalKeepOpen",
			default:true
		},
		sensitiveMedia:{
			headerBefore:"{{Display}}",
			title:"{{Display media that may contain sensitive content}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				func: (): void => {
					TD.settings.setDisplaySensitiveMedia(true);
					setTimeout(() => window.renderTab("appearance"));
				}
			},
			deactivate:{
				func: (): void => {
					TD.settings.setDisplaySensitiveMedia(false);
					setTimeout(() => window.renderTab("appearance"));
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
			settingsKey:"mtd_hideMessages",
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
			settingsKey:"mtd_threadIndicator",
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
			settingsKey:"mtd_sensitive_alt",
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
			settingsKey:"mtd_scrollbar_style",
			default:"scrollbarsnarrow"
		},
		columnWidth:{
			title:"{{Column width}}",
			type:ModernDeckSettingsType.SLIDER,
			activate:{
				func: (opt: number): void => {
					setPref("mtd_columnwidth",opt);
					enableCustomStylesheetExtension("columnwidth",`:root{--columnSize:${opt}px!important}`);
				}
			},
			minimum:275,
			maximum:500,
			settingsKey:"mtd_columnwidth",
			displayUnit:"px",
			default:325
		},
		fontSize:{
			title:"{{Font size}}",
			type:ModernDeckSettingsType.SLIDER,
			activate:{
				func: (opt: number): void => {
					setPref("mtd_fontsize",opt);
					enableCustomStylesheetExtension("fontsize",`html{font-size:${(opt/100)*16}px!important}`);
				}
			},
			minimum:75,
			maximum:130,
			settingsKey:"mtd_fontsize",
			displayUnit:"{{%}}",
			default:100
		},
		avatarSize:{
			title:"{{Profile picture size}}",
			type:ModernDeckSettingsType.SLIDER,
			activate:{
				func: (opt: number): void => {
					//setPref("mtd_avatarsize",opt);
					enableCustomStylesheetExtension("avatarsize",`:root{--avatarSize:${opt}px!important}`);
				}
			},
			minimum:24,
			maximum:64,
			enabled:true,
			settingsKey:"mtd_avatarsize",
			displayUnit:"px",
			default:48
		},
		roundProfilePics:{
			title:"{{Use round profile pictures}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				disableStylesheet:"squareavatars"
			},
			deactivate:{
				enableStylesheet:"squareavatars"
			},
			settingsKey:"mtd_round_avatars",
			default:true
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
			settingsKey:"mtd_newcharindicator",
			default:true
		},
		disableContextMenuIcons:{
			title:"{{Display contextual icons in menus}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				disableStylesheet:"nocontextmenuicons"
			},
			deactivate:{
				enableStylesheet:"nocontextmenuicons"
			},
			settingsKey:"mtd_nocontextmenuicons",
			default:true
		}
	}
}

export default tab;