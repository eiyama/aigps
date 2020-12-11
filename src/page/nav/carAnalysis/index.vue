
<!-- 车辆轨迹 -->
<template>
  <!-- 右边地图 -->
  <div id="trail-box">
    <div class="main">
      <!-- 地图 -->
      <my-map v-if="mapIsShow" ref="map" :stopList="stopList" @requestInfo="requestInfo" />
      <!-- 控制面板 -->
      <control-panel ref="control" @handlePlay="handlePlay" @initData="initData" />
      <!-- 超速值 -->
      <div class="speedometer">
        <div class="column"></div>
        <div class="normal">{{ speedometer.normal }}</div>
        <div class="overspeed">{{ speedometer.overspeed }}</div>
      </div>
    </div>
    <!-- 底部选项卡 -->
    <foot-tab ref="foot" :stopList="stopList" :pointArr="pointArr" />
  </div>
</template>

<script>
import { getPosition } from '@/api/vehicle'
import { getDateStr, getDateHMS, getDecimalN, getParse, getCopyObj, getFormatTime } from '@/utils/util'
import MyMap from './components/map'
import ControlPanel from './components/controlPanel'
import FootTab from './components/footTab'
import { Message } from 'element-ui'

export default {
  name: 'carAnalysis',
  components: {
    MyMap,
    FootTab,
    ControlPanel
  },
  data() {
    const data = this.getData()
    return {
      speedometer: {},
      mapIsShow: true,
      ...data
    }
  },
  props: {
    curMarker: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.speedometer = getCopyObj(this.$t('carAnalysis.speedometer'))
    eventBus.$on('handleTrail', this.handleTrail)
    eventBus.$on('handleTrailHide', this.handleTrailHide)
  },
  mounted() {
    this.initPlay()
  },
  beforeDestroy() {
    eventBus.$off('handleTrail', this.handleTrail)
    eventBus.$off('handleTrailHide', this.handleTrailHide)
  },
  async beforeRouteLeave(to, from, next) {
    // 解决内存泄漏问题
    // 百度地图和tree组件同时卸载会造成tree组件无法卸载导致内存泄漏，这里先卸载地图组件，等待dom更新之后跳转页面卸载tree组件
    this.mapIsShow = false
    await this.$nextTick()
    next()
  },
  methods: {
    /**
     * 初始化数据
     */
    getData() {
      const query = {
        limit: 100,
        report: 1
      }
      return {
        query,
        stopList: [],
        pointArr: [],
        isRequest: true
      }
    },
    /**
     * 用于该页面是组件的时候，不会执行beforeRouteLeave的路由钩子
     */
    clearMap() {
      return new Promise(async resolve => {
        // 解决内存泄漏问题
        // 百度地图和tree组件同时卸载会造成tree组件无法卸载导致内存泄漏，这里先卸载地图组件，等待dom更新之后跳转页面卸载tree组件
        this.mapIsShow = false
        await this.$nextTick()
        resolve()
      })
    },
    /**
     * 有传参就直接播放轨迹
     */
    initPlay() {
      const { $route, $refs } = this
      const { id, carName, startTime, endTime } = $route.query
      if (!id || !carName || !startTime) {
        return
      }
      const opt = {
        id,
        carName,
        dates: [startTime, endTime]
      }
      if (!endTime) {
        opt.dates[1] = getFormatTime('Y-M-D h:m:s')
      }
      console.log(opt)
      $refs.control.handleTrail(opt)
    },
    /**
     * 初始化数据
     */
    initData() {
      const data = this.getData()
      for (const [k, v] of Object.entries(data)) {
        this[k] = v
      }
    },
    /**
     * 监控页面点击轨迹按钮
     */
    handleTrail() {
      this.$refs.control.handleTrail(this.curMarker)
    },
    /**
     * 监控页面点击关闭轨迹按钮
     */
    handleTrailHide() {
      this.initData()
      this.$refs.map.onDestory()
      this.$refs.control.initData()
      this.$refs.foot.initData()
    },
    /**
     * 点击播放按钮
     */
    handlePlay(startTime, endTime) {
      this.isRequest = true
      this.query.report = 1
      this.pointArr = []
      this.stopList = []
      this.requestInfo(startTime, endTime)
    },
    /**
     * 请求轨迹数据
     */
    requestInfo(startTime, endTime) {
      const { $refs, query } = this
      const search = $refs.control.getSearch();
      const begin = startTime || search.dates[0]
      const end = endTime || search.dates[1]
      const limit = query.limit
      const report = query.report
      
      const data = {
        begin,
        end,
        limit,
        report,
        veh: search.veh,
        zero: +search.zero,
        position: !search.position,
        douglasPeucker: search.douglasPeucker ? 10 : 0
      }
      // const res = await getPosition(data)
      getPosition(data).then(async res => {
        const list = res.result.point || []
        if (report === 1) {
          // 第一次请求且没有数据
          if (!list.length) {
            Message.error(this.$t('error.noTrail'))
            $refs.control.changeState(0)
            return;
          }
          $refs.control.changeState(1)

          const stopList = res.result.stop || [];
          for (const v of stopList.values()) {
            v.stopStartTime = getDateStr(v.stopStartTime)
            v.stopEndTime = getDateStr(v.stopEndTime)
            v.stopTime = getDateHMS(v.stopTime, this.$t('otherText'))
            v.BDPt = $refs.map.getPoint(v.gpsWebLng, v.gpsWebLat)
            // const address = await $refs.map.getLocation(v.BDPt)
            // v.address = address
          }
          this.stopList = stopList;
          this.query.report = 0;
        }

        let maxTime = getDateStr(res.result.maxTime);
        const endCount = new Date(end).getTime();
        maxTime = new Date(maxTime).getTime();
        // 返回的数组长度等于0的时候或者返回的最大时间大于等于请求的结束时间下次将不再请求
        if (maxTime >= endCount || !list.length) {
          this.isRequest = false;
        }

        const i18n = this.$t('carAnalysis.infoWin');
        for (const v of list.values()) {
          v.gpstime = getDateStr(v.gpstime);
          v.gpsDayDistance = getDecimalN(v.gpsDayDistance);
          v.gpsSpeed = getDecimalN(v.gpsSpeed);
          v.BDPt = $refs.map.getPoint(v.gpsWebLng, v.gpsWebLat)
          const extensionData = getParse(v.extensionData);
          const locationType = extensionData.LocationType;
          let localtion = v.gpsIsposition ? locationType || i18n.localtion : i18n.noLocaltion;
          v.state = `${v.gpsAcc ? i18n.accOpen : i18n.accShut}，${localtion}`;
          // const address = await this.$refs.map.getLocation({ lng: v.gpsWebLng, lat: v.gpsWebLat })
          // v.address = address
        }
        
        this.pointArr = [...this.pointArr, ...list];
        $refs.map.trailPlay(this.pointArr, end, this.isRequest);
      })
      .catch(err => {
        $refs.control && $refs.control.changeState(0)
      })
    }
  }
}
</script>

<style scoped>
#trail-box {
  padding: 0;
  flex: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
.main {
  position: relative;
  flex: 1;
  width: 100%;
}
.speedometer {
  width: 64px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  overflow: hidden;
}

.speedometer .column {
  width: 14px;
  height: 280px;
  float: right;
  background: linear-gradient(
    #f63b3b 20%,
    #f9812d 30%,
    #f9812d 40%,
    #e3d738 50%,
    #e3d738 60%,
    #8fc31f 70%
  );
  border-radius: 7px;
  border: 1px solid #fff;
}
.speedometer .normal,
.speedometer .overspeed {
  position: absolute;
  top: 10px;
  left: 0;
  background: url('../../../assets/image/map/tipIcon.png');
  background-size: 100% 100%;
  text-indent: 8px;
  width: 45px;
  height: 39px;
  line-height: 39px;
  font-size: 12px;
  color: #f63b3b;
}
.speedometer .overspeed {
  top: 205px;
  color: #8fc31f;
}
</style>
