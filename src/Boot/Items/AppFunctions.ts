/*
	Boot/Items/AppFunctions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { mtdAppFunctions } from "../../AppController";

export const initAppFunctions = () => {
    mtdAppFunctions();
    window.require("electron").ipcRenderer.send("getDesktopConfig");
}