var languageFull = navigator.language.replace("-","_");
var languageMain = navigator.language.substring(0,2);
var languageFallback = "en";
let displayWarning = false;
let TDiInitial;

import { exists } from "./Utils.js";
import languageData from "./DataI18n.js";


var mustachePatches = {
	// "account_selector_avatar.mustache":{
	// 	"{{screenName}}'s avatar":1
	// },
	// "account_settings_account_summary.mustache":{
	// 	"{{screenName}}'s avatar":1
	// },
	// "account_summary_inline.mustache":{
	// 	"{{screenName}}'s avatar":1
	// },
	// "actions/follow_from.mustache":{
	// 	"from":1
	// },
	// "action_header.mustache":{
	// 	"From":1
	// },
	// "actions/action_dialog.mustache":{
	// 	"Retweet with comment":1,
	// 	"Retweet":1
	// },
	// "actions/add_to_list_dialog.mustache":{
	// 	"Create new list":1
	// },
	// "actions/add_to_list_footer.mustache":{
	// 	"Create List":1
	// },
	// "add_account_info.mustache":{
	// 	"Default avatar":1,
	// 	"{{screenName}}'s avatar":1,
	// 	"Continue":1,
	// 	"Linking another account here will add":1,
	// 	"as a contributor to that account, with admin privileges.":1,
	// 	"Learn more about teams":1,
	// 	"This means that when you or anyone else logs in to TweetDeck, Twitter for iOS or Twitter for Android as":1,
	// 	"in the future, they will be able to take actions on behalf of the account you link here, as well as view and manage other team members.":1,
	// 	"If you are trying to join a shared account as a team member, ask an admin for the account to invite you as a team member instead of completing this action.":1
	// },
	// "add_image_description.mustache":{
	// 	"Your uploaded image for description":1,
	// 	"Describe this photo for the visually impaired":1
	// },
	// "app_links.mustache":{
	// 	"Terms of Service":1
	// },
	// "buttons/favorite.mustache":{
	// 	"Like":1,
	// 	"Unlike":1,
	// 	"Liked":1,
	// 	"Protected":1,
	// 	"Loading…":1
	// },
	// "buttons/load_more.mustache":{
	// 	"Load more":1
	// },
	// "column.mustache":{
	// 	"Loading...":1,
	// 	"Add here":1,
	// 	"Release to refresh":1
	// },
	// "column/add_to_custom_timeline.mustache":{
	// 	"Enter Tweet URL":1
	// },
	// "column/column_filter_error.mustache":{
	// 	"Filter error":1
	// },
	// "column/column_header.mustache":{
	// 	"Compose new message":1,
	// 	"Mark all as read":1
	// },
	// "column/column_header_detail.mustache":{
	// 	"Back to {{{columntitle}}}":1
	// },
	// "column/column_options.mustache":{
	// 	"Edit List":1,
	// 	"Edit Collection":1,
	// 	"Dataminr settings":1,
	// 	"Left":1,
	// 	"Right":1,
	// 	"Share":1,
	// 	"Clear":1,
	// 	"Clear column":1,
	// 	"Delete Collection":1,
	// 	"Remove":1
	// },
	// "column/preferences.mustache":{
	// 	"Notifications":1,
	// 	"Media preview size":1
	// },
	// "column_loading_placeholder.mustache":{
	// 	"}}Loading":1,
	// 	"}}Updating":1
	// },
	// "command_palette/base.mustache":{
	// 	"Type a command…":1
	// },
	// "command_palette/command_list.mustache":{
	// 	"No matches found":1
	// },
	// "compose/autocomplete_twitter_user.mustache":{
	// 	"Verified account":1
	// },
	// "compose/compose_inline_reply.mustache":{
	// 	"Add another Tweet":1,
	// 	"Tweet your reply":1,
	// 	"Tweet":1,
	// 	"Popout":1,
	// 	"Ready to Tweet?":1
	// },
	// "compose/docked_compose.mustache":{
	// 	"New Tweet":1,
	// 	"Schedule Tweet":1,
	// 	"What's happening?":1,
	// 	"Add image":1,
	// 	"Direct message":1,
	// 	"Stay open":1,
	// 	"Tweet":1,
	// 	"From":1,
	// 	"To":1
	// },
	// "compose/image_description_field.mustache":{
	// 	"Add description":1
	// },
	// "compose/in_reply_to.mustache":{
	// 	"@{{screenName}}":1,
	// 	"Verified account":1
	// },
	// "compose/media_bar_infobar.mustache":{
	// 	"Image added":1,
	// 	"Remove":1
	// },
	// "compose/reply_info.mustache":{
	// 	' <div class="other-replies txt-ellipsis"> Replying {{#recipients}} to <a href="#" class="js-other-replies-link other-replies-link" data-recipient-ids="{{userIds}}"> {{#users}} @{{screenName}} {{/users}} {{#remainder}} and {{remainder}} others {{/remainder}} </a> {{/recipients}} </div> ':1
	// },
	// "compose/reply_list.mustache":{
	// 	"Your Tweet will go to the people in this conversation.":1,
	// 	"This conversation includes these people.":1
	// },
	// "compose/schedule.mustache":{
	// 	"Remove":1
	// },
	// "contributor_list_account_summary.mustache":{
	// 	"Admin":1,
	// 	"Contributor":1,
	// 	"Change role":1
	// },
	// "contributors/contributor_list_error.mustache":{
	// 	"Could not retrieve team members.":1
	// },
	// "contributors/contributor_list_row.mustache":{
	// 	"You are signed in as @{{user.screenName}}, so this will remove @{{contributee.getUsername}} from your TweetDeck and you will no longer be able to manage the team.":1,
	// 	"This user will be able to use Twitter as @{{contributee.getUsername}}, including:":1,
	// 	"Warning: You will no longer be able to manage the team from this TweetDeck":1,
	// 	"Posting Tweets":1,
	// 	"Accessing direct messages":1,
	// 	"Liking and Retweeting":1,
	// 	"Can Tweet as @{{contributee.getUsername}}":1,
	// 	"Can Tweet and manage team":1,
	// 	"Remove from team":1,
	// 	"Remove @{{user.screenName}} from the team?":1,
	// 	"Read more about teams.":1,
	// 	"Contributor":1,
	// 	"Admin":1,
	// 	"Confirm":1,
	// 	"Continue":1,
	// 	"Cancel":1,
	// 	"Authorize":1
	// },
	// "contributors/contributor_manager.mustache":{
	// 	"Manage team":1,
	// 	"Members of this team can use Twitter as @{{account.screenName}} without knowing the password.":1,
	// 	"Learn more":1,
	// 	"Team members":1,
	// 	"Pending requests":1,
	// 	"Add a team member":1
	// },
	// "contributors/contributors_loading.mustache":{
	// 	"Loading team...":1
	// },
	// "customtimeline/edit_customtimeline.mustache":{
	// 	"Under 160 characters, optional":1,
	// 	"New Collection":1,
	// 	"Description":1,
	// 	"Save":1,
	// 	"Delete":1,
	// 	"Name":1
	// },
	// "data_drawer.mustache":{
	// 	"Tweet {{insightterm}}":1
	// },
	// "embed_tweet.mustache":{
	// 	"Add this Tweet to your website by copying the code below. If your CMS supports it, you can just paste in the link.":1,
	// 	"Learn more":1,
	// 	"about embedded Tweets.":1,
	// 	"Include parent Tweet":1,
	// 	"By embedding Twitter content in your website or app, you are agreeing to the":1,
	// 	"Developer Agreement":1,
	// 	"and":1,
	// 	"Developer Policy":1,
	// 	"Include media":1,
	// 	"Preview":1,
	// 	"Loading…":1
	// },
	// "follow_button.mustache":{
	// 	"From":1,
	// 	"Loading…":1,
	// 	"Following":1,
	// 	"Unfollow":1,
	// 	"Follow":1,
	// 	"Unblock":1,
	// 	"Blocked":1,
	// 	"Pending":1,
	// 	"Cancel":1,
	// 	"Edit profile":1
	// },
	// "important_update.mustache":{
	// 	"Updates to the Twitter Terms of Service and Privacy Policy":1,
	// 	"Twitter is updating its Terms of Service and Privacy Policy to provide you with even more transparency into the data Twitter collects about you, how it's used, and the controls you have over your personal data. These updates will take effect on May 25, 2018.":1,
	// 	"Learn more":1,
	// 	"Got it":1
	// },
	// "insights/demographics.mustache":{
	// 	"% of audience":1
	// },
	// "insights/no_data.mustache":{
	// 	"Nothing to see here &mdash; yet":1
	// },
	// "insights/related_words.mustache":{
	// 	" Tweets":1,
	// 	"Past week":1,
	// 	"Related terms":1
	// },
	"keyboard_shortcut_list.mustache":{
		"Command palette — <b>NEW!</b>":1,
		"Cmd &#8984;":1,
		"Like":1,
		"Add Column":1,
		"Actions":1,
		"Reply":1,
		"Retweet":1,
		"New Tweet":1,
		"Direct Message":1,
		"View user profile":1,
		"View Tweet details":1,
		"Close Tweet details":1,
		"Send Tweet":1,
		"Enter":1,
		"Backspace":1,
		"Ctrl":1,
		"Add column":1,
		"This menu":1,
		"Right":1,
		"Left":1,
		"Down":1,
		"Up":1,
		"Navigation":1,
		"Column 1－9":1,
		"Final column":1,
		"Expand/Collapse navigation":1,
		"Open Navigation Drawer/Menu":1,
		"Search":1,
		"Return":1
	},
	// "learn_more_about_reporting.mustache":{
	// 	' <a href="https://support.twitter.com/articles/15794-online-abuse" target="_blank" rel="url">Learn more</a> about reporting violations of our rules.':1
	// },
	// "list_module_trend_header.mustache":{
	// 	"Trends":1,
	// 	"City":1
	// },
	// "list_module_trends.mustache":{
	// 	"Worldwide":1
	// },
	// "list_trend_promoted_item.mustache":{
	// 	"<span>promoted</span>":1
	// },
	// "lists/add_users_to_list_button.mustache":{
	// 	"Add users to List":1
	// },
	// "lists/edit_footer.mustache":{
	// 	"Save":1
	// },
	// "lists/edit_list_details.mustache":{
	// 	"Under 100 characters, optional":1,
	// 	"List Details":1,
	// 	"Account":1,
	// 	"Name":1,
	// 	"Description":1,
	// 	"New List":1,
	// 	"Privacy":1,
	// 	"Public":1,
	// 	"Private":1,
	// 	"anyone can view":1,
	// 	"only visible to the owner":1,
	// 	"Save":1
	// },
	// "lists/edit_members_footer.mustache":{
	// 	"Edit details":1,
	// 	"Delete List":1,
	// 	"Add column":1,
	// 	"Done":1
	// },
	// "lists/member.mustache":{
	// 	"Verified account":1,
	// 	"Loading…":1
	// },
	// "lists/member_export.mustache":{
	// 	"These are the accounts in ":1,
	// 	"← Back":1,
	// 	"Copy List":1
	// },
	// "lists/member_import.mustache":{
	// 	"Enter the @usernames of the people you would like to add to this List.":1,
	// 	"You can add up to 100 members to a List at a time.":1,
	// 	"You can add the @usernames one per line, or they can be separated by spaces, commas or tabs.":1,
	// 	"← Back":1
	// },
	// "lists/member_list.mustache":{
	// 	"Export List":1,
	// 	"Members":1
	// },
	// "login/promo_for_login_form.mustache":{
	// 	"Tweet like a pro.":1,
	// 	"The most powerful Twitter tool for real-time tracking, organizing, and engagement. Reach your audiences and discover the best of Twitter.":1
	// },
	// "login/twitter_account_login_form.mustache":{
	// 	"Log in with your Twitter account":1,
	// 	"New to Twitter?":1,
	// 	"Sign up now":1
	// },
	// "media/tagged_users.mustache":{
	// 	"and":1
	// },
	// "menus/actions.mustache":{
	// 	"Embed this Tweet":1,
	// 	"Copy link to this Tweet":1,
	// 	"Share via Direct Message":1,
	// 	"Share via Email":1,
	// 	"Tweet to @{{screenName}}":1,
	// 	"Like from accounts…":1,
	// 	"Send a Direct Message":1,
	// 	"Add or remove from Lists…":1,
	// 	"See who quoted this Tweet":1,
	// 	"Flag media":1,
	// 	"Flagged (learn more)":1,
	// 	"Mute @{{screenName}}":1,
	// 	"Unmute @{{screenName}":1,
	// 	"Mute this conversation":1,
	// 	"Unmute this conversation":1,
	// 	"Block @{{screenName}}":1,
	// 	"Report Tweet":1,
	// 	"Report @{{screenName}}":1,
	// 	"Translate this Tweet":1,
	// 	"Undo Retweet":1,
	// 	"Delete":1
	// },
	// "menus/actions_directmessage.mustache":{
	// 	"Add or remove from Lists…":1,
	// 	"Mute @{{screenName}}":1,
	// 	"Unmute @{{screenName}}":1,
	// 	"Block @{{screenName}}":1,
	// 	"Flag message":1,
	// 	"Delete":1
	// },
	// "menus/column_nav_menu.mustache":{
	// 	"Add column":1
	// },
	// "menus/column_share.mustache":{
	// 	"Embed":1,
	// 	"timeline":1,
	// 	"Copy":1,
	// 	"View":1,
	// 	"Tweet":1,
	// 	"Create Moment":1
	// },
	// "menus/datetime_footer.mustache":{
	// 	"Clear":1
	// },
	// "menus/dm_conversations_menu.mustache":{
	// 	"Add / view people":1,
	// 	"Edit group name":1,
	// 	"Turn off notifications":1,
	// 	"Turn on notifications":1,
	// 	"Leave":1,
	// 	"Flag conversation":1
	// },
	// "menus/filter_info_generic.mustache":{
	// 	' Your notification settings on <a rel="url noopener noreferrer" target="_blank" href="https://twitter.com/settings/notifications_timeline">Twitter.com</a> may be affecting the mentions you see here ':1
	// },
	// "menus/follow_menuitem.mustache":{
	// 	"Unfollow @{{screenName}}":1,
	// 	"Follow @{{screenName}}":1,
	// 	"Follow from accounts…":1
	// },
	// "menus/notifications_info.mustache":{
	// 	"Hiding notifications from users:":1,
	// 	"These filters will not affect notifications from people you follow.":1,
	// 	"Update your preferences on Twitter.com":1
	// },
	// "menus/quality_filter_info.mustache":{
	// 	"Quality filter":1,
	// 	"Improves the quality of Tweets you'll see.":1,
	// 	"Update your preferences on Twitter.com":1
	// },
	// "menus/search_action_form.mustache":{
	// 	"Mentions":1,
	// 	"Quoted Tweets":1,
	// 	"Retweets":1,
	// 	"Likes":1,
	// 	"Followers":1,
	// 	"Lists":1,
	// 	"Actions on my Retweets":1,
	// 	"Actions on Tweets I'm mentioned in":1,
	// 	"Actions on Tweets I'm tagged in":1,
	// 	"Please select at least one interaction type":1
	// },
	// "menus/search_content_form.mustache":{
	// 	"Showing":1,
	// 	"Matching":1,
	// 	"Excluding":1,
	// 	"Written in":1,
	// 	"any language":1,
	// 	"Retweets":1
	// },
	// "menus/search_datetime_form.mustache":{
	// 	"From":1,
	// 	"To":1
	// },
	// "menus/search_engagement_form.mustache":{
	// 	"At least":1,
	// 	"Retweets":1,
	// 	"at least":1,
	// 	"likes":1,
	// 	"and at least":1,
	// 	"replies":1
	// },
	// "menus/search_location_form.mustache":{
	// 	"Type in a location":1
	// },
	// "menus/search_user_form.mustache":{
	// 	"By":1,
	// 	"Mentioning":1
	// },
	// "menus/topbar_menu.mustache":{
	// 	"Release notes":1,
	// 	"Keyboard shortcuts":1,
	// 	"Search tips":1,
	// 	"Update TweetDeck":1,
	// 	"Disable dev/dogfood features":1,
	// 	"Log out":1
	// },
	// "modal.mustache":{
	// 	"Loading…":1
	// },
	// "modal/modal_context_footer.mustache":{
	// 	"Done":1
	// },
	// "open_column_footer.mustache":{
	// 	"Back":1,
	// 	"Add column":1
	// },
	// "open_column_home.mustache":{
	// 	"You have already added this column":1,
	// 	"New":1,
	// 	"Beta":1
	// },
	// "open_column_list_group.mustache":{
	// 	"Search":1,
	// 	"match that name":1,
	// 	"No":1
	// },
	// "report_message_options.mustache":{
	// 	"Are you sure? The {{reportSource}} will be deleted from your inbox, and @{{screenName}} cannot message you until you message them first.":1,
	// 	"Are you sure? The {{reportSource}} will be deleted from your inbox and you cannot be added to this group again.":1,
	// 	"Yes, it's spam":1,
	// 	"Yes, it's abusive":1,
	// 	"The report has been sent and the {{reportSource}} has been deleted.":1
	// },
	// "report_tweet_options.mustache":{
	// 	"Report Tweet options":1,
	// 	"Spam":1,
	// 	"This Tweet may be spam or from a spam account":1,
	// 	"Compromised":1,
	// 	"Abusive":1,
	// 	'This Tweet may be in violation of the <a href="https://support.twitter.com/articles/18311-the-twitter-rules" target="_blank">Twitter Rules</a>. In order to file a report, you must still choose and complete a form. Select this option to continue.':1,
	// 	"Block and unfollow":1,
	// 	'Blocking will hide @{{screenName}} Tweets. Learn more about what <a href="https://support.twitter.com/articles/117063-blocking-people-on-twitter" target="_blank">blocking</a> means.':1,
	// 	"Submit":1
	// },
	// "report_tweet_options_abusive.mustache":{
	// 	"Please choose the topic that best defines your issue. Once you complete and the submit the form your report will be filed with Twitter.":1,
	// 	"Impersonation":1,
	// 	"Trademarks":1,
	// 	"Harassment":1,
	// 	"Report self harm":1,
	// 	"Report an ad":1
	// },
	// "reverse_image_search.mustache":{
	// 	"Search image on Google":1
	// },
	// "scheduled_hint.mustache":{
	// 	"Your scheduled Tweet will send even if TweetDeck is not running at the time.":1
	// },
	// "search_no_tweets_placeholder.mustache":{
	// 	"Drag Tweets into this Collection":1,
	// 	"No recent Tweets.":1,
	// 	"New Tweets will appear here.":1,
	// 	"Or add by URL":1
	// },
	// "search_no_users_placeholder.mustache":{
	// 	"No users found.":1
	// },
	// "search_operator_list.mustache":{
	// 	"Operator":1,
	// 	"Find Tweets...":1
	// },
	//"search/search_in_popover.mustache":{
	//	"Search":1
	//},
	// "settings/account_settings.mustache":{
	// 	"Accounts you can act as":1,
	// 	"Team invitations":1,
	// 	"Accounts":1
	// },
	// "settings/account_settings_detail.mustache":{
	// 	"Updates to the Twitter Terms of Service and Privacy Policy":1,
	// 	"Twitter is updating its":1,
	// 	"Terms":1,
	// 	"and":1,
	// 	"Privacy Policy":1,
	// 	"To continue contributing to this team account in TweetDeck, you or the team account’s owner need to visit Twitter’s website and agree to the updated Terms and Privacy Policy.":1,
	// 	"For more information, visit the":1,
	// 	"Help Center":1,
	// 	"Team @{{screenName}}":1,
	// 	"You're on the team! Only admins of this account can manage the team.":1,
	// 	"Learn more":1,
	// 	"Team @{{screenName}}":1,
	// 	"Invite colleagues to use Twitter as @{{screenName}} without sharing the password with them.":1,
	// 	"Manage team":1,
	// 	"Confirmation step":1,
	// 	"Add a confirmation step before Tweeting as":1,
	// 	"Default account":1,
	// 	"@{{screenName}} is your default account for new Tweets and searches":1,
	// 	"Default account":1,
	// 	"Set @{{screenName}} as your default account for new Tweets and searches":1
	// },
	// "settings/account_settings_join_team.mustache":{
	// 	"Link another account you own":1
	// },
	// "settings/account_settings_remove_account.mustache":{
	// 	"Leave team":1,
	// 	"Leave this team? You will no longer have access to the @{{screenName}} account.":1,
	// 	"Leave":1,
	// 	"Cancel":1
	// },
	// "settings/global_setting_filter.mustache":{
	// 	"Mute Settings":1,
	// 	"Words or phrases":1,
	// 	"Matching":1,
	// 	"Tweet Source":1,
	// 	'User mutes work across TweetDeck & Twitter. To review your list of user mutes visit <a href="https://twitter.com/settings/muted" target="_blank" rel="url">twitter.com/settings/muted</a>.':1,
	// 	"Mute":1
	// },
	// "settings/global_setting_filter_add_btn.mustache":{
	// 	"Mute":1
	// },
	// "settings/global_setting_filter_row.mustache":{
	// 	"Muting {{getDisplayType}} {{>text/global_filter_value}}":1,
	// 	"Remove":1
	// },
	// "settings/global_setting_general.mustache":{
	// 	"General Settings":1,
	// 	"Stream Tweets in realtime":1,
	// 	"Show notifications on startup":1,
	// 	"Display media that may contain sensitive content":1,
	// 	"Autoplay GIFs":1,
	// 	"Theme":1,
	// 	"Dark":1,
	// 	"Light":1,
	// 	"Columns":1,
	// 	"Narrow":1,
	// 	"Medium":1,
	// 	"Wide":1,
	// 	"Font size":1,
	// 	"Smallest":1,
	// 	"Small":1,
	// 	"Large":1,
	// 	"Largest":1
	// },
	// "settings/global_setting_link_shortening.mustache":{
	// 	"Services Settings":1,
	// 	"Link Shortening":1
	// },
	// "settings/invitations_panel.mustache":{"Team invitations":1},
	// "settings/link_shortening_bitly_form.mustache":{
	// 	"Bit.ly Username":1,
	// 	"Bit.ly API Key":1
	// },
	// "short_modal.mustache":{"Done":1},
	// "spinner_large_white.mustache":{"Loading…":1},
	// "splash/whats_new.mustache":{
	// 	"TweetDeck logo":1,
	// 	"Welcome to TweetDeck":1,
	// 	"Create Collections":1,
	// 	"Create a custom Twitter experience":1,
	// 	"Organize and build Collections, keep track of Lists, searches, activity and more. Click the + in the sidebar.":1,
	// 	"Create filters":1,
	// 	"Find exactly what you&rsquo;re looking for":1,
	// 	"Create searches to track topics, events and hashtags. Refine the results with filters at the top of each timeline.":1,
	// 	"Multiple accounts":1,
	// 	"Manage multiple accounts":1,
	// 	'Tweet, monitor and follow new accounts from all &mdash; or just one of your accounts. Add another account in <a href="#" data-action="openSettings"><i class="icon icon-user-switch icon-bot"></i> Accounts</a>.':1,
	// 	"Get started":1
	// },
	// "status/attachment_image.mustache":{"Image attached":1},
	// "status/conversation_cursor_top.mustache":{"Show more":1},
	// "status/conversation_failed_participants.mustache":{
	// 	"could not be added":1,
	// 	"and":1
	// },
	// "status/conversation_failed_participants_preview.mustache":{"Some users could not be added.":1},
	// "status/conversation_join.mustache":{
	// 	"There are":1,
	// 	"other people":1,
	// 	"in this group":1,
	// 	"added you":1
	// },
	// "status/conversation_join_preview.mustache":{"added you":1},
	// "status/conversation_name_update.mustache":{
	// 	"You":1,
	// 	"changed the group name to":1,
	// 	"removed the group name":1
	// },
	// "status/conversation_name_update_preview.mustache":{
	// 	"You":1,
	// 	"changed the group name to":1,
	// 	"removed the group name":1
	// },
	// "status/conversation_participants_join.mustache":{
	// 	"added":1,
	// 	"You":1
	// },
	// "status/conversation_participants_join_preview.mustache":{
	// 	"You added":1,
	// 	"added":1,
	// 	"&amp;":1
	// },
	// "status/conversation_participants_leave.mustache":{"left":1},
	// "status/conversation_participants_leave_preview.mustache":{"left":1	},
	// "status/dataminr_footer.mustache":{
	// 	"Open in Dataminr":1,
	// 	"Event Location":1,
	// 	"Event Keywords":1,
	// 	"Search any":1,
	// 	" or ":1,
	// 	"search all":1,
	// 	"Original Source":1,
	// 	"Top Hashtags":1,
	// 	"Replies":1
	// },
	// "status/dataminr_single_footer.mustache":{
	// 	"Joined":1,
	// 	"Followers":1,
	// 	"Open in Dataminr":1
	// },
	// "status/gap_in_stream.mustache":{"Show more":1,"more":1},
	// "status/media_sensitive.mustache":{
	// 	"The following media may contain sensitive material.":1,
	// 	'Your <a href="#" rel="globalSettings">Tweet media display settings</a> are configured to inform you when media may be sensitive.':1,
	// 	"View":1,
	// 	"Always show me sensitive media":1
	// },
	// "status/message.mustache":{"More options":1},
	// "status/quoted_tweet.mustache":{"Show this thread":1},
	// "status/quoted_tweet.mustache":{"This Tweet is unavailable":1},
	// "status/scheduled_tweet_single_header.mustache":{"Verified account":1},
	// "status/tweet_detail.mustache":{
	// 	"Skip to replace":1,
	// 	"Reply to":1,
	// 	"Translate Tweet":1
	// },
	// "status/tweet_detail_actions.mustache":{
	// 	"Reply":1,
	// 	"Retweet":1,
	// 	"Like":1,
	// 	"Options":1,
	// 	"Drag to Collection":1,
	// 	"Remove from collection":1
	// },
	// "status/tweet_detail_replybar.mustache":{
	// 	"Popout":1,
	// 	"Add image":1,
	// 	"Reply":1
	// },
	// "status/tweet_detail_socialstats.mustache":{"View on analytics.twitter.com":1},
	// "status/tweet_media_indications.mustache":{
	// 	"GIF":1,
	// 	"Images":1,
	// 	"Video":1,
	// 	"Image":1
	// },
	// "status/tweet_single.mustache":{
	// 	" Retweeted":1,
	// 	"Show this thread":1
	// },
	// "status/tweet_single_actions.mustache":{
	// 	"Drag to Collection":1,
	// 	"Remove from Collection":1,
	// 	"Like":1,
	// 	"More options":1,
	// 	"Reply":1,
	// 	"Retweet":1
	// },
	// "status/tweet_single_footer.mustache":{"View Conversation":1},
	// "status/tweet_single_header.mustache":{"Verified account":1},
	// "status/tweet_translation.mustache":{"Translated by {{>text/microsoft_translator_link}}":1},
	// "suggest_refresh.mustache":{
	// 	"A new version of TweetDeck is available!":1,
	// 	"Refresh":1
	// },
	// "team_invitations.mustache":{
	// 	"You've been invited to contribute to these Twitter accounts.":1,
	// 	"Learn more":1
	// },
	// "terms_privacy_update.mustache":{
	// 	"Updates to the Twitter Terms of Service and Privacy Policy":1,
	// 	"Twitter is updating its Terms and Privacy Policy. To continue using TweetDeck, you’ll need to visit Twitter’s website and agree to the updated Terms and Privacy Policy.":1,
	// 	"For more information, visit the":1,
	// 	"Help Center":1
	// },
	// "text/already_registered.mustache":{
	// 	"There's already a TweetDeck account for that email address.":1,
	// 	"Want to recover your password?":1
	// },
	// "text/favorite_action.mustache":{
	// 	"Like from {{getUsername}}":1,
	// 	"Unlike from {{getUsername}}":1
	// },
	// "text/followers_you_follow_link.mustache":{"more":1},
	// "text/gallery_flag_media.mustache":{"Flag media":1,"Flagged (learn more)":1},
	// "text/gallery_original_link.mustache":{"View original":1},
	// "text/login_verification_link.mustache":{"login verification":1},
	// "topbar/app_header.mustache":{
	// 	"New Tweet":1,
	// 	"Add column":1,
	// 	"Collapse":1,
	// 	"Expand":1,
	// 	"Accounts":1,
	// 	"Settings":1,
	// 	"Tweet":1
	// },
	// "topbar/app_title.mustache":{"TweetDeck":1},
	// "topbar/app_title_beta.mustache":{"TweetDeck":1,"Beta":1},
	// "try_search_query_button.mustache":{"Try":1},
	// "twitter_profile.mustache":{
	// 	"Loading…":1,
	// 	"Verified account":1,
	// 	"Translator":1,
	// 	"Follows @{{preferredAccount}}":1,
	// 	"{{_i}}Joined{{/i}}&nbsp;{{prettyJoinedDate}}":1
	// },
	// "twitter_profile_social_proof.mustache":{
	// 	"Followed by":1,
	// 	"and":1,
	// 	".":1
	// },
	// "typeahead/typeahead_conversations.mustache":{"{{screenName}}'s avatar":1},
	// "typeahead/typeahead_dropdown.mustache":{"Clear all":1},
	// "typeahead/typeahead_recent_searches.mustache":{"Recent searches":1},
	// "typeahead/typeahead_users.mustache":{"Search all people for <strong>{{query}}</strong>":1},
	// "typeahead/typeahead_users_compose.mustache":{"Verified account":1},
	// "version.mustache":{"Version ":1},
	// "video_preview.mustache":{"Loading preview":1}
}

