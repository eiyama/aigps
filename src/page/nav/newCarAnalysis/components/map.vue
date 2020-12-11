<template>
  <!-- <div @mousedown.stop id="trail-map"></div> -->
  <baidu-map class="bm-view" ref="map" :center="center" :zoom="zoom" :mapClick="false" scrollWheelZoom ak="dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2">
    <bm-scale />
    <!-- 轨迹 -->
    <bm-polyline-new
      v-for="(v, i) of lines"
      :key="i"
      :stroke-color="v.color"
      :path="v.points"
      :stroke-weight="6"
      :isIcons="v.isIcons"
      @click="handleLine(i)"
    />
    <!-- 覆盖物，车 -->
    <bm-marker
      v-for="(v, i) of markers"
      :key="`0${i}`"
      :offset="v.offset"
      :rotation="v.rotation"
      :position="v.pt"
      :icon="v.icon"
      :zIndex="v.zIndex"
      :show="v.show"
      @click="handleMarker(i)"
    ></bm-marker>
    <!-- 车辆信息 -->
    <bm-overlay
      v-for="(v, i) of infoWin"
      :key="`01${i}`"
      ref="overlay"
      pane="labelPane"
      class="sample"
      :zIndex="v.zIndex"
      :pt="v.pt"
      :y="v.y"
      @draw="draw($event, i)"
    >
      <veh-info-win v-show="v.show" :info="v" @handleColse="handleColse" />
    </bm-overlay>
  </baidu-map>
</template>

<script>
import VehInfoWin from '@/components/map/VehInfoWin'
import { getCopyObj } from '@/utils/util'
import getLngLat from '@/utils/coordtransform'
import { BaiduMap, BmPolylineNew, BmScale, BmMarker, BmOverlay } from 'vue-baidu-map/components'

