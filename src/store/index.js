import Vue from 'vue'
import Vuex from 'vuex'
// 1. 导入包, 实现持久化存储
import createPersistedState from 'vuex-persistedstate'
// 导入axios
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  // 2. 配置为 vuex 的插件
  plugins: [createPersistedState()],
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
  },
  modules: {
  }
})
