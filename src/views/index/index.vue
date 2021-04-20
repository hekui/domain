<template>
  <el-row class="page-index">
    <!-- 域名列表区域 -->
    <el-col :span="20">
      <div class="mainColumn column card">
        <div class="title">
          最近过期可注册域名推荐
        </div>
        <!-- <el-menu :default-active="articleType" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item v-for="(item, index) in menuList" :key="index" :index="item.id">{{ item.name }}</el-menu-item>
        </el-menu> -->

        <el-alert
          title="若发现域名已被抢注，请反馈给我们，以便移除，谢谢！"
          close-text="知道了"
          :closable="false"
          type="warning">
        </el-alert>
        <div class="domainList">
          <el-table
            :data="indexRecommendList"
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
                <!-- <a href=""></a> -->
                <el-button
                  class="btn-check"
                  @click.native.prevent="goCheckReg(scope.row)"
                  type="text"
                  size="medium">
                  {{ scope.row.domain }}
                </el-button>
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
              <template>
                <span class="green">是</span>
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
                <el-dropdown split-button type="primary" size="medium" @click="handleClick(scope.row)">
                  立即抢注
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>已被抢注</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <div class="login-guide">
            <!-- <div class="logined">
              已登录，<router-link to="/domain">查看更多优质域名</router-link>。
            </div> -->
            <div class="unlogined">
              <router-link to="/domain">登录</router-link> 后查看更多优质域名。
            </div>
          </div>

          <!-- <el-pagination
            background
            class="pages"
            layout="prev, pager, next"
            :total="1000">
          </el-pagination> -->
        </div>
      </div>
    </el-col>
    <!-- 右侧 -->
    <myAside class="transition column"></myAside>
  </el-row>
</template>

<script>
import { mapState } from 'vuex'
import myAside from './aside'

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

export default {
  components: {
    myAside,
  },
  asyncData({ store, route }) {
    return store.dispatch('fetchIndexRecommendList').then(res => {
      // console.log('asyncData', res)
    })
  },
  data() {
    return {
      // menuActiveIndex: '1',
      // menuList: [{}],
      isWide: false,
    }
  },
  computed: {
    ...mapState({
      indexRecommendList: state => state.domain.indexRecommendList,
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
    handleClick() {},
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
.page-index{
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
  .pages{
    padding: 15px;
    text-align: right;
  }
}
</style>