var miscStrings = {
	TDApi:1,
	DISPLAY_ORDER_PROFILE:1,
	MENU_TITLE:1,
	MENU_ATTRIBUTION:1,
	MODAL_TITLE:1
}

var weirdStrings = {
	"Follow ":{en:"Follow ",es:"Seguir "},
	"Translated from ":{en:"Translated from ",es:"Traducido de "},
	"Include ":{en:"Include ",es:"Incluir "},
	" in:":{en:" in:",es:" en:"},
	"Muting ":{en:"Muting",es:"Silenciando "},
	" from your accounts":{en:" from your accounts",es:" de tus cuentas"}
}

export var I18n = function(a,b,c,d,e,f) {

	// console.log(a,b,c,d,e,f)


	if (exists(a)) {
		if ((a.includes("{{{")||a.includes("{{"))&&!exists(f)){
			var wtf = I18n(a,b,c,d,e,1);
			var no = I18n(wtf,b,c,d,e,2);
			return no;
		} else if (a.includes("{{{") && f===2) {
			//console.log("oh hmm",a);
			var a = a;
			//console.log("b,c,d",b,c,d);
			for (var key in b) {
				var replaceMe = b[key][languageFull]||b[key][languageMain]||b[key][languageFallback];
				console.log("replaceMe",replaceMe);
				a = a.replaceAll("\{\{\{"+key+"\}\}\}","\{\{\{"+replaceMe+"\}\}\}");
			}
			for (var key in weirdStrings) {
				a = a.replaceAll(key,weirdStrings[key][languageFull]||weirdStrings[key][languageMain]||weirdStrings[key][languageFallback]);
			}
			return a;
		} else if (a.includes("{{") && f===2) {
			//console.log("oh ok",a);
			//console.log("b,c,d",b,c,d);

			var checkmateTwitter = TDiInitial(a,b,c,d,e);
			// var checkmateTwitter = a;


			for (var key in weirdStrings) {
				checkmateTwitter = checkmateTwitter.replaceAll(key,weirdStrings[key][languageFull]||weirdStrings[key][languageMain]||weirdStrings[key][languageFallback])
			}
			return checkmateTwitter;
		} else if (a.substr(0,6) === "From @") {
			return I18n(a.substr(0,4)) + " @" + a.substr(6);
		}
		if (!exists(b)||f===1) {
			if (exists(languageData[a])) {
				return languageData[a][languageFull]||languageData[a][languageMain]||languageData[a][languageFallback];
			} else {
				console.warn("Missing string: "+a);
				return (displayWarning ? "⚠" : "") + a;
			}
		} else {
			var a = a;
			for (var key in b) {
				a = a.replace("{{"+key+"}}",b[key]);
			}
			return a;
		}
	} else {
		console.error("man you gotta actually specify something for TD.i. here's some other details ",a,b,c,d,e);
	}
}

