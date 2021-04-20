
const Router = require('@koa/router')
const router = new Router()
const multer = require('koa-multer')
// const service = require('../../service')

var storage = multer.diskStorage({
  // 文件保存路径
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  // 修改文件名称
  filename: function (req, file, cb) {
    // var fileFormat = (file.originalname).split('.')
    // cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })

router.post('/upload', upload.single('file'), async ctx => {
  // koa-multer 请求对象在 ctx.req 中
  console.log(ctx.req.file)
  ctx.body = {
    code: 0,
    data: ctx.req.file
  }
})

module.exports = router.routes()
