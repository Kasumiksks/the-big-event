import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import './assets/global.less'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入axios
import axios from 'axios'
// 设置axios的根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'

Vue.config.productionTip = false
// 将axios挂载到Vue原型上
Vue.prototype.$http = axios
// 在Vue上注册elementUI
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
