import Vue from 'vue'
import Vuex from 'vuex'
// 1. 导入包, 实现持久化存储
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // 2. 配置为 vuex 的插件
  plugins: [createPersistedState()],
  state: {
    token: ''
  },
  getters: {
  },
  mutations: {
    updateToken (state, newToken) {
      state.token = newToken
    }
  },
  actions: {
  },
  modules: {
  }
})
