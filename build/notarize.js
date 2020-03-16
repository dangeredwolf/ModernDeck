import { notarize } from 'electron-notarize';

// todo: detect macOS target


module.exports = async function (params) {
	await notarize({
		"com.dangeredwolf.ModernDeck",
		"./dist/mac/ModernDeck.app",
		process.env.MDAppleID,
		process.env.MDAppleAppPassword
	});
};
