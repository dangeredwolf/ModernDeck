/*
	Utils.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n, getFullLanguage } from "./I18n";
import * as Sentry from "@sentry/browser";
import { getPref } from "./StoragePreferences";
import _windowTypes from "./Types/Window";

/*
	Shorthand function to create a new element, which is helpful for concise UI building.

	We could just make jQuery directly do it, but it's slower than calling native JS api and wrapped jQuery around it
*/

export default {};

export const handleErrors = (func: Function, text: string): void => {
	try {
		func();
	} catch(error: any) {
		console.error(text || "Caught an unexpected internal error");
		console.error(error);
		window.lastError = error;
		if (window.useSentry) {
			Sentry.captureException(error);
		}
	}
}

// Creates a new element in jQuery

export const make = function(elementType: string): JQuery {
	return $(document.createElement(elementType));
}

// shorthand function to return true if something exists and false otherwise

export const exists = function(thing: any): boolean {
	return (
		(typeof thing === "object" && thing !== null && thing.length > 0) || // Object can't be empty or null
		(!!thing === true) ||
		(typeof thing === "string") ||
		(typeof thing === "number")
	);
}

/*
	Formats a number for a given locale
*/

export function formatNumberI18n(number: number): string {
	number = Math.round(number * 100) / 100;
	if (!window.mtdNumberFormat || window.mtdNeedsResetNumberFormatting) {
		let format: string;
		switch(getPref("mtd_shortDateFormat")) {
			case "default":
				format = getFullLanguage().replace(/\_/g,"-");
				break;
			case "english":
				format = "en";
				break;
			case "europe":
				format = "de";
				break;
			case "blank":
				format = "fr";
				break;
			case "indian":
				format = "hi";
				break;
		}
		window.mtdNumberFormat = new Intl.NumberFormat(format);
	}
	return window.mtdNumberFormat.format(number);
}

/*
	Helper function that rounds a number to the nearest hundredth (2nd decimal)
*/

export function roundMe(val: number): number {
	return Math.floor(val * 100)/100;
}

/*
	function formatBytes(int val)

	Returns string: Number of bytes formatted into larger units (KB, MB, GB, TB)

	i.e. formatBytes(1000) -> "1 KB"
*/

export function formatBytes(val: number): string {
	if (val < 10**3) {
		return formatNumberI18n(val) + I18n(" bytes")
	} else if (val < 10**6) {
		return formatNumberI18n(roundMe(val/10**3)) + I18n(" KB")
	} else if (val < 10**9) {
		return formatNumberI18n(roundMe(val/10**6)) + I18n(" MB")
	} else if (val < 10**12) {
		return formatNumberI18n(roundMe(val/10**9)) + I18n(" GB")
	} else {
		return formatNumberI18n(roundMe(val/10**12)) + I18n(" TB")
	}
}

export const isApp: boolean = typeof window.require !== "undefined";

/*
	Shorthand for creating a mutation observer and observing
*/

export const mutationObserver = (object: Node, func: MutationCallback, parms: Object): MutationObserver => {
	const observer = (new MutationObserver(func));
	observer.observe(object, parms);
	return observer;
}

/*
	Returns ipcRenderer for electron app
*/

export const getIpc = () => {
	if (!window.require) {return null;}
	return window.require("electron").ipcRenderer;
}

// Use standard macOS symbols instead of writing it out like on Windows

export const ctrlShiftText: string = (navigator.userAgent.indexOf("Mac OS X") > -1) ? "⌃⇧" : "{{Ctrl+Shift+}}";