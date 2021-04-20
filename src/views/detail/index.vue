<template>
  <div class="articleDetail card" :class="[{'hasTocNav': articleDetail.type === 1}, {'isCollapse': tocNavIsCollapse}]">
    <div class="main">
      <h1 class="title">{{ articleDetail.title }}</h1>
      <div class="props">
        <i class="el-icon-time"></i> 发布于 {{ articleDetail.create_time | formatDate }}
        <!-- <i class="el-icon-circle-check"></i> 有 5000 人赞同 -->
      </div>
      <div class="summary">
        {{ articleDetail.summary }}
      </div>
      <div v-show="articleDetail.type === 1" id="content" class="content">
        <textarea style="display:none;"></textarea>
      </div>
      <div v-show="articleDetail.type === 2" class="content">
        <a :href="articleDetail.url" class="content-link" target="_blank">
          <div class="title">{{ articleDetail.title }}</div>
          <div class="url"><i class="el-icon-link"></i> {{ urlDomain }}</div>
        </a>
      </div>
      <!-- 底部部分 -->
      <el-divider>END</el-divider>
      <div class="tags">
        <el-tag>标签一</el-tag>
      </div>
      <!-- <div class="feedback">
        <span>您是否赞同本文内容？</span>
        <el-button-group>
          <el-button plain size="mini" round><i class="el-icon-check"></i> 赞同 5000</el-button>
          <el-button plain size="mini" icon="el-icon-caret-bottom" round>不赞同</el-button>
        </el-button-group>
        <span>有错误，我要纠正。</span>
      </div> -->
      <!-- <el-divider></el-divider> -->
    </div>
    <!-- 目录 -->
    <tocNav></tocNav>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tocNav from '@/components/article/tocNav'
export default {
  components: { tocNav, },
  asyncData({ store, route }) {
    console.log('detail route', route.params.id)
    return store.dispatch('fetchArticleDetail', route.params.id).then(res => {
      // console.log('asyncData', res)
    })
  },
  data() {
    return {
      tocNavIsCollapse: false,
    }
  },
  computed: {
    ...mapState({
      articleDetail: state => state.article.articleDetail,
    }),
    urlDomain() {
      return this.articleDetail.url
    }
  },
  watch: {
    articleDetail: function() {
      this.previewContent()
    }
  },
  mounted() {
    this.previewContent()
  },
  methods: {
    previewContent() {
      $('#content').html('')
      $('#custom-toc-container').html('')
      if (this.articleDetail.type === 1) {
        this.$nextTick(() => {
          editormd.markdownToHTML('content', {
            markdown: this.articleDetail.content, // Also, you can dynamic set Markdown text
            // htmlDecode: true, // Enable / disable HTML tag encode.
            htmlDecode: 'style,script,iframe', // Note: If enabled, you should filter some dangerous HTML tags for website security.
            tocm: true,
            tocContainer: '#custom-toc-container', // 自定义 ToC 容器层
          })
        })
      }
    },
    close() {
      this.$store.commit('ARTICLE_SET', {
        target: 'articleDetailVisible',
        data: false
      })
    },
    handleCollapse(isCollapse) {
      console.log('handleCollapse isCollapse:', isCollapse)
      this.tocNavIsCollapse = isCollapse
    }
  }
}
</script>

<style lang="scss">
.articleDetail{
  position: relative;
  overflow: initial;
  &.hasTocNav{ // 有目录
    margin-right: 230px;
    &.isCollapse{ // 目录收起
      margin-right: 41px;
    }
  }
  .main{
    height: calc(100%);
    padding: 0 32px;
    overflow-y: scroll;
    overflow-x: hidden;
    .title{
      font-weight: 600;
      font-size: 24px;
      line-height: 1.22;
      margin: 24px 0;
      word-wrap: break-word;
    }
    .props{
      font-size: 14px;
      color: #8590a6;
      margin: 16px 0;
    }
    .summary{
      color: #777;
      background-color: #f6f6f6;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .content{
      margin-bottom: 20px;
      overflow-x: hidden;
    }
    .content-link{
      display: block;
      width: 400px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f6f6f6;
      border-left: 5px solid #d9ecff;
      border-radius: 0 4px 4px 0;
      .title{
        font-size: 16px;
        font-weight: 800;
        margin-bottom: 6px;
        @include cutText();
      }
      .url{
        white-space: nowrap;
        font-size: 14px;
        color: #999;
        @include cutText();
      }
    }
    .tags{
      margin-bottom: 20px;
    }
    .feedback{
      padding: 10px 32px;
      margin-left: -32px;
      margin-right: -32px;
      position: sticky;
      bottom: 0;
      background-color: #fff;
      border-top: 1px solid #eee;
      .el-button-group{
        margin: 0 10px;
      }
    }
  }
  .closer{
    position: absolute;
    bottom: 80px;
    right: 50px;
    margin-left: calc(100% -60px);

    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 20px;
    line-height: 40px;
    font-size: 30px;
    border: 1px solid #f6f6f6;
    background-color: #fff;
    text-align: center;
    transition: all 0.3s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      font-size: 16px;
      white-space: nowrap;
      display: none;
      overflow: hidden;
      margin-left: 12px;
      transition: all 0.3s ease-in-out;
    }
    &:hover{
      transform: rotate(180deg);
    }
    // &:hover{
    //   width: 120px;
    //   span{
    //     display: inline-block;
    //   }
    // }
  }
}
</style>
