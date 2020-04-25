const {notarize} = require('electron-notarize');

// todo: detect macOS target

console.log("Notarizing app... this will take a while...");
console.log("Seriously. it'll be a while. Go use the bathroom, maybe grab a snack or something. You might need it.");

// module.exports = async function (params) {

// 	await notarize({
// 		appBundleId: "com.dangeredwolf.ModernDeck",
// 		appPath: "./dist/mac/ModernDeck.app",
// 		appleId: process.env.MDAppleID,
// 		appleIdPassword: process.env.MDAppleAppPassword
// 	});
// };

module.exports = async function(){}