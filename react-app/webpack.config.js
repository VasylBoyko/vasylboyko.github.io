var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeExternals = require('webpack-node-externals');


var isProduction = process.env.NODE_ENV === 'production';
var productionPluginDefine = isProduction ? [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    })
] : [];
var clientLoaders = isProduction ? productionPluginDefine.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        sourceMap: false
    })
]) : [];



var BUILD_DIR = path.resolve(__dirname, 'dist');

var SERVER_DIR = path.resolve(__dirname, 'src/server');
var CLIENT_DIR = path.resolve(__dirname, 'src/client');

var server = {
    entry: SERVER_DIR + '/server.js',
    output: {
        path: BUILD_DIR,
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        publicPath: '/'
    },
    target: 'node',
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false
    },
    externals: nodeExternals(),
    plugins: productionPluginDefine,
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader'
        }]
    }
}


var client = {
    entry: [
		CLIENT_DIR + '/js/browser.js', 
		CLIENT_DIR + '/css/app.scss'
	],
    output: {
        path: BUILD_DIR + '/assets',
        filename: 'bundle.js'
    },
    plugins: clientLoaders.concat([
        new ExtractTextPlugin('index.css', {
            allChunks: true
        })
    ]),
	devtool: "source-map",
    module: {
        rules: [
			{
                test: /\.js?/,
                exclude: /node_modules/,
                include: CLIENT_DIR,
                use: [
					'babel-loader',
					'eslint-loader'
				]
            },
            {
                test: /\.scss$/,
				exclude: /node_modules/,
                include: CLIENT_DIR,
				use: [{
		            loader: "style-loader"
		        }, {
		            loader: "css-loader", options: {
		                sourceMap: true
		            }
		        }, {
		            loader: "sass-loader", options: {
		                sourceMap: true
		            }
		        }]
            }
        ]
    }
};



module.exports = [client, server];
