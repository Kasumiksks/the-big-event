const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 由于webpack打包工具会默认将以为项目会部署在根路径下 , 请求资源都是以根路径为主 , 添加这行代码是为了 , 请求js或css等资源不被404
  // publicPath: process.env.NODE_ENV === 'production' ? '/仓库地址/' : './'
  publicPath: process.env.NODE_ENV === 'production' ? '/big-event-web/' : './'
  // 需要添加.spa让pages对单页面支持
})