function patchColumnTitle() {
	if (exists(TD)&&exists(mR)) {
		var columnData = mR.findFunction("getColumnTitleArgs")[0].columnMetaTypeToTitleTemplateData;
		for (var key in columnData) {
			columnData[key].title = I18n(columnData[key].title);
		}
	} else {
		console.log("Waiting for mR to be ready...");
		setTimeout(patchColumnTitle,10);
		return;
	}
}

function patchButtonText() {
	if (exists(TD)&&exists(mR)) {
		var buttonData = mR.findFunction("tooltipText");
		for (var i=0;i<buttonData.length;i++) {
			if (exists(buttonData[i])) {
				if (exists(buttonData[i].buttonText))
					for (var key in buttonData[i].buttonText) {
						buttonData[i].buttonText[key] = I18n(buttonData[i].buttonText[key]);
					};
				if (exists(buttonData[i].tooltipText))
					for (var key in buttonData[i].tooltipText) {
						buttonData[i].tooltipText[key] = I18n(buttonData[i].tooltipText[key]);
					};
			}
		}
	} else {
		console.log("Waiting for mR to be ready...");
		setTimeout(patchButtonText,10);
		return;
	}
}

function patchColumnTitleAddColumn() {
	if (exists(TD)&&exists(TD.controller)&&exists(TD.controller.columnManager)&&exists(TD.controller.columnManager.DISPLAY_ORDER)) {
		var columnData = TD?.controller?.columnManager?.DISPLAY_ORDER;
		for (var key in columnData) {
			columnData[key].title = I18n(columnData[key].title);
			if (exists(columnData[key].attribution)) {
				columnData[key].attribution = I18n(columnData[key].attribution);
			}
		}
	} else {
		console.log("Waiting for DISPLAY_ORDER and etc to be ready...");
		setTimeout(patchColumnTitleAddColumn,10);
		return;
	}
}

