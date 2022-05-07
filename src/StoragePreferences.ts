/*
	StoragePreferences.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	getPref(String preferenceKey)
	Returns value of preference, either string or boolean

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

import { exists, isApp } from "./Utils";
export const debugStorageSys: boolean = false;

let validSyncPrefs: string[] = null;

if (isApp) {
	const Store = window.require('electron-store');
	window.ModernDeck.store = new Store({name:"mtdsettings"});
} else {
	window.ModernDeck.store = null;
}

export const resetPref = (id: string) : void => {
	for (let key in window.ModernDeck.settingsData) {
		if (window.ModernDeck.settingsData[key].options) {
			for (let i in window.ModernDeck.settingsData[key].options) {
				let prefKey = window.ModernDeck.settingsData[key].options[i].settingsKey;
				let pref = window.ModernDeck.settingsData[key].options[i];

				let def;

				if (typeof pref.default === "function") {
					def = pref.default();
				} else {
					def = pref.default;
				}

				if (prefKey === id) {
					setPref(prefKey, def)
				}
			}
		}
	}
}

export const getPref = (id: string, defaultPreference?: any) : any => {
	if (id === "mtd_core_theme") {
		return TD.settings.getTheme();
	}

	let val: any;

	if (window.ModernDeck.store) {
		if (window.ModernDeck.store.has(id))
			val = window.ModernDeck.store.get(id);
		else
			val = undefined;
	} else {
		val = localStorage.getItem(id);
	}

	if (debugStorageSys)
		console.log("getPref "+id+"? "+val);

	if (typeof val === "undefined")
		return defaultPreference;

	if (val === "true")
		return true;
	else if (val === "false")
		return false;
	else
		return val;
}


/*
	purgePrefs()
	Purges all settings. This is used when you reset ModernDeck in settings

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

export const purgePrefs = () : void => {

	for (let key in localStorage) {
		if (key.indexOf("mtd_") >= 0) {
			localStorage.removeItem(key);
		}
	}
	if (isApp) {
		window.ModernDeck.store.clear();
	}

}

/*
	setPref(String preferenceKey, [mixed types] value)
	Sets preference to value

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

export const setPref = (id: string, pref: any) : void => {

	console.log(`setPref ${id} ${pref}`);

	if (id === "mtd_core_theme") {
		return;
	}

	let oldPref = getPref(id);

	if (exists(window.ModernDeck.store)) {

		// Newer versions of electron-store are more strict about using delete vs. set undefined

		if (typeof pref !== "undefined") {
			window.ModernDeck.store.set(id, pref);
		} else {
			window.ModernDeck.store.delete(id);
		}
	} else {
		localStorage.setItem(id, pref);
	}

	if (validSyncPrefs === null) {
		validSyncPrefs = getValidSyncPreferences();
	}

	if (validSyncPrefs.indexOf(id) >= 0 && pref !== oldPref && id !== "mtd_collapsed_columns") {
		window?.ModernDeck?.SyncController?.forceUpdate?.();
	}

	if (debugStorageSys)
		console.log(`setPref ${id} to ${pref}`);
}

/*
	hasPref(String preferenceKey)
	return boolean: whether or not the preference manager (electron-store on app, otherwise localStorage) contains a key

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

export const hasPref = (id: string) : boolean => {
	let hasIt : boolean;

	if (typeof id === "undefined") {
		throw "id not specified for hasPref";
	}

	if (id === "mtd_core_theme") {
		return true;
	}

	if (exists(window.ModernDeck.store)) {
		hasIt = window.ModernDeck.store.has(id);
	} else {
		hasIt = localStorage.getItem(id) !== null && typeof localStorage.getItem(id) !== "undefined" && localStorage.getItem(id) !== undefined;
	}

	if (debugStorageSys)
		console.log(`hasPref ${id}? ${hasIt}`);

	return hasIt;
}

/*
	dumpPreferencesString()

	returns string: dump of user preferences, for diag function
*/

export const dumpPreferencesString = () : string => {

	let prefs: string = "";

	for (let key in window.ModernDeck.settingsData) {

		if (!window.ModernDeck.settingsData[key].enum) {
			for (let i in window.ModernDeck.settingsData[key].options) {
				let prefKey: string = window.ModernDeck.settingsData[key].options[i].settingsKey;
				let pref: any = window.ModernDeck.settingsData[key].options[i];

				if (exists(prefKey) && pref.type !== "button" && pref.type !== "link") {
					prefs += prefKey + ": " + (getPref(prefKey) || "[not set]") + "\n"
				}
			}
		}
	}

	return prefs;
}


/*
	dumpPreferences()

	returns object dump of user preferences
*/

export const dumpPreferences = () : any => {

	var prefBundle: { [key: string]: any } = {};

	for (let key in window.ModernDeck.settingsData) {
		if (!window.ModernDeck.settingsData[key].enum) {
			for (const i in window.ModernDeck.settingsData[key].options) {
				const prefKey: string = window.ModernDeck.settingsData[key].options[i].settingsKey;
				const pref: any = window.ModernDeck.settingsData[key].options[i];

				if (typeof prefKey === "string" && pref.type !== "button" && pref.type !== "link" && typeof pref.queryFunction !== "function") {
					prefBundle[prefKey] = getPref(prefKey);
				}
			}
		}
	}

	console.log(prefBundle);

	return prefBundle;
}

/*
	dumpPreferences()

	returns object dump of user preferences
*/

export const getValidSyncPreferences = () : string[] => {

	let syncPrefs = [];

	for (let key in window.ModernDeck.settingsData) {
		if (!window.ModernDeck.settingsData[key].enum) {
			for (const i in window.ModernDeck.settingsData[key].options) {
				const prefKey: string = window.ModernDeck.settingsData[key].options[i].settingsKey;
				const pref: any = window.ModernDeck.settingsData[key].options[i];

				if (typeof prefKey === "string" && pref.type !== "button" && pref.type !== "link" && typeof pref.queryFunction !== "function") {
					syncPrefs.push(prefKey);
				}
			}
		}
	}

	return syncPrefs;
}

export const findSettingForKey = (queryKey: string) : any => {
	for (let key in window.ModernDeck.settingsData) {
		if (!window.ModernDeck.settingsData[key].enum) {
			for (const i in window.ModernDeck.settingsData[key].options) {
				const prefKey: string = window.ModernDeck.settingsData[key].options[i].settingsKey;
				const pref: any = window.ModernDeck.settingsData[key].options[i];

				if (prefKey === queryKey) {
					return pref;
				}
			}
		}
	}
}