const path = require('path');
const webpack = require('webpack');
console.log(path.resolve(__dirname, "public"));
module.exports = {
	devtool: 'inline-source-map',
	entry: [
		'./src/index.tsx'
	],
	output: {
	  filename: 'bundle.js',
	  path: path.resolve(__dirname, "./public"),
	},
	resolve: {
	  // Add `.ts` and `.tsx` as a resolvable extension.
	  extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
	},
	module: {
	  rules: [{
			test: /\.css$/, 
			loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
		},
			{
				test: /\.tsx?$/,
				 loader: ['ts-loader']
			}]
	},
	devServer: {
		publicPath: "/",
		contentBase: "./public",
		hot: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	]
};