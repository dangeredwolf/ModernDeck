/*
	Boot/Stages/Core.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { defineBootComponent } from "../BootHelper";
import { initSentry } from "../Items/Sentry";
import { extractJQuery } from "../Items/ExtractJQuery";
import { initAutoUpdater } from "../Items/AutoUpdater";
import { initAppFunctions } from "../Items/AppFunctions";
import { drawAsciiArt } from "../Items/AsciiArt";
import { initLoginScreen } from "../Items/LoginScreen";
import { initialTheme } from "../Items/InitialTheme";

export const coreStage = async () => {
	console.log("Boot: Beginning Core stage...");
    await defineBootComponent(drawAsciiArt);
	await defineBootComponent(initialTheme);
	await defineBootComponent(initSentry);
	await defineBootComponent(extractJQuery);
    await defineBootComponent(initLoginScreen);
	await defineBootComponent(initAutoUpdater, typeof window.require !== "undefined");
	await defineBootComponent(initAppFunctions, typeof window.require !== "undefined");
}