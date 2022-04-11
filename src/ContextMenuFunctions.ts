/*
	ContextMenuFunctions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// These functions allow the app's context menus to perform contextual options

import { getIpc } from "./Utils";

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
	openLink: (link: string) => {
		window.open(link);
	},
	copyLink: (link: string) => {
		const { clipboard } = window.require("electron");
		clipboard.writeText(link);
	},
	openImage: (link: string) => {
		window.open(link);
	},
	copyImageURL: (link: string) => {
		const { clipboard } = window.require("electron");
		clipboard.writeText(link);
	},
	copyImage: (imageURL: string) => {
		getIpc().send("copyImage", imageURL);
	},
	saveImage: (imageURL: string) => {
		getIpc().send("saveImage", imageURL);
	},
	inspectElement: (coordinates: {x: number, y: number}) => {
		getIpc().send("inspectElement", coordinates);
	},
	restartApp: () => {
		getIpc().send("restartApp");
	}
};
