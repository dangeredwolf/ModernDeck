export class UIColorPicker {
	element;

	constructor() {
		this.element = make("div").addClass("mtd-color-picker");
		
	}

	display() {
		$(body).append(this.element)
	}
}
