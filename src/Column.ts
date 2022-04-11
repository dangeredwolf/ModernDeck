/*
	Column.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getPref } from "./StoragePreferences"

import { TweetDeckObject } from "./Types/TweetDeck";
declare let TD: TweetDeckObject;

export const getColumnFromColumnNumber = (num: number) : JQuery => {
	let result;
	$(".column").each((_i: number, col: HTMLElement) => {
		if (typeof $(col).data("column") !== "undefined") {
			if (parseInt($(col).data("column").match(/s\d+/g)[0].substr(1)) === num) {
				result = col;
			}
		}
	})
	return $(result);
}

export const getColumnNumber = (col: JQuery) : number => {
	return parseInt(col.data("column").match(/s\d+/g)[0].substr(1))
}

export const updateColumnVisibility = () : void => {

	if (getPref("mtd_column_visibility") === false) {
		return allColumnsVisible()
	}

	$(".column-content:not(.mtd-example-column)").attr("style","display:block");

	setTimeout(() : void => { // wait for redraw
		$(".column").each((_, element: HTMLElement) : void => {
			const rect = element.getBoundingClientRect();
			const visible = (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight + rect.height) &&
				rect.right <= (window.innerWidth + rect.width)
			);

			if (visible) {
				$(element).find(".column-content:not(.mtd-example-column)").attr("style","display:block")
			} else {
				$(element).find(".column-content:not(.mtd-example-column)").attr("style","display:none")
			}
		});
	},20)

}

export const allColumnsVisible = () : void => {
	$(".column-content:not(.mtd-example-column)").attr("style","display:block");
}

export const updateColumnTypes = () : void => {
	TD.controller.columnManager.getAllOrdered().forEach(column => {
		if (!!column && !!column.ui) {
			$(`.js-column[data-column="${column.ui.state.columnKey}"]`).attr("data-mtd-column-type", column._feeds[0].state.type);
		}
	})
}
