/*
	Init/ModernDeckConst.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { version } from "../../package.json";
import buildId from "../buildId";
import { getPlatformName, getProductName, getSystemName } from "./VersionController";

export let ModernDeck = {
	version: 10.0,
    versionString: version,
	versionFriendlyString: version.replace(/\.0$/,""), // remove trailing .0, if present
    platformName: getPlatformName(),
    productName: getProductName(),
    systemName: getSystemName(),
    buildNumber: buildId,
};

window.ModernDeck = ModernDeck;