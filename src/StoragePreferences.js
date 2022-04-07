/*
	StoragePreferences.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	getPref(String preferenceKey)
	Returns value of preference, either string or boolean

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

import { exists, isApp } from "./Utils.js";
export const debugStorageSys = false;
let store;

if (isApp) {
	const Store = require('electron-store');
	store = new Store({name:"mtdsettings"});
}

export function resetPref(id) {
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

export function getPref(id, defaul) {
	if (id === "mtd_core_theme") {
		return TD.settings.getTheme();
	}

	let val;

	if (store) {
		if (store.has(id))
			val = store.get(id);
		else
			val = undefined;
	} else {
		val = localStorage.getItem(id);
	}

	if (debugStorageSys)
		console.log("getPref "+id+"? "+val);

	if (typeof val === "undefined")
		return defaul;

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

export function purgePrefs() {

	for (let key in localStorage) {
		if (key.indexOf("mtd_") >= 0) {
			localStorage.removeItem(key);
		}
	}
	if (isApp) {
		store.clear();
	}

}

/*
	setPref(String preferenceKey, [mixed types] value)
	Sets preference to value

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

export function setPref(id,p) {

	if (id === "mtd_core_theme") {
		return;
	}

	if (exists(store)) {

		// Newer versions of electron-store are more strict about using delete vs. set undefined

		if (typeof p !== "undefined") {
			store.set(id,p);
		} else {
			store.delete(id);
		}
	} else {
		localStorage.setItem(id,p);
	}

	if (debugStorageSys)
		console.log(`setPref ${id} to ${p}`);
}

/*
	hasPref(String preferenceKey)
	return boolean: whether or not the preference manager (electron-store on app, otherwise localStorage) contains a key

	https://github.com/dangeredwolf/ModernDeck/wiki/Preference-Management-Functions
*/

export function hasPref(id) {
	let hasIt;

	if (typeof id === "undefined") {
		throw "id not specified for hasPref";
	}

	if (id === "mtd_core_theme") {
		return true;
	}

	if (exists(store)) {
		hasIt = store.has(id);
	} else {
		hasIt = localStorage.getItem(id) !== null && typeof localStorage.getItem(id) !== "undefined" && localStorage.getItem(id) !== undefined;
	}

	if (debugStorageSys)
		console.log(`hasPref ${id}? ${hasIt}`);

	return hasIt;
}

/*
	dumpPreferences()

	returns string: dump of user preferences, for diag function
*/

export function dumpPreferences() {

	let prefs = "";

	for (let key in window.ModernDeck.settingsData) {

		if (!window.ModernDeck.settingsData[key].enum) {
			for (let i in window.ModernDeck.settingsData[key].options) {
				let prefKey = window.ModernDeck.settingsData[key].options[i].settingsKey;
				let pref = window.ModernDeck.settingsData[key].options[i];

				if (exists(prefKey) && pref.type !== "button" && pref.type !== "link") {
					prefs += prefKey + ": " + (getPref(prefKey) || "[not set]") + "\n"
				}
			}
		}
	}

	return prefs;
}
