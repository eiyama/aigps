<template>
  <div id="box">
    <!-- 左侧的树 -->
    <aside-tree
      v-if="mapIsShow"
      ref="asideTree"
      :defaultProps="defaultProps"
      :info="asideInfo"
      @check="changeChecked"
      @node-click="handleNode"
      @dblNode="dblNode"
    />

    <!-- 中间视频 -->
    <center-video
      ref="cVideo"
      v-if="mapIsShow"
      :bitstream="bitstream"
      @setEnable="setEnable"
      @handleHide="handleCenHide"
      @popupShow="popupShow"
      @setBitstream="setBitstream"
    />
    <!-- 右侧视频 -->
    <right-video
      ref="rVideo"
      v-if="mapIsShow"
      :bitstream="bitstream"
      @setEnable="setEnable"
      @handleShowCenVideo="handleShowCenVideo"
      @popupShow="popupShow"
      @setBitstream="setBitstream"
    />

    <!-- 电子围栏列表 -->
    <right-fence
      ref="fence"
      v-if="mapIsShow"
      :fenceIsShow="markeBoxShow"
      :defaultProps="defaultProps"
      :latLngs="markLatLngs"
      :markType="markType"
      @clearOverlaysAll="clearOverlaysAll"
      @changeCheck="changeCheck"
      @upMark="upMark"
      @handleEditEnd="handleEditEnd"
      @handleClose="handleMarkBtn"
    />

    <!-- 工具栏 -->
    <tool
      ref="tool"
      :isShowVideos="isShowVideos"
      :isShowCenVideo="isShowCenVideo"
      :markeBoxShow.sync="markeBoxShow"
      @handleQuit="handleQuit"
      @handleEditSuc="handleEditSuc"
      @handleMarkBtn="handleMarkBtn"
      @handleTraffic="handleTraffic"
    />

    <!-- 地图 -->
    <my-map
      ref="map"
      :style="{width: isShowCenVideo ? '500px' : '100%'}"
      :info="i18n"
      :newTree="newTree"
      :vehTerminalNoIdMap="vehTerminalNoIdMap"
      :isTraffic="isTraffic"
      @setLatLngs="setLatLngs"
      @addMarkShow="addMarkShow"
      @handleBtn="handleBtn"
      @setVehTerminalNoIdMap="setVehTerminalNoIdMap"
      @handleDrive="handleDrive"
    />

    <!-- 轨迹回放 -->
    <popup-view v-if="trailMapShow" :title="i18n.infoWin.trackReplay" :isActive="true" :isShow.sync="trailMapShow" :css="{ width: '80%', height: '80%' }" ref="trailPopup" @handClose="handClose">
        <component ref="trail" :is="curAnalysis" :curMarker="trailInfo" />
    </popup-view>

    <!-- 温度报表 -->
    <popup-view v-if="temperatureDetailShow" :title="$t('temperature.curTitle')" :isShow.sync="temperatureDetailShow" :css="{ width: '80%', height: '80%' }" ref="temperaturePopup">
      <temperature :curMarker="temperatureInfo" :codeUrl="temperatureCodeUrl" />
    </popup-view>

    <!-- 电量报表 -->
    <popup-view v-if="electricQuantityDetailShow" :title="$t('electricity.curTitle')" :isShow.sync="electricQuantityDetailShow" :css="{ width: '80%', height: '80%' }" ref="electricPopup">
      <electricity :curMarker="electricInfo" :codeUrl="electricCodeUrl" />
    </popup-view>

    <!-- 发送指令 -->
    <send-order v-if="mapIsShow" ref="send" :curMarker="curMarker" />

    <!-- 胎压弹窗 -->
    <tyre-pressure-pop
      v-if="popupIsShow"
      :info="tyrePressureInfo"
      @queryMore="queryMore"
      @changeAndShow="popupIsShow = false"
    />

    <!-- 胎压报表弹窗 -->
    <popup-view v-if="tirePressureIsShow" :title="$t('tirePressure.curTitle')" :isShow.sync="tirePressureIsShow" :css="{ width: '80%', height: '80%' }" ref="rtirePopup">
      <tire-pressure :codeUrl="tirePressureCodeUrl" :popInfo="popInfo" />
    </popup-view>

    <!-- 运行报表 -->
    <popup-view v-if="runPopupIsShow" :title="$t('run.curTitle')" :isShow.sync="runPopupIsShow" :css="{ width: '80%', height: '80%' }" ref="runPopup">
      <run :componentInfo="runInfo" />
    </popup-view>

    <!-- 提示用户是否替换视频的弹窗 -->
    <popup v-if="mapIsShow" ref="popup" @handleConfirm="handleReplaceConfirm" />

    <!-- 司机信息 -->
    <drive-info v-if="mapIsShow" ref="drive" />

     <!-- 联系人信息 -->
    <contact-info v-if="mapIsShow" ref="contact" />

    <!-- 紧急报警弹窗 -->
    <send-alarm v-for="(v, i) of alarmArr" :key="i" :info="v" @handleConfirm="handleAlarmConfirm" />

    <!-- 底部表格 -->
    <foot-table v-if="mapIsShow" ref="footTable" />

    <!-- 路况信息 -->
    <!-- <traffic-info v-if="mapIsShow" :isTraffic="isTraffic" @handleClose="handleCloseTraffic" @handleRefresh="handleRefreshTraffic" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Notification, Message } from 'element-ui'

import _WebSocket from '@/conmon/js/websocket.js'
import { getMonitor, lastRecodes, getTirePress } from '@/api/vehicle'
import { parentId } from '@/utils/data'
import { getCopyObj, getDateStr, customZeroize, getParse } from '@/utils/util'

import AsideTree from './components/AsideTree'
import CenterVideo from './components/centerVideo'
import RightVideo from './components/RightVideoNew'
// import CenterVideo from './components/CenterVideoNew'
// import RightVideo from './components/rVideoNew'
import RightFence from './components/RightFence'
import MyMap from './components/Map'
import Tool from './components/Tool'
import SendOrder from './components/SendOrder'
import Popup from './components/Popup'
import DriveInfo from './components/DriveInfo'
import ContactInfo from './components/ContactInfo'
import SendAlarm from './components/SendAlarm'
import FootTable from './components/FootTable'
import TrafficInfo from './components/TrafficInfo'

import CarAnalysis from '../carAnalysis'
import NewCarAnalysis from '../newCarAnalysis'
import CarLineAnalysis from '../carLineAnalysis'

import Electricity from '@/page/dataSearch/busine/electricity'
import Temperature from '@/page/dataSearch/busine/temperature'
import TyrePressurePop from '@/components/tyrePressurePop'
import TirePressure from '@/page/dataSearch/busine/tirePressure'
import Run from '@/page/dataSearch/base/run'