function patchMustaches() {
	if (exists(TD_mustaches||TD.mustaches)) {
		for (var key in mustachePatches) {
			if (exists(TD_mustaches[key])) {
				for (var key2 in mustachePatches[key]) {
					try{
						TD_mustaches[key] = TD_mustaches[key].replaceAll(key2,I18n(key2))
					} catch(e){
						console.error("An error occurred while replacing mustache "+key2+" in "+key);
						console.log(e);
					}
				}
			} else {
				console.warn("what the heck, where is mustache "+key+"?");
			}
		}
	} else {
		console.log("Waiting on TD_mustaches...");
		setTimeout(patchMustaches,10);
		return;
	}
}

function autoPatchMustaches() {
	if (exists(TD_mustaches||TD.mustaches)) {
		for (var key in TD_mustaches) {
			// TODO: firefox doesn't support lookbehind yet (how fucking dumb) so i'll have to do something else
			TD_mustaches[key].match(/(?<={{_i}}).+?(?={{\/i}})/g)?.forEach((a) => {
				TD_mustaches[key] = TD_mustaches[key].replace("{{_i}}"+a+"{{/i}}", "{{_i}}"+I18n(a)+"{{/i}}");
			})
		}
	} else {
		console.log("Waiting on TD_mustaches...");
		setTimeout(patchMustaches,10);
		return;
	}
}

