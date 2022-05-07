/*
	ForceFeatureFlags.ts

	These are features that can be used to force enable tweetdeck developer features.
	Code updated by @pixeldesu, DeckHackers, et al
*/

export function processForceFeatureFlags() {
	TD.config.config_overlay = {
		tweetdeck_devel: { value: true },
		tweetdeck_dogfood: { value: true },
		tweetdeck_insights: { value: true },
		tweetdeck_content_user_darkmode: { value: true },
		tweetdeck_subscriptions_debug: { value: true },
		tweetdeck_live_engagements: { value: true },
		tweetdeck_content_search_darkmode: { value: true },
		tweetdeck_content_render_search_tweets: { value: true },
		tweetdeck_content_render_user_tweets: { value: true },
		tweetdeck_uiv: { value: true },
		tweetdeck_premium_trends: { value: true },
		tweetdeck_create_moment_pro: { value: true },
		tweetdeck_gdpr_consent: { value: true },
		tweetdeck_gdpr_updates: { value: true },
		tweetdeck_premium_analytics: { value: true },
		tweetdeck_whats_happening: { value: true },
		tweetdeck_activity_polling: { value: true },
		tweetdeck_beta: { value: true },
		tweetdeck_system_font_stack: { value: true },
		tweetdeck_show_release_notes_link: { value: true },
		tweetdeck_searches_with_negation: { value: true },
		twitter_text_emoji_counting_enabled: { value: true },
		tweetdeck_trends_column: { value: true },
		tweetdeck_scheduled_tweet_ephemeral: { value: true },
		twitter_weak_maps: { value: true },
		tweetdeck_activity_streaming: { value: true },
		tweetdeck_rweb_composer: { value: true },
		tweetdeck_gryphon_beta_bypass_enabled: { value: true }
	}

	TD.config.scribe_debug_level = 4
	TD.config.debug_level = 4
	TD.config.debug_menu = true
	TD.config.debug_trace = true
	TD.config.debug_checks = true
	TD.config.flight_debug = true
	//TD.config.debug_highlight_streamed_chirps = true
	//TD.config.debug_highlight_visible_chirps = true
	TD.config.sync_period = 600
	TD.config.force_touchdeck = true
	TD.config.internal_build = true
	TD.config.help_configuration_overlay = true
	TD.config.disable_metrics_error = true
	TD.config.disable_metrics_event = true

	TD.controller.stats.setExperiments({
		config: {
			live_engagement_in_column_8020: {
				value: 'live_engagement_enabled'
			},
			hosebird_to_rest_activity_7989: {
				value: 'rest_instead_of_hosebird'
			},
			tweetdeck_uiv_7739: {
				value: 'uiv_images'
			},
			hosebird_to_content_search_7673: {
				value: 'search_content_over_hosebird'
			},
			cards_in_td_columns_8351: {
				value: 'cards_in_td_columns_enabled'
			}
		}
	});
}
