import { SettingsKeys } from "../Settings/SettingsKeys";
import { ProxyMode } from "../Settings/Types/Proxy";
import { HostManager } from "./hostManager";
import { store } from "./store"

export const updateProxy = () => {
    const proxyMode = store.get(SettingsKeys.PROXY_MODE, ProxyMode.AUTODETECT);

    console.log(`Switching proxy to ${proxyMode}...`);

    switch(proxyMode) {
        case ProxyMode.AUTODETECT:
            HostManager.mainWindow?.webContents?.session?.setProxy?.({
                mode: "auto_detect"
            });
            break;
        case ProxyMode.DIRECT:
            HostManager.mainWindow?.webContents?.session?.setProxy?.({
                mode: "direct"
            });
            break;
        case ProxyMode.PAC:
            HostManager.mainWindow?.webContents?.session?.setProxy?.({
                mode: "pac_script",
                pacScript: store.get(SettingsKeys.PROXY_PAC_SCRIPT)
            });
            break;
        case ProxyMode.MANUAL:
            const servers = `${store.get(SettingsKeys.PROXY_SERVERS, "").split("\n").join(",").split(" ").join(",").split(";").join(",")},direct://`.replace(/ /g, "");
            console.log(`Interpreted proxy servers as ${servers}`);
            HostManager.mainWindow?.webContents?.session?.setProxy?.({
                mode: "fixed_servers",
                proxyRules: servers
            });
            break;
    }
    
}