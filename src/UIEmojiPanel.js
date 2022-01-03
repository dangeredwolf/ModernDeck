/*
	UIEmojiPanel.js

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

// import { EmojiButton } from '@joeattardi/emoji-button';

export class UIEmojiPanel {
	static attachEvents() {
		const picker = new EmojiButton({style:"twemoji",autohide:false,i18n:{
			search:I18n("Search emojis..."),
			categories: {
				recents: I18n("Recents"),
			    smileys: I18n("Smileys"),
			    people: I18n("People"),
			    animals: I18n("Animals & Nature"),
			    food: I18n("Food & Drink"),
			    activities: I18n("Activities"),
			    travel: I18n("Travel & Places"),
			    objects: I18n("Objects"),
			    symbols: I18n("Symbols"),
			    flags: I18n("Flags")
			},
			notFound:I18n("No results found.")
		}});

		picker.on("emoji", (emoji) => {
			console.log(emoji)
			emoji = emoji.replace("<img class=\"emoji\" draggable=\"false\" alt=\"", "").replace(/\" src=\".+/g,"");
			let theInput = document.querySelector(".compose-text");

			let oS = theInput.scrollTop;

			let sS = theInput.selectionStart;
			let sE = theInput.selectionEnd;
			theInput.value = theInput.value.substr(0, sS) + emoji + theInput.value.substr(sE);
			theInput.setSelectionRange(sS + emoji.length, sS + emoji.length);

			theInput.focus();
			theInput.scrollTop = oS;
		})
		$(".mtd-emoji-button.btn").off("click").click(() => {
			picker.togglePicker($(".mtd-emoji-button.btn")[0])
		})
	}
}
