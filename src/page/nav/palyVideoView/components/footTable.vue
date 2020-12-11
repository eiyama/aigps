<template>
  <div class="foot">
    <el-tabs v-model="tabName" tab-position="left" style="height: 100%;">
      <el-tab-pane name="time" label="时间">
        <div class="chart-box" @mousemove="moveTab" @mouseenter="enterTab" @mouseleave="leaveTab">
          <ul ref="chart" class="time-ul">
            <li v-for="(v, i) of chns" :key="i" class='li'>
              <em class="title">CH{{ i + 1 }}</em>
              <template v-if="v && v.child">
                <span @dblclick="handleDblPlay(item)" v-for="(item, j) of v.child" :key="j" :style="{ width: item.w + 'px', left: item.l + 'px',background: item.bg }" class="green"></span>
              </template>
            </li>
            <li>
              <div v-for="(v, i) of 24" :key="i" class="time">
                <span></span>
              </div>
            </li>
          </ul>
          <!-- 刻度线 -->
          <div v-show="isShowLine" :style="{ left: lineLeft + 'px' }" class="line">
            <div ref="curTime" :style="{ top: timeTop + 'px', left: timeLeft + 'px' }" class="time">
              <span :style="{ marginRight: chn ? '5px' : '0' }">{{chn}}</span>
              <span>{{time}}</span>
            </div>
          </div>
        </div>
        <div class="time-list">
          <div v-for="(v, i) of 24" :key="i" class="time">
            <!-- <div class="icon"></div> -->
            <span v-if="i === 0">{{ `0${i}:00` }}</span>
            <span v-else-if="(i + 1) % 2 == 0">{{ i + 1 > 9 ? `${i + 1}:00` : `0${i + 1}:00` }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="file" label="文件">
        <my-table :isPageing="false" id="file" :tableData="fileData" :tableTitle="tableTitle1" @handleCell="handleCell"/>
      </el-tab-pane>
      <el-tab-pane name="down" label="下载">
        <my-table :isPageing="false" id="down" :tableData="downData" :tableTitle="tableTitle2" @handleCell="handleCell"/>
      </el-tab-pane>
      <el-tab-pane name="up" label="上传">
        <my-table :isPageing="false" id="up" :tableData="upData" :tableTitle="tableTitle3"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDecimalN, zeroize, getHMS, getFormatTime } from '@/utils/util'
import { getUpList, upFtp } from '@/api/video'
import MyTable from '@/components/myTable'
import { Tabs, TabPane, Message } from 'element-ui'

