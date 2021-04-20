<template>
  <div class="user-layout">
    <div class="user-header card">
      <div class="user-cover">
        <el-image
          style="width: 100%; height: 100%"
          src="https://pic2.zhimg.com/80/v2-fe922a5a112e6fc12b34bff31b9b5710_r.jpg"
          fit="cover"
        >
          <div slot="error" class="user-cover-error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <!-- <img
          src="https://pic2.zhimg.com/80/v2-fe922a5a112e6fc12b34bff31b9b5710_r.jpg"
          alt="用户封面"
        /> -->
      </div>
    </div>
    <div class="user-body clearfix">
      <div class="user-aside">
        <div class="user-info card">
          <el-avatar shape="square" :size="100" fit="cover" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
          <p class="nickname">无极</p>
          <div>
            <!-- <div class="user-level">普通会员</div> -->
            <div class="user-level level">季度会员</div>
            <div class="user-expire gray">有效期至：2020-08-26</div>
            <div>
              <el-button size="small" @click="goUpgrade">立即升级</el-button>
            </div>
          </div>
        </div>
        <el-menu :default-active="activeIndex" class="menus card" @select="handleSelect">
          <el-menu-item index="/user">首页</el-menu-item>
          <el-menu-item index="/user/upgrade">升级会员</el-menu-item>
          <el-menu-item index="/user/fav">我的收藏</el-menu-item>
          <el-menu-item index="/user/repair">补跑数据</el-menu-item>
          <!-- <el-menu-item index="3" disabled>消息中心</el-menu-item>
          <el-menu-item index="4">订单管理</el-menu-item> -->
        </el-menu>
      </div>
      <div class="user-view card">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      activeIndex: '/user'
    }
  },
  created() {
    // console.log('this.$route', this.$route)
    this.activeIndex = this.$route.path
  },
  methods: {
    handleSelect(index) {
      console.log('index', index)
      this.$router.push(index)
    },
    goUpgrade() {
      this.$router.push('/user/upgrade')
    }
  }
}
</script>

<style lang="scss">
.user-layout {
  margin-top: 10px;
  padding-bottom: 10px;
  .user-header{
    margin-bottom: 15px;
    overflow: hidden;
  }
  .user-cover{
    height: 240px;
    background-color: #eee;
    .user-cover-error{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
      color: #909399;
    }
  }

  .user-aside{
    width: 210px;
    float: left;
    .user-info{
      padding: 20px 0;
      margin-bottom: 10px;
      text-align: center;
      .nickname{
        font-size: 16px;
        font-weight: 800;
      }
      .user-level{
        margin-bottom: 4px;
      }
      .user-expire{
        font-size: 12px;
        margin-bottom: 8px;
      }
    }
  }
  .user-view{
    margin-left: 225px;
    padding: 20px;
  }

  // 子页面  公共样式
  .user-title{
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
}
</style>
