
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
import { debugStorageSys, hasPref, getPref, setPref, purgePrefs } from "./StoragePreferences.js";
import { allColumnsVisible, updateColumnVisibility } from "./Column.js";
import { exists } from "./Utils.js";
import { importTweetenSettings } from "./StorageTweetenImport.js";
import { openLegacySettings } from "./UISettings.js";
import { enterSafeMode } from "./SafeMode.js";
import { UILanguagePicker } from "./UILanguagePicker.js";
import { getColumnFromColumnNumber } from "./Column.js";
import { translationCredits } from "./DataTranslationCredits.js";

// Use standard macOS symbols instead of writing it out like on Windows

const ctrlShiftText = (navigator.userAgent.indexOf("Mac OS X") > -1) ? "⌃⇧" : "{{Ctrl+Shift+}}";

import { isApp } from "./utils.js"

export let settingsData = {
	themes: {
		tabName:"<i class='material-icon'>format_paint</i> {{Themes}}",
		options:{
			coretheme:{
				headerBefore:"{{Themes}}",
				title:"{{Core Theme}}",
				type:"dropdown",
				activate:{
					func: (opt) => {

						if (typeof opt === "undefined" || opt === "undefined") {
							throw "Attempt to pass undefined for mtd_core_theme. This will break TweetDeck across platforms. Something has to be wrong";
							TD.settings.setTheme("dark");
							return;
						}

						disableStylesheetExtension("dark");
						disableStylesheetExtension("light");

						if (useSafeMode) {
							return;
						}

						if (hasPref("mtd_highcontrast") && getPref("mtd_highcontrast") === true) {
							opt = "dark";
						}

						html.removeClass("dark").removeClass("light").addClass(opt);
						TD.settings.setTheme(opt);
						enableStylesheetExtension(opt);

						if (opt === "light" && (isStylesheetExtensionEnabled("amoled") || isStylesheetExtensionEnabled("darker"))) {
							disableStylesheetExtension("darker");
							disableStylesheetExtension("amoled");
							setPref("mtd_theme","default");
						}
						if (opt === "dark" && isStylesheetExtensionEnabled("paper")) {
							disableStylesheetExtension("paper");
							setPref("mtd_theme","default");
						}

						if (hasPref("mtd_customcss")) {
							disableStylesheetExtension("customcss");
							enableCustomStylesheetExtension("customcss",getPref("mtd_customcss"));
						}
					}
				},
				options:{
					dark:{value:"dark",text:"{{Dark}}"},
					light:{value:"light",text:"{{Light}}"}
				},
				savePreference:false,
				queryFunction: () => {
					html.addClass(TD.settings.getTheme());
					return TD.settings.getTheme()
				},
				settingsKey:"mtd_core_theme",
				default:"dark"
			},
			theme:{
				title:"{{Custom Theme}}",
				type:"dropdown",
				activate:{
					func: (opt) => {

						if (getPref("mtd_highcontrast") === true) {
							return;
						}

						if (useSafeMode) {
							return;
						}

						if (!hasPref("mtd_theme")) {
							setPref("mtd_theme","default")
						}

						disableStylesheetExtension(getPref("mtd_theme"));
						disableStylesheetExtension("amoled");
						setPref("mtd_theme",opt);
						enableStylesheetExtension(opt || "default");

						if ((opt === "amoled" || opt === "darker") && TD.settings.getTheme() === "light") {
							TD.settings.setTheme("dark");
							disableStylesheetExtension("light");
							enableStylesheetExtension("dark");
							html.removeClass("light").addClass("dark");
						}

						if (opt === "paper" && TD.settings.getTheme() === "dark") {
							TD.settings.setTheme("light");
							disableStylesheetExtension("dark");
							enableStylesheetExtension("light");
							html.removeClass("dark").addClass("light");
						}

						if (opt === "black" && TD.settings.getTheme() === "dark") {
							disableStylesheetExtension("black");
							enableStylesheetExtension("amoled");
							setPref("mtd_theme","amoled");
						}

						if (hasPref("mtd_customcss")) {
							disableStylesheetExtension("customcss");
							enableCustomStylesheetExtension("customcss",getPref("mtd_customcss"));
						}
					}
				},
				options:{
					default:{value:"default",text:"{{Default}}"},
					completeLight:{
						name:"{{Complete Light Themes}}",
						children:{
							paper:{value:"paper",text:"{{Paperwhite}}"}
						}
					},
					completeDark:{
						name:"{{Complete Dark Themes}}",
						children:{
							darker:{value:"darker",text:"{{Darker}}"},
							amoled:{value:"amoled",text:"{{AMOLED}}"}
						}
					},
					complementary:{
						name:"{{Complementary Themes}}",
						children:{
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
						}
					}
				},
				settingsKey:"mtd_theme",
				default:"default"
			}, selectedFont:{
				title:"{{Preferred Font}}",
				type:"dropdown",
				options:{
					Roboto:{value:"Roboto",text:"Roboto"},
					RobotoCondensed:{value:"RobotoCondensed",text:"Roboto Condensed"},
					RobotoSlab:{value:"RobotoSlab",text:"Roboto Slab"},
					RobotoMono:{value:"RobotoMono",text:"Roboto Mono"},
					OpenSans:{value:"OpenSans",text:"Open Sans"},
					Lato:{value:"Lato",text:"Lato"},
					Jost:{value:"Jost",text:"Jost"}
				},
				activate:{
					func: (opt) => {
						enableCustomStylesheetExtension("selectedFont",":root{--selectedFont:"+ opt +"!important}");
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
				default:""
			}
		}
	},
	appearance: {
		tabName:"<i class='material-icon'>rounded_corner</i> {{Appearance}}",
		options:{
			headposition:{
				headerBefore:"{{Navigation}}",
				title:"{{Navigation Style}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						if (opt === "top") {
							html.removeClass("mtd-head-left");
							html.removeClass("mtd-classic-nav");
							$(document).trigger("uiNavbarWidthChangeAction",{navbarWidth:"condensed"})
						} else if (opt === "left") {
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
					top:{value:"top",text:"{{Top}}"},
					left:{value:"left",text:"{{Left}}"},
					classic:{value:"classic",text:"{{Left (Classic)}}"},
				},
				settingsKey:"mtd_headposition",
				default:"left"
			},
			columnvisibility:{
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
				default:navigator.userAgent.match("Firefox") !== null // Firefox is so much faster that column visibility is unlikely to benefit
			},
			fixedarrows:{
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
			altsensitive:{
				title:"{{Use alternative sensitive media workflow}}",
				type:"checkbox",
				activate:{
					enableStylesheet:"altsensitive"
				},
				deactivate:{
					disableStylesheet:"altsensitive"
				},
				settingsKey:"mtd_sensitive_alt",
				default:false
			},
			colNavAlwaysVis:{
				title:"{{Always display column icons in navigator}}",
				type:"checkbox",
				enabled:false,
				activate:{
					htmlAddClass:"mtd-column-nav-always-visible"
				},
				deactivate:{
					htmlRemoveClass:"mtd-column-nav-always-visible"
				},
				settingsKey:"mtd_column_nav_always_visible",
				default:true
			},
			nonewtweetsbutton:{
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
			noemojipicker:{
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
			scrollbarstyle:{
				headerBefore:"{{Display}}",
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
			columnwidth:{
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
			roundprofilepics:{
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
			newcharindicator:{
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
			nocontextmenuicons:{
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
			},
			sensitive:{
				title:"{{Display media that may contain sensitive content}}",
				type:"checkbox",
				activate:{
					func: () => {
						TD.settings.setDisplaySensitiveMedia(true);
					}
				},
				deactivate:{
					func: () => {
						TD.settings.setDisplaySensitiveMedia(false);
					}
				},
				savePreference:false,
				queryFunction: () => {
					return TD.settings.getDisplaySensitiveMedia();
				}
			}
		}
	},
	accessibility: {
		tabName:"<i class='material-icon'>accessibility</i> {{Accessibility}}",
		options:{
			accoutline:{
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
			highcont:{
				title:"{{Enable High Contrast theme (}}" + ctrlShiftText + "H {{to toggle)}}",
				type:"checkbox",
				activate:{
					func: (opt) => {
						if (TD.settings.getTheme() === "light") {
							TD.settings.setTheme("dark");
							disableStylesheetExtension("light");
							enableStylesheetExtension("dark");
						}
						disableStylesheetExtension(getPref("mtd_theme") || "default");
						setPref("mtd_theme","amoled");
						setPref("mtd_highcontrast",true);
						enableStylesheetExtension("amoled");
						enableStylesheetExtension("highcontrast");
					}
				},
				deactivate:{
					func: (opt) => {
						setPref("mtd_highcontrast",false);
						disableStylesheetExtension("highcontrast");
					}
				},
				settingsKey:"mtd_highcontrast",
				default:false
			}
		}
	}, tweets: {
		tabName:"<i class='Icon icon-twitter-bird'></i> {{Tweets}}",
		options:{
			stream:{
				headerBefore:"{{Function}}",
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
			useModernDeckSounds:{
				title:"{{Use custom ModernDeck alert sound}}",
				type:"checkbox",
				activate:{
					func: () => {
						$(document.querySelector("audio")).attr("src",mtdBaseURL + "resources/alert_3.mp3");
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
			linkshort:{
				headerBefore:"{{Link Shortening}}",
				title:"{{Link Shortener Service}}",
				type:"dropdown",
				activate:{
					func: set => {
						if (shortener === "twitter") {
							$(".bitlyUsername").addClass("hidden");
							$(".bitlyApiKey").addClass("hidden");
						} else if (shortener === "bitly") {
							$(".bitlyUsername").removeClass("hidden");
							$(".bitlyApiKey").removeClass("hidden");
						}
						TD.settings.setLinkShortener(set);
					}
				},
				savePreference:false,
				queryFunction: () => {
					let shortener = TD.settings.getLinkShortener();
					if (shortener === "twitter") {
						$(".bitlyUsername").addClass("hidden");
						$(".bitlyApiKey").addClass("hidden");
					} else if (shortener === "bitly") {
						$(".bitlyUsername").removeClass("hidden");
						$(".bitlyApiKey").removeClass("hidden");
					}
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
				savePreference:false,
				queryFunction: () => {
					return ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().login) ? TD.settings.getBitlyAccount() : {login:""}).login;
				}
			},
			bitlyApiKey:{
				title:"{{Bit.ly API Key}}",
				type:"textbox",
				addClass:"mtd-big-text-box",
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
		tabName:"<i class='material-icon'>volume_off</i> {{Mutes}}",
		options:{},
		enum:"mutepage"
	}, app: {
		tabName:"<i class='icon icon-moderndeck'></i> {{App}}",
		enabled:isApp,
		options:{
			nativeTitlebar:{
				headerBefore:"{{App settings}}",
				title:"{{Use native OS title bar (restarts ModernDeck)}}",
				type:"checkbox",
				activate:{
					func: () => {
						if (!exists($(".mtd-settings-panel")[0])) {
							return;
						}

						setPref("mtd_nativetitlebar",true);

						const {ipcRenderer} = require('electron');
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

						const {ipcRenderer} = require('electron');
						if (!!ipcRenderer)
							ipcRenderer.send("setNativeTitlebar", false);
					}
				},
				settingsKey:"mtd_nativetitlebar",
				default:false
			},
			inspectElement:{
				title:"{{Show Inspect Element in context menus}}",
				type:"checkbox",
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
				default:isApp ? process.platform === "darwin" : false
			},theme:{
				title:"{{App update channel}}",
				type:"dropdown",
				activate:{
					func: (opt) => {
						if (!isApp) {
							return;
						}
						setPref("mtd_updatechannel",opt);

						setTimeout(() => {
							const {ipcRenderer} = require('electron');
							if (!!ipcRenderer) {
								ipcRenderer.send("changeChannel", opt);

								ipcRenderer.send('checkForUpdates');
							}
						},300)
					}
				},
				options:{
					latest:{value:"latest",text:"{{Stable}}"},
					beta:{value:"beta",text:"{{Beta}}"}
				},
				settingsKey:"mtd_updatechannel",
				default:"latest"
			},
			mtdSafeMode: {
				title:"{{Safe mode}}",
				label:"{{Is something broken? Enter Safe Mode.}}",
				type:"link",
				activate:{
					func: () => {
						enterSafeMode();
					}
				},
				enabled:isApp
			}
		}
	}, system: {
		tabName:"<i class='material-icon'>settings_backup_restore</i> {{System}}",
		options:{
			mtdResetSettings:{
				title:"{{Reset settings}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">restore</i><b>{{Reset settings}}</b><br>{{If you want to reset ModernDeck to default settings, you can do so here. This will restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						purgePrefs();

						if (isApp) {
							const {ipcRenderer} = require('electron');
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
							const {ipcRenderer} = require('electron');

							ipcRenderer.send('destroyEverything');
						}
					}
				},
				settingsKey:"mtd_resetSettings",
				enabled:isApp
			},
			mtdSaveBackup:{
				title:"{{Save backup}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">save_alt</i><b>{{Save backup}}</b><br>{{Saves your preferences to a file to be loaded later.}}",
				type:"button",
				activate:{
					func: () => {
						const app = require("electron").remote;
						const dialog = app.dialog;
						const fs = require("fs");
						const {ipcRenderer} = require('electron');

						let preferences = JSON.stringify(store.store);

						dialog.showSaveDialog(
						{
							title: I18n("ModernDeck Preferences"),
							filters: [{ name: I18n("Preferences JSON File"), extensions: ["json"] }]
						},
						(file) => {
							if (file === undefined) {
								return;
							}
							fs.writeFile(file, preferences, (e) => {});
						}
					);
					}
				},
				settingsKey:"mtd_backupSettings",
				enabled:isApp
			},
			mtdLoadBackup:{
				title:"{{Load backup}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>{{Load backup}}</b><br>{{Loads your preferences that you have saved previously. This will restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						const app = require("electron").remote;
						const dialog = app.dialog;
						const fs = require("fs");
						const {ipcRenderer} = require('electron');

						dialog.showOpenDialog(
							{ filters: [{ name: I18n("Preferences JSON File"), extensions: ["json"] }] },
							(file) => {
								if (file === undefined) {
									return;
								}

								fs.readFile(file[0],"utf-8",(e, load) => {
									store.store = JSON.parse(load);
									ipcRenderer.send("restartApp");
								});
							}
						);
					}
				},
				settingsKey:"mtd_loadSettings",
				enabled:isApp
			},
			mtdTweetenImport:{
				title:"{{Import Tweeten settings}}",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>{{Import Tweeten settings}}</b><br>{{Imports your Tweeten settings to ModernDeck. This will restart ModernDeck.}}",
				type:"button",
				activate:{
					func: () => {
						const app = require("electron").remote;
						const dialog = app.dialog;
						const fs = require("fs");
						const {ipcRenderer} = require('electron');

						dialog.showOpenDialog(
							{ filters: [{ name: I18n("Tweeten Settings JSON"), extensions: ["json"] }] },
							(file) => {
								if (file === undefined) {
									return;
								}

								fs.readFile(file[0],"utf-8",(e, load) => {
									importTweetenSettings(JSON.parse(load));
									setTimeout(() => {
										ipcRenderer.send("restartApp");
									},500); // We wait to make sure that native TweetDeck settings have been propagated
								});
							}
						);
					}
				},
				settingsKey:"mtd_tweetenImportSettings",
				enabled:isApp
			},
			tdLegacySettings: {
				title:"{{Legacy settings}}",
				label:"{{Did TweetDeck add a new feature we're missing? Visit legacy settings}}",
				type:"link",
				activate:{
					func: () => {
						openLegacySettings();
					}
				}
			}
		}
	}, language: {
		tabName:"<i class='material-icon'>language</i> {{Language}}",
		options:{
			mtdResetSettings:{
				title:"{{Change Language}}",
				label:"<b>{{Changing your language will restart ModernDeck}}</b>",
				type:"button",
				activate:{
					func: () => {
						mtdPrepareWindows();
						new UILanguagePicker();
					}
				},
				settingsKey:"mtd_resetSettings"
			},
			translationCredits:{
				label:"{{Some awesome people have helped translate ModernDeck into other languages}}",
				type:"buttons",
				buttons:[
					{text:"{{Help Translate}}", func:() => open("http://translate.moderndeck.org/project/tweetdeck/invite") },
					{text:"{{Translation Credits}}", func:() => new UIAlert({title:I18n("Translation Credits"), message:translationCredits}).alertButton.remove()}
				]
			}
		}
	}, about: {
		tabName:"<i class='material-icon'>info_outline</i> {{About}}",
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
				default:[]
			},
		}
	}
}
