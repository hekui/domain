const axios = require('axios')

/**
 * 检测域名注册状态
 * @param {String} domain 检测的域名
 * @return {Number} status 返回可注册状态，0检测失败；1可注册；2不可注册
 */
const checkDomainRegStatus = (domain) => {
  const url = `https://checkapi.aliyun.com/check/checkdomain?domain=${domain}&command=&token=Yb3ecb096fad2afdf1e1aec9fb13351fa&ua=&currency=&site=&bid=&_csrf_token=&callback=jsonp`
  return axios.get(url).then(res => {
    let canReg
    try {
      const jsonStr = res.data.replace(/^jsonp\(/, '').replace(/\);$/, '')
      const json = JSON.parse(jsonStr)
      // console.log(json)
      canReg = json.module[0].avail === 1
    } catch (error) {
      console.log(error)
    }
    return canReg ? 1 : 2
  }).catch(e => {
    console.log('e', e)
    return Promise.reject(0)
  })
}

module.exports = {
  checkDomainRegStatus,
}
