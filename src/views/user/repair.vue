<template>
  <div class="page-repair">
    <div class="user-title">补跑数据</div>
    <el-tabs v-model="tabName">
      <el-tab-pane label="指定日期" name="first">
        <el-alert
          title="指定日期，补跑数据（服务端会在数据入库前先清空对应日期数据）"
          :closable="false"
          show-icon
          class="tip"
          type="info">
        </el-alert>
        <el-date-picker
          v-model="date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>&nbsp;
        <el-button type="primary" :loading="excuting" @click="excuteTask">立即执行</el-button>
        <div class="task-wrap">
          <p v-for="(item, index) in taskProgress" :key="index">{{ item.message }}</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="上传文件" name="second">
        <el-alert
          title="上传文件(文件名格式：2020-07-07.txt)，补跑数据（服务端会在数据入库前先清空对应日期数据）"
          :closable="false"
          show-icon
          class="tip"
          type="info">
        </el-alert>
        <el-upload
          class="upload-file"
          ref="upload"
          drag
          action=""
          :auto-upload="false"
          :http-request="uploadFile"
          :on-change="fileChange"
          :on-remove="fileRemove"
          accept=".txt"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传 txt 文件，且不超过 5Mb。</div>
        </el-upload>
        <el-button size="small" type="primary" :loading="uploading" @click="uploadFile">立即上传</el-button>
        <el-button v-if="filePath" size="small" type="success" :loading="uploadExcuting" @click="excuteUploadTask">开始执行</el-button>
        <div class="task-wrap">
          <p v-for="(item, index) in uploadTaskProgress" :key="index">{{ item.message }}</p>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
let ws
export default {
  name: 'UserUpload',
  data() {
    return {
      tabName: 'first',
      date: '',
      excuting: false,
      taskProgress: [],

      file: null,
      uploading: false,
      filePath: '',
      uploadExcuting: false,
      uploadTaskProgress: [],
    }
  },
  mounted() {
    ws = new WebSocket('ws://192.168.10.66:3006')
    ws.onopen = function (e) {
      // 成功连接服务器回调
      console.log('客户端（client）：与服务器的连接已打开')
    }
  },
  methods: {
    // 指定日期补跑
    excuteTask() {
      if (!this.date) {
        this.$message({
          message: '请选择日期',
          type: 'error'
        })
        return
      }
      this.excuting = true

      let startRepeat = false
      ws.onmessage = e => {
        const result = JSON.parse(e.data)
        if (result.action === 'parseDateToDB') {
          if (result.params.repeat) {
            if (startRepeat) {
              this.taskProgress.pop()
            }
            this.taskProgress.push(result.params)
            startRepeat = true
          } else {
            startRepeat = false
            this.taskProgress.push(result.params)
            // 任务结束了
            if (result.params.taskEnd) {
              this.excuting = false
            }
          }
        }
      }
      ws.send(JSON.stringify({
        action: 'parseDateToDB',
        params: {
          date: this.date,
        }
      }))
    },

    // 指定文件补跑
    fileChange(file, fileList) {
      this.file = file
    },
    fileRemove() {
      this.file = null
    },
    uploadFile() {
      if (this.file) {
        const formData = new FormData()
        formData.append('file', this.file.raw)
        this.uploading = true
        this.$store.dispatch('uploadFile', formData).then(res => {
          this.filePath = res.data.path
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        }).finally(() => {
          this.uploading = false
        })
      } else {
        this.$message({
          message: '请选择文件',
          type: 'warning'
        })
      }
    },
    excuteUploadTask() {
      // const ws = new WebSocket('ws://192.168.10.66:3008')
      this.uploadExcuting = true
      // ws.onopen = function (e) {
      //   // 成功连接服务器回调
      //   console.log('客户端（client）：与服务器的连接已打开')
      // }

      let startRepeat = false
      ws.onmessage = e => {
        const result = JSON.parse(e.data)
        if (result.action === 'parseFileToDB') {
          if (result.params.repeat) {
            if (startRepeat) {
              this.uploadTaskProgress.pop()
            }
            this.uploadTaskProgress.push(result.params)
            startRepeat = true
          } else {
            startRepeat = false
            this.uploadTaskProgress.push(result.params)
            // 任务结束了
            if (result.params.taskEnd) {
              this.uploadExcuting = false
            }
          }
        }
      }
      ws.send(JSON.stringify({
        action: 'parseFileToDB',
        params: {
          filePath: this.filePath,
        }
      }))
    }
  }
}
</script>

<style lang="scss">
.page-repair{
  .tip{
    margin-bottom: 14px;
  }
  .upload-file{
    margin-bottom: 14px;
  }
}
</style>
