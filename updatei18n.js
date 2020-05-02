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
	let arr = a.split(",");
	if (arr[1])
		newObj[arr[0].substr(1, arr[0].length-2)] = {
			en:(arr[1].substr(1, arr[1].length-2)),
			bg:(arr[2].substr(1, arr[2].length-2)),
			hr:(arr[3].substr(1, arr[3].length-2)),
			en_CA:(arr[5].substr(1, arr[5].length-2)),
			en_GB:(arr[6].substr(1, arr[6].length-2)),
			en_US:(arr[7].substr(1, arr[7].length-2)),
			et:(arr[8].substr(1, arr[8].length-2)),
			fr:(arr[9].substr(1, arr[9].length-2)),
			de:(arr[10].substr(1, arr[10].length-2)),
			he:(arr[11].substr(1, arr[11].length-2)),
			it:(arr[12].substr(1, arr[12].length-2)),
			ja:(arr[13].substr(1, arr[13].length-2)),
			mt:(arr[14].substr(1, arr[14].length-2)),
			pl:(arr[15].substr(1, arr[15].length-2)),
			pt:(arr[16].substr(1, arr[16].length-2)),
			ru:(arr[17].substr(1, arr[17].length-2)),
			es:(arr[18].substr(1, arr[18].length-2)),
			es_MX:(arr[19].substr(1, arr[19].length-2)),
			es_US:(arr[20].substr(1, arr[20].length-2)),
			sv:(arr[21].substr(1, arr[21].length-2)),
			zh_Hans:(arr[22].substr(1, arr[22].length-2)),
			zh_Hant:(arr[23].substr(1, arr[23].length-2))
		}
});



fs.writeFileSync(results,"export default " + JSON.stringify(newObj))
