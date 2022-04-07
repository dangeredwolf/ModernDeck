/*
	SettingsData/Tweets.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { allColumnsVisible, updateColumnVisibility } from "./../Column.js";

export default {
    tabName:"<i class='Icon icon-twitter-bird'></i> {{Tweets}}",
    options:{
        stream:{
            headerBefore:"{{Behavior}}",
            title:"{{Stream Tweets in real time}}",
            type:"checkbox",
            savePreference:false,
            activate:{
                func: () => {
                    TD.settings.setUseStream(true);
                }
            },
            deactivate:{
                func: () => {
                    TD.settings.setUseStream(false);
                }
            },
            queryFunction: () => {
                return TD.settings.getUseStream();
            }
        },
        columnVisibility:{
            title:"{{Improve Timeline performance by not rendering off-screen columns}}",
            type:"checkbox",
            activate:{
                func: (opt) => {
                    allColumnsVisible();
                    updateColumnVisibility();

                    // setPref("mtd_column_visibility",opt);
                }
            },
            deactivate:{
                func: (opt) => {
                    allColumnsVisible();
                    // setPref("mtd_column_visibility",opt);
                }
            },
            settingsKey:"mtd_column_visibility",
            default:navigator.userAgent.match("Firefox") === null // Firefox is so much faster that column visibility is unlikely to benefit
        },
        autoplayGifs:{
            title:"{{Automatically play GIFs}}",
            type:"checkbox",
            savePreference:false,
            activate:{
                func: () => {
                    TD.settings.setAutoPlayGifs(true);
                }
            },
            deactivate:{
                func: () => {
                    TD.settings.setAutoPlayGifs(false);
                }
            },
            queryFunction: () => {
                return TD.settings.getAutoPlayGifs();
            }
        },
        startupNotifications:{
            title:"{{Show notifications on startup}}",
            type:"checkbox",
            savePreference:false,
            activate:{
                func: () => {
                    TD.settings.setShowStartupNotifications(true);
                }
            },
            deactivate:{
                func: () => {
                    TD.settings.setShowStartupNotifications(false);
                }
            },
            queryFunction: () => {
                return TD.settings.getShowStartupNotifications();
            }
        },
        useModernDeckAlertSound:{
            title:"{{Use custom ModernDeck alert sound}}",
            type:"checkbox",
            activate:{
                func: () => {
                    $(document.querySelector("audio")).attr("src",mtdBaseURL + "assets/alert_3.mp3");
                }
            },
            deactivate:{
                func: () => {
                    $(document.querySelector("audio")).attr("src",$(document.querySelector("audio>source")).attr("src"));
                }
            },
            settingsKey:"mtd_sounds",
            default:true
        },
        nftAvatarAction:{
            headerBefore:"{{NFT Behavior}}",
            title:"{{Automatic action to take against users with NFT avatars}}",
            type:"dropdown",
            settingsKey:"mtd_nftAvatarAction",
            activate:{
                func: opt => {
                    window.nftAvatarAction ? window.nftAvatarAction.actionToTake = opt : false;
                    if (opt !== "nothing") {
                        let alreadyHasFilter = false;

                        TD.controller.filterManager.getAll().forEach(filter => {
                            if (filter.type === "BTD_nft_avatar") {
                                alreadyHasFilter = true;
                            }
                        });

                        if (!alreadyHasFilter) {
                            TD.controller.filterManager.addFilter('BTD_nft_avatar', 'ModernDeck NFT Avatar Filter');
                        }
                    } else {
                        TD.controller.filterManager.getAll().forEach(filter => {
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
            type:"subtext"
        },
        nftDontBlockFollowing:{
            title:"{{Don't auto-block or mute people you follow on your default account}}",
            type:"checkbox",
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
            type:"checkbox",
            activate:{
                func: () => {
                    window?.nftAvatarAction?.notifyClose?.click?.();
                    window.nftAvatarAction ? window.nftAvatarAction.notify = null : false;
                    window.nftAvatarAction ? window.nftAvatarAction.enableNotifications = true : false;
                }
            },
            deactivate:{
                func: () => {
                    window.nftAvatarAction ? window.nftAvatarAction.enableNotifications = false : false;
                }
            },
            settingsKey:"mtd_nftNotify",
            default:true
        },
        linkShortener:{
            headerBefore:"{{Link Shortening}}",
            title:"{{Link Shortener Service}}",
            type:"dropdown",
            activate:{
                func: set => {
                    TD.settings.setLinkShortener(set);
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
            type:"textbox",
            activate:{
                func: set => {
                    TD.settings.setBitlyAccount({
                        apiKey:((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().apiKey) ? TD.settings.getBitlyAccount() : {apiKey:""}).apiKey,
                        login:set
                    });
                }
            },
            enabled:() => TD.settings.getLinkShortener() === "bitly",
            savePreference:false,
            queryFunction: () => {
                return ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().login) ? TD.settings.getBitlyAccount() : {login:""}).login;
            }
        },
        bitlyApiKey:{
            title:"{{Bit.ly API Key}}",
            type:"textbox",
            addClass:"mtd-big-text-box",
            enabled:() => TD.settings.getLinkShortener() === "bitly",
            activate:{
                func: set => {
                    TD.settings.setBitlyAccount({
                        login:((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().login) ? TD.settings.getBitlyAccount() : {login:""}).login,
                        apiKey:set
                    });
                }
            },
            savePreference: false,
            queryFunction: () => {
                return ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().apiKey) ? TD.settings.getBitlyAccount() : {apiKey:""}).apiKey;
            }
        }
    }
}