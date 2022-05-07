/*
	UIModal.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils";

export class UIModal {
	modalRoot: string = "#settings-modal";
	sharedRoot: boolean = false;
	element: JQuery;

	constructor() {

	}

	display(): void {

		console.log( $(this.modalRoot)[0])

		if (typeof $(this.modalRoot)[0] !== "undefined") {
			window.mtdPrepareWindows();
			new TD.components.GlobalSettings;

			$(this.modalRoot + ">.mdl").remove();
			$(this.modalRoot).append(this.element);
		} else {
			window.mtdPrepareWindows();
			$(".js-modals-container").append(
				make("div").addClass("ovl mtd-login-overlay").attr("style","display: block;").append(this.element).click(event => {
					if (event.currentTarget === event.target) {
						window.mtdPrepareWindows();
					}
				})
			);
		}
	}

	dismiss(): void {
		this.element.remove?.();
		if (!this.sharedRoot && this.modalRoot !== ".login-container") {
			$(this.modalRoot).attr("style","display: none;")
		}
	}
}
