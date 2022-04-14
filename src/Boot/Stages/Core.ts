import { defineBootComponent } from "../BootHelper";
import { initSentry } from "../Items/Sentry";
import { extractJQuery } from "../Items/ExtractJQuery";

export const coreStage = async () => {
	console.log("Beginning Core stage...");
	await defineBootComponent(initSentry);
	await defineBootComponent(extractJQuery);
}