/*
	Functions/ModernDeckConst.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { buildId, buildVersion, buildDate } from "../BuildProps.json";
import { getPlatformName, getProductName, getSystemName } from "./VersionController";

export let ModernDeck = {
	version: 10.0,
    versionString: buildVersion,
	versionFriendlyString: buildVersion.replace(/\.0$/,""), // remove trailing .0, if present
    platformName: getPlatformName(),
    productName: getProductName(),
    systemName: getSystemName(),
    buildNumber: buildId,
    buildDate: buildDate
};

window.ModernDeck = ModernDeck;