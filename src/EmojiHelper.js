/*
	EmojiHelper.js
	Copyright (c) 2014-2020 dangered wolf, et al
	Released under the MIT licence
*/

export function fromCodePoint(str) {
	let newStr = "";
	str = str.replace(/\*/g,"");
	str = str.split("-");

	str.forEach(
		a => {newStr += twemoji.convert.fromCodePoint(a);}
	)
	return newStr;
}
