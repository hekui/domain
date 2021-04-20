function getMeta(vm) {
  const {
    meta
  } = vm.$options

  if (meta) {
    return typeof meta === 'function' ? meta.call(vm) : meta
  }
}

const serverMetaMixin = {
  created() {
    const meta = getMeta(this)
    if (meta) {
      if (meta.title) {
        this.$ssrContext.title = `${meta.title}`
      }
      if (meta.keywords) {
        this.$ssrContext.keywords = `${meta.keywords}`
      } else {
        if (meta.title) {
          this.$ssrContext.keywords = `${meta.title}`
        }
      }
      if (meta.description) {
        this.$ssrContext.description = `${meta.description}`
      } else {
        if (meta.title) {
          this.$ssrContext.description = `${meta.title}`
        }
      }
    }
  }
}

const clientMetaMixin = {
  mounted() {
    const meta = getMeta(this)
    if (meta) {
      document.title = `${meta.title}`
    }
  }
}

export default process.env.VUE_ENV === 'server'
  ? serverMetaMixin
  : clientMetaMixin
