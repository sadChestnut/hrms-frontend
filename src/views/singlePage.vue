<template>
  <div>
    <top-bar class="top-bar-style" style="background-color:#545c64;color: #ffffff;"></top-bar>
    <router-view transition="fade" transition-mode="out-in" class="singlepage-content-style"></router-view>
  </div>
</template>
<script>
import topBar from '@/components/topBar'
export default {
  components: { topBar }
}
</script>
<style lang="less">
body {
  margin: 0;
  background: #f0f2f5;
  .singlepage-content-style {
    margin: 30px;
  }
}
</style>
