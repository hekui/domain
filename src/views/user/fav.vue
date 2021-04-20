<template>
  <div class="page-fav">
    <div class="user-title">我的收藏</div>
    <div class="main">
      <el-table
        :data="myFavList.list"
        stripe
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="domain"
          label="域名"
        >
          <template slot-scope="scope">
            <a :href="'https://wanwang.aliyun.com/domain/searchresult/#/?keyword='+ scope.row.name +'&suffix='+ scope.row.suffix" title="点击立即验证是否可注册" target="_blank">{{ scope.row.domain }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          align="center"
          label="域名长度"
          width="100">
        </el-table-column>
        <el-table-column
          prop="canReg"
          align="center"
          label="可否注册"
          width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.canReg === 1" class="success">是</span>
            <span v-else-if="scope.row.canReg === 2" class="danger">否</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expireTime"
          label="过期时间"
          width="150">
          <template slot-scope="scope">
            {{ scope.row.expireTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- <el-button
                    class="btn-check"
                    @click.native.prevent="goCheckReg(scope.row)"
                    type="text"
                    size="medium">
                    立即验证
                  </el-button> -->
            <el-dropdown split-button type="primary" size="medium" @click="handleReg" @command="handleCommand">
              立即抢注
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="'cancelFav$$'+ scope.row.id">取消收藏</el-dropdown-item>
                <el-dropdown-item :command="'isReged$$'+ scope.row.domain">已被抢注</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="page.curPage"
          :page-size="page.pageSize"
          :total="myFavList.page.total"
          @current-change="curPageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      loading: false,
      page: {
        curPage: 1,
        pageSize: 20,
      },
    }
  },

  computed: {
    ...mapState({
      myFavList: state => state.domain.myFavList,
    }),
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('fetchMyFavList', Object.assign({}, this.page)).then(res => {
        this.$message({
          message: '加载成功',
          type: 'success'
        })
        // console.log('asyncData', res)
      }).finally(() => {
        this.loading = false
      })
    },
    curPageChange(currentPage) {
      this.page.curPage = currentPage
      this.fetchData()
    },

    handleReg(command) {
      console.log('command', command)
    },
    handleCommand(commandStr) {
      console.log('commandStr', commandStr)
      const commandArray = commandStr.split('$$')
      const command = commandArray[0]
      if (command === 'isReged') {
        const domain = commandArray[1]
        this.$store.dispatch('feedbackDomainIsReged', {
          domain,
        }).then(res => {
          this.$message({
            message: '操作成功，感谢您的反馈！',
            type: 'success'
          })
          this.fetchData()
        }).finally(() => {
          this.loading = false
        })
      } else if (command === 'cancelFav') {
        const id = commandArray[1]
        this.$store.dispatch('cancelMyFavList', {
          id,
        }).then(res => {
          this.$message({
            message: '取消成功',
            type: 'success'
          })
          this.fetchData()
        }).finally(() => {
          this.loading = false
        })
      }
    },
  }
}
</script>

<style lang="scss">
.page-fav{
}
</style>
