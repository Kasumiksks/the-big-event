import router from './router'
import store from './store'

// 添加白名单
const whiteList = ['/login', '/reg']
// 添加路由守卫
// beforeEach() 路由跳转之前一定会经过这里
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  if (token) { // 如果有token
    if (to.path === '/login') {
      console.log('您已登录')
    } else {
      next() // 放行
    }
  } else { // 无token
    // 判断是否需要token (登录注册页面不需要)
    if (whiteList.includes(to.path)) {
      next()
    } else {
      console.log('跳转到登录页')
      next('/login')
    }
  }
})
export default whiteList
