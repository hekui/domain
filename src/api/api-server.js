import axios from 'axios'
var { localhost } = require('./../../server/config')
const apiContext = '/api'
const methods = ['get', 'post']

const parseCookie = cookies => {
  let cookie = ''
  Object.keys(cookies).forEach(item => {
    cookie += item + '=' + cookies[item] + '; '
  })
  return cookie
}

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// application/x-www-form-urlencoded
// application/json

class Api {
  constructor(context) {
    methods.forEach(method => {
      this[method] = (path, data = {}, cookies = {}) => new Promise((resolve, reject) => {
        // axios.defaults.headers.common['userToken'] = token
        // axios.defaults.headers.common['token'] = token
        const cookie = parseCookie(cookies)
        const url = localhost + apiContext + context + path
        // console.log('url', url)
        // console.log('-------------------------------------')
        // console.log('cookie:', cookie)
        axios({
          method: method,
          url: url,
          data: data,
          timeout: 1000 * 20, // 20s
          headers: {
            // 'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            cookie
          },
        }).then(res => {
          console.log(`[${method}]${url} => ${JSON.stringify(res.data)}`)
          if (res.status === 200) {
            // if (res.data && res.data.status === 0) {
            if (res.data.code === 0) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          }
        }).catch(error => {
          console.log('error.response:', error.message)
          // console.log('error.request', error.request)
          reject()
        })
      })
    })
  }
}

export function createAPI(context = '') {
  return new Api(context)
}
