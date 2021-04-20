export const formatCEDCode = function (code) {
  const result = []
  let str = ''
  code.split('').forEach((item, index) => {
    str += item
    if ((index + 1) % 4 === 0) {
      result.push(str)
      str = ''
    }
  })
  str && result.push(str)
  return result
}
export const setFormDate = function (newVal) {
  if (newVal) {
    this.form.beginTime = newVal[0] + ' 00:00:00'
    this.form.endTime = newVal[1] + ' 23:59:59'
  } else {
    this.form.beginTime = ''
    this.form.endTime = ''
  }
}
// 日期快捷选项
export const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}
