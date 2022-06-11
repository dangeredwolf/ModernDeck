/*
	Boot/Items/OTAConfig.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

enum BadgeTypes {
	BADGE_DEVELOPER = "developer",
}

interface OTAConfig {
	customBadges? : {
		[username: string] : BadgeTypes
	}
}

export const setupOTAConfig = () => {
	setupOTAConfigAsync();
}

const setupOTAConfigAsync = async () => {
	const otaconfig = await fetch("https://raw.githubusercontent.com/dangeredwolf/ModernDeck/master/build/otaconfig.json");
	const config: OTAConfig = await otaconfig.json();

	let otaCSS = "";

	console.log(config);

	if (config.customBadges) {
		for (const key in config.customBadges) {
			if (key.match(/[a-zA-Z0-9_]+/g)[0].length !== key.length) {
				console.error(`Invalid customBadges username in OTAConfig: ${key}`);
				continue;
			}
			if (config.customBadges.hasOwnProperty(key)) {
				const badgeType = config.customBadges[key];
				switch (badgeType) {
					case BadgeTypes.BADGE_DEVELOPER:
						otaCSS += `
							a[href="https://twitter.com/${key}"] .fullname:after,
							a[href="https://twitter.com/${key}"].link-complex .link-complex-target:after,
							a[data-user-name="${key}"] .fullname:after {
								content:"\\f003";
								font-size:20px;
								font-style:normal;
								text-rendering:optimizeLegibility;
								vertical-align:middle;
								padding-left:3px;
								font-family:MD!important
							}

							.js-action-url[href="https://twitter.com/${key}"] .fullname:after {
								font-size:32px
							}
						`
						break;
					default:
						console.log(`Unknown icon type ${badgeType} for ${key}`);
						break;
				}
			}
		}
	}

	if (otaCSS.length > 0) {
		const style = document.createElement("style");
		style.innerHTML = otaCSS;
		document.head.appendChild(style);
	}
}