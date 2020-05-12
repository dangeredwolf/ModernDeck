
import buildId from "./buildId.js";
import { make, exists, isApp, sanitiseString, formatBytes } from "./Utils.js";
import { settingsData } from "./DataSettings.js";
import { hasPref, getPref, setPref } from "./StoragePreferences.js";
import { buildContextMenu } from "./UIContextMenu.js";
import { parseActions } from "./PrefHandler.js";
import { I18n } from "./I18n.js";
import { mtdAlert } from "./UIAlert.js";
import { translationCredits } from "./DataTranslationCredits.js";

const appendTextVersion = false;
const enablePatronFeatures = true;

let ver = "Version";
let verTextId = 2;
let verText = "";




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

export function openSettings(openMenu) {

	mtdPrepareWindows();

	let tabs = make("div").addClass("mtd-settings-tab-container mtd-tabs");
	let container = make("div").addClass("mtd-settings-inner");
	let panel = make("div").addClass("mdl mtd-settings-panel").append(tabs).append(make("div").addClass("mtd-settings-inner-container").append(container));


	for (var key in settingsData) {

		// if set to false (NOT UNDEFINED, this is an optional parameter), skip it
		if (settingsData[key].enabled === false || settingsData[key].visible === false) {
			continue;
		}

		var tab = make("button").addClass("mtd-settings-tab").attr("data-action",key).html(internationaliseSettingString(settingsData[key].tabName)).click(function() {
			$(".mtd-settings-tab-selected").removeClass("mtd-settings-tab-selected");
			$(this).addClass("mtd-settings-tab-selected");

			var theKey = key;

			/*
				calculates how far to move over the settings menu
				good thing arrays start at 0, as 0 would be 0px, it's the first one
			*/

			container.attr("data-page-selected", $(this).attr("data-action"));

			container.css("margin-left","-"+($(this).index()*700)+"px");
		});

		container.on("transitionend", () => {
			let visiblePage = container.attr("data-page-selected");
			container.children().filter(`:not([id=${visiblePage}])`).addClass("hidden");
		})

		container.on("transitionstart", () => {
			container.children().removeClass("hidden");
		})

		let subPanel = make("div").addClass("mtd-settings-subpanel mtd-col scroll-v").attr("id",key);

		if (!settingsData[key].enum && settingsData[key].enabled !== false && settingsData[key].visible !== false) {

			for (let prefKey in settingsData[key].options) {

				let pref = settingsData[key].options[prefKey];
				let option = make("div").addClass("mtd-settings-option").addClass("mtd-settings-option-"+pref.type);

				if (exists(pref.addClass)) {
					option.addClass(pref.addClass);
				}

				if (pref.enabled === false || pref.visible === false) {
					continue;
				}

				if (exists(pref.headerBefore)) {
					subPanel.append(
						make("h3").addClass("mtd-settings-panel-subheader").html(internationaliseSettingString(pref.headerBefore))
					);
				}

				if (exists(pref.settingsKey) && exists(pref.default) && !hasPref(pref.settingsKey)) {
					setPref(pref.settingsKey, pref.default);
				}

				let input,select,label,minimum,maximum,button,link;


				switch(pref.type) {

					case "checkbox":
						input = make("input").attr("type","checkbox").attr("id",prefKey).change(function() {
							if (pref.savePreference !== false) {
								setPref(pref.settingsKey,$(this).is(":checked"));
							}

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

						for (let prefKey in pref.options) {
							if (!!(pref.options[prefKey].value)) {
								let newPrefSel = pref.options[prefKey];
								let newoption = make("option").attr("value",newPrefSel.value).html(internationaliseSettingString(newPrefSel.text));

								select.append(newoption);
							} else {

								let group = make("optgroup").attr("label",pref.options[prefKey].name)

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
							select.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(internationaliseSettingString(pref.title));

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
							input.val(pref.queryFunction())
						}

						label = make("label").addClass("control-label").html(internationaliseSettingString(pref.title));

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
							input.val(pref.queryFunction())
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

						if (exists(pref.settingsKey)) {
							input.val(parseInt(getPref(pref.settingsKey)));
						} else if (!exists(pref.settingsKey) && exists(pref.queryFunction)) {
							input.val(pref.queryFunction());
						} else if (exists(pref.default)) {
							input.val(pref.default);
						}

						label.html(internationaliseSettingString(pref.title) + " <b> "+ input.val() + " " + (internationaliseSettingString(pref.displayUnit) || "") + "</b>");

						maximum = make("label").addClass("control-label mtd-slider-maximum").html(pref.maximum + (internationaliseSettingString(pref.displayUnit) || ""));
						minimum = make("label").addClass("control-label mtd-slider-minimum").html(pref.minimum + (internationaliseSettingString(pref.displayUnit) || ""));

						if (exists(pref.initFunc)) {
							pref.initFunc(input);
						}

						option.append(label,maximum,input,minimum);

						break;

					case "button":
						label = make("label").addClass("control-label").html(internationaliseSettingString(pref.label) || "");

						button = make("button").html(internationaliseSettingString(pref.title)).addClass("btn btn-positive mtd-settings-button")
						.click(() => {
							parseActions(pref.activate,true);
						});

						if (exists(pref.initFunc)) {
							pref.initFunc(button);
						}

						option.append(label,button);

						break;

					case "link":
						link = make("a").html(internationaliseSettingString(pref.label)).addClass("mtd-settings-link")
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

			let logo = make("i").addClass("mtd-logo icon-moderndeck icon");
			let h1 = make("h1").addClass("mtd-about-title").html("ModernDeck 8");
			let h2 = make("h2").addClass("mtd-version-title").html(verText + " " + SystemVersion + I18n(" (Build ") + buildId + ")");
			let logoCont = make("div").addClass("mtd-logo-container");

			if (!isApp) {
				logoCont.append(
					make("p").addClass("mtd-check-out-app").html(I18n("Did you know ModernDeck has a native app? <a href='https://moderndeck.org/download'>Check it out!</a>"))
				)
			}

			let info = make("p").html(I18n("Made with <i class=\"icon icon-heart mtd-about-heart\"></i> by <a href=\"https://twitter.com/dangeredwolf\" rel=\"user\" target=\"_blank\">dangeredwolf</a> in Columbus, OH since 2014<br><br>ModernDeck is <a href=\"https://github.com/dangeredwolf/ModernDeck/\" target=\"_blank\">an open source project</a> released under the MIT license."));
			let infoCont = make("div").addClass("mtd-about-info").append(info);

			logoCont.append(logo,h1,h2);

			subPanel.append(logoCont);

			let updateCont = makeUpdateCont();

			let patronInfo = make("div").addClass("mtd-patron-info").append(
				makePatronView()
			)

			if (isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
				subPanel.append(updateCont);
			}

			subPanel.append(make("div").addClass("mtd-translation-thank-you").append(
				I18n("Some awesome people have helped translate ModernDeck into other languages"),
				"<br>",
				make("button").addClass("btn mtd-settings-button").html(I18n("Translation Credits")).click(() => {
					mtdAlert({title:I18n("Translation Credits"), message:translationCredits});
					$(".btn-primary.mtd-alert-button").remove();
				}),
				make("button").addClass("btn mtd-settings-button").html(I18n("Help Translate")).click(() => open("http://translate.moderndeck.org/project/tweetdeck/invite"))
			))

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
						make("h2").addClass("mtd-update-h3 mtd-update-managed").html(I18n("Updates for this version of ModernDeck are managed by the App Store.")),
						make("button").addClass("btn mtd-settings-button").html(I18n("Check for Updates")).click(() => {
							open("macappstore://showUpdatesPage");
						})
					)
				);
			}

			subPanel.append(infoCont);

			if (enablePatronFeatures)
				subPanel.append(patronInfo);

		} else if (settingsData[key].enum === "mutepage") {

			let filterInput = make("input").addClass("js-filter-input").attr("name","filter-input").attr("size",30).attr("type","text").attr("placeholder",I18n("Enter a word or phrase"))

			let selectFilterType = make("select").attr("name","filter").addClass("js-filter-types").append(
				make("option").attr("value","phrase").html(I18n("Words or phrases")),
				make("option").attr("value","source").html(I18n("Tweet source"))
			).change(function() {
				filterInput.attr("placeholder", $(this).val() === "phrase" ? I18n("Enter a word or phrase") : I18n("eg TweetSpamApp"))
			});

			let muteButton = make("button").attr("name","add-filter").addClass("js-add-filter btn-on-dark disabled btn-primary").html(I18n("Mute")).click(() => {
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


/* Controller function for app update page */

function mtdAppUpdatePage(updateCont, updateh2, updateh3, updateIcon, updateSpinner, tryAgain, restartNow) {

	const {ipcRenderer} = require('electron');

	ipcRenderer.on("error",(e,args,f,g) => {

		$(".mtd-welcome-inner").addClass("mtd-enable-update-next");

		updateh2.html(I18n("There was a problem checking for updates."));
		$(".mtd-update-spinner").addClass("hidden");

		if (exists(args.code)) {
			updateh3.html(`${args.domain || ""} ${args.code || ""} ${args.errno || ""} ${args.syscall || ""} ${args.path || ""}`).removeClass("hidden");
		} else if (exists(f)) {
			updateh3.html(f.match(/^(Cannot check for updates: )(.)+\n/g)).removeClass("hidden")
		} else {
			updateh3.html(I18n("We couldn't interpret the error info we received. Please try again later or DM @ModernDeck on Twitter for further help.")).removeClass("hidden");
		}

		updateIcon.html("error_outline").removeClass("hidden");
		tryAgain.removeClass("hidden").html(I18n("Try Again"));
		restartNow.addClass("hidden");

	});

	ipcRenderer.on("checking-for-update", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html(I18n("Checking for updates..."));
		updateh3.addClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
		$("[id='update'] .mtd-welcome-next-button").html(I18n("Skip") + "<i class='icon icon-arrow-r'></i>");
	});

	ipcRenderer.on("update-available", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html(I18n("Updating..."));
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
	});

	ipcRenderer.on("download-progress", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		updateIcon.addClass("hidden");
		$(".mtd-update-spinner").removeClass("hidden");
		updateh2.html(I18n("Downloading update..."));
		updateh3.html(Math.floor(args.percent)+I18n("% complete (")+formatBytes(args.transferred)+I18n("/")+formatBytes(args.total)+I18n("; ")+formatBytes(args.bytesPerSecond)+("/s)")).removeClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.addClass("hidden");
	});


	ipcRenderer.on("update-downloaded", (e,args) => {
		$(".mtd-welcome-inner").removeClass("mtd-enable-update-next");
		console.log(args);
		$(".mtd-update-spinner").addClass("hidden");
		updateIcon.html("update").removeClass("hidden");
		updateh2.html(I18n("Update downloaded"));
		updateh3.html(I18n("Restart ModernDeck to complete the update")).removeClass("hidden");
		tryAgain.addClass("hidden");
		restartNow.removeClass("hidden");
	});


	ipcRenderer.on("update-not-available", (e,args) => {
		console.log(args);
		$(".mtd-update-spinner").addClass("hidden");
		updateh2.html(I18n("You're up to date"));
		updateIcon.html("check_circle").removeClass("hidden");
		updateh3.html(SystemVersion + I18n(" is the latest version.")).removeClass("hidden");
		tryAgain.removeClass("hidden").html(I18n("Check Again"));
		restartNow.addClass("hidden");
		$(".mtd-welcome-inner").addClass("mtd-enable-update-next");
		$("[id='update'] .mtd-welcome-next-button").html(I18n("Next") + "<i class='icon icon-arrow-r'></i>");
	});

	tryAgain.click(() => {
		ipcRenderer.send('checkForUpdates');
	})

	restartNow.click(() => {
		ipcRenderer.send('restartAndInstallUpdates');
	});

	ipcRenderer.send('checkForUpdates');
}


/*
	Creates the update container
*/

export function makeUpdateCont() {
	let updateCont = make("div").addClass("mtd-update-container").html('<div class="mtd-update-spinner preloader-wrapper small active"><div class="spinner-layer"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
	let updateSpinner = $(".mtd-update-spinner");
	let updateIcon = make("i").addClass("material-icon hidden");
	let updateh2 = make("h2").addClass("mtd-update-h2").html(I18n("Checking for updates..."));
	let updateh3 = make("h3").addClass("mtd-update-h3 hidden").html("");
	let tryAgain = make("button").addClass("btn hidden").html(I18n("Try Again"));
	let restartNow = make("button").addClass("btn hidden").html(I18n("Restart Now"));


	updateCont.append(updateIcon,updateh2,updateh3,tryAgain,restartNow);

	if (isApp && !html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
		if (!html.hasClass("mtd-winstore") && !html.hasClass("mtd-macappstore")) {
			mtdAppUpdatePage(updateCont,updateh2,updateh3,updateIcon,updateSpinner,tryAgain,restartNow);
		}
	}

	return updateCont;
}


/*
	Renders the patron display in the about page
*/

function renderPatronInfo(info, patronBox) {

	let scroller = make("div").addClass("mtd-auto-scroll scroll-v");

	let isInline = false;

	let metadataAvailable = typeof info.meta === "object";

	if (metadataAvailable) {
		if (exists(info.meta.inline)) {
			if (info.meta.inline === "true" || info.meta.inline === true) {
				isInline = true;
			}
		}
	}

	if ((exists(info.l1)) || (exists(info.l2))) {
		patronBox.append(make("h3").html(
			(metadataAvailable && typeof info.meta.title === "string") ? sanitiseString(info.meta.title) : I18n("ModernDeck is made possible by people like you")
		))
	}

	if (exists(info.l1)) {

		let patronList = make("div").addClass("mtd-patron-list mtd-patron-list-level1");

		if (isInline) {
			patronList.addClass("mtd-patron-list-inline");
		}

		$(info.l1).each((a, b) => {
			patronList.append(
				make("p").addClass("mtd-patron-level mtd-patron-level-1").html(sanitiseString(b))
			)
		});

		scroller.append(patronList);
	}

	if (exists(info.l2)) {

		let patronList = make("div").addClass("mtd-patron-list mtd-patron-list-level2");

		if (isInline) {
			patronList.addClass("mtd-patron-list-inline");
		}

		$(info.l2).each((a, b) => {
			patronList.append(
				make("p").addClass("mtd-patron-level mtd-patron-level-2").html(sanitiseString(b))
			)
		});

		scroller.append(patronList);
	}

	patronBox.append(scroller);

	if ((exists(info.l1)) || (exists(info.l2))) {
		patronBox.append(
			make("button")
			.click(function() {
				window.open(this.getAttribute("data-url"))
			})
			.addClass("btn btn-primary mtd-patreon-button")
			.html((metadataAvailable && typeof info.meta.buttonText === "string") ? sanitiseString(info.meta.buttonText) : "Support on Patreon")
			.attr("data-url",(metadataAvailable && typeof info.meta.buttonLink === "string") ? sanitiseString(info.meta.buttonLink) : "https://www.patreon.com/ModernDeck")

		)
	}
}


/*
	Begins construction of the patron view for those who contribute on Patreon
*/

function makePatronView() {
	let patronBox = make("div").addClass("mtd-patron-render");

	$.ajax(
		{
			url:"https://api.moderndeck.org/v1/patrons/"
		}
	).done((e) => {
		let parsedJson;

		try {
			parsedJson = JSON.parse(e);
		} catch (e) {
			console.error("Error occurred while parsing JSON of patron data");
			console.error(e);
			lastError = e;
		} finally {
			renderPatronInfo(parsedJson, patronBox)
		}
	})
	.error((e) => {
		console.error("Error trying to fetch patron data");
		console.error(e);
		lastError = e;
	});

	return patronBox;
}

/* Updates the mutes on twitter's backend */

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
