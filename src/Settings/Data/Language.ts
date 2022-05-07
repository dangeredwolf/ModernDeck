/*
	Settings/Data/Language.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "../../I18n";
import { UIAlert } from "../../UIAlert";
import { UILanguagePicker } from "../../UILanguagePicker";
import { translationCredits } from "../../DataTranslationCredits";

import { ModernDeckSettingsTab, ModernDeckSettingsType } from "../../Types/ModernDeckSettings";

let tab: ModernDeckSettingsTab = {
    tabName:"<i class='material-icon' aria-hidden='true'>language</i> {{Language}}",
    options:{
        mtdChangeLanguage:{
            headerBefore:"{{Language}}",
            title:"{{Change Language}}",
            label:"{{Changing your language will reset formatting customizations and restart ModernDeck}}",
            type:ModernDeckSettingsType.BUTTON,
            activate:{
                func: (): void => {
                    window.mtdPrepareWindows();
                    new UILanguagePicker();
                }
            }
        },
        translationCredits:{
            label:"{{Some awesome people have helped translate ModernDeck into other languages}}",
            type:ModernDeckSettingsType.BUTTONGROUP,
            buttons:[
                {text:"{{Help Translate}}", func: (): Window => open("http://translate.moderndeck.org/project/tweetdeck/invite") },
                {text:"{{Translation Credits}}", func: (): JQuery => new UIAlert({title:I18n("Translation Credits"), message:translationCredits}).alertButton.remove()}
            ]
        },
        timeFormat:{
            headerBefore:"{{Formatting}}",
            title:"{{Time format}}",
            type:ModernDeckSettingsType.DROPDOWN,
            activate:{
                func: (opt: string): void => {
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
            type:ModernDeckSettingsType.DROPDOWN,
            activate:{
                func: (): void => {
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
            type:ModernDeckSettingsType.CHECKBOX,
            activate:{
                func: (): void => {
                    window.mtdAbbrevNumbers = true
                }
            },
            deactivate:{
                func: (): void => {
                    window.mtdAbbrevNumbers = false
                }
            },
            settingsKey:"mtd_abbrevNumbers",
            default:true
        },
    }
}

export default tab;