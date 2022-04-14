import { mtdAppFunctions } from "../../AppController";

export const initAppFunctions = () => {
    mtdAppFunctions();
    window.require("electron").ipcRenderer.send("getDesktopConfig");
}