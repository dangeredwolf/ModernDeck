/*
	SettingsData/System.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { purgePrefs } from "./StoragePreferences.js";
import { isApp } from "./Utils.js";

export default {
    tabName:"<i class='material-icon' aria-hidden='true'>storage</i> {{System}}",
    options:{
        mtdResetSettings:{
            title:"{{Reset settings}}",
            label:"<i class=\"icon material-icon mtd-icon-very-large\">restore</i><b>{{Reset settings}}</b><br>{{If you want to reset ModernDeck to default settings, you can do so here. This will restart ModernDeck.}}",
            type:"button",
            activate:{
                func: () => {
                    purgePrefs();

                    if (isApp) {
                        const { ipcRenderer } = require("electron");
                        ipcRenderer.send('restartApp');
                    } else {
                        window.location.reload();
                    }
                }
            },
            settingsKey:"mtd_resetSettings"
        },
        mtdClearData:{
            title:"{{Clear data}}",
            label:"<i class=\"icon material-icon mtd-icon-very-large\">delete_forever</i><b>{{Clear data}}</b><br>{{This option clears all caches and preferences. This option will log you out and restart ModernDeck.}}",
            type:"button",
            activate:{
                func: () => {
                    if (isApp) {
                        const { ipcRenderer } = require("electron");

                        ipcRenderer.send('destroyEverything');
                    }
                }
            },
            settingsKey:"mtd_resetSettings",
            enabled:() => isApp
        },
        mtdSaveBackup:{
            title:"{{Save backup}}",
            label:"<i class=\"icon material-icon mtd-icon-very-large\">save_alt</i><b>{{Save backup}}</b><br>{{Saves your preferences to a file to be loaded later.}}",
            type:"button",
            activate:{
                func: () => {
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("saveSettings", JSON.stringify(store.store));
                }
            },
            settingsKey:"mtd_backupSettings",
            enabled:() => isApp
        },
        mtdLoadBackup:{
            title:"{{Load backup}}",
            label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>{{Load backup}}</b><br>{{Loads your preferences that you have saved previously. This will restart ModernDeck.}}",
            type:"button",
            activate:{
                func: () => {
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("loadSettingsDialog");
                }
            },
            settingsKey:"mtd_loadSettings",
            enabled:() => isApp
        },
        mtdTweetenImport:{
            title:"{{Import Tweeten settings}}",
            label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>{{Import Tweeten settings}}</b><br>{{Imports your Tweeten settings to ModernDeck. This will restart ModernDeck.}}",
            type:"button",
            activate:{
                func: () => {
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("tweetenImportDialog");
                }
            },
            settingsKey:"mtd_tweetenImportSettings",
            enabled:() => isApp
        }
    }
}