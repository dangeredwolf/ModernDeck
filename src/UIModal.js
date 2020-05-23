
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
