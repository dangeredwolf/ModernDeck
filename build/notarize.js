const notarize = require('electron-notarize');

// todo: detect macOS target

console.log("Notarizing app... this will take a while...");

module.exports = async function (params) {
	await notarize({
		appBundleId: "com.dangeredwolf.ModernDeck",
		appPath: "./dist/mac/ModernDeck.app",
		appleId: process.env.MDAppleID,
		appleIdPassword: process.env.MDAppleAppPassword
	});
};
