/*
	Settings/UI/EnumPage/Mutes.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { AMEFilters, muteTypeAllowlist } from "../../../AME/AdvancedMuteEngine";
import { I18n } from "../../../I18n";
import { TweetDeckFilterTypes } from "../../../Types/TweetDeck";
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

	/*
		NFT_AVATAR = 'BTD_nft_avatar',
		IS_RETWEET_FROM = 'BTD_is_retweet_from',
		MUTE_USER_KEYWORD = 'BTD_mute_user_keyword',
		REGEX_DISPLAYNAME = 'BTD_mute_displayname',
		REGEX = 'BTD_regex',
		USER_REGEX = 'BTD_user_regex',
		MUTE_QUOTES = 'BTD_mute_quotes',
		USER_BIOGRAPHIES = 'BTD_user_biographies',
		DEFAULT_AVATARS = 'BTD_default_avatars',
		FOLLOWER_COUNT_LESS_THAN = 'BTD_follower_count_less_than',
		FOLLOWER_COUNT_GREATER_THAN = 'BTD_follower_count_greater_than',
		SPECIFIC_TWEET = 'BTD_specific_tweet',
		HASHTAGS_NUMBER = 'BTD_hashtags_number',
	*/

	filters = muteTypeAllowlist;

	muteLabel = {
		[TweetDeckFilterTypes.SOURCE]: I18n("Tweet source"),
		[TweetDeckFilterTypes.PHRASE]: I18n("Words or phrases"),
		[AMEFilters.MUTE_USER_KEYWORD]: I18n("Keyword from User"),
		[AMEFilters.HASHTAGS_NUMBER]: I18n("Tweets with more than X hashtags"),
		[AMEFilters.REGEX_DISPLAYNAME]: I18n("Display name (RegEx)"),
		[AMEFilters.REGEX]: I18n("Tweet text (RegEx)"),
		[AMEFilters.USER_REGEX]: I18n("Username (RegEx)"),
		[AMEFilters.USER_BIOGRAPHIES]: I18n("Words in user bio"),
		[AMEFilters.DEFAULT_AVATARS]: I18n("Users with default profile picture"),
		[AMEFilters.FOLLOWER_COUNT_LESS_THAN]: I18n("Users with fewer than X followers"),
		[AMEFilters.FOLLOWER_COUNT_GREATER_THAN]: I18n("Users with more than X followers"),
	}

	muteText = {
		[TweetDeckFilterTypes.SOURCE]: I18n("Source"),
		[TweetDeckFilterTypes.PHRASE]: I18n("Text"),
		[AMEFilters.MUTE_USER_KEYWORD]: I18n("Keyword from User"),
		[AMEFilters.HASHTAGS_NUMBER]: I18n("Number of Hashtags"),
		[AMEFilters.REGEX_DISPLAYNAME]: I18n("Display Name (RegEx)"),
		[AMEFilters.REGEX]: I18n("Text (RegEx)"),
		[AMEFilters.USER_REGEX]: I18n("Username (RegEx)"),
		[AMEFilters.USER_BIOGRAPHIES]: I18n("User Bio"),
		[AMEFilters.DEFAULT_AVATARS]: I18n("Default Profile Picture"),
		[AMEFilters.FOLLOWER_COUNT_LESS_THAN]: I18n("Minimum Followers"),
		[AMEFilters.FOLLOWER_COUNT_GREATER_THAN]: I18n("Maximum Followers"),
	}

	getPlaceholderForMuteType(type: TweetDeckFilterTypes | AMEFilters) {
		switch (type) {
			case TweetDeckFilterTypes.SOURCE:
				return I18n("eg TweetSpamApp");
			case TweetDeckFilterTypes.PHRASE:
				return I18n("Enter a word or phrase");
			case AMEFilters.MUTE_USER_KEYWORD:
				return I18n("e.g. twitter|feature");
			case AMEFilters.HASHTAGS_NUMBER:
				return I18n("Enter number of hashtags");
			case AMEFilters.REGEX_DISPLAYNAME:
			case AMEFilters.REGEX:
			case AMEFilters.USER_REGEX:
				return I18n("Enter a regular expression");
			case AMEFilters.USER_BIOGRAPHIES:
				return I18n("Enter a word or phrase");
			case AMEFilters.DEFAULT_AVATARS:
				return ""; // lol
			case AMEFilters.FOLLOWER_COUNT_LESS_THAN:
				return I18n("Enter number of followers");
			case AMEFilters.FOLLOWER_COUNT_GREATER_THAN:
				return I18n("Enter number of followers");
			default:
				return "";
		}
	}

	constructor(projection: JQuery<HTMLElement>) {
		super(projection);

		this.filterInput = make("input").addClass("js-filter-input")
							.attr("name","filter-input").attr("size",30).attr("type","text")
							.attr("placeholder",this.getPlaceholderForMuteType(TweetDeckFilterTypes.PHRASE));

		this.selectFilterType = make("select").attr("name", "filter").addClass("js-filter-types");
		
		for (const type in this.filters) {
			const filter = this.filters[type];
			// @ts-ignore
			make("option").attr("value", filter).html(this.muteLabel[(filter as TweetDeckFilterTypes | AMEFilters)]).appendTo(this.selectFilterType);
		}
		
		this.selectFilterType.change(() => {
			this.filterInput.removeAttr("disabled").removeClass("mtd-input-monospace").attr("type", "text");
			this.filterInput.attr("placeholder", this.getPlaceholderForMuteType(this.selectFilterType.val() as TweetDeckFilterTypes | AMEFilters));

			switch(this.selectFilterType.val()) {
				case AMEFilters.DEFAULT_AVATARS:
					this.filterInput.attr("disabled", "disabled");
					break;
				case AMEFilters.REGEX:
				case AMEFilters.REGEX_DISPLAYNAME:
				case AMEFilters.USER_REGEX:
					this.filterInput.addClass("mtd-input-monospace");
					this.filterInput.val(" ");
					break;
				case AMEFilters.FOLLOWER_COUNT_GREATER_THAN:
				case AMEFilters.FOLLOWER_COUNT_LESS_THAN:
					this.filterInput.addClass("mtd-input-monospace");
					this.filterInput.attr("type", "number");
					break;
			}
		});

		this.muteButton = make("button")
			.attr("name","add-filter")
			.addClass("js-add-filter btn-on-dark disabled btn-primary")
			.append(make("i").addClass("material-icon").html("volume_off"))
			.click(() => {
				if ((this.filterInput.val() as string).length > 0 || this.selectFilterType.val() === AMEFilters.DEFAULT_AVATARS) {
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
		this.filterListGroup = make("div").addClass("js-filter-list scroll-v").append(this.filterList)

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

			if (!this.filters.includes(myFilter.type as TweetDeckFilterTypes | AMEFilters)) {
				continue;
			}

			filterList.append(
				make("li").addClass("list-filter").append(
					// @ts-ignore
					make("div").addClass("mtd-mute-text").html(this.muteText[myFilter.type as TweetDeckFilterTypes | AMEFilters]),
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