const mongoose = require('../db')
const Schema = mongoose.Schema
// const { localDate } = require('../utils')

const appSchema = new Schema({
  appId: String,
  appName: String,
}, {
  timestamps: {}
})

const App = mongoose.model('app', appSchema, 'app')

module.exports = App
