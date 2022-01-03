/*
	UIColorPicker.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export class UIColorPicker {
	element;

	constructor() {
		this.element = make("div").addClass("mtd-color-picker");

	}

	display() {
		$(body).append(this.element)
	}
}
