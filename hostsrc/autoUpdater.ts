const { autoUpdater } = require("electron-updater");

export const init = () => {
    autoUpdater.setFeedURL({
        "owner": "dangeredwolf",
        "repo": "ModernDeck",
        "provider": "github"
    });

    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = "info";
    
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

            if (!mainWindow) {
                return;
            }
        } catch(e) {
            console.error(e);
        }
    }, 5000);
}