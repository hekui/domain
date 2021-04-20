const mongoose = require('../db')
const Schema = mongoose.Schema
// const { localDate } = require('../utils')

const logSchema = new Schema({
  appId: String,
  app: { type: Schema.Types.ObjectId, ref: 'app' },
  errMessage: String,
  errStack: String,
  customData: String, // stringify 的 JSON 数据
}, {
  timestamps: {}
})

const Log = mongoose.model('logs', logSchema, 'logs')

module.exports = Log
