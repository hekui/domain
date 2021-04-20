import Vue from 'vue'
import App from './views/app'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
// import titleMixin from './util/title'
import * as filters from './util/filters'
// import api from './api'

// mixin for handling title
// Vue.mixin(titleMixin)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 定义全局方法
// Vue.prototype.$api = api

export function createApp(context) {
  // 创建 router 和 store 实例
  const store = createStore()
  const router = createRouter()

  // 同步路由状态(route state)到 store
  sync(store, router)

  // Vuex 状态恢复
  // if (!context.ssr && window.__INITIAL_STATE__) {
  //   // 我们使用服务端注入的数据来初始化 store 状态
  //   store.replaceState(window.__INITIAL_STATE__)
  // }

  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    router,
    store,
    // util: new Util(),
    render: h => h(App)
  })

  // 暴露 app, router 和 store。
  return { app, router, store }
}
