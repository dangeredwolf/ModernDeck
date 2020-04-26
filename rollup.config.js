import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import babel from "rollup-plugin-babel";

export default {
	input: "./src/MTDinject.js",
	preserveModules: false,
	output: {
		file: "./common/sources/moderndeck.js",
		format: "es",
		sourcemap: true,
		banner: `/**\n* ModernDeck ${require("./package.json").version}\n* @license MIT\n* https://github.com/dangeredwolf/ModernDeck\n**/`,
		hoistTransitiveImports: true
	},
	plugins: [
		resolve(),
		json(),
		babel({configFile:"./babel.modern.config.json"})
	]
};
