/*
	ContextMenuFunctions.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// These functions allow the app's context menus to perform contextual options

import { getIpc } from "./Utils.js";

export const contextMenuFunctions = {
	cut: () => {
		getIpc().send("cut");
	},
	copy: () => {
		getIpc().send("copy");
	},
	paste: () => {
		getIpc().send("paste");
	},
	undo: () => {
		getIpc().send("undo");
	},
	redo: () => {
		getIpc().send("redo");
	},
	selectAll: () => {
		getIpc().send("selectAll");
	},
	delete: () => {
		getIpc().send("delete");
	},
	openLink: (e) => {
		window.open(e);
	},
	copyLink: (e) => {
		const { clipboard } = require('electron');
		clipboard.writeText(e);
	},
	openImage: (e) => {
		window.open(e);
	},
	copyImageURL: (e) => {
		const { clipboard } = require('electron');
		clipboard.writeText(e);
	},
	copyImage: (e) => {
		getIpc().send("copyImage",e);
	},
	saveImage: (e) => {
		getIpc().send("saveImage",e);
	},
	inspectElement: (e) => {
		getIpc().send("inspectElement",e);
	},
	restartApp: (e) => {
		getIpc().send("restartApp",e);
	},
	newSettings: (e) => {
		openSettings();
	}

};
