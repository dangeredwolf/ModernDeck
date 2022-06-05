export class HostManager {
    static mainWindow: Electron.BrowserWindow = null;
    static errorWindow: Electron.BrowserWindow = null;
    static loginWindow: Electron.BrowserWindow = null;
    static tray: Electron.Tray = null;

    static shouldQuitIfErrorClosed: boolean = false;
    static closeForReal: boolean = false;
    static mainWindowHidden: boolean = false;
    static enableTray: boolean = true;
    static enableBackground: boolean = true;
    static isRestarting: boolean = false;
}