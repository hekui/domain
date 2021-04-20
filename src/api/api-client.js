import axios from 'axios'
import { Message } from 'element-ui'
const apiContext = '/api'
const methods = ['post', 'get']

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// application/x-www-form-urlencoded
// application/json

class Api {
  constructor(context = '') {
    methods.forEach(method => {
      this[method] = (path, data = {}, headers = {
        'Content-Type': 'application/json'
      }) => new Promise((resolve, reject) => {
        // axios.defaults.headers.common['userToken'] = token
        // axios.defaults.headers.common['token'] = token

        const url = apiContext + context + path
        console.log('url', url)
        axios({
          method: method,
          url: url,
          data: data,
          timeout: 1000 * 20, // 20s
          headers,
        }).then(res => {
          console.log(`[${method}]${url}`, res)
          if (res.status === 200) {
            // if (res.data && res.data.status === 0) {
            if (res.data.code === 0) {
              resolve(res.data)
            } else {
              // Message({type: 'error', message: res.data.msg})
              reject(res.data)
            }
          }
        }).catch(error => {
          console.log('error', error.message)
          // console.log('error.request', error.request)
          // if (error.response) {
          //   Message({type: 'error', message: error.response.msg})
          // } else {
          //   Message({type: 'error', message: error.message})
          // }
          if (error.message === 'Network Error') {
            console.log('Network Error')
            location.reload()
          } else {
            if (error.message) {
              Message({ type: 'error', message: error.message })
            }
          }
          reject()
        })
      })
    })
  }
}

// export const accountApi = new Api('/account')

// export default new Api()

export function createAPI(context = '') {
  return new Api(context)
}
