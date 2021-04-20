const schedule = require('node-schedule')
const dayjs = require('dayjs')
const files = require('./../service/modules/files')

const log = require('./../log')('schedule')

module.exports = async () => {
  // 6个占位符从左到右分别代表：秒、分、时、日、月、周几
  // schedule.scheduleJob('30 * * * * *', () => {
  //   console.log('每分钟的第30秒执行', new Date().toLocaleString())
  // })

  /**
   * 自动登录下载文档并数据入库，并检查注册状态
   * 每日 0:05:0 执行
   */
  schedule.scheduleJob('0 05 0 * * *', async () => {
    log.info('\n\n---------<<<---------')
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const filename = yesterday
    const startTime = new Date()
    log.info(`【自动登录下载文档并数据入库】定时任务开始 当前时间：${dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')} filename：${filename}`)
    const down = await files.downloadFile(filename)
    // console.log('down', down)
    down && await files.init(filename)
    // await files.init(filename)
    const time = new Date()
    log.info(`【自动登录下载文档并数据入库】定时任务结束，耗时${(time.getTime() - startTime.getTime()) / 1000 / 60} 分钟`)
    log.info(`【注册状态更新】任务开始 当前时间：${dayjs(time).format('YYYY-MM-DD HH:mm:ss')}`)
    await files.updateRegStatusTask()
    const endTime = new Date()
    log.info(`【注册状态更新】任务结束，耗时${(endTime.getTime() - time.getTime()) / 1000 / 60} 分钟`)
    log.info('--------->>>---------\n\n')
  })

  // await files.updateRegStatusTask()

  /**
   * 注册状态更新 - 对注册状态检查失败的数据，进行查询更新
   * 每日 0:20:0 执行
   */
  // schedule.scheduleJob('0 47 9 * * *', async () => {
  //   log.info('\n\n---------<<<---------')
  //   log.info('【注册状态更新】指的是，对注册状态检查失败的数据，进行查询更新')
  //   const startTime = new Date()
  //   log.info(`【注册状态更新】定时任务开始 当前时间：${dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')}`)
  //   await files.updateRegStatusTask()
  //   const endTime = new Date()
  //   log.info(`【注册状态更新】定时任务结束，耗时${(endTime.getTime() - startTime.getTime()) / 1000 / 60} 分钟`)
  //   log.info('--------->>>---------\n\n')
  // })

  // 测试 新网更快。
  // const domain = 'baidu.com'
  // const time1 = new Date().getTime()
  // await files.getRegStatus(domain)
  // const time2 = new Date().getTime()
  // console.log('万网耗时：', time2 - time1)
  // await files.getRegStatusByXW(domain)
  // const time3 = new Date().getTime()
  // console.log('新网耗时：', time3 - time2)
}
