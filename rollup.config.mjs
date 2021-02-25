import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

// import { version } from "./package.json";
import buildId from "./src/buildId.js";

const fs = require("fs");
const path = require("path");

let thePath = path.format({
	dir:__dirname + path.sep + "src",
	base:"BuildProps.js"
});

let buildFile = fs.readFileSync(thePath) + "";

let rollupVersion = require("./package.json")["devDependencies"]["rollup"].replace("^", "")

let buildProps = {
	id: buildId,
	date: String(new Date(Date.now())),
	packager: "Rollup " + rollupVersion
}

fs.writeFileSync(thePath,"export default " + JSON.stringify(buildProps) + ";")


export default {
	input: "./src/ModernDeckInit.js",
	preserveModules: false,
	output: {
		file: "./common/resources/moderndeck.js",
		format: "es",
		sourcemap: true,
		banner: `/**\n* ModernDeck\n* @license MIT\n* https://github.com/dangeredwolf/ModernDeck\n**/`,
		hoistTransitiveImports: true
	},
	plugins: [
		json(),
		resolve(),
		babel({configFile:"./build/babel.json"}),
		terser({mangle:false})
	]
};