import PopupView from '@/components/map/PopupView'

export default {
  name: 'AllMonitor',
  components: {
    AsideTree,
    CenterVideo,
    RightVideo,
    RightFence,
    MyMap,
    Tool,
    SendOrder,
    Popup,
    DriveInfo,
    ContactInfo,
    SendAlarm,
    FootTable,
    TrafficInfo,
    CarAnalysis,
    NewCarAnalysis,
    CarLineAnalysis,
    Electricity,
    Temperature,
    PopupView,
    TyrePressurePop,
    TirePressure,
    Run
  },
  computed: {
    ...mapGetters([
      'jsession',
      'alarmIds',
      'alarmNames',
      'menuTree'
    ])
  },
  data() {
    const data = this.getData()
    const i18n = this.$t('carAnalysis')
    return {
      ...data,
      i18n,
      mapIsShow: true,
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      electricCodeUrl: {
        code: 'dataQuery',
        url: '/home/dataSearch/electricity'
      },
      temperatureCodeUrl: {
        code: 'dataQuery',
        url: '/home/dataSearch/temperature'
      },
      tirePressureCodeUrl: {
        code: 'dataQuery',
        url: '/home/dataSearch/tirePressure'
      }
    }
  },
  async created() {
    // console.log(this.i18n)
    this.setTrailState()
    this.newTree = new Map()
    this.socket = new _WebSocket.webSocket()
    this.socket.connectWebSocket('alarmHub', this.websocketCallback)
    // 开启socket心跳
    this.heartbeat()
    document.documentElement.addEventListener('click', this.handleBtns)
    await this.getTree()
    // 从首页的地图图标点击跳转过来
    await this.$nextTick()
    const params = this.$route.params || {}
    if (params.key) {
      var kesS = getParse(params.key)
      this.$refs.asideTree.$refs.tree.setCheckedKeys(kesS)
      this.changeChecked({ type: '1' }, { checkedKeys: [] })
    }
  },
  // 实例销毁后销毁地图组件以及弹窗
  beforeDestroy() {
    if (this.socket && this.socket.connection) {
      this.socket.connection.stop()
      this.socket.connection = null
      this.socket = null
    }
    document.documentElement.removeEventListener('click', this.handleBtns)
    // 关闭心跳的定时器
    clearTimeout(this.tid)
    // 关闭所有报警弹窗
    Notification.closeAll()
    this.i18n = null
  },
   async beforeRouteLeave(to, from, next) {
    // 解决内存泄漏问题
    // 百度地图和tree组件同时卸载会造成tree组件无法卸载导致内存泄漏，这里先卸载地图组件，等待dom更新之后跳转页面卸载tree组件
    this.mapIsShow = false
    this.popupIsShow = false
    this.runPopupIsShow = false
    this.tirePressureIsShow = false
    this.alarmArr = []
    await this.$nextTick()
    next()
  },
  methods: {
    /**
     * 获取初始化参数
     */
    getData() {
      return {
        asideInfo: {},
        state: {
          dragState: false,
          moveState: false
        },
        curAnalysis: 'CarAnalysis', // 控制用哪一个轨迹组件
        isShare: true,
        trailMapShow: false,
        trailInfo: {}, // 轨迹弹窗组件的数据
        curMarker: {},
        sideTree: [],
        reviseShow: false,
        markeBoxShow: false,
        markType: 1,
        overlays: [],
        overlaysAll: [],
        temperatureDetailShow: false,
        electricQuantityDetailShow: false,
        popupIsShow: false,
        tirePressureIsShow: false,
        tyrePressureInfo: {},
        runPopupIsShow: false, // 控制运行报表弹窗是否显示的变量
        loadShow: false, // 控制载重明细弹窗的变量
        runInfo: {}, // 运行报表的数据
        num: 22,
        popInfo: {},
        temperatureInfo: {},
        electricInfo: {},
        socket: null,
        drawingManager: null,
        isTreeFilter: true, // 是否过滤树
        markLatLngs: [], // 存储围栏的经纬度点
        activeName: 'point', // 标注点tabs初始化name
        oBox: null, // dom变量
        tid1: null, // 维护socket，一分钟发一次心跳
        isChangeMap: true, // 是否改变地图的变量
        isShowVideos: false, // 是否显示视频盒子
        isShowCenVideo: false, // 控制中间视频盒子显示与隐藏
        curVidMark: [], // 实时视频播放的marker数据
        notifys: [], // 存放notify弹窗实例的数组
        newTree: null, // 保存更新的树的数据
        isUp: true, // 控制推送是否更新树
        bitstream: '0',
        vehTerminalNoIdMap: null,
        alarmArr: [],
        isTraffic: false
      }
    },
    /**
     * 切换视频的码流(实时性或流畅性)
     * @param {String} state 0是流畅性，1是实时性
     */
    setBitstream(state) {
      this.bitstream = state
    },
    // 发送心跳，以维护socket一直保持连接
    heartbeat() {
      this.tid = setTimeout(() => {
        this.socket.heartbeat()
        // console.log('发送心跳');
        // 三分钟执行一次
        this.heartbeat()
      }, 180 * 1000)
    },
    // 处理胎压数据的方法
    setTyrePressureInfo(arr) {
      // 先修改胎压与温度
      const list = new Array(this.num)
      for (var i = 0; i < list.length; i++) {
        // 该项没有值的时候就以i为车轮位置
        if (!list[i]) {
          // 当前下标算出轴和轮号，轴减去第一排少的2个和下标的1个除以每排的4个加减去的当前轮号的1排，轮号加上下标1的，模4加上第一排少的2个
          let curNum, curAxis
          // 第一排
          if (i < 2) {
            curNum = i + 1
            curAxis = 1
          } else {
            curNum = ((i + 2) % 4) + 1
            curAxis = parseInt((i + 2) / 4) + 1
          }
          list[i] = { axis: curAxis, num: curNum }
        }
        if (i < arr.length) {
          const axis = parseInt(parseInt(arr[i].position) / 16) + 1
          const num = (parseInt(arr[i].position) % 8) + 1
          // 根据轴和轮算出在 22个轮中对应的下标
          // 由于最后一行要加上轮数所以先减1，乘以每行4个，减掉第一行少的两个，再加上轮数，下标从0开始减掉1
          let index
          if (axis == 1) {
            index = num - 1
          } else {
            index = (axis - 1) * 4 - 2 + num - 1
          }
          var obj = arr[i]
          var pressure = obj.pressure
          var temperature = obj.temperature
          arr[i].pressure =
            pressure >= 65535 ? this.$t('otherText.invalid') : ((pressure * 25) / 1000).toFixed(2) * 1
          arr[i].temperature =
            temperature >= 255 ? this.$t('otherText.invalid') : (temperature - 50).toFixed(1) * 1
          arr[i].axis = axis
          arr[i].num = num
          list[index] = obj
        }
      }
      return list
    },
    /**
     * websocket的回调方法
     * @param {String} key websocket的字段名
     * @param {Object|String} data 数据
     */
    websocketCallback(key, data) {          
      let obj
      if (data && typeof data === 'object') {
        obj = data
      } else {
        obj = getParse(data)
      }        
      if (!this.socket) {
        return
      }
      // 定位
      else if (key == 'Position0x0200') {          
        this.positionData(obj)        
      }
      // 报警、胎压报警
      else if (key == 'Alarm') {         
        this.alarmData(obj)
      }
      // 透传
      else if (key == 'Passthrough0x0900') {
        this.passThrough(obj)
      }
      // 胎压
      else if (key == 'Passthrough0x0900F1') {
        this.passthroughTire(obj)
      }
      // msgId，日志监控
      else if (key == 'Reply0x0001') {
        // this.popupReply(obj);
      }
      return
    },
    /**
     * 点击infoWindow上的按钮
     * @param {String} id 按钮上的id
     */
    handleBtn(id, e) {
      switch (id) {
        case 'trail-play':
          this.trailPlay()
          break
        case 'send-command':
          this.showSendCommandFn()
          break
        case 'temperature':
          this.temperatureDetail()
          break
        case 'electric':
          this.electric()
          break
        case 'tyre-pressure':
          this.tyrePressure()
          break
        case 'load':
          this.clickLoad()
          break
        case 'run':
          this.clickRun()
          break
        case 'video':
          this.clickVideo()
          break
        case 'info-window-close':
          this.$refs.map.infoWinHide(true)
          break
        case 'contactInfo':
          this.clickContactInfo()
          break
        case 'alarm_btn':
          let row = e.target.getAttribute('data-row')
          row = getParse(row)
          // console.log(row);
          row.alarmStatus = true
          // 与其他页面的数据保持一致
          row.extensionData = JSON.stringify(row.extensionData)
          eventBus.$emit('handleAct', row)
          return false
          break
        default:
      }
    },
    /**
     * 事件委托点击报警弹窗的按钮
     */
    handleBtns(e) {
      e.stopPropagation();
      const id = e.target.id
      this.handleBtn(id, e)      
    },
    /**
     * 判断使用哪一个轨迹组件
     */
    setTrailState() {
      for (const v of this.menuTree.values()) {
        // 判断到底使用哪一个轨迹回放页面
        if (v.url == '/home/carMonitor/carAnalysis') {
          this.curAnalysis = 'carAnalysis'
          break
        } else if (v.url == '/home/carMonitor/newCarAnalysis') {
          this.curAnalysis = 'NewCarAnalysis'
          break
        }
        else if (v.url == '/home/carMonitor/carLineAnalysis') {
          this.curAnalysis = 'carLineAnalysis'
          break
        }
      }
    },
    /**
     * 点击轨迹回放
     */
    async trailPlay() {
      const { trailMapShow, trailInfo } = this
      const data = {
        isShow: trailMapShow,
        ref: 'trailPopup',
        obj: trailInfo,
        id: 'trail'
      }
      const res = await this.clickInfoWinBtn(data)
      if (res) {
        this.trailInfo = res
        this.trailMapShow = true
        this.$nextTick(() => {          
          eventBus.$emit('handleTrail')
          eventBus.$emit('suspend', false);
        })
      }
    },
    /**
     * 点击轨迹弹窗的关闭图标
     */
    handleTrailHide() {
      eventBus.$emit('handleTrailHide')
      this.trailMapShow = false
    },
    //发送指令
    showSendCommandFn() {
      this.curMarker = this.$refs.map.getCurMarke()
      const ttxVehicleCfg = this.curMarker.ttxVehicleCfg || {}
      const isVideoDevice = ttxVehicleCfg.isVideoDevice || false
      this.$refs.send.setIsShow(isVideoDevice)
    },
    /**
     * 点击infoWin打开温度报表弹窗
     */
    async temperatureDetail() {
      const { temperatureDetailShow, temperatureInfo } = this
      const data = {
        isShow: temperatureDetailShow,
        obj: temperatureInfo,
        ref: 'temperaturePopup',
        id: 'temperature_form',
        url: '/home/dataSearch/temperature'
      }
      const res = await this.clickInfoWinBtn(data)
      if (res) {
        this.temperatureInfo = res
        this.temperatureDetailShow = true
      }
    },
    /**
     * 点击infoWin的按钮打开电量报表弹窗
     */
    async electric() {
      const { electricQuantityDetailShow, electricInfo } = this
      const data = {
        isShow: electricQuantityDetailShow,
        ref: 'electricPopup',
        obj: electricInfo,
        id: 'electric_form',
        url: '/home/dataSearch/electricity'
      }
      const res = await this.clickInfoWinBtn(data)
      if (res) {
        this.electricInfo = res
        this.electricQuantityDetailShow = true
      }
    },
    // 胎压
    tyrePressure() {
      this.curMarker = this.$refs.map.getCurMarke()
      const vehTerminalNo = this.curMarker.vehTerminalNo
      getTirePress({ vehTerminalNo })
        .then((res) => {
          if (res.result) {
            this.popupIsShow = true
            this.tyrePressureInfo = res.result
            this.tyrePressureInfo.gpsTime = getDateStr(this.tyrePressureInfo.gpsTime)
            this.tyrePressureInfo.name = this.curMarker.name
            var arr = this.tyrePressureInfo.tirePressInfos
            this.tyrePressureInfo.tirePressInfos = this.setTyrePressureInfo(arr)
          } else {
            // 没有胎压
            Message.error(this.$t('error.tyrePressureIsNo'))
          }
        })
        .catch((err) => {})
    },
    /**
     * 点击infoWin的运行报表按钮
     */
    async clickRun() {
      const { runPopupIsShow, runInfo } = this
      const data = {
        isShow: runPopupIsShow,
        obj: runInfo,
        ref: 'runPopup',
        id: 'run_form',
        url: '/home/dataSearch/run'
      }
      const res = await this.clickInfoWinBtn(data)
      if (res) {
        this.runInfo = res
        this.runPopupIsShow = true
      }
    },
    /**
     * 点击infoWin的载重按钮
     */
    async clickLoad() {
      const data = {
        isShow: this.loadShow,
        obj: this.loadInfo,
        id: 'load_form',
        url: '/home/dataSearch/load'
      }
      const res = await this.clickInfoWinBtn(data)
      if (res) {
        this.loadInfo = res
        this.loadShow = true
      }
    },
    /**
     * 点击infoWin的事实视频
     * @param isDbl 是否是双击树节点
     */
    clickVideo(isDbl) {
      // console.log(isDbl)
      const { $refs, isShowCenVideo } = this
      let node = null
      if (!isDbl) {
        const curMarke = $refs.map.getCurMarke()
        // console.log(curMarke)
        const id = curMarke.id
        node = $refs.asideTree.$refs.tree.getNode(id)
        if (node && node.data) {
          const location = node.data.location || {}
          if (!location.acc) {
            Message.error(this.$t('设备ACC关闭，暂无视频'))
            return
          }
        }
      }
      // this.isShowVideos = true
      // this.isShowCenVideo = false    
      if (isShowCenVideo) {
        $refs.cVideo.init()
      } else {        
        $refs.rVideo.init()
      }
      if (node) {
        this.dblNode(node.data, node, true)
      }
    },
    /**
     * 点击地图弹窗上按钮之后打开弹窗的方法
     * @param {Boolean} isShow 该弹窗是否已显示
     * @param {Object} obj 弹窗组件的参数
     * @param {String} id 弹窗盒子的id
     * @param {String} url 页面地址
     */
    clickInfoWinBtn(opt) {
      const { $refs } = this
      return new Promise((resolve) => {
        const curNode = $refs.map.getCurMarke()
        const { obj, isShow, url, ref } = opt
        // 窗口打开且且点击的同一个地图marker就不执行
        if (isShow && obj.carName == curNode.name && obj.id == curNode.vehTerminalNo) {
          resolve(false)
          return
        }
        this.setPopupAllHide()
        const data = {
          carName: curNode.name,
          id: curNode.vehTerminalNo,
          code: 'dataQuery',
          url
        }
        resolve(data)
      })
    },
    /**
     * 点击联系信息按钮
     */
    clickContactInfo() {
      const { $refs } = this
      const curMarke = $refs.map.getCurMarke()      
      $refs.contact.initInfo(curMarke)
    },
    /**
     * 隐藏所有的弹窗盒子
     */
    setPopupAllHide() {
      this.temperatureDetailShow = false
      this.electricQuantityDetailShow = false
      this.trailMapShow = false
      this.runPopupIsShow = false
      this.loadShow = false
      this.tirePressureIsShow = false
    },
    /**
     * 覆盖物编辑结束之后
     * @param {Numer} markType 编辑的覆盖物的类型
     * @param {Array} lngLats 编辑覆盖物的经纬度
     */
    addMarkShow(markType, lngLats) {   
      this.markType = markType
      this.markLatLngs = lngLats
      this.$refs.fence.addMarkShow(markType)
    },
    /**
     * 获取车辆树数据
     */
    getTree() {
      return new Promise(async resolve => {
        try {
          const res = await getMonitor()
          const obj = res.result;
          this.$set(this.asideInfo, 'stop', obj.stop);
          this.$set(this.asideInfo, 'all', obj.all);
          this.$set(this.asideInfo, 'share', obj.share);
          this.$set(this.asideInfo, 'run', obj.run);
          this.$set(this.asideInfo, 'offline', obj.offline + obj.unlocated + obj.unactivated);
          this.$set(this.asideInfo, 'alarm', obj.alarm);
          let list = obj.tree || []
          const id = list[0].id
          if (id === parentId && Array.isArray(list[0].child) && list[0].child.length) {
            list = list[0].child
          }
          this.$refs.asideTree.setData(getCopyObj(list), id)
          this.$refs.fence.setTree(getCopyObj(list))
          this.createMap(getCopyObj(list))
        } catch(err) {

        }
        resolve()
      })
    },
    /**
     * 创建map,设备号为key,value为id数组
     */
    createMap(data) {
      if (!this.vehTerminalNoIdMap) this.vehTerminalNoIdMap = new Map()
      for (const v of data.values()) {
        if (v.type == 2) {
          let obj = this.vehTerminalNoIdMap.get(v.vehTerminalNo)
          if (obj && Array.isArray(obj.ids)) {
            obj.ids.push(v.id)
            this.vehTerminalNoIdMap.set(v.vehTerminalNo, obj)
          } else {
            obj = {
              ids: []
            }
            obj.ids.push(v.id)
            this.vehTerminalNoIdMap.set(v.vehTerminalNo, obj)
          }
        } else {
          if (v.type == 1 && v.child && v.child.length) {
            this.createMap(v.child)
          }
        }
      }
    },
    /**
     * 更新数据
     * @param {String} key vehTerminalNoIdMap的key
     * @param {Object} item 对应的值
     */
    setVehTerminalNoIdMap(key, item) {
      // console.log(key);
      if (!this.vehTerminalNoIdMap) return
        this.vehTerminalNoIdMap.set(key, item)
    },
    /**
     * 根据节点id判断当前节点的复选框是否选择
     * @param id 节点id
     */
    isCheck(id) {
      const curNode = this.$refs.asideTree.$refs.tree.getNode(id)
      // console.log(curNode);
      return curNode.checked
    },
    // 勾选节点
    /**
     * 勾选节点
     * @param {Object} data data与node都是elementui返回的默认参数
     */
    async changeChecked(data, node) {     
      const isCheck = data.id ? this.isCheck(data.id) : true
      if (data.type == '2' && data.location && data.location.state == 6) {
        // 该车辆从未上线
        // 为选中的时候才提示
        if (isCheck) Message.error(this.$t('error.carNoGps'))
        return
      }
      this.$refs.map.removeClusterer()
      // 获取树的勾选节点
      var list = this.$refs.asideTree.$refs.tree.getCheckedNodes()      
      var sortInfo = this.$refs.map.sortInfo(list)
      var arr = sortInfo.arr      
      if (arr.length == 0) {
        this.$refs.map.clearPt()
        return
      }
      var vehTerminalNos = sortInfo.vehTerminalNos
      if (this.newTree.size > 0) {
        for (const [i, item] of arr.entries()) {
          const obj = this.newTree.get(item.vehTerminalNo)
          if (obj) {
            item = obj
          }
        }
      }
      // 如果等于0，就证明可以直接使用pointArr不需要请求
      if (vehTerminalNos.length) {
        arr = await this.getCarInfo(vehTerminalNos, arr)
      }
      this.reviseNodeData(getCopyObj(arr))
      this.$refs.map.checkedFn(data, node, arr, isCheck);
      this.$refs.footTable.tableData(data, node, arr, isCheck);
      // console.log(data)
    },
    /**
     * 根据终端号获取最新的车辆数据
     * @param {Array} ids 终端号
     * @param {Array} arr 勾选的车辆数据
     */
    // 根据终端号获取车辆数据
    getCarInfo(ids, arr) {
      return new Promise((resolve) => {
        lastRecodes({ vehTerminalNo: ids.join() }).then((res) => {
          if (res.success) {
            var list = res.result
            for (const [i, item] of arr.entries()) {
              for (const [j, elem] of list.entries()) {
                // 终端号相同证明就是需要修改的目标数据
                if (item.vehTerminalNo == elem.vehTerminalNo) {
                  // 添加返回没有的数据
                  elem.sensor = item.sensor
                  elem.type = item.type
                  elem.id = item.id
                  elem.child = item.child
                  elem.sim = item.sim
                  elem.allot = item.allot
                  if (elem.location) {
                    const extensionData = getParse(elem.location.extensionData)
                    elem.location.LocationType = extensionData.LocationType || ''
                    elem.location.driver = item.location.driver
                  }
                  arr[i] = elem
                  // 将数据保存起来
                  // this.pointArr.push(elem);
                  let obj = this.newTree.get(elem.vehTerminalNo)
                  if (obj) {
                    // console.log('请求新数据');
                    obj = {
                      isUpState: false,
                      ...elem
                    }
                    obj.location = {
                      ...elem.location
                    }
                    this.newTree.set(elem.vehTerminalNo, obj)
                  } else {
                    this.newTree.set(elem.vehTerminalNo, elem)
                    // console.log('请求新数据');
                  }
                  list.splice(j, 1)
                }
              }
            }
            resolve(arr)
          }
        })
      })
    },
    // 点击节点
    handleNode(data, node) {
      // 居中
      const obj = this.newTree.get(data.vehTerminalNo)
      if (obj) {
        obj.checked = data.checked
        obj.id = data.id;    
        this.changeChecked(obj, { checkedKeys: [data.id] })
      } else {
        this.changeChecked(data, { checkedKeys: [data.id] })
      }
    },
    /**
     * 双击节点
     * @param data 节点的数据
     * @param node 节点对应的node
     */
    dblNode(data, node, isClick) {
      // 是摄像头且数组长度等于0
      let child, isHandleChn
      if (data.type == 3) {
        child = [getCopyObj(data)];
        // 如果该车辆已离线就不能播放
        data = node.parent.data;
        isHandleChn = false
      } else
      // 点击视频设备的车牌号
      if (data.type == 2 && Array.isArray(node.data.child) && node.data.child.length) {
        child = node.data.child
        isHandleChn = true
      }
      // 如果该车辆已离线就不能播放
      const location = data.location || {};
      const ttxVehicleCfg = data.ttxVehicleCfg || {};
      if (!this.isCarOline(location, ttxVehicleCfg)) return

      const num = ttxVehicleCfg.ttxTerminalNoLength || 12;
      const vehTerminalNo = customZeroize(data.vehTerminalNo, num)
      // 为正的时候往中间添加视频，反之往右边添加
      for (const [i, v] of child.entries()) {
        const url = `${process.env.VUE_APP_BASEURL_VIDEO}hls/1_${vehTerminalNo}_${v.channelId}_${this.bitstream}.m3u8?JSESSIONID=${this.jsession}`
        const opt = {
          url,
          num,
          id: v.id,
          name: v.name,
          isHandleChn,
          vehPlate: data.name,
          channelId: v.channelId,
          bitstream: this.bitstream,
          vehTerminalNo
        }
        if (this.isShowCenVideo) {
          if (isHandleChn && !this.$refs.cVideo.isEmpty(i)) {
            break 
          }           
          this.$refs.cVideo.setVideo(opt)
        } else {
          if (isHandleChn && !this.$refs.rVideo.isEmpty(i)) {
            break
          }
          if (!isClick) this.clickVideo(true)
          this.$refs.rVideo.setVideo(opt)
        }
      }
      this.$refs.asideTree.$refs.tree.setChecked(data.id, true)
      this.changeChecked(data, node)
    },
    /**
     * 判断车辆是否已离线
     */
    isCarOline(location, ttxVehicleCfg) {
      let boole = true
      if (location.state != 0 && location.state != 1) {
        Message.error(this.$t('error.carNoLine'))
        boole = false
      } else if (!ttxVehicleCfg || !ttxVehicleCfg.haveLiveVideo) {
        Message.error(this.$t('error.haveLiveVideo'))
        boole = false
      } else if (!location.acc) {
        Message.error(this.$t('设备ACC关闭，暂无视频'))
        boole = false
      }
      return boole
    },
    /**
     * 根据id修改视频设备的启用状态
     * @param id 树节点id
     */
    setEnable(id, boole) {
      const { $refs, isShowCenVideo } = this
      const node = $refs.asideTree.$refs.tree.getNode(id)
      if (node) {
        node.data.isPlay = boole
        const name = node.data.name
        node.data.name = ''
        node.data.name = name
        if (boole) {
          let { data } = node
          const { parent } = node
          // type为2证明是车辆节点，3为视频通道节点
          if (data.type === 3) {
            data = parent.data
          }
              $refs.map.setLine(data, true)
        } else {
          $refs.map.clearLine(id, false)
        }
      }
    },
    /**
     * 是否需要打点
     * @param id 树节点的id
     */
    isDot(id) {
      const node = this.$refs.asideTree.$refs.tree.getNode(id)
      if (node) {
        // 如果该节点下的所有视频设备都为不启用状态就返回false
        const arr = node.parent.data.child || []
        return arr.some(e => !!v.isPlay)
      }
      return false
    },
    // 动态修改树的节点数据
    reviseNodeData(upData) {
      var list = this.$refs.asideTree.$refs.tree.getCheckedNodes(true)
      for (const [i, elem] of list.entries()) {
        // 车辆节点
        if (elem.type == 2) {
          // 获取树里面与该终端号相对应的id
          var vehInfo = this.vehTerminalNoIdMap.get(elem.vehTerminalNo)
          var ids = vehInfo && vehInfo.ids ? vehInfo.ids : []
          // 获取最新数据终端号相同的数据
          var obj = upData.find((info) => info.vehTerminalNo == elem.vehTerminalNo)
          if (obj) {
            // 循环每一条有该终端号的树节点并赋值
            for (const [j, item] of ids.entries()) {
              var vehNode = this.$refs.asideTree.$refs.tree
                ? this.$refs.asideTree.$refs.tree.getNode(item)
                : null
              if (vehNode) {
                var node = vehNode.data
                node.name = ''
                for (var key in obj) {
                  // 修改除了id之外树节点的数据
                  if (key !== 'id' && obj[key] !== null) {
                    if (typeof obj[key] === 'object') {
                      node[key] = getCopyObj(obj[key])
                    } else {
                      node[key] = obj[key]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    /**
     * 更新字典的树数据
     */
    upNewTree(data) {
      const { $refs, newTree, isShowCenVideo } = this
      let obj = {}
      let location = {}
      var node = newTree.get(data.VehTerminalNo)
      if (node) {
        obj = {
          ...node
        }
      }
      for (const [k, v] of Object.entries(data)) {
        // 把k首字母变成小写
        const key = `${k.charAt(0).toLowerCase()}${k.substring(1)}`
        obj[key] = v
        location[key] = v
      }
      obj.location = {
        ...location
      }
      const extensionData = getParse(obj.extensionData)
      if (extensionData && extensionData.ConvertTemperature) {
        if (extensionData.ConvertTemperature >= 6553.5) {
          obj.location.convertTemperature = this.$t('otherText.invalid')
        } else {
          obj.location.convertTemperature = extensionData.ConvertTemperature
        }
      } else {
        obj.location.convertTemperature = ''
      }
      obj.location.convertBatteryVoltage =
        extensionData && extensionData.ConvertBatteryVoltage ? extensionData.ConvertBatteryVoltage : ''
      obj.location.electricQuantity =
        extensionData && extensionData.BatteryPower ? extensionData.BatteryPower : ''
      obj.location.gpsTime = getDateStr(obj.gpstime) // 格式化时间
      obj.location.locationType = extensionData.LocationType
      obj.location.acc = obj.location.gpsAcc
      obj.name = obj.vehPlateNo
      obj.driver = extensionData.DriverName || obj.driver
      obj.isUpState = true
      newTree.set(obj.vehTerminalNo, obj)

      obj.isShowCenVideo = isShowCenVideo
      $refs.map && $refs.map.upMarker(obj)
    },
    /**
     * 更新树的dom节点
     */
    upDomTree() {
      if (!this.vehTerminalNoIdMap) return
      for (const [k, v] of this.newTree.entries()) {
        // v.vehTerminalNo = '80211127534'
        var obj = this.vehTerminalNoIdMap.get(v.vehTerminalNo)
        if (obj && obj.ids && obj.ids.length) {
          let newNode = {}
          for (const [i, e] of obj.ids.entries()) {
            var vehNode = this.$refs.asideTree.$refs.tree
              ? this.$refs.asideTree.$refs.tree.getNode(e)
              : null
            if (vehNode) {
              var node = vehNode.data
              node.name = ''
              newNode.allot = node.allot
              const oldTime = getDateStr(v.location.gpsTime)
              let isLine = false
              if (oldTime) {
                const oldTimeNum = new Date(oldTime.replace(/\-/g, '/')).getTime()
                const curTimeNum = new Date().getTime()
                const minutes15 = 15 * 60
                // 判断推送的数据时间是小于15分钟就代表上线，否则就是离线状态
                if ((curTimeNum - oldTimeNum) / 1000 < minutes15) {
                  isLine = true
                }
              }
              var oldState = node.location.state
              var oldAlam = node.location.alam
              //更改树节点
              // 如果是共享或者下标等于0就单独计算状态值,反之则直接更改树
              if (this.isShare || i === 0) {
                // true证明是推送过来的数据，反则是点击节点请求接口更新的数据所以不更新状态
                if (isLine) {
                  // 上线才修改状态
                  if (v.gpsSpeed > 0 || v.location.gpsSpeed > 0) {
                    v.location.state = 1
                  } else {
                    v.location.state = 0
                  }
                  // 修改在线停车离线的值(防止共享的多次计算)
                  if (oldState != v.location.state) {
                    this.compareState(oldState, v.location.state, node.vehPlateNo)
                  }
                }
                // 该节点为报警状态
                if (v.alam == 1 && oldAlam == 0) {
                  v.location.alam = 1
                  // this.alarm += 1;
                  this.$refs.asideTree.setCarInfo('alarm', 1)
                }
                vehNode.data = this.getUpNode(node, v)
                newNode = getCopyObj(node)
              } else {
                vehNode.data = this.getUpNode(node, newNode)
              }
            }
          }
        }
      }
      this.$nextTick(() => {
        this.newTree.clear()
      })
    },
    /**
     * 重新组装树节点的数据
     * @param oldNode 旧的节点数据
     * @param newNode 新的节点数据
     * @return upNode 修改之后的数据
     */
    getUpNode(oldNode, newNode) {
      const upNode = oldNode
      for (const [k, v] of Object.entries(oldNode)) {
        if (k !== 'id' && v !== null && typeof newNode[k] !== 'undefined') {
          if (typeof v === 'object' && typeof v !== 'null' && !Array.isArray(v)) {
            upNode[k] = this.getUpNode(v, newNode[k])
          } else {
            upNode[k] = newNode[k]
          }
        }
      }
      return upNode
    },
    //定位
    positionData(data) {
      //console.log('更改前:' + JSON.stringify(this.sideTree));
      const { $refs } = this;
      // console.log(data);
      $refs.footTable && $refs.footTable.addRun(getCopyObj(data))
      delete data.Id
      this.upNewTree(data)
      if (this.isUp) {
        this.upDomTree()
        this.isUp = false
        setTimeout(() => {
          this.isUp = true
        }, 10000)
      }
      data = null
    },
    // 告警弹窗
    alarmData(data) {
      const { $refs, $store, alarmNames, alarmIds, vehTerminalNoIdMap, newTree, alarmArr } = this
      // $refs.footTable.addAlarm(getCopyObj(data))
      $store.dispatch('alarm/alarmAddOrClear', true)

      if (!vehTerminalNoIdMap) return
      $store.dispatch('alarm/alarmAddOrClear', true)
      const veh = data.VehTerminalNo
      // 根据字典对象获取该报警的车辆在树里面的id
      var node = newTree.get(veh)
      if (node) {
        node.alam = 1
        newTree.set(veh, node)
      } else {
        newTree.set(veh, { alam: 1 })
      }
      // 根据用户提交的数据来过滤弹窗
      // 当过滤的报警名与id有值，只要任意满足一个就过滤
      if (
        alarmNames &&
        alarmIds &&
        (alarmNames.indexOf(data.AlarmDisplay) > -1 || alarmIds.indexOf(data.AlarmValue) > -1)
      ) {
        data = null
        return
      }
      
      if (data.AlarmDisplay.indexOf('紧急报警') > -1) {
        const i = alarmArr.findIndex(e => e.VehTerminalNo === data.VehTerminalNo)
        if (i === -1) {
          alarmArr.push(data)
        }
      }

      // 扩展字段
      const extensionData = getParse(data.ExtensionData, null)
      let btn = ''
      const alaPop = this.$t('allMonitor.alaPop')
      const time = data.AlarmTime ? getDateStr(data.AlarmTime) : ''
      if (extensionData) {
        // duration = 0;
        const row = {
          extensionData,
          vehTerminalNo: veh,
          alarmType: data.AlarmValue,
          stm: time,
          guid: extensionData.guid
        }
        btn = `</p><p style='overflow: hidden;padding: 5px 0 0;'><a href='javascript:;' data-row='${JSON.stringify(row)}' id='alarm_btn' style='float: right;display: block;background: #00a8d4;padding: 2px 5px;'>${alaPop.alaBtn}</a>`
      }
      const carNum = data.PlateNo
      const alaDisplay = data.AlarmDisplay ? data.AlarmDisplay.replace(/\r\n/g, '<br/>') : ''
      const message = `<div><p><span>${alaPop.carNum}</span>${carNum}</p><p><span>${alaPop.alaTime}</span>
      ${time}</p><p style="dispaly:flex;"><span>${alaPop.alaContent}</span>${alaDisplay}${btn}</p></div>`
      // 最多只存在三个，多余的就删除
      if (this.notifys.length >= 3) {
        this.notifys[0].close()
      }
      data = null
      const notify = Notification({
        type: 'warning',
        title: carNum,
        dangerouslyUseHTMLString: true,
        message,
        position: 'bottom-right',
        onClick: () => {
          // 点击通知弹窗的回调
          // 根据字典对象获取该报警的车辆在树里面的id
          const vehInfo = this.vehTerminalNoIdMap.get(veh)
          if (vehInfo && Array.isArray(vehInfo.ids) && vehInfo.ids.length > 0) {
            const { ids } = vehInfo
            var vehNode = $refs.asideTree.$refs.tree.getNode(ids[0])
            if (vehNode) {
              const nodes = vehNode.data
              if (!vehNode.checked) {
                // 没有勾选，手动勾选，并把改节点的marker渲染到地图上
                $refs.asideTree.$refs.tree.setChecked(ids[0], true)
              }
              this.changeChecked(nodes, { checkedKeys: [ids[0]] })
            }
          }
        },
        onClose: () => {
          this.notifys.shift()
        }
      })
      this.$nextTick(() => {
        this.notifys.push(notify)
      })
      data = null
    },
    // 接收指令信息弹窗
    popupReply(data) {
      const msgId = +data.MsgId ? `0x${(+data.MsgId).toString(16)}` : ''
      if (msgId == '0x9105' || msgId == '0x9101' || msgId == '0x9102') return
      // console.log(msgId);
      const alaPop = this.$t('allMonitor.alaPop')
      const plateNo = data.TerminalPhoneNo
      const msg = `<div><p><span>${alaPop.msgId}</span>${msgId}</p><p><span>${alaPop.result}</span>${data.JT808TerminalResult}</p></div>`
      Notification({
        type: 'info',
        position: 'bottom-right',
        dangerouslyUseHTMLString: true, // 是否当成html处理
        title: plateNo,
        message: msg
      })
      data = null
    },
    // 透传
    passThrough(data) {
      // console.log(data, '透传');
      Notification({
        type: 'success',
        title: data.VehPlateNo,
        message: data.PassthroughContent,
        position: 'bottom-right'
      })
      data = null
    },
    /**
     * 胎压报警
     */
    passthroughTire(data) {
      // 证明打开胎压弹窗且推送的数据是当前打开的窗口的同一台车,使用终端号比较
      if (this.popupIsShow && this.tyrePressureInfo.vehTerminalNo == data.VehTerminalNo) {
        var list = []
        // 胎压的数据为数组且长度大于0
        if (Array.isArray(data.tirePressInfos) && data.tirePressInfos.length) {
          /* 由于推送的数据key首字母是大写，所以需要替换成小写 */
          for (var i in data.tirePressInfos) {
            var obj = {}
            for (var key in data.tirePressInfos[i]) {
              var oneStr = key.charAt(0).toLocaleLowerCase()
              var newKey = oneStr + key.substring(1)
              obj[newKey] = data.tirePressInfos[i][key]
            }
            list.push(obj)
          }
          this.tyrePressureInfo.tirePressInfos = this.setTyrePressureInfo(list)
        }
        this.tyrePressureInfo.gpsTime = getDateStr(this.tyrePressureInfo.gpsTime)
      }
      data = null
    },
    // 比较状态,更改状态所对应车辆的数值
    compareState(oldState, newState, name) {
      // console.log(oldState, newState, name);
      if (oldState == 0 && newState == 1) {
        this.$refs.asideTree.setCarInfo('stop', -1)
        this.$refs.asideTree.setCarInfo('run', 1)
      } else if (oldState == 1 && newState == 0) {
        this.$refs.asideTree.setCarInfo('stop', 1)
        this.$refs.asideTree.setCarInfo('run', -1)
      } else if ((oldState == 2 || oldState == 3 || oldState == 6) && newState == 0) {
        this.$refs.asideTree.setCarInfo('offline', -1)
        this.$refs.asideTree.setCarInfo('stop', 1)
      } else if ((oldState == 2 || oldState == 3 || oldState == 6) && newState == 1) {
        this.$refs.asideTree.setCarInfo('offline', -1)
        this.$refs.asideTree.setCarInfo('run', 1)
      }
    },
    /**
     * 围栏复选框勾选
     * @param {Array} data 复选框勾选的数据
     * @param {String} type 标注点类型（1是点，2是线，3是矩形）
     * @param {Boolean} isAdd true添加覆盖物，false删除覆盖物
     */
    changeCheck(data, type, isAdd) {
      this.$refs.tool.setEditState(false)
      this.panelAnimate(false)
      // if (!data) return
      if (isAdd) {
        this.$refs.map.setMarkerFn(data, type) 
      } else {
        this.clearOverlaysAll(false, { data, type })
      }
    },
    // 鼠标工具位置的动画
    panelAnimate(boole) {
      var Odrawing = document.querySelector('.BMapLib_Drawing_panel')
      if (!Odrawing) return
      if (boole) {
        Odrawing.setAttribute('class', 'BMapLib_Drawing_panel drawing-transition-start')
      } else {
        Odrawing.setAttribute('class', 'BMapLib_Drawing_panel drawing-transition-end')
      }
    },
    // 鼠标工具的显示与隐藏
    panelShow(boole) {
      var Odrawing = document.querySelector('.BMapLib_Drawing_panel')
      if (!Odrawing) return
      if (boole) {
        Odrawing.style.display = 'block'
      } else {
        Odrawing.style.display = 'none'
      }
    },
    /**
     * 修改围栏标记点
     */
    upMark() {
      this.$refs.tool.setEditState(true)
      // 修改的时候把鼠标工具的按钮隐藏掉
      this.panelAnimate(true)
    },
    /**
     * 清除标记点的覆盖物
     * @param { Boolean } isOverlays 需要清除谁
     * @param {Any} opt 删除的参数
     * @param {Boolean} isQuit 是否需要退出
     */
    clearOverlaysAll(isOverlays, opt, isQuit) {
      const { $refs } = this
      $refs.tool.handleQuit(isQuit)
      if (!$refs.map) return
      $refs.map.clearOverlaysAll(isOverlays, opt)
    },
    /**
     * 设置编辑的经纬度
     * @param {Array} latLngs 经纬度
     */
    setLatLngs(latLngs) {      
      this.markLatLngs = latLngs
    },
    /**
     * 围栏编辑结束
     */
    handleEditEnd() {
      // 把绘制完成按钮移除
      this.$refs.tool.setEditState(false)
      // 将鼠标绘制工具显示出来
      this.panelAnimate(false)
      this.clearOverlaysAll(false)
    },
    /**
     * 点击绘制完成弹窗修改
     */
    handleEditSuc() {
      this.$refs.fence.handleEditEnd()
    },
    /**
     * 点击退出绘制
     */
    handleQuit(isShow) {
      this.$refs.map.handleQuit()
      /*修改的时候把鼠标工具的按钮显示出来*/
      this.panelAnimate(isShow)
    },
    /**
     * 控制标记点盒子的显示隐藏
     */
    handleMarkBtn(markeBoxShow) {
      // 切换到拖动地图
      // this.$refs.map.close()
      this.$refs.tool.setIsShow(markeBoxShow)
      this.panelAnimate(!markeBoxShow)
      if (markeBoxShow) {
        this.$refs.fence.getDptAll(true)
      } else {
        // 清除之前的覆盖物
        this.clearOverlaysAll(false)
      }
    },
    /**
     * 点击路况信息按钮
     */
    handleTraffic(showTraffic) {
      const { isTraffic } = this;
      this.isTraffic = showTraffic;
      // if (isTraffic) return
      // this.isTraffic = true
    },
    /**
     * 点击infoWin上面的按钮查看胎压报表
     */
    async queryMore() {
      const { tirePressureIsShow, popInfo } = this
      const data = {
        isShow: tirePressureIsShow,
        obj: popInfo,
        ref: 'tirePopup',
        id: 'tire_pressure_from',
        url: '/home/dataSearch/tirePressure'
      }
      const res = await this.clickInfoWinBtn(data)
      if (res) {
        this.popInfo = res
        this.tirePressureIsShow = true
      }
    },
    // 点击报警图标弹窗
    changeAlamPop(data) {
      // A页面这里触发一个changeAlamPop
      eventBus.$emit('changeAlamPop', data)
    },
    // 获取v-if显示出来的dom
    getDom(id, callback) {
      var oDiv = document.getElementById(id)
      if (oDiv) {
        callback()
      } else {
        setTimeout(() => {
          this.getDom(id, callback)
        }, 50)
      }
    },

    /**
     * 点击右侧视频功能栏的图标显示中间的视频视图
     * @param {Number} curPage 当前页
     */
    handleShowCenVideo(videos, curPage, k, i) {
      // 隐藏鼠标绘制工具
      this.panelShow(false)
      this.isShowCenVideo = true
      // true双击右侧视频，false显示中间弹窗
      if (k !== undefined && i !== undefined) {
        this.$refs.cVideo.dblRightVideo(videos, curPage, k, i)
      } else {
        this.$refs.cVideo.init(videos, curPage)
      }
    },
    /**
     * 点击关闭中间视频
     */
    handleCenHide(videos, curPage) {
      const { $refs } = this
      // 显示鼠标绘制工具
      this.panelShow(true)
      this.isShowCenVideo = false
      $refs.rVideo.handleCenHide(videos, curPage)
      $refs.map.clearPt()
    },
    /**
     * 显示弹窗
     */
    popupShow() {
      this.$refs.popup.show()
    },
    /**
     * 确认替换视频
     */
    handleReplaceConfirm() {
      if (this.isShowCenVideo) {
        this.$refs.cVideo.handleReplaceConfirm()
      } else {
        this.$refs.rVideo.handleReplaceConfirm()
      }
    },
    /**
     * 点击司机姓名打开司机信息弹窗
     * @param {Object} curNode marker点的当前信息
     */
    handleDrive(curNode) {
      const { $refs } = this
      $refs.drive.initInfo(curNode)
    },
    /**
     * 紧急报警弹窗关闭
     * @param {String} plateNo 车牌号
     */
    handleAlarmConfirm(plateNo) {
      const { alarmArr } = this
      const i = alarmArr.findIndex(e => e.PlateNo === plateNo)
      if (i > -1) {
        alarmArr.splice(i, 1)
      }
    },
    /**
     * 点击关闭路况
     * @return {[type]} [description]
     */
    handleCloseTraffic() {
      this.isTraffic = false
    },
    /**
     * 刷新路况
     */
    handleRefreshTraffic() {
      const { $refs } = this
      $refs.map.handleRefreshTraffic()
    },
    /**
     * 轨迹弹窗点击关闭的回调
     */
    async handClose() {
      const { $refs } = this
      await $refs.trail.clearMap()
      this.trailMapShow = false
    }
  }
}
</script>

<style scoped>
#box {
  flex: 1;
  position: relative;
  overflow: hidden;
}
.trail {
  width: 90%;
  height: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 5px 5px;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
}
.trail:hover {
  cursor: move;
}
.trail .trail-content {
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.trail .title,
.tire-pressure .title {
  padding: 0 10px 1px;
  height: 30px;
  line-height: 30px;
  color: #fff;
}

.trail h3,
.tire-pressure h3 {
  line-height: 30px;
  cursor: pointer;
}

#trail-map {
  width: 90%;
  height: 90%;
  background: #fff;
  margin: 0 auto;
  border: 1px solid #000;
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
#trail .left {
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 100%;
  cursor: w-resize;
}
#trail .right {
  position: absolute;
  top: 0;
  right: 0;
  width: 15px;
  height: 100%;
  cursor: e-resize;
}
#trail .top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 15px;
  cursor: n-resize;
}
#trail .bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  cursor: s-resize;
}
.tire-pressure {
  position: fixed;
  top: 0;
  left: 0;
  width: 90%;
  height: 90%;
  z-index: 1020;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 5px 5px;
}
.tire-pressure:hover {
  cursor: move;
}
#box /deep/ .dialog-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
