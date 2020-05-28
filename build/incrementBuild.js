const fs = require("fs");
const path = require("path");

let thePath = path.format({
	dir:__dirname + path.sep + ".." + path.sep + "src",
	base:"buildId.js"
});

let buildFile = fs.readFileSync(thePath) + "";
let ver = parseInt(buildFile.match(/\d+/g)[0]);
ver++;
fs.writeFileSync(thePath,"export default " + ver++ + ";")
