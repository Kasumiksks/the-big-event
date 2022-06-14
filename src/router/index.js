import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/Login/Login.vue')
const Reg = () => import('@/views/Reg/Reg.vue')
const Main = () => import('@/views/Main/Main.vue')
const Home = () => import('@/views/Menus/Home/Home.vue')
const UserInfo = () => import('@/views/Menus/Home/Home.vue')
const UserAvatar = () => import('@/views/Menus/User/UserAvatar.vue')
const UserPwd = () => import('@/views/Menus/User/UserPwd.vue')
const ArtCate = () => import('@/views/Menus/Article/ArtCate.vue')
const ArtList = () => import('@/views/Menus/Article/ArtList.vue')
const NotFound = () => import('@/views/404/404.vue')

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
      },
      {
        path: 'art-list',
        name: 'artList',
        component: ArtList
      }

    ]
  },
  {
    path: '/404',
    name: 'notfound',
    component: NotFound
  },
  { // 404重定向
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes
})

export default router
