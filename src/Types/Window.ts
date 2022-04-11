/*
	Types/Window.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

declare global {
    interface Window {
        lastError: Error;
        useSentry: boolean;
        mtdNumberFormat: Intl.NumberFormat;
        mtdNeedsResetNumberFormatting: boolean;
    }
}

export default undefined;