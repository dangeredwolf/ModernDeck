/*
	Types/Window.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import ModuleRaid, { WebpackModule } from 'moduleraid';
import NFTActionQueue from '../NFTActionQueue';
import { ModernDeckSettingsTab } from './ModernDeckSettings';
import { TweetDeckObject } from './TweetDeck';

declare global {
    
    let TD: TweetDeckObject;
    let __webpack_public_path__: string;

    interface DesktopConfig {
        updatePolicy?: string,
        disableCustomCSS?: boolean,
        disableOOBE?: boolean,
        autoUpdatePolicy?: string,
        customLoginImage?: string,
        disableUpdateNotification?: boolean,
        [key: string]: any,
    }

    interface Window {
        lastError: Error;
        useSentry: boolean;
        mtdNumberFormat: Intl.NumberFormat;
        mtdNeedsResetNumberFormatting: boolean;
        $: WebpackModule;
        jQuery: WebpackModule;
        MTDURLExchange: Element;
        ModernDeck: {
            version: number;
            versionString: string;
            versionFriendlyString: string; // remove trailing .0, if present
            platformName: string;
            productName: string;
            systemName: string;
            buildDate?: string;
            buildNumber: number;
            settingsData?: any;
            SyncController?: any;
            store?: any;
            enableStylesheetExtension?: (name: string) => void;
            disableStylesheetExtension?: (name: string) => void;
        };
        deck: {
			osname:() => string;
			getWrapperVersion:() => string;
			inApp:() => boolean;
			tearDown:() => void;
			doGrowl:(title: string, text: string, icon: string, tweet: string, column: string) => void;
			setTheme:(theme: string) => void;
			authenticateOn:() => {hide:() => void, deleteLater:() => void};
			closeLoadingScreen:() => void;
		};
        store: any; // This is any only because Electron-Store does not exist on browser;
        mR: ModuleRaid;
        TD: TweetDeckObject;
        TD_mustaches: { [key: string]: string };
        html: JQuery;
        body: JQuery;
        head: JQuery;
        mtdLoadStyleCSS: string;
        useNativeContextMenus: boolean;
        desktopConfig: DesktopConfig;
        mtdPrepareWindows: () => void;
        renderTab (tab: string): void;
        mtdBaseURL: string;
        mtdTimeHandler: string;
        mtdAbbrevNumbers: boolean;
        useSafeMode: boolean;
        settingsData: {[key: string]: ModernDeckSettingsTab};
        nftAvatarAction: NFTActionQueue;
        isInWelcome: boolean;
        nftActionQueue: NFTActionQueue;
        moderndeckBootErrorCount: number;
        injectedFonts: boolean;
        mtdHasNotifiedUpdate: boolean;
        updateNotifyID: number;
        originalAlert: () => void;
        mtd_nd_header_image: HTMLElement;
        mtd_nd_header_photo: HTMLElement;
        mtd_nd_header_atname: HTMLElement;
        mtd_nd_header_username: HTMLElement;
        mtd_nav_drawer_background: HTMLElement;
        mtd_nav_drawer: HTMLElement;
        languageData: {};
        loginInterval: any;
        TweetDecki18nStarted: boolean;
        findMustaches: (str: string) => any;
        I18n: Function;
    }
}

export default undefined;