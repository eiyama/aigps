<template>
  <div class="bottom border" :style="bottomStyle">
    <div class="btn-bar">
      <el-button size="small" @click="changeInfo(0)" :type="queryType === 0 ? 'primary' : ''">{{ otherText.lastDay30 }}</el-button>
      <el-button size="small" @click="changeInfo(1)" :type="queryType === 1 ? 'primary' : ''">{{ otherText.thisMonth }}</el-button>
    </div>
    <chart-line ref="chart" />
  </div>
</template>

<style scoped>
.bottom {
  height: 310px;
  margin-top: 10px;
  padding: 5px 0 0;
  position: relative;
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
      const arr = getCopyObj(this.$t('home.options'));
      const opt = arr.reduce((result, v) => {
        if (!result.yAxis) {
          result.yAxis = [];
          result.series = [];
          result.color = [];
          result.legend = {
            data: []
          }
        }
        const yAxis = {
          type: 'value',
          name: v.name,
          max: val => getMax(val.max),
          min: 0,
          axisLabel: {
            formatter: `{value} ${v.unit}`
          }
        }
        result.yAxis.push(yAxis)

        const series = {
          ...v,
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
        console.log(opt)
      } else {
        this.$refs.chart.setState(false);
      }
    }
  }
}
</script>