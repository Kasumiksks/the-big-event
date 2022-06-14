import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 控制权限--路由守卫
import '@/permission'

// 引入全局样式
import './assets/global.less'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入axios
import axios from 'axios'
// 设置axios的根路径
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
// 在发送请求之前做些什么
// 使用config请求对象设置统一的token
// 判断, 只需要给需要权限的接口添加
  if (store.state.user.token && config.url.startsWith('/my')) {
    config.headers.Authorization = store.state.user.token
  }
  return config
}, function (error) {
  return Promise.reject(error) // 对请求错误做些什么
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
// 在发送响应之前做些什么
  return response
}, function (error) {
  // 判断是否为401错误, 是则返回登录页
  if (error.response.status === 401) {
    router.push('/login')
  }
  return Promise.reject(error) // 对响应错误做些什么
})

Vue.config.productionTip = false
// 将axios挂载到Vue原型上
Vue.prototype.$http = axios
// 在Vue上注册elementUI
Vue.use(ElementUI)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
