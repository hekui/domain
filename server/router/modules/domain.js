const Router = require('@koa/router')
const router = new Router()
const service = require('../../service')

router.post('/indexRecommendList', service.domain.indexRecommendList)
router.post('/list', service.domain.queryList)
router.post('/is_reged', service.domain.isReged)
router.post('/myfav_add', service.domain.myFavAdd)
router.post('/myfav_delete', service.domain.myFavDelete)
router.post('/myfav_list', service.domain.myFavList)

module.exports = router.routes()
