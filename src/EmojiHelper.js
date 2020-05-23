export function fromCodePoint(str) {
	let newStr = "";
	str = str.replace(/\*/g,"");
	str = str.split("-");

	str.forEach(
		a => {newStr += twemoji.convert.fromCodePoint(a);}
	)
	return newStr;
}
