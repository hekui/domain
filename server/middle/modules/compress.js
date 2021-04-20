const compress = require('koa-compress')

// 请求压缩 https://github.com/koajs/compress
module.exports = compress({
  threshold: 1024, // 阀值，当数据超过 1kb 的时候，可以压缩
  flush: require('zlib').Z_SYNC_FLUSH // zlib 是 node 的压缩模块
})
