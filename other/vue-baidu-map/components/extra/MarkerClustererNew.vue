<template>
<span>
  <slot></slot>
</span>
</template>

<script>
import MarkerClusterer from 'bmaplib.markerclusterer'
import {createSize, createMarker, createPoint} from '../base/factory.js'
import commonMixin from '../base/mixins/common.js'

export default {
  name: 'bml-marker-clusterer',
  mixins: [commonMixin('markerClusterer')],
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
      const markers = points.reduce((arr, v) => {
        const {lng, lat, rotation, id} = v
        const data = {
          icon,
          lng,
          lat,
          rotation
        }
        const marker = createMarker(BMap, data)
        if (id) {
          marker.id = id
        }
        marker.onclick = this.handleMarker(v)
        // marker.addEventListener('click', this.handleMarker)
        arr.push(marker)
        return arr
      }, [])
      this.originInstance = new MarkerClusterer(map, {
        gridSize: gridSize && createSize(BMap, gridSize),
        maxZoom,
        minClusterSize: minClusterSize && createSize(BMap, minClusterSize),
        styles: styles.map(item => {
          item.size = createSize(BMap, item.size)
          return item
        }),
        isAverageCenter: averageCenter,
        markers
      })
      // 首次添加聚合marker点少时会出现聚合失效，这里强制聚合
      this.originInstance._redraw()
    },
    handleMarker (v) {
      return () => {
        this.$emit('click', v)
      }
    },
    /**
     * 根据传参修改marker点的位置
     */
    setMarker (opt) {
      const { BMap, originInstance } = this
      const { id, lng, lat, rotation } = opt
      if (!(originInstance._markers instanceof Array)) {
        return
      }
      const marker = originInstance._markers.find(e => e.id === id)
      if (!marker) {
        return
      }
      marker.setPosition(createPoint(BMap, {lng, lat}))
      if (rotation || rotation === 0) {
        marker.setRotation(rotation)
      }
    },
    destroy () {
      const { originInstance } = this
      if (!(originInstance._markers instanceof Array)) {
        return
      }
      for (const v of originInstance._markers.values()) {
        v.onclick = null
        v = null
      }
      originInstance._markers = []
    }
  },
  beforeCreate () {
    this.preventChildrenRender = true
  },
  beforeDestroy () {
    this.destroy()
  }
}
</script>
