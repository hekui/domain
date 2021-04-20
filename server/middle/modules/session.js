const session = require('koa-session')
const config = require('./../../config')

module.exports = app => {
  app.keys = ['cj radius BA app']
  const sessionOptions = {
    key: 'SSID',
    maxAge: config.maxage,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    // httpOnly: true, /** (boolean) httpOnly or not (default true) */
    // signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
  }
  return session(sessionOptions, app)
}
