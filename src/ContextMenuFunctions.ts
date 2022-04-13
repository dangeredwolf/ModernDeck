/*
	ContextMenuFunctions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// These functions allow the app's context menus to perform contextual options

import { getIpc } from "./Utils";

export enum ContextMenuAction {
	cut = "cut",
	copy = "copy",
	paste = "paste",
	undo = "undo",
	redo = "redo",
	selectAll = "selectAll",
	delete = "delete",
	openLink = "openLink",
	copyLink = "copyLink",
	openImage = "openImage",
	copyImageURL = "copyImageURL",
	copyImage = "copyImage",
	saveImage = "saveImage",
	inspectElement = "inspectElement",
	restartApp = "restartApp",
}

export const contextMenuFunctions = {
	[ContextMenuAction.cut]: () => {
		getIpc().send("cut");
	},
	[ContextMenuAction.copy]: () => {
		getIpc().send("copy");
	},
	[ContextMenuAction.paste]: () => {
		getIpc().send("paste");
	},
	[ContextMenuAction.undo]: () => {
		getIpc().send("undo");
	},
	[ContextMenuAction.redo]: () => {
		getIpc().send("redo");
	},
	[ContextMenuAction.selectAll]: () => {
		getIpc().send("selectAll");
	},
	[ContextMenuAction.delete]: () => {
		getIpc().send("delete");
	},
	[ContextMenuAction.openLink]: (link: string) => {
		window.open(link);
	},
	[ContextMenuAction.copyLink]: (link: string) => {
		const { clipboard } = window.require("electron");
		clipboard.writeText(link);
	},
	[ContextMenuAction.openImage]: (link: string) => {
		window.open(link);
	},
	[ContextMenuAction.copyImageURL]: (link: string) => {
		const { clipboard } = window.require("electron");
		clipboard.writeText(link);
	},
	[ContextMenuAction.copyImage]: (imageURL: string) => {
		getIpc().send("copyImage", imageURL);
	},
	[ContextMenuAction.saveImage]: (imageURL: string) => {
		getIpc().send("saveImage", imageURL);
	},
	[ContextMenuAction.inspectElement]: (coordinates: {x: number, y: number}) => {
		getIpc().send("inspectElement", coordinates);
	},
	[ContextMenuAction.restartApp]: () => {
		getIpc().send("restartApp");
	}
};
