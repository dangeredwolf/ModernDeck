
import * as Sentry from "@sentry/browser";

export const defineBootComponent = async (func: Function): Promise<any> => {
	return new Promise((resolve) => {
		try {
			const functionResult: any = func();
			console.log(`Boot: Done ${func.name}`);
			resolve(functionResult);
		} catch(error: any) {
			console.error(`Error in boot component ${func.name}`);
			console.error(error);

			if (window.useSentry === true) {
				Sentry.captureException(error);
			}

			resolve(null);
		}
	});
}