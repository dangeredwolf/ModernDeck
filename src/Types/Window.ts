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
            disableOOBE: boolean,
        };
        mtdPrepareWindows: () => void;
        renderTab (tab: string): void;
        mtdBaseURL: string;
        mtdTimeHandler: string;
        mtdAbbrevNumbers: boolean;
        useSafeMode: boolean;
        settingsData: {[key: string]: ModernDeckSettingsTab};
        nftAvatarAction: NFTActionQueue;
        isInWelcome: boolean;
        mtd_welcome_dark: HTMLElement;
        mtd_welcome_light: HTMLElement;
        mtd_welcome_darker: HTMLElement;
        mtd_welcome_paper: HTMLElement;
        mtd_welcome_amoled: HTMLElement;
        mtd_welcome_simplified: HTMLElement;
        mtd_welcome_classic: HTMLElement;
        injectedFonts: boolean;
    }
}

export default undefined;