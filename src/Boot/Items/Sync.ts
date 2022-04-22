/*
	Boot/Items/Sync.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { SyncController } from "../../SyncController";

export const startSync = () => {
    SyncController.initialize();
}