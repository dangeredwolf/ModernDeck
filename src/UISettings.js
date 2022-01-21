/*
	UISettings.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import buildId from "./buildId.js";
import { make, exists, isApp,  isEnterprise } from "./Utils.js";
import { settingsData } from "./DataSettings.js";
import { hasPref, getPref, setPref } from "./StoragePreferences.js";
import { parseActions } from "./PrefHandler.js";
import { I18n } from "./I18n.js";
import { AutoUpdateController } from "./AutoUpdateController.js";

let verTextId = 1;
let verText = "";

let productName = "ModernDeck";

// if (isEnterprise()) {
// 	productName = "ModernDeck for Enterprise"
// }

function internationaliseSettingString(str) {
	let matches = str.match(/{{.+?}}/g);
	(matches || []).forEach((i) => {
		let translatedString = I18n(i.substr(2, i.length - 4));
		str = str.replace(i, translatedString);
	});
	return str;
}


// opens legacy tweetdeck settings

export function openLegacySettings() {
	$(".mtd-settings-panel").remove();
	new TD.components.GlobalSettings;
}
/*
	function openSettings()
	opens and settings panel, open to first page

	function openSettings(openMenu)
	opens and returns settings panel with string openMenu, the tabId of the corresponding settings page
*/

export function renderTab(key, subPanel) {

	if (typeof subPanel === "undefined") {
		subPanel = $(".mtd-settings-subpanel#"+key);
	}

	subPanel.empty();

	let settingsHidden = false;
	let settingsDisabled = false;

	for (let prefKey in settingsData[key].options) {

		let pref = settingsData[key].options[prefKey];
		let option = make("div").addClass("mtd-settings-option").addClass("mtd-settings-option-" + pref.type);
		let disableSetting = false;
		let overrideSetting;

		if (exists(pref.addClass)) {
			option.addClass(pref.addClass);
		}

		if (typeof pref.enabled === "function") {
			let isEnabled;
			try {
				isEnabled = pref.enabled();
			} catch(e) {
				console.error(e);
				isEnabled = false;
			}

			if (!isEnabled) {
				continue
			}
		} else if (pref.enabled === false) {
			continue;
		}

		if (typeof window.enterpriseConfig !== undefined && window.enterpriseConfig[key] && window.enterpriseConfig[key][prefKey]) {
			console.log(window.enterpriseConfig[key][prefKey]);
			console.log("Setting disabled: " + prefKey)
			settingsDisabled = true;
			disableSetting = true;
			overrideSetting = window.enterpriseConfig[key][prefKey];
		}

		if (pref.isDevTool && typeof window.enterpriseConfig !== undefined && window.enterpriseConfig.disableDevTools) {
			settingsHidden = true;
			continue;
		}

		if (exists(pref.headerBefore)) {
			subPanel.append(
				make("h3").addClass("mtd-settings-panel-subheader").html(internationaliseSettingString(pref.headerBefore))
			);
		}

		if (exists(pref.settingsKey) && exists(pref.default) && !hasPref(pref.settingsKey)) {
			if (typeof pref.default === "function") {
				setPref(pref.settingsKey, pref.default());
			} else {
				setPref(pref.settingsKey, pref.default);
			}
		}

		let input,select,label,minimum,maximum,button,link,defaultButton;


		switch(pref.type) {

			case "checkbox":
				input = make("input").attr("type","checkbox").attr("id",prefKey).change(function() {
					if (pref.savePreference !== false) {
						setPref(pref.settingsKey,$(this).is(":checked"));
					}

					parseActions($(this).is(":checked") ? pref.activate : pref.deactivate, $(this).val());

				});

				if (exists(pref.settingsKey) && getPref(pref.settingsKey) === true && overrideSetting !== false) {
					input.attr("checked","checked");
				}

				if (disableSetting) {
					input.attr("disabled","disabled")
				}

				if (typeof overrideSetting !== "undefined") {
					if (overrideSetting) {
						input.attr("checked","checked");
					} else {
						input.removeAttr("checked");
					}
				}

				if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
					let checkValue;

					try {
						checkValue = pref.queryFunction();
					} catch(e) {
						console.error(e);
						checkValue = pref.default || false;
					}

					if (checkValue && overrideSetting !== false) {
						input.attr("checked","checked");
					}
				}

				label = make("label").addClass("checkbox").html(internationaliseSettingString(pref.title)).append(input);

				option.append(label);

				if (exists(pref.initFunc)) {
					pref.initFunc(select);
				}

				break;

			case "dropdown":
				select = make("select").attr("type","select").attr("id",prefKey).change(function() {
					parseActions(pref.activate, $(this).val());
					if (pref.savePreference !== false) {
						setPref(pref.settingsKey,$(this).val());
					}
				});

				if (disableSetting) {
					select.attr("disabled","disabled")
				}

				for (let prefKey in pref.options) {
					if (!!(pref.options[prefKey].value)) {
						let newPrefSel = pref.options[prefKey];
						let newoption = make("option").attr("value",newPrefSel.value).html(internationaliseSettingString(newPrefSel.text));

						select.append(newoption);
					} else {

						let group = make("optgroup").attr("label",internationaliseSettingString(pref.options[prefKey].name))

						for (let subkey in pref.options[prefKey].children) {
							let newSubPrefSel = pref.options[prefKey].children[subkey];
							let newsuboption = make("option").attr("value",newSubPrefSel.value).html(internationaliseSettingString(newSubPrefSel.text));

							group.append(newsuboption);
						}

						select.append(group);
					}
				}

				if (exists(pref.settingsKey)) {
					select.val(getPref(pref.settingsKey));
				} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
					let checkValue;

					try {
						checkValue = pref.queryFunction();
					} catch(e) {
						console.error(e);
						checkValue = pref.default;
					}

					select.val(checkValue)
				}

				if (overrideSetting) {
					select.val(overrideSetting);
				}

				label = make("label").addClass("control-label").html(internationaliseSettingString(pref.title));

				option.append(label,select);

				if (exists(pref.initFunc)) {
					pref.initFunc(select);
				}

				break;

			case "textbox":
				input = make("input").attr("type","text").attr("id",prefKey);

				if (disableSetting) {
					input.attr("disabled","disabled")
				}

				if (pref.instantApply === true) {
					input.on("input",function() {
						parseActions(pref.activate, $(this).val());
						if (pref.savePreference !== false) {
							setPref(pref.settingsKey, $(this).val());
						}
					});
				} else {
					input.change(function() {
						parseActions(pref.activate, $(this).val());
						if (pref.savePreference !== false) {
							setPref(pref.settingsKey, $(this).val());
						}
					});
				}

				if (exists(pref.settingsKey)) {
					input.val(getPref(pref.settingsKey));
				} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
					let checkValue;

					try {
						checkValue = pref.queryFunction();
					} catch(e) {
						console.error(e);
						checkValue = pref.default;
					}

					input.val(checkValue)
				}

				if (overrideSetting) {
					input.val(overrideSetting);
				}

				label = make("label").addClass("control-label").html(internationaliseSettingString(pref.title));

				if (exists(pref.initFunc)) {
					pref.initFunc(input);
				}

				option.append(label,input);

				break;

			case "textarea":
				input = make("textarea").addClass("mtd-textarea").attr("id",prefKey).attr("rows","10").attr("cols","80").attr("placeholder",pref.placeholder || "").attr("spellcheck",false);

				if (disableSetting) {
					input.attr("disabled","disabled")
				}

				if (pref.instantApply === true) {
					input.on("input",function() {
						parseActions(pref.activate, $(this).val());
						if (pref.savePreference !== false) {
							setPref(pref.settingsKey, $(this).val());
						}
					});
				} else {
					input.change(function() {
						parseActions(pref.activate, $(this).val());
						if (pref.savePreference !== false) {
							setPref(pref.settingsKey, $(this).val());
						}
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
					let checkValue;

					try {
						checkValue = pref.queryFunction();
					} catch(e) {
						console.error(e);
						checkValue = pref.default;
					}

					input.val(checkValue)
				}

				if (overrideSetting) {
					input.val(overrideSetting);
				}

				label = make("label").addClass("control-label").html(internationaliseSettingString(pref.title));

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
					if (pref.savePreference !== false) {
						setPref(pref.settingsKey, $(this).val());
					}
				}).on("input",function() {
					label.html(`${internationaliseSettingString(pref.title)} <b> ${$(this).val()} ${(internationaliseSettingString(pref.displayUnit || ""))} </b>`);
				});

				defaultButton = make("button").addClass("btn btn-positive mtd-settings-button mtd-default-button").text(I18n("Restore default")).click(() => {
					input.val(typeof pref.default === "function" ? pref.default() : pref.default).trigger("input").trigger("change");
				})

				if (disableSetting) {
					input.attr("disabled","disabled")
				}

				if (exists(pref.settingsKey)) {
					input.val(parseInt(getPref(pref.settingsKey)));
				} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
					let checkValue;

					try {
						checkValue = pref.queryFunction();
					} catch(e) {
						console.error(e);
						checkValue = pref.default;
					}

					input.val(checkValue);
				} else if (exists(pref.default)) {
					if (typeof pref.default === "function") {
						input.val(pref.default());
					} else {
						input.val(pref.default);
					}
				}

				if (overrideSetting) {
					input.val(overrideSetting);
				}

				label.html(internationaliseSettingString(pref.title) + " <b> "+ input.val() + " " + (internationaliseSettingString(pref.displayUnit) || "") + "</b>");

				maximum = make("label").addClass("control-label mtd-slider-maximum").html(pref.maximum + (internationaliseSettingString(pref.displayUnit) || ""));
				minimum = make("label").addClass("control-label mtd-slider-minimum").html(pref.minimum + (internationaliseSettingString(pref.displayUnit) || ""));

				if (exists(pref.initFunc)) {
					pref.initFunc(input);
				}

				let sliderCont = make("div").addClass("mtd-slider-container").append(maximum, input, minimum)

				option.append(label, sliderCont, defaultButton);

				break;

			case "button":
				label = make("label").addClass("control-label").html(internationaliseSettingString(pref.label) || "");

				button = make("button").html(internationaliseSettingString(pref.title)).addClass("btn btn-positive mtd-settings-button")
				.click(() => {
					parseActions(pref.activate,true);
				});

				if (disableSetting) {
					button.attr("disabled","disabled")
				}

				if (exists(pref.initFunc)) {
					pref.initFunc(button);
				}

				option.append(label,button);

				break;

			case "buttons":
				label = make("label").addClass("control-label").html(internationaliseSettingString(pref.label) || "");

				option.append(label);

				pref.buttons.forEach(btn => {
					option.append(make("button").html(internationaliseSettingString(btn.text)).addClass("btn btn-positive mtd-settings-button").click(() => btn.func()))
				})

				if (exists(pref.initFunc)) {
					pref.initFunc(button);
				}

				break;

			case "link":
				link = make("a").html(internationaliseSettingString(pref.label)).addClass("mtd-settings-link")
				.click(() => {
					parseActions(pref.activate,true);
				});

				if (disableSetting) {
					link.attr("disabled","disabled")
				}

				if (exists(pref.initFunc)) {
					pref.initFunc(link);
				}

				option.append(link);

				break;
			
			case "subtext":
				label = make("label").addClass("control-label txt-mute mtd-settings-subtext").html(internationaliseSettingString(pref.label) || "");
				option.append(label);

				break;

		}

		subPanel.append(option);
	}

	if (settingsHidden) {
		subPanel.prepend(make("p").addClass("mtd-enterprise-management-text").text(I18n("Some settings are hidden by your organization")));
	}

	if (settingsDisabled) {
		subPanel.prepend(make("p").addClass("mtd-enterprise-management-text").text(I18n("Some settings are managed by your organization")));
	}
}

