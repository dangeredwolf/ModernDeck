export const make = function(a) {
	return $(document.createElement(a));
}

export const makeN = function(a) {
	return nQuery(document.createElement(a));
}

export const exists = function(thing) {
	return (
		(typeof thing === "object" && thing !== null && thing.length > 0) || // Object can't be empty or null
		(!!thing === true) ||
		(typeof thing === "string") ||
		(typeof thing === "number")
	);
}