export default {
  components: {
    ElTabs: Tabs,
    ElTabPane: TabPane,
    MyTable
  },
  data() {
    const data = this.getData()
    return {
      totalSec: 3600 * 24, // 一天的总秒数
      ...data
    }
  },
  computed: {
    ...mapGetters([
      'jsession'
    ])
  },
  async created() {
    this.tableTitle1 = this.$t('playVideo.tableTitle')
    this.tableTitle2 = this.$t('playVideo.downTableTitle')
    this.tableTitle3 = this.$t('playVideo.upTableTitle')

    window.addEventListener('resize', this.setTabParam)
    eventBus.$on('setInfo', this.setInfo)
    eventBus.$on('handleNode', this.handleNode)

    await this.$nextTick()
    this.setTabParam()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTabParam)
    eventBus.$off('setInfo', this.setInfo)
    eventBus.$off('handleNode', this.handleNode)
  },
  methods: {
    getData() {
      return {
        fileData: [],
        upData: [],
        chns: new Array(4),
        tableTitle1: [],
        tableTitle2: [],
        tableTitle3: [],
        tabName: 'time',
        downData: [], // 下载表格的数据
        lineLeft: 0, // 刻度线的left值
        timeTop: 0, // 刻度表的通道与时间的top值
        timeLeft: 0, // 刻度表的通道与时间的left值
        tabWidth: 0, // 刻度表的宽度
        tabHeight: 0, // 刻度表的高度
        isShowLine: false, // 刻度线是否显示
        chn: '', // 刻度线的通道
        time: '', // 刻度线的时间
        chartY: 0, // 刻度表距离顶部的top值
        chartX: 0 // 刻度表距离左边的left值
      }
    },
    /**
     * 设置参数
     */
    setTabParam() {
      this.tabWidth = this.$refs.chart.clientWidth;
      this.tabHeight = this.$refs.chart.clientHeight;
      // 用body的宽带和高度减去自己的高度和宽度以及多余的margin
      this.chartY = document.body.clientHeight - this.tabHeight - 18;
      this.chartX = document.body.clientWidth - this.tabWidth - 4;
    },
    /**
     * 光标在刻度表中移动
     * @param {Event} e event对象
     */
    moveTab(e) {
      const count = e.pageX - this.chartX;
      if (count < 0) {
        this.lineLeft = 0
      } else if (count > this.tabWidth) {
        this.lineLeft = this.tabWidth
      } else {
        this.lineLeft = count;
      }
      const leng = this.chns.length;
      // 获取通道时间的宽度
      const timeW = this.$refs.curTime.clientWidth;
      // 通道时间的宽度加上线的left值大于图表的宽度
      if (timeW + this.lineLeft >= this.tabWidth) {
        this.timeLeft = -timeW - 2;
      } else {
        this.timeLeft = 2
      }
      // 通道与时间显示在光标的上方20px
      this.timeTop = e.pageY - this.chartY - 20;
      if (this.timeTop < 0) {
        this.timeTop = 30;
      }
      // liH是li的高度，e.pageY - this.chartY是光标距离ul顶部的位置
      const liH = (this.tabHeight - 22) / leng;
      if ((e.pageY - this.chartY) / liH < leng) {
        this.chn = `CH${Math.floor((e.pageY - this.chartY) / liH) + 1}`;
      } else if ((e.pageY - this.chartY) / liH == leng) {
        this.chn = `CH${leng}`;
      } else {
        this.chn = '';
      }
      const sec = Math.ceil(this.lineLeft / this.tabWidth * this.totalSec);
      this.time = getHMS(sec);
    },
    /**
     * 鼠标移入刻度表
     */
    enterTab() {
      this.isShowLine = true;
      // console.log('移入');
    },
    /**
     * 鼠标移出刻度表
     */
    leaveTab() {
      this.isShowLine = false;
      // console.log('移出');
    },
    /**
     * 处理数据
     * @param {Object} res 请求的数据
     * @param {Number} data 参数
     */
    setInfo(res, data) {
      this.fileData = []
      this.downData = []
      this.upData = []
      for (const v of this.chns.values()) {
        v = null
      }
      if (!res || !Array.isArray(res.files) || !res.files.length) {
        Message.error('没有查询到数据！')
        return
      }
      const list = res.files
      const i18n = this.$t('playVideo.otherInfo')
      for (const v of list.values()) {
        const date = `${v.year + 2e3}-${zeroize(v.mon)}-${zeroize(v.day)}`
        const ioc = +v.loc === 2 ? i18n.stoSer : +v.loc === 3 ? i18n.upSer : i18n.devIdno
        const obj = {
          ...v,
          time: `${date} ${getHMS(v.beg)} - ${getHMS(v.end)}`,
          duration: getHMS(v.end - v.beg),
          videoType: v.type ? i18n.alarm : i18n.rule,
          url: v.PlaybackUrl,
          newChn: `CH${v.chn + 1}`,
          ioc,
          len: getDecimalN(v.len / 1024 / 1024), // 字节转换为M并保留两位小数
          act: true,
          up: v.loc === 1
        }
        this.fileData.push(obj)
        if (v.loc !== 1) {
          obj.down = true
          this.downData.push(obj)
        }
        // 计算通道哪个范围有视频
        // 视频的起始值,保留两位小数（开始时间 / 每天的总秒数 * 刻度表的总宽度）
        const l = getDecimalN(v.beg / this.totalSec * this.tabWidth)
        // 视频的结束值（结束时间 / 每天的总秒数的比例 * 刻度表的总宽度）
        const r = getDecimalN(v.end / this.totalSec * this.tabWidth)
        // 范围宽度
        const w = r - l
        const bg = +v.type === 1 ? 'red' : 'green'
        const index = v.chn > this.chns.length - 1 ? this.chns.length - 1 : v.chn
        if (!this.chns[index]) {
          this.chns[index] = {}
          this.chns[index].child = []
        }
        this.chns[index].child.push({ l, r, w: w < 1 ? 1: w, bg, url: v.PlaybackUrl, devIdno: v.devIdno, chn: v.chn + 1 })
      }
      this.requestUpList(
        {
          jsession: this.jsession,
          devIdno: data.veh,
          beg: `${data.dates} 00:00:00`,
          end: `${data.dates} 23:59:59`
        }
      )
    },
    /**
     * 发送请求将设备视频上传到服务器
     * @param {Object} data 请求参数
     */
    async upTask(data) {
      const res = await upFtp(data)
      if (res && +res.result === 0) {
        Message({
          type: 'success',
          message: '上传任务添加成功！'
        })
        const dates = `${data.year}-${data.mon}-${data.day}`
        const obj = {
          jsession: this.jsession,
          devIdno: data.devIdno,
          beg: `${dates} 00:00:00`,
          end: `${dates} 23:59:59`
        }
        setTimeout(() => {
          this.requestUpList(obj)
        }, 300)
      }
    },
    /**
     * 获取上传任务列表
     * @param {Object} data 请求参数
     */
    async requestUpList(data) {
      const res = await getUpList(data)
      if (res && res.infos instanceof Array && res.infos.length) {
        for (const v of res.infos.values()) {
          v.fileBeg = getFormatTime('Y-M-D h:m:s', v.fileBegTime)
          v.fileEnd = getFormatTime('Y-M-D h:m:s', v.fileEndTime)
          v.taskS = getFormatTime('Y-M-D h:m:s', v.taskSTime)
          v.taskE = getFormatTime('Y-M-D h:m:s', v.taskETime)
          v.newChn = `CH${v.chnMask + 1}`
        }
        this.upData = res.infos
      }
    },
    /**
     * 点击树节点
     * @param {Number} count 通道数量
     */
    handleNode(count) {
      this.chns = new Array(count)
    },
    /**
     * 双击通道播放
     * @param {Object} data 当前点击的数据
     */
    handleDblPlay(data) {
      eventBus.$emit('handleDblPlay', data)
    },
    /**
     * 点击操作播放视频
     * @param {Object} data 当前行的数据
     * @param {String} prop 当前点击列的字段
     */
    handleCell(data, prop) {
      if (prop === 'act') {
        this.handleDblPlay(data)
      } else if (prop === 'up' && data.up) {
        const obj = {
          ...data,
          jsession: this.jsession,
          devIdno: data.devIdno,
          year: +data.year + 2e3
        }
        this.upTask(obj)
      } else if (prop === 'down' && data.down) {
        location.href = `${data.DownUrl}${data.devIdno} ${data.time}.mp4`
      }
    }
  }
}
</script>

