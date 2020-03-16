import { notarize } from 'electron-notarize';

// todo: detect macOS target

console.log("Notarizing app... this will take a while...");

module.exports = async function (params) {
	await notarize({
		"com.dangeredwolf.ModernDeck",
		"./dist/mac/ModernDeck.app",
		process.env.MDAppleID,
		process.env.MDAppleAppPassword
	});
};
