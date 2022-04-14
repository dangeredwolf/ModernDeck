/*
	Boot/Items/FeatureFlags.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { processForceFeatureFlags } from "../../ForceFeatureFlags"

const forceFeatureFlags = false;

export const initFeatureFlags = () => {
    if (forceFeatureFlags) {
        processForceFeatureFlags();
    }
}