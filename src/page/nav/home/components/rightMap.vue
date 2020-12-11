<template>
  <div class="right border">
    <div id="e-map"></div>
    <div class="msg-info border-top">
      <a href="javascript:;" @click="jumpLink('/home/dataSearch/driverCount')"
        v-for="(item, index) of i18nInfo.stateList" :key="index" class="state">
        <span :class="item.icon" class="iconfont"></span>
        <span class="name">{{ item.name + (info[item.key] || 0) + otherText.second }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.right {
  flex: 15;
  display: flex;
  flex-direction: column;
}
#e-map {
  flex: 1;
}
.msg-info {
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.msg-info .state {
  margin: 0 10px;
  color: #5c718c;
  display: block;
}
.msg-info .state .iconfont {
  font-size: 30px;
  margin: 0 10px 0 0;
}
.msg-info .state .name {
  font-size: 14px;
  display: block;
  float: right;
  line-height: 30px;
}
</style>

<script>
import { isValIndexOf } from '@/utils/data'
import { Message } from 'element-ui'
require('echarts/lib/chart/map')
require('echarts/map/js/china.js')

export default {
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
      default: {}
    },
    i18nInfo: {
      type: Object,
      default: {}
    }
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
  },
  methods: {
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
          text: this.$t('home.info.vehicleOnlineDetail'),
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
          itemStyle: {
            normal: {
              areaColor: '#eae9e9', //默认的地图板块颜色
              borderWidth: 1,
              borderColor: '#aaa9a9' // 地图轮廓线的颜色
            },
            emphasis: {
              areaColor: '#f8da78' //选中状态的地图板块颜色
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
          pieces: [
            {
              gt: 0,
              lte: 10,
              label: '1-10',
              color: '#f4ef9c'
            },
            {
              gt: 10,
              lte: 20,
              label: '11-20',
              color: '#fff100'
            },
            {
              gt: 20,
              lte: 30,
              label: '21-30',
              color: '#eea658'
            },
            {
              gt: 30,
              lte: 40,
              label: '31-40',
              color: '#eb6877'
            },
            {
              gt: 40,
              lte: 50,
              label: '41-50',
              color: '#39b7ee'
            },
            {
              gt: 50,
              label: this.i18nInfo.moreThan50,
              color: '#f15408'
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