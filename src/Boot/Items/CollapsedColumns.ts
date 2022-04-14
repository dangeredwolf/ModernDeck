/*
	Boot/Items/CollapsedColumns.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { getColumnNumber } from "../../Column";
import { getPref, setPref } from "../../StoragePreferences";

export const initCollapsedColumns = () => {
    
	$(document).on("mouseup",(e) => {
		try {
			if ($(e.target.parentElement).is("[data-action=\"mtd_collapse\"]")) {
				//                        i or span     button  .button-group   .button-tray     form .js-column-options .column-options .column-content .column-panel .column-holder .column
				let ohGodThisIsHorrible = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

				if ($(ohGodThisIsHorrible).hasClass("column-holder")) {
					ohGodThisIsHorrible = ohGodThisIsHorrible.parentElement;
				}
				$(ohGodThisIsHorrible).toggleClass("mtd-collapsed").find("[data-testid=\"optionsToggle\"],[data-action=\"options\"]").click();

				$(document).trigger("uiMTDColumnCollapsed");

				let arr = getPref("mtd_collapsed_columns", []);
				if ($(ohGodThisIsHorrible).hasClass("mtd-collapsed")) {
					arr.push(getColumnNumber($(ohGodThisIsHorrible)));
				} else {
					let colNum = getColumnNumber($(ohGodThisIsHorrible));
					arr = arr.filter((num: number) => num !== colNum)
				}

				setPref("mtd_collapsed_columns",arr);

			} else if ($(e.target.parentElement).is("[data-testid=\"optionsToggle\"],[data-action=\"options\"]") &&
			$(e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement).hasClass("mtd-collapsed")) {
				let ohGodThisIsEvenWorseWhatTheHeck = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
				if ($(ohGodThisIsEvenWorseWhatTheHeck).hasClass("column-holder")) {
					ohGodThisIsEvenWorseWhatTheHeck = ohGodThisIsEvenWorseWhatTheHeck.parentElement;
				}
				$(ohGodThisIsEvenWorseWhatTheHeck).removeClass("mtd-collapsed");
				$(document).trigger("uiMTDColumnCollapsed");
				let arr = getPref("mtd_collapsed_columns", []);
	 			let colNum = getColumnNumber($(ohGodThisIsEvenWorseWhatTheHeck));
	 			arr = arr.filter((num: number) => num !== colNum)
				setPref("mtd_collapsed_columns",arr);
			}
		} catch (e) {

		}
	});
}