export default {
  components: {
    BmScale,
    BaiduMap,
    BmMarker,
    BmOverlay,
    BmPolylineNew,
    VehInfoWin
  },
  data() {
    const data = this.getData()
    return {
      oTrail: null,
      ...data
    }
  },
  created() {
    eventBus.$on('suspend', this.suspend)
    eventBus.$on('changeTaktTime', this.changeTaktTime)
    eventBus.$on('handlePlay', this.trailPlay)
    eventBus.$on('initData', this.initData)
    eventBus.$on('handleRow', this.handleRow)
  },
  beforeDestroy() {
    eventBus.$off('suspend', this.suspend)
    eventBus.$off('changeTaktTime', this.changeTaktTime)
    eventBus.$off('handlePlay', this.trailPlay)
    eventBus.$off('initData', this.initData)
    eventBus.$off('handleRow', this.handleRow)
    this.onDestory()
  },
  methods: {
    /**
     * 初始化数据
     */
    getData() {
      return {
        index: 0,
        pointArr: [],
        stopList: [],
        time: 500,
        switch: true,
        lineArr: [],
        markes: [],
        markers: [],
        infoWins: [],
        center: {
          lng: 116.404,
          lat: 39.915 
        },
        zoom: 7,
        lines: [],
        lineData: {},
        infoWin: []
      }
    },
    /**
     * 轨迹初始化参数
     */
    initData() {
      this.index = 0
      this.switch = true
      this.lines = []
      for (const v of this.infoWin.values()) {
        v.show = false
      }
      for (const v of this.markers.values()) {
        v.show = false
      }
    },
    /**
     * 监控页面点击关闭初始化数据
     */
    onDestory() {
      const data = this.getData()
      for (const [k, v] of Object.entries(data)) {
        this[k] = v
      }
    },
    /**
     * 点击轨迹表格行
     * @param {String} lng 经度
     * @param {String} lat 纬度
     */
    handleRow(pt) {
      console.log(pt)
      if (this.switch) return
      const data = {
        url: require('@/assets/image/map/locationIcon.png'),
        w: 32,
        h: 32,
        y: -18,
        id: 'postion',
        pt
      }
      this.setMarker(data)
      // 以经纬度为中心点平移地图
      this.center = pt
    },
    /**
     * 播放轨迹
     * @param {Array} arr 轨迹数据
     * @param {Array} stop 停车点数据
     */
    async trailPlay(arr, stopArr) {
      if (arr) {
        this.pointArr = arr
        this.stopList = stopArr
        await this.drawLine(arr)
        this.drawStopMarke(stopArr)
      }
      const { index, pointArr, infoWin, markers } = this
      const length = pointArr.length
      if (!length) {
        return
      }
      const v = pointArr[index]
      const curPt = v.BDPt
      // 当前点不在可视区的时候地图会以当前点为中心移动
      if (!this.$refs.map.isVisualArea(curPt)) {
        this.center = curPt
      }
      const vehData = {
        url: require('@/assets/image/map/hc.png'),
        w: 15,
        id: 'veh',
        popupId: 'base',
        pt: curPt,
        zIndex: 2,
        rotation: v.gpsDirect
      }
      // 车辆marker
      this.setMarker(vehData)

      const item = infoWin.find(e => e.id === vehData.popupId)
      if (!item || ((index === 0 || item.show) && item.markerId === vehData.id)) {
        const index = markers.findIndex(e => e.id === vehData.id)
        if (index > -1) {
          this.handleMarker(index)
        }
      }
      
      if (index === 0) {
        this.zoom = 12
      } else if (index === length - 1) {
        this.switch = false
        this.index = 0
        eventBus.$emit('changeState', 3)
      }

      this.index++
      eventBus.$emit('setSlider', index)
      setTimeout(() => {
        if (this.switch) {
          this.trailPlay()
        }
      }, this.time)
    },
    /**
     * 经纬度数据
     */
    drawLine(pointArr) {
      return new Promise(resolve => {
        let points = []
        let distance = 0
       for (const [i, v] of pointArr.entries()) {
         points.push(v.BDPt)
         if (points.length > 1) {
           distance += this.$refs.map.getDistances(points)
           const isEnd = i === pointArr.length - 1
           if (distance >= 15000 || isEnd) {
             const obj = {
              points: getCopyObj(points),
              color: v.gpsSpeed <= 80 ? 'green' : 'red',
              isIcons: i !== pointArr.length - 1,
              id: 'line',
              popupId: 'base',
              pt: v.BDPt
            }
            this.lines.push(obj)
            points = points.slice(-1)
            distance = 0
           }

           if (isEnd) {
             this.setStartEndMarker(false, v.BDPt)
           }
          } else {
            this.setStartEndMarker(true, v.BDPt)
          }

       }
       resolve()
      })
    },
    /**
     * 绘制停车点
     * @param {Array} stopArr 停车点的数据
     */
    drawStopMarke(stopArr) {
      if (!(stopArr instanceof Array) || !stopArr.length) return
        const { pointArr } = this
      for (const v of stopArr.values()) {
        const startTime = new Date(v.stopStartTime).getTime()
        const elem = pointArr.find(e => new Date(e.gpstime).getTime() >= startTime)
        if (elem) {
          this.setMarker(
            {
              url: require('@/assets/image/map/mapTrailIcon2.png'),
              w: 18,
              h: 18,
              id: 'stop',
              popupId: 'stop',
              pt: v.BDPt,
              isAdd: true
            }
          )
        }
      }
    },
    /**
     * 设置起始点与终点的marker
     * @param {Boolean} isStart true为起始点，false为终点
     * @param {Object} pt 当前点的经纬度
     */
    setStartEndMarker(isStart, pt) {
      const url = isStart ? require('@/assets/image/map/shi.png') : require('@/assets/image/map/zhong.png')
      const id = isStart ? 'start' : 'end'
      this.setMarker(
        {
          url,
          y: -18,
          id,
          popupId: 'base',
          pt
        }
      )
    },
    /**
     * 设置marker,没有就创建，有就修改
     */
    setMarker(opt) {
      const index = opt.isAdd ? -1 : this.markers.findIndex(elem => elem.id === opt.id)
      if (index > -1) {
        this.$set(this.markers[index], 'pt', opt.pt)
        this.$set(this.markers[index], 'show', true)
        this.$set(this.markers[index], 'rotation', opt.rotation || 0)
      } else {
        const data = {
          icon: {
            url: opt.url,
            size: {
              width: opt.w || 28,
              height: opt.h || 34
            }
          },
          offset: {
            height: opt.y || 0,
            width: opt.x || 0
          },
          pt: opt.pt,
          id: opt.id,
          popupId: opt.popupId,
          rotation: opt.rotation || 0,
          show: true,
          zIndex: opt.zIndex || 1
        }
        this.markers.push(data)
      }
    },
    /**
     * 自定义覆盖物改变postion的值
     */
    draw ({ el, BMap, map, pt }, i) {
      const { lng, lat } = pt
      const { infoWin } = this
      if (!infoWin.length) {
        return
      }
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      console.log(pixel);
      // el.style.left = pixel.x - 60 + 'px'
      const w = infoWin[i].css.width.replace('px', '')
      el.style.left = pixel.x + 14 - (w / 2) + 'px'
      el.style.bottom = -pixel.y - infoWin[i].y + 40 + 'px'
    },
    /**
     * 点击轨迹线
     * @param {Number} i 该线的下标
     */
    handleLine(i) {
      this.handleMarker(i, true)
    },
    /**
     * 点击marker点
     * @param {Number} i 下标
     * @param {Boolean} isLine true为点击的line，false不是
     */
    handleMarker(i, isLine) {
      const { markers, pointArr, stopList, lines } = this
      let obj = markers[i]
      if (isLine) {
        obj = lines[i]
      }
      // 证明点击的点不需要infoWin
      if (!obj.popupId) {
        return
      }
      let item
      let keys
      if (!isLine && obj.id === 'stop') {
        item = stopList.find(e => e.BDPt === obj.pt)
        keys = this.$t('carAnalysis.stopInfo')        
      } else {
        item = pointArr.find(e => e.BDPt === obj.pt)
        keys = this.$t('carAnalysis.baseInfo')
      }
      console.log(keys);
      if (item) {
        item.id = obj.popupId
        item.y = obj.offset ? obj.offset.height : 0
        item.markerId = obj.id
        this.setInfoWin(item, keys)
      }
    },
    /**
     * 设置infoWin，有就修改数据，没有就添加
     */
    setInfoWin(info, keys) {
      const { infoWin } = this
      const baseInfo = []
      for (const v of keys.values()) {
        if (info[v.key] || !v.required) {
          const obj = {}
          obj.label = v.name
          const val = info[v.key] || info[v.key] == 0 ? info[v.key] : ''
          obj.val = `${val}${v.unit || ''}`
          baseInfo.push(obj)
        }
      }
      const index = infoWin.findIndex(e => info.id === e.id)

      if (index > -1) {
        this.$set(infoWin[index], 'title', `车辆：${info.vehPlateNo}`)
        // this.$set(infoWin[index], 'title', `设备号：${info.vehTerminalNo}`)
        this.$set(infoWin[index], 'baseInfo', baseInfo)
        this.$set(infoWin[index], 'show', true)
        this.$set(infoWin[index], 'pt', info.BDPt)
        this.$set(infoWin[index], 'y', info.y)
        this.$set(infoWin[index], 'markerId', info.markerId)        
      } else {
        const data = {
          title: `车辆：${info.vehPlateNo}`,
          css: {
            width: '330px'
          },
          baseInfo,
          show: true,
          zIndex: 3,
          index: infoWin.length,
          pt: info.BDPt,
          id: info.id,
          y: info.y,
          markerId: info.markerId
        }
        infoWin.push(data)
      }
    },
    /**
     * 点击关闭infoWin
     */
    handleColse(index) {
      const { infoWin } = this
      this.$set(infoWin[index], 'show', false)
    },
    /**
     * 根据经纬度获取地址
     */
    getLocation(pt) {
      return this.$refs.map.getLocation(pt)
    },
    /**
     * 获取百度经纬度
     * @param {String} lng 经度
     * @param {String} lng 纬度
     * @return {Object} 返回包含经纬度的json
     */
    getPoint(lng, lat) {
      const BDPt = getLngLat(lng, lat, 'gcj02tobd09')
      return BDPt
    },
    /**
     * 暂停或者播放
     * @param {Boolean} state 状态值
     */
    suspend(state) {
      this.switch = state;
    },
    /**
     * 改变划线的间隔时间
     * @param {Number} times 间隔时间（ms）
     */
    changeTaktTime(times) {
      this.time = times
    }
  }
}
</script>

<style lang="scss" scoped>
#trail-map,
.bm-view {
  width: 100%;
  padding: 0;
  height: 100%;
  background: #fff;
  .sample {
    position: absolute;
  }
}
</style>