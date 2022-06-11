/*
	Boot/Items/OTAConfig.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// interface OTAConfig {

// }

export const SetupOTAConfig = () => {
	fetch("/api/v1/ota/config").then(response => response.json())
}