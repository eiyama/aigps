<template>
<!-- 录像回放 -->
  <div class="box">
    <div class="main">
      <my-video ref="video" />
      <my-map v-if="mapisShow" />
      <div v-else class="empty"></div>
    </div>
    <foot-table />
  </div>
</template>

<style lang="scss" scoped>
.box {
  position: relative;
  display: flex;
  flex-direction: column;
  .main {
    display: flex;
    flex: 1;
    .empty {
      flex: 3;
      height: 100%;
      padding: 0;
      background: #fff;
    }
  }
}
</style>

<script>
import MyVideo from './components/video'
import MyMap from './components/map'
import FootTable from './components/footTable'

export default {
  name: 'playVideo',
  components: {
    MyVideo,
    MyMap,
    FootTable
  },
  data() {
    return {
      mapisShow: true
    }
  },
  activated() {
  
  },
  // 页面离开的钩子
  deactivated() {
    
  },
  async beforeRouteLeave(to, from, next) {
    // 解决内存泄漏问题
    // 百度地图和tree组件同时卸载会造成tree组件无法卸载导致内存泄漏，这里先卸载地图组件，等待dom更新之后跳转页面卸载tree组件
    this.mapisShow = false
    await this.$nextTick()
    next()
  },
  methods: {

  }
}
</script>