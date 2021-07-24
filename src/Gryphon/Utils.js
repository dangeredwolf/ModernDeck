/*
	Utils.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import { I18n, getFullLanguage } from "./I18n.js";

/*
	Shorthand function to create a new element, which is helpful for concise UI building.

	We could just make jQuery directly do it, but it's slower than calling native JS api and wrapped jQuery around it
*/

export const handleErrors = (func, text) => {
	try {
		func();
	} catch(e) {
		console.error(text || "Caught an unexpected internal error");
		console.error(e);
		window.lastError = e;
		if (window.useSentry) {
			Sentry.captureException(e);
		}
	}
}

// shorthand function to return true if something exists and false otherwise

export const exists = function(thing) {
	return (
		(typeof thing === "object" && thing !== null && thing.length > 0) || // Object can't be empty or null
		(!!thing === true) ||
		(typeof thing === "string") ||
		(typeof thing === "number")
	);
}

/*
	Returns ipcRenderer for electron app
*/

export function getIpc() {
	if (!require) {return null;}
	return require('electron').ipcRenderer;
}


export const isApp = typeof require !== "undefined";