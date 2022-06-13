/*
	Settings/Data/App.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref, setPref } from "../../StoragePreferences";
import { exists, isApp } from "../../Utils";
import { openLegacySettings } from "../../UISettings";
import { enterSafeMode } from "../../SafeMode";

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";
import { ProxyMode } from "../Types/Proxy";
import { SettingsKeys } from "../SettingsKeys";
import { SettingsTab } from "../SettingsData";

let tab: ModernDeckSettingsTab = {
    tabName: "<i class='icon icon-moderndeck'></i> {{App}}",
    enabled:() : boolean => isApp,
    options: {
        nativeTitlebar: {
            headerBefore: "{{App}}",
            title: "{{Use native OS title bar (restarts ModernDeck)}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                func: () => {
                    if (!exists($(".mtd-settings-panel")[0])) {
                        return;
                    }

                    setPref("mtd_nativetitlebar",true);

                    const { ipcRenderer } = window.require("electron");
                    if (!!ipcRenderer)
                        ipcRenderer.send("setNativeTitlebar", true);
                }
            },
            deactivate: {
                func: () => {
                    if (!exists($(".mtd-settings-panel")[0])) {
                        return;
                    }

                    setPref("mtd_nativetitlebar",false);

                    const { ipcRenderer } = window.require("electron");
                    if (!!ipcRenderer)
                        ipcRenderer.send("setNativeTitlebar", false);
                }
            },
            settingsKey: "mtd_nativetitlebar",
            default: false
        },
        nativeEmoji: {
            title: "{{Use native Emoji Picker}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                func: (_opt: boolean, load: boolean) : void => {
                    if (!load) {
                        $(document).trigger("uiDrawerHideDrawer");
                    }
                    setPref("mtd_nativeEmoji",true);
                }
            },
            deactivate: {
                func: (_opt: boolean, load: boolean) : void => {
                    if (!load) {
                        $(document).trigger("uiDrawerHideDrawer");
                    }
                    setPref("mtd_nativeEmoji",false);
                }
            },
            enabled: false,
            settingsKey: "mtd_nativeEmoji",
            default: false
        },
        nativeContextMenus: {
            title: "{{Use OS native context menus}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                func: () => {
                    window.useNativeContextMenus = true;
                }
            },
            deactivate: {
                func: () => {
                    window.useNativeContextMenus = false;
                }
            },
            settingsKey: "mtd_nativecontextmenus",
            default:() => (isApp ? process.platform === "darwin" : false)
        }, updateChannel: {
            title: "{{App update channel}}",
            type: ModernDeckSettingsType.DROPDOWN,
            activate: {
                func: (opt : string) : void => {
                    if (!isApp) {
                        return;
                    }
                    setPref("mtd_updatechannel", opt);

                    setTimeout(() => {
                        const { ipcRenderer } = window.window.require("electron");
                        if (!!ipcRenderer) {
                            ipcRenderer.send("changeChannel", opt);

                            if (window.desktopConfig.updatePolicy !== "disabled" && window.desktopConfig.updatePolicy !== "manual") {
                                ipcRenderer.send("checkForUpdates");
                            }
                        }
                    },300)
                }
            },
            options: {
                latest: { value: "latest", text: "{{Stable}}" },
                beta: { value: "beta", text: "{{Beta}}" }
            },
            enabled: !document.getElementsByTagName("html")[0].classList.contains("mtd-flatpak") &&!document.getElementsByTagName("html")[0].classList.contains("mtd-winstore") && !document.getElementsByTagName("html")[0].classList.contains("mtd-macappstore"),
            settingsKey: "mtd_updatechannel",
            default: "latest"
        },
        proxyMode: {
            headerBefore: "{{Proxy}}",
            title: "{{Proxy mode}}",
            type: ModernDeckSettingsType.DROPDOWN,
            activate: {
                func: (opt: ProxyMode): void => {
                    setPref(SettingsKeys.PROXY_MODE, opt);

                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer?.send?.("changeProxy");
					setTimeout(() => window.renderTab(SettingsTab.APP));
                }
            },
            options: {
                autodetect: { value: ProxyMode.AUTODETECT, text: "{{Auto-detect}}" },
                direct: { value: ProxyMode.DIRECT, text: "{{No proxy}}" },
                manual: { value: ProxyMode.MANUAL, text: "{{Configure proxy servers}}" },
                pac: { value: ProxyMode.PAC, text: "{{Use PAC script}}" },
            },
            settingsKey: SettingsKeys.PROXY_MODE,
        },
        proxyPACSetting: {
            title: "{{PAC script URL}}",
            type: ModernDeckSettingsType.TEXTBOX,
            activate: {
                func: (opt: string) : void => {
                    setPref(SettingsKeys.PROXY_PAC_SCRIPT, opt);

                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer?.send?.("changeProxy");
                }
            },
            default: "",
            settingsKey: SettingsKeys.PROXY_PAC_SCRIPT,
            enabled: () => getPref(SettingsKeys.PROXY_MODE) === ProxyMode.PAC
        },
        proxyManualServers: {
            title: "{{Proxy servers}}",
            type: ModernDeckSettingsType.TEXTBOX,
			addClass:"mtd-big-text-box",
            activate: {
                func: (opt: string) : void => {
                    setPref(SettingsKeys.PROXY_SERVERS, opt);

                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer?.send?.("changeProxy");
                }
            },
            default: "",
            placeholder: "socks5://example.com:3000;http://example.com:8080",
            settingsKey: SettingsKeys.PROXY_SERVERS,
            enabled: () => getPref(SettingsKeys.PROXY_MODE) === ProxyMode.MANUAL
        },
		proxyManualServerSubtext: {
			label: "{{You can specify one or more proxy servers and they will be used in the order they are in. }}{{If all specified proxies are down, a direct connection will be used instead.}}<br><br>{{HTTP, HTTPS, SOCKS4, and SOCKS5 proxies are supported.}}",
			type:ModernDeckSettingsType.SUBTEXT,
            enabled: () => getPref(SettingsKeys.PROXY_MODE) === ProxyMode.MANUAL
		},
        trayEnabled: {
            headerBefore: "{{Tray}}",
            title: "{{Show ModernDeck in the system tray}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                func: () => {
                    if (typeof window.require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer.send("enableTray");
                }
            },
            deactivate: {
                func: () => {
                    if (typeof window.require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer.send("disableTray");
                }
            },
            settingsKey: "mtd_systemtray",
            default: (typeof process !== "undefined" && process.platform !== "darwin")
        },
        backgroundNotifications: {
            title: "{{Run ModernDeck in the background to deliver notifications}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                func: () => {
                    if (typeof window.require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer.send("enableBackground");
                }
            },
            deactivate: {
                func: () => {
                    if (typeof window.require === "undefined") {
                        return;
                    }
                    const { ipcRenderer } = window.require("electron");
                    ipcRenderer.send("disableBackground");
                }
            },
            settingsKey: "mtd_background",
            default: false
        },
        inspectElement: {
            headerBefore: "{{Developer}}",
            title: "{{Show Inspect Element in context menus}}",
            type: ModernDeckSettingsType.CHECKBOX,
            isDevTool: true,
            activate: {
                func: () => {
                    setPref("mtd_inspectElement",true);
                }
            },
            deactivate: {
                func: () => {
                    setPref("mtd_inspectElement",false);
                }
            },
            settingsKey: "mtd_inspectElement",
            default: false
        },
        mtdSafeMode: {
            title: "{{Safe mode}}",
            label: "{{Safe mode}}",
            type: ModernDeckSettingsType.LINK,
            isDevTool:true,
            activate: {
                func: () => {
                    enterSafeMode();
                }
            },
            enabled:() => isApp
        },
        tdLegacySettings: {
            title: "{{Legacy settings}}",
            label: "{{Legacy settings}}",
            type: ModernDeckSettingsType.LINK,
            isDevTool:true,
            enabled:() : boolean => !window.html.hasClass("signin-sheet-now-present"),
            activate: {
                func: () => {
                    openLegacySettings();
                }
            }
        }
    }
}

export default tab;