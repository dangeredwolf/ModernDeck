const builder = require("electron-builder");
const fs = require("fs-extra");
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const csso = require('@node-minify/csso');
const klaw = require('klaw');
const Zip = require('adm-zip');

const tmpDir = "ModernDeck_app_tmp";
const tmpDirExt = "ModernDeck_ext_tmp";

let debug = true;

let buildExt = true;

const minifySettings = {
	"js":true,
	"css":false
}

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
	tmpDir + "/sources/emojipanel",
	tmpDir + "/sources/oneclick",
	tmpDir + "/sources/next",
	tmpDir + "/extension"
]

let extDelFiles = [
	tmpDirExt + "/sources/emojipanel",
	tmpDirExt + "/sources/next"
]

let deletedFiles = 0;

console.log("\n");
console.log("ModernDeck build.js");
console.log("Copyright 2019 dangeredwolf, et al");
console.log("Released under the MIT license");
console.log("\n");

function buildApp() {
	copyTempApp()
}

function copyTempApp() {
	if (fs.pathExistsSync(tmpDir)) {
		console.info("Removing old " + tmpDir + ", starting afresh");
		fs.removeSync(tmpDir);
	}
	console.info("Copying ModernDeck to " + tmpDir + "...");

	fs.copySync("ModernDeck", tmpDir);
	console.info("done");

	deleteUnnecessaryFilesApp();
}

function deleteUnnecessaryFilesApp() {
	console.info("Deleting Chrome Extension files (which go unused in app)...");
	for (a in appDelFiles) {

		fs.remove(appDelFiles[a])
			.then(() => {
				deletedFiles++;
				
				if (deletedFiles == appDelFiles.length) {
					console.log("done");
					minifyApp();
				}
			})
			.catch(err => {
				console.error("An error occurred while deleting " + appDelFiles[a]);
				console.error(err);
			});
	}

}

function minifyItem(item) {
	if (item.match(/\.js(?!on)$/g) !== null && minifySettings.js) {
		minify({
			compressor: uglifyES,
			input: item,
			output: item,
		}).then(() => {
			console.log("Minified " + item);
		}).catch(err => {
			console.error("An error occurred while minifying js file: " + item);
			console.error(err);
		});
	}
	else if (item.match(/\.css/g) !== null && minifySettings.css) {
		minify({
			compressor: csso,
			input: item,
			output: item,
			options: {
			},
		}).then(() => {
			console.log("Minified " + item);
		}).catch(err => {
			console.error("An error occurred while minifying css file: " + item);
			console.error(err);
		});
	}
}

function minifyApp() {
	console.info("Minifying code...");

	klaw('./' + tmpDir)
	.on('data', item => minifyItem(item.path))
	.on('end', () => {
		console.info("Searched for files to minify");
		//console.info("Removing csscomponents...");

		//fs.removeSync(tmpDir + "/sources/csscomponents");

		appBuilder();
	})

}

