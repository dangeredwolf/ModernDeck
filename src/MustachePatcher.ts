/*
	MustachePatcher.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { spinnerSmall, spinnerLarge, spinnerTiny, buttonSpinner } from "./DataMustaches";

declare let TD_mustaches: {
	[key: string]: string;
};

const patchMustache = (mustache: string, find: string | RegExp, replace: string): void => {
	if (typeof TD_mustaches[mustache + ".mustache"] !== "undefined") {
		if (TD_mustaches[mustache + ".mustache"].match(find)) {
			TD_mustaches[mustache + ".mustache"] = TD_mustaches[mustache + ".mustache"].replace(find, replace);
		} else {
			console.warn(`Could not apply patch to ${mustache}.mustache because it doesn't contain ${find}`);
			console.warn(`Mustache contents: ${TD_mustaches[mustache + ".mustache"]}`);
		}
	} else {
		console.warn(`Could not apply patch to ${mustache}.mustache because it doesn't exist`);
	}
}

const replaceMustache = (mustache: string, replace: string): void => {
	if (typeof TD_mustaches[mustache + ".mustache"] !== "undefined") {
		TD_mustaches[mustache + ".mustache"] = replace;
	} else {
		console.warn(`Could not replace ${mustache}.mustache because it doesn't exist`);
	}
}

/* modifies tweetdeck mustaches, replacing spinners, etc */

