/*
	Boot/Items/LateAppFunctions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { clearContextMenu } from "../../UIContextMenu";

export const initLateAppFunctions = () => {
    window.addEventListener('mousedown', (e) => {
        clearContextMenu();
    }, false);
}