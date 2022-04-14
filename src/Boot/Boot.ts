/*
	Init/Boot.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/


import { buildId, buildVersion, buildDate } from "../BuildProps.json";
import { coreStage } from "./Stages/Core";
import { lowlevelStage } from "./Stages/LowLevel";

const startBoot = async () => {
	console.log("Welcome to ModernDeck!");
	console.log(`ModernDeck ${buildVersion}, build ${buildId}, ${buildDate}`);
	console.log("ModernDeck Boot is getting started...");

	await coreStage();
	await lowlevelStage();
}

startBoot();