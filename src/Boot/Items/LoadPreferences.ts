import { loadPreferences } from "../../Settings/SettingsInit";

export const initPreferences = () => {
	setTimeout(loadPreferences, 50);
}