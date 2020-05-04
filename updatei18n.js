const fs = require("fs");
const path = require("path");

let i18n = path.format({
	dir:__dirname,
	base:"tweetdeck-i18n.csv"
});

let results = path.format({
	dir:__dirname + "\\src",
	base:"DataI18n.js"
});

let buildFile = fs.readFileSync(i18n) + "";
let newObj = {};

buildFile.split("\n").forEach((a, i) => {
	let arr = a.replace(/\"\,\"/g,"\"=,=\"").replace(/\=\"\"/g,"=\"").replace(/\"\" /g,"\" ").replace(/\"\"\>/g,"\">").replace(/ \"\"/g," \"").replace(/\"\" /g,"\" ").split("=,=");
	if (arr[0])
		newObj[arr[0].substr(1, arr[0].length-2)] = {
			en:(arr[0].substr(1, arr[1].length-2)).replace(/\"\"/g,"\""),
			bg:(arr[2].substr(1, arr[2].length-2)).replace(/\"\"/g,"\""),
			hr:(arr[3].substr(1, arr[3].length-2)).replace(/\"\"/g,"\""),
			en_CA:(arr[5].substr(1, arr[5].length-2)).replace(/\"\"/g,"\""),
			en:(arr[6].substr(1, arr[5].length-2)).replace(/\"\"/g,"\""),
			en_GB:(arr[6].substr(1, arr[6].length-2)).replace(/\"\"/g,"\""),
			en_US:(arr[7].substr(1, arr[7].length-2)).replace(/\"\"/g,"\""),
			et:(arr[8].substr(1, arr[8].length-2)).replace(/\"\"/g,"\""),
			fr:(arr[9].substr(1, arr[9].length-2)).replace(/\"\"/g,"\""),
			de:(arr[10].substr(1, arr[10].length-2)).replace(/\"\"/g,"\""),
			he:(arr[11].substr(1, arr[11].length-2)).replace(/\"\"/g,"\""),
			it:(arr[12].substr(1, arr[12].length-2)).replace(/\"\"/g,"\""),
			ja:(arr[13].substr(1, arr[13].length-2)).replace(/\"\"/g,"\""),
			es_AR:(arr[14].substr(1, arr[14].length-2)).replace(/\"\"/g,"\""), // originally Maltese (mt)
			pl:(arr[15].substr(1, arr[15].length-2)).replace(/\"\"/g,"\""),
			pt:(arr[16].substr(1, arr[16].length-2)).replace(/\"\"/g,"\""),
			ru:(arr[17].substr(1, arr[17].length-2)).replace(/\"\"/g,"\""),
			es:(arr[18].substr(1, arr[18].length-2)).replace(/\"\"/g,"\""),
			// es_MX:(arr[19].substr(1, arr[19].length-2)).replace(/\"\"/g,"\""),
			es_419:(arr[19].substr(1, arr[19].length-2)).replace(/\"\"/g,"\""),
			es_US:(arr[20].substr(1, arr[20].length-2)).replace(/\"\"/g,"\""),
			sv:(arr[21].substr(1, arr[21].length-2)).replace(/\"\"/g,"\""),
			zh:(arr[22].substr(1, arr[22].length-2)).replace(/\"\"/g,"\""),
			zh_CN:(arr[22].substr(1, arr[22].length-2)).replace(/\"\"/g,"\""),
			zh_TW:(arr[23].substr(1, arr[23].length-2)).replace(/\"\"/g,"\""),
			fr_CA:(arr[24].substr(1, arr[24].length-2)).replace(/\"\"/g,"\"")
		}
});



fs.writeFileSync(results,"export default " + JSON.stringify(newObj))
