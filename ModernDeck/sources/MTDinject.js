/*
	MTDinject.js
	Copyright (c) 2019 dangeredwolf
	Released under the MIT licence

	made with love <3

*/

'use strict';

const SystemVersion = "7.2";
const appendTextVersion = true;

let mtdBaseURL = "https://raw.githubusercontent.com/dangeredwolf/ModernDeck/master/ModernDeck/";
// Defaults to obtaining assets from GitHub if MTDURLExchange isn't completed properly
const giphyKey = "Vb45700bexRDqCkbMdUmBwDvtkWT9Vj2"; // swiper no swipey
let lastGiphyURL = "";
let isLoadingMoreGifs = false;

let loginIntervalTick = 0;

const forceFeatureFlags = false;
const forceAppx = false; // https://github.com/electron/electron/issues/18161
const useRaven = false;

let newLoginPage =
'<div class="app-signin-wrap mtd-signin-wrap">\
	<div class="js-signin-ui app-signin-form pin-top pin-right txt-weight-normal">\
		<section class="js-login-form form-login startflow-panel-rounded" data-auth-type="twitter">\
			<h2 class="form-legend padding-axl">\
				Good evening!\
			</h2>\
			<h3 class="form-legend padding-axl">\
				Welcome to ModernDeck\
			</h3>\
			<i class="icon icon-moderndeck"></i>\
			<div class="margin-a--16">\
				<div class="js-login-error form-message form-error-message error txt-center padding-al margin-bxl is-hidden">\
					<p class="js-login-error-message">\
						An unexpected error occurred. Please try again later.\
					</p>\
				</div>\
				<a href="https://twitter.com/login?hide_message=true&amp;redirect_after_login=https%3A%2F%2Ftweetdeck.twitter.com%2F%3Fvia_twitter_login%3Dtrue" class="Button Button--primary block txt-size--18 txt-center btn-positive">\
					Sign in with Twitter\
				</a>\
				<div class="divider-bar"></div>\
			</section>\
		</div>\
	</div>\
</div>';


const spinnerSmall =
'<div class="preloader-wrapper active">\
	<div class="spinner-layer small">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';

const spinnerLarge =
'<div class="preloader-wrapper active">\
	<div class="spinner-layer">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';

const spinnerTiny =
'<div class="preloader-wrapper active">\
	<div class="spinner-layer tiny">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';

const buttonSpinner =
'<div class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner preloader-wrapper active tiny">\
	<div class="spinner-layer small">\
		<div class="circle-clipper left">\
			<div class="circle"></div>\
		</div>\
		<div class="gap-patch">\
			<div class="circle"></div>\
		</div>\
		<div class="circle-clipper right">\
			<div class="circle"></div>\
		</div>\
	</div>\
</div>';


let replacedLoadingSpinnerNew = false;
let sendingFeedback = false;

let ugltStarted = false;
let useNativeContextMenus = true;
let isDev = true;
let debugStorageSys = true;

let store;
let loginInterval;
let offlineNotification;

const make = function(a) {
	return $(document.createElement(a));
}

// shorthand function to return true if something exists and false otherwise

const exists = function(thing) {
	return ((typeof thing === "object" && thing !== null && thing.length > 0) || !!thing === true || (typeof thing === "string") || (typeof thing === "number"));
}

const isOpera = typeof opera !== "undefined";
const isSafari = typeof safari !== "undefined";
const isEdge = typeof MSGesture !== "undefined";
const isFirefox = typeof mozInnerScreenX !== "undefined";
const isApp = typeof require !== "undefined";

// may also return true on chromium-based browsers like opera, edge chromium, and electron
const isChrome = typeof chrome !== "undefined" && !isEdge && !isFirefox;

// user agent hacks make me sad but im lazy
const isWin = navigator.userAgent.indexOf("Windows NT") > -1;
const isMac = navigator.userAgent.indexOf("Mac OS X") > -1;

const ctrlShiftText = isMac ? "⌃⇧" : "Ctrl+Shift+";

let injectedFonts = false;

let head = undefined;
let body = undefined;
let html = undefined;

let MTDStorage = {};

let contextMenuFunctions = {
	cut: () => {
		getIpc().send("cut");
	},
	copy: () => {
		getIpc().send("copy");
	},
	paste: () => {
		getIpc().send("paste");
	},
	undo: () => {
		getIpc().send("undo");
	},
	redo: () => {
		getIpc().send("redo");
	},
	selectAll: () => {
		getIpc().send("selectAll");
	},
	delete: () => {
		getIpc().send("delete");
	},
	openLink: (e) => {
		window.open(e);
	},
	copyLink: (e) => {
		const { clipboard } = require('electron');
		clipboard.writeText(e);
	},
	openImage: (e) => {
		window.open(e);
	},
	copyImageURL: (e) => {
		const { clipboard } = require('electron');
		clipboard.writeText(e);
	},
	copyImage: (e) => {
		getIpc().send("copyImage",e);
	},
	saveImage: (e) => {
		getIpc().send("saveImage",e);
	},
	inspectElement: (e) => {
		getIpc().send("inspectElement",e);
	},
	restartApp: (e) => {
		getIpc().send("restartApp",e);
	},
	newSettings: (e) => {
		openSettings();
	}

};

// This code changes the text to respond to the time of day, naturally

let mtdStarted = new Date();

if (mtdStarted.getHours() < 12) { // 12:00 / 12:00pm
	newLoginPage = newLoginPage.replace("Good evening","Good morning");
} else if (mtdStarted.getHours() < 18) { // 18:00 / 6:00pm
	newLoginPage = newLoginPage.replace("Good evening","Good afternoon");
}

