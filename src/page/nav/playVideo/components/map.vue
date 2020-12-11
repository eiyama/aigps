<template>
  <baidu-map class="bm-view" ref="map" :center="center" :zoom="zoom" :mapClick="false" scrollWheelZoom ak="dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2"></baidu-map>
</template>

<script>
import { BaiduMap } from 'vue-baidu-map/components'

export default {
  components: {
    BaiduMap
  },
  data() {
    return {
      center: {
        lng: 116.404,
        lat: 39.915 
      },
      zoom: 7
    }
  }
}
</script>

<style scoped>
.bm-view {
  flex: 3;
  height: 100%;
  padding: 0;
  background: #fff;
}
</style>