import { AutoUpdateController } from "../../AutoUpdateController";

export const initAutoUpdater = () => {
	if (typeof window.require !== "undefined") {
        AutoUpdateController.initialize();
    }
}