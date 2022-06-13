/*
	StylesheetExtensions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { parseActions } from "./Settings/SettingsInit";
import { SettingsKey } from "./Settings/SettingsKey";
import { dumpPreferences, findSettingForKey, getPref, setPref } from "./StoragePreferences";

export class SyncController {
    static syncKey: string  = "moderndeck sync storage key";

    static initialize(): void {
        setTimeout(this.updateSync, 5000);
        setInterval(this.updateSync, 10000);
    }

    static getRemoteSettings(): any {
        const filters = TD.controller.filterManager.getAll();
        let settings = null;
        for (let filter in filters) {
            if (filters[filter].value === this.syncKey) {
                try {
                    settings = JSON.parse(filters[filter].type);
                } catch (e: unknown) {
                    console.error("ModernDeck Sync Parse Error:", e);
                }
            }
        }
        return settings;
    }

    static setRemoteSettings(settings: any): void {
        const filters = TD.controller.filterManager.getAll();

        for (let filter in filters) {
            if (filters[filter].value === this.syncKey) {
                 TD.controller.filterManager.removeFilter(filters[filter]);
            }
        }

        TD.controller.filterManager.addFilter(
            JSON.stringify(settings),
            this.syncKey,
            false
        );
    }

    static dumpPrefs(): any {
        let prefs: any = dumpPreferences();
        return prefs;
    }

    static updateRemoteSettings(): void {
        // const time = new Date().getTime();
        // setPref(SettingsKey.SYNC_LAST_UPDATED, time);

        let prefs = this.dumpPrefs();
        prefs[SettingsKey.SYNC_LAST_UPDATED] = getPref(SettingsKey.SYNC_LAST_UPDATED);//time;
        
        this.setRemoteSettings(prefs);
    }

    static updateLocalSettings(): void {
        const remoteSettings = SyncController.getRemoteSettings();
        console.log("Checking for differences between local and remote settings...");
        
        setPref(SettingsKey.SYNC_LAST_UPDATED, remoteSettings[SettingsKey.SYNC_LAST_UPDATED]); // Just in case...

        for (let key in remoteSettings) {
            if (getPref(key as SettingsKey) !== remoteSettings[key]) {
                console.log(`Local setting ${key} differs from remote. ${getPref(key as SettingsKey)} local ${remoteSettings[key]} remote`);
                setPref(key as SettingsKey, remoteSettings[key]);

                let setting = findSettingForKey(key);

                console.log("Setting seems to be", setting);
                
                if (remoteSettings[key] === false) {
                    parseActions(setting.deactivate, remoteSettings[key]);
                } else {
                    parseActions(setting.activate, remoteSettings[key]);
                }
            }
        }
    }
    
    static forceUpdate(): void {
        console.log("FORCE UPDATE!!!");
        setPref(SettingsKey.SYNC_LAST_UPDATED, new Date().getTime());
        this.updateSync();
    }

    static updateSync(): void {
        console.log("updateSync");
        if (getPref(SettingsKey.SYNC_ENABLED)) {
            let localLastUpdated = getPref(SettingsKey.SYNC_LAST_UPDATED) || 0;
            const remoteSettings = SyncController.getRemoteSettings();

            if (remoteSettings === null || remoteSettings[SettingsKey.SYNC_LAST_UPDATED] < localLastUpdated) {
                console.log(`Local is more up to date (${(remoteSettings || {})[SettingsKey.SYNC_LAST_UPDATED]} remote ${localLastUpdated} local), let's update remote!`);
                SyncController.updateRemoteSettings();
            } else if (typeof localLastUpdated === "undefined" || remoteSettings[SettingsKey.SYNC_LAST_UPDATED] > localLastUpdated) {
                console.log(`Remote is more up to date (${remoteSettings[SettingsKey.SYNC_LAST_UPDATED]} remote ${localLastUpdated} local), let's update local!`);
                SyncController.updateLocalSettings();
            } else if (remoteSettings[SettingsKey.SYNC_LAST_UPDATED] === localLastUpdated) {
                console.log("Sync is up-to-date");
            }
        } 
    }
}