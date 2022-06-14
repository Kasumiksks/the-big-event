import axios from 'axios'
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
    }
  }

}
