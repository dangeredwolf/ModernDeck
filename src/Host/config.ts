const { app, dialog, globalShortcut } = require("electron");
const fs = require("fs");

export type DesktopConfig = {
    autoUpdatePolicy?: "disabled" | "manual" | "checkOnly" | "autoDownload";
    autoUpdateInstallOnQuit?: boolean;
    customLoginImage?: string;
    disableZoom?: boolean;
    disableDevTools?: boolean;
}

export const tryConfig = (): DesktopConfig => {
    if (process.platform === "win32") {
        try {
            let configFile = fs.readFileSync("C:\\ProgramData\\ModernDeck\\config.json");
    
            try {
                return JSON.parse(String(configFile)) as DesktopConfig;
            } catch(e) {
                app.on("ready", () => {
                    dialog.showMessageBoxSync({
                        type:"error",
                        title:"ModernDeck",
                        message:"ModernDeck detected a device config file, but an error occurred while reading it. Please ensure the JSON is free from any errors.\n\n" + e
                    });
                })

                return {} as DesktopConfig;
            }
        } catch (e) {
            // console.error("Could not read device config file");
            // console.error(e);
        }
    }
    return {} as DesktopConfig;
}

export const loadDesktopConfigMain = (desktopConfig: any) => {
	if (desktopConfig.disableDevTools) {
		// https://stackoverflow.com/questions/40304833/how-to-make-the-dev-tools-not-show-up-on-screen-by-default-electron
		globalShortcut.register("Control+Shift+I", () => {});
	}if (desktopConfig.disableZoom) {
		globalShortcut.register("Control+-", () => {});
		globalShortcut.register("Control+Shift+=", () => {});
	}
}