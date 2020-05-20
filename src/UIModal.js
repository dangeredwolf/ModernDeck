
export class UIModal {
	modalRoot = "#settings-modal"

	constructor() {

	}

	display() {
		new TD.components.GlobalSettings;

		$(this.modalRoot + ">.mdl").remove();
		$(this.modalRoot).append(this.element);
	}

	dismiss() {
		this.element.remove?.();
	}
}
