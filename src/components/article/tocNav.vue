<template>
  <div class="toc-container card" :class="{hide: !visible}">
    <div class="toc-handle card" @click="hide">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="toc-main">
      <h3>文章目录</h3>
      <div id="custom-toc-container" class="markdown-body editormd-preview-container"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
    }
  },
  methods: {
    hide() {
      this.visible = !this.visible
      this.$emit('collapse', !this.visible)
    }
  }
}
</script>

<style lang="scss">
.toc-container{
  position: absolute;
  right: -221px;
  top: 0;
  width: 220px;
  // max-height: calc(100vh - 62px - 10px);
  background-color: #fff;

  transition: all .3s ease-in-out;
  &.hide{
    right: -1px;
    width: 0;
    .toc-handle{
      transform: rotate(-180deg);
      right: -40px;
    }
    .toc-main{
      width: 0;
    }
  }
  .toc-handle{
    position: absolute;
    top: 0;
    right: 6px;
    z-index: 1000;
    width: 40px;
    height: 40px;
    font-size: 26px;
    color: #777;
    background-color: #fff;
    text-align: center;
    line-height: 40px;
    box-shadow: none;
    cursor: pointer;
    transition: all .3s ease-in-out;
  }
  .toc-main{
    width: 220px;
    max-height: calc(100vh - 62px - 10px);
    overflow-x: hidden;
    overflow-y: scroll;
    transition: all .3s ease-in-out;
    .markdown-body{
      width: 214px;
    }
    h3 {
      position: sticky;
      top: 0;
      margin: 0;
      height: 41px;
      line-height: 41px;
      padding-left: 10px;
      margin-bottom: 10px;
      font-size: 16px;
      border-bottom: 1px solid #e6e6e6;
      background-color: #fff;
      white-space: nowrap;
    }
  }
}
</style>
