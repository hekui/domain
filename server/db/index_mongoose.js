const mongoose = require('mongoose')
const config = require('../config')
const log = require('../log')('db')

mongoose.connect(config.mongodbString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (err) => {
  log.error('mongodb connect error:', err)
})
db.once('open', () => {
  // we're connected!
  log.trace('mongodb has connected!')
})

module.exports = mongoose
