/*
	UIModal.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

export class UIModal {
	modalRoot = "#settings-modal";
	sharedRoot = false;

	constructor() {

	}

	display() {
		new TD.components.GlobalSettings;

		$(this.modalRoot + ">.mdl").remove();
		$(this.modalRoot).append(this.element);
	}

	dismiss() {
		this.element.remove?.();
		if (!this.sharedRoot) {
			$(this.modalRoot).attr("style","display: none;")
		}
	}
}
