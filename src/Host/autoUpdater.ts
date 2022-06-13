// import { log } from 'electron-log';
const { ipcMain } = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
import { SettingsKey } from '../Settings/SettingsKey';
import { desktopConfig} from './main';
import { getWebContents } from './mainWindow';
import { store } from './store';
import { isFlatpak } from './utils';

export const initAutoUpdater = (): typeof autoUpdater => {
    autoUpdater.setFeedURL({
        "owner": "dangeredwolf",
        "repo": "ModernDeck",
        "provider": "github"
    });
    // TODO: Fix autoupdater logging
    // autoUpdater.logger = log;
    // autoUpdater.logger.transports.file.level = "info";
    
    switch(desktopConfig.autoUpdatePolicy) {
        case "disabled":
        case "manual":
        case "checkOnly":
        case "autoDownload":
            if (desktopConfig.autoUpdateInstallOnQuit === false) {
                autoUpdater.autoInstallOnAppQuit = false;
            }
    
            if (desktopConfig.autoUpdatePolicy !== "autoDownload") {
                autoUpdater.autoDownload = false;
            }
    
            break;
    }

    if (desktopConfig.autoUpdatePolicy !== "disabled" && desktopConfig.autoUpdatePolicy !== "manual" && isFlatpak !== false) {
        setInterval(() => {
            try {
                autoUpdater.checkForUpdates();
            } catch(e) {
                console.error(e);
            }
        },1000*60*15); //check for updates once every 15 minutes
    }

    setTimeout(() => {
        try {
            if (desktopConfig.autoUpdatePolicy !== "disabled" &&  desktopConfig.autoUpdatePolicy !== "manual" && isFlatpak !== true) {
                autoUpdater.checkForUpdates();
            }
        } catch(e) {
            console.error(e);
        }
    }, 5000);


    // Tell browser that there was an update error

    autoUpdater.on("error", (event: Event, blah: string, blah2: string) => {
        getWebContents().send("error", event, blah, blah2);
    });

    // Let moderndeck.js know that we are...

    // ... actively checking for updates
    autoUpdater.on("checking-for-update", (event: Event) => {
        getWebContents().send("checking-for-update", event);
    });

    // ...currently downloading updates
    autoUpdater.on("download-progress", (event: Event) => {
        getWebContents().send("download-progress", event);
    });

    // ...have found an update
    autoUpdater.on("update-available", (event: Event) => {
        getWebContents().send("update-available", event);
    });

    // ...have already downloaded updates
    autoUpdater.on("update-downloaded", (event: Event) => {
        getWebContents().send("update-downloaded", event);
    });

    // ...haven't found any updates
    autoUpdater.on("update-not-available", (event: Event) => {
        getWebContents().send("update-not-available", event);
    });

    // moderndeck can send manual update check requests
    ipcMain.on("checkForUpdates", (_event: Event) => {
        console.log("Client requested update check");
        if (autoUpdater && desktopConfig.autoUpdatePolicy !== "disabled" && isFlatpak !== true) {
            autoUpdater.checkForUpdates();
        }
    });

    ipcMain.on("downloadUpdates", (_event: Event) => {
        console.log("Client requested update download");
        if (autoUpdater && desktopConfig?.autoUpdatePolicy !== "disabled") {
            autoUpdater.downloadUpdate();
        }
    });

    // Main -> Beta and vice versa
    ipcMain.on("changeChannel", (_event: Event) => {
        autoUpdater.allowPrerelease = store.get(SettingsKey.UPDATE_CHANNEL) === "beta";
        autoUpdater.channel = store.get(SettingsKey.UPDATE_CHANNEL);
    });


    return autoUpdater;
}