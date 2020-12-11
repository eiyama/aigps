
<script>
// import DrawingManager from '../base/drawingManager.js'
import {createSize, createMarker, createPoint} from '../base/factory.js'
import commonMixin from '../base/mixins/common.js'
import bindEvents from '../base/bindEvent.js'

const eventList = [
  'overlaycomplete'
]

export default {
  name: 'bml-drawing-manager',
  render () {},
  mixins: [commonMixin('overlay')],
  props: {
    gridSize: {
      type: Object
    },
    maxZoom: {
      type: Number
    },
    minClusterSize: {
      type: Number
    },
    styles: {
      type: Array,
      default () {
        return []
      }
    },
    averageCenter: {
      type: Boolean,
      default: false
    },
    points: {
      type: Array,
      default () {
        return []
      }
    },
    icon: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    gridSize: {
      handler (val) {
        const {BMap, originInstance} = this
        originInstance.setGridSize(BMap, val.map)
      },
      deep: true
    },
    maxZoom (val) {
      const {originInstance} = this
      originInstance.setMaxZoom(val)
    },
    minClusterSize: {
      handler (val) {
        const {BMap, originInstance} = this
        originInstance.setMinClusterSize(createSize(BMap, val))
      },
      deep: true
    },
    styles: {
      handler (val) {
        const {BMap, originInstance} = this
        const obj = JSON.parse(JSON.stringify(val)).map(item => {
          item.size = item.size && createSize(BMap, item.size)
          return item
        })
        originInstance.setStyles(obj)
      },
      deep: true
    },
    averageCenter (val) {
      this.reload()
    }
  },
  methods: {
    load () {
      const that = this
      const {BMap, map, gridSize, minClusterSize, maxZoom, styles, averageCenter, icon, points} = this
      // 由于drawingManager.js需要地图的BMap类，这里需要设置成全局，组件卸载的时候再清除
      window.BMap = BMap
      const d = require('../base/drawingManager.js')
      const DrawingManager = d.default.DrawingManager
      const styleOptions = {
        strokeColor:'red',    //边线颜色。
        fillColor:'red',      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      }

      const originInstance = new DrawingManager(
        map,
        {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: true, // 是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new BMap.Size(5, 5), // 偏离值
          },
          circleOptions: styleOptions, // 圆的样式
          polylineOptions: styleOptions, // 线的样式
          polygonOptions: styleOptions, // 多边形的样式
          rectangleOptions: styleOptions, // 矩形的样式
        }
      )
      this.originInstance = originInstance
      bindEvents.call(this, originInstance, eventList)
    },
    close () {
      this.originInstance._close()
    },
    clearAll (overlays) {
      const {map} = this
      for (const v of overlays.values()) {
        map.removeOverlay(v)
      }
    }
  },
  beforeCreate () {
    this.preventChildrenRender = true
  }
}
</script>
