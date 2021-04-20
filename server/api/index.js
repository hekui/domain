const axios = require('axios')
const log = require('./../log')('java')
const methods = ['post']
const config = require('./../config')

class Api {
  constructor() {
    methods.forEach(method => {
      this[method] = (baseUrl = '', req, data = {}) => new Promise((resolve, reject) => {
        log.trace('data', data)
        const url = baseUrl + req.url
        log.trace('url', url)
        log.trace('req.session', req.session)
        const options = {
          method: method,
          url: url,
          withCredentials: false,
          timeout: config.timeout,
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'application/json'
            'Content-Type': req.headers['content-type'] || 'application/json'
          }
        }
        // data 数据处理
        // let rquestData = querystring.stringify(this.getData(req, data))
        const rquestData = this.getData(req, data)
        options.data = rquestData
        log.trace('options', options)
        axios(options).then(res => {
          if (res.status === 200) {
            const result = res.data
            if (result.code === 0) {
              // 数据解密
              const decryptResult = Object.assign(result, res.data.data ? { data: this.decryptData(result.data) } : {})
              log.trace(`${url} - request data: - ${JSON.stringify(rquestData)} - data: ${JSON.stringify(data)} - response data: - ${JSON.stringify(decryptResult)}`)
              resolve(decryptResult)
            } else {
              log.error(`${url} - request data: - ${JSON.stringify(rquestData)} - data: ${JSON.stringify(data)} - response data: - ${JSON.stringify(result)}`)
              reject(result)
            }
          }
        }).catch(error => {
          // console.log('err', error)
          log.error(`node server error - axios catch error - request ${url} - ${error.message} - ${error.stack}`)
          reject(error)
        })
      })
    })
  }

  /**
   * 处理参数，拼接公共参数及业务参数加密
  */
  getData(req, data) {
    return Object.assign({}, this.getCommonParams(req), {
      data: this.encryptData(data)
    })
  }

  /**
   * 公共参数
   */
  getCommonParams(req) {
    return {
      repositoryId: 16, // rap2模拟时用
      cityId: req.headers.cityid || 51010000,
      // deviceNo: req.headers.di ||'',
      deviceNo: req.sessionID, // 调用的接口设备号。请求设备号必须是唯一标识（可以为设备IMIE号）
      ticketId: req.session.ticketId || '',
      encryMode: 2, // 加密方式
      version: '1.0.0', // 接口版本
      userver: 15, // 创E达登录：15
      utype: 4, // 创E达登录：4
      deviceType: 2, // 设备类型
      ipAddress: this.getClientIP(req), // 请求调用方IP地址
      timestamp: Date.now(), // 当前请求时间戳
    }
  }

  /**
   * 获取客户端ip地址
   */
  getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      req.connection.socket.remoteAddress
  }

  /**
   *  加密数据
   */
  encryptData(data) {
    return Buffer.from(JSON.stringify(data)).toString('base64')
  }

  /**
   * 解密数据
   * @param {Object} data
   */
  decryptData(data) {
    try {
      const result = JSON.parse(Buffer.from(data, 'base64').toString())
      return result
    } catch (error) {
      log.fatal(`decryptData error - input data - ${JSON.stringify(data)} - ${error}`)
      return data
    }
  }

  // 输出多个服务端方法
  // fetch(req, data){
  //   return this.post(config['javaHost'], req, data)
  // }
  fetchJava(req, data) {
    return this.post(config.javaHost, req, data)
  }

  fetchPassport(req, data) {
    return this.post(config.passportHost, req, data)
  }
}

module.exports = new Api()
