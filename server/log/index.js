const path = require('path')
const log4js = require('log4js')
const config = require('./../config')

log4js.configure({
  appenders: {
    // file: {
    //   type: 'file',
    //   filename: __dirname +'/logs/important-things.log',
    //   maxLogSize: 1 * 1024 * 1024, // = 10Mb
    //   numBackups: 5, // keep five backup files
    //   encoding: 'utf-8',
    //   mode: 0o0640,
    //   flags: 'w+'
    // },
    dateFile: {
      type: 'dateFile',
      filename: path.join(__dirname, '/../../logs/log'),
      // pattern: 'yyyy-MM-dd-hh',
      pattern: '.yyyy-MM-dd'
      // compress: true
    },
    console: {
      type: 'stdout'
    },
    errLogs: {
      type: 'logLevelFilter',
      appender: 'console',
      level: config.env === 'prod' ? 'error' : 'trace', // 生产环境输出error级别错误，其他环境输出所有。
    },
    allLogs: {
      type: 'logLevelFilter',
      appender: 'dateFile',
      level: 'trace'
    }
  },
  categories: {
    default: {
      appenders: ['allLogs', 'errLogs'],
      level: 'trace',
    }
  }
})

// 使用示例

// const logger = log4js.getLogger('test');

// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

// setInterval(() => {
//   logger.info('just doing the thing');
// }, 1000)

// 关闭
exports.shutdown = function (cb) {
  log4js.shutdown(cb)
}

module.exports = function (tag) {
  return log4js.getLogger(tag)
}
