<template>
  <div class="com-add">
    <el-button type="primary" @click="add" icon="el-icon-plus" class="addBtn">发表文章</el-button>
    <!-- <addArticle></addArticle> -->
  </div>
</template>

<script>
// import addArticle from '@/views/addArticle'
export default {
  // components: { addArticle, },
  methods: {
    add() {
      this.$store.commit('ARTICLE_SET', {
        target: 'editArticleDetail',
        data: {}
      })
      this.$store.commit('ARTICLE_SET', {
        target: 'addArticleVisible',
        data: true
      })
    }
  }
}
</script>

<style lang="scss">
.com-add{
  margin: 10px;
  .addBtn{
    display: block;
    width: 100%;
  }
}
</style>
