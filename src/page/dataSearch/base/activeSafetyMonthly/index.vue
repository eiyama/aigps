<!-- 主动安全月报 -->
<template>
  <div class="wrap">
    <tab-bar :searchList="searchList" :operButton="operButton" :filterFn="filterFn" :pickerOptions2="pickerOptions" @exportFile="exportFile" @query="query" @searchValChange="searchValChange" @searchNodeClick="handleNode"></tab-bar>
    <div style="flex: 1;overflow-y: scroll;display: flex;flex-direction: column;">
      <div id="upload">
        <div id="top1" class="top">
          <h4 class="title-color companyTitle">          
            <img style="height:30px;" src="../../../../assets/image/allMonitor/logo.jpg" alt="">
            深圳市开源节流科技有限公司           
          </h4>
          <h1 class="title-color" style="text-align: center;">智能风控运营{{ text.unit }}报</h1>
          <div class="date">{{ date }}</div>
        </div>
        <div class="content">
          <div class="info">
            <div class="title-color">保密信息</div>
            <div class="hr"></div>
            <div class="model">
              <div class="name title-color">项目信息卡</div>
              <div class="li">
                <div class="label">企业名称：</div>
                <div class="val">{{ user.dptName || user.userName || ''}}</div>
              </div>
              <div class="li">
                <div class="label">在线车辆数：</div>
                <div class="val">{{ info1.onlineVehicle || 0 }}</div>
              </div>
              <div class="li">
                <div class="label">行业类型：</div>
                <div class="val">道路货运</div>
              </div>
              <div class="li">
                <div class="label">风控服务内容：</div>
                <div class="val">风控平台使用培训、7*24h风控客服、安全运营报告推送</div>
              </div>
            </div>
          </div>
          <div class="ul ul1">
            <div class="hr"></div>
            <div class="cur-title title-color">1、项目总体情况概述</div>
            <div class="hr"></div>
            <p>{{ user.dptName || user.userName || '' }}项目在网车辆共{{ info1.onlineVehicle || 0 }}辆。<p/>
            <p>项目车辆总运营里程为{{ info1.mileageTotal || 0 }}公里，重点风险事件总数为{{ info1.riskEvent || 0 }}件，百公里风险数为{{ info1.riskHundred || 0 }}件。</p>
          </div>
          <div class="ul ul2">
            <div class="hr"></div>
            <div class="cur-title title-color">2、车辆行驶数据分析</div>
            <div class="hr"></div>
            <div class="title title-color">2.1 整体趋势分析</div>
            <p>{{ info2.travel || '' }}</p>
            <p>{{ info2.operate || '' }}</p>
            <chart-line vId="line1" ref="line1" />
            <div class="hr200"></div>
            <div class="msg">
              <div class="msg-color">1 重点风险事件包含:车道偏离、疲劳预警</div>
              <div class="msg-color">2 百公里风险数=风险事件数/行驶里程×100，如不做特殊说明，一般指重点风险事件的百公里风险数，单位为件。</div>
            </div>
            <p>{{ info2.details || '' }}</p>
            <!-- 饼图 -->
            <div class="pie-box">
              <chart-pie vId="pie1" ref="pie1" />
              <chart-pie vId="pie2" ref="pie2" />
            </div>
          </div>
          <!-- 3 -->
          <div class="ul ul3">
            <div class="hr"></div>
            <div class="cur-title title-color">3、重点风险事件整体分析</div>
            <div class="hr"></div>
            <div class="title title-color">3.1 整体走势分析</div>
            <p>{{ info3.riskEvent || '' }}</p>
            <p>{{ info3.riskHundred || '' }}</p>
            <chart-line vId="line2" ref="line2" />
          </div>
          <!-- 4 -->
          <div class="ul ul4">
            <div class="hr"></div>
            <div class="cur-title title-color">4、各重点风险事件具体分析</div>
            <div class="hr"></div>
            <div class="title title-color">4.1 整体走势分析</div>
            <div class="text4">
              <p v-for="(v,i) in info4" :key="i">{{`${i + 1}）${v}`}}</p>
            </div>
            <chart-line vId="line3" ref="line3" />
          </div>
          <!-- 5 -->
          <div class="ul ul5">
            <div class="hr"></div>
            <div class="cur-title title-color">5、高风险事件时间段分析</div>
            <div class="hr"></div>
            <div class="title title-color">5.1 各时段趋势分析</div>
            <p>{{text.cur}}，疲劳预警数量在各时段的分布情况如下：</p>
            <chart-line vId="line4" ref="line4" />
            <div class="title title-color">5.2 分析结论及建议</div>
            <p>{{ info5.msg || '' }}</p>
          </div>
          <!-- 6 -->
          <div class="ul ul6">
            <div class="hr"></div>
            <div class="cur-title title-color">6、车队与车辆排名</div>
            <div class="hr"></div>
            <div class="title title-color">6.1 车辆安全排名</div>
            <p>{{ info6.rule || '' }}</p>
            <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" />
            <p style="padding: 10px 0 0;" v-show="!!tableData.length">请企业/车队重点关注扣分最高的车辆，对该辆车所对应的驾驶员进行安全教育培训，尽早防范风险。</p>
            <div class="title title-color">6.2 司机安全排名</div>
            <p>{{ info6.rule || '' }}</p>
            <my-table :isPageing="false" :tableData="tableData2" :tableTitle="tableTitle2" />
            <p style="padding: 10px 0 0;" v-show="!!tableData2.length">请企业/车队重点关注扣分最高的司机，对该司机进行安全教育培训，尽早防范风险。</p>
          </div>
          <!-- 附录 -->
          <div v-if="!!otherList.length" class="other">
            <h5>重点风险事件排名及案例</h5>
            <div v-for="(v, i) of otherList" :key="i" class="other-box" :style="{height: `${v.h}px`}">
              <div class="hr"></div>
              <h6 v-if="!!v.child.length"><span class="iconfont icon-biaoqiantixi"></span>{{ v.prop }}</h6>
              <div class="other-img">
                <div v-for="(e, j) of v.child" :key="j" class="other-img-li">
                  <div v-if="!!e.fileUrl" class="li">
                    <div class="img">
                      <canvas ref="canvas" :data-url="e.fileUrl"></canvas>
                      <!-- <img :src="e.fileUrl" /> -->
                    </div>
                    <div class="text">
                      <p>车牌号：{{ e.plateNo }}</p>
                      <p>{{ v.prop }}</p>
                      <p>时间：{{ e.updateTime }}</p>
                      <p>地址：{{ e.position }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 安全建议 -->
          <div class="ul" style="margin-top:20px;">
            <div class="title title-color">安全建议</div>
            <p>驾驶过程中疲劳驾驶、不打转向灯（车道偏离）、注意力分散都属于不规范的驾驶行为，需要驾驶员在驾驶过程中加以规避。</p>
            <p>要避免疲劳驾驶，建议注意以下几点：</p>
            <p>1.调节座椅到适当的位置：高低适中-座椅过高，驾驶时驾驶员容易驼背，即使保持挺直姿态，也会显得僵硬，不方便操作。前后恰当-前脚掌踩在离合踏板上，完全踩死时，整条腿仍要保持一定的弯曲度，这样事故发生时可以有缓冲空间，同时也可减轻腿部疲劳。</p>
            <p>2.身体与方向盘有一定距离：身体与方向盘较好的距离是，当手臂伸直时，手腕恰好可以搭在方向盘正上方轮辐上。</p>
            <p>3.座椅可稍微向后倾斜：这可让身体在驾车时保持平衡，缓解颈部与背部压力。对于没有腰部支撑功能的车辆，可以在背部与座椅空隙处加个腰垫，长途驾驶感觉更舒适。</p>
            <p>4.多注意饮食调剂：饮食也是一个很重要的方面，我们知道有的食物具有安眠、催神作用，在驾驶之前就应该避免食用，如：牛奶、香蕉、肥肉及含酒精类食物！</p>
            <p>5.行车时多通风：在驾驶过程中已经感觉困乏时，还可以打开车窗通通风，放不同风格的音乐，嚼嚼口香糖，涂抹风油精。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTreeRepeatValue, getTodays, getPickerOptions3 } from '@/utils/data'
