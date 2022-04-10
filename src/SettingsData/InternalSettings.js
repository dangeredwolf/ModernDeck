/*
	SettingsData/InternalSettings.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref } from "./../StoragePreferences";
import { getColumnFromColumnNumber } from "./../Column";

export default {
    enabled: false,
    options: {
        collapsedColumns:{
            type:"array",
            activate:{
                func: (e) => {
                    if (!e) {
                        return;
                    }
                    e.forEach((a, i) => {
                        getColumnFromColumnNumber(a).addClass("mtd-collapsed")
                    });
                    setTimeout(() => {
                        $(document).trigger("uiMTDColumnCollapsed");
                    },300);
                }
            },
            settingsKey:"mtd_collapsed_columns",
            default:[]
        },
        lastVersion:{
            type:"textbox",
            activate:{
                func: (e) => {
                    if (window.ModernDeck.versionString !== getPref("mtd_last_version")) {
                        // todo: something
                    }
                }
            },
            settingsKey:"mtd_last_version",
            default:() => window.ModernDeck.versionString
        },
        replaceFavicon:{
            type:"checkbox",
            activate:{
                func: () => {
                    $("link[rel=\"shortcut icon\"]").attr("href",mtdBaseURL + "assets/img/favicon.ico");
                }
            },
            settingsKey:"mtd_replace_favicon",
            savePreference:false,
            default:true
        }
    }
}