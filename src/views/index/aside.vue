<template>
  <div class="aside">
    <div class="card">
      <add></add>
    </div>
  </div>
</template>

<script>
import add from '@/components/add'
export default {
  components: { add, },
}
</script>

<style lang="scss">
.aside{
  width: 130px;
  flex: 0 0 auto;
  .card{
    overflow: hidden;
  }
}
</style>
