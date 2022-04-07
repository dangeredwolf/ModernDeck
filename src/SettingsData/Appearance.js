/*
	SettingsData/Appearance.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/


import { enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "./../StylesheetExtensions.js";
import { setPref } from "./../StoragePreferences.js";

export default {
    tabName:"<i class='material-icon' aria-hidden='true'>rounded_corner</i> {{Appearance}}",
    options:{
         navigationStyle:{
            headerBefore:"{{Navigation}}",
            title:"{{Navigation Style}}",
            type:"dropdown",
            activate:{
                func: (opt) => {
                    if (opt === "simplified") {
                        html.addClass("mtd-head-left");
                        html.removeClass("mtd-classic-nav");
                        $(document).trigger("uiNavbarWidthChangeAction",{navbarWidth:"condensed"})
                    } else if (opt === "classic") {
                        html.addClass("mtd-head-left");
                        html.addClass("mtd-classic-nav");
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
            type:"checkbox",
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
            type:"checkbox",
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
            type:"checkbox",
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
            type:"checkbox",
            activate:{
                func: () => {
                }
            },
            deactivate:{
                func: () => {
                }
            },
            settingsKey:"mtd_modalKeepOpen",
            default:true
        },
        sensitiveMedia:{
            headerBefore:"{{Display}}",
            title:"{{Display media that may contain sensitive content}}",
            type:"checkbox",
            activate:{
                func: () => {
                    TD.settings.setDisplaySensitiveMedia(true);
                    setTimeout(() => window.renderTab("appearance"));
                }
            },
            deactivate:{
                func: () => {
                    TD.settings.setDisplaySensitiveMedia(false);
                    setTimeout(() => window.renderTab("appearance"));
                }
            },
            savePreference:false,
            queryFunction: () => {
                return TD.settings.getDisplaySensitiveMedia();
            }
        },
        blurMessages:{
            title:"{{Blur direct message contents unless hovered over}}",
            type:"checkbox",
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
            type:"checkbox",
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
            type:"checkbox",
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
            type:"dropdown",
            activate:{
                func: (opt) => {
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
            type:"slider",
            activate:{
                func: (opt) => {
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
            type:"slider",
            activate:{
                func: (opt) => {
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
            type:"slider",
            activate:{
                func: (opt) => {
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
            type:"checkbox",
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
            type:"checkbox",
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
            type:"checkbox",
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