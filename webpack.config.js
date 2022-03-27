const path = require("path");
const webpack = require("webpack");

const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// let commitHash = require('child_process')
// 				.execSync('git rev-parse --short HEAD')
// 				.toString()
// 				.trim();

module.exports = {
	entry: {
        "moderndeck": "./src/ModernDeckInit.js",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "common/resources"),
		// publicPath: "//dangeredwolf.com/",
		publicPath: '/',
		environment: {
			arrowFunction: true
		},
		assetModuleFilename: "common/resources/[name].[ext][query]"
	},
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".png", ".jpg", ".mp3", ".mp4", ".aac", ".webp"],
    },
	plugins: [
		// new webpack.DefinePlugin({
		// 	__BUILD_ID__: JSON.stringify(buildId)
		// }),
		new webpack.BannerPlugin({
			banner:
`ModernDeck ${require("./package.json").version}, built ${new Date().toISOString()}

(c) 2014-${new Date().toISOString().slice(0,4)} dangered wolf, released under MIT license.

Made with <3
`,
		})
	],
	mode: "production",
	module: {
		rules: [
		{
			test: /\.(png|svg|jpg|jpeg|gif|webp|mp3|woff|woff2|eot|ttf|otf|aac)$/i,
			type: "asset/resource"
		},
		{
			test: /\.(csv|tsv)$/i,
			use: ["csv-loader"],
		},
		{
			test: /\.m?js$/,
			parser: {
				amd: false, // disable AMD
				commonjs: false, // disable CommonJS
				system: false, // disable SystemJS
				requireInclude: false, // disable require.include
				requireEnsure: false, // disable require.ensure
				requireContext: false, // disable require.context
				browserify: false, // disable special handling of Browserify bundles
				requireJs: false, // disable requirejs.*
				node: false, // disable __dirname, __filename, module, require.extensions, require.main, etc.
				commonjsMagicComments: false // disable magic comments support for CommonJS
			},
			use: {
				loader: "babel-loader",
				options: {
					presets: [
						["@babel/preset-env", { targets: "ie 11" }]
					],
					plugins: [
						"@babel/plugin-proposal-optional-chaining",
						"@babel/plugin-proposal-export-default-from",
						"@babel/plugin-proposal-class-properties",
						"@babel/plugin-transform-exponentiation-operator"
					]
				}
			}
		}
	]},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false
				}
			})
		],
	},
}