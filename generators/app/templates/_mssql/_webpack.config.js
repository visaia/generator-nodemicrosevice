let webpack = require('webpack');
let fs = require('fs');
let path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let externals = _externals();
module.exports = {
    entry: [
        './bin/www.js'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    // devtool: '#source-map',
    target: 'node',
    externals: externals,
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                plugins: [
                    'transform-runtime',
                    "transform-object-rest-spread",
                ],
                presets: [
                    ["es2015", {"modules": false}],
                    ['stage-0'],
                    ["env"],
                ],
            },
        }]

    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new UglifyJSPlugin(),
    ],
    resolve: {
        extensions: [' ', '.ts', ".js", ".json"]
    }
}
function _externals() {
    let manifest = require('./package.json');
    let dependencies = manifest.dependencies;
    let externals = {};
    for (let p in dependencies) {
        externals[p] = 'commonjs ' + p;
    }
    return externals;
}