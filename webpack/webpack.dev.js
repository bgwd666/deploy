const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const webpack = require('webpack');
module.exports = merge(baseConfig,{
  mode: 'development',
  output: {
    filename: '[name].js',
  },
  // 开启devServer
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    // publicPath: '/static/',
    publicPath: '/',
    // open: true, // 自动打开浏览器
    historyApiFallback: true,
    // historyApiFallback: {
    //   rewrites: [{
		// 		from: /\*/,
		// 		to: '/vue/index.html'
		// 	}]
    // }, //然后随便访问个不存在的路径都会重定向
    proxy: {
      '/apis': {
        target: 'http://api.budejie.com',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      }
    }

  },
   // 开启调试
  devtool: 'cheap-module-eval-source-map ', 
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['vue-style-loader', 'css-loader',"sass-loader"]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});