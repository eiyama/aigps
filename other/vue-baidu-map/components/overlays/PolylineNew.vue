<script>
import commonMixin from '../base/mixins/common.js'
import bindEvents from '../base/bindEvent.js'
import {createPoint} from '../base/factory.js'

export default {
  name: 'bm-polyline',
  render () {},
  mixins: [commonMixin('overlay')],
  props: {
    path: {
      type: Array
    },
    strokeColor: {
      type: String
    },
    strokeWeight: {
      type: Number
    },
    strokeOpacity: {
      type: Number,
      default: 1
    },
    strokeStyle: {
      type: String
    },
    massClear: {
      type: Boolean,
      default: true
    },
    clicking: {
      type: Boolean,
      default: true
    },
    editing: {
      type: Boolean,
      default: false
    },
    isIcons: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    path: {
      handler (val, oldVal) {
        this.reload()
      },
      deep: true
    },
    strokeColor (val) {
      this.originInstance.setStrokeColor(val)
    },
    strokeOpacity (val) {
      this.originInstance.setStrokeOpacity(val)
    },
    strokeWeight (val) {
      this.originInstance.setStrokeWeight(val)
    },
    strokeStyle (val) {
      this.originInstance.setStrokeStyle(val)
    },
    editing (val) {
      val ? this.originInstance.enableEditing() : this.originInstance.disableEditing()
    },
    massClear (val) {
      val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
    },
    clicking (val) {
      this.reload()
    }
  },
  methods: {
    load () {
      const {BMap, map, path, strokeColor, strokeWeight, strokeOpacity, strokeStyle, editing, massClear, clicking, isIcons} = this
      const data = {
        strokeColor,
        strokeWeight,
        strokeOpacity,
        strokeStyle,
        enableEditing: editing,
        enableMassClear: massClear,
        enableClicking: clicking
      }
      if (isIcons) {
        data.icons = this.draw_line_direction(strokeWeight, '100%')
      }
      const overlay = new BMap.Polyline(path.map(item => createPoint(BMap, {lng: item.lng, lat: item.lat})), data)
      this.originInstance = overlay
      map.addOverlay(overlay)
      bindEvents.call(this, overlay)
    },
    draw_line_direction(weight, repeat) {
      const {BMap} = this
      const icons = new BMap.IconSequence(
        new BMap.Symbol('M0 -5 L-5 -2 L0 -4 L5 -2 Z', {
          scale: weight / 10,
          strokeWeight: 1,
          rotation: 0,
          fillColor: 'white',
          fillOpacity: 1,
          strokeColor: 'white'
        }),
        '100%',
        repeat,
        false
      )
      return [icons]
    }
  }
}
</script>
