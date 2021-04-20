import Vue from 'vue'
// import 'babel-polyfill'
// import 'es6-promise/auto'
import { createApp } from './app'
import ProgressBar from './components/ProgressBar.vue'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// 监听浏览器的后退/前进
window.isBack = false
window.addEventListener('pushstate', function() {
  window.isBack = true
})

const { app, router, store } = createApp({
  ssr: false,
})

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    // console.log('window.isBack', window.isBack)
    // console.log('router', router)
    // console.log('history.length: ' + history.length);
    // console.log('state: ' + JSON.stringify(history.state));
    // console.log('to', to)
    // console.log('from', from)
    if (window.isBack) {
      window.isBack = false
      next()
    } else {
      window.isBack = false
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)
      let diffed = false
      const activated = matched.filter((c, i) => {
        return diffed || (diffed = (prevMatched[i] !== c))
      })

      if (!activated.length) {
        return next()
      }
      // 这里如果有加载指示器 (loading indicator)，就触发
      bar.start()
      Promise.all(activated.map(c => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to })
        }
      })).then(() => {
        // 停止加载指示器(loading indicator)
        bar.finish()
        next()
      }).catch(next)
    }
  })

  // actually mount to DOM
  app.$mount('#app')
})

// service worker
if (location.protocol === 'https:' && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js')
}
