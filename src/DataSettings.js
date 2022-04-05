/*
	DataSettings.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	Settings manager data.

	Serves two purposes.

	1. Managing preferences of users, able to activate and deactivate on the fly, and
	2. Serve as a guide to construct the settings UI

	It can look a bit messy, but it's actually quite simple once you break it down.

	https://github.com/dangeredwolf/ModernDeck/wiki/settingsData
*/

import { I18n } from "./I18n.js";
import { UIAlert } from "./UIAlert.js";
import { isStylesheetExtensionEnabled, enableStylesheetExtension, disableStylesheetExtension, enableCustomStylesheetExtension } from "./StylesheetExtensions.js";
import { debugStorageSys, hasPref, getPref, setPref, resetPref, purgePrefs } from "./StoragePreferences.js";
import { allColumnsVisible, updateColumnVisibility } from "./Column.js";
import { exists, isApp } from "./Utils.js";
import { openLegacySettings } from "./UISettings.js";
import { enterSafeMode } from "./SafeMode.js";
import { UILanguagePicker } from "./UILanguagePicker.js";
import { getColumnFromColumnNumber } from "./Column.js";
import { translationCredits } from "./DataTranslationCredits.js";

// Use standard macOS symbols instead of writing it out like on Windows

const ctrlShiftText = (navigator.userAgent.indexOf("Mac OS X") > -1) ? "⌃⇧" : "{{Ctrl+Shift+}}";

