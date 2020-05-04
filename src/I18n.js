
let displayWarning = false;
let TDiInitial;

import { getPref } from "./StoragePreferences.js";
import { exists } from "./Utils.js";
import languageData from "./DataI18n.js";

let langRoot = navigator.language.substring(0,2);
let langFull = navigator.language.replace("-","_");

export const getFullLanguage = () => langFull;
export const getMainLanguage = () => langRoot;
export const getFallbackLanguage = () => "en";


var mustachePatches = {
	"keyboard_shortcut_list.mustache":{
		"Open Navigation Drawer/Menu":1,
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
		"Search":1,
		"Return":1
	},
	"twitter_profile_social_proof.mustache":{
		"and":1
	},
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

export const I18n = function(a,b,c,d,e,f) {

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
				var replaceMe = b[key][getFullLanguage()]||b[key][getMainLanguage()]||b[key][getFallbackLanguage()];
				console.log("replaceMe",replaceMe);
				a = a.replaceAll("\{\{\{"+key+"\}\}\}","\{\{\{"+replaceMe+"\}\}\}");
			}
			for (var key in weirdStrings) {
				a = a.replaceAll(key,weirdStrings[key][getFullLanguage()]||weirdStrings[key][getMainLanguage()]||weirdStrings[key][getFallbackLanguage()]);
			}
			return a;
		} else if (a.includes("{{") && f===2) {
			//console.log("oh ok",a);
			//console.log("b,c,d",b,c,d);

			var checkmateTwitter = TDiInitial(a,b,c,d,e);
			// var checkmateTwitter = a;


			for (var key in weirdStrings) {
				checkmateTwitter = checkmateTwitter.replaceAll(key,weirdStrings[key][getFullLanguage()]||weirdStrings[key][getMainLanguage()]||weirdStrings[key][getFallbackLanguage()])
			}
			return checkmateTwitter;
		} else if (a.substr(0,6) === "From @") {
			return I18n(a.substr(0,4)) + " @" + a.substr(6);
		}
		if (!exists(b)||f===1) {
			if (exists(languageData[a])) {
				return languageData[a][getFullLanguage()]||languageData[a][getMainLanguage()]||languageData[a][getFallbackLanguage()];
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
	// patchUtil();
	// patchLanguageNames();
}
