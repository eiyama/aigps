<!-- 查看位置的地图弹窗 -->
<template>
  <popup-view ref="popup" :style="{zIndex: 999999}" :isShow.sync="isShow" :title="title">
    <div v-if="isShow" class="map-box">
      <div @mousedown.stop class="bm-view">
        <baidu-map
          class="map"
          ref="map"
          :center="center"
          :zoom="zoom"
          :mapClick="false"
          scrollWheelZoom
          ak="dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2"
          @click="handMap"
        >
          <!-- 比例尺 -->
          <bm-scale />
          <!-- infoWindow弹窗 -->
          <bm-overlay
            v-for="(v, i) of infoWinAll"
            :key="i"
            ref="overlay"
            pane="labelPane"
            class="sample"
            :zIndex="v.zIndex"
            :pt="v.pt"
            :y="v.y"
            @draw="draw($event, i)"
          >
            <veh-info-win v-show="v.show" :info="v" >
              <p>{{ v.address }}</p>
              <span @click.stop="handleColse(i)" class="el-icon-close"  />
            </veh-info-win>
          </bm-overlay>
          <!-- marker点 -->
          <bm-marker v-for="(v, j) of markerAll" :key="`0${j}`" :position="v.pt" :icon="mData.icon" @click="handleMarker(j)" :offset="{width: -12, height: 2}">
            <bm-label v-if="!!v.title" :content="v.title" :labelStyle="mData.labelStyle" :offset="mData.offset" />
          </bm-marker>
          <!-- 地区检索 -->
          <bm-local-search :keyword="values.keyword" :auto-viewport="true" :panel="false" :location="values.location" @searchcomplete="searchcomplete"></bm-local-search>
        </baidu-map>
      </div>
      <div v-show="type === 1" class="search-box">
        <tab-bar :searchList="searchData" :operButton="operButton" @query="query" />
        <el-scrollbar class="scroll-y" style="flex: 1;">
          <ul @mousemove.stop>
            <li v-for="(v, i) in list" :key="i" @click="handAddress(i)">
              <span class="title-color">{{ v.title }}</span>
              <span class="msg-color"><em class="content-color">地址：</em>{{ v.address }}</span>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </popup-view>
</template>

<script>
import getLngLat from '@/utils/coordtransform'
import VehInfoWin from './map/VehInfoWin'
import TabBar from './tabBar.vue'
import PopupView from './map/PopupView'
import { Scrollbar } from 'element-ui'
import { getCopyObj } from '@/utils/util'
import { BaiduMap, BmScale, BmMarker, BmLabel, BmOverlay, BmLocalSearch } from 'vue-baidu-map/components'

