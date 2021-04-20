const port = process.env.NODE_ENV === 'production' ? 3005 : 3005

const config = {
  env: process.env.runEnv || 'dev', // 服务环境：本地,loc; 开发,dev; 测试,test; 生产,prod
  cookieSecret: 'iamcedsecrethahah', // cookie 秘钥
  port: port,
  maxage: 30 * 24 * 60 * 60 * 1000, // session有效期，30天
  cacheAge: 365 * 24 * 60 * 60 * 1000, // 静态资源缓存时间，365天
  timeout: 5000,
  cdnHost: process.env.cdnHost || '',
  localhost: process.env.localhost ? `${process.env.localhost}` : `http://localhost:${port}`, // 用于服务端发送http请求时的前缀
  page: {
    curPage: 1,
    pageSize: 20,
  }
}

module.exports = config
