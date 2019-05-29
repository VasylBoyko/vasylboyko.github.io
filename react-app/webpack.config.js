var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
const env = /*process.env.NODE_ENV || */ "development" ;


let Config = {};

if (env) {
  Config = require(`./config/${env}.json`);
}

console.log(Config)
var isProduction = env === 'production';
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
            test: /\.jsx?$/,
            loader: 'babel-loader'
        }]
    },
    resolve: {
        extensions: ['.jsx', '.js']
    },
};




var client = {
    devServer: {
        contentBase: 'dist',
        //devtool: 'eval',
        //hot: true,
        inline: true,
        port: 8080,
        historyApiFallback: true
    },
    entry: [
        CLIENT_DIR + '/js/browser.jsx',
        CLIENT_DIR + '/css/app.scss'
    ],
    output: {
        path: BUILD_DIR + '/assets',
        filename: 'bundle.js'
    },
    plugins: clientLoaders.concat([
        new ExtractTextPlugin({
            filename: 'index.css',
            allChunks: true
        }),new webpack.DefinePlugin({
            "CONFIG": Config
        })
    ]),
    devtool: "source-map",
    resolve: {
        extensions: ['.jsx', '.js']
    },
    module: {
        rules: [{
                test: /\.jsx?/,
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }]
                })
                /*use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }]*/
            }
        ]
    },
    externals: {
        "Config": JSON.stringify(Config)
    }
};

//module.exports = [client, server];
module.exports = client;