/*
	Boot/Items/AutoUpdater.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { AutoUpdateController } from "../../AutoUpdateController";

export const initAutoUpdater = () => {
	if (typeof window.require !== "undefined") {
        AutoUpdateController.initialize();
    }
}