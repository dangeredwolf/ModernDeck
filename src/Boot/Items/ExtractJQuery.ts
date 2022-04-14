/*
	Boot/Items/ExtractJQuery.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import ModuleRaid from "moduleraid";
const mR = new ModuleRaid();
window.mR = mR;

export const extractJQuery = () => {
	try {
		let jQuery = mR.findConstructor("jQuery")[0][1];

		window.$ = jQuery;
		window.jQuery = jQuery;
        
        window.head = $(document.head);
        window.body = $(document.body);
        window.html = $(document.querySelector("html"));

	} catch (e) {
		throw "jQuery failed. This will break approximately... everything.";
	}
}

/*
	Prepares modal dialogs, context menus, etc for a new modal popup, so we clear those things out.
*/

window.mtdPrepareWindows = (): void => {
	console.info("mtdPrepareWindows called");
	$("#update-sound,.js-click-trap").click();
	$("#mtd_nav_drawer_background").click();

	$(".js-modals-container>.ovl.mtd-login-overlay").remove();

	$(".js-modal[style=\"display: block;\"]").click();

	$(".mtd-nav-group-expanded").removeClass("mtd-nav-group-expanded");
	$("#mtd_nav_group_arrow").removeClass("mtd-nav-group-arrow-flipped");
}
