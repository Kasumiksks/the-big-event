import request from '@/utils/request'

// 获取菜单数据
export function loadMenuList () {
  return request({
    url: '/my/menus',
    method: 'get'
  })
}

// 实现登录
export function toLogin (loginForm) {
  return request({
    url: '/api/login',
    method: 'post',
    data: loginForm
  })
}
