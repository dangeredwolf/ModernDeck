/*
	Types/Window.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import ModuleRaid from 'moduleraid';

declare global {
    interface Window {
        lastError: Error;
        useSentry: boolean;
        mtdNumberFormat: Intl.NumberFormat;
        mtdNeedsResetNumberFormatting: boolean;
        ModernDeck: {
            settingsData: any,
            store: any
        },
        store: any, // This is any only because Electron-Store does not exist on browser,
        mR: ModuleRaid
    }
}

export default undefined;