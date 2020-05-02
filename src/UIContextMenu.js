import { make, exists } from "./Utils.js";
import { contextMenuFunctions } from "./ContextMenuFunctions.js";
import { getPref } from "./StoragePreferences.js";
import { I18n } from "./I18n.js";

let debugSettings = false;

/*
	Helper function to create a context menu item
*/

function makeCMItem(p) {
	if (useNativeContextMenus) {
		let dataact = p.dataaction;
		let data = p.data;
		let nativemenu = { label:p.text, click() {contextMenuFunctions[dataact](data)}, enabled:p.enabled };
		//nativemenu.click = ;
		return nativemenu;
	}
	let a = make("a").attr("href","#").attr("data-action",p.dataaction).html(p.text).addClass("mtd-context-menu-item");
	let li = make("li").addClass("is-selectable").append(a);

	if (p.enabled === false) { // Crucially, also not undefined!
		a.attr("disabled","disabled");
	} else {
		//a.click(contextMenuFunctions[p.dataaction]);

		a.click(() => {
			if (p.mousex && p.mousey) {
				document.elementFromPoint(p.mousex, p.mousey).focus();
			}
			contextMenuFunctions[p.dataaction](p.data);
			clearContextMenu();
		});
	}

	return li;
}


/*
	Helper function to create a context menu divider
*/

function makeCMDivider() {
	if (useNativeContextMenus) {
		return {type:'separator'}
	}
	return make("div").addClass("drp-h-divider");
}

/*
	Function that clears a context menu after it's been dismissed
*/

export function clearContextMenu() {
	let removeMenu = $(".mtd-context-menu")
	removeMenu.addClass("mtd-fade-out").on("animationend",() => {
		removeMenu.remove();
	});
}

/*
	Helper function for the app to construct context menus that will be displayed
*/

export function buildContextMenu(p) {
	let items = [];
	let x = p.x;
	let y = p.y;

	const xOffset = 2;
	const yOffset = 12;

	if ($(".mtd-context-menu").length > 0) {
		let removeMenu = $(".mtd-context-menu");
		removeMenu.addClass("mtd-fade-out");
		removeMenu.on("animationend", () => {
			removeMenu.remove();
		})
	}

	if ($(document.elementFromPoint(x,y)).hasClass("mtd-context-menu-item")) {
		return;
	}

	if (p.isEditable || (exists(p.selectionText) && p.selectionText.length > 0)) {
		if (p.isEditable) {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"undo",text:I18n("Undo"),enabled:p.editFlags.canUndo}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"redo",text:I18n("Redo"),enabled:p.editFlags.canRedo}));
			items.push(makeCMDivider());
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"cut",text:I18n("Cut"),enabled:p.editFlags.canCut}));
		}
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copy",text:I18n("Copy"),enabled:p.editFlags.canCopy}));
		if (p.isEditable) {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"paste",text:I18n("Paste"),enabled:p.editFlags.canPaste}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"selectAll",text:I18n("Select All"),enabled:p.editFlags.canSelectAll}));
		}
		items.push(makeCMDivider());
	}

	if (p.linkURL !== '' && p.linkURL !== "https://tweetdeck.twitter.com/#") {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openLink",text:I18n("Open link in browser"),enabled:true,data:p.linkURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyLink",text:I18n("Copy link address"),enabled:true,data:p.linkURL}));
		items.push(makeCMDivider());
	}

	if (p.srcURL !== '') {
		if (exists(p.mediaType) && p.mediaType === "video") {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openImage",text:I18n("Open video in browser"),enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"saveImage",text:I18n("Save video..."),enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImageURL",text:I18n("Copy video address"),enabled:true,data:p.srcURL}));
		} else {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openImage",text:I18n("Open image in browser"),enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImage",text:I18n("Copy image"),enabled:true,data:{x:x,y:y}}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"saveImage",text:I18n("Save image..."),enabled:true,data:p.srcURL}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImageURL",text:I18n("Copy image address"),enabled:true,data:p.srcURL}));
		}

		items.push(makeCMDivider());
	}

	if (getPref("mtd_inspectElement") || isDev) {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"inspectElement",text:I18n("Inspect element"),enabled:true,data:{x:x,y:y}}));
	}

	if (debugSettings) {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"newSettings",text:I18n("Settings"),enabled:true,data:{x:x,y:y}}));
	}

	if (useNativeContextMenus) {
		return items;
	}

	let ul = make("ul");

	for(let i = 0; i < items.length; i++){
		ul.append(items[i]);
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
		menu.addClass("hidden");
	}

	return menu;
}
