let builder = require("electron-builder");
let fs = require("fs-extra");

const tmpDir = "ModernDeck_app_tmp";

let appDelFiles = [
	tmpDir + "/AppIcon16.png",
	tmpDir + "/AppIcon24.png",
	tmpDir + "/AppIcon32.png",
	tmpDir + "/AppIcon44.png",
	tmpDir + "/AppIcon48.png",
	tmpDir + "/AppIcon50.png",
	tmpDir + "/AppIcon64.png",
	tmpDir + "/AppIcon150.png",
	tmpDir + "/manifest.json",
	tmpDir + "/_locales",
	tmpDir + "/extension"
]

let deletedFiles = 0;

console.log("\n");
console.log("ModernDeck build.js");
console.log("Copyright 2019 dangeredwolf, et al");
console.log("Released under the MIT license");
console.log("\n");

function copyTemp() {
	console.info("Copying ModernDeck to ModernDeck_app_tmp...");

	fs.copy("ModernDeck",tmpDir)
		.then(() => {
			console.info("done");
			deleteUnnecessaryFilesApp();
		})
		.catch(err => {
			console.error(err)
		});
}

function deleteUnnecessaryFilesApp() {
	for (a in appDelFiles) {
		console.info("Deleting Chrome Extension files (that goes unused in app)...");

		fs.remove(a)
			.then(() => {
				deletedFiles++;

				console.info("done " + a);
				
				if (deletedFiles == appDelFiles.length) {
					console.log("SUCC");
				}
			})
			.catch(err => {
				console.error("An error occurred while deleting " + a);
				console.error(err);
			});
	}

}

copyTemp()