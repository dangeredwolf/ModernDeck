const fs = require("fs");
const path = require("path");

let thePath = path.format({
	dir: __dirname + path.sep + ".." + path.sep + "src",
	base: "buildId.ts"
});

let buildFile = fs.readFileSync(thePath) + "";
let ver = parseInt(buildFile.match(/\d+/g)[0]);
ver++;
fs.writeFileSync(thePath,"export default " + ver++ + ";")

let thePath2 = path.format({
	dir: __dirname + path.sep + ".." + path.sep + "src",
	base: "BuildProps.json"
});

const buildProps = {
	buildId: ver,
	buildDate: new Date().toISOString(),
	buildVersion: require("../package.json").version
}

fs.writeFileSync(thePath2, JSON.stringify(buildProps))