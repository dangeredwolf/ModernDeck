const { notarize } = require('electron-notarize');

module.exports = async function (params) {
	if (process.platform !== 'darwin' || typeof process.env.MDAppleID === "undefined" || typeof process.env.ELECTRON_CACHE !== "undefined") {
        return;
    }

	console.log("   Notarizing macOS app... this WILL take a while...");

	await notarize({
		appBundleId: "com.dangeredwolf.ModernDeck",
		appPath: "./dist/mac/ModernDeck.app",
		appleId: process.env.MDAppleID,
		appleIdPassword: process.env.MDAppleAppPassword
	});
};