import { getCopyObj, getDecimalN, getDateStr, getFormatTime, getInterval, getMax } from '@/utils/util'
import { getActiveSecurityWeekReport, getActiveSecurityMonthReport, getActiveSecurityDayReport } from '@/api/dataSearch/base'
import { getDepartmentAll } from '@/api/sysetsmM/dpt'
import { getReportPhotoListSafe, getAddress } from '@/api/video'
import { isLatLng } from '@/utils/validate'
import TabBar from '@/components/tabBar'
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'
// import printJS from 'print-js'
import ChartLine from '@/components/chartLine'
import ChartPie from '@/components/chartPie'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  components: {
    ChartLine,
    ChartPie,
    MyTable,
    TabBar
  },
  data() {
    const tableTitle = getCopyObj(this.$t('activeSafetyMonthly.carTable'))
    const tableTitle2 = getCopyObj(this.$t('activeSafetyMonthly.driverTable'))
    const searchList = getCopyObj(this.$t('activeSafetyMonthly.searchList'))
    const date = getFormatTime('Y-M-D')
    const pickerOptions = getPickerOptions3(this.$t('otherText'))
    searchList.date.model = date
    const alaList = tableTitle.filter(v => {
      if (v.hasOwnProperty('alaType') && v.alaType) {
        return true
      }
    })
    return {     
      tableData: [],
      tableData2: [],
      tableTitle,
      tableTitle2,
      searchList,
      pickerOptions,
      lock: true,
      operButton: {},
      curNode: {},
      user: {},
      text: {},
      date,
      info1: {},
      info2: {},
      info3: {},
      info4: [],
      info5: {},
      info6: {},
      num: 0,
      alaImgs: [],
      alaList,
      otherList: []
    }
  },
  computed: {
    ...mapGetters([
      'menuTree',
      'userInfo',
      'jsession'
    ])
  },
  async created() {
    const { $route, $store, menuTree, searchList, userInfo } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    try {
      const res = await getDepartmentAll({ id: userInfo.id }, { dom: null })
      searchList.dpt.tree = res.result.items
    } catch(err) {

    }
  },
  beforeDestroy() {
  },
  methods: {
    /**
     * canvas画图
     */
    draw() {
      const { $refs } = this
      const w = $refs.canvasBox.clientWidth
      const canvas = $refs.canvas
      canvas.width = w
      canvas.height = 200
      const imgArr = [require('@/assets/image/login/qrCode.png'), require('@/assets/image/login/logo.png')]
      const ctx = canvas.getContext('2d')
      this.drawImg(ctx, canvas, imgArr, 0)
    },
    drawImg(ctx, canvas, imgArr, top) {
      const leng = imgArr.length
      this.num ++
      const { num } = this
      const { height, width } = canvas
      const img = new Image()
      img.onload = () => {
        canvas.height = img.height + height
        let w = img.width
        if (w > width) {
          w = width
        }
        ctx.drawImage(img, 0, top, w, img.height)
        top += img.height
        if (num >= leng) {
          ctx.save()
          return
        }
        this.drawImg(ctx, canvas, imgArr, top)
      }
      img.src = imgArr[num - 1]
    },
    /**
     * 树过滤
     */
    filterFn(val, data) {
      if (!val) return true
      const name = data.dptName ? data.dptName.toUpperCase() : ''
      val = val.toUpperCase()
      return name.indexOf(val) > -1
    },
    /**
     * 根据报表类型来获取不同的字段key
     * @param {Boolean} isUpper 首字母是否大写
     * @return {String}
     */
    getStrKey(isUpper) {
      const { searchList } = this
      const type = searchList.type.model
      if (type === 0 || type === 1) {
        return isUpper ? 'Week' : 'week'
      } else {
        return isUpper ? 'Month' : 'month'
      }
    },
    /**
     * 获取文字
     * @retrun {Object}
     */
    getText() {
      const text = this.$t('activeSafetyMonthly.text')
      const { searchList } = this
      const type = searchList.type.model
      if (type === 0) {
        return text['day']
      } else if (type === 1) {
        return text['week']
      } else {
        return text['month']
      }
    },
    /**
     * 查询
     */
    query() {
      const date = this.searchList.date.model
       if (!date) {
        Message.error(this.$t('error.selectTimes'))
        return
      }
      this.info1 = {}
      this.info2 = {}
      this.info3 = {}
      this.info4 = []
      this.info5 = {}
      this.info6 = {}
      this.tableData = []
      this.tableData2 = []
      this.date = date
      this.requestInfo()
    },
    /**
     * 点击树节点
     */
    handleNode(data) {
      this.curNode = data
      this.searchList.dpt.model = data.dptName
    },
    /**
     * 输入框改变
     */
    searchValChange() {
      this.curNode = {}
    },
    /**
     * 获取请求参数
     */
    getRequestData() {
      const curDate = this.searchList.date.model
      const dptId = this.curNode.id || this.userInfo.id
      return {
        queryDate: curDate,
        queryMonthNum: 0,
        queryDayNum: 7,
        dptId
      }
    },
    /**
     * 请求数据
     */
    async requestInfo() {
      const curDate = this.searchList.date.model
      const type = this.searchList.type.model
      const dptId = this.curNode.id || this.user.dptId
      const data = { curDate, dptId }
      let res
      if (type === 0) {
        res = await getActiveSecurityDayReport(data)
      } else if (type === 1) {
        res = await getActiveSecurityWeekReport(data)
      } else {
        res = await getActiveSecurityMonthReport(data)
      }
      this.text = this.getText()
      // 基础信息
      const result = res.result || {}
      const strKey1 = this.getStrKey()
      const strKey2 = this.getStrKey(true)
      const baseInfo = result[`curActiveSecurity${strKey2}Report`] || {}
      this.$set(this.user, 'dptName', baseInfo.dptName)
      this.$set(this.info6, 'rule', result.calculationRules)
      // 车辆行驶数据趋势
      const weekMileageAndHourStatisticList = result[`${strKey1}MileageAndHourStatisticList`] || []
      if (!weekMileageAndHourStatisticList.length) {
          this.$refs.line1.setState(false)
      } else {
          this.$refs.line1.chartsRender(this.getLineBar1(weekMileageAndHourStatisticList))
      }
      // 行驶里程，行驶时长（饼图）
      const weekMileageAndHourStatistic = baseInfo[`${strKey1}MileageAndHourStatistic`]
      this.$set(this.info1, 'onlineVehicle', weekMileageAndHourStatistic ? weekMileageAndHourStatistic.totalVehicle : 0)
      if (weekMileageAndHourStatistic) {
        const pie1 = {
          total: weekMileageAndHourStatistic.totalVehicle || 0,
          list: weekMileageAndHourStatistic[`${strKey1}MileageOverAlartValues`] || {}
        }
        this.$refs.pie1.chartsRender(this.getPie1(pie1))
        const pie2 = {
          total: weekMileageAndHourStatistic.totalVehicle || 0,
          list: weekMileageAndHourStatistic[`${strKey1}HourOverAlartValues`] || {}
        }
        this.$refs.pie2.chartsRender(this.getPie2(pie2))
      } else {
        this.$refs.pie1.setState(false)
        this.$refs.pie1.dispose()
        this.$refs.pie2.setState(false)
        this.$refs.pie2.dispose()
      }

      // 风险事件数据趋势
      const weekImportRiskEventsStatisticList = result[`${strKey1}ImportRiskEventsStatisticList`] || []
      if (weekImportRiskEventsStatisticList.length) {
        this.$refs.line2.chartsRender(this.getLineBar2(weekImportRiskEventsStatisticList))
      } else {
        this.$refs.line2.setState(false)
      }

      // 各时段日均风险数
      const weekImportRiskEventsStatistic = baseInfo[`${strKey1}ImportRiskEventsStatistic`] || {}
      const list = weekImportRiskEventsStatistic.fatigueDrivingAlarmTimePeriodPerDay
      if (list && JSON.stringify(list) !== '{}') {
        this.$refs.line4.chartsRender(this.getBar2(list))
      } else {
        this.$refs.line4.setState(false)
      }

      // 4、各重点风险事件具体分析
      const lastRiskEvents = result[`last${strKey2}InportRiskEvents`] || {}
      const alaInfo = {
        curEvent: weekImportRiskEventsStatistic.importRiskEventStatistics,
        lastEvent: lastRiskEvents.importRiskEventStatistics
      }
      const isCur = alaInfo.curEvent instanceof Array && alaInfo.curEvent.length
      const isPrev = alaInfo.lastEvent instanceof Array && alaInfo.lastEvent.length
      if (isCur && isPrev) {
        this.$refs.line3.chartsRender(this.getBar1(alaInfo))
      } else {
        this.$refs.line3.setState(false)
      }
      // 车辆排名
      const tableData = weekImportRiskEventsStatistic.vehicleImportRiskEventsRanking || []
      for (const v of tableData.values()) {
        v.totalMileage = getDecimalN(v.totalMileage)
        v.safetyDeductionPer100Km = getDecimalN(v.safetyDeductionPer100Km)

        for (const [k, e] of Object.entries(v.importRiskEventDic)) {
          v[k] = e
        }
      }
      this.tableData = tableData

      // 司机排名
      const tableData2 = weekImportRiskEventsStatistic.vehicleDriverRiskEventsRanking || []
      for (const v of tableData2.values()) {
        v.totalMileage = getDecimalN(v.totalMileage)
        v.safetyDeductionPer100Km = getDecimalN(v.safetyDeductionPer100Km)

        for (const [k, e] of Object.entries(v.importRiskEventDic)) {
          v[k] = e
        }
      }
      this.tableData2 = tableData2
      this.requestImg()
    },
    /**
     * 调用通天星接口获取报警图片
     */
    async requestImg() {
      const { jsession, alaList, tableData } = this
      const otherList = getCopyObj(alaList)
      const arr = []
      const vehs = []
      for (const [i, v] of otherList.entries()) {
        arr.push(v.alaType)
        if (!v.hasOwnProperty('child')) {
          v.child = []
        }
        for (const e of tableData.values()) {
          if (i === 0) {
            vehs.push(e.plateNo)
          }
          if (e.hasOwnProperty([v.prop]) && e[v.prop]  > 0) {
            const { safetyDeductionPer100Km, totalMileage, plateNo } = e
            const data = {
              total: e[v.prop],
              plateNo,
              totalMileage,
              safetyDeductionPer100Km
            }
            v.child.push(data)
          }
        }
      }
      const dates = this.getTime()
      const data = {
        begin: dates.startTime,
        end: dates.endTime,
        alarmType: arr.join(),
        mediaType: 0,
        vehiIdno: vehs.join(),
        curPage: '',
        limit: '',
        jsession
      }
      try {
        const res = await getReportPhotoListSafe(data)
        const infos = res.infos || []
        if (!infos.length) {
          this.otherList = []
          return
        }
        for (const v of infos.values()) {
          const item = otherList.find(e => e.alaType.indexOf(v.alarmType) > -1)
          if (item) {
            const { child } = item
            const elem = child.find(e => e.plateNo === v.vehiIdno)
            if (elem && !elem.fileUrl) {
              elem.fileUrl = v.fileUrl
              elem.alarmType = v.alarmType
              elem.updateTime = getFormatTime('Y-M-D h:m:s', v.updateTime)
              // if (isLatLng(v.position)) {
              //   const [lat, lng] = v.position.split(',')
              //   const res = await getAddress(lat, lng)
              //   v.position = res.result.formatted_address
              // }
              elem.position = v.position
            }
          }
        }

        for (const v of otherList.values()) {
          const i = v.child.reduce((num, e) => {
            if (e.fileUrl) num++
            return num
          }, 0)
          // 盒子高度（每行3个，行高412）
          const h = Math.ceil(i / 3) * 419
          v.h = h
        }
        this.otherList = otherList
        this.drawCanvas()
      } catch (err) {
        this.otherList = []
      }
    },
    /**
     * 根据报表类型获取开始与结束时间
     */
    getTime() {
      const { searchList } = this
      // 0是日报，1是周报，2是月报
      const startDate = new Date()
      const endDate = new Date()
      const start = startDate.getDate()
      const end = endDate.getDate()
      if (searchList.type.model) {
        startDate.setDate(start - 4)
        endDate.setDate(end - 1)
        const startTime = `${getFormatTime('Y-M-D', startDate)} 00:00:00`
        const endTime = `${getFormatTime('Y-M-D', endDate)} 23:59:59`
        return {
          startTime,
          endTime
        }
      } else {
        startDate.setDate(start - 1)
        endDate.setDate(end - 1)
        const startTime = `${getFormatTime('Y-M-D', startDate)} 00:00:00`
        const endTime = `${getFormatTime('Y-M-D', endDate)} 23:59:59`
        return {
          startTime,
          endTime
        }
      }
    },
    /**
     * 绘制canvas
     */
    async drawCanvas() {
      await this.$nextTick()
      const { $refs, num } = this
      const aCanvas = $refs.canvas
      for (const v of aCanvas.values()) {
        const url = v.getAttribute('data-url')
        const ctx = v.getContext('2d')
        this.getBase64(url, res => {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0, 340, 200)
            ctx.save()
          }
          img.src = res
        })
      } 
    },
    /**
     * 网络图片转base64
     */
    getBase64(imgUrl, callback) {
      window.URL = window.URL || window.webkitURL
      const xhr = new XMLHttpRequest()
      xhr.open('get', imgUrl, true)
      // 至关重要
      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          const blob = this.response
          // 至关重要
          let oFileReader = new FileReader()
          oFileReader.onloadend = e => {
            // 此处拿到的已经是 base64的图片了
            const base64 = e.target.result
            callback(base64)
          }
          oFileReader.readAsDataURL(blob)
        }
      }
      xhr.send()
    },
    /**
     * 获取折线柱状图1的数据
     * @param {Array} list 渲染折线柱状图的数据
     * @param {Number} total 车辆总数
     */
    getLineBar1(list) {
      const timeArr = []
      const series = []
      const strKey1 = this.getStrKey()
      const strKey2 = this.getStrKey(true)
      const { text } = this
      for (const v of list.values()) {
        timeArr.push(getDateStr(v.date, true))
        if (!series.length) {
          series.push({ data: [] })
          series.push({ data: [] })
        }
        series[0].data.push(getDecimalN(v[`${strKey1}TotalMileage`]))
        series[1].data.push(getDecimalN(v.avgMileagePerVehicleAndDay))
      }
      const lastObj = list[list.length - 1]
      const travel = `1）行驶数据：${text.cur}该企业累计行驶${getDecimalN(lastObj[`${strKey1}TotalMileage`])}公里；累计行驶时长为${getDecimalN(lastObj[`${strKey1}TotalHour`])}小时；`
      const operate = `2）运营强度：车均日均行驶里程和时长分别为${getDecimalN(lastObj.avgMileagePerVehicleAndDay)}公里、${getDecimalN(lastObj.avgHourPerVehicleAndDay)}小时。`
      this.$set(this.info2, 'travel', travel)
      this.$set(this.info2, 'operate', operate)
      this.$set(this.info1, 'mileageTotal', getDecimalN(lastObj[`${strKey1}TotalMileage`]))

      const opt = {
        title: '车辆行驶数据趋势',
        align: 'center',
        legend: {
          data: ['总行程', '车均日均里程'],
          bottom: 0
        },
        color: ['#00A8D4', '#ff0000'],
        timeArr,
        yAxis: [
          {
            type: 'value',
            // name: '总行程',
            max: val => getMax(val.max),
            min: 0,
            interval: getInterval(series[0].data),
            axisLabel: {
              formatter: '{value} 公里'
            }
          },
          {
            type: 'value',
            // name: '车均日均里程',
            max: val => getMax(val.max),
            min: 0,
            interval: getInterval(series[1].data),
            axisLabel: {
              formatter: '{value} 公里'
            }
          }
        ],
        series: [
          {
            name: '总行程',
            type: 'bar',
            data: series[0].data,
            barWidth: 30
          },
          {
            name: '车均日均里程',
            // smooth: true,
            type: 'line',
            yAxisIndex: 1,
            data: series[1].data
          }
        ]
      }
      return opt;
    },
    /**
     * 获取折线柱状图2的数据
     * @param {Array} list 数据
     */
    getLineBar2(list) {
      const timeArr = []
      const arr1 = []
      const arr2 = []
      const strKey1 = this.getStrKey()
      const strKey2 = this.getStrKey(true)
      const {text} = this
      for (const v of list.values()) {
        timeArr.push(getDateStr(v.date, true))
        const totalImportRiskEvents = v[`${strKey1}TotalImportRiskEvents`]
        const totalImportRiskEventsPer100Km = v[`${strKey1}TotalImportRiskEventsPer100Km`]
        arr1.push(getDecimalN(totalImportRiskEvents))
        arr2.push(getDecimalN(totalImportRiskEventsPer100Km))
      }
      const curEvent = list[list.length - 1]
      const totalImportRiskEventsRate = curEvent[`${strKey1}TotalImportRiskEventsRate`]
      const totalImportRiskEventsPer100KmRate = curEvent[`${strKey1}TotalImportRiskEventsPer100KmRate`]
      const totalImportRiskEvents = curEvent[`${strKey1}TotalImportRiskEvents`]
      const totalImportRiskEventsPer100Km = curEvent[`${strKey1}TotalImportRiskEventsPer100Km`]
      const text1 = +totalImportRiskEventsRate >= 0 ? '上升' : '下降'
      const text2 = +totalImportRiskEventsPer100KmRate >= 0 ? '上升' : '下降'
      const riskEvent = `1）重点风险事件：${text.cur}累计发生重点风险事件${getDecimalN(totalImportRiskEvents)}件，环比${text1}${Math.abs(getDecimalN(totalImportRiskEventsRate * 100))}%。`
      const riskHundred = `2）百公里风险数：重点风险事件的百公里风险总数${getDecimalN(totalImportRiskEventsPer100Km)}件，环比${text1}${Math.abs(getDecimalN(totalImportRiskEventsPer100KmRate * 100))}%。`

      this.$set(this.info3, 'riskEvent', riskEvent)
      this.$set(this.info3, 'riskHundred', riskHundred)
      this.$set(this.info1, 'riskEvent', getDecimalN(totalImportRiskEvents))
      this.$set(this.info1, 'riskHundred', getDecimalN(totalImportRiskEventsPer100Km))
      const opt = {
        title: '风险事件数据趋势',
        align: 'center',
        legend: {
          data: ['风险事件总数', '百公里风险数'],
          bottom: 0
        },
        color: ['#00A8D4', '#ff0000'],
        timeArr,
        yAxis: [
          {
            type: 'value',
            // name: '车均日均里程',
            max: val => getMax(val.max),
            min: 0,
            interval: getInterval(arr1),
            axisLabel: {
              formatter: '{value} 件'
            }
          },
          {
            type: 'value',
            // name: '车均日均里程',
            max: val => getMax(val.max),
            min: 0,
            interval: getInterval(arr2),
            axisLabel: {
              formatter: '{value} 件'
            }
          }
        ],
        series: [
          {
            name:'风险事件总数',
            type:'bar',
            barWidth: 30,
            data: arr1
          },
          {
            name: '百公里风险数',
            // smooth: true,
            type: 'line',
            yAxisIndex: 1,
            data: arr2
          }
        ]
      }
      return opt
    },
    /**
     * 获取折线图1的数据
     */
    getLine1() {
      const opt = {
        title: '设备完好率趋势',
        align: 'center',
        // legend: {
        //   data: ['总行程', '车均日均里程'],
        //   bottom: 0
        // },
        color: ['#00A8D4', '#ff0000'],
        tooltip: {
          formatter: params => {
            const v = params[0];
            const str = `<div>${v.axisValue}<br />${v.marker}${v.value}%`;
            return str;
          },
          trigger: 'axis'
        },
        timeArr: ['2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07'],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}%'
            }
            // name: '总行程'
          }
        ],
        series: [
          {
            // name: '车均日均里程',
            // smooth: true,
            type: 'line',
            data: ['100', '100', '100', '100', '100', '89']
          }
        ]
      }
      return opt
    },
    /**
     * 获取折线柱状图1的数据
     * @param {Array} list 数据
     */
    getBar1(obj) {
      const timeArr = []
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const {text} = this
      for (const v of obj.curEvent.values()) {
        const lastObj = obj.lastEvent.find(e => e.importRiskEvent === v.importRiskEvent)
        if (!lastObj) continue
        timeArr.push(v.importRiskEvent)
        const lastEventCountPer100Km = getDecimalN(lastObj.importRiskEventCountPer100Km)
        const curEventCountPer100Km = getDecimalN(v.importRiskEventCountPer100Km)
        arr1.push(lastEventCountPer100Km)
        arr2.push(curEventCountPer100Km)
        arr3.push(v.importRiskEventCount)
        const text2 = +v.importRiskEventPer100KmRate >= 0 ? '上升' : '下降'
        const curEventPer100KmRate = Math.abs(getDecimalN(v.importRiskEventPer100KmRate * 100))
        const str = `${v.importRiskEvent}：${text.cur}${v.importRiskEvent}的百公里风险数${curEventCountPer100Km}件，环比${text2}${curEventPer100KmRate}%。`;
        this.info4.push(str)
      }
      const opt = {
        title: '百公里风险数数据对比',
        align: 'center',
        legend: {
          data: [text.prev, text.cur, '总数'],
          bottom: 0
        },
        color: ['#00A8D4', '#ff0000', '#2c9994'],
        timeArr,
        yAxis: [
          {
            type: 'value',
            // name: '车均日均里程',
            max: val => getMax(val.max),
            min: 0,
            interval: getInterval([...arr1, ...arr2]),
            axisLabel: {
              formatter: '{value} 件'
            }
          },
          {
            type: 'value',
            // name: '车均日均里程',
            max: val => getMax(val.max, 1.4),
            min: 0,
            interval: getInterval(arr3, 1.4),
            axisLabel: {
              formatter: '{value} 件'
            }
          }
        ],
        series: [
          {
            name: text.prev,
            type: 'bar',
            data: arr1,
            barWidth: 30
          },
          {
            name: text.cur,
            type: 'bar',
            data: arr2,
            barWidth: 30
          },
         {
            name: '总数',
            smooth: true,
            type: 'line',
            yAxisIndex: 1,
            data: arr3
          }
        ]
      }
      return opt
    },
    /**
     * 获取折线柱状图2的数据
     * @param {Array} list 数据
     */
    getBar2(list) {
      const timeArr = []
      const data = []
      let maxVal = 0
      let time = ''
      for (const [k, v] of Object.entries(list)) {
        timeArr.push(k)
        data.push(v)
         if (+v > maxVal) {
           maxVal = +v
          time = k
        }
      }
      const msg = `${time}是驾驶员疲劳驾驶的集中时段，也是事故风险的高发时段，3-6 点属于深夜驾驶， 较容易产生疲劳；驾驶员在上述时段行车时应当更加谨慎，多停车休息，同时企业及车队应重 点加强风险高发时段的风险预防和管理。`
      this.$set(this.info5, 'msg', maxVal ? msg : '')
      const opt = {
        title: '疲劳预警各时段日均风险数',
        align: 'center',
        // legend: {
        //   data: ['本月', '上月'],
        //   bottom: 0
        // },
        color: ['#00A8D4', '#ff0000'],
        timeArr,
        yAxis: [
          {
            type: 'value',
            // name: '总行程',
            // max: val => Math.floor(val.max * 1.2),
            min: 0,
            axisLabel: {
                formatter: '{value} 件'
            }
          }
        ],
        series: [
          {
            // name: '本月',
            type: 'bar',
            data,
            barWidth: 30
          }
        ]
      }
      return opt
    },
    /**
     * 获取图表1的数据
     * @param {Object} obj 数据
     */
    getPie1(obj) {
      const {text} = this
      const data = obj.list.reduce((initObj, v, i) => {
        if (!initObj.data) {
          initObj.data = []
          initObj.legend = []
        }
        if (i === obj.list.length - 1) {
          const details = `车辆运营情况：${text.cur}行驶里程${v.rateDisplay}的车辆有${v.plateNoList.length}辆车，占比${getDecimalN(v.rate * 100)}%；`
          this.$set(this.info2, 'details', details)
        }
        const obj2 = {
          value: v.plateNoList.length,
          name: v.rateDisplay
        }
        initObj.data.push(obj2)
        initObj.legend.push(v.rateDisplay)
        return initObj
      }, {})
      const opt = {
        title: '行驶里程',
        legend: {
          data: data.legend,
          selectedMode: true,
          show: false
        },
        serie: {
          name: '行驶里程',
          radius: ['30%', '60%'],
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: data.data
        }
      }
      return opt
    },
    /**
     * 获取图表2的数据
     * @param {Object} obj 数据
     */
    getPie2(obj) {
      const {text} = this
      const data = obj.list.reduce((initObj, v, i) => {
        if (!initObj.data) {
          initObj.data = []
          initObj.legend = []
        }
        if (i === obj.list.length - 1) {
          const str = `${text.cur}行驶时长${v.rateDisplay}的车辆有${v.plateNoList.length}辆车，占比${getDecimalN(v.rate * 100)}%；`
          this.info2.details += str
        }
        const obj2 = {
          value: v.plateNoList.length,
          name: v.rateDisplay
        }
        initObj.data.push(obj2)
        initObj.legend.push(v.rateDisplay)
        return initObj
      }, {})
      const opt = {
        title: '行驶时长',
        legend: {
          data: data.legend,
          selectedMode: true,
          show: false
        },
        serie: {
          name: '行驶时长',
          radius: ['30%', '60%'],
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: data.data
        }
      }
      return opt
    },
    /**
     * 获取图表3的数据
     */
    getPie3() {
      const opt = {
        title: '设备异常类型占比',
        legend: {
          data: ['120-240', '240-360', '360-480', '480小时以上'],
          selectedMode: true,
          show: false
        },
        serie: {
          name: '设备异常',
          radius: ['30%', '60%'],
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            {
              value: 33,
              name: '摄像头角度倾斜'
            },
            {
              value: 67,
              name: '无法下达语音指令'
            }
          ]
        }
      }
      return opt;
    },
    /**
     * 导出pdf
     */
    exportFile() {
      if (!this.lock){
        return       
      } ;
      // printJS({
      //   printable: 'upload',
      //   type: 'html',
      //   // 继承原来的所有样式
      //   targetStyles: ['*']
      // })
      this.lock = false;
      const {text} = this;
      const oUpload = document.getElementById('upload');
      window.pageYoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;       
      html2canvas(oUpload).then(canvas => {
        const contentWidth = canvas.width * 3;
        const contentHeight = canvas.height * 3;
        // 一页pdf显示html页面生成的canvas高度;
        const pageHeight = contentWidth / 595.28 * 841.89;
        // 未生成pdf的html页面高度
        let leftHeight = contentHeight;
        // pdf页面偏移
        let position = 0;
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        const imgWidth = 555.28;
        const imgHeight = 555.28 / contentWidth * contentHeight;
        const pageData = canvas.toDataURL('image/jpeg', 1.0);
        let pdf = new jspdf('', 'pt', 'a4')
        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 20, 20, imgWidth - 40, imgHeight - 60 );
        } else {
          while(leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 20, position, imgWidth - 40 , imgHeight - 60 ) 
            leftHeight -= pageHeight;
            position -= 841.89;
            // 避免添加空白页
            if(leftHeight > 841.89) {
              pdf.addPage();
            }
          }
        }

        pdf.save(`智能风控运营${text.unit}报.pdf`);
        pdf = null
        this.lock = true;
      })
    }
  }
}
</script>
<style scoped>
.wrap {
  flex: 1;
  background: #fff;
  padding: 10px 20px 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.top, .content {
  max-width: 100%;
  padding: 20px 0;
}
.hr, .hr200 {
  height: 1px;
  background: #999;
}
.hr200 {
  width: 200px;
  margin: 6px 0;
}
h1 {
  padding: 20px 0 0 0px;
  font-size: 34px;
}
.date {
  text-align: center;
  color: #999;
  padding: 20px 0 0;
}
.red {
  text-align: right;
  color: #ff0000;
}

.info {
  margin: 20px 0 0;
}

.info .title-color {
  font-size: 16px;
  text-align: center;
  line-height: 28px;
}
.info .model {
  margin: 20px auto 0;
  max-width: 800px;
}
.info .model .name {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.info .model .li {
  overflow: hidden;
  line-height: 24px;
}
.info .model .label, .info .model .val {
  float: left;
}
.info .model .label {
  min-width: 160px;
}
.ul {
  padding: 20px 0 0;
}
.ul1, .ul2 {
 padding: 50px 0 0;
}
.ul3, .ul4, .ul5 {
  padding: 64px 0 0;
}
.cur-title, .ul .title {
  font-size: 16px;
  font-weight: bold;
  line-height: 28px;
  padding: 10px;
}
.ul .title {
  font-size: 16px;
  font-weight:normal;
}
.text4 {
  min-height: 144px;
}
p {
  text-indent: 30px;
  line-height: 24px;
}
.msg {
  font-size: 12px;
  line-height: 18px;
  color: #999;
}
.msg div {
  font-size: 12px;
  line-height: 18px;
}
.wrap >>> #line1, .wrap >>> #line2, .wrap >>> #line3, .wrap >>> #line4, .wrap >>> #line5 {
  height: 470px;
  margin: 20px 0 0;
}
.pie-box {
  overflow: hidden;
}
.pie-box >>> .pie {
  width: 50%;
  float: left;
}
.wrap >>> .pie {
  height: 400px;
  margin: 20px 0 0;
}
.btn-bar {
  overflow: hidden;
  padding: 10px 0;
  width: 100%;
}
.btn-bar >>> .el-button {
  float: right;
}
.companyTitle{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

}
#upload {
  width: 1100px;
  max-width: 100%;
}
#upload >>> .table-box {
  min-height: 420px;
  height: 420px;
}
.other {
  padding: 16px 0 0;
}
.other .other-box {
  height: 410px;
  overflow: hidden;
  box-sizing: border-box;
}
.other h5, .other h6 {
  color: #333;
  font-weight: bold;
  padding: 0 0 10px;
}
.other h6 {
  padding: 6px 10px;
}
.other h6 span {
  float: left;
  color: #666;
  display: block;
  line-height: 20px;
  margin-right: 6px;
}
.other .other-img {
  overflow: hidden;
  margin-right: -10px;
}
.other .other-img-li {
  float: left;
  width: 360px;
  margin-right: 10px;
  box-sizing: border-box;
}

.other .other-img-li .li {
  border: 1px solid #EBEEF5;
  margin: 0 0 40px;
}
.other .other-img-li .img {
  height: 200px;
  padding: 10px 10px 0;
  overflow: hidden;
}
.other .other-img-li img {
  width: 340px;
  max-height: 200px;
}
.other .other-img-li canvas {
  width: 340px;
  height: 200px;
}
.other .other-img-li .text {
  padding: 10px 20px;
  height: 120px;
  overflow: hidden;
}
.other .text p {
  text-indent: 0;
}
</style>