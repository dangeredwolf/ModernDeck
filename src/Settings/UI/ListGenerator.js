/*
	Settings/UI/ListGenerator.js

	Copyright (c) 2014-2021 dangered wolf, et al
	Released under the MIT License
*/

import { make } from "./../../Utils.js";
import { evaluateOrReturn } from "./../Util.js";

import "mustache";

const listItemMustache = `
<mwc-list-item graphic="avatar" twoline>
	<span class="mtd-settings-offset-span">{{sectionName}}</span>
	<mwc-icon slot="graphic" style="background-color: {{color}};" class="{{iconClass}}">{{iconName}}</mwc-icon>
	<span slot="secondary">{{subtext}}</span>
</mwc-list-item>`

export function generateList(settingsData) {
	let rootList = make("mwc-list");
	for (let key in settingsData) {
		let settingsItem = settingsData[key];
		rootList.append(
			$(Mustache.render(
				listItemMustache,
				{
					sectionName: settingsItem.name || "Setting",
					color: settingsItem.color || "#444",
					subtext: settingsItem.subtext || "",
					iconClass: settingsItem.iconClass || "",
					iconName: settingsItem.iconName || "settings"
				}
			))
		)
	}

	return rootList;

}
