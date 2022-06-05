import { HostManager } from "./hostManager";
import { I18n } from "./i18n";

const electron = require("electron")
const { Menu } = electron

export const setMenuBar = (): void => {

    const template = [
        {
            label: "ModernDeck",
            role: "appMenu",
            submenu: [
                { label: I18n("About ModernDeck"), click() { if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("aboutMenu"); } },
                { label: I18n("Check for Updates..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("checkForUpdatesMenu"); } },
                { type: "separator" },
                { label: I18n("Preferences..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("openSettings"); } },
                { label: I18n("Accounts..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("accountsMan"); } },
                { type: "separator" },
                { role: "services" },
                { type: "separator" },
                { role: "hide" },
                { role: "hideothers" },
                { role: "unhide" },
                { type: "separator" },
                { role: "quit" }
            ]
        },
        {
            role: "fileMenu",
            submenu: [
                { label: I18n("New Tweet..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("newTweet"); } },
                { label: I18n("New Direct Message..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("newDM"); } },
                { type: "separator" },
                { role: "close" }
            ]
        },
        {
            role: "editMenu",
            submenu: [
                { role: "undo" },
                { role: "redo" },
                { type: "separator" },
                { role: "cut" },
                { role: "copy" },
                { role: "paste" },
                { role: "delete" },
                { role: "selectAll" },
                { type: "separator" },
                {
                    label: I18n("Speech"),
                    submenu: [
                        { role: "startspeaking" },
                        { role: "stopspeaking" }
                    ]
                }
            ]
        },
        {
            role: "viewMenu",
            submenu: [
                { role: "reload" },
                { role: "forcereload" },
                { type: "separator" },
                { role: "resetzoom" },
                { role: "zoomin" },
                { role: "zoomout" },
                { role: "toggledevtools" },
                { type: "separator" },
                { role: "togglefullscreen" }
            ]
        },
        {
            role: "windowMenu",
            submenu: [
                { role: "minimize" },
                { role: "zoom" },
                { type: "separator" },
                { role: "front" },
                { type: "separator" },
                { role: "window" }
            ]
        },
        {
            role: "help",
            submenu: [
                { label: I18n("Send Feedback"), click(){ electron.shell.openExternal("https://github.com/dangeredwolf/ModernDeck/issues");}},
                { label: I18n("Message @ModernDeck"), click(){ if (!HostManager.mainWindow){electron.shell.openExternal("https://twitter.com/messages/compose?recipient_id=2927859037");return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("msgModernDeck"); } },
            ]
        }
    ]
    
    
    const menu = Menu.buildFromTemplate(template as Electron.MenuItemConstructorOptions[]);
    
    // if (process.platform === "darwin")
    Menu.setApplicationMenu(menu);
}