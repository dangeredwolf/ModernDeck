/*
	Settings/UI/EnumPage/Mutes.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "../../../I18n";
import { make } from "../../../Utils";
import { SettingsEnumPage } from "../../SettingsEnumPage";

export class MuteEnumPage extends SettingsEnumPage {
	filterInput: JQuery<HTMLElement>;
	selectFilterType: JQuery<HTMLElement>;
	muteButton: JQuery<HTMLElement>;
	muteTypes: JQuery<HTMLElement>;
	muteInput: JQuery<HTMLElement>;
	muteAdd: JQuery<HTMLElement>;
	filterList: JQuery<HTMLElement>;
	filterListGroup: JQuery<HTMLElement>;

	constructor(projection: JQuery<HTMLElement>) {
		super(projection);

		this.filterInput = make("input").addClass("js-filter-input").attr("name","filter-input").attr("size",30).attr("type","text").attr("placeholder",I18n("Enter a word or phrase"))

		this.selectFilterType = make("select").attr("name","filter").addClass("js-filter-types").append(
			make("option").attr("value","phrase").html(I18n("Words or phrases")),
			make("option").attr("value","source").html(I18n("Tweet source"))
		).change(() => {
			this.filterInput.attr("placeholder", this.selectFilterType.val() === "phrase" ? I18n("Enter a word or phrase") : I18n("eg TweetSpamApp"))
		});

		this.muteButton = make("button")
			.attr("name","add-filter")
			.addClass("js-add-filter btn-on-dark disabled btn-primary")
			.append(make("i").addClass("material-icon").html("volume_off"))
			.click(() => {
				if ((this.filterInput.val() as string).length > 0) {
					TD.controller.filterManager.addFilter(
						this.selectFilterType.val() as string,
						this.filterInput.val() as string,
						false
					);

					this.updateFilterPanel(this.filterList);
				}
			}
		);

		this.muteTypes = make("div").addClass("control-group").append(
			make("label").attr("for","filter-types").addClass("control-label").html(I18n("Mute")),
			make("div").addClass("controls").append(this.selectFilterType)
		)

		this.muteInput = make("div").addClass("control-group").append(
			make("label").attr("for","filter-input").addClass("control-label").html(I18n("Matching")),
			make("div").addClass("controls").append(this.filterInput)
		).on("input", () => {
			if ((this.muteInput.val() as string).length > 0) {
				this.muteButton.removeClass("disabled");
			} else {
				this.muteButton.addClass("disabled");
			}
		});

		this.muteAdd = make("div").addClass("control-group").append(
			make("div").addClass("controls js-add-filter-container").append(this.muteButton)
		)

		this.filterList = make("ul");
		this.filterListGroup = make("div").addClass("js-filter-list").append(this.filterList)

		let form = make("form").addClass("js-global-settings frm").attr("id","global-settings").attr("action","#").append(
			make("fieldset").attr("id","global_filter_settings").append(
				this.muteTypes,
				this.muteInput,
				this.muteAdd,
				this.filterListGroup
			)
		)

		this.updateFilterPanel(this.filterList);

		projection.append(form);
	}

	
	/* Updates the mute list UI from twitter's backend */

	updateFilterPanel(filterList: JQuery<HTMLElement>) {
		let filters = TD.controller.filterManager.getAll();
		filterList.empty();

		for (let filter in filters) {
			let myFilter = filters[filter];

			if (myFilter.type !== "source" && myFilter.type !== "phrase") {
				continue;
			}

			filterList.append(
				make("li").addClass("list-filter").append(
					make("div").addClass("mtd-mute-text mtd-mute-text-" + (myFilter.type === "source" ? "source" : "")),
					make("em").html(myFilter.value),
					make("input")
						.attr("type","button")
						.attr("name","remove-filter")
						.attr("value","Remove")
						.addClass("js-remove-filter small btn btn-negative")
						.click(() => {
							TD.controller.filterManager.removeFilter(myFilter);
							this.updateFilterPanel(filterList);
						})
				)
			);

		}

		return filterList;
	}

}