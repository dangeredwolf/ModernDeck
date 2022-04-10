/*
	SettingsData/App.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { setPref } from "./../StoragePreferences";
import { exists, isApp } from "./../Utils";
import { openLegacySettings } from "./../UISettings";
import { enterSafeMode } from "./../SafeMode";

export default {
    tabName:"<i class='icon icon-moderndeck'></i> {{App}}",
    enabled:() => isApp,
    options:{
        nativeTitlebar:{
            headerBefore:"{{App}}",
            title:"{{Use native OS title bar (restarts ModernDeck)}}",
            type:"checkbox",
            activate:{
                func: () => {
                    if (!exists($(".mtd-settings-panel")[0])) {
                        return;
                    }

                    setPref("mtd_nativetitlebar",true);

                    const {ipcRenderer, ipcMain} = require("electron");
                    if (!!ipcRenderer)
                        ipcRenderer.send("setNativeTitlebar", true);
                }
            },
            deactivate:{
                func: () => {
                    if (!exists($(".mtd-settings-panel")[0])) {
                        return;
                    }

                    setPref("mtd_nativetitlebar",false);

                    const { ipcRenderer } = require("electron");
                    if (!!ipcRenderer)
                        ipcRenderer.send("setNativeTitlebar", false);
                }
            },
            settingsKey:"mtd_nativetitlebar",
            default:false
        },
        nativeEmoji:{
            title:"{{Use native Emoji Picker}}",
            type:"checkbox",
            activate:{
                func: (opt, load) => {
                    if (!load) {
                        $(document).trigger("uiDrawerHideDrawer");
                    }
                    setPref("mtd_nativeEmoji",true);
                }
            },
            deactivate:{
                func: (opt, load) => {
                    if (!load) {
                        $(document).trigger("uiDrawerHideDrawer");
                    }
                    setPref("mtd_nativeEmoji",false);
                }
            },
            enabled:false,
            settingsKey:"mtd_nativeEmoji",
            default:false
        },
        nativeContextMenus:{
            title:"{{Use OS native context menus}}",
            type:"checkbox",
            activate:{
                func: () => {
                    useNativeContextMenus = true;
                }
            },
            deactivate:{
                func: () => {
                    useNativeContextMenus = false;
                }
            },
            settingsKey:"mtd_nativecontextmenus",
            default:() => (isApp ? process.platform === "darwin" : false)
        }, updateChannel:{
            title:"{{App update channel}}",
            type:"dropdown",
            activate:{
                func: (opt) => {
                    if (!isApp) {
                        return;
                    }
                    setPref("mtd_updatechannel",opt);

                    setTimeout(() => {
                        const { ipcRenderer } = require("electron");
                        if (!!ipcRenderer) {
                            ipcRenderer.send("changeChannel", opt);

                            if (window.desktopConfig.updatePolicy !== "disabled" && window.desktopConfig.updatePolicy !== "manual") {
                                ipcRenderer.send("checkForUpdates");
                            }
                        }
                    },300)
                }
            },
            options:{
                latest:{value:"latest",text:"{{Stable}}"},
                beta:{value:"beta",text:"{{Beta}}"}
            },
            enabled:!document.getElementsByTagName("html")[0].classList.contains("mtd-flatpak") &&!document.getElementsByTagName("html")[0].classList.contains("mtd-winstore") && !document.getElementsByTagName("html")[0].classList.contains("mtd-macappstore"),
            settingsKey:"mtd_updatechannel",
            default:"latest"
        },
        trayEnabled:{
            headerBefore:"{{Tray}}",
            title:"{{Show ModernDeck in the system tray}}",
            type:"checkbox",
            activate:{
                func: () => {
                    if (typeof require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("enableTray");
                }
            },
            deactivate:{
                func: () => {
                    if (typeof require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("disableTray");
                }
            },
            settingsKey:"mtd_systemtray",
            default:(typeof process !== "undefined" && process.platform !== "darwin")
        },
        backgroundNotifications:{
            title:"{{Run ModernDeck in the background to deliver notifications}}",
            type:"checkbox",
            activate:{
                func: () => {
                    if (typeof require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("enableBackground");
                }
            },
            deactivate:{
                func: () => {
                    if (typeof require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = require("electron");
                    ipcRenderer.send("disableBackground");
                }
            },
            settingsKey:"mtd_background",
            default:false
        },
        inspectElement:{
            headerBefore:"{{Developer}}",
            title:"{{Show Inspect Element in context menus}}",
            type:"checkbox",
            isDevTool:true,
            activate:{
                func: () => {
                    setPref("mtd_inspectElement",true);
                }
            },
            deactivate:{
                func: () => {
                    setPref("mtd_inspectElement",false);
                }
            },
            settingsKey:"mtd_inspectElement",
            default:false
        },
        mtdSafeMode: {
            title:"{{Safe mode}}",
            label:"{{Safe mode}}",
            type:"link",
            isDevTool:true,
            activate:{
                func: () => {
                    enterSafeMode();
                }
            },
            enabled:() => isApp
        },
        tdLegacySettings: {
            title:"{{Legacy settings}}",
            label:"{{Legacy settings}}",
            type:"link",
            isDevTool:true,
            enabled:() => !html.hasClass("signin-sheet-now-present"),
            activate:{
                func: () => {
                    openLegacySettings();
                }
            }
        }
    }
}