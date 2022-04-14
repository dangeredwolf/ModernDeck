/*
	Boot/Boot.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeck } from "../Functions/ModernDeckConst";
import { coreStage } from "./Stages/Core";
import { lowlevelStage } from "./Stages/LowLevel";
import { mainStage } from "./Stages/Main";

const startBoot = async () => {
	console.log("Welcome to ModernDeck!");
	console.log(`ModernDeck ${ModernDeck.version}, build ${ModernDeck.buildNumber}, ${ModernDeck.buildDate}`);
	console.log("ModernDeck Boot is getting started...");

	const startTime: number = performance.now();

	await coreStage();
	await lowlevelStage();
	await mainStage();

	const endTime: number = (performance.now() - startTime);

	console.log(`ModernDeck Boot is complete after ${endTime} ms with ${window.moderndeckBootErrorCount} errors, have a nice day!`);
}

startBoot();