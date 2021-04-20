
const path = require('path')
const KoaStatic = require('koa-static')
const koaBody = require('koa-body')
const config = require('./../config')
const log = require('./../log')('http')

const compress = require('./modules/compress')
const session = require('./modules/session')

// const xmlParser = require('koa-xml-body')
// const microcache = require('route-cache')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)
const serve = (path, cache) => KoaStatic(resolve(path), {
  maxAge: cache && isProd ? config.cacheAge : 0
})

/**
 * 注册中间件
 * @param {App} app
 */
module.exports = (app) => {
  let middlewares = []
  if (isProd) {
    middlewares.push(compress) // 内容压缩
    middlewares.push(async (ctx, next) => { // 对 dist 目录的访问处理
      const RegExp = /^\/dist\//
      if (RegExp.test(ctx.url)) {
        ctx.url = ctx.url.replace(RegExp, '/')
      }
      await next()
    })
  }

  middlewares = middlewares.concat([
    serve('./../../dist', true),
    serve('./../../public', true),
    session(app),
    koaBody({
      multipart: false,
      formidable: {
        maxFieldsSize: 3 * 1024 * 1024 // 3M（同 JAVA 端配置），设置上传文件大小最大限制，默认 2M
      }
    }),
    // 支持xml
    // xmlParser({
    //   key: 'xmlBody', // ctx.request.xmlBody
    //   xmlOptions: {
    //     explicitArray: false, // Always put child nodes in an array if true; otherwise an array is created only if there is more than one. (default: true)
    //   }
    // }),
    // 日志
    async (ctx, next) => {
      ctx.session.userInfo = {
        id: 1,
        role: 'admin',
        nickname: 'hekui'
      }
      const start = new Date()
      // console.log('before next', ctx.request.url)
      await next()
      // console.log('after next', ctx.request.url)
      const ms = new Date() - start
      if (ctx.status === 200) {
        log.trace(`"${ctx.request.method} ${ctx.request.url}" ${ctx.status} ${ms}ms "${ctx.request.header['user-agent']}"`)
      } else {
        log.error(`"${ctx.request.method} ${ctx.request.url}" ${ctx.status} ${ms}ms "${ctx.request.header['user-agent']}"`)
      }
    },
  ])

  middlewares.forEach(middle => {
    app.use(middle)
  })
}