<style scoped>
.foot {
  height: 240px;
  padding-right: 3px;
}
.chart-box {
  position: relative;
  padding-right: 2px;
}
.time-ul {
  display: flex;
  flex-direction: column;
  height: 220px;
  padding: 2px 0 0;
  box-sizing: border-box;
  overflow: hidden;
}
.time-ul .li {
  flex: 1;
  border: 1px solid #000;
  border-bottom: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.time-ul .li .title {
  position: relative;
  z-index: 9;
}
.time-ul .li .green {
  display: block;
  height: 100%;
  position: absolute;
  top: 0;
}
.time-ul li:last-child {
  height: 20px !important;
  border: 1px solid #000;
  display: flex;
}
.time-ul li .time {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.time-ul li .time span {
  float: right;
  display: block;
  background: #000;
}
.time-ul li .time:nth-child(even) span {
  width: 2px;
  height: 20px;
}
.time-ul li .time:nth-child(odd) span {
  width: 1px;
  height: 8px;
  position: relative;
  top: 12px;
}
.time-ul li .time:last-child span {
  width: 0;
}
.time-list {
  display: flex;
  padding: 0 1px;
  box-sizing: border-box;
}
.time-list .time {
  position: relative;
  flex: 1;
  text-align: right;
}
.time-list .time span {
  display: inline-block;
  margin-right: -1em;
}
.time-list .time:last-child span {
  margin: 0;
}
.time-list .time:first-child {
  text-align: left;
}
.foot .line {
  position: absolute;
  top: 2px;
  left: 0;
  width: 1px;
  height: 218px;
  background: #000;
  z-index: 999;
}
.foot .line .time {
  position: absolute;
  top: 0;
  left: 0;
}
.foot >>> .el-tabs__content, .foot >>> .el-tabs__content .table-box {
  height: 100%;
}
</style>