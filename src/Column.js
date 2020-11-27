/*
	Column.js

	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT License
*/

import { getPref } from "./StoragePreferences.js"

export function getColumnFromColumnNumber(num) {
	let result;
	$(".column").each((i, col) => {
		if (typeof $(col).data("column") !== "undefined") {
			if (parseInt($(col).data("column").match(/s\d+/g)[0].substr(1)) === num) {
				result = col;
			}
		}
	})
	return $(result);
}

export function getColumnNumber(col) {
	return parseInt(col.data("column").match(/s\d+/g)[0].substr(1))
}

export function updateColumnVisibility() {

	if (getPref("mtd_column_visibility") === false || isInWelcome) {
		return allColumnsVisible()
	}

	$(".column-content:not(.mtd-example-column)").attr("style","display:block");

	setTimeout(() => { // wait for redraw
		$(".column").each((a, element) => {
			if ($(element).visible(true)) {
				$(element).find(".column-content:not(.mtd-example-column)").attr("style","display:block")
			} else {
				$(element).find(".column-content:not(.mtd-example-column)").attr("style","display:none")
			}
		});
	},20)

}

export function allColumnsVisible() {
	$(".column-content:not(.mtd-example-column)").attr("style","display:block");
}

export function updateColumnTypes() {
	TD.controller.columnManager.getAllOrdered().forEach(column => {
		if (!!column && !!column.ui) {
			$(`.js-column[data-column="${column.ui.state.columnKey}"]`).attr("data-mtd-column-type", column._feeds[0].state.type);
		}
	})
}
