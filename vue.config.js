const path = require('path')
module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  publicPath: './',
  devServer: {
    port: 3001
  },
  pwa: {
    iconPaths: {
      favicon32: './icon.ico',
      favicon16: './icon.ico',
      appleTouchIcon: './icon.ico',
      maskIcon: './icon.ico',
      msTileImage: './icon.ico'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('md1')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      })
      .end()

    config.module
      .rule('md0')
      .test(/\.md$/)
      .use('vue-loader')
      .loader(path.resolve(__dirname, './md-loader/index.js'))
      .end()
  }
}
