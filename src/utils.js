
/*
	Shorthand function to create a new element, which is helpful for concise UI building.

	We could just make jQuery directly do it, but it's slower than calling native JS api and wrapped jQuery around it
*/

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
