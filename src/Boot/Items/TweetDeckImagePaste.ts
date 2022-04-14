/*
	Boot/Items/TweetDeckImagePaste.ts

	Copyright (c) 2014-2022 dangered wolf, et al
	Released under the MIT License
*/

/*
	Allows copying image to the clipboard from pasting, via context menu or Ctrl/Cmd + V
*/

function retrieveImageFromClipboardAsBlob(pasteEvent: ClipboardEvent, callback: (imageBlob: Blob) => void) {

	let items = pasteEvent.clipboardData.items;

	if (typeof items === "undefined") {
		return;
	};

	for (let i = 0; i < items.length; i++) {

		// Skip content if not image
		if (items[i].type.indexOf("image") == -1) continue;

		let blob = items[i].getAsFile();

		if (typeof(callback) == "function"){
			callback(blob);
		}
	}
}


export const initTweetDeckImagePaste = () => {
    /*
        Paste event to allow for pasting images in TweetDeck
    */

    window.addEventListener("paste", (e: ClipboardEvent) => {

        retrieveImageFromClipboardAsBlob(e, imageBlob => {

            if (imageBlob) {

                let buildEvent = jQuery.Event("dragenter",{originalEvent:{dataTransfer:{files:[imageBlob]}}});
                let buildEvent2 = jQuery.Event("drop",{originalEvent:{dataTransfer:{files:[imageBlob]}}});

                $(document).trigger(buildEvent);
                $(document).trigger(buildEvent2);
            }

        });

    }, false);
}