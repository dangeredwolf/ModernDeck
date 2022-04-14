/*
	Boot/Stages/LowLevel.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { defineBootComponent } from "../BootHelper";
import { initCoreStylesheet } from "../Items/CoreStylesheet";
import { initFeatureFlags } from "../Items/FeatureFlags";
import { initInjectFonts } from "../Items/InjectFonts";
import { initLateBootScreen } from "../Items/LateBootScreen";
import { initProcessMustaches } from "../Items/MustachePatcher";
import { replacePrettyNumber } from "../Items/PrettyNumber";
import { runtimeStylesheetExtensions } from "../Items/RuntimeStylesheetExtensions";
import { initI18nEngine } from "../Items/StartI18nEngine";

export const lowlevelStage = async () => {
	console.log("Beginning LowLevel stage...");
	await defineBootComponent(initLateBootScreen);
    await defineBootComponent(initInjectFonts);
    await defineBootComponent(initCoreStylesheet);
    await defineBootComponent(initFeatureFlags);
    await defineBootComponent(replacePrettyNumber);
    await defineBootComponent(runtimeStylesheetExtensions);
    await defineBootComponent(initProcessMustaches);
    await defineBootComponent(initI18nEngine);
}