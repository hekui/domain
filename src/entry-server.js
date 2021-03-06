import { createApp } from './app'

export default context => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    // console.log('in entry-server Promise')
    // const s = isDev && Date.now()
    const { app, router, store } = createApp({
      ...context,
      ...{
        ssr: true
      }
    })

    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }
    // 设置session
    // store.commit('ACCOUNT_SET', {
    //   target: 'userInfo',
    //   data: session.userInfo || {}
    // })
    // await store.dispatch('fetchCategoryList')

    router.push(url)
    router.onError((e) => {
      console.log('router.onError')
    })
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // console.log('matchedComponents length', matchedComponents)
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        store,
        router,
        route: router.currentRoute,
      }))).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state
        // console.log('store.state', store.state)

        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
