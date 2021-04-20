import api from '@/api'

export default {
  state: {
    indexRecommendList: [], // 首页推荐列表
    domainList: {
      list: [],
      page: {}
    },
    // 我的
    myFavList: {
      list: [],
      page: {}
    },
  },
  mutations: {
    DOMAIN_SET(state, payload) {
      state[payload.target] = payload.data
    },
  },
  actions: {
    fetchIndexRecommendList(ctx, params) {
      return api.post('/domain/indexRecommendList', {}).then(res => {
        ctx.commit('DOMAIN_SET', {
          target: 'indexRecommendList',
          data: res.data
        })
        return res
      }).catch(e => Promise.reject(e))
    },
    fetchDomainList(ctx, params) {
      return api.post('/domain/list', params).then(res => {
        ctx.commit('DOMAIN_SET', {
          target: 'domainList',
          data: res.data
        })
        return res
      }).catch(e => Promise.reject(e))
    },
    feedbackDomainIsReged(ctx, params) {
      return api.post('/domain/is_reged', params).then(res => {
        return res
      }).catch(e => Promise.reject(e))
    },
    // 收藏
    addMyFavList(ctx, params) {
      return api.post('/domain/myfav_add', params).then(res => {
        return res
      }).catch(e => Promise.reject(e))
    },
    cancelMyFavList(ctx, params) {
      return api.post('/domain/myfav_delete', params).then(res => {
        return res
      }).catch(e => Promise.reject(e))
    },
    fetchMyFavList(ctx, params) {
      return api.post('/domain/myfav_list', params).then(res => {
        ctx.commit('DOMAIN_SET', {
          target: 'myFavList',
          data: res.data
        })
        return res
      }).catch(e => Promise.reject(e))
    },
  }
}
