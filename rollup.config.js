import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
	input: "./src/ModernDeckInit.js",
	preserveModules: false,
	output: {
		file: "./common/resources/moderndeck.js",
		format: "es",
		sourcemap: true,
		banner: `/**\n* ModernDeck ${require("./package.json").version}\n* @license MIT\n* https://github.com/dangeredwolf/ModernDeck\n**/`,
		hoistTransitiveImports: true
	},
	plugins: [
		resolve(),
		json(),
		babel({configFile:"./build/babel.json"}),
		// terser()
	]
};
