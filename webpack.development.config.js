const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const config = require('./config');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css",
    disable: true,
    allChunks: true
})

module.exports = {

    devtool: 'source-map',

    entry: {
        app: [
            'babel-polyfill',
            './src/client/index',
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
        ],
        // 一些主要依赖打包在一起
        vendors: [
            'react',
            'react-dom',
            'react-router',
            'redux',
            'react-redux',
            'react-document-meta',
            'apollo-client',
            'graphql',
            'graphql-tag'
        ],
        vendors2: [
            'react-css-modules',
            'lodash'
        ]
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: config.public_path + "/"
    },

    resolveLoader: {
        // 解析 loader 时，用到扩展名(extensions)/后缀(suffixes)
        // 从 webpack 2 开始，我们强烈建议使用全名，例如 example-loader，以尽可能清晰
        // 然而，如果你确实想省略 -loader，也就是说只使用 example，则可以使用此选项来实现
        moduleExtensions: ["-loader"]
    },

    module: {
        rules: [

            // js 文件解析
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    plugins: [
                        // http://technologyadvice.github.io/es7-decorators-babel6/
                        'transform-decorators-legacy'
                    ],
                    presets: ['es2015', 'react', 'stage-0']
                }
            },

            // scss 文件解析
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
                // 运用 extract-text-webpack-plugin 把 css 文件提取出来
                use: extractSass.extract({
                    use: [{
                            loader: `css`,
                            options: {
                                modules: true,
                                localIdentName: config.class_scoped_name,
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: `sass`,
                        }
                    ],
                    fallback: "style"
                })
            },

            // 支持
            {
                test: /\.css$/,
                use: extractSass.extract({
                    use: [{
                        loader: `css`
                    }],
                    fallback: "style"
                })
            },

            // 小于8K的图片，转 base64
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=8192'
            },

            // 小于8K的字体，转 base64
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file?limit=8192"
            }

        ]
    },

    plugins: [

        // require('precss'),
        // require('autoprefixer'),

        // 定义环境变量
        new webpack.DefinePlugin({
            // 是否是生产环境
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
            // 是否是 Node
            '__NODE__': JSON.stringify(process.env.__NODE__),
            // 是否是开发环境
            '__DEV__': JSON.stringify(process.env.NODE_ENV == 'development')
        }),

        extractSass,

        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendors', 'vendors2'],
            minChunks: 2
        }),

        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'common',
        //    filename: 'common.bundle.js'
        //}),

        new HtmlwebpackPlugin({
            filename: path.resolve(__dirname, 'dist/index.ejs'),
            template: 'src/view/index.html',
            head: config.head,
            material_ui_head: config.material_ui_head,
            font_awesome_head: config.font_awesome_head,
            meta: '<%- meta %>',
            htmlDom: '<%- html %>',
            reduxState: '<%- reduxState %>'
        }),

        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoEmitOnErrorsPlugin()

        // new ServiceWorkerWebpackPlugin({
        //   entry: path.join(__dirname, 'client/sw.js'),
        // })

    ]
}
