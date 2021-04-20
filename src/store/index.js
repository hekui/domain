import Vue from 'vue'
import Vuex from 'vuex'

// import account from './modules/account'
import domain from './modules/domain'
import file from './modules/file'

Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      activeType: null,
      showCityChange: false,
      curCity: {},
      listCity: [],
      wLink: [],
      showToTop: true,
      regionList: [],
      showLoginDialog: false,
    },
    mutations: {
      INDEX_SET(state, data) {
        state[data.target] = data.data
      }
    },
    actions: {},
    modules: {
      domain,
      file,
    }
  })
}
