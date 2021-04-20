
const path = require('path')
const fs = require('fs')
const express = require('express')
const campto = require('campto')
const log = require('./../log')('captcha')

const router = express.Router()
const factoryBgs = (function (FPATH) {
  let bgs = null
  return function () {
    if (!bgs && (bgs = [])) {
      const fileList = fs.readdirSync(FPATH)
      fileList.forEach(fPath => {
        if (/\.png|jpg|gif/.test(fPath)) bgs.push(path.join(FPATH, fPath))
      })
    }
    return bgs.length ? bgs : null
  }
}(path.join(__dirname, 'bgList')))

function getCamPto(req, option = {}) {
  let width = parseInt(req.query.width || req.body.width || 285)
  let height = parseInt(req.query.height || req.body.height || 60)
  !width && (width = 285)
  !height && (height = 60)
  return campto(Object.assign({
    captchaHeight: height,
    captchaWidth: width,
    randColorSet: ['#000000', '#FFFFFF'],
    topic: 'alphabet',
    backgroundSet: factoryBgs(),
    recognitionDifficulty: 'hard'
  }, option)).then((captcha) => {
    req.session.captcha = captcha.result + ''
    return captcha.buffer
  }).catch(e => {
    log.error(`get - /getImg \n - 生成验证码出错 - ${e}`)
  })
}

router.get('/getImg', function (req, res, next) {
  getCamPto(req).then(buffer => res.end(buffer))
})

router.get('/check', function (req, res, next) {
  // console.log('req.session', req.session['captcha'])
  // console.log('req.body', req.body['captcha'])
  if (req.body.captcha === req.session.captcha) {
    return res.send({
      code: 0,
      msg: '验证成功'
    })
  }
  res.send({
    code: 1,
    msg: '验证失败'
  })
})

router.post('/getBase64', function (req, res, next) {
  getCamPto(req).then(buffer => res.json({
    img: 'data:image/jpg;base64,' + buffer.toString('base64')
  }))
})

module.exports = router