function patchUtil() {
		if (exists(TD)&&exists(TD.util)&&exists(TD.util.timesCached)&&exists(TD.util.timesCached.shortForm)) {
		for (var key in TD.util.timesCached) {
			for (var key2 in TD.util.timesCached[key]) {
				for (var key3 in TD.util.timesCached[key][key2]) {
					TD.util.timesCached[key][key2][key3] = I18n(TD.util.timesCached[key][key2][key3],undefined,undefined,undefined,undefined,true);
				}
			}
		}
	} else {
		console.log("Waiting on TD.util.timesCached...");
		setTimeout(patchUtil,50);
		return;
	}
}

function patchMiscStrings() {
	for (var key in miscStrings) {
		console.log(key);
		switch(key){
			case "TDApi":
				if (exists(TD)&&exists(TD.constants)&&exists(TD.constants.TDApi)) {
					for (var key2 in TD.constants.TDApi) {
						TD.constants.TDApi[key2] = I18n(key2);
					}
					break;
				} else {
					console.log("Waiting on TDApi...");
					setTimeout(patchMiscStrings,10);
					return;
				}
			case "DISPLAY_ORDER_PROFILE":
				if (exists(TD)&&exists(TD.controller)&&exists(TD.controller.columnManager)&&exists(TD.controller.columnManager.DISPLAY_ORDER_PROFILE)) {
					for (var key2 in TD.controller.columnManager.DISPLAY_ORDER_PROFILE) {
						var prof = TD.controller.columnManager.DISPLAY_ORDER_PROFILE[key2];
						prof.title = I18n(prof.title);
					}
					break;
				} else {
					console.log("Waiting on TDApi...");
					setTimeout(patchMiscStrings,10);
					return;
				}
			case "MENU_TITLE":
				if (exists(TD)&&exists(TD.controller)&&exists(TD.controller.columnManager)&&exists(TD.controller.columnManager.MENU_TITLE)) {
					for (var key2 in TD.controller.columnManager.MENU_TITLE) {
						TD.controller.columnManager.MENU_TITLE[key2] =
						I18n(TD.controller.columnManager.MENU_TITLE[key2]);
					}
					break;
				} else {
					console.log("Waiting on TDApi...");
					setTimeout(patchMiscStrings,10);
					return;
				}
			case "MENU_ATTRIBUTION":
				if (exists(TD)&&exists(TD.controller)&&exists(TD.controller.columnManager)&&exists(TD.controller.columnManager.MENU_ATTRIBUTION)) {
					for (var key2 in TD.controller.columnManager.MENU_ATTRIBUTION) {
						TD.controller.columnManager.MENU_ATTRIBUTION[key2] =
						I18n(TD.controller.columnManager.MENU_ATTRIBUTION[key2]);
					}
					break;
				} else {
					console.log("Waiting on TDApi...");
					setTimeout(patchMiscStrings,10);
					return;
				}
			case "MODAL_TITLE":
				if (exists(TD)&&exists(TD.controller)&&exists(TD.controller.columnManager)&&exists(TD.controller.columnManager.MODAL_TITLE)) {
					for (var key2 in TD.controller.columnManager.MODAL_TITLE) {
						TD.controller.columnManager.MODAL_TITLE[key2] =
						I18n(TD.controller.columnManager.MODAL_TITLE[key2]);
					}
					break;
				} else {
					console.log("Waiting on TDApi...");
					setTimeout(patchMiscStrings,10);
					return;
				}
		}
	}
}

