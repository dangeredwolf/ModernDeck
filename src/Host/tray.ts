import { I18n } from "./i18n";
import { HostManager } from "./hostManager";
import { separator } from "./utils";
import { autoUpdater, desktopConfig } from "./main";

const { Tray, Menu, nativeImage, app } = require("electron");

export function makeTray() {
	if (HostManager.tray !== null) {
		return;
	}

	let pathName = `${__dirname}${separator}common${separator}assets${separator}` +
					`img${separator}app${separator}${(process.platform === "darwin" ? "macOSTrayTemplate.png" : "Tray.png")}`;

	const image = nativeImage.createFromPath(pathName);
	image.setTemplateImage(true);
	HostManager.tray = new Tray(pathName);

	const contextMenu = Menu.buildFromTemplate([
		{ label: I18n("Open ModernDeck"), click(){ showHiddenWindow() } },
		{ label: (process.platform === "darwin" ? I18n("Preferences...") : I18n("Settings...")), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("openSettings"); } },
		{ visible: (typeof process.windowsStore === "undefined" && desktopConfig.autoUpdatePolicy !== "disabled"), label: (process.platform === "darwin" ? I18n("Check for Updates...") : I18n("Check for updates...")), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("checkForUpdatesMenu"); } },

		{ type: "separator" },

		{ label: I18n("New Tweet..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("newTweet"); } },
		{ label: I18n("New Direct Message..."), click(){ if (!HostManager.mainWindow){return;}HostManager.mainWindow.show();HostManager.mainWindow?.webContents?.send("newDM"); } },

		{ type: "separator" },

		{ label: (process.platform === "darwin" ? I18n("Quit") : I18n("Exit")), click(){
			if (!HostManager.mainWindow) {
				return;
			}
			HostManager.closeForReal = true;
			autoUpdater.quitAndInstall(true,true);
			
			setTimeout(() => {
				/* if auto updater is dumb and does not quit then do it anyway
				 i think electron-updater changed their behavior because previously quitAndInstall always worked */
				app.quit();
			},200)
		}},
	]);

	HostManager.tray.setToolTip("ModernDeck");
	HostManager.tray.setContextMenu(contextMenu);
	HostManager.tray.on("click", showHiddenWindow);
}

export function destroyTray() {
	HostManager.tray?.destroy?.();
	HostManager.tray = null;
}

function showHiddenWindow() {
	if (!HostManager.mainWindow){
		return;
	}

	HostManager.mainWindow.show();
	HostManager.mainWindowHidden = false;

	if (!HostManager.enableTray) {
		destroyTray();
	}
}
