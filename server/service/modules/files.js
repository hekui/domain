const fs = require('fs')
const path = require('path')
const readline = require('readline')
const axios = require('axios')
const ProgressBar = require('progress')

const conn = require('../../db')
const log = require('./../../log')('files')

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36'

const suffixRankDict = {
  com: 1,
  cn: 2,
  net: 3,
  vip: 4,
}

class File {
  constructor() {
    this.path = ''
  }

  /**
   * 分析域名
   * @parm {String} domain 域名
   * @return {Object} 分析后的域名对象，格式：{domain: 'baidu.com', name: 'baidu', suffix: 'com'}
   */
  parseDomain(domain) {
    const reg = /(.*?)\.(.*)/
    const results = reg.exec(domain)
    return {
      domain: domain,
      name: results[1],
      suffix: results[2],
    }
  }

  /**
   * 整理数据：定级/计算权重，并过滤出域名名称长度 5 以内的数据
   * @param  {Array} arr 要整理的数组
   * @return {Array} arr 整理后的数组
   */
  rank(arr) {
    return arr.map(item => {
      const d = this.parseDomain(item)
      return {
        domain: item,
        name: d.name,
        suffix: d.suffix,
        level: d.name.length,
        rank: d.name.length * 100 + this.getSuffixRank(d.suffix)
      }
    }).filter(item => {
      return item.level <= 5
    })
  }

  /**
   * 获取域名后缀权重
   * @param  {String} suffix 域名后缀，比如：com
   * @return {Number} rank 权重值
   */
  getSuffixRank(suffix) {
    const rank = suffixRankDict[suffix]
    if (rank) {
      return rank
    } else {
      return 80
    }
  }

  /**
   * 根据域名名称长度排序
   * @param  {Array} arr 要排序的数组
   * @return {Array} arr 排序后的数组
   */
  sortByLength(arr) {
    const reg = /(.*?)\./
    return arr.sort((a, b) => {
      return reg.exec(a)[1].length - reg.exec(b)[1].length
    })
  }

