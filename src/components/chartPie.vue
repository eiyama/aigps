<template>
  <div id="pie-box" class="table-model pie">
    <div class="chart" :id="vId"></div>
    <div v-show="!isData" :style="{ width: h + 'px', height: h + 'px' }" class="empty-pie"></div>
  </div>
</template>

<style scoped>
.table-model {
  /* height: 100%; */
  flex: 1;
  /* width: 47%; */
  position: relative;
}
.chart {
  height: 100%;
}
.empty-pie {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: #00a8d4;
}
</style>

<script>
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import 'echarts/lib/component/legend/ScrollableLegendModel.js'
import 'echarts/lib/component/legend/ScrollableLegendView.js'
import 'echarts/lib/component/legend/scrollableLegendAction.js'

export default {
  data() {
    const echarts = require('echarts/lib/echarts')
    return {
      isData: true,
      echarts,
      oPie: null,
      h: 0
    }
  },
  props: {
    vId: {
      type: String,
      default: 'pie'
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
    this.setPieH()
  },
  beforeDestroy() {
    this.dispose()
    this.echarts = null
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    setPieH() {
      const oPieBox = document.getElementById('pie-box')
      if (oPieBox) {
        const h = oPieBox.clientHeight
        this.h = h * 0.6
      }
    },
    getEcharts() {
      return this.echarts;
    },
    isChart() {
      return !!this.oPie
    },
    resize() {
      if (this.oPie) {
        this.oPie.resize()
      }
      this.setPieH()
    },
    dispose() {
      if (this.oPie) {
        this.oPie.dispose()
        this.oPie = null
      }
    },
    setState(state) {
      this.isData = state
    },
    chartsRender(opt, isData) {
      // this.isData = true
      let oChart = document.getElementById(this.vId)
      this.dispose()
      if (!oChart || oChart.clientWidth === 0) return
      const tooltip = opt.tooltip || {}
      const legend = opt.legend || {}
      const color = opt.color || ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
      let series = opt.series
      if (!series && opt.serie) {
        series = [
          {
            label: {
              normal: {
                formatter: '{b}：{c}',
              }
            },
            type: 'pie',
            radius : '55%',
            center: ['50%', '50%'],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            ...opt.serie
          }
        ]
      }
      this.isData = typeof isData !== 'undefined' ? isData : opt.legend.selectedMode
      this.oPie = this.echarts.init(oChart)
      const div = document.createElement('div')
      oChart.insertBefore(div, oChart.lastChild)
      const data = {
        title : {
          text: opt.title || '',
          x:'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          ...tooltip
        },
        color,
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          ...legend
          // selectedMode: false,
          // data: [],
          // selected: {}
        },
        series
      }
      if (opt.graphic) {
        data.graphic = opt.graphic
      }
      this.oPie.setOption(data)
    }
  }
}
</script>
