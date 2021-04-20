<template>
  <!--  @dragstart="dragstart" @drag="drag" -->
  <div id="wheelPannel" draggable="true" class="wheelPannel-component card">
    <!-- <div class="box" slot="reference">
      <i class="el-icon-arrow-left" @click="scrollToLeft"></i>
      <el-popover
        placement="top-start"
        title=""
        width="200"
        trigger="click"
        content="鼠标放至此区域，滚动鼠标滚轮可左右滑动页面。另外，在页面任意位置按住空格键，再滚动鼠标滚轮，也有一样的效果哦">
        <p slot="reference">左右滚动</p>
      </el-popover>
      <i class="el-icon-arrow-right" @click="scrollToRight"></i>
    </div> -->
    <!-- 操作不提醒，作为彩蛋 -->
    <div class="box">
      <i class="el-icon-arrow-left" @click="scrollToLeft"></i>
      <p>左右滚动</p>
      <i class="el-icon-arrow-right" @click="scrollToRight"></i>
    </div>
  </div>
</template>

<script>
const scrollPerDistance = 60 // 每次滚动距离

export default {
  mounted() {
    this.scroll()
    this.initDrag()
  },
  methods: {
    scrollToLeft() {
      const main = document.getElementById('main')
      main.scrollLeft -= scrollPerDistance
    },
    scrollToRight() {
      const main = document.getElementById('main')
      main.scrollLeft += scrollPerDistance
    },
    scroll() {
      const pannel = document.getElementById('wheelPannel')
      const main = document.getElementById('main')
      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mousewheelEvent, false) // FF
      }
      pannel.onmousewheel = mousewheelEvent // IE/Opera/Chrome
      function mousewheelEvent(e) {
        e = e || window.event
        var v
        e.wheelDelta ? v = e.wheelDelta : v = e.detail
        if (v > 3 || -v > 3) v = -v
        v > 0 ? main.scrollLeft += scrollPerDistance : main.scrollLeft -= scrollPerDistance

        e.preventDefault() // 阻止浏览器的默认滚动
      }
    },
    initDrag() {
      const pannel = document.getElementById('wheelPannel')
      const element = {
        clientWidth: document.body.clientWidth,
        clientHeight: document.body.clientHeight,
      }
      pannel.addEventListener('dragstart', event => {
        const rect = pannel.getBoundingClientRect()
        // console.log('dragstart', event, rect)
        element.width = rect.width
        element.height = rect.height
        // 计算鼠标与元素左上角的偏移量
        element.offsetX = event.clientX - rect.left
        element.offsetY = event.clientY - rect.top

        pannel.style.right = 'auto'
        pannel.style.bottom = 'auto'
        pannel.style.left = (event.clientX - element.offsetX) + 'px'
        pannel.style.top = (event.clientY - element.offsetY) + 'px'
      }, false)
      pannel.addEventListener('dragend', event => {
        // console.log('dragend', event, element)
        element.left = event.clientX - element.offsetX
        element.top = event.clientY - element.offsetY
        pannel.style.right = 'auto'
        pannel.style.bottom = 'auto'

        pannel.style.left = element.left + 'px'
        pannel.style.top = element.top + 'px'
        // 超出边界处理
        setTimeout(() => {
          this.resetPlace(pannel, element)
        }, 300)
      }, false)
    },
    resetPlace(pannel, element) {
      let x = element.left
      let y = element.top
      x = x >= 0 ? x : 0
      y = y >= 0 ? y : 0
      if ((x + element.width) > element.clientWidth) { // 右侧超出
        x = element.clientWidth - element.width
      }
      if ((y + element.height) > element.clientHeight) { // 下侧超出
        y = element.clientHeight - element.height
      }
      pannel.style.left = x + 'px'
      pannel.style.top = y + 'px'
    }
  }
}
</script>

<style lang="scss">
.wheelPannel-component{
  position: fixed;
  right: 50px; bottom: 50px;
  transition: all 0.3s ease-in-out;
  opacity: 1;
  z-index: 1500;
  &:hover{
    opacity: 1;
  }
  .box{
    display: flex;
    align-items: center;
    color: #999;
    white-space: nowrap;
  }
  i{
    font-size: 16px;
    padding: 10px;
    cursor: pointer;
  }
  p{
    margin: 0;
    cursor: move;
  }
}
</style>
