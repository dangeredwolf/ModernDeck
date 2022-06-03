export const separator = process.platform === "win32" ? "\\" : "/";
export const isAppX = !!process.windowsStore
export const isFlatpak = (process.platform === "linux" && process.env.FLATPAK_HOST === "1")
export const isMAS = !!process.mas;

const https = require("https");
const fs = require("fs");
const { dialog } = require("electron");

export function saveImageAs(url: string) {
	if (!url) {
		throw "saveImageAs requires \"URL\" as an argument";
	}

	let fileType = url.match(/(?<=format=)(\w{3,4})|(?<=\.)(\w{3,4}(?=\?))/g)[0] || "file";
	let fileName = url.match(/(?<=media\/)[\w\d_\-]+|[\w\d_\-]+(?=\.m)/g)[0] || "jpg";

	// console.log("saveImageAs");

	let savePath = dialog.showSaveDialogSync({defaultPath:fileName + "." + fileType});
	// console.log(savePath);
	if (savePath) {
		try {

			const file = fs.createWriteStream(savePath);

			https.get(url, (response: any) => {
				// console.log("Piping file...");
				response.pipe(file);
			});
		} catch(e) {
			console.log(e);
		}
	}

};