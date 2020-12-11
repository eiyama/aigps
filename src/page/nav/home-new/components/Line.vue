<template>
  <div class="bottom" :style="bottomStyle">
    <chart-line ref="chart" />
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
      const arr = getCopyObj(this.$t('home.options2'));
      const opt = arr.reduce((result, v) => {
        if (!result.yAxis) {
          result.yAxis = [];
          result.series = [];
          result.color = [];
          result.legend = {
            data: [],
            y: '6%',
            textStyle: {
              color: '#79f0f3'
            }
          }
        }
        const yAxis = {
          type: 'value',
          name: v.name,
          max: val => getMax(val.max),
          min: 0,
          axisLabel: {
            formatter: `{value} ${v.unit}`,
            color: '#79f0f3'
          },
          nameTextStyle: {
            color: '#79f0f3'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#262d88'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#262d88'
            }
          }
        }
        result.yAxis.push(yAxis)

        const series = {
          ...v,
          symbol: 'none',
          data: []
        }
        result.series.push(series)
        result.legend.data.push(v.name)
        result.color.push(v.color);
        return result;
      }, {});
      opt.timeArr = []
      for (const v of list.values()) {
        opt.timeArr.push(v.time);
        opt.series[0].data.push(v.mileageTotal);
        opt.series[1].data.push(v.runTimeTotal);
      }
      for (const [i, v] of opt.yAxis.entries()) {
        v.interval = getInterval(opt.series[i].data);
      }
      opt.xAxis = {
        boundaryGap: false,
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
        left: '15%',
        right: '12%',
        top: 20
      }
      return opt;
    },
    /**
     * 双y轴折线柱状混合
     * @param {Object} info 数据
     */
    echartsLineBar(info) {
      const arr = info.gpsVehicleStatistics;
      if (Array.isArray(arr) && arr.length) {
        const opt = this.getOpt(arr);
        this.$refs.chart.chartsRender(opt);
      } else {
        this.$refs.chart.setState(false);
      }
    }
  }
}
</script>