export function openSettings(openMenu, limitedMenu) {

	mtdPrepareWindows();

	let tabs = make("div").addClass("mtd-settings-tab-container mtd-tabs");
	let tabSelection = make("button").addClass("mtd-settings-tab mtd-settings-tab-selection");
	let container = make("div").addClass("mtd-settings-inner");
	let panel = make("div").addClass("mdl mtd-settings-panel").append(tabs).append(make("div").addClass("mtd-settings-inner-container").append(container));
	let diagClickNumber = 0;

	for (var key in settingsData) {


		if (typeof settingsData[key].enabled === "function") {
			if (settingsData[key].enabled() === false) {
				continue;
			}
		}

		// if set to false (NOT UNDEFINED, this is an optional parameter), skip it
		if (settingsData[key].enabled === false || settingsData[key].visible === false) {
			continue;
		}

		if (key === "system" && typeof window.enterpriseConfig !== undefined && window.enterpriseConfig.disableSystemTab) {
			continue;
		}

		switch(key) {
			case "themes":
			case "appearance":
			case "tweets":
			case "mutes":
				if (limitedMenu) {
					continue;
				}
				break;
		}

		var tab = make("button").addClass("mtd-settings-tab").attr("data-action",key).html(internationaliseSettingString(settingsData[key].tabName)).click(function() {
			$(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected").attr("aria-selected","false");
			$(this).addClass("mtd-settings-tab-selected");
			$(this).attr("aria-selected","true");

			var theKey = key;

			/*
				calculates how far to move over the settings menu
				good thing arrays start at 0, as 0 would be 0px, it's the first one
			*/

			container.attr("data-page-selected", $(this).attr("data-action"));
			tabSelection.css("top",($(this).index()*50)+"px");
			container.css("margin-top","-"+($(this).index()*545)+"px");
		});

		container.on("transitionend", () => {
			let visiblePage = container.attr("data-page-selected");
			// container.children().filter(`:not([id=${visiblePage}])`).addClass("hidden");
		})

		container.on("transitionstart", () => {
			// container.children().removeClass("hidden");
		})

		let subPanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id",key);

		if (!settingsData[key].enum && settingsData[key].enabled !== false && settingsData[key].visible !== false) {

			renderTab(key, subPanel);

		} else if (settingsData[key].enum === "aboutpage") {
			switch(verTextId) {
				case 0:
					verText = "";
					break;
				case 1:
					verText = I18n("Version");
					break;
				case 2:
					verText = I18n("Beta");
					break;
				case 3:
					verText = I18n("Developer Version");
					break;
			}

			let logo = make("i").addClass("mtd-logo icon-moderndeck icon").click(() => {
				diagClickNumber++;
				console.log(diagClickNumber);
				if (diagClickNumber >= 5) {
					diagClickNumber = 0;
					window.diag();
				}
			});

			let h1 = make("h1").addClass("mtd-about-title").html(productName + `<span>${isEnterprise() ? "" : ""}</span>`);
			let h2 = make("h2").addClass("mtd-version-title").html(verText + " " + SystemVersion + I18n(" (Build ") + buildId + ")");
			let logoCont = make("div").addClass("mtd-logo-container");

			if (!isApp) {
				// logoCont.append(
				// 	make("p").addClass("mtd-check-out-app").html(I18n("Get background notifications, enterprise features, and more with the free <a href='https://moderndeck.org/'>ModernDeck App</a>!"))
				// )
			} else if (window.enterpriseConfig && window.enterpriseConfig.autoUpdatePolicy === "never") {
				logoCont.append(
					make("p").addClass("mtd-check-out-app").html(I18n("Updates are disabled by your organization"))
				)
			}

			let info = make("p").html(I18n("Made with <i class=\"icon icon-heart mtd-about-heart\"></i> by <a href=\"https://twitter.com/dangeredwolf\" rel=\"user\" target=\"_blank\">dangered wolf</a> since 2014<br>ModernDeck is <a href=\"https://github.com/dangeredwolf/ModernDeck/\" target=\"_blank\">an open source project</a> released under the MIT license."));
			let infoCont = make("div").addClass("mtd-about-info").append(info);

			logoCont.append(logo, h1, h2);

			subPanel.append(logoCont);

			let updateCont = makeUpdateCont();

			if (isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-flatpak") && !html.hasClass("mtd-macappstore") && (window.enterpriseConfig && window.enterpriseConfig.autoUpdatePolicy !== "never")) {
				subPanel.append(updateCont);
			}

			if (html.hasClass("mtd-winstore")) {
				subPanel.append(
					make("div").append(
						make("h2").addClass("mtd-update-h3 mtd-update-managed").html(I18n("Updates for this version of ModernDeck are managed by the Microsoft Store.")),
						make("button").addClass("btn mtd-settings-button").html(I18n("Check for Updates")).click(() => open("ms-windows-store://updates"))
					)
				);
			} else if (html.hasClass("mtd-macappstore")) {
				subPanel.append(
					make("div").append(
						make("h2").addClass("mtd-update-h3 mtd-update-managed").html(I18n("Thank you for purchasing ModernDeck from the App Store!")),
						make("button").addClass("btn mtd-settings-button").html(I18n("Check for Updates")).click(() => {
							open("macappstore://showUpdatesPage");
						})
					)
				);
			}

			subPanel.append(infoCont);

		} else if (settingsData[key].enum === "mutepage") {

			let filterInput = make("input").addClass("js-filter-input").attr("name","filter-input").attr("size",30).attr("type","text").attr("placeholder",I18n("Enter a word or phrase"))

			let selectFilterType = make("select").attr("name","filter").addClass("js-filter-types").append(
				make("option").attr("value","phrase").html(I18n("Words or phrases")),
				make("option").attr("value","source").html(I18n("Tweet source"))
			).change(function() {
				filterInput.attr("placeholder", $(this).val() === "phrase" ? I18n("Enter a word or phrase") : I18n("eg TweetSpamApp"))
			});

			let muteButton = make("button").attr("name","add-filter").addClass("js-add-filter btn-on-dark disabled btn-primary").html(make("i").addClass("material-icon").html("volume_off")).click(() => {
				if (filterInput.val().length > 0) {
					TD.controller.filterManager.addFilter(selectFilterType.val(),filterInput.val(),false);

					updateFilterPanel(filterList);
				}
			});

			let muteTypes = make("div").addClass("control-group").append(
				make("label").attr("for","filter-types").addClass("control-label").html(I18n("Mute")),
				make("div").addClass("controls").append(selectFilterType)
			)

			let muteInput = make("div").addClass("control-group").append(
				make("label").attr("for","filter-input").addClass("control-label").html(I18n("Matching")),
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
		tab.attr("aria-selected","false");

		if (!exists(openMenu) && tab.index() === 0) {
			tab.addClass("mtd-settings-tab-selected");
			tab.attr("aria-selected","true");
			tab.click();
		}

		if (exists(openMenu) && openMenu === key) {
			tab.addClass("mtd-settings-tab-selected");
			tab.attr("aria-selected","true");
			tab.click();
		}
	}


	tabs.append(tabSelection);

	if (typeof $("#settings-modal")[0] !== "undefined") {
		new TD.components.GlobalSettings;

		$("#settings-modal>.mdl").remove();
		$("#settings-modal").append(panel);
	} else {
		$(".js-modals-container").append(
			make("div").addClass("ovl mtd-login-overlay").attr("style","display: block;").append(panel).click(event => {
				if (event.currentTarget === event.target) {
					mtdPrepareWindows();
				}
			})
		);
	}

	return panel;
}

/*
	Event function to update the UI as the update status changes
*/

function updateUIChanged() {
	if (AutoUpdateController.h2) {
		$(window.updateh2).removeClass("hidden");
		$(window.updateh2).html(AutoUpdateController.h2);
	} else {
		$(window.updateh2).addClass("hidden");
	}

	if (AutoUpdateController.h3) {
		$(window.updateh3).removeClass("hidden");
		$(window.updateh3).html(AutoUpdateController.h3);
	} else {
		$(window.updateh3).addClass("hidden");
	}

	if (AutoUpdateController.installButton) {
		$(window.installButton).removeClass("hidden");
		$(window.installButton).html(AutoUpdateController.installButton);
	} else {
		$(window.installButton).addClass("hidden");
	}

	if (AutoUpdateController.tryAgain) {
		$(window.tryAgain).removeClass("hidden");
		$(window.tryAgain).html(AutoUpdateController.tryAgain);
	} else {
		$(window.tryAgain).addClass("hidden");
	}

	if (AutoUpdateController.restartNow) {
		$(window.restartNow).removeClass("hidden");
	} else {
		$(window.restartNow).addClass("hidden");
	}

	if (AutoUpdateController.icon) {
		$(window.updateIcon).removeClass("hidden");
		$(window.updateIcon).html(AutoUpdateController.icon);
	} else {
		$(window.updateIcon).addClass("hidden");
	}

	if (AutoUpdateController.spinner === true) {
		$(window.updateSpinner).removeClass("hidden");
	} else {
		$(window.updateSpinner).addClass("hidden");
	}
}

/*
	Controller function for app update page
*/

function mtdAppUpdatePage() {

	$(document).on("mtdUpdateUIChanged", updateUIChanged);

	const { ipcRenderer } = require("electron");

	setTimeout(() => {
		$(window.tryAgain).click(() => {
			ipcRenderer.send("checkForUpdates");
		})

		$(window.installButton).click(() => {
			ipcRenderer.send("downloadUpdates");
		})

		$(window.restartNow).click(() => {
			ipcRenderer.send("restartAndInstallUpdates");
		});

		if (!AutoUpdateController.isCheckingForUpdates && window.enterpriseConfig.autoUpdatePolicy !== "disabled" && window.enterpriseConfig.autoUpdatePolicy !== "manual") {
			console.log("heck");
			ipcRenderer.send("checkForUpdates");
		}

		updateUIChanged();
	})
}


/*
	Creates the update container
*/

export function makeUpdateCont() {
	let updateCont = make("div").addClass("mtd-update-container").html('<div class="mtd-update-spinner preloader-wrapper small active" id="updateSpinner"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>').attr("id","updateCont");
	let updateIcon = make("i").addClass("material-icon hidden").attr("id","updateIcon");
	let updateh2 = make("h2").addClass("mtd-update-h2").html(I18n("Checking for updates...")).attr("id","updateh2");
	let updateh3 = make("h3").addClass("mtd-update-h3 hidden").html("").attr("id","updateh3");
	let tryAgain = make("button").addClass("btn hidden").html(I18n("Try Again")).attr("id","tryAgain");
	let installButton = make("button").addClass("btn hidden").html(I18n("Download")).attr("id","installButton");

	let restartNow = make("button").addClass("btn hidden").attr("id","restartNow");
	let restartNowHtml = I18n("Restart Now");

	if (isEnterprise()) {
		restartNowHtml = `<img src="moderndeck://resources/img/uac.png">${restartNowHtml}`;
	}

	restartNow.html(restartNowHtml);

	updateCont.append(updateIcon,updateh2,updateh3,tryAgain,installButton,restartNow);

	if (typeof require !== "undefined" && !html.hasClass("mtd-flatpak") && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
		mtdAppUpdatePage();
	}

	return updateCont;
}

/* Updates the mute list UI from twitter's backend */

function updateFilterPanel(filterList) {
	let filters = TD.controller.filterManager.getAll();
	filterList.html("");

	for (let n in filters) {
		let myFilter = filters[n];

		filterList.append(
			make("li").addClass("list-filter").append(
				make("div").addClass("mtd-mute-text mtd-mute-text-" + (myFilter.type === "source" ? "source" : "")),
				make("em").html(myFilter.value),
				make("input").attr("type","button").attr("name","remove-filter").attr("value",I18n("Remove")).addClass("js-remove-filter small btn btn-negative").click(() => {
					TD.controller.filterManager.removeFilter(myFilter);
					updateFilterPanel(filterList);
				})
			)
		);

	}

	return filterList;
}
