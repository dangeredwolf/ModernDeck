import { app, dialog } from "electron";
import * as fs from "fs";

export type DesktopConfig = {

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

            return {} as DesktopConfig;
        }
    }
}