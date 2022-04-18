/*
	Boot/Items/URLExchange.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

export const urlExchange = () => {
    const baseUrlElement = document.querySelector(`meta[name="moderndeck-base-url"]`);
    if (baseUrlElement && typeof baseUrlElement.getAttribute("content") === "string") {
        window.mtdBaseURL = baseUrlElement.getAttribute("content");
        console.info("Got base URL " + window.mtdBaseURL);
    } else if (window.MTDURLExchange instanceof HTMLElement) {
        window.mtdBaseURL = window.MTDURLExchange.getAttribute("type");
        console.info("MTDURLExchange completed with URL " + window.mtdBaseURL);
    }
}