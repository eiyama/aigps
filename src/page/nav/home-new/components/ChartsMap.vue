<script>
import { Message } from 'element-ui'
import { isValIndexOf } from '@/utils/data'
require('echarts/lib/chart/map')
require('echarts/map/js/china.js')

export default {
  render() {},
  data() {
    return {
      info: {},
      oMap: null,
      echarts: require('echarts/lib/echarts')
    }
  },
  props: {
    otherText: {
      type: Object,
      default: () => {}
    },
    i18nInfo: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    if (this.oMap) {
      // 有的话清除画布和实例
      this.oMap.off('click', this.mapClick)
      this.oMap.clear()
      this.oMap.dispose()
      this.oMap = null
    }
    this.echarts = null
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      if (this.oMap) {
        this.oMap.resize()
      }
    },
    /**
     * echarts渲染地图
     * @param {Object} info 数据
     */
    loadMap(info) {
      const addressArr = this.i18nInfo.addressArr
      const list = info.gpsVehiclePositions || []
      if (Array.isArray(list) && list.length > 0) {
        for (const v of addressArr.values()) {
          for (const e of list.values()) {
            if (v.code == e.localCode) {
              v.key.push(e.vehId);
              v.value = v.value || 0;
              v.value++;
            }
          }
        }
      }

      const oMap = document.getElementById('e-map')
      if (this.oMap) {
        // 有的话清除画布和实例
        this.oMap.off('click', this.mapClick);
        this.oMap.clear();
        this.oMap.dispose();
        this.oMap = null;
      }
      this.oMap = this.echarts.init(oMap);
      var div = document.createElement('div');
      oMap.insertBefore(div, oMap.lastChild);
      this.oMap.setOption({
        title: {
          // text: this.$t('home.info.vehicleOnlineDetail'),
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: p => {
            if (!p.data) return;
            let dataCon = p.data,
              txtCon = dataCon.name + ': ' + (dataCon.value || '0');
            return txtCon;
          }
        },
        series: {
          type: 'map',
          mapType: 'china',
          roam: false,
          data: addressArr,
          zoom: 1.2,
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#82afeb', //默认的地图板块颜色
              borderWidth: 1,
              borderColor: '#005082' // 地图轮廓线的颜色
            },
            emphasis: {
              areaColor: '#f8da78' //选中状态的地图板块颜色
            }
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                fontSize: 12,
                color: '#fff'
              }
            }
          }  
        },
        visualMap: {
          type: 'piecewise',
          min: 1,
          max: 999999999,
          splitNumber: 7,
          left: 'left',
          top: 'bottom',
          seriesIndex: 0,
          padding: [0, 0, 10, 10],
          textStyle: {
            color: '#5fc7ed'
          },
          pieces: [
            {
              gt: 0,
              lte: 20,
              label: '1-20',
              color: '#132e7c'
            },
            {
              gt: 20,
              lte: 50,
              label: '21-50',
              color: '#0779e4'
            },
            {
              gt: 50,
              lte: 100,
              label: '51-100',
              color: '#c205c2'
            },
            {
              gt: 100,
              label: this.i18nInfo.moreThan100,
              color: '#ff0000'
            }
          ]
        }
      });
      this.oMap.on('click', this.mapClick);
    },
    mapClick(params) {
      if (params.componentType === 'series') {
        // 证明点击的地图右下角的南海
        if (!params.data) return
        var list = params.data.key
        // 证明没有数据
        if (list.length == 0) return
        this.$router.push({
          name: '/home/carMonitor/allMonitor',
          params: { key: JSON.stringify(list) }
        })
      }
    },
    /**
     * 点击跳转驾驶行为统计页面
     */
    jumpLink(url) {
      // 判断是否有驾驶行为的权限
      const tree = this.$store.getters.menuTree
      if (isValIndexOf(tree, 'url', url)) {
        this.$router.push({
          path: url,
          query: { id: '1', code: 'dataQuery' }
        })
      } else {
        Message.error(this.$t('message.noPower'))
      }
    }
  }
}
</script>
