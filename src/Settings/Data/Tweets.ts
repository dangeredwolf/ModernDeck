/*
	Settings/Data/Tweets.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";

import { TweetDeckLinkShortener, TweetDeckObject } from "../../Types/TweetDeck";
declare let TD: TweetDeckObject;

import { allColumnsVisible, updateColumnVisibility } from "../../Column";

let tab: ModernDeckSettingsTab = {
	tabName:"<i class='Icon icon-twitter-bird'></i> {{Tweets}}",
	options:{
		stream:{
			headerBefore:"{{Behavior}}",
			title:"{{Stream Tweets in real time}}",
			type:ModernDeckSettingsType.CHECKBOX,
			savePreference:false,
			activate:{
				func: (): void => {
					TD.settings.setUseStream(true);
				}
			},
			deactivate:{
				func: (): void => {
					TD.settings.setUseStream(false);
				}
			},
			queryFunction: (): boolean => {
				return TD.settings.getUseStream();
			}
		},
		columnVisibility:{
			title:"{{Improve Timeline performance by not rendering off-screen columns}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				func: (): void => {
					allColumnsVisible();
					updateColumnVisibility();

					// setPref("mtd_column_visibility",opt);
				}
			},
			deactivate:{
				func: (): void => {
					allColumnsVisible();
					// setPref("mtd_column_visibility",opt);
				}
			},
			settingsKey:"mtd_column_visibility",
			default:navigator.userAgent.match("Firefox") === null // Firefox is so much faster that column visibility is unlikely to benefit
		},
		autoplayGifs:{
			title:"{{Automatically play GIFs}}",
			type:ModernDeckSettingsType.CHECKBOX,
			savePreference:false,
			activate:{
				func: (): void => {
					TD.settings.setAutoPlayGifs(true);
				}
			},
			deactivate:{
				func: (): void => {
					TD.settings.setAutoPlayGifs(false);
				}
			},
			queryFunction: (): boolean => {
				return TD.settings.getAutoPlayGifs();
			}
		},
		startupNotifications:{
			title:"{{Show notifications on startup}}",
			type:ModernDeckSettingsType.CHECKBOX,
			savePreference:false,
			activate:{
				func: (): void => {
					TD.settings.setShowStartupNotifications(true);
				}
			},
			deactivate:{
				func: (): void => {
					TD.settings.setShowStartupNotifications(false);
				}
			},
			queryFunction: (): boolean => {
				return TD.settings.getShowStartupNotifications();
			}
		},
		useModernDeckAlertSound:{
			title:"{{Use custom ModernDeck alert sound}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				func: (): void => {
					// $(document.querySelector("audio")).attr("src", window.mtdBaseURL + "assets/audio/alert_3.mp3");
					$(document.querySelector("audio")).attr("src", window.mtdBaseURL + "assets/audio/notify.aac");
				}
			},
			deactivate:{
				func: (): void => {
					$(document.querySelector("audio")).attr("src", $(document.querySelector("audio>source")).attr("src"));
				}
			},
			settingsKey:"mtd_sounds",
			default:true
		},
		nftAvatarAction:{
			headerBefore:"{{NFT Behavior}}",
			title:"{{Automatic action to take against users with NFT avatars}}",
			type:ModernDeckSettingsType.DROPDOWN,
			settingsKey:"mtd_nftAvatarAction",
			activate:{
				func: (opt: string): void => {
					window.nftAvatarAction ? window.nftAvatarAction.actionToTake = opt : false;
					if (opt !== "nothing") {
						let alreadyHasFilter = false;
						// TODO: Filter Types
						TD.controller.filterManager.getAll().forEach((filter: any) => {
							if (filter.type === "BTD_nft_avatar") {
								alreadyHasFilter = true;
							}
						});

						if (!alreadyHasFilter) {
							TD.controller.filterManager.addFilter('BTD_nft_avatar', 'ModernDeck NFT Avatar Filter');
						}
					} else {
						TD.controller.filterManager.getAll().forEach((filter: any) => {
							if (filter.type === "BTD_nft_avatar") {
								TD.controller.filterManager.removeFilter(filter);
							}
						});
					}
				}
			},
			default:"nothing",
			options:{
				nothing:{value:"nothing",text:"{{Nothing}}"},
				hide:{value:"hide",text:"{{Hide in ModernDeck}}"},
				mute:{value:"mute",text:"{{Mute user}}"},
				block:{value:"block",text:"{{Block user}}"}
			}
		},
		nftSubtext: {
			label: "{{Some things to keep in mind}}<br><br>- {{At the moment, due to Twitter API limits, actions don't work against users on Search columns.}}<br>- {{If you are using the mute or block actions, a queue is used if there are multiple accounts to deal with due to API and website constraints.}}<br>- {{Turning off this feature won't unblock or unmute anyone on Twitter, but in the future actions will no longer be taken.}}<br>- {{This setting only applies to NFT users that linked their NFTs directly on Twitter.}}",
			type:ModernDeckSettingsType.SUBTEXT
		},
		nftDontBlockFollowing:{
			title:"{{Don't auto-block or mute people you follow on your default account}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
			},
			deactivate:{
			},
			settingsKey:"mtd_nftDontBlockFollowing",
			enabled:false,
			default:true
		},
		nftNotify:{
			title:"{{Notify me when an NFT auto-action has occurred}}",
			type:ModernDeckSettingsType.CHECKBOX,
			activate:{
				func: (): void => {
					window?.nftAvatarAction?.notifClose?.click?.();
					window.nftAvatarAction ? window.nftAvatarAction.notif = null : false;
					window.nftAvatarAction ? window.nftAvatarAction.enableNotifications = true : false;
				}
			},
			deactivate:{
				func: (): void => {
					window.nftAvatarAction ? window.nftAvatarAction.enableNotifications = false : false;
				}
			},
			settingsKey:"mtd_nftNotify",
			default:true
		},
		linkShortener:{
			headerBefore:"{{Link Shortening}}",
			title:"{{Link Shortener Service}}",
			type:ModernDeckSettingsType.DROPDOWN,
			activate:{
				func: (opt: TweetDeckLinkShortener): void => {
					TD.settings.setLinkShortener(opt);
					setTimeout(() => window.renderTab("tweets"));
				}
			},
			savePreference:false,
			queryFunction: () => {
				let shortener = TD.settings.getLinkShortener();
				return shortener;
			},
			options:{
				twitter:{value:"twitter",text:"{{Twitter}}"},
				bitly:{value:"bitly",text:"{{Bit.ly}}"}
			}
		},
		bitlyUsername:{
			title:"{{Bit.ly Username}}",
			type:ModernDeckSettingsType.TEXTBOX,
			activate:{
				func: (opt: string): void => {
					TD.settings.setBitlyAccount({
						apiKey:((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().apiKey) ? TD.settings.getBitlyAccount() : {apiKey:""}).apiKey,
						login:opt
					});
				}
			},
			enabled:(): boolean => TD.settings.getLinkShortener() === "bitly",
			savePreference:false,
			queryFunction: (): string => ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().login) ? TD.settings.getBitlyAccount() : {login:""}).login
		},
		bitlyApiKey:{
			title:"{{Bit.ly API Key}}",
			type:ModernDeckSettingsType.TEXTBOX,
			addClass:"mtd-big-text-box",
			enabled:() => TD.settings.getLinkShortener() === "bitly",
			activate:{
				func: (opt: string): void => {
					TD.settings.setBitlyAccount({
						login:((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().login) ? TD.settings.getBitlyAccount() : {login:""}).login,
						apiKey:opt
					});
				}
			},
			savePreference: false,
			queryFunction: (): string => {
				return ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().apiKey) ? TD.settings.getBitlyAccount() : {apiKey:""}).apiKey;
			}
		}
	}
}

export default tab;