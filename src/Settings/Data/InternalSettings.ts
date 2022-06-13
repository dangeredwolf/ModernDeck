/*
	Settings/Data/InternalSettings.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref } from "../../StoragePreferences";
import { getColumnFromColumnNumber } from "../../Column";

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";
import { SettingsKey } from "../SettingsKey";

let tab: ModernDeckSettingsTab = {
    enabled: false,
    tabName: "InternalSettings",
    options: {
        collapsedColumns: {
            type: ModernDeckSettingsType.ARRAY,
            title: "collapsedColumns",
            activate: {
                func: (column: number[]) => {
                    if (!column) {
                        return;
                    }
                    column.forEach((columnNumber: number) => {
                        getColumnFromColumnNumber(columnNumber).addClass("mtd-collapsed")
                    });
                    setTimeout(() => {
                        $(document).trigger("uiMTDColumnCollapsed");
                    },300);
                }
            },
            settingsKey:SettingsKey.COLLAPSED_COLUMNS,
            default:[]
        },
        lastVersion: {
            type: ModernDeckSettingsType.TEXTBOX,
            title: "lastVersion",
            activate: {
                func: () => {
                    if (window.ModernDeck.versionString !== getPref(SettingsKey.LAST_VERSION)) {
                        // todo: something
                    }
                }
            },
            settingsKey:SettingsKey.LAST_VERSION,
            default:() => window.ModernDeck.versionString
        },
        replaceFavicon: {
            type: ModernDeckSettingsType.CHECKBOX,
            title: "replaceFavicon",
            activate: {
                func: () => {
                    $(`link[rel="shortcut icon"]`).attr("href", `${window.mtdBaseURL}assets/img/favicon.ico`);
                }
            },
            settingsKey:SettingsKey.REPLACE_FAVICON,
            savePreference:false,
            default:true
        }
    }
}

export default tab;