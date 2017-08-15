const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

function getCdnPath(env) {
  if (env === 'production') return 'http://production-url.com.br/';

  if (env === 'homolog') return 'http://homolog-url.com.br/';

  return '/';
}

const extractSass = new ExtractTextPlugin({
  filename: "[name].css",
  disable: false
});

module.exports = {
  entry: './src/js/index.js',

  output: {
    filename: `bundle.js`,
    path: path.resolve(__dirname, 'dist/')
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader"
            }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   use: [
      //     'file-loader'
      //   ]
      // }
    ]
  },

  resolve: {
    modules: [
      'node_modules'
    ]
  },

  plugins: [
    extractSass,

    new HtmlWebpackPlugin({
      inject: false,
      title: 'The application title goes here',
      template: './src/index.ejs',
      baseHref: getCdnPath(process.env.NODE_ENV),
      minify: {
        collapseWhitespace: true
      }
    }),

    new CopyWebpackPlugin([
      {from: './src/img/', to: 'img'},
      {from: './src/fonts/', to: 'fonts'}
    ])
  ],

  devServer: {
    contentBase: './dist'
  }
};
