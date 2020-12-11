<!-- 车辆轨迹 -->
<template>
  <!-- 右边地图 -->
  <div id="trail-box">
    <div class="main">
      <!-- 地图 -->         
      <my-map v-if="mapIsShow" ref="map" @requestInfo="requestInfo" />
      <!-- 控制面板 -->
      <control-panel ref="control" :pointArr="pointArr" @handlePlay="handlePlay" />
      <!-- 超速值 -->
      <div class="speedometer">
        <div class="column"></div>
        <div class="normal">{{ speedometer.normal }}</div>
        <div class="overspeed">{{ speedometer.overspeed }}</div>
      </div>
    </div>
    <!-- 底部选项卡 -->
    <foot-tab ref="foot" :pointArr="pointArr" :exportData="exportData" :stopList="stopList" />
  </div>
</template>

<script>
import { getPositionByTime } from '@/api/vehicle'; //请求 
import { BaiduMap} from 'vue-baidu-map/components';
import { getDateStr, getDateHMS, getDecimalN, getFormatTime } from '@/utils/util'
import MyMap from './components/map'
import ControlPanel from './components/controlPanel'
import FootTab from './components/footTab'
import { Message } from 'element-ui'
import request from '@/utils/request'


export default {
  name: 'carLineAnalysis',
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
    this.speedometer = this.$t('carAnalysis.speedometer')
    eventBus.$on('handleTrail', this.handleTrail)
    eventBus.$on('handleTrailHide', this.handleTrailHide)
  },
  mounted() {
    this.initPlay()
  },
  // 组件销毁后清除地图组件
  beforeDestroy() {
    eventBus.$off('handleTrail', this.handleTrail)
    eventBus.$off('handleTrailHide', this.handleTrailHide)
    this.initData()
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
        pointArr: [],
        stopList: [],
        exportData:'',
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
     * 初始化数据
     */
    initData() {
      const data = this.getData()
      for (const [k, v] of Object.entries(data)) {
        this[k] = v
      }
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
      // console.log(opt)
      $refs.control.handleTrail(opt)
    },
    /**
     * 监控页面点击轨迹按钮
     */
    handleTrail() {
      // this.$refs.map.initMap()
      this.$refs.control.handleTrail(this.curMarker)
    },
    /**
     * 点击关闭按钮隐藏轨迹
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
      this.requestInfo(startTime, endTime)
    },
    /**
     * 请求轨迹数据
     */
    async requestInfo(startTime, endTime) {
      const { $refs, query } = this
      const search = $refs.control.getSearch();
      eventBus.$emit('searchResult', search);
      const begin = startTime || search.dates[0];
      const end = endTime || search.dates[1];
      const limit = query.limit;
      const report = query.report;
      
      const getPositiondata = {
        begin,
        end,
        report: 1,
        veh: search.veh,
        zero: +search.zero
      }
      // console.log(getPositiondata.zero);
    request({
      url: `/api/services/app/GpsPosition/GetPositionNew?VehTerminalNo=${getPositiondata.veh}&StartTime=${getPositiondata.begin}&EndTime=${getPositiondata.end}&SpeedGtZero=${getPositiondata.zero}`,      
      isLock: true,
    }).then(async res => {
        if (res.result && res.success) {
          const list = res.result.getPositionNewDtos || [];
          if (!list.length) {
            Message.error(this.$t('error.noTrail'));
            $refs.control.changeState(0);
            return;
          }      
          $refs.control.changeState(1);
          $refs.control.setSliderMax(list.length - 1);
          
          const stopList = res.result.gpsReportStopDtos || [];          
          for (const v of stopList.values()) {
            v.stopStartTime = getDateStr(v.stopStartTime);
            v.stopEndTime = getDateStr(v.stopEndTime);
            v.stopTime = getDateHMS(v.stopTime, this.$t('otherText'));
            v.BDPt = this.$refs.map.getPoint(v.gpsWebLng, v.gpsWebLat);           
            const address = await $refs.map.getLocation(v.BDPt);
            v.address = address;
          }
          this.stopList = stopList;     
          const i18n = this.$t('carAnalysis.infoWin');                
          for (const v of list.values()) {           
            v.gpstime = getDateStr(v.gpstime);
            v.gpsDayDistance = getDecimalN(v.gpsDayDistance);
            v.gpsSpeed = getDecimalN(v.gpsSpeed);
            const extensionData = v.extensionData ? JSON.parse(v.extensionData) : {};
            const locationType = locationType;
            let localtion = v.gpsIsposition ? locationType || i18n.localtion : i18n.noLocaltion;
            v.state = `${v.gpsAcc ? i18n.accOpen : i18n.accShut}，${localtion}`;
            v.BDPt = $refs.map.getPoint(v.gcj02Coordinate.lng, v.gcj02Coordinate.lat); 
            // v.BDPt = v.gcj02Coordinate;           
            const address =  v.BDPt;
            v.address = v.gcj02Coordinate.lng  + ',' +  v.gcj02Coordinate.lat;
          }                             
          this.pointArr = list
          $refs.map.trailPlay(list, stopList);
          eventBus.$emit('map', $refs.map);
          // console.log($refs.map);
        }
      })
      .catch(err => {
        $refs.control && $refs.control.changeState(0)
      });
     
      
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