let settingsData = {
	themes: {
		tabName:"Themes",
		options:{
			coretheme:{
				headerBefore:"Themes",
				title:"Core Theme",
				type:"dropdown",
				activate:{
					func: (opt) => {

						if (typeof opt === "undefined" || opt === "undefined") {
							throw "Attempt to pass undefined for mtd_core_theme. This will break TweetDeck across platforms. Something has to be wrong";
							TD.settings.setTheme("dark");
							return;
						}

						disableStylesheetComponent("dark");
						disableStylesheetComponent("light");

						if (hasPref("mtd_highcontrast") && getPref("mtd_highcontrast") === true) {
							opt = "dark";
						}

						html.removeClass("dark").removeClass("light").addClass(opt);
						TD.settings.setTheme(opt);
						enableStylesheetComponent(opt);

						if (opt === "light" && (isStylesheetExtensionEnabled("amoled"))) {
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
					dark:{value:"dark",text:"Dark"},
					light:{value:"light",text:"Light"}
				},
				queryFunction: () => {
					console.log(TD.settings.getTheme());
					html.addClass(TD.settings.getTheme());
					return TD.settings.getTheme()
				},
				settingsKey:"mtd_core_theme",
				default:"dark"
			},
			theme:{
				title:"Custom Theme",
				type:"dropdown",
				activate:{
					func: (opt) => {

						if (getPref("mtd_highcontrast") === true) {
							return;
						}

						if (!hasPref("mtd_theme")) {
							setPref("mtd_theme","default")
						}

						disableStylesheetExtension(getPref("mtd_theme"));
						setPref("mtd_theme",opt);
						enableStylesheetExtension(opt || "default");

						if (opt === "amoled" && TD.settings.getTheme() === "light") {
							console.log("theme is light, opt is amoled");
							TD.settings.setTheme("dark");
							disableStylesheetComponent("light");
							enableStylesheetComponent("dark");
							html.removeClass("light").addClass("dark");
						}

						if (opt === "paper" && TD.settings.getTheme() === "dark") {
							console.log("theme is dark, opt is paper");
							TD.settings.setTheme("light");
							disableStylesheetComponent("dark");
							enableStylesheetComponent("light");
							html.removeClass("dark").addClass("light");
						}

						if (opt === "black" && TD.settings.getTheme() === "dark") {
							console.log("theme is dark, opt is black");
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
					default:{value:"default",text:"Default"},
					complete:{
						name:"Complete Themes",
						children:{
							paper:{value:"paper",text:"Paperwhite"},
							amoled:{value:"amoled",text:"AMOLED"}
						}
					},
					complementary:{
						name:"Complementary Themes",
						children:{
							grey:{value:"grey","text":"Grey"},
							red:{value:"red","text":"Red"},
							pink:{value:"pink","text":"Pink"},
							orange:{value:"orange","text":"Orange"},
							violet:{value:"violet","text":"Violet"},
							teal:{value:"teal","text":"Teal"},
							green:{value:"green","text":"Green"},
							yellow:{value:"yellow","text":"Yellow"},
							cyan:{value:"cyan","text":"Cyan"},
							black:{value:"black","text":"Black"},
							blue:{value:"blue","text":"Blue"},
						}
					}
				},
				settingsKey:"mtd_theme",
				default:"default"
			}, customCss:{
				title:`Custom CSS (${ctrlShiftText}C disables it in case something went wrong)`,
				type:"textarea",
				placeholder:":root {\n"+
				"	--retweetColor:red;\n"+
				"	--primaryColor:#00ff00!important;\n"+
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
		tabName:"Appearance",
		options:{
			dockedmodals:{
				headerBefore:"Behavior",
				title:"Use docked modals",
				type:"checkbox",
				activate:{
					disableStylesheet:"undockedmodals"
				},
				deactivate:{
					enableStylesheet:"undockedmodals"
				},
				settingsKey:"mtd_dockedmodals",
				default:false
			},
			undockednavdrawer:{
				title:"Replace navigation drawer with menu",
				type:"checkbox",
				activate:{
					enableStylesheet:"undockednavdrawer"
				},
				deactivate:{
					disableStylesheet:"undockednavdrawer"
				},
				settingsKey:"mtd_undockednavdrawer",
				default:false
			},
			fixedarrows:{
				title:"Use fixed-location media arrows for tweets with multiple photos",
				type:"checkbox",
				activate:{
					enableStylesheet:"fixedarrows"
				},
				deactivate:{
					disableStylesheet:"fixedarrows"
				},
				settingsKey:"mtd_fixedarrows",
				default:false
			},
			nonewtweetsbutton:{
				title:"Enable \"New Tweets\" indicator",
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
			scrollbarstyle:{
				title:"Scrollbar Style",
				type:"dropdown",
				activate:{
					func: (opt) => {
						disableStylesheetExtension(getPref("mtd_scrollbar_style"));
						setPref("mtd_scrollbar_style",opt);
						enableStylesheetExtension(opt || "default");
					}
				},
				options:{
					scrollbarsdefault:{value:"scrollbarsdefault",text:"Default"},
					scrollbarsnarrow:{value:"scrollbarsnarrow",text:"Narrow"},
					scrollbarsnone:{value:"scrollbarsnone",text:"Hidden"}
				},
				settingsKey:"mtd_scrollbar_style",
				default:"scrollbarsdefault"
			},
			columnwidth:{
				title:"Column width",
				type:"slider",
				activate:{
					func: (opt) => {
						console.log(opt);
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
				title:"Font Size",
				type:"slider",
				activate:{
					func: (opt) => {
						console.log(opt);
						setPref("mtd_fontsize",opt);
						enableCustomStylesheetExtension("fontsize",`html{font-size:${(opt/100)*16}px!important}`);
					}
				},
				minimum:75,
				maximum:130,
				settingsKey:"mtd_fontsize",
				displayUnit:"%",
				default:100
			},
			roundprofilepics:{
				headerBefore:"Display",
				title:"Use round profile pictures",
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
			avatarSize:{
				title:"Profile picture size",
				type:"slider",
				activate:{
					func: (opt) => {
						console.log(opt);
						//setPref("mtd_avatarsize",opt);
						enableCustomStylesheetExtension("avatarsize",`:root{--avatarSize:${opt}px!important}`);
					}
				},
				minimum:24,
				maximum:64,
				// Maybe we'll enable this at some point, but currently difficult graphical bugs break it
				enabled:false,
				settingsKey:"mtd_avatarsize",
				displayUnit:"px",
				default:48
			},
			newcharindicator:{
				title:"Use new character limit indicator",
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
				title:"Display contextual icons in menus",
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
				title:"Display media that may contain sensitive content",
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
				queryFunction: () => {
					return TD.settings.getDisplaySensitiveMedia();
				}
			},
			altsensitive:{
				title:"Use alternative sensitive media workflow",
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
				title:"Always display column icons in navigator",
				type:"checkbox",
				activate:{
					htmlAddClass:"mtd-mtd-column-nav-always-visible"
				},
				deactivate:{
					htmlRemoveClass:"mtd-mtd-column-nav-always-visible"
				},
				settingsKey:"mtd_column_nav_always_visible",
				default:false
			},
			accoutline:{
				headerBefore:"Accessibility",
				title:`Always show outlines around focused items (${ctrlShiftText}A to toggle)`,
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
				title:`Enable High Contrast theme (${ctrlShiftText}H to toggle)`,
				type:"checkbox",
				activate:{
					func: (opt) => {
						if (TD.settings.getTheme() === "light") {
							TD.settings.setTheme("dark");
							disableStylesheetComponent("light");
							enableStylesheetComponent("dark");
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
		tabName:"Tweets",
		options:{
			stream:{
				headerBefore:"Function",
				title:"Stream Tweets in realtime",
				type:"checkbox",
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
				title:"Automatically play GIFs",
				type:"checkbox",
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
				title:"Show notifications on startup",
				type:"checkbox",
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
			linkshort:{
				headerBefore:"Link Shortening",
				title:"Link Shortener Service",
				type:"dropdown",
				activate:{
					func: set => {
						if (shortener === "twitter") {
							$("bitlyUsername").addClass("hidden");
							$("bitlyApiKey").addClass("hidden");
						} else if (shortener === "bitly") {
							$("bitlyUsername").removeClass("hidden");
							$("bitlyApiKey").removeClass("hidden");
						}
						TD.settings.setLinkShortener(set);
					}
				},
				queryFunction: () => {
					let shortener = TD.settings.getLinkShortener();
					if (shortener === "twitter") {
						$("bitlyUsername").addClass("hidden");
						$("bitlyApiKey").addClass("hidden");
					} else if (shortener === "bitly") {
						$("bitlyUsername").removeClass("hidden");
						$("bitlyApiKey").removeClass("hidden");
					}
					return shortener;
				},
				options:{
					twitter:{value:"twitter",text:"Twitter"},
					bitly:{value:"bitly",text:"Bit.ly"}
				}
			},
			bitlyUsername:{
				title:"Bit.ly Username",
				type:"textbox",
				activate:{
					func: set => {
						TD.settings.setBitlyAccount({
							apiKey:((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().apiKey) ? TD.settings.getBitlyAccount() : {apiKey:""}).login,
							login:set
						})
					}
				},
				queryFunction: () => {
					return ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().login) ? TD.settings.getBitlyAccount() : {login:""}).login;
				}
			},
			bitlyApiKey:{
				title:"Bit.ly API Key",
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
				queryFunction: () => {
					return ((TD.settings.getBitlyAccount() && TD.settings.getBitlyAccount().apiKey) ? TD.settings.getBitlyAccount() : {apiKey:""}).apiKey;
				}
			}
		}
	}, mutes: {
		tabName:"Mutes",
		options:{},
		enum:"mutepage"
	}, app: {
		tabName:"App",
		enabled:isApp,
		options:{
			nativeTitlebar:{
				headerBefore:"App settings",
				title:"Use native OS titlebar (restarts ModernDeck)",
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
				title:"Show Inspect Element in context menus",
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
			nativeContextMenus:{
				title:"Use OS native context menus",
				type:"checkbox",
				activate:{
					func: () => {
						setPref("mtd_nativecontextmenus",true);
						useNativeContextMenus = true;
					}
				},
				deactivate:{
					func: () => {
						setPref("mtd_nativecontextmenus",false);
						useNativeContextMenus = false;
					}
				},
				settingsKey:"mtd_nativecontextmenus",
				default:isApp ? process.platform === "darwin" : false
			},theme:{
				title:"App update channel",
				type:"dropdown",
				activate:{
					func: (opt) => {
						if (!isApp) {
							return;
						}
						setPref("mtd_updatechannel",opt);

						setTimeout(() => {
							const {ipcRenderer} = require('electron');
							if (!!ipcRenderer)
								ipcRenderer.send("changeChannel", opt);

						},300)
					}
				},
				options:{
					latest:{value:"latest","text":"Latest"},
					beta:{value:"beta","text":"Beta"}
				},
				settingsKey:"mtd_updatechannel",
				default:"latest"
			}
		}
	}, system: {
		tabName:"System",
		options:{
			mtdResetSettings:{
				title:"Reset Settings",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">restore</i><b>Reset settings</b><br>If you want to reset ModernDeck to default settings, you can do so here. This will restart ModernDeck.",
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
				title:"Clear Data",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">delete_forever</i><b>Clear data</b><br>This option clears all caches and preferences. This option will log you out.",
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
				title:"Save Backup",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">save_alt</i><b>Save backup</b><br>Saves your preferences to a file to be loaded later.",
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
							title: "ModernDeck Preferences",
							filters: [{ name: "Preferences JSON File", extensions: ["json"] }]
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
				title:"Load Backup",
				label:"<i class=\"icon material-icon mtd-icon-very-large\">refresh</i><b>Load backup</b><br>Loads your preferences that you have saved previously. This will restart ModernDeck.",
				type:"button",
				activate:{
					func: () => {
						const app = require("electron").remote;
						const dialog = app.dialog;
						const fs = require("fs");
						const {ipcRenderer} = require('electron');

						dialog.showOpenDialog(
							{ filters: [{ name: "Preferences JSON File", extensions: ["json"] }] },
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
				settingsKey:"mtd_resetSettings",
				enabled:isApp
			},
			tdLegacySettings: {
				title:"Legacy settings",
				label:"Is there a new TweetDeck setting we're missing? Visit legacy settings",
				type:"link",
				activate:{
					func: () => {
						openLegacySettings();
					}
				}
			}
		}
	}, about: {
		tabName:"About",
		tabId:"about",
		options:{},
		enum:"aboutpage"
	}
}

function retrieveImageFromClipboardAsBlob(pasteEvent, callback) {

	let items = pasteEvent.clipboardData.items;

	if(items == undefined || pasteEvent.clipboardData == false){
		// console.log("RIP the paste data");
		return;
	};

	for (let i = 0; i < items.length; i++) {

		// Skip content if not image
		if (items[i].type.indexOf("image") == -1) continue;

		let blob = items[i].getAsFile();

		if (typeof(callback) == "function"){
			callback(blob);
		}
	}
}

// Paste event to allow for pasting images in TweetDeck

window.addEventListener("paste", (e) => {
	// console.log("got paste");
	// console.log(e);

	retrieveImageFromClipboardAsBlob(e, imageBlob => {

		if (imageBlob) {
			// console.log("got imageBlob");

			let buildEvent = jQuery.Event("dragenter",{originalEvent:{dataTransfer:{files:[imageBlob]}}});
			let buildEvent2 = jQuery.Event("drop",{originalEvent:{dataTransfer:{files:[imageBlob]}}});

			// console.info("alright so these are the events we're gonna be triggering:");
			// console.info(buildEvent);
			// console.info(buildEvent2);

			$(document).trigger(buildEvent);
			$(document).trigger(buildEvent2);
		}

	});

}, false);

// Alerts the app itself if it becomes offline

const forceAppUpdateOnlineStatus = (e) => {
	if (!require) {return;}
	const {ipcRenderer} = require('electron');
	ipcRenderer.send('online-status-changed', e)
}

if (typeof MTDURLExchange === "object" && typeof MTDURLExchange.getAttribute === "function") {
	mtdBaseURL = MTDURLExchange.getAttribute("type");
	console.info("MTDURLExchange completed with URL " + mtdBaseURL);
}

/*
	Moduleraid became a requirement for ModernDeck after they removed jQuery from the global context
	Hence why twitter sucks
*/

let twitterSucks = document.createElement("script");
twitterSucks.type = "text/javascript";
twitterSucks.src = mtdBaseURL + "sources/libraries/moduleraid.min.js";
document.head.appendChild(twitterSucks);

// shorthand for creating a mutation observer and observing

function mutationObserver(obj,func,parms) {
	return (new MutationObserver(func)).observe(obj,parms);
}

/*
	Returns true if stylesheet extension is enabled, false otherwise.
	Works with custom stylesheets. (see enableCustomStylesheetExtension for more info)
*/

function isStylesheetExtensionEnabled(name) {
	if ($("#mtd_custom_css_"+name).length > 0) {
		return true;
	}
	return !!document.querySelector("link.mtd-stylesheet-extension[href=\"" + mtdBaseURL + "sources/cssextensions/" + name + ".css\"\]");
}

/*
	Enables a certain stylesheet extension.
	Stylesheet extensions are loaded from sources/cssextensions/[name].css

	These are the predefined ModernDeck ones including colour themes, default light and dark themes, and various preferences

	For custom or dynamically defined ones, see enableCustomStylesheetExtension
*/

function enableStylesheetExtension(name) {
	if (name === "default" || $("#mtd_custom_css_"+name).length > 0)
		return;

	let url = mtdBaseURL + "sources/cssextensions/" + name + ".css";

	if (!isStylesheetExtensionEnabled(name)) {
		head.append(
			make("link")
			.attr("rel","stylesheet")
			.attr("href",url)
			.addClass("mtd-stylesheet-extension")
		)

		console.log(`enableStylesheetExtension("${name}")`);
	} else return;
}

// disables stylesheet extensions. Function also works with custom stylesheet extensions

function disableStylesheetExtension(name) {
	if (!isStylesheetExtensionEnabled(name))
		return;

	console.log(`disableStylesheetExtension("${name}")`);

	$('head>link[href="' + mtdBaseURL + "sources/cssextensions/" + name + '.css"]').remove();

	if ($("#mtd_custom_css_"+name).length > 0) {
		$("#mtd_custom_css_"+name).remove();
	}
}

// Custom stylesheet extensions are used for custom user CSS and for certain sliders, such as column width

function enableCustomStylesheetExtension(name,styles) {
	console.log(`enableCustomStylesheetExtension("${name}")`);

	if (isStylesheetExtensionEnabled(name)) {
		$("#mtd_custom_css_"+name).html(styles);
		return;
	}
	head.append(make("style").html(styles).attr("id","mtd_custom_css_"+name))
}

/*
	Returns true if stylesheet extension is enabled, false otherwise.
	Works with custom stylesheets. (see enableCustomStylesheetExtension for more info)
*/

function isStylesheetComponentEnabled(name) {
	return !!document.querySelector("link.mtd-stylesheet-component[href=\"" + mtdBaseURL + "sources/csscomponents/" + name + ".css\"\]");
}

/*
	Enables a certain stylesheet component.
	Stylesheet components are loaded from sources/csscomponents/[name].css

	These are the predefined ModernDeck ones including colour themes, default light and dark themes, and various preferences
*/

function enableStylesheetComponent(name) {
	if (name === "default")
		return;

	let url = mtdBaseURL + "sources/csscomponents/" + name + ".css";

	if (!isStylesheetComponentEnabled(name)) {
		head.append(
			make("link")
			.attr("rel","stylesheet")
			.attr("href",url)
			.addClass("mtd-stylesheet-component")
		)

		console.log(`enableStylesheetComponent("${name}")`);
	} else return;
}

// disables stylesheet components.

function disableStylesheetComponent(name) {
	if (!isStylesheetComponentEnabled(name))
		return;

	console.log(`disableStylesheetExtension("${name}")`);

	$('head>link[href="' + mtdBaseURL + "sources/csscomponents/" + name + '.css"]').remove();

}

// Default account profile info, used to show your profile pic and background in nav drawer

function getProfileInfo() {
	if (
		exists(TD) &&
		exists(TD.cache) &&
		exists(TD.cache.twitterUsers) &&
		exists(TD.cache.twitterUsers.getByScreenName) &&
		exists(TD.storage) &&
		exists(TD.storage.accountController) &&
		exists(TD.storage.accountController.getPreferredAccount) &&
		exists(TD.storage.accountController.getPreferredAccount("twitter")) &&
		exists(TD.storage.accountController.getPreferredAccount("twitter").state) &&
		exists(TD.storage.accountController.getPreferredAccount("twitter").state.username) &&
		TD.cache.twitterUsers.getByScreenName(TD.storage.accountController.getPreferredAccount("twitter").state.username).results.length > 0
	)
	{
		return TD.cache.twitterUsers.getByScreenName(TD.storage.accountController.getPreferredAccount("twitter").state.username).results[0];
	}
	else
	{
		return null;
	}
}

// Loads preferences when moderndeck is started

function loadPreferences() {

	for (let key in settingsData) {

		if (!settingsData[key].enum) {
			for (let i in settingsData[key].options) {
				let prefKey = settingsData[key].options[i].settingsKey;
				let pref = settingsData[key].options[i];

				if (exists(prefKey)) {
					let setting;
					if (!hasPref(prefKey)) {
						if (debugStorageSys)
							console.log(`loadPreferences is setting default of ${prefKey} to ${pref.default}`);
						setPref(prefKey, pref.default);
						setting = pref.default;
					} else {
						setting = getPref(prefKey);
					}

					switch(pref.type) {
						case "checkbox":
							if (setting === true) {
								parseActions(pref.activate);
							} else {
								parseActions(pref.deactivate);
							}
							break;
						case "dropdown":
						case "textbox":
						case "textarea":
						case "slider":
							parseActions(pref.activate, setting);
							break;
						case "button":
						case "link":
							break;
					}
				}
			}
		}
	}
}

// getPref(String preferenceKey)
// Returns value of preference, string or boolean

function getPref(id) {
	if (id === "mtd_core_theme") {
		return TD.settings.getTheme();
	}

	let val;

	if (exists(store)) {
		if (store.has(id))
			val = store.get(id);
		else
			val = undefined;
	} else {
		val = localStorage.getItem(id);
	}

	if (debugStorageSys)
		console.log("getPref "+id+"? "+val);


	if (val === "true")
		return true;
	else if (val === "false")
		return false;
	else
		return val;
}


/*
	purgePrefs()
	Purges all settings. This is used when you reset ModernDeck in settings
*/

function purgePrefs() {

	for (let key in localStorage) {
		if (key.indexOf("mtd_") >= 0) {
			localStorage.removeItem(key);
			console.log(`Removing key ${key}...`);
		}
	}
	if (isApp) {
		const Store = require('electron-store');
		const store = new Store({name:"mtdsettings"});
		store.clear();
		console.log("Clearing electron-store...");
	}

}

/*
	setPref(String preferenceKey)
	Sets preference
*/

function setPref(id,p) {

	if (id === "mtd_core_theme") {
		return;
	}

	if (exists(store)) {

		// Newer versions of electron-store are more strict about using delete vs. set undefined

		if (typeof p !== "undefined") {
			store.set(id,p);
		} else {
			store.delete(id);
		}
	} else {
		localStorage.setItem(id,p);
	}

	if (debugStorageSys)
		console.log(`setPref ${id} to ${p}`);
}

/*
	hasPref(String preferenceKey)
	return boolean: whether or not the preference manager (electron-store on app, otherwise localStorage) contains a key
*/

function hasPref(id) {
	let hasIt;

	if (typeof id === "undefined") {
		throw "id not specified for hasPref";
	}

	if (id === "mtd_core_theme") {
		return true;
	}

	if (exists(store)) {
		hasIt = store.has(id);
	} else {
		hasIt = localStorage.getItem(id) !== null && typeof localStorage.getItem(id) !== "undefined" && localStorage.getItem(id) !== undefined;
	}

	if (debugStorageSys)
		console.log(`hasPref ${id}? ${hasIt}`);

	return hasIt;
}


function fontParseHelper(a) {
	if (typeof a !== "object" || a === null)
		throw "you forgot to pass the object";

	return "@font-face{font-family:'"+(a.family||"Roboto")+"';font-style:"+(a.style||"normal")+";font-weight:"+(a.weight || "400")+";src:url("+mtdBaseURL+"sources/fonts/"+a.name+"."+(a.extension || "woff2")+") format('"+(a.format || "woff2")+"');"+"unicode-range:"+(a.range||"U+0000-FFFF")+"}\n";
}

/*
	Here, we inject our fonts

	ModernDeck uses Roboto as its general font for Latin (and Cyrillic?) scripts
	Noto Sans is used for whatever scripts Roboto doesn't cover

	font family Material is short for Material icons
	font family MD is short for ModernDeck. It contains ModernDeck supplemental icons
*/

function injectFonts() {
	$(document.head).append(make("style").html(
		fontParseHelper({family:"MD",name:"mdvectors"}) +
		fontParseHelper({family:"Material",name:"MaterialIcons"}) +
		fontParseHelper({name:"Roboto-Regular"}) +
		fontParseHelper({weight:"500",name:"Roboto-Medium"}) +
		fontParseHelper({name:"Roboto-Italic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-Light"}) +
		fontParseHelper({weight:"500",name:"Roboto-MediumItalic",style:"italic"}) +
		fontParseHelper({weight:"300",name:"Roboto-LightItalic",style:"italic"}) +
		fontParseHelper({weight:"100",name:"Roboto-Thin"}) +
		fontParseHelper({weight:"100",name:"Roboto-ThinIalic",style:"italic"}) +
		fontParseHelper({family:"Noto Sans CJK",weight:"500",name:"NotoSansCJKjp-Medium",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans CJK",name:"NotoSansCJKjp-Regular",format:"opentype",extension:"otf"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHI-Medium",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHI-Regular",range:"U+0900-097F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArabic-Medium",
			range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArabic-Regular",
			range:"U+0600-06FF,U+0750–077F,U+08A0–08FF,U+FB50–FDFF,U+FE70–FEFF,U+10E60–10E7F,U+1EE00—1EEFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansArmenian-Medium",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansArmenian-Regular",range:"U+0530-0580"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansBengali-Medium",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBengali-Regular",range:"U+0980-09FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBrahmi",range:"U+11000-1107F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBuginese",range:"U+1A00-1A1B,U+1A1E-1A1F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansBuhid-Regular",range:"U+1740-1753"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCanadianAboriginal",range:"U+1400-167F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCarian-Regular",range:"U+102A0-102DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansChakma-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",range:"U+11100-1114F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansCherokee-Medium",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansCherokee-Regular",
			range:"U+13A0-13F4,U+13F5,U+13F8-13FD"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansEthiopic-Medium",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansEthiopic-Regular",range:"U+1200-137F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGeorgian-Medium",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGeorgian-Regular",
			range:"U+10A0-10FF,U+2D00-2D2F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansGujaratiUI-Bold",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansGujaratiUI",range:"U+0A80-0AFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansHebrew-Bold",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansHebrew-Regular",range:"U+0590-05FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansJavanese",range:"U+A980-A9DF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansKannadaUI-Bold",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKannadaUI",range:"U+0C80-0CFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKayahLi-Regular",range:"U+A900-A92F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansKhmerUI-Medium",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansKhmerUI-Regular",range:"U+1780-17FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansLaoUI-Medium",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansLaoUI-Regular",range:"U+0E80-0EFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansLisu-Regular",range:"U+A4D0-A4FF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansMalayalamUI-Bold",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansMalayalamUI",range:"U+0D00-0D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansMyanmarUI-Bold",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansMyanmarUI-Regular",range:"U+1000-109F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansOriyaUI-Medium",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOriyaUI",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansOriyaUI-Bold",range:"U+0B00-0B7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOsage-Regular",range:"U+104B0-104FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOsmanya-Regular",range:"U+10480-104AF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansPhagsPa",range:"U+A840-A87F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansNewTaiLue-Regular",range:"U+1980-19DF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansNKo-Regular",range:"U+07C0-07FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansOlChiki-Regular",range:"U+1C50–1C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansRunic-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansShavian-Regular",range:"U+16A0-16FF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSinhalaUI-Regular",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansSinhalaUI-Medium",range:"U+0D80-0DFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSundanese",range:"U+1B80-1BBF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacEastern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacWestern",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansSyriacEstrangela",range:"U+0700-074F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTagalog",range:"U+1700-171F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTagbanwa",range:"U+1760-177F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiLe",range:"U+1950-197F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiTham",range:"U+1A20-1AAF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTaiViet",range:"U+AA80-AADF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTamilUI-Regular",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTamilUI-Medium",range:"U+0B80-0BFF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTeluguUI",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTeluguUI-Bold",range:"U+0C00-0C7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansThaana",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansThaana-Bold",range:"U+0780-07BF"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansThaiUI-Regular",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansThaiUI-Medium",range:"U+0E00-0E7F"}) +
		fontParseHelper({family:"Noto Sans",name:"NotoSansTibetan",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTibetan-Bold",range:"U+0F00-0FFF"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansTifinagh-Regular",range:"U+2D30-2D7F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansVai-Regular",range:"U+A500-A63F"}) +
		fontParseHelper({family:"Noto Sans",weight:"500",name:"NotoSansYi-Regular",range:"U+A000-A48F"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono-Regular"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono-Medium"}) +
		fontParseHelper({family:"RobotoMono",name:"RobotoMono-Italic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"300",name:"RobotoMono-Light"}) +
		fontParseHelper({family:"RobotoMono",weight:"500",name:"RobotoMono-MediumItalic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"300",name:"RobotoMono-LightItalic",style:"italic"}) +
		fontParseHelper({family:"RobotoMono",weight:"100",name:"RobotoMono-Thin"}) +
		fontParseHelper({family:"RobotoMono",weight:"100",name:"RobotoMono-ThinIalic",style:"italic"})
	));
}

/*
	These are features that can be used to force enable tweetdeck developer features.
	Code updated by @pixeldesu, DeckHackers, et al
*/

function processForceFeatureFlags() {
	TD.config.config_overlay = {
		tweetdeck_devel: { value: true },
		tweetdeck_dogfood: { value: true },
		tweetdeck_insights: { value: true },
		tweetdeck_content_user_darkmode: { value: true },
		tweetdeck_subscriptions_debug: { value: true },
		tweetdeck_locale: { value: true },
		tweetdeck_live_engagements: { value: true },
		tweetdeck_content_search_darkmode: { value: true },
		tweetdeck_content_user_darkmode: { value: true },
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
		tweetdeck_system_font_stack: { value: true }
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

// This makes numbers appear nicer by overriding tweetdeck's original function which did basically nothing

function replacePrettyNumber() {

	TD.util.prettyNumber = (e) => {
		let howPretty = parseInt(e, 10);

		if (howPretty >= 100000000) {
			return parseInt(howPretty/1000000) + "M";
		} else if (howPretty >= 10000000) {
			return parseInt(howPretty/100000)/10 + "M";
		} else if (howPretty >= 1000000) {
			return parseInt(howPretty/10000)/100 + "M";
		} else if (howPretty >= 100000) {
			return parseInt(howPretty/1000) + "K";
		} else if (howPretty >= 10000) {
			return parseInt(howPretty/100)/10 + "K";
		} else if (howPretty >= 1000) {
			howPretty = howPretty.toString().substring(0,1) + "," + howPretty.toString().substring(1);
		}
		return howPretty;
	}
}

function overrideFadeOut() {

	// here we add event listeners to add a fading out animation when a modal dialog is closed

	document.querySelectorAll(".js-modals-container")[0].removeChild = (rmnode) => {
		$(rmnode).addClass("mtd-modal-window-fade-out");
		setTimeout(() => {
			rmnode.remove();
		},200);
	};

	// let's make sure we get any that might have initialised before mtdInit began

	$(document.querySelector(".application").childNodes).each((obj) => {
		($(document.querySelector(".application").childNodes)[obj] || obj).removeChild = (rmnode) => {
			$(rmnode).addClass("mtd-modal-window-fade-out");
			setTimeout(() => {
				rmnode.remove();
			},200);
		};
	})

	$(".js-modal").on("removeChild", (rmnode) => {
		$(rmnode).addClass("mtd-modal-window-fade-out");
		setTimeout(() => {
			rmnode.remove();
		},200);
	});

	// body's removeChild function is overriden to give tooltips their fade out animation

	body.removeChild = (i) => {
		if ($(i).hasClass("tooltip")) {
			setTimeout(() => {
				i.remove(); // Tooltips automagically animate themselves out. But here we clean them up as well ourselves.
			},300);
		} else {
			i.remove();
		}
	 };
}

// change favicon and notification sound

function replaceAudioAndFavicon() {
	$("link[rel=\"shortcut icon\"]").attr("href",mtdBaseURL + "sources/favicon.ico");
	$(document.querySelector("audio")).attr("src",mtdBaseURL + "sources/alert_2.mp3");
}

// modifies tweetdeck mustaches, replacing spinners, etc

function processMustaches() {
	if (typeof TD_mustaches["settings/global_setting_filter_row.mustache"] !== "undefined")
		TD_mustaches["settings/global_setting_filter_row.mustache"] =
			'<li class="list-filter cf"> {{_i}}\
				<div class="mtd-mute-text mtd-mute-text-{{getDisplayType}}"></div>\
				{{>text/global_filter_value}}{{/i}}\
				<input type="button" name="remove-filter" value="{{_i}}Remove{{/i}}" data-id="{{id}}" class="js-remove-filter small btn btn-negative">\
			</li>';

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

	if (typeof TD_mustaches["compose/docked_compose.mustache"] !== "undefined")
		TD_mustaches["compose/docked_compose.mustache"] =
			TD_mustaches["compose/docked_compose.mustache"].replace(
				'<i class="js-spinner-button-active icon-center-16 spinner-button-icon-spinner is-hidden"></i>',
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

// Fixes a bug in TweetDeck's JS caused by ModernDeck having different animations in column settings

function fixColumnAnimations() {
	$(".column-scroller,.more-tweets-btn-container").each((a,b) => {
		let c = $(b);
		mutationObserver(b,() => {
			if (typeof c.attr("style") !== "undefined") {
				let num = parseInt(c.attr("style").match(/[\-\d]+/g));
				let hasFilterOptionsVisible = false;
				try {
					hasFilterOptionsVisible = parseInt(c.parent().children(".column-options").children('.js-column-message[style]')[0].style.height.replace("px","")) > 0;
				} catch (e){}

				if ((!hasFilterOptionsVisible && num < 0) || (hasFilterOptionsVisible && num < 21))
					c.attr("style","top: " + ((!hasFilterOptionsVisible && "0") || "22") + "px;")
			}
		},{attributes:true});
	})
}

// replaces login page with moderndeck one

function loginTextReplacer() {
	if ($(".app-signin-wrap:not(.mtd-signin-wrap)").length > 0) {
		console.info("oh no, we're too late!");
		$(".app-signin-wrap:not(.mtd-signin-wrap)").remove();
		$(".login-container .startflow").html(newLoginPage);
		startUpdateGoodLoginText();
	}
}

// begin moderndeck initialisation

async function mtdInit() {


	console.log("mtdInit");


	if (typeof document.getElementsByClassName("js-signin-ui block")[0] !== "undefined" && !replacedLoadingSpinnerNew) {
		document.getElementsByClassName("js-signin-ui block")[0].innerHTML = '<div class="preloader-wrapper big active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
		replacedLoadingSpinnerNew = true;
	}

	// The default is dark for the loading screen, once the TD settings load it can use

	enableStylesheetComponent("dark");
	html.addClass("dark");

	if (!injectedFonts) {
		try {
			injectFonts()
			injectedFonts = true;
		} catch (e) {
			console.error("Caught error in injectFonts");
			console.error(e);
		}
	}


	// These check to see if critical TD variables are in place before proceeding


	await TD_mustaches;
	await TD;
	await TD.util;
	await TD_mustaches["login/login_form.mustache"];

	TD_mustaches["login/login_form.mustache"] = newLoginPage;

	/*
		Especially on Edge, but also on Chrome shortly after launch,
		sometimes the stylesheet isn't blocked by the network, which breaks the page heavily.
		This ensures that the stylesheet is manually removed so that it doesn't cause problems
	*/

	let beGone = document.querySelector("link[rel='apple-touch-icon']+link[rel='stylesheet']");

	if (exists(beGone)) {
		beGone.remove();
	}

	if (forceFeatureFlags) try {
		processForceFeatureFlags()
	} catch (e) {
		console.error("Caught error in processForceFeatureFlags");
		console.error(e);
	}


	try {
		replacePrettyNumber()
	} catch(e) {
		console.error("Caught error in replacePrettyNumber");
		console.error(e);
	}

	try {
		overrideFadeOut()
	} catch(e) {
		console.error("Caught error in overrideFadeOut");
		console.error(e);
	}

	try {
		replaceAudioAndFavicon()
	} catch(e) {
		console.error("Caught error in replaceAudioAndFavicon");
		console.error(e);
	}

	try {
		processMustaches()
	} catch(e) {
		console.error("Caught error in processMustaches");
		console.error(e);
	}

	try {
		loginTextReplacer()
	} catch(e) {
		console.error("Caught error in loginTextReplacer");
		console.error(e);
	}

	setInterval(() => {
		if ($(".mtd-emoji").length <= 0) {
			try {
				hookComposer()
			} catch(e) {
				console.error("Caught error in hookComposer");
				console.error(e);
			}
		}
	},500);

	$(document).on("uiInlineComposeTweet",(e) => {
		setTimeout(() => {
			hookComposer();
		},0)
	});

	$(document).on("uiDockedComposeTweet",(e) => {
		setTimeout(() => {
			hookComposer();
		},50)
	});

	$(document).on("uiComposeClose",(e) => {
		setTimeout(() => {
			hookComposer();
		},50)
	});

	$(document).on("uiComposeTweet",(e) => {
		setTimeout(() => {
			hookComposer();
		},0)
	});

	try {
		fixColumnAnimations()
	} catch(e) {
		console.error("Caught error in fixColumnAnimations");
		console.error(e);
	}

	$(document).on("uiComposeTweet",hookComposer);
	$(document).on("uiToggleTheme",hookComposer);
	$(document).on("uiDockedComposeTweet",hookComposer);

	navigationSetup();

}

// Updates the "Good morning!" / "Good afternoon!" / "Good evening!"
// text on the login screen every once in a while (10s, ish)


function startUpdateGoodLoginText() {

	// Don't run if we already started
	if (ugltStarted) {
		return;
	}

	ugltStarted = true;


	// we've gotta update the image URL
	// we can't do this in the new login mustache because when it's initialised,
	// MTDURLExchange hasn't completed yet

	$(".startflow-background").attr("style",`background-image:url(${mtdBaseURL}sources/img/bg1.jpg)`)

	setInterval(() => {
		let text;
		let newDate = new Date();

		if (newDate.getHours() < 12) {
			text = "Good morning!";
		} else if (newDate.getHours() < 18) {
			text = "Good afternoon!";
		} else {
			text = "Good evening!";
		}

		$(".form-login h2").html(text);
	},10000);
}

function sendNotificationMessage(txt) {
	let knotty = $(MTDNotification);
	if (knotty.hasClass("mtd-appbar-notification-hidden")) {
		knotty.removeClass("mtd-appbar-notification-hidden").html(txt);
	} else {
		knotty.addClass("mtd-appbar-notification-hidden").delay(300).queue(() => {
			knotty.html(txt).removeClass("mtd-appbar-notification-hidden")
		});
	}
}

// opens legacy tweetdeck settings

async function openLegacySettings() {
	await TD;
	await TD.components;
	await TD.components.GlobalSettings;

	$(".mtd-settings-panel").remove();
	new TD.components.GlobalSettings;
}

/*
	function openSettings()
	opens and settings panel, open to first page

	function openSettings(openMenu)
	opens and returns settings panel with string openMenu, the tabId of the corresponding settings page
*/

function openSettings(openMenu) {

	mtdPrepareWindows();

	let tabs = make("div").addClass("mtd-settings-tab-container mtd-tabs");
	let container = make("div").addClass("mtd-settings-inner");
	let panel = make("div").addClass("mdl mtd-settings-panel").append(tabs).append(container);


	for (var key in settingsData) {

		// if disabled (NOT UNDEFINED), skip it
		if (settingsData[key].enabled === false) {
			continue;
		}

		var tab = make("button").addClass("mtd-settings-tab").attr("data-action",key).html(settingsData[key].tabName).click(function() {
			console.log(settingsData[key]);
			$(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected");
			$(this).addClass("mtd-settings-tab-selected");

			/*
				calculates how far to move over the settings menu
				good thing arrays start at 0, as 0 would be 0px, it's the first one
			*/

			container.css("margin-left","-"+($(this).index()*700)+"px");
		});

		let subPanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id",key);

		if (!settingsData[key].enum && settingsData[key].enabled !== false) {

			for (let prefKey in settingsData[key].options) {

				let pref = settingsData[key].options[prefKey];
				let option = make("div").addClass("mtd-settings-option").addClass("mtd-settings-option-"+pref.type);

				if (exists(pref.addClass)) {
					option.addClass(pref.addClass);
				}

				if (pref.enabled === false) {
					continue;
				}

				if (exists(pref.headerBefore)) {
					subPanel.append(
						make("h3").addClass("mtd-settings-panel-subheader").html(pref.headerBefore)
					);
				}

				if (exists(pref.settingsKey) && exists(pref.default) && !hasPref(pref.settingsKey)) {
					setPref(pref.settingsKey, pref.default);
				}

				let input,select,label,minimum,maximum,button,link;


				switch(pref.type) {

					case "checkbox":
						input = make("input").attr("type","checkbox").attr("id",prefKey).change(function() {
							console.log(this);
							setPref(pref.settingsKey,$(this).is(":checked"));
							parseActions($(this).is(":checked") ? pref.activate : pref.deactivate, $(this).val());

						});

						if (exists(pref.settingsKey) && getPref(pref.settingsKey) === true) {
							input.attr("checked","checked");
						}

						if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							if (pref.queryFunction()) {
								input.attr("checked","checked");
							}
						}

						label = make("label").addClass("checkbox").html(pref.title).append(input);

						option.append(label);

						if (exists(pref.initFunc)) {
							pref.initFunc(select);
						}

						break;

					case "dropdown":
						select = make("select").attr("type","select").attr("id",prefKey).change(function() {
							//setPref(pref.settingsKey,$(this).val());
							parseActions(pref.activate, $(this).val());
						});

						for (let prefKey in pref.options) {
							if (!!(pref.options[prefKey].value)) {
								let newPrefSel = pref.options[prefKey];
								let newoption = make("option").attr("value",newPrefSel.value).html(newPrefSel.text);
								console.log(newoption);

								select.append(newoption);
							} else {

								let group = make("optgroup").attr("label",pref.options[prefKey].name)

								for (let subkey in pref.options[prefKey].children) {
									let newSubPrefSel = pref.options[prefKey].children[subkey];
									let newsuboption = make("option").attr("value",newSubPrefSel.value).html(newSubPrefSel.text);

									group.append(newsuboption);
								}

								select.append(group);
							}
						}

						if (exists(pref.settingsKey)) {
							select.val(getPref(pref.settingsKey));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							select.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(pref.title);

						option.append(label,select);

						if (exists(pref.initFunc)) {
							pref.initFunc(select);
						}

						break;

					case "textbox":
						input = make("input").attr("type","text").attr("id",prefKey);

						if (pref.instantApply === true) {
							input.on("input",function() {
								parseActions(pref.activate, $(this).val());
							});
						} else {
							input.change(function() {
								parseActions(pref.activate, $(this).val());
							});
						}

						if (exists(pref.settingsKey)) {
							input.val(getPref(pref.settingsKey));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(pref.title);

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,input);

						break;

					case "textarea":
						input = make("textarea").addClass("mtd-textarea").attr("id",prefKey).attr("rows","10").attr("cols","80").attr("placeholder",pref.placeholder || "").attr("spellcheck",false);

						if (pref.instantApply === true) {
							input.on("input",function() {
								parseActions(pref.activate, $(this).val());
							});
						} else {
							input.change(function() {
								parseActions(pref.activate, $(this).val());
							});
						}


						// https://sumtips.com/snippets/javascript/tab-in-textarea/
						input.keydown((e) =>
						{

							let kC = e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which;
							if (kC == 9 && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey)
								// If it's a tab, but not Ctrl+Tab, Super+Tab, Shift+Tab, or Alt+Tab
							{
								let oS = input[0].scrollTop;
								if (input[0].setSelectionRange)
								{
									let sS = input[0].selectionStart;
									let sE = input[0].selectionEnd;
									input[0].value = input[0].value.substring(0, sS) + "\t" + input[0].value.substr(sE);
									input[0].setSelectionRange(sS + 1, sS + 1);
									input[0].focus();
								}
								input[0].scrollTop = oS;

								e.preventDefault();

								return false;
							}
							return true;
						});

						if (exists(pref.settingsKey)) {
							input.val(getPref(pref.settingsKey));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(pref.title);

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,input);

						break;

					case "slider":
						label = make("label").addClass("control-label");

						input = make("input").attr("type","range")
						.attr("min",pref.minimum)
						.attr("max",pref.maximum)
						.change(function() {
							parseActions(pref.activate, $(this).val());
						}).on("input",function() {
							label.html(`${pref.title} <b> ${$(this).val()} ${(pref.displayUnit || "")} </b>`);
							console.log("changed: "+$(this).val());
						});

						if (exists(pref.settingsKey)) {
							input.val(parseInt(getPref(pref.settingsKey)));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction());
						} else if (exists(pref.default)) {
							input.val(pref.default);
						}

						label.html(pref.title + " <b> "+ input.val() + " " + (pref.displayUnit || "") + "</b>");

						maximum = make("label").addClass("control-label mtd-slider-maximum").html(pref.maximum + (pref.displayUnit || ""));
						minimum = make("label").addClass("control-label mtd-slider-minimum").html(pref.minimum + (pref.displayUnit || ""));

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,maximum,input,minimum);

						break;

					case "button":
						label = make("label").addClass("control-label").html(pref.label || "");

						button = make("button").html(pref.title).addClass("btn btn-positive mtd-settings-button")
						.click(() => {
							parseActions(pref.activate,true);
						});

						if (exists(pref.initFunc)) {
							pref.initFunc(button);
						}

						option.append(label,button);

						break;

					case "link":
						link = make("a").html(pref.label).addClass("mtd-settings-link")
						.click(() => {
							parseActions(pref.activate,true);
						});

						if (exists(pref.initFunc)) {
							pref.initFunc(link);
						}

						option.append(link);

						break;
				}

				subPanel.append(option);
			}
		} else if (settingsData[key].enum === "aboutpage") {
			let logo = make("i").addClass("mtd-logo icon-moderndeck icon");
			let h1 = make("h1").addClass("mtd-about-title").html("ModernDeck 7");
			let h2 = make("h2").addClass("mtd-version-title").html((appendTextVersion ? "Version " : "") +SystemVersion);
			let logoCont = make("div").addClass("mtd-logo-container");

			if (!isApp) {
				logoCont.append(
					make("p").addClass("mtd-check-out-app").html("Did you know ModernDeck has a native app now? <a href='https://github.com/dangeredwolf/ModernDeck/releases'>Check it out!</a>")
				)
			}

			logoCont.append(logo,h1,h2);

			subPanel.append(logoCont);

			let updateCont = make("div").addClass("mtd-update-container").html('<div class="mtd-update-spinner preloader-wrapper small active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
			let updateSpinner = $(".mtd-update-spinner");
			let updateIcon = make("i").addClass("material-icon hidden");
			let updateh2 = make("h2").addClass("mtd-update-h2").html("Checking for updates...");
			let updateh3 = make("h3").addClass("mtd-update-h3 hidden").html("");
			let tryAgain = make("button").addClass("btn hidden").html("Try Again");
			let restartNow = make("button").addClass("btn hidden").html("Restart Now")

			let info = make("p").html("Made with <i class=\"icon icon-heart mtd-about-heart\"></i> by <a href=\"https://twitter.com/dangeredwolf\" rel=\"user\" target=\"_blank\">dangeredwolf</a> in Columbus, OH since 2014<br><br>ModernDeck is an open source project released under the MIT license.");
			let infoCont = make("div").addClass("mtd-about-info").append(info);

			let patronInfo = make("div").addClass("mtd-patron-info").append(
				make("div").addClass("mtd-patreon-button").append(
					make("iframe").attr("src","https://www.patreon.com/platform/iframe?widget=become-patron-button&creatorID=3469384")
				),
				make("div").addClass("mtd-patron-list").append(
					make("iframe")
				)
			)
			updateCont.append(updateIcon,updateh2,updateh3,tryAgain,restartNow);

			if (isApp && !forceAppx) {
				if (!html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
					subPanel.append(updateCont);
				}
			}

			subPanel.append(infoCont);
			//subPanel.append(patronInfo);

			if (isApp && !forceAppx) {
				if (!html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
					mtdAppUpdatePage(updateCont,updateh2,updateh3,updateIcon,updateSpinner,tryAgain,restartNow);
				}
			}
		} else if (settingsData[key].enum === "mutepage") {

			let filterInput = make("input").addClass("js-filter-input").attr("name","filter-input").attr("size",30).attr("type","text").attr("placeholder","Enter a word or phrase")

			let selectFilterType = make("select").attr("name","filter").addClass("js-filter-types").append(
				make("option").attr("value","phrase").html("Words or phrases"),
				make("option").attr("value","source").html("Tweet source")
			).change(function() {
				filterInput.attr("placeholder", $(this).val() === "phrase" ? "Enter a word or phrase" : "eg Tweeten")
			});

			let muteButton = make("button").attr("name","add-filter").addClass("js-add-filter btn-on-dark disabled").html("Mute").click(() => {
				if (filterInput.val().length > 0) {
					TD.controller.filterManager.addFilter(selectFilterType.val(),filterInput.val(),false);

					updateFilterPanel(filterList);
				}
			});

			let muteTypes = make("div").addClass("control-group").append(
				make("label").attr("for","filter-types").addClass("control-label").html("Mute"),
				make("div").addClass("controls").append(selectFilterType)
			)

			let muteInput = make("div").addClass("control-group").append(
				make("label").attr("for","filter-input").addClass("control-label").html("Matching"),
				make("div").addClass("controls").append(filterInput)
			).on("input",function() {
				if ($(this).val().length > 0) {
					muteButton.removeClass("disabled");
				} else {
					muteButton.addClass("disabled");
				}
			});

			let muteAdd = make("div").addClass("control-group").append(
				make("div").addClass("controls js-add-filter-container").append(muteButton)
			)

			let filterList = make("ul");
			let filterListGroup = make("div").addClass("js-filter-list").append(filterList)

			let form = make("form").addClass("js-global-settings frm").attr("id","global-settings").attr("action","#").append(
				make("fieldset").attr("id","global_filter_settings").append(
					muteTypes,
					muteInput,
					muteAdd,
					filterListGroup
				)
			)

			updateFilterPanel(filterList);

			subPanel.append(form);
		}

		tabs.append(tab);
		container.append(subPanel);

		console.log("openMenu ?"+exists(openMenu));
		console.log(openMenu);


		if (!exists(openMenu) && tab.index() === 0) {
			tab.addClass("mtd-settings-tab-selected");
			tab.click();
		}

		if (exists(openMenu) && openMenu === key) {
			tab.click();
		}
	}

	new TD.components.GlobalSettings;

	$("#settings-modal>.mdl").remove();
	$("#settings-modal").append(panel);

	return panel;
}

function updateFilterPanel(filterList) {
	let filters = TD.controller.filterManager.getAll();
	filterList.html("");

	for (let n in filters) {
		let myFilter = filters[n];

		filterList.append(
			make("li").addClass("list-filter").append(
				make("div").addClass("mtd-mute-text mtd-mute-text-" + (myFilter.type === "source" ? "source" : "")),
				make("em").html(myFilter.value),
				make("input").attr("type","button").attr("name","remove-filter").attr("value","Remove").addClass("js-remove-filter small btn btn-negative").click(() => {
					TD.controller.filterManager.removeFilter(myFilter);
					updateFilterPanel(filterList);
				})
			)
		);

	}

	return filterList;
}

function profileSetup() {
	let profileInfo = getProfileInfo();
	if (profileInfo === null || typeof profileInfo === "undefined" || typeof profileInfo._profileBannerURL === "undefined" || profileInfo.profileImageURL === "undefined") {
		setTimeout(profileSetup,150);
		return;
	}
	let bannerPhoto = profileInfo._profileBannerURL.search("empty") > 0 ? "" : profileInfo._profileBannerURL;
	let avatarPhoto = profileInfo.profileImageURL.replace("_normal","");
	let name = profileInfo.name;
	let username = profileInfo.screenName;

	$(mtd_nd_header_image).attr("style","background-image:url(" + bannerPhoto + ");"); // Fetch header and place in nav drawer
	$(mtd_nd_header_photo).attr("src",avatarPhoto) // Fetch profile picture and place in nav drawer
	.mouseup(() => {
		let profileLinkyThing = $(document.querySelector(".account-settings-bb a[href=\"https://twitter.com/"+getProfileInfo().screenName+"\"]"));

		mtdPrepareWindows();
		if (profileLinkyThing.length > -1) {
			setTimeout(() => {
				profileLinkyThing.click();
			},200);
		}
	});
	$(mtd_nd_header_username).html(name); // Fetch twitter handle and place in nav drawer

}

// https://staxmanade.com/2017/02/how-to-download-and-convert-an-image-to-base64-data-url/

async function getBlobFromUrl(imageUrl) {
	let res = await fetch(imageUrl);
	let blob = await res.blob();

	return new Promise((resolve, reject) => {
		resolve(blob);
		return blob;
	})
}

function createGifPanel() {
	if ($(".mtd-gif-container").length > 0) {
		return;
	}
	$(".drawer .compose-text-container").after(
		make("div").addClass("scroll-v popover mtd-gif-container").append(
			make("div").addClass("mtd-gif-header").append(
				//make("h1").addClass("mtd-gif-header-text").html("Trending"),
				make("input").addClass("mtd-gif-search").attr("placeholder","Search GIFs...").change(() => {
					console.log("entered");
					searchGifPanel($(".mtd-gif-search").val())
				}),
				make("img").attr("src",mtdBaseURL + "sources/img/giphy.png").addClass("mtd-giphy-logo"),
				make("button").addClass("mtd-gif-top-button").append(
					make("i").addClass("icon icon-arrow-u"),
					"Go back up"
				).click(() => {
					$(".drawer .compose>.compose-content>.antiscroll-inner.scroll-v.scroll-styled-v").animate({ scrollTop: "0px" });
				}),
				make("div").addClass("mtd-gif-no-results list-placeholder hidden").html("We couldn't find anything matching what you searched. Give it another shot.")
			),
			make("div").addClass("mtd-gif-column mtd-gif-column-1"),
			make("div").addClass("mtd-gif-column mtd-gif-column-2")
		)
	)

	$(".drawer .compose>.compose-content>.antiscroll-inner.scroll-v.scroll-styled-v").scroll(function(){
		if ($(this).scrollTop() > $(document).height() - 200) {
			$(".mtd-gif-header").addClass("mtd-gif-header-fixed popover")
		} else {
			$(".mtd-gif-header").removeClass("mtd-gif-header-fixed popover")
		}
		if (isLoadingMoreGifs) {
			return;
		}

		console.log($(this));
		console.log($(this).scrollTop() + $(this).height() );
		console.log($(this).prop("scrollHeight"))
		if ($(this).scrollTop() + $(this).height() > $(this).prop("scrollHeight") - 200) {
			console.log("now'd be a good time to load more gifs");
			isLoadingMoreGifs = true;
			loadMoreGifs();
   		}
	})
}

function renderGif(preview,mainOg) {
	let main = mainOg;

	return make("img").attr("src",preview).click(function() {
		let img;

		console.log("Main: ",main);

		getBlobFromUrl(main).then((img) => {

			console.log(img);

			let eventThing = {
				originalEvent:{
					dataTransfer:{
						files:[
							img
						]
					}
				}
			};

			let buildEvent = jQuery.Event("dragenter",eventThing);
			let buildEvent2 = jQuery.Event("drop",eventThing);

			console.info("alright so these are the events we're gonna be triggering:");
			console.info(buildEvent);
			console.info(buildEvent2);

			$(".mtd-gif-container").removeClass("mtd-gif-container-open").delay(300).remove();;
			$(document).trigger(buildEvent);
			$(document).trigger(buildEvent2);

		})
	});
}

function renderGifResults(data) {
	$(".mtd-gif-container .preloader-wrapper").remove();

	let col1 = $(".mtd-gif-column-1");
	let col2 = $(".mtd-gif-column-2");

	$(".mtd-gif-no-results").addClass("hidden");

	if (data.length === 0) {
		col1.children().remove();
		col2.children().remove();

		$(".mtd-gif-no-results").removeClass("hidden");
	}

	for (let i = 0; i < data.length; i++) {
		if (i % 2 === 0) {
			col1.append(
				renderGif(data[i].images.preview_gif.url,data[i].images.original.url)
			)
		} else {
			col2.append(
				renderGif(data[i].images.preview_gif.url,data[i].images.original.url)
			)
		}
	}
}

function gifPanelSpinner() {
	$(".mtd-gif-container").append(
		spinnerLarge
	)
}

function searchGifPanel(query) {
	$(".mtd-gif-column-1").children().remove();
	$(".mtd-gif-column-2").children().remove();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	let sanitiseQuery = query.replace(/\s/g,"+").replace(/\&/g,"&amp;").replace(/\?/g,"").replace(/\//g," OR ")
	lastGiphyURL = "https://api.giphy.com/v1/gifs/search?q="+sanitiseQuery+"&api_key="+giphyKey+"&limit=20";
	console.log(lastGiphyURL);

	$.ajax(
		{
			url:lastGiphyURL
		}
	).done((e) => {
		console.log(e);
		renderGifResults(e.data);
	}).always(() => {
		isLoadingMoreGifs = false;
	});
}

function trendingGifPanel() {
	$(".mtd-gif-column-1").children().remove();
	$(".mtd-gif-column-2").children().remove();

	$(".mtd-gif-no-results").addClass("hidden");

	isLoadingMoreGifs = true;

	lastGiphyURL = "https://api.giphy.com/v1/gifs/trending?api_key="+giphyKey+"&limit=20";
	console.log(lastGiphyURL);

	$.ajax(
		{
			url:lastGiphyURL
		}
	).done((e) => {
		renderGifResults(e.data);

	}).always(() => {
		isLoadingMoreGifs = false;
	});
}

function loadMoreGifs() {
	isLoadingMoreGifs = true;
	$.ajax(
		{
			url:lastGiphyURL + "&offset=" + $(".mtd-gif-container img").length
		}
	).done((e) => {
		renderGifResults(e.data);
	}).always(() => {
		isLoadingMoreGifs = false;
	});
}

function checkGifEligibility() {
	let imagesAdded = $(".compose-media-grid-remove,.compose-media-bar-remove").length;
	console.log(imagesAdded)

	if (imagesAdded > 0) {
		$(".mtd-gif-button").addClass("is-disabled").attr("data-original-title","You cannot add GIFs with other images");
		$(".compose-media-grid-remove,.compose-media-bar-remove").click(() => {
			console.log("clicked close");
			setTimeout(checkGifEligibility,0);
		});
	} else {
		$(".mtd-gif-button").removeClass("is-disabled").attr("data-original-title","");
	}
}

function hookComposer() {

	if ($(".compose-text-container .js-add-image-button,.compose-text-container .js-schedule-button,.compose-text-container .mtd-gif-button").length <= 0) {
		$(".compose-text-container").append($(".js-add-image-button,.mtd-gif-button,.js-schedule-button,.js-dm-button,.js-tweet-button,.js-send-button-container.spinner-button-container"));
	}

	if ($(".drawer .js-send-button-container").length >= 2) {
		$(".compose-text-container .js-send-button-container.spinner-button-container")[0].remove();
		$(".compose-text-container").append(
			$(".drawer .js-send-button-container.spinner-button-container")
		)
		$(".drawer .js-send-button-container.spinner-button-container").click(() => {
			$(".compose").trigger("uiComposeSendTweet");
		})
	}



	$(".drawer[data-drawer=\"compose\"]>div>div").on("uiComposeImageAdded",(e) => {
		console.log("added!!!");
		setTimeout(checkGifEligibility,0) // initialise one cycle after tweetdeck does its own thing

	})


	if ($(".mtd-emoji").length <= 0)
		$(".compose-text").emojioneArea();
	if ($(".mtd-gif-button").length <= 0) {
		$(".drawer .js-add-image-button").after(
			make("button")
			.addClass("js-show-tip btn btn-on-blue full-width txt-left padding-v--6 padding-h--12 margin-b--12 mtd-gif-button")
			.append(
				make("i").addClass("Icon icon-gif txt-size--18"),
				make("span").addClass("label padding-ls").html("Add GIF")
			)
			.attr("data-original-title","")
			.click(() => {

				if ($(".mtd-gif-button").hasClass("is-disabled")) {
					return;
				}

				if ($(".mtd-gif-container").length <= 0) {
					createGifPanel();
				}

				$(".mtd-gif-container").toggleClass("mtd-gif-container-open");
				if ($(".mtd-gif-container").hasClass("mtd-gif-container-open")) {
					$(".mtd-gif-search").val("");
					trendingGifPanel();
				} else {
					$(".mtd-gif-container").remove();
				}
			})
		);
	}
}

function mtdPrepareWindows() {
	console.info("mtdPrepareWindows called");
	$("#update-sound,.js-click-trap").click();
	mtd_nav_drawer_background.click();

	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
	$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
}

function navigationSetup() {

	if ($(".app-header-inner").length < 1) {
		setTimeout(navigationSetup,100);
		return;
	}

	try {
		loadPreferences()
	} catch(e) {
		console.error("Caught error in loadPreferences");
		console.error(e);
	}

	try {
		hookComposer()
	} catch(e) {
		console.error("Caught error in hookComposer");
		console.error(e);
	}

	$(".app-header-inner").append(
		make("a").attr("id","mtd-navigation-drawer-button").addClass("js-header-action mtd-drawer-button link-clean cf app-nav-link").html('<div class="obj-left"><div class="mtd-nav-activator"></div><div class="nbfc padding-ts"></div>')
		.click(() => {
			if (exists(mtd_nav_drawer_background)) {
				$("#mtd_nav_drawer_background").removeClass("mtd-nav-drawer-background-hidden");
			}
			if (exists(mtd_nav_drawer)) {
				$("#mtd_nav_drawer").attr("class","mtd-nav-drawer");
			}
		})
	);

	$("body").append(
		make("div")
		.attr("id","mtd_nav_drawer")
		.addClass("mtd-nav-drawer mtd-nav-drawer-hidden")
		.append(
			make("img").attr("id","mtd_nd_header_image").addClass("mtd-nd-header-image").attr("style",""),
			make("img").addClass("avatar size73 mtd-nd-header-photo").attr("id","mtd_nd_header_photo").attr("src",""),
			make("div").addClass("mtd-nd-header-username").attr("id","mtd_nd_header_username").html("PROFILE ERROR<br>Tell @dangeredwolf i said hi"),
			make("button").addClass("btn mtd-nav-button mtd-nav-first-button").attr("id","tdaccsbutton").append(make("i").addClass("icon icon-twitter-bird")).click(() => {mtdPrepareWindows();$(".js-show-drawer.js-header-action").click();}).append("Your Accounts"),
			make("button").addClass("btn mtd-nav-button").attr("id","addcolumn").append(make("i").addClass("icon icon-plus")).click(() => {mtdPrepareWindows();TD.ui.openColumn.showOpenColumn()}).append("Add Column"),
			make("div").addClass("mtd-nav-divider"),
			make("button").addClass("btn mtd-nav-button").attr("id","kbshortcuts").append(make("i").addClass("icon icon-keyboard")).click(() => {
				mtdPrepareWindows();
				console.log("td-keyboard");
				setTimeout(() => {$(".js-app-settings").click()},10);
				setTimeout(() => {$("a[data-action='keyboardShortcutList']").click()},20);
			}).append("Keyboard Shortcuts"),
			make("button").addClass("btn mtd-nav-button").attr("id","mtdsettings").append(make("i").addClass("icon icon-settings")).click(() => {openSettings()}).append("Settings"),
			make("div").addClass("mtd-nav-divider"),
			make("button").addClass("btn mtd-nav-button mtd-nav-group-expand").attr("id","mtd_nav_expand").append(make("i").addClass("icon mtd-icon-arrow-down").attr("id","mtd_nav_group_arrow")).click(() => {
				$("#mtd_nav_group").toggleClass("mtd-nav-group-expanded");
				$("#mtd_nav_group_arrow").toggleClass("mtd-nav-group-arrow-flipped");
				$("#mtd_nav_drawer").toggleClass("mtd-nav-drawer-group-open");
			}).append("More..."),
			make("div").addClass("mtd-nav-group mtd-nav-group-expanded").attr("id","mtd_nav_group").append(
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-changelog")).click(() => {
					mtdPrepareWindows();
					console.log("td-changelog");
					window.open("https://twitter.com/i/tweetdeck_release_notes");
				}).append("TweetDeck Release Notes"),
				make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon icon-search")).click(() => {
					mtdPrepareWindows();
					console.log("td-searchtips");
					setTimeout(() => {$(".js-app-settings").click()},10);
					setTimeout(() => {$("a[data-action=\"searchOperatorList\"]").click()},20);
				}).append("Search Tips"),
				make("div").addClass("mtd-nav-divider"),
				make("button").addClass("btn mtd-nav-button").attr("id","mtd_signout").append(make("i").addClass("icon icon-logout")).click(() => {TD.controller.init.signOut();}).append("Sign Out"),
			),
			make("div").addClass("mtd-nav-divider mtd-nav-divider-feedback"),
			make("button").addClass("btn mtd-nav-button mtd-nav-button-feedback").attr("id","mtdfeedback").append(make("i").addClass("icon icon-feedback")).click(() => {
				sendingFeedback = true;
				try {
					throw "Manually triggered feedback button";
				} catch(e) {
					Raven.captureException(e);
					Raven.showReportDialog();
				}
			}).append("Send Feedback")
		),
		make("div").attr("id","mtd_nav_drawer_background").addClass("mtd-nav-drawer-background mtd-nav-drawer-background-hidden").click(function() {
			$(this).addClass("mtd-nav-drawer-background-hidden");
			$(mtd_nav_drawer).addClass("mtd-nav-drawer-hidden");

			$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
			$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
		})
	);
	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");

	$(".app-header-inner").append(
		make("div").addClass("mtd-appbar-notification mtd-appbar-notification-hidden").attr("id","MTDNotification")
	)

	try {
		if ((!!TD.config && !!TD.config.config_overlay && !!TD.config.config_overlay && !!TD.config.config_overlay.tweetdeck_dogfood)) {
			if (!!TD.config.config_overlay.tweetdeck_dogfood.value) {
				$(".mtd-nav-group").append(
					make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-command-pallete")).click(() => {
						mtdPrepareWindows();
						console.log("Command pallete triggered");
						$(document).trigger("uiShowCommandPalette");
					}).append("Command Pallete"),
					make("button").addClass("btn mtd-nav-button").append(make("i").addClass("icon mtd-icon-developer")).click(() => {
						mtdPrepareWindows();
						console.log("Disable dev/dogfood triggered");

						$(document).trigger("uiReload", {
							params: {
								no_dogfood: 1
							}
						});

					}).append("Disable Dev/Dogfood")
				)
			}
		}
	} catch(e) {
		console.error("An error occurred in navigationSetup while trying to verify if dev/dogfood features are enabled or not");
		console.error(e);
	}
	$(".mtd-nav-group-expanded").attr("style","height:"+$(".mtd-nav-group-expanded").height()+"px");

	profileSetup();
}

function keyboardShortcutHandler(e) {
	console.log(e);

	if (e.key.toUpperCase() === "A" && (e.ctrlKey) && e.shiftKey) { //pressing Ctrl+Shift+A toggles the outline accessibility option
		console.log("User has pressed the proper key combination to toggle outlines!");

		if ($("#accoutline").length > 0) {
			$("#accoutline").click();
		} else {
			settingsData.accessibility.options.accoutline.activate.func();
		}

	}
	if (e.key.toUpperCase() === "C" && (e.ctrlKey) && e.shiftKey) { //pressing Ctrl+Shift+C disabled user CSS
		console.log("User disabled custom CSS!");

		disableStylesheetExtension("customcss")

	}
	if (e.key.toUpperCase() === "H" && (e.ctrlKey) && e.shiftKey) { //pressing Ctrl+Shift+H toggles high contrast
		console.log("User has pressed the proper key combination to toggle high contrast!");

		if ($("#highcont").length > 0) {
			$("#highcont").click();
		} else {
			if (getPref("mtd_highcontrast") === true) {
				settingsData.accessibility.options.highcont.deactivate.func();
			} else {
				settingsData.accessibility.options.highcont.activate.func();
			}
		}

	}
	if (e.keyCode === 81 && document.querySelector("input:focus,textarea:focus") === null) {
		if ($(mtd_nav_drawer).hasClass("mtd-nav-drawer-hidden")) {
			$("#mtd-navigation-drawer-button").click();
		} else {
			$(mtd_nav_drawer_background).click();
		}
	}

}

function checkIfSigninFormIsPresent() {

	if ($(".app-signin-form").length > 0 || $("body>.js-app-loading.login-container:not([style])").length > 0) {
		if (!html.hasClass("signin-sheet-now-present")) {
			html.addClass("signin-sheet-now-present");
		}

		loginIntervalTick++;
		enableStylesheetComponent("loginpage");

		if (loginIntervalTick > 5) {
			clearInterval(loginInterval);
		}
	} else {
		disableStylesheetComponent("loginpage");
		html.removeClass("signin-sheet-now-present");
	}

}

function onElementAddedToDOM(e) {
	let tar = $(e.target);

	if (tar.hasClass("dropdown")) {
		e.target.parentNode.removeChild = (dropdown) => {
			$(dropdown).addClass("mtd-dropdown-fade-out");
			setTimeout(() => {
				dropdown.remove();
			},200);
		}
	} else if (tar.hasClass("overlay")) {
		if (!tar.hasClass("is-hidden")) {
			let observer = mutationObserver(e.target, (mutations) => {
				if (tar.hasClass("is-hidden")) {
					tar.addClass("mtd-modal-window-fade-out");
					setTimeout(() => {
						tar.remove();
						observer.disconnect();
					},300);
				}
			},{ attributes: true, childList: false, characterData: false });
		}
	} else if ($(e[0].addedNodes[0]).hasClass("sentry-error-embed-wrapper")) {
		$(e[0].addedNodes[0]).addClass("overlay");
		$(".sentry-error-embed").addClass("mdl");
		$(".sentry-error-embed-wrapper>style").remove();
		$("#id_email").parent().addClass("is-hidden");
		$("#id_email")[0].value = "a@a.com";
		if (sendingFeedback) {
		$(".form-submit>button.btn[type='submit']").html("Send Feedback");
			$(".sentry-error-embed>header>h2").html("Send feedback about ModernDeck");
			$(".sentry-error-embed>header>p").html("Other than your input, no personally identifiable information will be sent.");
			sendingFeedback = false;
		} else
			$(".sentry-error-embed>header>p").html("This tool lets you send a crash report to help improve ModernDeck.<br>Other than your input, no personally identifiable information will be sent.");

	}
}

function roundMe(val) {
	return Math.floor(val * 100)/100;
}

function formatBytes(val) {
	if (val < 10**3) {
		return val + " bytes"
	} else if (val < 10**6) {
		return roundMe(val/10**3) + " KB"
	} else if (val < 10**9) {
		return roundMe(val/10**6) + " MB"
	} else if (val < 10**12) {
		return roundMe(val/10**9) + " GB"
	} else {
		return roundMe(val/10**12) + " TB"
	}
}

function mtdAppUpdatePage(updateCont, updateh2, updateh3, updateIcon, updateSpinner, tryAgain, restartNow) {

	const {ipcRenderer} = require('electron');

	ipcRenderer.on("error",(e,args,f,g) => {

		console.log(e,args,f,g);
		updateh2.html("There was a problem checking for updates. ");
		$(".mtd-update-spinner").addClass("hidden");

		if (exists(args.code)) {
			updateh3.html(`${args.code} ${args.errno} ${args.syscall} ${args.path}`).removeClass("hidden");
		} else if (exists(f)) {
			updateh3.html(f.match(/^(Cannot check for updates: )(.)+\n/g)).removeClass("hidden")
		} else {
			updateh3.html("We couldn't interpret the error info we received. Please try again later or DM @ModernDeck on Twitter for further help.").removeClass("hidden");
		}

		updateIcon.html("error_outline").removeClass("hidden");
		tryAgain.removeClass("hidden").html("Try Again");

	});

	ipcRenderer.on("checking-for-update", (e,args) => {
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html("Checking for updates...");
		updateh3.addClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
	});

	ipcRenderer.on("download-progress", (e,args) => {
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html("Downloading update...");
		updateh3.html(Math.floor(args.percent)+"% complete ("+formatBytes(args.transferred)+"/"+formatBytes(args.total)+", "+formatBytes(args.bytesPerSecond)+"/s)").removeClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
	});


	ipcRenderer.on("update-downloaded", (e,args) => {
		console.log(args);
		$(".mtd-update-spinner").addClass("hidden");
		updateIcon.html("update").removeClass("hidden");
		updateh2.html("Update downloaded");
		updateh3.html("Restart ModernDeck to complete the update").removeClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.removeClass("hidden");
	});


	ipcRenderer.on("update-not-available", (e,args) => {
		console.log(args);
		$(".mtd-update-spinner").addClass("hidden");
		updateh2.html("You're up to date");
		updateIcon.html("check_circle").removeClass("hidden");
		updateh3.html(SystemVersion + " is the latest version.").removeClass("hidden");
		tryAgain.removeClass("hidden").html("Check Again");
		restartNow.addClass("hidden");
	});

	tryAgain.click(() => {
		ipcRenderer.send('checkForUpdates');
	})

	restartNow.click(() => {
		ipcRenderer.send('restartAndInstallUpdates');
	});

	ipcRenderer.send('checkForUpdates');
}

function notifyUpdate() {
	let notifRoot = mR.findFunction("showErrorNotification")[0].showNotification({title:"ModernDeck Updates", timeoutDelayMs:9999999999});
	let notifId = notifRoot._id;
	let notif = $("li.Notification[data-id=\""+notifId+"\"]");
	let notifContent = $("li.Notification[data-id=\""+notifId+"\"] .Notification-content");
	let notifIcon = $("li.Notification[data-id=\""+notifId+"\"] .Notification-icon .Icon");

	if (notif.length > 0) {
		notifIcon.removeClass("Icon--notifications").addClass("mtd-icon-update");

		notifContent.append(
			make("p").html("We found and downloaded updates for ModernDeck."),
			make("button").html("Relaunch Now").click(() => {
				ipcRenderer.send('restartApp');
			}),
			make("button").html("Later").click(() => {
				mR.findFunction("showErrorNotification")[0].removeNotification({notification: notif});
			})
		)
	}
}

function notifyOffline() {

	if (exists(offlineNotification)) {
		return;
	}

	let notifRoot = mR.findFunction("showErrorNotification")[0].showNotification({title:"Internet Disconnected",timeoutDelayMs:9999999999});
	let notifId = notifRoot._id;
	offlineNotification = $("li.Notification[data-id=\""+notifId+"\"]");
	let notifContent = $("li.Notification[data-id=\""+notifId+"\"] .Notification-content");
	let notifIcon = $("li.Notification[data-id=\""+notifId+"\"] .Notification-icon .Icon");

	if (offlineNotification.length > 0) {
		notifIcon.removeClass("Icon--notifications").addClass("mtd-icon-disconnected");

		notifContent.append(
			make("p").html("We detected that you are disconnected from the internet. Many features are unavailable without an internet connection.")
		)
	}
}

function dismissOfflineNotification() {
	if (!exists(offlineNotification)) {return;}
	mR.findFunction("showErrorNotification")[0].removeNotification({notification:offlineNotification});
}

function mtdAppFunctions() {

	if (typeof require === "undefined") {return;}

	const { remote, ipcRenderer } = require('electron');

	const Store = require('electron-store');
	store = new Store({name:"mtdsettings"});


	// Enable high contrast if system is set to high contrast

	ipcRenderer.on("inverted-color-scheme-changed", (e, enabled) => {
		console.log(`inverted colour scheme? ${enabled}`);
		if (enabled && getPref("mtd_highcontrast") !== true) {
			try {
				settingsData.accessibility.options.highcont.activate.func();
			} catch(e){}
		}
	});

	ipcRenderer.on("disable-high-contrast", (e) => {
		console.error("DISABLING HIGH CONTRAST ");
		try {
			settingsData.accessibility.options.highcont.deactivate.func();
		} catch(e){}
	});

	ipcRenderer.on("aboutMenu", (e,args) => {
		if ($(".mtd-settings-tab[data-action=\"about\"]").length > 0){
			$(".mtd-settings-tab[data-action=\"about\"]").click();
		} else {
			openSettings("about");
		}
	});

	ipcRenderer.on("openSettings", (e,args) => {
		openSettings();
	});

	ipcRenderer.on("accountsMan", (e,args) => {
		$(".js-show-drawer.js-header-action").click();
	});

	ipcRenderer.on("sendFeedback", (e,args) => {
		try {
			throw "Manually triggered feedback button";
		} catch(e) {
			Raven.captureException(e);
			Raven.showReportDialog();
		}
	});

	ipcRenderer.on("msgModernDeck", (e,args) => {
		$(document).trigger("uiComposeTweet", {
			type: "message",
			messageRecipients: [{
				screenName: "ModernDeck"
			}]
		})
	});

	ipcRenderer.on("newTweet", (e,args) => {
		$(document).trigger("uiComposeTweet");
	});

	ipcRenderer.on("newDM", (e,args) => {
		$(document).trigger("uiComposeTweet");
		$(".js-dm-button").click();
	});

	if (html.hasClass("mtd-app")) {
		let minimise = make("button")
		.addClass("windowcontrol min")
		.html("&#xE15B")
		.click((data,handler) => {
			ipcRenderer.send('minimize');
		});

		let maximise = make("button")
		.addClass("windowcontrol max")
		.html("&#xE3C6")
		.click((data,handler) => {
			ipcRenderer.send('maximizeButton');
		});

		let close = make("button")
		.addClass("windowcontrol close")
		.html("&#xE5CD")
		.click(() => {
			window.close();
		});


		let windowcontrols = make("div")
		.addClass("windowcontrols")
		.append(minimise)
		.append(maximise)
		.append(close);

		body.append(windowcontrols,
			make("div").addClass("mtd-app-drag-handle")
		);
	}

	ipcRenderer.on('context-menu', (event, p) => {
		const electron = require("electron")
		let theMenu = buildContextMenu(p);
		let menu = electron.remote.menu;
		let Menu = electron.remote.Menu;

		if (useNativeContextMenus) {
			//ipcRenderer.send('nativeContextMenu',theMenu);
			Menu.buildFromTemplate(theMenu).popup();
			return;
		} else {
			if (exists(theMenu))
				body.append(theMenu);
		}

	})

	const updateOnlineStatus = () => {

		if (!navigator.onLine) {
			notifyOffline();
		} else {
			dismissOfflineNotification();
		}

	}

	window.addEventListener("online", updateOnlineStatus);
	window.addEventListener("offline", updateOnlineStatus);

	updateOnlineStatus();
}

function getIpc() {
	if (!require) {return null;}
	let {ipcRenderer} = require('electron');
	return ipcRenderer;
}

function makeCMItem(p) {
	if (useNativeContextMenus) {
		let dataact = p.dataaction;
		let data = p.data;
		let nativemenu = { label:p.text, click() {console.log("yes, a click has occurred");contextMenuFunctions[dataact](data)}, enabled:p.enabled };
		//nativemenu.click = ;
		return nativemenu;
	}
	let a = make("a").attr("href","#").attr("data-action",p.dataaction).html(p.text).addClass("mtd-context-menu-item");
	let li = make("li").addClass("is-selectable").append(a);

	if (p.enabled === false) { // Crucially, also not undefined!
		a.attr("disabled","disabled");
	} else {
		//a.click(contextMenuFunctions[p.dataaction]);

		a.click(() => {
			console.log("Performing action "+p.dataaction+"...");
			if (p.mousex && p.mousey) {
				document.elementFromPoint(p.mousex, p.mousey).focus();
				console.log("Got proper info, keeping context (x="+p.mousex+",y="+p.mousey+")");
				console.log();
			}
			contextMenuFunctions[p.dataaction](p.data);
			clearContextMenu();
		});
	}

	return li;
}

function clearContextMenu() {
	let removeMenu = $(".mtd-context-menu")
	removeMenu.addClass("mtd-dropdown-fade-out").on("animationend",() => {
		removeMenu.remove();
	});
}

function makeCMDivider() {
	if (useNativeContextMenus) {
		return {type:'separator'}
	}
	return make("div").addClass("drp-h-divider");
}

function buildContextMenu(p) {
	let items = [];
	let x = p.x;
	let y = p.y;

	const xOffset = 2;
	const yOffset = 12;

	if ($(".mtd-context-menu").length > 0) {
		let removeMenu = $(".mtd-context-menu");
		removeMenu.addClass("mtd-dropdown-fade-out");
		removeMenu.on("animationend", () => {
			removeMenu.remove();
		})
	}

	if ($(document.elementFromPoint(x,y)).hasClass("mtd-context-menu-item")) {
		return;
	}

	console.log(p);

	if (p.isEditable || (exists(p.selectionText) && p.selectionText.length > 0)) {
		if (p.isEditable) {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"undo",text:"Undo",enabled:p.editFlags.canUndo}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"redo",text:"Redo",enabled:p.editFlags.canRedo}));
			items.push(makeCMDivider());
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"cut",text:"Cut",enabled:p.editFlags.canCut}));
		}
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copy",text:"Copy",enabled:p.editFlags.canCopy}));
		if (p.isEditable) {
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"paste",text:"Paste",enabled:p.editFlags.canPaste}));
			items.push(makeCMItem({mousex:x,mousey:y,dataaction:"selectAll",text:"Select All",enabled:p.editFlags.canSelectAll}));
		}
		items.push(makeCMDivider());
	}

	if (p.linkURL !== '' && p.linkURL !== "https://tweetdeck.twitter.com/#") {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openLink",text:"Open link in browser",enabled:true,data:p.linkURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyLink",text:"Copy link address",enabled:true,data:p.linkURL}));
		items.push(makeCMDivider());
	}

	if (p.srcURL !== '') {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"openImage",text:"Open image in browser",enabled:true,data:p.srcURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImage",text:"Copy image",enabled:true,data:{x:x,y:y}}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"saveImage",text:"Save image...",enabled:true,data:p.srcURL}));
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"copyImageURL",text:"Copy image address",enabled:true,data:p.srcURL}));
		items.push(makeCMDivider());
	}

	if (getPref("mtd_inspectElement") || isDev) {
		items.push(makeCMItem({mousex:x,mousey:y,dataaction:"inspectElement",text:"Inspect element",enabled:true,data:{x:x,y:y}}));
	}

	if (useNativeContextMenus) {
		return items;
	}

	let ul = make("ul");

	for(let i = 0; i < items.length; i++){
		ul.append(items[i]);
	}


	let menu = make("menu")
	.addClass("mtd-context-menu dropdown-menu")
	.attr("style","opacity:0;animation:none;transition:none")
	.append(ul);


	if (items.length > 0) {
		setTimeout(() => {
			console.log(`x: ${x} y: ${y} menu.width(): ${menu.width()} menu.height(): ${menu.height()} $(document).width(): ${$(document).width()} $(document).height(): ${$(document).height()}`)

			if (x + xOffset + menu.width() > $(document).width()) {
				console.log("you're too wide!");
				x = $(document).width() - menu.width() - xOffset - xOffset;
			}

			if (y + yOffset + menu.height() > $(document).height()) {
				console.log("you're too tall!");
				y = $(document).height() - menu.height();
			}

			menu.attr("style",`left:${x + xOffset}px!important;top:${y + yOffset}px!important`)


		},20);
	} else {
		menu.addClass("hidden");
	}

	return menu;
}

function parseActions(a,opt) {
	for (let key in a) {
		console.log(key);
		switch(key) {
			case "enableStylesheet":
				enableStylesheetExtension(a[key]);
				break;
			case "disableStylesheet":
				disableStylesheetExtension(a[key]);
				break;
			case "htmlAddClass":
				if (!html.hasClass(a[key]))
					html.addClass(a[key]);
				break;
			case "htmlRemoveClass":
				html.removeClass(a[key]);
				break;
			case "func":
				if (typeof a[key] === "function") {
					try {
						a[key](opt);
					} catch (e) {
						console.error("Error occurred processing action function.");
						console.error(e);
						console.error("Dump of naughty function attached below");
						console.log(a[key])
					}
				} else {
					throw "There's a func action, but it isn't a function? :thinking:";
				}
				break;
		}
	}
}

function coreInit() {
	if (useRaven && typeof Raven === "undefined") {
		setTimeout(coreInit,10);
		console.info("waiting on raven...");
		return;
	}

	if (typeof mR === "undefined") {
		setTimeout(coreInit,10);
		console.info("waiting on moduleRaid...");
		return;
	}

	if (typeof $ === "undefined") {
		try {
			let jQuery = mR.findFunction('jQuery')[0];

			window.$ = jQuery;
			window.jQuery = jQuery;
		} catch (e) {
			console.error("jQuery failed. This will break approximately... everything.")
		}
	}

	head = $(document.head);
	body = $(document.body);
	html = $(document.querySelector("html")); // Only 1 result; faster to find

	if (isApp) {
		try {
			mtdAppFunctions();
			window.addEventListener('mousedown', (e) => {
				clearContextMenu();
			}, false);
		} catch(e) {
			console.error("An error occurred while running mtdAppFunctions");
			console.error(e);
		}
	}
	// append the emoji picker script

	head.append(
		make("script").attr("type","text/javascript").attr("src",mtdBaseURL + "sources/libraries/emojipicker.js")
	);

	if (useRaven) {
		Raven.config('https://92f593b102fb4c1ca010480faed582ae@sentry.io/242524', {
			release: SystemVersion
		}).install();

		setTimeout(Raven.context(mtdInit),10);

		Raven.context(() => {
			window.addEventListener("keyup",keyboardShortcutHandler,false);
			mutationObserver(html[0],onElementAddedToDOM,{attributes:false,subtree:true,childList:true})

			checkIfSigninFormIsPresent();
			loginInterval = setInterval(checkIfSigninFormIsPresent,500);
			console.info(`MTDinject ${SystemVersion} loaded`);
		});
	} else {

		mtdInit();

		window.addEventListener("keyup",keyboardShortcutHandler,false);
		mutationObserver(html[0],onElementAddedToDOM,{attributes:false,subtree:true,childList:true})

		checkIfSigninFormIsPresent();
		loginInterval = setInterval(checkIfSigninFormIsPresent,500);
		console.info(`MTDinject ${SystemVersion} loaded`);
	}

}

coreInit();
