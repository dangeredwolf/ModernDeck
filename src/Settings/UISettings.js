/*
	Settings/UISettings.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import { UIModal } from "./../UIModal.js";
import { make } from "./../Utils.js";
import { newSettingsData } from "./SettingsData.js"
import { generateList } from "./UI/ListGenerator.js"

import "@material/mwc-list/mwc-list-item.js";
import "@material/mwc-list/mwc-list.js";
import "@material/mwc-icon";
import "mustache";

export class UISettings extends UIModal {
	constructor() {
		super();

		this.element = make("div").addClass("mdl mtd-settings mtd-settings-new");

		this.listColumn = make("div").addClass("mtd-settings-list").append(
			generateList(newSettingsData)
		);

		/*.html(
			`<mwc-list>
				<mwc-list-item graphic="avatar" twoline>
					<span>Test</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
					<span slot="secondary">Some test settings lorem ipsum</span>
				</mwc-list-item>
				<mwc-list-item graphic="avatar" twoline>
					<span>Test</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
					<span slot="secondary">Some test settings lorem ipsum</span>
				</mwc-list-item>
				<mwc-list-item graphic="avatar" twoline>
					<span>Test</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
					<span slot="secondary">Some test settings lorem ipsum</span>
				</mwc-list-item>
				<mwc-list-item graphic="avatar" twoline>
					<span>Test</span>
					<mwc-icon slot="graphic">folder</mwc-icon>
					<span slot="secondary">Some test settings lorem ipsum</span>
				</mwc-list-item>
			</mwc-list>`
		)*/
		this.alertTitle = make("h2").addClass("mtd-alert-title").html(I18n("ModernDeck"));
		this.alertBody = make("p").addClass("mtd-alert-body").html(I18n("Alert"));
		this.alertButtonContainer = make("div").addClass("mtd-alert-button-container");

		this.alertButton = make("button").addClass("btn-primary btn mtd-alert-button").html(I18n("OK"));

		this.alertButtonContainer.append(this.alertButton);

		this.element.append(this.listColumn);

		this.display();
	}

	display(page) {
		super.display();
	}
}
