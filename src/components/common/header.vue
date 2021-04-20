<template>
  <div class="header-inner">
    <div class="logo">LOGO</div>
    <div class="menu-wrap">
      <el-menu :default-active="menuIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/domain">淘域名</el-menu-item>
        <el-menu-item index="/words">资讯</el-menu-item>
      </el-menu>
      <!-- <div class="search">
        <el-input
          placeholder="搜索文章或词条"
          v-model="keyword">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div> -->
    </div>
    <div class="header-userInfo">
      <router-link to="/user" class="header-userInfo">
        <img class="avatar" width="30" height="30" src="https://pic1.zhimg.com/0f4881f9b_is.jpg" srcset="https://pic1.zhimg.com/0f4881f9b_im.jpg 2x">
        无极
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuIndex: '/',
      keyword: ''
    }
  },
  mounted() {
    // console.log('this.$route', this.$route)
    this.menuIndex = this.$route.fullPath
  },
  methods: {
    handleSelect(index) {
      this.$router.push(index)
    }
  },
}
</script>

<style lang="scss">
.header-inner{
  width: 1000px;
  height: 52px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo{
    width: 100px;
    height: 40px;
    background-color: #f6f6f6;
    line-height: 40px;
    text-align: center;
  }
  .menu-wrap{
    // flex: 1 0;
    display: flex;
    align-items: center;
    .search{
      margin-left: 20px;
    }
  }
  .header-userInfo{
    display: flex;
    align-items: center;
    .avatar{
      margin-right: 10px;
    }
  }
}
</style>
