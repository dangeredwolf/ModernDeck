const fs = require("fs");
const path = require("path");

let ver = require("../src/BuildProps.json").buildId;
ver++;

let thePath = path.format({
	dir: __dirname + path.sep + ".." + path.sep + "src",
	base: "BuildProps.json"
});

const buildProps = {
	buildId: ver,
	buildDate: new Date().toISOString(),
	buildVersion: require("../package.json").version
}

fs.writeFileSync(thePath, JSON.stringify(buildProps))