/*
	UIContextMenu.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make, exists } from "./Utils";
import { ContextMenuAction, contextMenuFunctions } from "./ContextMenuFunctions";
import { getPref } from "./StoragePreferences";
import { I18n } from "./I18n";

export interface ContextMenuItem {
	enabled?: boolean;
	mousex?: number;
	mousey?: number;
	text: string;
	dataaction: ContextMenuAction;
	data?: any;
}

interface NativeContextMenu {
	label?: string;
	type?: string;
	click?: () => void;
}

/*
	Helper function to create a context menu item
*/

const makeCMItem = (menuItem: ContextMenuItem): JQuery<HTMLElement> | NativeContextMenu => {
	if (window.useNativeContextMenus || window.useSafeMode) {
		let dataact: ContextMenuAction = menuItem.dataaction;
		let data = menuItem.data;
		let nativemenu = { label: menuItem.text, click() {contextMenuFunctions[dataact](data)}, enabled:menuItem.enabled };
		//nativemenu.click = ;
		return nativemenu;
	}
	let a = make("a").attr("href","#").attr("data-action",menuItem.dataaction).html(menuItem.text).addClass("mtd-context-menu-item");
	let li = make("li").addClass("is-selectable").append(a);

	if (menuItem.enabled === false) { // Crucially, also not undefined!
		a.attr("disabled","disabled");
	} else {
		//a.click(contextMenuFunctions[menuItem.dataaction]);

		a.click(() => {
			if (menuItem.mousex && menuItem.mousey) {
				$(document.elementFromPoint(menuItem.mousex, menuItem.mousey)).focus();
			}
			contextMenuFunctions[menuItem.dataaction](menuItem.data);
			clearContextMenu();
		});
	}

	return li;
}


/*
	Helper function to create a context menu divider
*/

const makeCMDivider = (): JQuery<HTMLElement> | NativeContextMenu => {
	if (window.useNativeContextMenus || window.useSafeMode) {
		return {type:'separator'}
	}
	return make("div").addClass("drp-h-divider");
}

/*
	Function that clears a context menu after it's been dismissed
*/

export const clearContextMenu = (): void => {
	let removeMenu = $(".mtd-context-menu")
	removeMenu.addClass("mtd-fade-out").on("animationend",() => {
		removeMenu.remove();
	});
}

/*
	Helper function for the app to construct context menus that will be displayed
*/


export const buildContextMenu = (menuEvent: Electron.ContextMenuParams): JQuery<HTMLElement> | NativeContextMenu[] => {
	let items: (JQuery<HTMLElement> | NativeContextMenu)[] = [];
	let x = menuEvent.x;
	let y = menuEvent.y;

	const xOffset = 2;
	const yOffset = 12;

	if (!window.useSafeMode && $(".mtd-context-menu").length > 0) {
		let removeMenu = $(".mtd-context-menu");
		removeMenu.addClass("mtd-fade-out");
		removeMenu.on("animationend", () => {
			removeMenu.remove();
		})
	}

	if (!window.useSafeMode && $(document.elementFromPoint(x,y)).hasClass("mtd-context-menu-item")) {
		return null;
	}

	if (menuEvent.isEditable || (exists(menuEvent.selectionText) && menuEvent.selectionText.length > 0)) {
		if (menuEvent.isEditable) {
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.undo, text:I18n("Undo"), enabled:menuEvent.editFlags.canUndo}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.redo, text:I18n("Redo"), enabled:menuEvent.editFlags.canRedo}));
			items.push(makeCMDivider());
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.cut, text:I18n("Cut"), enabled:menuEvent.editFlags.canCut}));
		}
		items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.copy, text:I18n("Copy"), enabled:menuEvent.editFlags.canCopy}));
		if (menuEvent.isEditable) {
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.paste, text:I18n("Paste"), enabled:menuEvent.editFlags.canPaste}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.selectAll, text:I18n("Select all"), enabled:menuEvent.editFlags.canSelectAll}));
		}
		items.push(makeCMDivider());
	}

	if (menuEvent.linkURL !== '' && menuEvent.linkURL !== "https://tweetdeck.twitter.com/#") {
		items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.openLink, text:I18n("Open link in browser"), enabled:true, data:menuEvent.linkURL}));
		items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.copyLink, text:I18n("Copy link address"), enabled:true, data:menuEvent.linkURL}));
		items.push(makeCMDivider());
	}

	if (menuEvent.srcURL !== '') {
		if (exists(menuEvent.mediaType) && menuEvent.mediaType === "video") {
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.openImage, text:I18n("Open video in browser"), enabled:true, data:menuEvent.srcURL}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.saveImage, text:I18n("Save video..."), enabled:true, data:menuEvent.srcURL}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.copyImageURL, text:I18n("Copy video address"), enabled:true, data:menuEvent.srcURL}));
		} else {
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.openImage, text:I18n("Open image in browser"), enabled:true, data:menuEvent.srcURL}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.copyImage, text:I18n("Copy image"), enabled:true, data:{x:x, y:y}}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.saveImage, text:I18n("Save image..."), enabled:true, data:menuEvent.srcURL}));
			items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.copyImageURL, text:I18n("Copy image address"), enabled:true, data:menuEvent.srcURL}));
		}

		items.push(makeCMDivider());
	}

	if (getPref("mtd_inspectElement")) {
		items.push(makeCMItem({mousex:x, mousey:y, dataaction:ContextMenuAction.inspectElement, text:I18n("Inspect element"), enabled:true, data:{x:x,y:y}}));
	}

	if (window.useNativeContextMenus || window.useSafeMode) {
		if (items.length > 0) {
			return items;
		} else {
			return null;
		}
	} else {
		let ul = make("ul");

		for(let i = 0; i < items.length; i++){
			ul.append(items[i] as JQuery);
		}

		let menu = make("menu")
		.addClass("mtd-context-menu dropdown-menu")
		.attr("style","opacity:0;animation:none;transition:none")
		.append(ul);


		if (items.length > 0) {
			setTimeout(() => {

				if (x + xOffset + menu.width() > $(document).width()) {
					x = $(document).width() - menu.width() - xOffset - xOffset;
				}

				if (y + yOffset + menu.height() > $(document).height()) {
					y = $(document).height() - menu.height();
				}

				menu.attr("style",`left:${x + xOffset}px!important;top:${y + yOffset}px!important`)


			},20);
		} else {
			menu.remove();
			return null;
		}

		return menu;
	}


}