  /**
   * 写文件
   * @param {path} path 文件路径
   * @param {Stream} stream 数据流
   * @return {Boolean} 是否写成功 true/false
   */
  saveFile(path, stream) {
    return new Promise((resolve, reject) => {
      if (!path) reject(false)
      fs.writeFile(path, stream, function(error) {
        if (error) {
          log.fatal('写文件失败：', error)
          reject(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  /**
   * 按行读文件
   * @param {path} path 文件路径
   * @return {array | null} arr 读取成功时，返回文件按行的数组数据，失败时返回 null
   */
  readFile(path) {
    return new Promise((resolve, reject) => {
      if (!path) reject(null)
      try {
        const fRead = fs.createReadStream(path)
        const objReadline = readline.createInterface({
          input: fRead
        })
        const arr = []
        objReadline.on('line', line => {
          arr.push(line)
        })
        objReadline.on('close', () => {
          log.trace('读取文件成功')
          resolve(arr)
        })
      } catch (e) {
        log.fatal('读取文件失败', e)
        reject(null)
      }
    })
  }

  /**
   * 写入数据库
   * @param {Array} data 要入库的数据
   * @return {Void} 无返回
   */
  async writeToDB(data = []) {
    // console.log('writeToDB data', data)
    const total = data.length
    log.info(`开始数据入库处理（经过过滤后，总计 ${total} 条待处理数据）：`)
    if (total <= 0) {
      log.info('没有待处理数据，退出任务')
      return
    }
    const expireTime = path.parse(this.path).name
    // let count = 1
    let item = data.shift()
    var bar = new ProgressBar('正在处理 :current/:total :percent :etas (:domain)', { total: total })
    while (item) {
      bar.tick({
        domain: item.domain
      })
      const selectSql = 'select * from domainList where domain = ?'
      const selectResult = await conn.q(selectSql, [item.domain]).catch(e => null)
      if (selectResult && selectResult.length === 0) {
        // const regStatus = await this.getRegStatus(item.domain).catch(e => e)
        const regStatus = 0
        const sql = `insert into domainList(domain, name, suffix, level, rank, canReg, expireTime) values('${item.domain}', '${item.name}', '${item.suffix}', ${item.level}, ${item.rank}, ${regStatus}, '${expireTime}');`
        // console.log('---<<<------------------------------')
        // console.log(sql)
        await conn.q(sql).catch(e => null)
        // console.log(`已处理 ${count} 条(总计 ${allCount} 条)`)
        // count++
      }
      item = data.shift()
    }
  }

  /**
   * 是否可注册  万网
   * @param {String} domain 检测的域名
   * @return {Number} status 返回可注册状态，0检测失败；1可注册；2不可注册
   */
  getRegStatus(domain) {
    // console.log('checking', domain)
    const url = `https://checkapi.aliyun.com/check/checkdomain?domain=${domain}&command=&token=Yb3ecb096fad2afdf1e1aec9fb13351fa&ua=&currency=&site=&bid=&_csrf_token=&callback=jsonp`
    return axios.get(url, {
      timeout: 3000
    }).then(res => {
      let canReg, json
      try {
        const jsonStr = res.data.replace(/^jsonp\(/, '').replace(/\);$/, '')
        json = JSON.parse(jsonStr)
        // console.log(json)
        if (json.errorCode === 0) {
          canReg = json.module[0].avail === 1 ? 1 : 2
        } else {
          canReg = 0
          log.trace('验证域名注册状态失败，返回json:', json)
        }
      } catch (error) {
        log.fatal(error)
      }
      return canReg
    }).catch(e => {
      log.fatal('getRegStatus catch e', e.message)
      return Promise.reject(0)
    })
  }

  /**
   * 是否可注册  新网
   * @param {String} domain 检测的域名
   * @return {Number} status 返回可注册状态，0检测失败；1可注册；2不可注册
   */
  getRegStatusByXW(domain) {
    // console.log('checking', domain)
    const d = this.parseDomain(domain)
    const stamp = new Date().getTime()
    const url = `http://domaincheck.xinnet.com/domainCheck?callbackparam=callback&searchRandom=6&prefix=${d.name}&suffix=.${d.suffix}&_=${stamp}`
    return axios.get(url, {
      timeout: 3000
    }).then(res => {
      let canReg, json
      try {
        const jsonStr = res.data.replace(/^callback\(\[/, '').replace(/\]\)$/, '')
        json = JSON.parse(jsonStr)
        if (json.result && json.result.length > 0) {
          canReg = json.result[0].yes.length > 0 ? 1 : 2
        } else {
          canReg = 0
          log.trace('验证域名注册状态失败，返回json:', json)
        }
      } catch (error) {
        log.fatal(error)
      }
      return canReg
    }).catch(e => {
      log.fatal('getRegStatusByXW catch e', e.message)
      return Promise.reject(0)
    })
  }

  /**
   * 更新注册状态任务（所有未检测状态的数据）
   */
  async updateRegStatusTask() {
    const sqlAll = 'select count(id) as count from domainlist where canReg = 0 and level < 5'
    const resultsAll = await conn.q(sqlAll)
    const total = resultsAll[0].count
    log.info(`总计 ${total} 条待处理数据，任务开始：`)

    let id = 0 // 用来标记已经处理后，不再处理。

    // 一次10条
    // const sql = 'select * from domainlist where id > ? and canReg = 0 order by id asc limit 0, 9'
    // let results = await conn.q(sql, [id])
    // console.log(results)
    // var bar = new ProgressBar('正在处理 :current/:total :percent :etas (:domain)', { total: Math.ceil(total / 10) })
    // while (results.length > 0) {
    //   const taskArray = []
    //   const domainArray = []
    //   results.forEach(item => {
    //     taskArray.push(this.getRegStatus(item.domain))
    //     id = item.id
    //     domainArray.push(item.domain)
    //   })
    //   await Promise.all(taskArray).then(async results => {
    //     // console.log('Promise.all results', results)
    //     await results.forEach(async (value, index) => {
    //       const sqlUpdate = 'update domainlist set canReg = ? where domain = ?'
    //       await conn.q(sqlUpdate, [value, domainArray[index]])
    //     })
    //   }).catch(e => e)
    //   results = await conn.q(sql, [id])
    //   console.log(results)
    //   bar.tick({
    //     domain: domainArray.join(',')
    //   })
    // }

    // 一次一条
    const sql = 'select * from domainlist where id > ? and canReg = 0 order by level asc limit 0, 1'
    let results = await conn.q(sql, [id])
    var bar = new ProgressBar('正在处理 :current/:total :percent :etas (:domain)', { total: total })
    // console.log('results', results)
    while (results.length > 0) {
      id = results[0].id
      const domain = results[0].domain
      bar.tick({
        domain: domain
      })
      // 随机检测
      let regStatus
      if (Math.random() > 0.5) {
        regStatus = await this.getRegStatus(domain).catch(e => e) // 万网检测（阿里，准确率貌似高些）
      } else {
        regStatus = await this.getRegStatusByXW(domain).catch(e => e) // 新网检测
      }
      // const regStatus = await this.getRegStatus(domain).catch(e => e) // 万网检测（阿里，准确率貌似高些）
      // const regStatus = await this.getRegStatusByXW(domain).catch(e => e) // 新网检测
      const sqlUpdate = 'update domainlist set canReg = ? where domain = ?'
      await conn.q(sqlUpdate, [regStatus, domain])
      // log.info(`已处理 ${count} 条(总计 ${total} 条)`)
      // console.log('---<<<------------------------------')
      results = await conn.q(sql, [id])
    }
  }

  // 初始化
  async init(filename) {
    log.trace('开始处理文件：读取文件，并将数据入库')
    if (!filename) return
    this.path = `./uploads/${filename}.txt`
    let data = await this.readFile(this.path).catch(e => null)
    if (data) {
      data = this.rank(this.sortByLength(data))
      // 清除对应日期数据
      const sqlDelete = 'delete from domainlist where expireTime = ?'
      await conn.q(sqlDelete, [filename])
      // 开始数据入库
      await this.writeToDB(data)
    } else {
      log.fail('文件打开失败')
    }
  }

  /**
   * 以下是 实现自动登录并下载文档部分
   * 注：短时间内登录次数过多，会被要求输入验证码。
   */
  formatCokie(cookieArray) {
    return cookieArray.map(value => {
      return value.split(';')[0]
    }).join('; ')
  }

  // 自动登录
  async loginJM() {
    log.trace('自动登录流程 - 开始')
    // 登录
    log.trace('自动登录流程 - 开始登录（获取cookie）')
    const cookie = await axios({
      url: 'http://www.jm.cn/if.htm',
      method: 'post',
      params: {
        tj_fs: 1,
        re_yx: '360967863@qq.com',
        re_code: 'SF3mg34s9Vs',
        re_mm: '7ac9c5f29ef3bdd9f64'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // cookie: cookie,
        // cookie: '_qdda=3-1.3kb6mm; _qddab=3-eyszvo.kbq2xzat; a801967fdbbbba8c_gr_session_id_4d46ee17-13aa-4571-adff-d6a01dd26786=false; a801967fdbbbba8c_gr_session_id=4d46ee17-13aa-4571-adff-d6a01dd26786',
      },
      responseEncoding: 'gb2312', // default
    }).then(res => {
      // console.log('res', res)
      const cookiesStr = this.formatCokie(res.headers['set-cookie'])
      log.trace(`自动登录流程 - 登录成功获得cookie：${cookiesStr}`)
      log.trace('res.data', res.data)
      // console.log('res.headers', res.headers)
      // return res.headers['set-cookie'].join('')
      return cookiesStr
    }).catch(e => {
      log.fatal('自动登录流程 - 登录失败')
      log.fatal(e)
      return ''
    })
    if (!cookie) return
    console.log('--------------------')
    // 调用删除页面一次
    // ssoUrl='http://acce68a040ff01c1.juming.com:9696/jm/sso?uid=425870&key=4636598d48d0b94966e20e8c8481f783'
    log.trace('自动登录流程 - 调用删除页面开始（获取ssoUrl）')
    const ssoUrl = await axios.get('http://www.jm.cn/delete_down.htm', {
      headers: {
        cookie: cookie
      },
      // responseType: 'arraybuffer',
    }).then(res => {
      const regExp = /yinjs\("xx_xx_xxx","(.*?)",""\);/
      const result = res.data.match(regExp)
      // console.log('result', result)
      const url = result[1]
      // 验证是否获取成功 形似 http://acce68a040ff01c1.juming.com:9696/jm/sso?uid=0&key= 就代表不成功，有 uid key 代表成功
      const urlArray = url.split('?')
      if (urlArray.length > 1 && urlArray[1] !== 'uid=0&key=') {
        log.trace(`自动登录流程 - 调用删除页面成功 获得ssoUrl：${url}`)
        return url
      } else {
        log.fatal(`自动登录流程 - 调用删除页面成功 获得ssoUrl 但不正确：${url}`)
        return ''
      }
    }).catch(e => {
      log.fatal('自动登录流程 - 调用删除页面失败')
      log.fatal(e)
      return ''
    })
    if (!ssoUrl) return
    console.log('--------------------')
    log.trace('自动登录流程 - 调用ssoUrl开始（获取PHPSESSID）')
    const PHPSESSID = await axios.get(ssoUrl).then(res => {
      // console.log(res.headers['set-cookie'])
      const sessionCookie = res.headers['set-cookie'][0]
      log.trace(`自动登录流程 - 调用ssoUrl成功，获得PHPSESSID：${sessionCookie}`)
      return sessionCookie
    }).catch(e => {
      log.fatal('自动登录流程 - 调用ssoUrl失败')
      log.fatal(e)
      return ''
    })

    return PHPSESSID
  }

  async downloadFile(filename) {
    const PHPSESSID = await this.loginJM()
    if (!PHPSESSID) {
      log.fatal('【失败】自动登录失败，任务结束')
      return false
    }
    const url = `http://acce68a040ff01c1.juming.com:9696/newcha/del_down?scsj=${filename}`
    log.trace('开始下载文件:', url)
    const result = await axios.get(url, {
      headers: {
        cookie: PHPSESSID,
        // cookie: 'PHPSESSID=7edpmn4hbs73gqs765hoegedip;'
      },
      // responseType: 'arraybuffer',
    }).then(async res => {
      if (res.data === '<font color=red>对不起，您还未登录帐户。</font>') {
        log.fatal('下载失败，提示未登录')
        log.trace('res.data', res.data)
      } else {
        log.trace('下载完成，开始保存')
        const path = `./uploads/${filename}.txt`
        const result = await this.saveFile(path, res.data)
        if (result) {
          log.trace('保存文件完成')
        }
        return true
      }
    }).catch(e => {
      log.fatal('下载失败，提示未登录')
      log.fatal(e)
      return false
    })
    return result
  }
}

module.exports = new File()
