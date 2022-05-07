/*
	Copyright (c) 2018-2022 dangered wolf, et al.
	Released under the MIT license
*/

const fs = require("fs-extra");
const path = require("path");

let i18n = path.format({
	dir:__dirname + path.sep + "..",
	base:"tweetdeck-i18n.csv"
});

let i18nMD = path.format({
	dir:__dirname + path.sep + "..",
	base:"moderndeck.csv"
});

let i18nMain = path.format({
	dir:__dirname + path.sep + "..",
	base:"main.csv"
});

let results = path.format({
	dir:__dirname +  path.sep + ".." + path.sep + "src",
	base:"DataI18n.ts"
});

let resultsMain = path.format({
	dir:__dirname +  path.sep + "..",
	base:"i18nMain.js"
});

let buildFile = fs.readFileSync(i18n) + "\n" + fs.readFileSync(i18nMD) + "";
let buildFileMain = fs.readFileSync(i18nMain) + "";

let langMap = ["src","af","bg","ca","zh_CN","zh_TW","hr","cs","da","nl","en","en_CA","en_GB","en_US","et","fi","fr","fr_CA","de","el","hi","hu","it","ja","ko","mi","no","pl","pt","pt_BR","ro","ru","sr","es","es_AR","es_419","es_US","sv","tr","uk","vi","eo","gd","si","sl","lv","id"];
let newFormatMap = {};

langMap.forEach(lang => {
	if (lang !== "src") {
		newFormatMap[lang] = {};
	}
})

function processFile(file, newFormat) {
	let newObj = {};

	file.split("\n").forEach((a, j) => {
		if (a.substr(0,1) === "#" || a.length <= 1) {
			return;
		}
		let arr = a.replace(/\"\,\"/g,"\"=,=\"").replace(/\\n/g,"\n").replace(/\=\"\"/g,"=\"").replace(/\"\" /g,"\" ").replace(/\"\"\>/g,"\">").replace(/ \"\"/g," \"").replace(/\"\" /g,"\" ").split("=,=");
		if (arr[0]) {
			let key = arr[0].substr(1, arr[0].length-2);
			if (!newFormat) {
				newObj[key] = {};
			}
			for (let i = 1; i < langMap.length; i++) {
				if (arr[i]) {

					if (key.indexOf("\\") > -1) {
						console.log(key);
					}

					if (arr[i].length > 1) {
						if (newFormat) {
							newFormatMap[langMap[i]][key] = arr[i].substr(1, arr[i].length-2).replace(/\"\"/g,"\"");
						} else {
							newObj[key][langMap[i]] = arr[i].substr(1, arr[i].length-2).replace(/\"\"/g,"\"");
						}

					}
				} else {
					console.log("Language array missing items: Line " + j + " Column " + i + "\nSource string: " + arr[0] + "\nThe language data may be corrupted. This can be caused by unescaped newlines.")
				}
			}
		}
	});

	return newObj;
}

fs.writeFileSync(results,"export default " + JSON.stringify(processFile(buildFile)));
fs.writeFileSync(resultsMain,"exports.default = " + JSON.stringify(processFile(buildFileMain)));

processFile(buildFile, true);

langMap.forEach(lang => {
	if (lang !== "src") {
		let thePath = path.format({
			dir:__dirname + path.sep + ".." + path.sep + "src" + path.sep + "I18n" + path.sep + "Data",
			base:lang + ".json"
		});

		fs.writeFileSync(thePath, JSON.stringify(newFormatMap[lang]));

	}
})

// Crowdin is stupid and doesn't export the correct folders

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "en-US"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "en_US"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "en-GB"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "en_GB"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "en-CA"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "en_CA"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "es-ES"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "es_ES"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "es-MX"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "es_MX"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "zh-CN"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "zh_CN"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "zh-TW"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "zh_TW"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "pt-BR"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "pt_BR"
	}))
} catch (e) {
	console.error(e);
}

try {
	fs.copy(path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "sv-SE"
	}), path.format({
		dir:__dirname +  path.sep + ".." + path.sep + "common" + path.sep + "_locales" + path.sep + "sv"
	}))
} catch (e) {
	console.error(e);
}
