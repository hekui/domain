<template>
  <div class="page-domain">
    <!-- 域名列表区域 -->
    <el-row>
      <el-col :span="24">
        <div class="card">
          <div class="title">
            最近过期可注册域名 <i v-if="loading" class="el-icon-loading"></i>
          </div>
          <!-- <el-menu :default-active="articleType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.id">{{ item.name }}</el-menu-item>
          </el-menu> -->

          <el-alert
            title="若发现域名已被抢注，请反馈给我们，以便移除，谢谢！"
            close-text="已阅"
            type="warning">
          </el-alert>
          <!-- 过滤区域 -->
          <el-form :inline="true" :model="filter" size="small" class="filter-form">
            <el-form-item label="关键词">
              <el-input v-model="filter.keyword" placeholder="支持空格" clearable></el-input>
            </el-form-item>
            <el-form-item label="域名长度">
              <el-select v-model="filter.min" class="filter-length">
                <el-option v-for="num in 20" :key="num" :label="num" :value="num"></el-option>
              </el-select> - <el-select v-model="filter.max" class="filter-length">
                <el-option label="不限" value=""></el-option>
                <el-option v-for="num in 20" :key="num" :label="num" :value="num"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="域名后缀">
              <el-input v-model="filter.suffix" placeholder="逗号分隔" clearable></el-input>
            </el-form-item>
            <el-form-item label="过期日期">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                @change="changeDate">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="submitFilter">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="domainList">
            <el-table
              :data="domainList.list"
              stripe
              style="width: 100%">
              <el-table-column
                type="index"
                align="center"
                label="序号"
                width="80">
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
                width="120">
              </el-table-column>
              <el-table-column
                prop="canReg"
                align="center"
                label="可否注册"
                width="120">
                <template slot-scope="scope">
                  <span v-if="scope.row.canReg === 1" class="success">是</span>
                  <span v-else-if="scope.row.canReg === 2" class="danger">否</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="expireTime"
                label="过期日期"
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
                      <el-dropdown-item :command="'addFav$$'+ scope.row.id">收藏</el-dropdown-item>
                      <el-dropdown-item :command="'isReged$$'+ scope.row.domain">已被抢注</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
            <div class="pages clearfix">
              <div class="page-tips fl gray">最多展示 100 页数据，请使用条件筛选过滤。</div>
              <el-pagination
                background
                class="fr"
                layout="prev, pager, next, jumper"
                :current-page="page.curPage"
                :page-size="page.pageSize"
                :total="domainList.page.total"
                @current-change="curPageChange">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 右侧 -->
    <!-- <myAside class="transition column"></myAside> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

const menuListHome = [{
  id: '2',
  name: '推荐'
}, {
  id: '3',
  name: '关注'
}, {
  id: '1',
  name: '最新'
}]

const pickerOptions = {
  shortcuts: [{
    text: '昨日',
    onClick(picker) {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      picker.$emit('pick', [start, start])
    }
  }, {
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

const cubic = value => Math.pow(value, 3)
const easeInOutCubic = value => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2

const filterDefault = {
  keyword: '',
  min: 1,
  max: '',
  suffix: 'com,net,org',
  startDate: '',
  endDate: '',
}

export default {
  name: 'Domain',
  asyncData({ store, route }) {
    return store.dispatch('fetchDomainList', filterDefault)
  },
  data() {
    return {
      // menuActiveIndex: '1',
      // menuList: [{}],
      filter: filterDefault,
      dateRange: [],
      pickerOptions,
      page: {
        curPage: 1,
        pageSize: 20,
      },
      loading: false,
      isWide: false,
    }
  },
  computed: {
    ...mapState({
      domainList: state => state.domain.domainList,
    }),
    menuList() {
      if (this.curCategoryId) {
        return [{ id: '1', name: '最新' }]
      } else {
        return menuListHome
      }
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('fetchDomainList', Object.assign({}, this.filter, this.page)).then(res => {
        this.$message({
          message: '加载成功',
          type: 'success'
        })
        // console.log('asyncData', res)
      }).finally(() => {
        this.loading = false
      })
    },
    changeDate() {
      if (this.dateRange) {
        this.filter.startDate = this.dateRange[0]
        this.filter.endDate = this.dateRange[1]
      } else { // 被清空后
        this.filter.startDate = ''
        this.filter.endDate = ''
      }
    },
    curPageChange(currentPage) {
      this.page.curPage = currentPage
      this.fetchData()
      this.scrollToTop()
    },
    scrollToTop() {
      const el = document.documentElement
      const beginTime = Date.now()
      const beginValue = el.scrollTop
      const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500
        if (progress < 1) {
          el.scrollTop = beginValue * (1 - easeInOutCubic(progress))
          rAF(frameFunc)
        } else {
          el.scrollTop = 0
        }
      }
      rAF(frameFunc)
    },
    submitFilter() {
      this.page.curPage = 1
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
      } else if (command === 'addFav') {
        const id = commandArray[1]
        this.$store.dispatch('addMyFavList', {
          id,
        }).then(res => {
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        }).catch(e => {
          this.$message({
            message: e.msg,
            type: 'error'
          })
        }).finally(() => {
          this.loading = false
        })
      }
    },
    goCheckReg(row) {
      const reg = /(.*?)\.(.*)/
      const results = reg.exec(row.domain)
      const url = `http://www.xinnet.com/domain/domainQueryResult.html?prefix=${results[1]}&suffix=.${results[2]}`
      window.open(url)
    }
  }
}
</script>

<style lang="scss">
.page-domain{
  .filter-form{
    margin-top: 18px;
    padding-left: 15px;
    border-bottom: 1px solid #e6e6e6;
    .filter-length{
      width: 70px;
    }
  }
  .title{
    font-size: 16px;
    font-weight: bold;
    padding: 15px 0 15px 10px;
    border-bottom: 1px solid #e6e6e6;
  }
  .btn-check{
    margin-right: 15px;
  }
  .login-guide{
    padding: 15px;
    text-align: center;
    background-color: #eee;
    // color: #fff;
  }
}
</style>
