import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: './src/MTDinject.js',
	preserveModules: false,
	output: {
		file: './ModernDeck/sources/moderndeck.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
		sourcemap: true,
		banner: `/**\n* ModernDeck ${require('./package.json').version}\n* @license MIT\n* https://github.com/dangeredwolf/ModernDeck\n**/`,
		hoistTransitiveImports: true
	},
	plugins: [
		resolve(),
		json(),
		babel({configFile:"./babel.modern.config.json"})
	]
};
