<template>
  <div class="error-content">
    <div class="text-wrapper card">
      <p class="text">
        哎呀！<br>你访问的页面不在啦！
      </p>
      <p>
        <a href="/">返回首页</a>
      </p>
    </div>
  </div>
</template>
<script>
export default {
}
</script>

<style lang="scss">
.error-content {

  font-size: 14px;
  line-height: 1.5;
  a {
    color: #009AFF;
  }
  .text-wrapper{
    padding: 180px 20px;
    text-align: center;
  }
}
</style>
