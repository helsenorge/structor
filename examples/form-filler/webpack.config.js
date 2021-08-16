const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const isDevBuild = env && env.development;

    return {
        entry: './src/index.jsx',
        devServer: {
            port: 3000,
            historyApiFallback: true,
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(s*)css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
                                // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
                                importLoaders: 1,
                                // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
                                modules: { auto: true },
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg|gif)$/,
                    loader: 'file-loader',
                },
            ],
        },
        node: {
            module: 'empty',
            net: 'empty',
            fs: 'empty',
        },
        resolve: {
            extensions: ['.jsx', '.js'],
        },

        output: {
            filename: 'bundle.js',
            path: isDevBuild ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'wwwroot/dist'),
            publicPath: isDevBuild ? '/' : 'dist/',
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'Skjemautfyller-eksempel',
            }),
        ],
    };
};
