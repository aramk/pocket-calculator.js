var path = require('path');

function WebpackConfig(options) {
  return {
    cache: true,
    entry: {
      main: [
        './src/index.js'
      ],
      test: [
        './test/index.js'
      ]
    },
    output: {
      path: path.join(__dirname, '/bundled'),
      filename: '[name].bundle.js',
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          parser: {
            amd: false
          }
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          include: [path.resolve(__dirname, '/src')],
          loader: 'eslint-loader'
        },
        {
          test: /\.js$/,
          include: [
            /\/src\//,
            /\/test\//
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'es2016', 'es2017']
            }
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
      ]
    },
    target: 'web',
    resolve: {
      alias: {
        'handlebars' : 'handlebars/dist/handlebars.js'
      }
    }
  };
}

module.exports = WebpackConfig;
