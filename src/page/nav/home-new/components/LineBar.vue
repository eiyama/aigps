<template>
  <div class="bottom" :style="bottomStyle">
    <chart-line ref="chart2" vId="chart2" />
  </div>
</template>

<style scoped>
.bottom {
  height: 100%;
  /*margin-top: 10px;*/
  /*padding: 5px 0 0;*/
  position: relative;
  overflow: hidden;
}
.bottom #echarts-line {
  height: 100%;
}
.bottom .btn-bar {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 999;
}
</style>

<script>
import ChartLine from '@/components/chartLine'
import { getCopyObj, getInterval, getMax } from '@/utils/util'

export default {
  components: {
    ChartLine
  },
  data() {
    return {
      queryType: 0
    }
  },
  props: {
    otherText: {
      type: Object,
      default: {}
    },
    i18nInfo: {
      type: Object,
      default: {}
    },
    bottomStyle: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    changeInfo(index) {
      if (index === this.queryType) return
      this.queryType = index
      this.$emit('changeInfo', index)
    },
    /**
     * 获取图表需要的数据
     * @param {Array} list 数据
     */
    getOpt(list) {
      console.log(list)
      const arr = getCopyObj(this.$t('home.options3'))

      const opt = arr.reduce((result, v) => {
        if (!result.yAxis) {
          result.series = []
          result.color = []
          result.legend = {
            data: [],
            y: '6%',
            textStyle: {
              color: '#79f0f3'
            }
          }
          result.yAxis = {
            type: 'value',
            axisLabel: {
              formatter: `{value} ${v.unit}`,
              color: '#79f0f3',
              show: false
            }
          }
        }

        const series = {
          ...v,
          data: []
        }
        result.series.push(series)
        result.legend.data.push(v.name)
        result.color.push(v.color)
        return result
      }, {})
      opt.timeArr = []
      for (const v of list.values()) {
        opt.timeArr.push(v.name)
        opt.series[0].data.push(v.lastWeek)
        opt.series[1].data.push(v.thisWeek)
        opt.series[2].data.push(v.total)
      }
      opt.xAxis = {
        boundaryGap: true,
        axisLabel: {
          color: '#fff'
        },
        axisTick: {
          lineStyle: {
            color: '#019eff'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#262d88'
          }
        }
      }
      opt.grid = {
        bottom: '15%',
        left: '10%',
        right: '10%',
        top: '0px'
      }
      return opt
    },
    /**
     * 双y轴折线柱状混合
     * @param {Object} info 数据
     */
    echartsLineBar(info) {
      const { curRiskEvent, lastWeekRiskEvent } = info.gpsListRiskEvent
      const isCurArr = curRiskEvent instanceof Array && curRiskEvent.length
      const isLastArr = lastWeekRiskEvent instanceof Array && lastWeekRiskEvent.length
      console.log(isLastArr, isCurArr)
      if (isCurArr && isLastArr) {
        const arr = []
        for (const v of curRiskEvent.values()) {
          const obj = {
            thisWeek: v.importRiskEventCount,
            name: v.importRiskEvent
          }

          const last = lastWeekRiskEvent.find(e => e.importRiskEvent === v.importRiskEvent)
          if (last) {
            obj.lastWeek = last.importRiskEventCount
            obj.total = obj.lastWeek + obj.thisWeek
            arr.push(obj)
          }
        }
      // if (Array.isArray(arr) && arr.length) {
        const opt = this.getOpt(arr)
        this.$refs.chart2.chartsRender(opt)
      } else {
        this.$refs.chart2.setState(false)
      }
    }
  }
}
</script>