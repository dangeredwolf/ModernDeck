/*
    Boot/Items/GryphonDisable.ts

    Copyright (c) 2014-2022 dangered wolf, et al
    Released under the MIT License
*/

// Disables the TweetDeck Preview popup (codename "Gryphon")
export const gryphonDisabler = () => {
    if (typeof TD !== "undefined" && typeof TD.config !== "undefined") {
        const overlay = TD.config.config_overlay || (TD.config.config_overlay = {});
        overlay["tweetdeck_gryphon_beta_enabled"] = { value: false };
        overlay["tweetdeck_gryphon_beta_bypass_enabled"] = { value: false };
    }
}