export const processMustaches = (): void => {
	replaceMustache("settings/global_setting_filter_row", `
		<li class="list-filter cf"> {{_i}}
			<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div>
			{{>text/global_filter_value}}{{/i}}
			<input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative">
		</li>
	`);

	patchMustache("media/native_video", `preload="auto"`, `preload="auto" autoplay="true"`);

	if (!window.html.hasClass("mtd-disable-css")) {

		replaceMustache("spinner_large", spinnerLarge);
		replaceMustache("spinner_large_white", spinnerLarge);
		replaceMustache("spinner", spinnerSmall);

		patchMustache("column_loading_placeholder", "<span class=\"spinner-small\"></span>", spinnerSmall);
		patchMustache("column", "Loading...", "");

		patchMustache("media/media_gallery", `<div class="js-embeditem med-embeditem"> `, `<div class="js-embeditem med-embeditem"> ` + spinnerLarge);
		patchMustache("video_preview", `<div class="processing-video-spinner"></div>`, spinnerSmall);

		patchMustache("modal", `<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}" />`, spinnerSmall);
		patchMustache("twitter_profile", `<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}">`, spinnerSmall);
		patchMustache("follow_button", `<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>`, spinnerTiny);

		patchMustache("compose/compose_inline_reply", `<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>`, buttonSpinner);
		patchMustache("buttons/favorite", `<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>`, buttonSpinner)
		patchMustache("embed_tweet", `<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" class="embed-loading" alt="{{_i}}Loading…{{/i}}" />`, spinnerSmall);
		
		patchMustache("lists/member",`<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>`, buttonSpinner);

		patchMustache(
			"keyboard_shortcut_list",
			`<kbd class="text-like-keyboard-key">X</kbd>  Expand/Collapse navigation</dd>`,
			`<kbd class="text-like-keyboard-key">Q</kbd> Open Navigation Drawer/Menu</dd>`
		);
	
		patchMustache("column/column_options",
			// Note, be careful with replacing the find, because it is supposed to only be on one line. We broke it up for clarity.
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn {{`,
	
			`<div class="button-group">
				<button type="button" class="Button--link btn-options-tray padding-hn" data-action="mtd_collapse">
					<i class='icon material-icon'>first_page</i>
					<span class="label">{{_i}}Collapse{{/i}}</span>
				</button>
			</div>
			<div class="button-group">
				<button type="button" class="Button--link btn-options-tray padding-hn {{`
		)

	}

	patchMustache("compose/docked_compose",
		`<button class="js-add-image-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled"> ` +
			`<i class="Icon icon-camera txt-size--18"></i> ` + 
			`<span class="js-add-image-button-label label padding-ls">{{_i}}Add image{{/i}}</span> `+ 
		`</button> ` + 
		`<div class="js-scheduler"> ` +
			`<button class="js-schedule-button js-show-tip btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled"> ` +
				`<i class="Icon icon-schedule txt-size--18"></i> ` +
				`<span class="js-schedule-button-label label padding-ls">{{_i}}Schedule Tweet{{/i}}</span> ` +
			`</button> ` +
			`<span class="js-schedule-datepicker-holder"/> ` +
		`</div> ` +
		`<div class="js-tweet-type-button"> ` +
			`<button class="js-tweet-button btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12"> ` +
				`<i class="Icon icon-twitter-bird txt-size--18"></i> ` +
				`<span class="label padding-ls">{{_i}}New Tweet{{/i}}</span> ` +
			`</button> ` +
			`<button class="js-dm-button js-show-tip btn btn-on-blue full-width txt-left padding-v--6 padding-h--12 margin-b--12"> ` +
				`<i class="Icon icon-message txt-size--18"></i> ` +
				`<span class="label padding-ls">{{_i}}Direct message{{/i}}</span> </button>`,
	"")
			
	patchMustache("compose/docked_compose",
	`<div class="js-send-button-container spinner-button-container"> ` +
		`<button class="js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12 is-disabled"> {{_i}}Tweet{{/i}}> </button> ` +
		`<i class="js-compose-sending-success icon-center-16 compose-send-button-success icon icon-check is-hidden"></i> ` +
		`<span class="js-media-upload-progress media-upload-progress is-hidden"></span> ` +
		`<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i> ` +
	`</div>`, "")

	patchMustache("compose/docked_compose", `</textarea>`, 
	`</textarea>
	<button class="js-add-image-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled" data-original-title="Add images or video">
		<i class="Icon icon-camera txt-size--18"></i>
		<span class="js-add-image-button-label label padding-ls">{{_i}}Add image{{/i}}</span>
	</button>
	<button class="mtd-gif-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12" data-original-title>
		<i class="Icon icon-gif txt-size--18"></i>
		<span class="label padding-ls">{{_i}}Add GIF{{/i}}</span>
	</button>
	<div class="js-tweet-type-button">
		<button class="js-tweet-button btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12">
			<i class="Icon icon-twitter-bird txt-size--18"></i> <span class="label padding-ls">{{_i}}New Tweet{{/i}}</span>
		</button>
		<button class="js-dm-button js-show-tip btn btn-on-blue full-width txt-left padding-v--6 padding-h--12 margin-b--12">
			<i class="Icon icon-message txt-size--18"></i> <span class="label padding-ls">{{_i}}Direct message{{/i}}</span>
		</button>
		<div class="js-scheduler">
			<button class="js-schedule-button js-show-tip btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled">
				<i class="Icon icon-schedule txt-size--18"></i> <span class="js-schedule-button-label label padding-ls">{{_i}}Schedule Tweet{{/i}}</span>
			</button>
			<span class="js-schedule-datepicker-holder"/>
		</div>
		<div class="js-send-button-container spinner-button-container">
			<button class="js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12 is-disabled">
				{{_i}}Tweet{{/i}}
			</button>
			<i class="js-compose-sending-success icon-center-16 compose-send-button-success icon icon-check is-hidden"></i>
			<span class="js-media-upload-progress media-upload-progress is-hidden"></span>
			<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>
		</div>`
	)
	
	patchMustache("compose/docked_compose", `<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>`, buttonSpinner)

	patchMustache("menus/actions", "Embed this Tweet", "Embed Tweet");
	patchMustache("menus/actions", "Copy link to this Tweet", "Copy link address");
	patchMustache("menus/actions", "Share via Direct Message", "Share via message");
	patchMustache("menus/actions", "Send a Direct Message", "Send message");
	patchMustache("menus/actions", "Add or remove from Lists…", "Add/remove from list...");
	patchMustache("menus/actions", "See who quoted this Tweet", "View quotes");
	patchMustache("menus/actions", "Mute this conversation", "Mute conversation");
	patchMustache("menus/actions", "Unmute this conversation", "Unmute conversation");
	patchMustache("menus/actions", "Translate this Tweet", "Translate Tweet");
	patchMustache("menus/actions", "{{_i}}Delete{{/i}}", "{{_i}}Delete Tweet{{/i}}");
	patchMustache("menus/actions", /\…/g, "...");
	patchMustache("menus/actions", /Flagged \(learn more\)/g, "Flagged");
}
