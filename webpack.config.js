const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;


const fs = require("fs");

let thePath = path.format({
	dir:__dirname + path.sep + "src",
	base:"BuildProps.js"
});

let buildFile = fs.readFileSync(thePath) + "";

buildFile = buildFile.substr(15).replace(";", "");


let oldBuildProps = JSON.parse(buildFile);

let webpackVersion = require("./package.json")["devDependencies"]["webpack"].replace("^", "")

let buildProps = {
	id: oldBuildProps.id + 1,
	date: String(new Date(Date.now())),
	packager: "Webpack " + webpackVersion
}

fs.writeFileSync(thePath,"export default " + JSON.stringify(buildProps) + ";")


module.exports = {
	entry: [
		"./src/ModernDeckInit.js"
	],
	output: {
		filename: "resources/moderndeck.js",
		path: path.resolve(__dirname, "common"),
		// publicPath: "/",
		environment: {
			arrowFunction: true
		}
	},
	plugins: [
	],
	mode: "development",
	devtool: "source-map",
	module: {
		rules: [
		// {
		// 	test: /\.css$/i,
		// 	use: [
		// 		MiniCssExtractPlugin.loader,
		// 		"css-loader"
		// 	],
		//
		// },
		{
			test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
			type: "asset/resource",
		},
		{
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: "asset/resource",
		},
		{
			test: /\.(csv|tsv)$/i,
			use: ["csv-loader"],
		},
		{
			test: /\.m?js$/,
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
	},
  externals: [
    (() => {
    	let ignoreRequire = [
			"electron",
			"electron-store",
			"fs"
		];
		return function (context, request, callback) {
			if (ignoreRequire.indexOf(request) >= 0) {
				return callback(null, ` typeof require !== "undefined" ? require("${request}") : undefined`);
			}
			return callback();
		};
	})()
  ]
}
