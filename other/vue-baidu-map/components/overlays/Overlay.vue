<template>
<div>
  <slot></slot>
</div>
</template>

<script>
import commonMixin from '../base/mixins/common.js'

export default {
  name: 'bm-overlay',
  mixins: [commonMixin('overlay')],
  props: {
    pane: {
      type: String
    },
    pt: {
      type: Object,
      default () {
        return {}
      }
    },
    y: {
      type: Number,
      default: 0
    }
  },
  watch: {
    pane () {
      this.reload()
    },
    pt: {
      deep: true,
      handler () {
        if (this.originInstance) {
          this.originInstance.draw()
        }
      }
    },
    y () {
      if (this.originInstance) {
          this.originInstance.draw()
        }
    }
  },
  methods: {
    load () {
      const that = this
      const {BMap, map, $el, pane} = this
      const $emit = this.$emit.bind(this)
      class CustomOverlay extends BMap.Overlay {
        initialize () {
          $emit('initialize', {
            BMap,
            map,
            el: $el,
            overlay: this
          })
          try {
            map.getPanes()[pane].appendChild($el)
          } catch (e) {}
          return $el
        }
        draw () {
          const { pt } = that
          $emit('draw', {
            BMap,
            map,
            el: $el,
            overlay: this,
            pt: pt
          })
        }
      }
      const overlay = new CustomOverlay()
      this.originInstance = overlay
      map.addOverlay(overlay)
    }
  }
}
</script>
