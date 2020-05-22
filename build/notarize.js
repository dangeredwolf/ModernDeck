const {notarize} = require('electron-notarize');

module.exports = async function (params) {
	const { electronPlatformName } = context;
	if (electronPlatformName !== "darwin") {
		return;
	}

	console.log("Notarizing macOS app... this will take a while...");
	console.log("Seriously. it'll be a while. Go use the bathroom, maybe grab a snack or something. You might need it.");
	
	await notarize({
		appBundleId: "com.dangeredwolf.ModernDeck",
		appPath: "./dist/mac/ModernDeck.app",
		appleId: process.env.MDAppleID,
		appleIdPassword: process.env.MDAppleAppPassword
	});
};

module.exports = async function(){}
