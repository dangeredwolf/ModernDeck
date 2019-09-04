const path = require('path');
module.exports = {
	"packagerConfig": {
		"ignore": [
			"ModernDeck\/dist",
			"build",
			"build..+",
			"armv7l",
			"test",
			"\\.appx",
			"\\.bat",
			"\\.ts",
			"donors.css",
			"electron-builder.json",
			"electron-builder-appx.json",
			"package-lock.json",
			"README.md",
			"LICENCES.md"
		]
	},
	"makers": [
		// {
		// 	"name": "@electron-forge/maker-appx",
		// 	"config": {
		// 		"name": "ModernDeck",
		// 		"publisher": "CN=FEC2801E-B19C-4051-A5E2-465F7B251519",
		// 		"makeVersionWinStoreCompatible": true,
		// 		"flatten": true,
		// 		"containerVirtualization": false
		// 	}
		// },
		{
			"name": "electron-forge-maker-appimage",
			"config": {
				"options": {
					"name": "moderndeck",
					"executableName": "moderndeck",
					"productName": "ModernDeck",
					"maintainer": "dangeredwolf",
					"genericName": "Twitter Client based on TweetDeck",
					"icon": path.resolve(__dirname, "build/icon.png"),
					"path": path.resolve(__dirname, ""),
					"homepage": "https://moderndeck.org"
				}
			}
		},
		{
			"name": "@electron-forge/maker-deb",
			"config": {
				"options": {
					"name": "moderndeck",
					"executableName": "moderndeck",
					"productName": "ModernDeck",
					"maintainer": "dangeredwolf",
					"genericName": "Twitter Client based on TweetDeck",
					"icon": path.resolve(__dirname, "build/icon.png"),
					"homepage": "https://moderndeck.org"
				}
			}
		},
		{
			"name": "@electron-forge/maker-dmg",
			"config": {
				"name": "ModernDeck",
				"icon": path.resolve(__dirname, "build/ModernDeck.icns"),
				"background": path.resolve(__dirname, "build/dmg/background.png"),
				"format": "ULFO"
			}
		},
		{
			"name": "@electron-forge/maker-rpm",
			"config": {
				"options": {
					"name": "moderndeck",
					"productName": "ModernDeck",
					"maintainer": "dangeredwolf",
					"genericName": "Twitter Client based on TweetDeck",
					"icon": path.resolve(__dirname, "build/icon.png"),
					"executableName": "moderndeck",
					"license": "MIT License",
					"homepage": "https://moderndeck.org"
				}
			}
		},
		{
			"name": "@electron-forge/maker-snap",
			"config": {
				"name": "moderndeck",
				"productName": "ModernDeck",
				"maintainer": "dangeredwolf",
				"genericName": "Twitter Client based on TweetDeck",
				"icon": path.resolve(__dirname, "build/icon.png"),
				"license": "MIT License",
				"features": {
					"audio": true
				},
				"executableName": "moderndeck",
				"homepage": "https://moderndeck.org"
			}
		},
		{
			"name": "@electron-forge/maker-squirrel",
			"config": {
				"name": "ModernDeck",
				"iconUrl": path.resolve(__dirname, "build/icon.ico")
			}
		},
		{
			"name": "@electron-forge/maker-zip",
			"platforms": [
				"darwin"
			]
		}
	]
}