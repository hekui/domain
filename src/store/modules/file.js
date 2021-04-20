import api from '@/api'

export default {
  state: {
    test: [],
  },
  mutations: {
    FILE_SET(state, payload) {
      state[payload.target] = payload.data
    },
  },
  actions: {
    uploadFile(ctx, params) {
      return api.post('/file/upload', params, {
        'Content-Type': 'multipart/form-data'
      }).then(res => {
        return res
      }).catch(e => Promise.reject(e))
    },
  }
}
