const defaultConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /(node_modules)/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat'
    }
  }
};

const mainConfig = Object.assign({}, defaultConfig, {
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    popup: './src/popup.jsx',
    screen: './src/screen.jsx'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
});

const utilsConfig = Object.assign({}, defaultConfig, {
  target: 'node',
  entry: {
    utils: './src/common/character-utils.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist_utils',
    libraryTarget: 'commonjs'
  }
});

module.exports = [mainConfig, utilsConfig];
