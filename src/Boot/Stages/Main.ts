/*
	Boot/Stages/Main.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { defineBootComponent } from "../BootHelper";
import { initAME } from "../Items/AME";
import { initCollapsedColumns } from "../Items/CollapsedColumns";
import { overrideFadeOut } from "../Items/FadeOut";
import { keyboardShortcutHandlerInit } from "../Items/KeyboardShortcutHandler";
import { initLateAppFunctions } from "../Items/LateAppFunctions";
import { initPreferences } from "../Items/LoadPreferences";
import { navigationSetup } from "../Items/NavigationSetup";
import { hookNFTActions } from "../Items/NFTActions";
import { initSettingsHook } from "../Items/SettingsHook";
// import { startSync } from "../Items/Sync";
import { initTweetDeckImagePaste } from "../Items/TweetDeckImagePaste";

export const mainStage = async () => {
	console.log("Boot: Beginning Main stage...");
    await defineBootComponent(initTweetDeckImagePaste);
    await defineBootComponent(initAME);
    await defineBootComponent(initPreferences);
	await defineBootComponent(initLateAppFunctions, typeof window.require !== "undefined");
    await defineBootComponent(navigationSetup);
    await defineBootComponent(keyboardShortcutHandlerInit);
    await defineBootComponent(initSettingsHook);
    await defineBootComponent(overrideFadeOut);
    await defineBootComponent(initCollapsedColumns);
    await defineBootComponent(hookNFTActions);
    // await defineBootComponent(startSync);
    
}