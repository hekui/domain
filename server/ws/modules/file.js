const fs = require('fs')
const path = require('path')
const readline = require('readline')
const axios = require('axios')
const conn = require('../../db')

const suffixRankDict = {
  com: 1,
  cn: 2,
  net: 3,
  vip: 4,
}

class File {
  constructor() {
    this.ws = ''
    this.path = ''
  }

  /**
   * 整理数据：定级/计算权重，并过滤出域名名称长度 5 以内的数据
   * @param  {Array} arr 要整理的数组
   * @return {Array} arr 整理后的数组
   */
  rank(arr) {
    const reg = /(.*?)\.(.*)/
    return arr.map(item => {
      const results = reg.exec(item)
      return {
        domain: item,
        name: results[1],
        suffix: results[2],
        level: results[1].length,
        rank: results[1].length * 100 + this.getSuffixRank(results[2])
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
    try {
      return arr.sort((a, b) => {
        return reg.exec(a)[1].length - reg.exec(b)[1].length
      })
    } catch (error) {
      console.log('sortByLength error', error)
    }
  }

  // 读文件
  readFile() {
    return new Promise((resolve, reject) => {
      try {
        const path = this.path
        console.log('path', path)
        const fRead = fs.createReadStream(path)
        const objReadline = readline.createInterface({
          input: fRead
        })
        const arr = []
        objReadline.on('line', line => {
          arr.push(line)
        })
        objReadline.on('close', () => {
          resolve(arr)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  // 写入数据库
  async writeToDB(data) {
    console.log('writeToDB data', data)
    const allCount = data.length
    console.log(`总计 ${allCount} 条待处理数据`)
    this.ws.send(JSON.stringify({
      action: 'parseFileToDB',
      params: {
        repeat: false, // 返回消息是否循环的
        message: `总计 ${allCount} 条待处理数据`
      },
    }))
    const expireTime = path.parse(this.path).name
    let count = 1
    let item = data.shift()
    while (item) {
      const regStatus = await this.getRegStatus(item.domain).catch(e => e)
      const sql = `insert into domainList(domain, name, suffix, level, rank, canReg, expireTime) values('${item.domain}', '${item.name}', '${item.suffix}', ${item.level}, ${item.rank}, ${regStatus}, '${expireTime}');`
      // console.log('---<<<------------------------------')
      // console.log(sql)
      await conn.q(sql)
      console.log(`已处理 ${count} 条(总计 ${allCount} 条)`)
      this.ws.send(JSON.stringify({
        action: 'parseFileToDB',
        params: {
          repeat: true, // 返回消息是否循环的
          message: `已处理 ${count} 条`
        },
      }))
      count++
      item = data.shift()
    }
  }

  /**
   * 是否可注册
   * @param {String} domain 检测的域名
   * @return {Number} status 返回可注册状态，0检测失败；1可注册；2不可注册
   */
  getRegStatus(domain) {
    // console.log('checking', domain)
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

  /**
   * 更新注册状态任务（所有未检测状态的数据）
   */
  async updateRegStatusTask() {
    const sqlAll = 'select count(id) as count from domainlist where canReg = 0'
    const resultsAll = await conn.q(sqlAll)
    const allCount = resultsAll[0].count
    console.log(`总计 ${allCount} 条待处理数据，任务开始：`)
    this.ws.send(JSON.stringify({
      action: 'parseFileToDB',
      params: {
        repeat: false, // 返回消息是否循环的
        message: `总计 ${allCount} 条待处理数据，任务开始：`
      },
    }))

    const startTime = new Date().getTime()
    let id = 0 // 用来标记已经处理后，不再处理。
    const sql = 'select * from domainlist where id > ? and canReg = 0 order by id asc limit 0, 1'
    let results = await conn.q(sql, [id])
    let count = 1
    console.log('results', results)
    while (results.length > 0) {
      id = results[0].id
      const domain = results[0].domain
      const regStatus = await this.getRegStatus(domain).catch(e => e)
      const sqlUpdate = 'update domainlist set canReg = ? where domain = ?'
      await conn.q(sqlUpdate, [regStatus, domain])
      console.log(`已处理 ${count} 条(总计 ${allCount} 条)`)
      this.ws.send(JSON.stringify({
        action: 'parseFileToDB',
        params: {
          repeat: true, // 返回消息是否循环的
          message: `已处理 ${count} 条(总计 ${allCount} 条)`
        },
      }))
      // console.log('---<<<------------------------------')
      results = await conn.q(sql, [id])
      count++
    }
    const endTime = new Date().getTime()
    const cost = startTime - endTime
    console.log(`任务处理完成，耗时 ${cost}M`)
  }

  async task() {
    const startTime = new Date().getTime()
    this.ws.send(JSON.stringify({
      action: 'parseFileToDB',
      params: {
        repeat: false, // 返回消息是否循环的
        message: '任务开始'
      },
    }))
    const arr = await this.readFile()
    if (arr && arr.length) {
      console.log('arr', arr)
      this.ws.send(JSON.stringify({
        action: 'parseFileToDB',
        params: {
          repeat: false, // 返回消息是否循环的
          message: '文件数据读取成功'
        },
      }))
      const data = this.rank(this.sortByLength(arr))
      await this.writeToDB(data)
    } else {
      this.ws.send(JSON.stringify({
        action: 'parseFileToDB',
        params: {
          repeat: false, // 返回消息是否循环的
          message: '文件数据读取失败'
        },
      }))
    }
    const endTime = new Date().getTime()
    const cost = (endTime - startTime) / 1000 / 60 // M
    console.log(`任务完成，本次任务耗时：${cost} 分钟`)
    this.ws.send(JSON.stringify({
      action: 'parseFileToDB',
      params: {
        repeat: false, // 返回消息是否循环的
        taskEnd: true, // 任务结束
        taskCost: cost, // 任务耗时(单位：分钟)
        message: `任务完成，本次任务耗时：${cost} 分钟`
      },
    }))
  }

  // 初始化
  init(ws, params) {
    this.ws = ws
    this.path = params.filePath
    if (!path) return
    this.task()
  }
}

module.exports = new File()
