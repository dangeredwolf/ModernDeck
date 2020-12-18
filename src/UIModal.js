/*
	UIModal.js

	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./Utils.js";

export class UIModal {
	modalRoot = "#settings-modal";
	sharedRoot = false;

	constructor() {

	}

	display() {

		console.log( $(this.modalRoot)[0])

		if (typeof $(this.modalRoot)[0] !== "undefined") {
			new TD.components.GlobalSettings;

			$(this.modalRoot + ">.mdl").remove();
			$(this.modalRoot).append(this.element);
		} else {
			mtdPrepareWindows();
			$(".js-modals-container").append(
				make("div").addClass("ovl mtd-login-overlay").attr("style","display: block;").append(this.element).click(event => {
					if (event.currentTarget === event.target) {
						mtdPrepareWindows();
					}
				})
			);
		}
	}

	dismiss() {
		this.element.remove?.();
		if (!this.sharedRoot) {
			$(this.modalRoot).attr("style","display: none;")
		}
	}
}