export default {
  name: 'MapPopup',
  components: {
    BaiduMap,
    BmScale,
    BmMarker,
    BmLabel,
    BmOverlay,
    BmLocalSearch,
    VehInfoWin,
    TabBar,
    PopupView,
    ElScrollbar: Scrollbar
  },
  data() {
    const searchData = getCopyObj(this.$t('mapData.searchData'))

    return {
      title: '',
      infoWinAll: [],
      markerAll: [],
      center: {
        lng: 116.404,
        lat: 39.915 
      },
      mData: {
				icon: {
					url: require('@/assets/image/map/locationIcon.png'),
					size: {
						width: 32,
						height: 32
					}
				},
				labelStyle: {
					fontSize: '14px',
					minWidth: '70px',
					color: '#fff',
					background: '#00A8D4',
					border: 'none',
					textAlign: 'center',
					padding: '5px'
				},
				offset: {
					width: -25,
					height: -35
				}
			},
      zoom: 7,
      markers: [], // 将maker对象保存起来
      type: 0,
      searchData,
      operButton: {
        search: true
      },
      list: [],
      values: {},
      isShow: false
    }
  },
  methods: {
    /**
     * 渲染marker点
     * @param {Array} info 经纬度数据
     * @param {Boolean} isCenter 为true不居中，反之则居中
     */
    setMapInfo(info, isCenter) {
      const { $refs } = this
      this.markerAll = []
      // 数据是数组，有多个点
      const pointArr = []
      for (const [i, v] of info.entries()) {
        const { lng, lat, name, title } = v
        const BDPt = getLngLat(lng, lat, 'gcj02tobd09')
        // 将每一个点保存到一个数组来进行居中
        pointArr.push(BDPt)

        this.title = title
        const data = {
          url: require('@/assets/image/map/locationIcon.png'),
          w: 32,
          h: 32,
          y: -18,
          id: i,
          pt: BDPt,
          title: name,
          zIndex: i
        }
        this.setMarker(data)
      }
      if (isCenter) return
      // 将所有的点居中
      $refs.map.setViewports(pointArr, true)
    },
    /**
     * 设置marker,没有就创建，有就修改
     */
    setMarker(opt) {
      const { markerAll } = this
      const index = opt.isAdd ? -1 : markerAll.findIndex(elem => elem.id === opt.id)
      const { title, url, w, h, y, x, pt, id, zIndex } = opt
      if (index > -1) {
        this.$set(markerAll[index], 'pt', pt)
        this.$set(markerAll[index], 'title', title)
        this.$set(markerAll[index], 'show', true)
        this.$set(markerAll[index], 'rotation', rotation || 0)
      } else {
        const data = {
          title,
          icon: {
            url,
            size: {
              width: w || 28,
              height: h || 34
            }
          },
          offset: {
            height: y || 0,
            width: x || 0
          },
          pt,
          id,
          show: true,
          zIndex: zIndex || 1
        }
        markerAll.push(data)
      }
    },
    /**
     * 点击marker
     * @param {Number} i 当前的下标
     */ 
    async handleMarker(i) {
      const { markerAll, title, $refs } = this
      const marker = markerAll[i]
      const { pt, zIndex, offset, id, address } = marker
      let val = address
      if (!val) {
        val = await $refs.map.getLocation(pt)
      }
      const data = {
        y: offset.height || 0,
        title: '',
        markerId: id,
        pt,
        zIndex: 10,
        address: val,
        id: 'veh',
        show: true,
        css: {
          width: '240px',
          height: '90px'
        }
      }
      this.setInfoWin(data)
    },
    /**
     * 设置infoWin的弹窗
     * @param {Object} opt json数据
     */
    setInfoWin(opt) {
      const { infoWinAll } = this
      const i = infoWinAll.findIndex(e => opt.id === e.id)
      if (i > -1) {
        for (const [k, v] of Object.entries(opt)) {
          this.$set(infoWinAll[i], k, v)
        }
      } else {
        infoWinAll.push(opt)
      }
    },
    /**
     * 自定义覆盖物改变postion的值
     */
    draw ({ el, BMap, map, pt }, i) {
      const { lng, lat } = pt
      const { infoWinAll } = this
      if (!infoWinAll.length) {
        return
      }
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      // el.style.left = pixel.x - 60 + 'px'
      const w = infoWinAll[i].css.width.replace('px', '')
      el.style.left = pixel.x + 10 - (w / 2) + 'px'
      el.style.bottom = -pixel.y - infoWinAll[i].y + 24 + 'px'
    },
    /**
     * 点击关闭infoWin
     * @param {Number} i 当前的下标
     */
    handleColse(i) {
      const { infoWinAll } = this
      this.$set(infoWinAll[i], 'show', false)
    },
    /**
     * 显示地图弹窗
     */
    async show(info) {
      const { isShow, $refs } = this
      if (!isShow) {
       this.isShow = true
       await this.$nextTick()
       $refs.popup.setPotionCenter()
      }
      if (info === 1) {
        this.type = 1
        return
      }
      this.setMapInfo(info)
    },
    /**
     * 隐藏地图弹窗
     */
    hide() {
      const { markerAll, infoWinAll } = this
      for (const v of markerAll.values()) {
        v.show = false
      }
      for (const v of infoWinAll.values()) {
        v.show = false
      }
      this.list = []
      this.isShow = false
    },
    /**
     * 查询地区检索
     */
    query () {
      const { searchData, values } = this
      const { city, keyword } = searchData
      this.$set(values, 'location', city.model)
      this.$set(values, 'keyword', keyword.model)
    },
    /**
     * 检索地址之后得回调
     * @param {Object} res 回调参数
     */
    searchcomplete(res) {
      console.log(res)
      if (!res) return
      const { Pq } = res
      if (Pq instanceof Array) {
        this.list = Pq
      } else {
        this.list = []
      }
    },
    /**
     * 点击地址列表
     * @param {Number} i 下标
     */
    handAddress(i) {
      const { list } = this
      const { point, address } = list[i]
      const { lng, lat } = point
      const pt = getLngLat(lng, lat, 'bd09togcj02')
      pt.address = address
      eventBus.$emit('handAddress', pt)
      this.hide()
    },
    /**
     * 点击地图
     * @param {Object} e 点击地图当前的点信息
     */
    async handMap (e) {
      if (this.type !== 1) return
      const { $refs } = this
      const { point } = e
      const address = await $refs.map.getLocation(point)
      this.list = []
      const data = {
        address,
        title: '',
        point
      }
      this.list.push(data)

      const item = {
        name: '',
        isBD: true,
        ...point
      }
      
      this.setMapInfo([item], true)
    }
  },
  props: {
    mapId: {
      type: String,
      default: 'map'
    }
  }
}
</script>

<style scoped>
.content-box {
  width: 900px;
  position: fixed;
  top: -900000px;
  left: -900000px;
  opacity: 0;
  z-index: 9999;
  height: 540px;
  background: #373d40;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 5px 5px;
  /* padding: 5px; 这里加padding会出现bug*/
}
.content-box:hover {
  cursor: move;
}
.map-box {
  display: flex;
  flex: 1;
}
.bm-view {
  flex: 1;
  box-sizing: border-box;
  height: 100%;
  background: #fff;
}
.map {
  width: 100%;
  height: 100%;
}
.sample {
  position: absolute;
}
.sample p {
  padding: 20px 22px 0 15px;
}
.sample .el-icon-close {
  color: #333;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 18px;
}
.search-box {
  width: 546px;
  background: #fff;
  padding: 5px 0 10px 10px;
  display: flex;
  flex-direction: column;
}
.search-box ul li:hover {
  cursor: pointer;
}
.search-box ul li {
  padding: 0 0 6px;
}
.search-box ul li span {
  display: block;
}
.content-box .title {
  overflow: hidden;
  padding: 0 20px;
  color: #fff;
}
.content-box .title h5 {
  float: left;
  line-height: 30px;
}
.content-box .title .remove {
  float: right;
  font-size: 20px;
  cursor: pointer;
  line-height: 30px;
}
.top-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 15px;
  cursor: ne-resize;
  z-index: 5px;
}
.right-bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  cursor: se-resize;
  z-index: 5px;
}
.bottom-left {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 15px;
  height: 15px;
  cursor: sw-resize;
  z-index: 5px;
}
.left-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  cursor: nw-resize;
  z-index: 5px;
}
.left {
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 100%;
  cursor: w-resize;
}
.right {
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 100%;
  cursor: e-resize;
}
.top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 15px;
  cursor: n-resize;
}
.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  cursor: s-resize;
}
</style>