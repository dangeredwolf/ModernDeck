/*
	Boot/Items/RuntimeStylesheetExtensions.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

import { I18n } from "../../I18n"
import { enableCustomStylesheetExtension } from "../../StylesheetExtensions"

export const runtimeStylesheetExtensions = () => {

    // Use rainbow logo in June
    if ((new Date()).getMonth() === 5) {
        enableCustomStylesheetExtension("moderndeckLogo", `
            .mtd-settings-panel .mtd-logo {
                background-image: url(${window.mtdBaseURL}assets/img/moderndeckrainbow.svg)!important;
            }
        `)
    }

    enableCustomStylesheetExtension("i18nCSS",`
    .recent-search-clear.list-item-last span:after {
        content:"${I18n("Clear")}";
    }
    .js-column-detail .column-title-back:before,.js-column-detail .column-title-back:after,.js-tweet-results .column-title-back:after,.js-tweet-social-proof-back:after {
        content:"${I18n("Tweet")}";
    }
    .js-tweet-social-proof-back:after {
        content:"${I18n("Interactions")}";
    }
    .js-hide-drawer.app-nav-tab:after {
        content:"${I18n("Close Account List")}";
    }
    .js-dm-participants-back:after {
        content:"${I18n("People")}";
    }
    .js-display-sensitive-media span:after {
        content:"${I18n("Show potentially sensitive media")}"
    }
    .contributor-detail>a:before {
        content:"${I18n("Change")}";
    }
    .microsoft-logo:after {
        content:"${I18n("Microsoft")}";
    }
    .pull-right>button[data-action="quote"]:after {
        content:"${I18n("Quote Tweet")}";
    }
    .mtd-mute-text-:before {
        content:"${I18n("Text ")}"
    }
    .mtd-mute-text-source:before {
        content:"${I18n("Source ")}"
    }
    .mtd-altsensitive .media-sensitive p:before {
        content:"${I18n("Click here to open this media anyway")}"
    }
    .mtd-altsensitive .mdl .chirp-container .media-sensitive p:before,.mtd-altsensitive .is-actionable .is-gif .media-sensitive p:before {
        content:"${I18n("Open details of this tweet to view this media.")}"
    }
    .js-show-this-thread>p:after {
        content:"${I18n("Thread")}"
    }
    `)
}