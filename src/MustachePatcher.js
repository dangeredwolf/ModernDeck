
import { spinnerSmall, spinnerLarge, spinnerTiny, buttonSpinner } from "./DataMustaches.js";

/* modifies tweetdeck mustaches, replacing spinners, etc */

export function processMustaches() {
	if (typeof TD_mustaches["settings/global_setting_filter_row.mustache"] !== "undefined")
		TD_mustaches["settings/global_setting_filter_row.mustache"] =
			'<li class="list-filter cf"> {{_i}}\
				<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div>\
				{{>text/global_filter_value}}{{/i}}\
				<input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative">\
			</li>';

	if (typeof TD_mustaches["column/column_options.mustache"] !== "undefined")
		TD_mustaches["column/column_options.mustache"] =
		TD_mustaches["column/column_options.mustache"].replace(
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn {{^isClearable}}is-invisible{{/isClearable}}" data-action="clear"> <i class="icon icon-clear-timeline"></i> <span class="label">{{_i}}Clear{{/i}}</span> </button> </div>`,
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn" data-action="mtd_collapse"> <i class='icon material-icon'>first_page</i> <span class="label">{{_i}}Collapse{{/i}}</span> </button> </div>` +
			`<div class="button-group"> <button type="button" class="Button--link btn-options-tray padding-hn {{^isClearable}}is-invisible{{/isClearable}}" data-action="clear"> <i class="icon icon-clear-timeline"></i> <span class="label">{{_i}}Clear{{/i}}</span> </button> </div>`
		)

	if (!html.hasClass("mtd-disable-css")) {

		if (typeof TD_mustaches["column_loading_placeholder.mustache"] !== "undefined")
			TD_mustaches["column_loading_placeholder.mustache"] =
				TD_mustaches["column_loading_placeholder.mustache"].replace("<span class=\"spinner-small\"></span>",spinnerSmall);

		if (typeof TD_mustaches["spinner_large.mustache"] !== "undefined")
			TD_mustaches["spinner_large.mustache"] = spinnerLarge;

		if (typeof TD_mustaches["spinner_large_white.mustache"] !== "undefined")
			TD_mustaches["spinner_large_white.mustache"] = spinnerLarge;

		if (typeof TD_mustaches["spinner.mustache"] !== "undefined")
			TD_mustaches["spinner.mustache"] = spinnerSmall;

		if (typeof TD_mustaches["column.mustache"] !== "undefined")
			TD_mustaches["column.mustache"] =
				TD_mustaches["column.mustache"].replace("Loading...","");

		if (typeof TD_mustaches["media/media_gallery.mustache"] !== "undefined")
			TD_mustaches["media/media_gallery.mustache"] =
				TD_mustaches["media/media_gallery.mustache"].replace(
					'<div class="js-embeditem med-embeditem"> ',
					'<div class="js-embeditem med-embeditem"> ' + spinnerLarge
				);

		if (typeof TD_mustaches["modal.mustache"] !== "undefined")
			TD_mustaches["modal.mustache"] =
				TD_mustaches["modal.mustache"].replace(
					'<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}" />',
					spinnerSmall
				);

		if (typeof TD_mustaches["twitter_profile.mustache"] !== "undefined")
			TD_mustaches["twitter_profile.mustache"] =
				TD_mustaches["twitter_profile.mustache"].replace(
					'<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}">',
					spinnerSmall
				);

		if (typeof TD_mustaches["follow_button.mustache"] !== "undefined")
			TD_mustaches["follow_button.mustache"] =
				TD_mustaches["follow_button.mustache"].replace(
					'<img src="{{#asset}}/web/assets/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> ',
					spinnerTiny
				);

		if (typeof TD_mustaches["video_preview.mustache"] !== "undefined")
			TD_mustaches["video_preview.mustache"] =
				TD_mustaches["video_preview.mustache"].replace(
					'<div class="processing-video-spinner"></div>',
					spinnerSmall
				);

		if (typeof TD_mustaches["login/2fa_verification_code.mustache"] !== "undefined")
			TD_mustaches["login/2fa_verification_code.mustache"] =
				TD_mustaches["login/2fa_verification_code.mustache"].replace(
					'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner"></i>',
					buttonSpinner
				);

		if (typeof TD_mustaches["login/login_form_footer.mustache"] !== "undefined")
			TD_mustaches["login/login_form_footer.mustache"] =
				TD_mustaches["login/login_form_footer.mustache"].replace(
					'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner"></i>',
					buttonSpinner
				);

		if (typeof TD_mustaches["compose/compose_inline_reply.mustache"] !== "undefined")
			TD_mustaches["compose/compose_inline_reply.mustache"] =
				TD_mustaches["compose/compose_inline_reply.mustache"].replace(
					'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>',
					buttonSpinner
				);

		if (typeof TD_mustaches["buttons/favorite.mustache"] !== "undefined")
			TD_mustaches["buttons/favorite.mustache"] =
				TD_mustaches["buttons/favorite.mustache"].replace(
					'<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>',
					buttonSpinner
				);

		if (typeof TD_mustaches["embed_tweet.mustache"] !== "undefined")
			TD_mustaches["embed_tweet.mustache"] =
				TD_mustaches["embed_tweet.mustache"].replace(
					'<img src="{{#asset}}/global/backgrounds/spinner_large_white.gif{{/asset}}" class="embed-loading" alt="{{_i}}Loading…{{/i}}" />',
					spinnerSmall
				);

		if (typeof TD_mustaches["follow_button.mustache"] !== "undefined")
			TD_mustaches["follow_button.mustache"] =
				TD_mustaches["follow_button.mustache"].replace(
					'<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>',
					buttonSpinner
				);

		if (typeof TD_mustaches["lists/member.mustache"] !== "undefined")
			TD_mustaches["lists/member.mustache"] =
				TD_mustaches["lists/member.mustache"].replace(
					'<span> <img src="{{#asset}}/global/backgrounds/spinner_small_trans.gif{{/asset}}" alt="{{_i}}Loading…{{/i}}"> </span>',
					buttonSpinner
				);

		if (typeof TD_mustaches["keyboard_shortcut_list.mustache"] !== "undefined")
			TD_mustaches["keyboard_shortcut_list.mustache"] =
				TD_mustaches["keyboard_shortcut_list.mustache"].replace(
					"<kbd class=\"text-like-keyboard-key\">X</kbd>  Expand/Collapse navigation</dd>",
					"<kbd class=\"text-like-keyboard-key\">Q</kbd> Open Navigation Drawer/Menu</dd>"
				)
	}

	// if (typeof TD_mustaches["media/native_video.mustache"] !== "undefined")
	// 	TD_mustaches["media/native_video.mustache"] =
	// 		"<div class=\"position-rel\">\
	// 		<iframe src=\"{{videoUrl}}\" class=\"js-media-native-video {{#isPossiblySensitive}}is-invisible{{/isPossiblySensitive}}\"\
	// 		height=\"{{height}}\" width=\"{{width}}\" frameborder=\"0\" scrolling=\"no\" allowfullscreen style=\"margin: 0px; padding: 0px; border: 0px;\">\
	// 		</iframe> {{> status/media_sensitive}} </div>";

	if (typeof TD_mustaches["compose/docked_compose.mustache"] !== "undefined" && !window.useSafeMode)

		TD_mustaches["compose/docked_compose.mustache"] = TD_mustaches["compose/docked_compose.mustache"].replace(`<button class="js-add-image-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled"> <i class="Icon icon-camera txt-size--18"></i> <span class="js-add-image-button-label label padding-ls">{{_i}}Add image{{/i}}</span> </button> <div class="js-scheduler"> <button class="js-schedule-button js-show-tip btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled"> <i class="Icon icon-schedule txt-size--18"></i> <span class="js-schedule-button-label label padding-ls">{{_i}}Schedule Tweet{{/i}}</span> </button> <span class="js-schedule-datepicker-holder"/> </div> <div class="js-tweet-type-button"> <button class="js-tweet-button btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12"> <i class="Icon icon-twitter-bird txt-size--18"></i> <span class="label padding-ls">{{_i}}New Tweet{{/i}}</span> </button> <button class="js-dm-button js-show-tip btn btn-on-blue full-width txt-left padding-v--6 padding-h--12 margin-b--12"> <i class="Icon icon-message txt-size--18"></i> <span class="label padding-ls">{{_i}}Direct message{{/i}}</span> </button>`,"").replace(`<div class="js-send-button-container spinner-button-container"> <button class="js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12 is-disabled"> {{_i}}Tweet{{/i}}> </button> <i class="js-compose-sending-success icon-center-16 compose-send-button-success icon icon-check is-hidden"></i> <span class="js-media-upload-progress media-upload-progress is-hidden"></span> <i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i> </div>`,"").replace(`</textarea>`,`</textarea> <button class="js-add-image-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled" data-original-title="Add images or video"> <i class="Icon icon-camera txt-size--18"></i> <span class="js-add-image-button-label label padding-ls">{{_i}}Add image{{/i}}</span> </button>  <button class="mtd-gif-button js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12" data-original-title="Add GIF"> <i class="Icon icon-gif txt-size--18"></i> <span class="label padding-ls">{{_i}}Add GIF{{/i}}</span> </button> <div class="js-scheduler"> <button class="js-schedule-button js-show-tip btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12 is-disabled"> <i class="Icon icon-schedule txt-size--18"></i> <span class="js-schedule-button-label label padding-ls">{{_i}}Schedule Tweet{{/i}}</span> </button> <span class="js-schedule-datepicker-holder"/> </div> <div class="js-tweet-type-button"> <button class="js-tweet-button btn btn-on-blue full-width txt-left margin-b--12 padding-v--6 padding-h--12"> <i class="Icon icon-twitter-bird txt-size--18"></i> <span class="label padding-ls">{{_i}}New Tweet{{/i}}</span> </button> <button class="js-dm-button js-show-tip btn btn-on-blue full-width txt-left padding-v--6 padding-h--12 margin-b--12"> <i class="Icon icon-message txt-size--18"></i> <span class="label padding-ls">{{_i}}Direct message{{/i}}</span> </button> <div class="js-send-button-container spinner-button-container"> <button class="js-send-button js-spinner-button js-show-tip Button--primary btn-extra-height padding-v--6 padding-h--12 is-disabled"> {{_i}}Tweet{{/i}}> </button> <i class="js-compose-sending-success icon-center-16 compose-send-button-success icon icon-check is-hidden"></i> <span class="js-media-upload-progress media-upload-progress is-hidden"></span> <i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i> </div>`).replace(
			'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>',
					buttonSpinner
				);


	if (typeof TD_mustaches["menus/actions.mustache"] !== "undefined") {
		TD_mustaches["menus/actions.mustache"] =
			TD_mustaches["menus/actions.mustache"]
			.replace("Embed this Tweet","Embed Tweet")
			.replace("Copy link to this Tweet","Copy link address")
			.replace("Share via Direct Message","Share via message")
			//.replace("Like from accounts…","Like from...") // yeah idk why but this isn't in the context menu by default???
			.replace("Send a Direct Message","Send message")
			.replace("Add or remove from Lists…","Add/remove from list...")
			.replace("See who quoted this Tweet","View quotes")
			.replace("Flagged (learn more)","Flagged")
			.replace("Mute this conversation","Mute conversation")
			.replace("Unmute this conversation","Unmute conversation")
			.replace("Translate this Tweet","Translate Tweet")
			.replace("{{_i}}Delete{{/i}}","{{_i}}Delete Tweet{{/i}}")
			.replace(/\…/g,"...")
		;
	}
}
