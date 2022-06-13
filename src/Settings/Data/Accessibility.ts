/*
	Settings/Data/Accessibility.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";

import { enableStylesheetExtension, disableStylesheetExtension } from "../../StylesheetExtensions";
import { ctrlShiftText } from "../../Utils";
import { SettingsKey } from "../SettingsKey";

let tab: ModernDeckSettingsTab = {
    tabName:"<i class='material-icon' aria-hidden='true'>accessibility</i> {{Accessibility}}",
    options: {
        focusOutline: {
            headerBefore: "{{Accessibility}}",
            title:"{{Always show outlines around focused items (}}" + ctrlShiftText + "A {{to toggle)}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                htmlAddClass:"mtd-acc-focus-ring"
            },
            deactivate: {
                htmlRemoveClass:"mtd-acc-focus-ring"
            },
            settingsKey:SettingsKey.FOCUS_OUTLINES,
            default:false
        },
        highContrast: {
            title:"{{Enable High Contrast theme (}}" + ctrlShiftText + "H {{to toggle)}}",
            type: ModernDeckSettingsType.CHECKBOX,
            activate: {
                func: () => {
                    disableStylesheetExtension("light");
                    disableStylesheetExtension("darker");
                    disableStylesheetExtension("discorddark");
                    disableStylesheetExtension("paper");
                    enableStylesheetExtension("dark");
                    enableStylesheetExtension("amoled");
                    enableStylesheetExtension("highcontrast");
                }
            },
            deactivate: {
                func: () => {
                    disableStylesheetExtension("highcontrast");
                    disableStylesheetExtension("amoled");
                }
            },
            settingsKey:SettingsKey.HIGH_CONTRAST,
            default:false
        }
    }
}

export default tab;