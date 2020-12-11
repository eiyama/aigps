<template>
  <div class="table-model">
    <div :style="{ opacity: isData ? '1' : '0' }" class="chart" :id="vId"></div>
    <p class="no-data" v-show="!isData">{{ $t('otherText.noData') }}</p>
  </div>
</template>

<style scoped>
.table-model {
  height: 100%;
  position: relative;
}
.chart {
  height: 100%;
}
</style>

<script>
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')

require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

export default {
  data() {
    const echarts = require('echarts/lib/echarts')
    return {
      isData: false,
      echarts,
      oLine: null
    }
  },
  props: {
    vId: {
      type: String,
      default: 'chart'
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    this.dispose()
    this.echarts = null
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    getEcharts() {
      return this.echarts;
    },
    isChart() {
      return !!this.oLine
    },
    resize() {
      if (this.oLine) {
        this.oLine.resize()
      }
    },
    dispose() {
      if (this.oLine) {
        this.oLine.dispose()
        this.oLine = null
      }
    },
    setState(state) {
      this.isData = state
    },
    chartsRender(opt) {
      this.isData = true
      let oChart = document.getElementById(this.vId)
      this.dispose()
      if (!oChart || oChart.clientWidth === 0) return
      const xAxis = opt.xAxis || {}
      const grid = opt.grid || {}
      this.oLine = this.echarts.init(oChart)
      const div = document.createElement('div')
      oChart.insertBefore(div, oChart.lastChild)     
      this.oLine.setOption({
        title: {
          text: opt.title || '',
          x: opt.align || 'left',
          textStyle: {
            color: '#333',
            fontSize: 16
          }
        },
        grid: {
          ...grid,
          top: '70px'
        },
        color: opt.color,
        tooltip: opt.tooltip || { trigger: 'axis' },
        xAxis: {
          ...xAxis,
          type: 'category',
          data: opt.timeArr
          // name: '时间'
        },
        legend: opt.legend,
        yAxis: opt.yAxis,
        series: opt.series
      })
    }
  }
}
</script>
