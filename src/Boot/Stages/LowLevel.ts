import { defineBootComponent } from "../BootHelper";
import { drawAsciiArt } from "../Items/AsciiArt";
import { initCoreStylesheet } from "../Items/CoreStylesheet";
import { initFeatureFlags } from "../Items/FeatureFlags";
import { initInjectFonts } from "../Items/InjectFonts";
import { initLateBootScreen } from "../Items/LateBootScreen";
import { initProcessMustaches } from "../Items/MustachePatcher";
import { replacePrettyNumber } from "../Items/PrettyNumber";
import { runtimeStylesheetExtensions } from "../Items/RuntimeStylesheetExtensions";

export const lowlevelStage = async () => {
	console.log("Beginning LowLevel stage...");
	await defineBootComponent(initLateBootScreen);
    await defineBootComponent(initInjectFonts);
    await defineBootComponent(initCoreStylesheet);
    await defineBootComponent(drawAsciiArt);
    await defineBootComponent(initFeatureFlags);
    await defineBootComponent(replacePrettyNumber);
    await defineBootComponent(runtimeStylesheetExtensions);
    await defineBootComponent(initProcessMustaches);
}