import { defineBootComponent } from "../BootHelper";
import { overrideFadeOut } from "../Items/FadeOut";
import { initLateAppFunctions } from "../Items/LateAppFunctions";
import { initTweetDeckImagePaste } from "../Items/TweetDeckImagePaste";

export const mainStage = async () => {
	console.log("Beginning Main stage...");
    await defineBootComponent(initTweetDeckImagePaste);
	await defineBootComponent(initLateAppFunctions, typeof window.require !== "undefined");
    await defineBootComponent(overrideFadeOut);
    
}