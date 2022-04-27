/*
	Boot/Stages/LowLevel.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { defineBootComponent } from "../BootHelper";
import { initAjaxPrefilter } from "../Items/AjaxPrefilter";
import { initCoreStylesheet } from "../Items/CoreStylesheet";
import { initFeatureFlags } from "../Items/FeatureFlags";
import { fixColumnAnimations } from "../Items/FixColumnAnimations";
import { initFunctionPatcher } from "../Items/InitFunctionPatcher";
import { initInjectFonts } from "../Items/InjectFonts";
import { initLateBootScreen } from "../Items/LateBootScreen";
import { initProcessMustaches } from "../Items/MustachePatcher";
import { replacePrettyNumber } from "../Items/PrettyNumber";
import { runtimeStylesheetExtensions } from "../Items/RuntimeStylesheetExtensions";
import { initI18nEngine } from "../Items/StartI18nEngine";

export const lowlevelStage = async () => {
	console.log("Boot: Beginning LowLevel stage...");
	await defineBootComponent(initLateBootScreen);
    await defineBootComponent(initInjectFonts);
    await defineBootComponent(initCoreStylesheet);
    await defineBootComponent(initFeatureFlags);
    await defineBootComponent(replacePrettyNumber);
    await defineBootComponent(runtimeStylesheetExtensions);
    await defineBootComponent(initProcessMustaches);
    await defineBootComponent(initAjaxPrefilter);
    await defineBootComponent(initI18nEngine);
    await defineBootComponent(initFunctionPatcher);
    await defineBootComponent(fixColumnAnimations);
}