const isDev = process.env.NODE_ENV !== 'production'

const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const templateContent = `
<!DOCTYPE html>
<html>
    <head>        
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
        <title>DG-HELPER</title>
    </head>
    <body>
        <div id="app">
            <h1>DG-HELPER</h1>
            <h3>window._index</h3>
            <h3>window._hash</h3>
        </div>
    </body>
</html>
`

const plugins = isDev ? [
    new HtmlWebpackPlugin({ templateContent }) // 测试环境下使用 html 热更新服务调试
] : [
    new CleanWebpackPlugin() // 正式打包
]

module.exports = {
    entry: {
        index: "./src/index.ts",
        hash: "./src/hash.ts",
    },
    output: {      
        filename: '[name].js',
        path: path.resolve(__dirname,'../dist'),
        library: isDev ? '_[name]' : undefined,
        libraryTarget: isDev ? 'umd' : 'commonjs' // var amd umd commonjs
    },
    resolve: {
        extensions: ['.ts','.tsx','.js']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tex?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
        contentBase: './dist',
        stats: 'errors-only',
        compress: false,
        host: 'localhost',
        port: 8090
    },
    plugins
}