const axios = require("axios");
const fs = require("fs");

const axiosConfig = {
	responseType: "arraybuffer",
	headers: {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"}
}

const charsetTranslation = {
	cyrillic:"cyrillic",
	greek:"greek",
	latin:"latin",
	"cyrillic-ext":"cyrillicext",
	"greek-ext":"greekext",
	"latin-ext":"latinext",
	vietnamese:"viet"
}

console.log("Updating Fonts from Google Fonts...");

async function processFonts(data, fontName) {
	let entries = (data + "").split("/* ");

	let output = {};

	entries.forEach(async entry => {
		let name = entry.match(/^[\w\-]+/g);
		let weight = entry.match(/(?<=font-weight: )\d+/g);
		let url = entry.match(/(?<=src: url\()https:\/\/[\w\.\/\-]+(?=\))/g);

		if (!name) {
			console.error("Missing charset name for the following entry: " + entry);
			return;
		}
		if (!weight) {
			console.error("Missing weight for the following entry: " + entry);
			return;
		}
		if (!url) {
			console.error("Missing url for the following entry: " + entry);
			return;
		}

		let saveTo = `${__dirname}/../common/resources/fonts/${fontName}/${weight[0]}\-${charsetTranslation[name[0]]}.woff2`;

		if (process.platform === "win32") {
			saveTo = saveTo.replace(/\//g, "\\");
		}

		console.log(`Saving ${url[0]} as ${saveTo}`);

		let fetched = await axios.get(url[0], axiosConfig);
		let fetchedData = fetched.data;

		if (typeof fetchedData !== "undefined") {
			fs.writeFileSync(saveTo, fetched.data)
		} else {
			console.error("fetchedData is undefined....");
		}


	})


}

async function updateFonts() {
	let Roboto = await axios.get("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;0,900&display=swap", axiosConfig);

	console.log(processFonts(Roboto.data, "Roboto"));
}

updateFonts();
