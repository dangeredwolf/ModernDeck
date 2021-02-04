/*
	Settings/Util.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

export function evaluateOrReturn(expression) {
	let retValue = undefined;

	if (typeof expression === "function") {
		try {
			retValue = expression();
		} catch(e) {
			console.error("Caught bad settings evaluate function.", expression);
		}
	} else {
		retValue = expression;
	}

	return retValue;
}
