/*
	Boot/BootHelper.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import * as Sentry from "@sentry/browser";

window.moderndeckBootErrorCount = 0;

export const defineBootComponent = async (func: Function, condition?: boolean): Promise<any> => {
	return new Promise((resolve) => {
		try {
			if (condition === false) {
				resolve(null);
			}
			const functionResult: any = func();
			console.log(`Boot: Done ${func.name}`);
			resolve(functionResult);
		} catch(error: any) {
			console.error(`Error in boot component ${func.name}`);
			console.error(error);

			window.moderndeckBootErrorCount++;

			if (window.useSentry === true) {
				Sentry.captureException(error);
			}

			resolve(null);
		}
	});
}