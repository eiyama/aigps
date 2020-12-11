<!-- 首页 -->
<template>
  <div class="content-box">
    <div class="auto">
      <div class="top" :style="topStyle">
        <!-- 左侧饼图与数据展示 -->
        <left-data ref="pie" :otherText="otherText" :i18nInfo="i18nInfo" @handleBtn="handleBtn" />
        <!-- 右侧地图 -->
        <right-map ref="map" :otherText="otherText" :i18nInfo="i18nInfo" />
      </div>
      <!-- 底部折线与柱状图 -->
      <line-bar ref="line" :otherText="otherText" :i18nInfo="i18nInfo" :bottomStyle="bottomStyle" @changeInfo="changeInfo" />
      <!-- 历史在线率 -->
      <history-online ref="historyOnline" />
    </div>
  </div>
</template>

<script>
import { home } from '@/api/index'
import LeftData from './components/leftData'
import RightMap from './components/rightMap'
import LineBar from './components/lineBar'
import HistoryOnline from './components/HistoryOnline'
import { getDecimalN } from '@/utils/util'

export default {
  components: {
    LeftData,
    RightMap,
    LineBar,
    HistoryOnline
  },
  data() {
    return {
      info: {},
      i18nInfo: JSON.parse(JSON.stringify(this.$t('home.info'))),
      otherText: this.$t('otherText'),
      topStyle: {},
      bottomStyle: {}
    }
  },
  mounted() {
    this.requestInfo(0)
    this.setHeight()
    window.addEventListener('resize', this.setHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setHeight)
  },
  methods: {
    /**
     * 根据网页宽度设置高度
     */
    setHeight() {
      this.$set(this.topStyle, 'height', `${this.getHeight(510)}px`)
      this.$set(this.bottomStyle, 'height', `${this.getHeight(300)}px`)
    },
    /**
     * 获取高度
     */
    getHeight(num) {
      const wh = document.documentElement.clientWidth
      const h = Math.floor(wh / 1300 * num * 70 / 100)
      if (h > num) {
        return h
      } else {
        return num
      }
    },
    /**
     * 请求数据
     * @param {Number} queryType 类型
     * @param {Boolean} isLine true只是渲染底部折线柱状图，反之全部渲染
     */
    async requestInfo(queryType, isLine) {
      try {
        const res = await home({ queryType });
        const obj = res.result;
        if (obj) {
          this.$refs.line.echartsLineBar(obj);
          if (isLine) return;
          obj.mileageTodayTotal = getDecimalN(obj.mileageTodayTotal);
          const hoursAverage = getDecimalN(obj.hoursTodayTotal / obj.vehicleOnline);
          const mileageAverage = getDecimalN(obj.mileageTodayTotal / obj.vehicleOnline);
          const vehicleUseRate = Math.round(obj.vehicleOnline * 100 / obj.vehicleTotal * 100) / 100;

          obj.hoursAverage = isFinite(hoursAverage) ? hoursAverage : 0;
          obj.mileageAverage = isFinite(mileageAverage) ? mileageAverage : 0;
          obj.vehicleUseRate = isFinite(vehicleUseRate) ? `${vehicleUseRate}%` : '0%';
          
          this.info = obj;
          this.$refs.map.loadMap(obj);
          this.$refs.pie.pie(obj);
        }
      } catch(err) {

      }
    },
    /**
     * 柱状图最近30天与本月切换
     * @param {Number} queryType 类型
     */
    changeInfo(queryType) {
      this.requestInfo(queryType, true);
    },
    /**
     * 点击打开历史车辆在线率
     */
    handleBtn() {
      const { $refs } = this
      $refs.historyOnline.initData()
    }
  }
}
</script>

<style scoped lang="scss">
.content-box {
  min-width: 1300px;
  overflow: scroll;
  .auto {
    width: 80%;
    margin: 0 auto;
    padding: 20px 30px;
    box-sizing: border-box;
    .top {
      overflow: hidden;
      display: flex;
    }
  }
}
</style>