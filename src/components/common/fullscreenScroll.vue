<template>
  <div id="js-fullscreenScroll" class="fullscreenScroll-component" :class="{'show': showCover}"></div>
</template>

<script>
const scrollPerDistance = 60 // 每次滚动距离

export default {
  data() {
    return {
      showCover: false
    }
  },
  mounted() {
    this.documentScroll()
  },
  methods: {
    documentScroll() {
      const pannel = document.getElementById('js-fullscreenScroll')
      const main = document.getElementById('main')
      let showCover = false
      document.addEventListener('keydown', e => {
        if (e.keyCode === 32) {
          this.showCover = true
          showCover = true
        }
      })
      document.addEventListener('keyup', e => {
        if (e.keyCode === 32) {
          this.showCover = false
          showCover = false
        }
      })

      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', mousewheelEvent, false) // FF
      }
      pannel.onmousewheel = mousewheelEvent // IE/Opera/Chrome
      function mousewheelEvent(e) {
        // console.log('mousewheelEvent e:', e, showCover)
        if (showCover) {
          e = e || window.event
          var v
          e.wheelDelta ? v = e.wheelDelta : v = e.detail
          if (v > 3 || -v > 3) v = -v
          v > 0 ? main.scrollLeft += scrollPerDistance : main.scrollLeft -= scrollPerDistance

          e.preventDefault() // 阻止浏览器的默认滚动
        }
      }
    },
  }
}
</script>

<style lang="scss">
.fullscreenScroll-component{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // background-color: rgba(0, 0, 0, 0.5);
  z-index: 4000;
  display: none;
  &.show{
    display: block;
  }
}
</style>
