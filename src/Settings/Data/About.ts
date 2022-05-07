/*
	Settings/Data/About.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsEnumPage, ModernDeckSettingsTab } from "../../Types/ModernDeckSettings";

let tab: ModernDeckSettingsTab = {
    tabName:"<i class='material-icon' aria-hidden='true'>info_outline</i> {{About}}",
    tabId:"about",
    options:{},
    enum:ModernDeckSettingsEnumPage.ABOUT
};

export default tab;