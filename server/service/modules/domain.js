const conn = require('../../db')
const config = require('../../config')
// const files = require('./files')
const utils = require('../../utils')
const utilsDomain = require('../../utils/domain')

// 查询首页推荐域名
const indexRecommendList = async (ctx, next) => {
  // 查询 2个2级域名 3个3级域名 4个4级域名。
  const sql = 'select * from domainList where status = 0 and level = 2 and canReg = 1 order by id desc limit 0, 2; select * from domainList where status = 0 and level = 3 and canReg = 1 order by id desc limit 0, 3; select * from domainList where status = 0 and level = 4 and canReg = 1 order by id desc limit 0, 5;'
  // const sql = 'SELECT 1; SELECT 2'
  // console.log('indexRecommendList sql:', sql)
  const results = await conn.q(sql)
  // console.log('indexRecommendList results:', results)
  ctx.body = {
    code: 0,
    data: results[0].concat(results[1]).concat(results[2])
  }
}

// 查询域名列表
const queryList = async (ctx, next) => {
  const params = ctx.request.body
  const curPage = params.curPage || config.page.curPage
  let pageSize = params.pageSize || config.page.pageSize
  // 最多显示 100 页数据
  if (pageSize > 100) {
    pageSize = 100
  }

  let sql = 'select * from domainList'
  let whereStr = ' where status = 0 and canReg != 2'
  if (params.keyword) {
    // const searchStr = params.keyword.split('').join('%')
    whereStr += ` and domain like '${params.keyword.replace(/(^|\s|$)/ig, '%')}'`
  }
  if (params.max) {
    whereStr += ` and level between ${params.min} and ${params.max}`
  }
  if (params.suffix) {
    whereStr += ` and FIND_IN_SET(suffix, '${params.suffix}')`
  }
  if (params.startDate) {
    whereStr += ` and expireTime between '${params.startDate} 0:0:0' and '${params.endDate} 23:59:59'`
  }
  sql += whereStr
  sql += ` order by level asc, expireTime desc, id asc limit ${(curPage - 1) * pageSize}, ${pageSize};`
  // 计数
  sql += `select count(id) as count from domainList ${whereStr};`
  // console.log('sql:', sql)
  const results = await conn.q(sql, [params.suffix])
  // console.log('results:', results)
  // 最多显示 100 页数据
  const total = results[1][0].count
  // if (total > 100 * pageSize) {
  //   total = 100 * pageSize
  // }
  ctx.body = {
    code: 0,
    data: {
      list: results[0],
      page: {
        curPage,
        pageSize,
        total,
      }
    }
  }
}

// 导入域名
// const insertDomain = async (ctx, next) => {
//   const params = ctx.request.body
//   files.save()

// }

// 已被抢注 - 反馈处理逻辑
const isReged = async (ctx, next) => {
  const domain = ctx.request.body.domain || ''
  const status = await utilsDomain.checkDomainRegStatus(domain)

  // console.log('status', status)

  const sql = 'update domainlist set canReg = ? where domain = ?'
  await conn.q(sql, [status, domain])

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

// 收藏域名
const myFavAdd = async (ctx, next) => {
  const userId = ctx.session.userInfo.id || ''
  const domainId = ctx.request.body.id || ''
  if (!userId) {
    ctx.body = {
      code: 1001,
      msg: '请登录后操作'
    }
    return
  }
  if (!domainId) {
    ctx.body = {
      code: 1000,
      msg: 'id为空'
    }
    return
  }
  const sqlSelect = 'select * from user_fav where user_id = ? and domain_id = ?'
  const results = await conn.q(sqlSelect, [userId, domainId])

  if (results.length > 0) {
    ctx.body = {
      code: 1200,
      msg: '已经收藏过了'
    }
  } else {
    const sql = 'insert into user_fav(user_id, domain_id) values(?, ?)'
    await conn.q(sql, [userId, domainId])

    ctx.body = {
      code: 0,
      msg: 'success'
    }
  }
}

// 取消收藏域名
const myFavDelete = async (ctx, next) => {
  const userId = ctx.session.userInfo.id || ''
  const id = ctx.request.body.id || ''
  if (!userId) {
    ctx.body = {
      code: 1001,
      msg: '请登录后操作'
    }
    return
  }
  if (!id) {
    ctx.body = {
      code: 1000,
      msg: 'id为空'
    }
    return
  }
  const sql = 'delete from user_fav where user_id = ? and id = ?'
  await conn.q(sql, [userId, id])

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

// 查询收藏域名
const myFavList = async (ctx, next) => {
  const userId = ctx.session.userInfo.id || ''
  if (!userId) {
    ctx.body = {
      code: 1001,
      msg: '请登录后操作'
    }
    return
  }
  const params = ctx.request.body
  const curPage = params.curPage || config.page.curPage
  const pageSize = params.pageSize || config.page.pageSize
  const whereStr = ' where user_id = ?'
  let sql = `select * from user_favlist ${whereStr} order by id desc limit ${(curPage - 1) * pageSize}, ${pageSize};`
  // 计数
  sql += `select count(id) as count from user_favlist ${whereStr};`
  const results = await conn.q(sql, [userId, userId])
  const total = results[1][0].count

  ctx.body = {
    code: 0,
    msg: 'success',
    data: {
      list: results[0],
      page: {
        curPage,
        pageSize,
        total,
      }
    }
  }
}

module.exports = {
  indexRecommendList,
  queryList,
  isReged,
  myFavAdd,
  myFavDelete,
  myFavList,
}