export let settingsData = {
	themes: {
		tabName:"<i class='material-icon' aria-hidden='true'>format_paint</i> {{Themes}}",
		options:{
			theme:{
				headerBefore:"{{Themes}}",
				title:"{{Theme}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						if (useSafeMode) {
							return;
						}

						// Migration for ModernDeck pre-Oasis (8.0.x or before)
						if (opt === "default") {
							opt = TD.settings.getTheme();
						}

						setTimeout(() => window.renderTab("themes"));

						if (getPref("mtd_highcontrast") === true) {
							disableStylesheetExtension("light");
							disableStylesheetExtension("darker");
							disableStylesheetExtension("discorddark");
							disableStylesheetExtension("paper");
							enableStylesheetExtension("dark");
							enableStylesheetExtension("amoled");
							enableStylesheetExtension("highcontrast");
							return;
						}

						switch (opt) {
							case "light":
								disableStylesheetExtension("amoled");
								disableStylesheetExtension("darker");
								disableStylesheetExtension("discorddark");
								disableStylesheetExtension("dark");
								disableStylesheetExtension("paper");
								enableStylesheetExtension("light");
								html.addClass("mtd-light").removeClass("mtd-dark");
								break;
							case "paper":
								disableStylesheetExtension("amoled");
								disableStylesheetExtension("darker");
								disableStylesheetExtension("discorddark");
								disableStylesheetExtension("dark");
								enableStylesheetExtension("light");
								enableStylesheetExtension("paper");
								html.addClass("mtd-light").removeClass("mtd-dark");
								break;
							case "dark":
								disableStylesheetExtension("amoled");
								disableStylesheetExtension("darker");
								disableStylesheetExtension("discorddark");
								disableStylesheetExtension("light");
								disableStylesheetExtension("paper");
								enableStylesheetExtension("dark");
								html.addClass("mtd-dark").removeClass("mtd-light");
								break;
							case "darker":
								disableStylesheetExtension("amoled");
								disableStylesheetExtension("light");
								disableStylesheetExtension("paper");
								disableStylesheetExtension("discorddark");
								enableStylesheetExtension("dark");
								enableStylesheetExtension("darker");
								html.addClass("mtd-dark").removeClass("mtd-light");
								break;
								
							case "discorddark":
								disableStylesheetExtension("amoled");
								disableStylesheetExtension("light");
								disableStylesheetExtension("paper");
								disableStylesheetExtension("darker");
								enableStylesheetExtension("discorddark");
								enableStylesheetExtension("dark");
								html.addClass("mtd-dark").removeClass("mtd-light");
								break;
							case "amoled":
								disableStylesheetExtension("light");
								disableStylesheetExtension("darker");
								disableStylesheetExtension("discorddark");
								disableStylesheetExtension("paper");
								enableStylesheetExtension("dark");
								enableStylesheetExtension("amoled");
								html.addClass("mtd-dark").removeClass("mtd-light");

								/* Dirty hack to fix amoled theme being reset by the high contrast setting later on upon loading */
								setTimeout(() => enableStylesheetExtension("amoled"), 0);
								
								break;
							case "custom":
								disableStylesheetExtension("light");
								disableStylesheetExtension("darker");
								disableStylesheetExtension("discorddark");
								disableStylesheetExtension("paper");
								disableStylesheetExtension("dark");
								disableStylesheetExtension("amoled");
								disableStylesheetExtension("highcontrast");
								break;

						}
					}
				},
				options:{
					lightThemes:{
						name:"{{Light Themes}}",
						children:{
							light:{value:"light",text:"{{Light}}"},
							paper:{value:"paper",text:"{{Paperwhite}}"}
						}
					},
					darkThemes:{
						name:"{{Dark Themes}}",
						children:{
							darker:{value:"darker",text:"{{Dark}}"},
							discorddark:{value:"discorddark",text:"{{Discord Dark}}"},
							dark:{value:"dark",text:"{{Material Dark}}"},
							amoled:{value:"amoled",text:"{{AMOLED}}"},
						}
					},
					// custom:{value:"custom",text:"{{Custom...}}"}
				},
				settingsKey:"mtd_theme",
				default:() => TD.settings.getTheme() === "dark" ? "darker" : "light"
			},
			themeColor:{
				title:"{{Theme Color}}",
				type:"dropdown",
				activate:{
					func: (opt) => {

						if (useSafeMode) {
							return;
						}

						for (let i in window.settingsData.themes.options.themeColor.options) {
							if (opt !== i)
								disableStylesheetExtension(i);
						}

						enableStylesheetExtension(opt);
					}
				},
				options:{
					default:{value:"default",text:"{{Default}}"},
					black:{value:"black",text:"{{Black}}"},
					grey:{value:"grey",text:"{{Grey}}"},
					red:{value:"red",text:"{{Red}}"},
					orange:{value:"orange",text:"{{Orange}}"},
					yellow:{value:"yellow",text:"{{Yellow}}"},
					green:{value:"green",text:"{{Green}}"},
					teal:{value:"teal",text:"{{Teal}}"},
					cyan:{value:"cyan",text:"{{Cyan}}"},
					blue:{value:"blue",text:"{{Blue}}"},
					violet:{value:"violet",text:"{{Violet}}"},
					pink:{value:"pink",text:"{{Pink}}"}
				},
				enabled:() => (getPref("mtd_theme") !== "custom"),
				settingsKey:"mtd_color_theme",
				default:"default"
			}, selectedFont:{
				title:"{{Preferred Font}}",
				type:"dropdown",
				options:{
					Roboto:{value:"Roboto",text:"Roboto"},
					RobotoCondensed:{value:"RobotoCondensed",text:"Roboto Condensed"},
					RobotoSlab:{value:"RobotoSlab",text:"Roboto Slab"},
					"Noto Sans CJK":{value:"Noto Sans CJK",text:"Noto Sans"},
					OpenSans:{value:"OpenSans",text:"Open Sans"},
					Lato:{value:"Lato",text:"Lato"},
					Jost:{value:"Jost",text:"Jost"},
					SystemUI:{value:"SystemUI", text:"{{System UI}}"}
				},
				activate:{
					func: (opt) => {
						html.removeClass("mtd-linux-system-font");

						if (opt === "RobotoMono") {
							setPref("mtd_selectedfont", "Roboto")
							opt = "Roboto";
						}

						if (opt === "SystemUI") {
							if (navigator.userAgent.match("Windows NT")) {
								enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:Segoe UI,Tahoma,sans-serif!important}");
							} else if (navigator.userAgent.match("Mac OS X")) {
								enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:San Francisco,Helvetica Neue,Lucida Grande!important}");
							} else {
								disableStylesheetExtension("selectedFont");
								html.addClass("mtd-linux-system-font");
							}
						} else {
							enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:"+ opt +"!important}");
						}
					}
				},
				settingsKey:"mtd_selectedfont",
				default:"Roboto"
			}, customCss:{
				title:"{{Custom CSS (}}" + ctrlShiftText + "{{C disables it in case something went wrong)}}",
				type:"textarea",
				placeholder:":root {\n"+
				"	--retweetColor:red;\n"+
				"	--primaryColor:#00ff00!important;\n"+
				"	--defaultFontOrder:Comic Sans MS;\n"+
				"}\n\n"+
				"a:hover {\n"+
				"	text-decoration:underline\n"+
				"}",
				activate:{
					func: (opt) => {
						setPref("mtd_customcss",opt);
						enableCustomStylesheetExtension("customcss",opt);
					}
				},
				settingsKey:"mtd_customcss",
				enabled:() => window.desktopConfig === undefined ? true : !window.desktopConfig.disableCustomCSS,
				default:""
			}
		}
	},
	appearance: {
		tabName:"<i class='material-icon' aria-hidden='true'>rounded_corner</i> {{Appearance}}",
		options:{
			 navigationStyle:{
				headerBefore:"{{Navigation}}",
				title:"{{Navigation Style}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						if (opt === "simplified") {
							html.addClass("mtd-head-left");
							html.removeClass("mtd-classic-nav");
							$(document).trigger("uiNavbarWidthChangeAction",{navbarWidth:"condensed"})
						} else if (opt === "classic") {
							html.addClass("mtd-head-left");
							html.addClass("mtd-classic-nav");
						}
						setPref("mtd_headposition",opt)
					}
				},
				options:{
					simplified:{value:"simplified",text:"{{Simplified}}"},
					classic:{value:"classic",text:"{{Classic (TweetDeck)}}"},
				},
				settingsKey:"mtd_headposition",
				default:"left"
			},
			fixedArrows:{
				title:"{{Use fixed-location media arrows for tweets with multiple photos}}",
				type:"checkbox",
				activate:{
					enableStylesheet:"fixedarrows"
				},
				deactivate:{
					disableStylesheet:"fixedarrows"
				},
				settingsKey:"mtd_usefixedarrows",
				default:true
			},
			enableNewTweetsButton:{
				title:"{{Enable \"New Tweets\" indicator}}",
				type:"checkbox",
				activate:{
					disableStylesheet:"nonewtweetsbutton"
				},
				deactivate:{
					enableStylesheet:"nonewtweetsbutton"
				},
				settingsKey:"mtd_nonewtweetsbutton",
				default:true
			},
			enableEmojiPicker:{
				title:"{{Enable Emoji picker}}",
				type:"checkbox",
				activate:{
					htmlRemoveClass:"mtd-no-emoji-picker"
				},
				deactivate:{
					htmlAddClass:"mtd-no-emoji-picker"
				},
				settingsKey:"mtd_noemojipicker",
				enabled:false,
				default:true
			},
			modalKeepOpen:{
				title:"{{Keep modals open to like/follow from multiple accounts}}",
				type:"checkbox",
				activate:{
					func: () => {
					}
				},
				deactivate:{
					func: () => {
					}
				},
				settingsKey:"mtd_modalKeepOpen",
				default:true
			},
			sensitiveMedia:{
				headerBefore:"{{Display}}",
				title:"{{Display media that may contain sensitive content}}",
				type:"checkbox",
				activate:{
					func: () => {
						TD.settings.setDisplaySensitiveMedia(true);
						setTimeout(() => window.renderTab("appearance"));
					}
				},
				deactivate:{
					func: () => {
						TD.settings.setDisplaySensitiveMedia(false);
						setTimeout(() => window.renderTab("appearance"));
					}
				},
				savePreference:false,
				queryFunction: () => {
					return TD.settings.getDisplaySensitiveMedia();
				}
			},
			blurMessages:{
				title:"{{Blur direct message contents unless hovered over}}",
				type:"checkbox",
				activate:{
					enableStylesheet:"hideMessages"
				},
				deactivate:{
					disableStylesheet:"hideMessages"
				},
				settingsKey:"mtd_hideMessages",
				default:false
			},
			threadIndicator:{
				title:`{{Display "Thread" on Tweets that are part of a thread}}`,
				type:"checkbox",
				activate:{
					enableStylesheet:"threadIndicator"
				},
				deactivate:{
					disableStylesheet:"threadIndicator"
				},
				settingsKey:"mtd_threadIndicator",
				default:false
			},
			altSensitiveMedia:{
				title:"{{Use alternative sensitive media workflow}}",
				type:"checkbox",
				activate:{
					enableStylesheet:"altsensitive",
					htmlAddClass:"mtd-altsensitive"
				},
				deactivate:{
					disableStylesheet:"altsensitive",
					htmlRemoveClass:"mtd-altsensitive"
				},
				enabled:() => !TD.settings.getDisplaySensitiveMedia(),
				settingsKey:"mtd_sensitive_alt",
				default:true
			},
			scrollbarStyle:{
				title:"{{Scrollbar Style}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						disableStylesheetExtension("scrollbarsnarrow");
						disableStylesheetExtension("scrollbarsnone");
						enableStylesheetExtension(opt || "scrollbarsdefault");
					}
				},
				options:{
					scrollbarsdefault:{value:"scrollbarsdefault",text:"{{Original}}"},
					scrollbarsnarrow:{value:"scrollbarsnarrow",text:"{{Narrow}}"},
					scrollbarsnone:{value:"scrollbarsnone",text:"{{Hidden}}"}
				},
				settingsKey:"mtd_scrollbar_style",
				default:"scrollbarsnarrow"
			},
			columnWidth:{
				title:"{{Column width}}",
				type:"slider",
				activate:{
					func: (opt) => {
						setPref("mtd_columnwidth",opt);
						enableCustomStylesheetExtension("columnwidth",`:root{--columnSize:${opt}px!important}`);
					}
				},
				minimum:275,
				maximum:500,
				settingsKey:"mtd_columnwidth",
				displayUnit:"px",
				default:325
			},
			fontSize:{
				title:"{{Font size}}",
				type:"slider",
				activate:{
					func: (opt) => {
						setPref("mtd_fontsize",opt);
						enableCustomStylesheetExtension("fontsize",`html{font-size:${(opt/100)*16}px!important}`);
					}
				},
				minimum:75,
				maximum:130,
				settingsKey:"mtd_fontsize",
				displayUnit:"{{%}}",
				default:100
			},
			avatarSize:{
				title:"{{Profile picture size}}",
				type:"slider",
				activate:{
					func: (opt) => {
						//setPref("mtd_avatarsize",opt);
						enableCustomStylesheetExtension("avatarsize",`:root{--avatarSize:${opt}px!important}`);
					}
				},
				minimum:24,
				maximum:64,
				enabled:true,
				settingsKey:"mtd_avatarsize",
				displayUnit:"px",
				default:48
			},
			roundProfilePics:{
				title:"{{Use round profile pictures}}",
				type:"checkbox",
				activate:{
					disableStylesheet:"squareavatars"
				},
				deactivate:{
					enableStylesheet:"squareavatars"
				},
				settingsKey:"mtd_round_avatars",
				default:true
			},
			newCharIndicator:{
				title:"{{Use new character limit indicator}}",
				type:"checkbox",
				activate:{
					enableStylesheet:"newcharacterindicator"
				},
				deactivate:{
					disableStylesheet:"newcharacterindicator"
				},
				settingsKey:"mtd_newcharindicator",
				default:true
			},
			disableContextMenuIcons:{
				title:"{{Display contextual icons in menus}}",
				type:"checkbox",
				activate:{
					disableStylesheet:"nocontextmenuicons"
				},
				deactivate:{
					enableStylesheet:"nocontextmenuicons"
				},
				settingsKey:"mtd_nocontextmenuicons",
				default:true
			}
		}
	},
	tweets: {
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
	}, mutes: {
		tabName:"<i class='material-icon' aria-hidden='true'>volume_off</i> {{Mutes}}",
		options:{},
		enum:"mutepage"
	}, accessibility: {
		tabName:"<i class='material-icon' aria-hidden='true'>accessibility</i> {{Accessibility}}",
		options:{
			focusOutline:{
				headerBefore:"{{Accessibility}}",
				title:"{{Always show outlines around focused items (}}" + ctrlShiftText + "A {{to toggle)}}",
				type:"checkbox",
				activate:{
					htmlAddClass:"mtd-acc-focus-ring"
				},
				deactivate:{
					htmlRemoveClass:"mtd-acc-focus-ring"
				},
				settingsKey:"mtd_outlines",
				default:false
			},
			highContrast:{
				title:"{{Enable High Contrast theme (}}" + ctrlShiftText + "H {{to toggle)}}",
				type:"checkbox",
				activate:{
					func: (opt) => {
						disableStylesheetExtension("light");
						disableStylesheetExtension("darker");
						disableStylesheetExtension("discorddark");
						disableStylesheetExtension("paper");
						enableStylesheetExtension("dark");
						enableStylesheetExtension("amoled");
						enableStylesheetExtension("highcontrast");
					}
				},
				deactivate:{
					func: (opt) => {
						disableStylesheetExtension("highcontrast");
						disableStylesheetExtension("amoled");
					}
				},
				settingsKey:"mtd_highcontrast",
				default:false
			}
		}
	}, app: {
		tabName:"<i class='icon icon-moderndeck'></i> {{App}}",
		enabled:() => isApp,
		options:{
			nativeTitlebar:{
				headerBefore:"{{App}}",
				title:"{{Use native OS title bar (restarts ModernDeck)}}",
				type:"checkbox",
				activate:{
					func: () => {
						if (!exists($(".mtd-settings-panel")[0])) {
							return;
						}

						setPref("mtd_nativetitlebar",true);

						const {ipcRenderer, ipcMain} = require("electron");
						if (!!ipcRenderer)
							ipcRenderer.send("setNativeTitlebar", true);
					}
				},
				deactivate:{
					func: () => {
						if (!exists($(".mtd-settings-panel")[0])) {
							return;
						}

						setPref("mtd_nativetitlebar",false);

						const { ipcRenderer } = require("electron");
						if (!!ipcRenderer)
							ipcRenderer.send("setNativeTitlebar", false);
					}
				},
				settingsKey:"mtd_nativetitlebar",
				default:false
			},
			nativeEmoji:{
				title:"{{Use native Emoji Picker}}",
				type:"checkbox",
				activate:{
					func: (opt, load) => {
						if (!load) {
							$(document).trigger("uiDrawerHideDrawer");
						}
						setPref("mtd_nativeEmoji",true);
					}
				},
				deactivate:{
					func: (opt, load) => {
						if (!load) {
							$(document).trigger("uiDrawerHideDrawer");
						}
						setPref("mtd_nativeEmoji",false);
					}
				},
				enabled:false,
				settingsKey:"mtd_nativeEmoji",
				default:false
			},
			nativeContextMenus:{
				title:"{{Use OS native context menus}}",
				type:"checkbox",
				activate:{
					func: () => {
						useNativeContextMenus = true;
					}
				},
				deactivate:{
					func: () => {
						useNativeContextMenus = false;
					}
				},
				settingsKey:"mtd_nativecontextmenus",
				default:() => (isApp ? process.platform === "darwin" : false)
			}, updateChannel:{
				title:"{{App update channel}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						if (!isApp) {
							return;
						}
						setPref("mtd_updatechannel",opt);

						setTimeout(() => {
							const { ipcRenderer } = require("electron");
							if (!!ipcRenderer) {
								ipcRenderer.send("changeChannel", opt);

								if (window.desktopConfig.updatePolicy !== "disabled" && window.desktopConfig.updatePolicy !== "manual") {
									ipcRenderer.send("checkForUpdates");
								}
							}
						},300)
					}
				},
				options:{
					latest:{value:"latest",text:"{{Stable}}"},
					beta:{value:"beta",text:"{{Beta}}"}
				},
				enabled:!document.getElementsByTagName("html")[0].classList.contains("mtd-flatpak") &&!document.getElementsByTagName("html")[0].classList.contains("mtd-winstore") && !document.getElementsByTagName("html")[0].classList.contains("mtd-macappstore"),
				settingsKey:"mtd_updatechannel",
				default:"latest"
			},
			trayEnabled:{
				headerBefore:"{{Tray}}",
				title:"{{Show ModernDeck in the system tray}}",
				type:"checkbox",
				activate:{
					func: () => {
						if (typeof require === "undefined") {
							return;
						}
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("enableTray");
					}
				},
				deactivate:{
					func: () => {
						if (typeof require === "undefined") {
							return;
						}
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("disableTray");
					}
				},
				settingsKey:"mtd_systemtray",
				default:(typeof process !== "undefined" && process.platform !== "darwin")
			},
			backgroundNotifications:{
				title:"{{Run ModernDeck in the background to deliver notifications}}",
				type:"checkbox",
				activate:{
					func: () => {
						if (typeof require === "undefined") {
							return;
						}
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("enableBackground");
					}
				},
				deactivate:{
					func: () => {
						if (typeof require === "undefined") {
							return;
						}
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("disableBackground");
					}
				},
				settingsKey:"mtd_background",
				default:false
			},
			inspectElement:{
				headerBefore:"{{Developer}}",
				title:"{{Show Inspect Element in context menus}}",
				type:"checkbox",
				isDevTool:true,
				activate:{
					func: () => {
						setPref("mtd_inspectElement",true);
					}
				},
				deactivate:{
					func: () => {
						setPref("mtd_inspectElement",false);
					}
				},
				settingsKey:"mtd_inspectElement",
				default:false
			},
			mtdSafeMode: {
				title:"{{Safe mode}}",
				label:"{{Safe mode}}",
				type:"link",
				isDevTool:true,
				activate:{
					func: () => {
						enterSafeMode();
					}
				},
				enabled:() => isApp
			},
			tdLegacySettings: {
				title:"{{Legacy settings}}",
				label:"{{Legacy settings}}",
				type:"link",
				isDevTool:true,
				enabled:() => !html.hasClass("signin-sheet-now-present"),
				activate:{
					func: () => {
						openLegacySettings();
					}
				}
			}
		}
	}, system: {
		tabName:"<i class='material-icon' aria-hidden='true'>storage</i> {{System}}",
		options:{
			mtdResetSettings:{
				title:"{{Reset settings}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">restore</i><b>{{Reset settings}}</b><br>{{If you want to reset ModernDeck to default settings, you can do so here. This will restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						purgePrefs();

						if (isApp) {
							const { ipcRenderer } = require("electron");
							ipcRenderer.send('restartApp');
						} else {
							window.location.reload();
						}
					}
				},
				settingsKey:"mtd_resetSettings"
			},
			mtdClearData:{
				title:"{{Clear data}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">delete_forever</i><b>{{Clear data}}</b><br>{{This option clears all caches and preferences. This option will log you out and restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						if (isApp) {
							const { ipcRenderer } = require("electron");

							ipcRenderer.send('destroyEverything');
						}
					}
				},
				settingsKey:"mtd_resetSettings",
				enabled:() => isApp
			},
			mtdSaveBackup:{
				title:"{{Save backup}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">save_alt</i><b>{{Save backup}}</b><br>{{Saves your preferences to a file to be loaded later.}}",
				type:"button",
				activate:{
					func: () => {
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("saveSettings", JSON.stringify(store.store));
					}
				},
				settingsKey:"mtd_backupSettings",
				enabled:() => isApp
			},
			mtdLoadBackup:{
				title:"{{Load backup}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>{{Load backup}}</b><br>{{Loads your preferences that you have saved previously. This will restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("loadSettingsDialog");
					}
				},
				settingsKey:"mtd_loadSettings",
				enabled:() => isApp
			},
			mtdTweetenImport:{
				title:"{{Import Tweeten settings}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>{{Import Tweeten settings}}</b><br>{{Imports your Tweeten settings to ModernDeck. This will restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						const { ipcRenderer } = require("electron");
						ipcRenderer.send("tweetenImportDialog");
					}
				},
				settingsKey:"mtd_tweetenImportSettings",
				enabled:() => isApp
			}
		}
	}, language: {
		tabName:"<i class='material-icon' aria-hidden='true'>language</i> {{Language}}",
		options:{
			mtdChangeLanguage:{
				headerBefore:"{{Language}}",
				title:"{{Change Language}}",
				label:"{{Changing your language will reset formatting customizations and restart ModernDeck}}",
				type:"button",
				activate:{
					func: () => {
						mtdPrepareWindows();
						new UILanguagePicker();
					}
				}
			},
			translationCredits:{
				label:"{{Some awesome people have helped translate ModernDeck into other languages}}",
				type:"buttons",
				buttons:[
					{text:"{{Help Translate}}", func:() => open("http://translate.moderndeck.org/project/tweetdeck/invite") },
					{text:"{{Translation Credits}}", func:() => new UIAlert({title:I18n("Translation Credits"), message:translationCredits}).alertButton.remove()}
				]
			},
			timeFormat:{
				headerBefore:"{{Formatting}}",
				title:"{{Time format}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						window.mtdTimeHandler = opt;
					}
				},
				options:{
					default:{value:"default",text:"{{Language default}}"},
					h12:{value:"h12",text:"1:30 {{pm}}"},
					h24:{value:"h24",text:"13:30"}
				},
				settingsKey:"mtd_timeFormat",
				default:"default"
			},
			numberFormat:{
				title:"{{Number formatting}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						window.mtdNeedsResetNumberFormatting = true;
					}
				},
				options:{
					default:{value:"default",text:"{{Language default}}"},
					english:{value:"english",text:"1,234,567.89"},
					european:{value:"european",text:"1.234.567,89"},
					blank:{value:"blank",text:"1 234 567,89"},
					indian:{value:"indian",text:"12,34,567.89"}
				},
				settingsKey:"mtd_shortDateFormat",
				default:"default"
			},
			abbrevNumbers:{
				title:"{{Abbreviate large numbers (thousands, millions)}}",
				type:"checkbox",
				activate:{
					func: () => {
						window.mtdAbbrevNumbers = true
					}
				},
				deactivate:{
					func: () => {
						window.mtdAbbrevNumbers = false
					}
				},
				settingsKey:"mtd_abbrevNumbers",
				default:true
			},
		}
	}, about: {
		tabName:"<i class='material-icon' aria-hidden='true'>info_outline</i> {{About}}",
		tabId:"about",
		options:{},
		enum:"aboutpage"
	}, internalSettings : {
		enabled: false,
		options: {
			collapsedColumns:{
				type:"array",
				activate:{
					func: (e) => {
						if (!e) {
							return;
						}
						e.forEach((a, i) => {
							getColumnFromColumnNumber(a).addClass("mtd-collapsed")
						});
						setTimeout(() => {
							$(document).trigger("uiMTDColumnCollapsed");
						},300);
					}
				},
				settingsKey:"mtd_collapsed_columns",
				default:[]
			},
			lastVersion:{
				type:"textbox",
				activate:{
					func: (e) => {
						if (window.SystemVersion !== getPref("mtd_last_version")) {
							// todo: something
						}
					}
				},
				settingsKey:"mtd_last_version",
				default:window.SystemVersion
			},
			replaceFavicon:{
				type:"checkbox",
				activate:{
					func: () => {
						$("link[rel=\"shortcut icon\"]").attr("href",mtdBaseURL + "assets/img/favicon.ico");
					}
				},
				settingsKey:"mtd_replace_favicon",
				savePreference:false,
				default:true
			}
		}
	}
}
