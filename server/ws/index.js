const file = require('./modules/file')
const files = require('./../service/modules/files')
const log = require('./../log')('ws')
const dayjs = require('dayjs')

// websocket
const init = () => {
  const WebSocket = require('ws')
  const wss = new WebSocket.Server({
    port: 3006,
  })

  wss.on('connection', function connection(ws) {
    ws.send('测试连接，初次发送')
    ws.on('message', async message => {
      console.log('received: %s', message)
      const messageObj = JSON.parse(message)
      // 指定文件补跑数据
      if (messageObj.action === 'parseDateToDB') {
        log.info('\n\n---------<<<---------')
        const filename = messageObj.params.date
        const startTime = new Date()
        ws.send(JSON.stringify({
          action: messageObj.action,
          params: {
            repeat: false, // 返回消息是否循环的
            taskEnd: false, // 任务结束
            message: '【指定日期补跑数据】任务开始'
          },
        }))
        log.info(`【指定日期补跑数据】任务开始 当前时间：${dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')} filename：${filename}`)
        const down = await files.downloadFile(filename)
        // console.log('down', down)
        if (down) {
          ws.send(JSON.stringify({
            action: messageObj.action,
            params: {
              repeat: false, // 返回消息是否循环的
              taskEnd: false, // 任务结束
              message: '【指定日期补跑数据】文件已经下载完成，开始入库'
            },
          }))
          await files.init(filename)
        }
        const endTime = new Date()
        const cost = (endTime.getTime() - startTime.getTime()) / 1000 / 60
        // await files.init(filename)
        log.info(`【指定日期补跑数据】任务结束，耗时 ${cost} 分钟`)
        log.info('--------->>>---------\n\n')
        ws.send(JSON.stringify({
          action: messageObj.action,
          params: {
            repeat: false, // 返回消息是否循环的
            taskEnd: true, // 任务结束
            message: `【指定日期补跑数据】任务结束，总耗时 ${cost} 分钟`
          },
        }))
      } else if (messageObj.action === 'parseFileToDB') { // 指定文件补跑数据
        file.init(ws, messageObj.params)
      }
      // 仅发给当前客户端
      // ws.send(message)
      // 广播给全部客户端
      // wss.clients.forEach(client => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(message)
      //   }
      // })
    })
  })
}

module.exports = {
  init,
}
