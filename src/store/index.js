import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
// 1. 导入包, 实现持久化存储
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // 2. 配置为 vuex 的插件
  plugins: [createPersistedState()],
  modules: {
    user
  }
})
