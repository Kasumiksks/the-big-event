import axios from 'axios'
import store from '@/store'

// 创建一个axios实例
const service = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
// 处理正常的请求
  const token = store.state.user.token
  // 使用config请求对象统一设置的token
  if (token && config.url.startsWith('/my')) {
    config.headers.Authorization = store.state.user.token
  }
  return config
}, function (error) {
  return Promise.reject(error) // 对请求错误做些什么
})
// 暴露axios实例
export default service
