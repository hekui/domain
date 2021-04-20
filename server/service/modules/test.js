const files = require('./files')
// const schedule = require('node-schedule')
// const dayjs = require('dayjs')

// const yesterday = dayjs('202007-01').subtract(1, 'day').format('YYYY-MM-DD')
// console.log(yesterday)

// 数据入库
files.init('2020-06-22')

// 更新注册状态
// files.updateRegStatusTask()

// 下载文档
// files.downloadFile('2020-06-20')
// 自动登录
// files.loginJM()

// 定时任务
// 6个占位符从左到右分别代表：秒、分、时、日、月、周几
// console.log('服务启动')
// schedule.scheduleJob('0 25 13 * * *', async () => {
//   const filename = '2020-06-21'
//   const startTime = new Date()
//   console.log('定时任务开始', startTime.toLocaleString())
//   const down = await files.downloadFile(filename)
//   if (down) {
//     await files.init(filename)
//   }
//   const endTime = new Date()
//   console.log(`定时任务结束，耗时${(endTime.getTime() - startTime.getTime()) / 1000 / 60} 分钟`)
// })

// 进度条
// const ProgressBar = require('progress')

// var bar = new ProgressBar('正在处理 :current/:total', { total: 100 })
// var timer = setInterval(function () {
//   bar.tick()
//   if (bar.complete) {
//     console.log('\ncomplete\n')
//     clearInterval(timer)
//   }
// }, 100)
