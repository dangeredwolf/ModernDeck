/*
	Settings/UISettings.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import "@material/mwc-list/mwc-list-item.js";
import "@material/mwc-list/mwc-list.js";
import "@material/mwc-icon";
import "mustache";

export class UISettings extends UIModal {
	constructor() {
		super();

		this.element = make("div").addClass("mdl mtd-settings mtd-settings-new");

		this.listColumn = make("div").addClass("mtd-settings-list").html(
			`<mwc-list>
				<mwc-list-item graphic="avatar">
					<span>Avatar graphic</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
				</mwc-list-item>
				<mwc-list-item graphic="icon">
					<span>Icon graphic</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
				</mwc-list-item>
				<mwc-list-item graphic="medium">
					<span>medium graphic</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
				</mwc-list-item>
				<mwc-list-item graphic="large">
					<span>large graphic</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
				</mwc-list-item>
			</mwc-list>`
		)
		this.alertTitle = make("h2").addClass("mtd-alert-title").html(obj.title || I18n("ModernDeck"));
		this.alertBody = make("p").addClass("mtd-alert-body").html(obj.message || I18n("Alert"));
		this.alertButtonContainer = make("div").addClass("mtd-alert-button-container");

		this.alertButton = make("button").addClass("btn-primary btn mtd-alert-button").html(obj.buttonText || I18n("OK"));

		this.alertButtonContainer.append(this.alertButton);

		if (exists(obj.button2Text) || obj.type === "confirm") {
			this.alertButton2 = make("button").addClass("btn-primary btn mtd-alert-button mtd-alert-button-secondary").html(obj.button2Text || I18n("Cancel"));
			this.alertButtonContainer.append(this.alertButton2);
			this.alertButton2.click(obj.button2Click || mtdPrepareWindows);
		}

		this.alertButton.click(obj.button1Click || mtdPrepareWindows);

		this.element.append(this.listColumn);

		this.display();
	}

	display(page) {
		super();
	}
}
