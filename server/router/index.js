const Router = require('@koa/router')
const router = new Router()

const domainRouter = require('./modules/domain')
const fileRouter = require('./modules/file')

router.use('/domain', domainRouter)

router.use('/file', fileRouter)

router.all('*', (ctx, next) => {
  // console.log('ctx', ctx)
  ctx.body = {
    code: 404,
    msg: '接口不存在。'
  }
})

module.exports = router.routes()
