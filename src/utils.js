import { I18n } from "./I18n.js";

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
	}
}

export const make = function(a) {
	return $(document.createElement(a));
}

export const makeN = function(a) {
	return nQuery(document.createElement(a));
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
	Helper function that rounds a number to the nearest hundredth (2nd decimal)
*/

export function roundMe(val) {
	return Math.floor(val * 100)/100;
}

/*
	function formatBytes(int val)

	Returns string: Number of bytes formatted into larger units (KB, MB, GB, TB)

	i.e. formatBytes(1000) -> "1 KB"
*/

export function formatBytes(val) {
	if (val < 10**3) {
		return val + " bytes"
	} else if (val < 10**6) {
		return roundMe(val/10**3) + I18n(" KB")
	} else if (val < 10**9) {
		return roundMe(val/10**6) + I18n(" MB")
	} else if (val < 10**12) {
		return roundMe(val/10**9) + I18n(" GB")
	} else {
		return roundMe(val/10**12) + I18n(" TB")
	}
}


/*
	Sanitises a string so we don't get silly XSS exploits (i sure as hell hope)
*/

export function sanitiseString(str) {
	return str.replace(/\</g,"&lt;").replace(/\&/g,"&amp;").replace(/\>/g,"&gt;").replace(/\"/g,"&quot;")
}

export const isApp = typeof require !== "undefined";

/*
	Shorthand for creating a mutation observer and observing
*/

export function mutationObserver(obj,func,parms) {
	return (new MutationObserver(func)).observe(obj,parms);
}

/*
	Returns ipcRenderer for electron app
*/

export function getIpc() {
	if (!require) {return null;}
	return require('electron').ipcRenderer;
}
