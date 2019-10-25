const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// Grabbed in .babelrc.js to switch on transpiling modules.
// We want webpack to handle this.
process.env.BABEL_ENV = process.env.BABEL_ENV || 'module';

module.exports = (env, argv) => ({
	entry: {
    'react-draggable.min': './index-src.js',
  },
	output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    devtoolModuleFilenameTemplate: '../[resource-path]',
    library: 'ReactDraggable',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'build', 'web'),
	},
  devServer: {
    contentBase: '.',
    hot: true,
    open: true,
    openPage: '/example/index.html',
    writeToDisk: true,
  },
  devtool: 'source-map',
  externals: {
    'react': {
      'commonjs': 'react',
      'commonjs2': 'react',
      'amd': 'react',
      // React dep should be available as window.React, not window.react
      'root': 'React'
    },
    'react-dom': {
      'commonjs': 'react-dom',
      'commonjs2': 'react-dom',
      'amd': 'react-dom',
      'root': 'ReactDOM'
    }
  },
	module: {
		rules: [
			{
        test: /\.(?:js|es).?$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
        exclude: /(node_modules)/
      }
		]
	},
  plugins: [
    new webpack.EnvironmentPlugin({
      // Default values
      DRAGGABLE_DEBUG: argv.mode === 'development',
      NODE_ENV: ['development', 'production'].includes(argv.mode) ? 
        argv.mode : 
        (process.env.NODE_ENV || 'production'),
    }),
    // Scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  optimization: {
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
      terserOptions: {}
    })],
  }
});
