const axios = require("axios");
const fs = require("fs");

const axiosConfig = {
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

function processFonts(data) {
	let entries = data.split("/* ");

	let output = {};

	entries.forEach(entry => {
		let name = entry.match(/^[\w\-]+/g);
		let weight = entry.match(/(?<=font-weight: )\d+/g);
		let url = entry.match(/(?<=src: url\()https:\/\/[\w\.\/\-]+(?=\))/g);

		console.log(name ? name[0] : undefined, weight ? weight[0] : undefined, url ? url[0] : undefined);
	})


}

async function updateFonts() {
	let Roboto = await axios.get("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400;1,500;1,700;1,900&display=swap", axiosConfig);

	console.log(processFonts(Roboto.data));
}

updateFonts();