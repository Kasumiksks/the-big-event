import { Message } from 'element-ui'
import axios from 'axios'
import { toLogin } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {}
  },
  getters: {
  },
  mutations: {
    // 更新token
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 更新用户信息
    updateUserInfo (state, newInfo) {
      state.userInfo = newInfo
    }
  },
  actions: {
    async getUserInfo (context) {
      const { data: res } = await axios({
        method: 'get',
        url: '/my/userinfo'
      })
      console.log(res)
      if (res.code === 0) {
        context.commit('updateUserInfo', res.data)
      }
    },
    // 定义登录的函数,发送请求,获取token
    async userLogin (context, data) {
      const { data: res } = await toLogin(data)
      // 登录失败,返回
      if (res.code !== 0) {
        return Message.error(res.message)
      }
      // 登录成功
      Message.success(res.message)
      // 把token传给 vuex 里的 mutations 中
      context.commit('updateToken', res.token)
    }
  }

}
