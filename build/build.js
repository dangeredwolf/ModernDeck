const fs = require("fs-extra");
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const csso = require('@node-minify/csso');
const klaw = require('klaw');
const Zip = require('adm-zip');

const tmpDirExt = "ModernDeck_ext_tmp";

let debug = true;

let buildExt = true;

const minifySettings = {
	"js":true,
	"css":false
}

let extDelFiles = [
	tmpDirExt + "/sources/next"
]

let deletedFiles = 0;

console.log("\n");
console.log("ModernDeck build.js");
console.log("Copyright 2019 dangeredwolf, et al");
console.log("Released under the MIT license");
console.log("\n");

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

		makeChromeExt();
	})

}

function makeChromeExt() {
	console.info("Making Chromium extension...");

	var zip = new Zip();
	zip.addLocalFolder(tmpDirExt);
	zip.writeZip("./dist/moderndeck_ext_chrome.zip");

	console.info("Clearing temporary directory")

	fs.remove("./" + tmpDirExt).then(() => {
		console.info("Success. Have a great day!");
	})

}

buildExtension()
