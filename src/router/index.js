import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/Login.vue'
import Reg from '@/views/Reg/Reg.vue'
import Main from '@/views/Main/Main.vue'
import Home from '@/views/Menus/Home/Home.vue'
import UserInfo from '@/views/Menus/User/UserInfo.vue'
import UserAvatar from '@/views/Menus/User/UserAvatar.vue'
import UserPwd from '@/views/Menus/User/UserPwd.vue'
import ArtCate from '@/views/Menus/Article/ArtCate.vue'

Vue.use(VueRouter)

// 防止路由报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reg',
    name: 'reg',
    component: Reg
  },
  {
    path: '/',
    name: 'main',
    component: Main,
    // 重定向
    redirect: '/home',
    // 配置子路由
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'user-info',
        name: 'userinfo',
        component: UserInfo
      },
      {
        path: 'user-Avatar',
        name: 'userAvatar',
        component: UserAvatar
      },
      {
        path: 'user-pwd',
        name: 'userPwd',
        component: UserPwd
      },
      {
        path: 'art-cate',
        name: 'artCate',
        component: ArtCate
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