function appBuilder() {
	console.info("Running electron-builder");

	let target = null;

	let winTarget = builder.Platform.WINDOWS.createTarget();
	let macTarget = builder.Platform.MAC.createTarget();
	let linTarget = builder.Platform.LINUX.createTarget();

	if (process.platform === "win32") {
		console.info("Your platform is capable of building Windows, Windows AppX, Linux");

		builder.build({
			targets: winTarget,
			config:fs.readJSONSync("electron-builder.json")
		}).then(() => {
			console.info("done");
			console.info("Running electron-builder (appx)");
			builder.build({
				targets: winTarget,
				config:fs.readJSONSync("electron-builder-appx.json")
			}).then(() => {
				console.info("done");
				if (debug) {
					return;
				}
				console.info("Running electron-builder (linux)");
				builder.build({
					targets: linTarget,
					config:fs.readJSONSync("electron-builder.json")
				}).then(() => {
					console.info("done");
					if (fs.pathExistsSync(tmpDir)) {
						console.info("Removing " + tmpDir + "");
						fs.removeSync(tmpDir);
					}
					if (buildExt)
						buildExtension();
					else 
						console.info("Success. Have a great day!");
				});
			});
		});
	} else if (process.platform === "linux") {
		console.info("Your platform is capable of building Windows, Linux");
		builder.build({
			targets: linTarget,
			config:fs.readJSONSync("electron-builder.json")
		}).then(() => {
			console.info("done");
			console.info("Running electron-builder (win32)");
			builder.build({
				targets: winTarget,
				config:fs.readJSONSync("electron-builder.json")
			}).then(() => {
				console.info("done");
				if (fs.pathExistsSync(tmpDir)) {
					console.info("Removing " + tmpDir + "");
					fs.removeSync(tmpDir);
				}
				if (buildExt)
					buildExtension();
				else 
					console.info("Success. Have a great day!");
			});
		});
	} else if (process.platform === "darwin") {
		console.info("Your platform is capable of building Mac, Windows, Linux");
		builder.build({
			targets: macTarget,
			config:fs.readJSONSync("electron-builder.json")
		}).then(() => {
			console.info("done");
			console.info("Running electron-builder (win32)");
			builder.build({
				targets: winTarget,
				config:fs.readJSONSync("electron-builder.json")
			}).then(() => {
				console.info("done");
				console.info("Running electron-builder (linux)");
				builder.build({
					targets: linTarget,
					config:fs.readJSONSync("electron-builder.json")
				}).then(() => {
					console.info("done");
					if (fs.pathExistsSync(tmpDir)) {
						console.info("Removing " + tmpDir + "");
						fs.removeSync(tmpDir);
					}
					if (buildExt)
						buildExtension();
					else 
						console.info("Success. Have a great day!");
				});
			});
		});
	} else {
		console.error("Unknown platform " + process.platform)
	}

}

function buildExtension() {
	copyTempExt();
}

function copyTempExt() {

	if (fs.pathExistsSync(tmpDirExt)) {
		console.info("Removing old " + tmpDirExt + ", starting afresh");
		fs.removeSync(tmpDirExt);
	}
	console.info("Copying ModernDeck to " + tmpDirExt + "...");

	fs.copySync("ModernDeck", tmpDirExt);
	console.info("done");

	deleteUnnecessaryFilesExt();
}


function deleteUnnecessaryFilesExt() {
	console.info("Deleting unused files from temp...");
	for (a in extDelFiles) {

		fs.remove(extDelFiles[a])
			.then(() => {
				deletedFiles++;
				
				if (deletedFiles == extDelFiles.length) {
					console.log("done");
					makeFirefoxExt();
				}
			})
			.catch(err => {
				console.error("An error occurred while deleting " + extDelFiles[a]);
				console.error(err);
			});
	}

}

function makeFirefoxExt() {
	console.info("Making firefox extension...");

	var zip = new Zip();
	zip.addLocalFolder(tmpDirExt);
	zip.writeZip("./dist/moderndeck_ext_firefox.zip");

	minifyExt()
}


function minifyExt() {
	console.info("Minifying code for Chrome extension...");
	console.info("(Mozilla insists on not using compressors for AMO)");

	klaw('./' + tmpDirExt)
	.on('data', item => minifyItem(item.path))
	.on('end', () => {
		console.info("Searched for files to minify");
		//console.info("Removing csscomponents...");

		//fs.removeSync(tmpDirExt + "/sources/csscomponents");

		makeChromeExt();
	})

}

function makeChromeExt() {
	console.info("Making Chromium extension...");

	var zip = new Zip();
	zip.addLocalFolder(tmpDirExt);
	zip.writeZip("./dist/moderndeck_ext_chrome.zip");

	console.info("Success. Have a great day!");
}

if (process.argv.indexOf('--extension-only') > -1) {
	buildExtension()
} else if (process.argv.indexOf('--app-only') > -1) {
	buildExt = false;
	buildApp();
} else {
	buildApp();
}
