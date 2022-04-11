/*
	Types/Window.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import ModuleRaid from 'moduleraid';
import NFTActionQueue from '../NFTActionQueue';
import { ModernDeckSettingsTab } from './ModernDeckSettings';

declare global {
    interface Window {
        lastError: Error;
        useSentry: boolean;
        mtdNumberFormat: Intl.NumberFormat;
        mtdNeedsResetNumberFormatting: boolean;
        ModernDeck: {
            settingsData: any;
            store: any;
            versionString: string;
        };
        store: any; // This is any only because Electron-Store does not exist on browser;
        mR: ModuleRaid;
        html: JQuery;
        body: JQuery;
        useNativeContextMenus: boolean;
        desktopConfig: {
            updatePolicy: string,
            disableCustomCSS: boolean,
        };
        mtdPrepareWindows: () => void;
        renderTab (tab: string): void;
        mtdBaseURL: string;
        mtdTimeHandler: string;
        mtdAbbrevNumbers: boolean;
        useSafeMode: boolean;
        settingsData: {[key: string]: ModernDeckSettingsTab};
        nftAvatarAction: NFTActionQueue
    }
}

export default undefined;