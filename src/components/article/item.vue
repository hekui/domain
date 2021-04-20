<template>
  <div class="article-item transition">
    <div class="content">
      <div v-if="item.cover" class="cover">
        <el-image
          style="width: 115px; height: 115px"
          :src="item.cover"
          fit="cover"></el-image>
      </div>
      <div class="text">
        <router-link :to="'/detail/'+ item.id">
          <h2 class="title">{{ item.title }}</h2>
          <div class="summary">{{ item.summary }}</div>
        </router-link>
        <a v-if="item.type === 2" :href="item.url" class="link-wrap" target="_blank">
          <i class="el-icon-link"></i><span>{{ item.url }}</span>
        </a>
      </div>
    </div>
    <div class="props">
      <div class="time-wrap">
        <i class="el-icon-time"></i> {{ item.create_time | formatTime }}
      </div>
      <div class="icon-group">
        <a href="" class="prop-item"><i class="el-icon-star-off"></i> 收藏</a>
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="prop-item">
            <i class="el-icon-more"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="reviseArticle">内容有误</el-dropdown-item>
            <el-dropdown-item command="reportArticle">举报</el-dropdown-item>
            <el-dropdown-item command="shareArticle" divided>分享给朋友</el-dropdown-item>
            <el-dropdown-item v-if="userInfo.id === item.author_id" command="editArticle" divided>编辑文章</el-dropdown-item>
            <el-dropdown-item v-if="userInfo.id === item.author_id">
              <el-popconfirm
                title="确定删除该文章吗？"
                @onConfirm="handleDeleteArticle"
              >
                <span slot="reference">删除文章</span>
              </el-popconfirm>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- <div class="props">
      <el-button-group>
        <el-button plain size="mini" round><i class="el-icon-check"></i> 赞同 5000</el-button>
        <el-button plain size="mini" icon="el-icon-caret-bottom" round>不赞同</el-button>
      </el-button-group>
      <div class="icon-group">
        <a href="" class="prop-item"><i class="el-icon-s-comment"></i> 134 条评论</a>
        <a href="" class="prop-item"><i class="el-icon-star-off"></i> 收藏</a>
        <el-dropdown class="prop-item" trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>内容有误</el-dropdown-item>
            <el-dropdown-item>举报</el-dropdown-item>
            <el-dropdown-item divided>分享给朋友</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

const commandMap = {
  reviseArticle: function() {},
  reportArticle: function() {},
  shareArticle: function() {},
  editArticle: function() {
    this.$store.commit('ARTICLE_SET', {
      target: 'editArticleDetail',
      data: this.item,
    })
    this.$store.commit('ARTICLE_SET', {
      target: 'addArticleVisible',
      data: true
    })
  },
  deleteArticle: function() {},
}

export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.account.userInfo,
    }),
  },
  methods: {
    showDetail() {
      this.$store.commit('ARTICLE_SET', {
        target: 'articleDetail',
        data: this.item,
      })
      this.$store.commit('ARTICLE_SET', {
        target: 'articleDetailVisible',
        data: true
      })
    },
    handleCommand(command) {
      // console.log('command', command)
      command && commandMap[command].call(this)
    },
    handleDeleteArticle() {
      this.$store.dispatch('deleteArticle', {
        id: this.item.id
      }).then(res => {
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.warning('删除失败')
      })
    }
  }
}
</script>

<style lang="scss">
.article-item{
  padding: 20px;
  border-bottom: 1px solid #f0f2f7;
  border-right: 3px solid transparent;
  &:hover{
    border-right-color: #76839b;
  }
  .title{
    font-size: 18px;
    font-weight: 600;
    line-height: 1.6;
    color: #1a1a1a;
    margin-top: 0;
    margin-bottom: 10px;
    display: block;
    &:hover{
      color: #175199;
    }
  }
  .content{
    display: flex;
    justify-content: space-between;
    .cover{
      width: 115px;
      margin-right: 18px;
      flex-shrink: 0;
    }
    .text{
      flex-grow: 1;
    }
    .summary{
      font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
      font-size: 15px;
      line-height: 1.67;
      color: #777;
      &:hover{
        color: #555;
      }
    }
    .link-wrap{
      display: flex;
      align-items: center;
      color: #999;
      margin-top: 5px;
      i{
        flex-shrink: 0;
      }
      span{
        width: 50px;
        flex: 1;
        display: inline-block;
        margin-left: 5px;
        @include cutText();
      }
    }
  }
  .props{
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .time-wrap{
      color: #999;
    }
    .icon-group{
      height: 29px;
      margin-left: 10px;
      display: flex;
      align-items: center;
    }
    .prop-item{
      height: 29px;
      line-height: 29px;
      padding: 0 10px;
      border-radius: 4px;
      margin: 0 4px;
      color: #8590a6;
      cursor: pointer;
      &:hover{
        color: #76839b;
        background-color: #eee;
      }
    }
    // .el-dropdown{
    //   margin-left: 10px;
    //   color: #8590a6;
    // }
  }
}
</style>