function patchLanguageNames() {
	if (TD && TD.languages && TD.languages.getAllLanguages) {
		TD.languages.getAllLanguages = () => [
			{code: "am", localized_name: I18n("Amharic"), name: "አማርኛ"},
			{code: "ar", localized_name: I18n("Arabic"), name: "العربية"},
			{code: "bg", localized_name: I18n("Bulgarian"), name: "Български"},
			{code: "bn", localized_name: I18n("Bengali"), name: "বাংলা"},
			{code: "bo", localized_name: I18n("Tibetan"), name: "བོད་སྐད"},
			{code: "ca", localized_name: I18n("Catalan"), name: "Català"},
			{code: "chr", localized_name: I18n("Cherokee"), name: "ᏣᎳᎩ"},
			{code: "cs", localized_name: I18n("Czech"), name: "čeština"},
			{code: "da", localized_name: I18n("Danish"), name: "Dansk"},
			{code: "de", localized_name: I18n("German"), name: "Deutsch"},
			{code: "dv", localized_name: I18n("Maldivian"), name: "ދިވެހި"},
			{code: "el", localized_name: I18n("Greek"), name: "Ελληνικά"},
			{code: "en", localized_name: I18n("English"), name: "English"},
			{code: "es", localized_name: I18n("Spanish"), name: "Español"},
			{code: "et", localized_name: I18n("Estonian"), name: "eesti"},
			{code: "fa", localized_name: I18n("Persian"), name: "فارسی"},
			{code: "fi", localized_name: I18n("Finnish"), name: "Suomi"},
			{code: "fr", localized_name: I18n("French"), name: "Français"},
			{code: "gu", localized_name: I18n("Gujarati"), name: "ગુજરાતી"},
			{code: "iw", actual_code: "he", localized_name: I18n("Hebrew"), name: "עברית"},
			{code: "hi", localized_name: I18n("Hindi"), name: "हिंदी"},
			{code: "ht", localized_name: I18n("Haitian Creole"), name: "Kreyòl ayisyen"},
			{code: "hu", localized_name: I18n("Hungarian"), name: "Magyar"},
			{code: "hy", localized_name: I18n("Armenian"), name: "Հայերեն"},
			{code: "in", actual_code: "id", localized_name: I18n("Indonesian"), name: "Bahasa Indonesia"},
			{code: "is", localized_name: I18n("Icelandic"), name: "Íslenska"},
			{code: "it", localized_name: I18n("Italian"), name: "Italiano"},
			{code: "iu", localized_name: I18n("Inuktitut"), name: "ᐃᓄᒃᑎᑐᑦ"},
			{code: "ja", localized_name: I18n("Japanese"), name: "日本語"},
			{code: "ka", localized_name: I18n("Georgian"), name: "ქართული"},
			{code: "km", localized_name: I18n("Khmer"), name: "ខ្មែរ"},
			{code: "kn", localized_name: I18n("Kannada"), name: "ಕನ್ನಡ"},
			{code: "ko", localized_name: I18n("Korean"), name: "한국어"},
			{code: "lo", localized_name: I18n("Lao"), name: "ລາວ"},
			{code: "lt", localized_name: I18n("Lithuanian"), name: "Lietuvių"},
			{code: "lv", localized_name: I18n("Latvian"), name: "latviešu valoda"},
			{code: "ml", localized_name: I18n("Malayalam"), name: "മലയാളം"},
			{code: "my", localized_name: I18n("Myanmar"), name: "မြန်မာဘာသာ"},
			{code: "ne", localized_name: I18n("Nepali"), name: "नेपाली"},
			{code: "nl", localized_name: I18n("Dutch"), name: "Nederlands"},
			{code: "no", localized_name: I18n("Norwegian"), name: "Norsk"},
			{code: "or", localized_name: I18n("Oriya"), name: "ଓଡ଼ିଆ"},
			{code: "pa", localized_name: I18n("Panjabi"), name: "ਪੰਜਾਬੀ"},
			{code: "pl", localized_name: I18n("Polish"), name: "Polski"},
			{code: "pt", localized_name: I18n("Portuguese"), name: "Português"},
			{code: "ro", localized_name: I18n("Romanian"), name: "limba română"},
			{code: "ru", localized_name: I18n("Russian"), name: "Русский"},
			{code: "si", localized_name: I18n("Sinhala"), name: "සිංහල"},
			{code: "sk", localized_name: I18n("Slovak"), name: "slovenčina"},
			{code: "sl", localized_name: I18n("Slovene"), name: "slovenski jezik"},
			{code: "sv", localized_name: I18n("Swedish"), name: "Svenska"},
			{code: "ta", localized_name: I18n("Tamil"), name: "தமிழ்"},
			{code: "te", localized_name: I18n("Telugu"), name: "తెలుగు"},
			{code: "th", localized_name: I18n("Thai"), name: "ไทย"},
			{code: "tl", localized_name: I18n("Tagalog"), name: "Tagalog"},
			{code: "tr", localized_name: I18n("Turkish"), name: "Türkçe"},
			{code: "uk", localized_name: I18n("Ukrainian"), name: "українська мова"},
			{code: "ur", localized_name: I18n("Urdu"), name: "ﺍﺭﺩﻭ"},
			{code: "vi", localized_name: I18n("Vietnamese"), name: "Tiếng Việt"},
			{code: "zh", localized_name: I18n("Chinese"), name: "中文"}
		];
	} else {
		setTimeout(patchLanguageNames,50);
	}
}

function patchTDi() {
	if (mR && mR.findFunction && mR.findFunction("en-x-psaccent")[0]) {
		TDiInitial = mR.findFunction("en-x-psaccent")[0].default;
		mR.findFunction("en-x-psaccent")[0].default = function(a,b,c,d,e,f){ return I18n(a,b,c,d,e,f)}
	} else {
		setTimeout(patchTDi,10);
	}
}

export function startI18nEngine() {
	if (String && String.prototype) {
		String.prototype.replaceAll = function(search, replacement) {
		    var target = this;
		    return target.replace(new RegExp(search, 'g'), replacement);
		};
	}

	window.findMustache = (str) => {
		let results = {};
		for (let mustache in TD_mustaches) {
			if (TD_mustaches[mustache].match(str)) {
				results[mustache] = TD_mustaches[mustache];
			}
		}
		return results;
	}

	patchTDi();
	patchMiscStrings();
	patchColumnTitle();
	patchButtonText();
	patchColumnTitleAddColumn();
	// autoPatchMustaches();
	patchMustaches();
	patchUtil();
	// patchLanguageNames();
}
