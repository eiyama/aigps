<template>
	<div v-if="isShow" :style="css" class="popup-wrap" ref="wrap" @mousedown="move">
		<div class="title">
			<h5>{{ title }}</h5>
			<span @click="handClose" class="remove el-icon-close"></span>
		</div>
		<slot></slot>
		<div v-for="v of doms" :key="v" :class="v" @mousedown.stop.prevent="down($event, v)"></div>
	</div>
</template>

<style lang="scss" scoped>
.popup-wrap {
	width: 900px;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
	height: 540px;
	background: #373d40;
	box-sizing: border-box;
	padding: 0 5px 5px;
	display: flex;
	flex-direction: column;
	cursor: move;
	.title {
		overflow: hidden;
		padding: 0 20px;
		height: 30px;
		color: #fff;
		line-height: 30px;
		h5 {
			float: left;
		}
		.remove {
			float: right;
			display: block;
			line-height: 30px;
			font-size: 20px;
			cursor: pointer;
		}
	}
	.top-right {
		position: absolute;
		top: 0;
		right: 0;
		width: 15px;
		height: 15px;
		cursor: ne-resize;
		z-index: 5px;
	}
	.bottom-right {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 15px;
		height: 15px;
		cursor: se-resize;
		z-index: 5px;
	}
	.bottom-left {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 15px;
		height: 15px;
		cursor: sw-resize;
		z-index: 5px;
	}
	.top-left {
		position: absolute;
		top: 0;
		left: 0;
		width: 15px;
		height: 15px;
		cursor: nw-resize;
		z-index: 5px;
	}
	.left {
		position: absolute;
		top: 0;
		left: 0;
		width: 15px;
		height: 100%;
		cursor: w-resize;
	}
	.right {
		position: absolute;
		top: 0;
		right: 0;
		width: 15px;
		height: 100%;
		cursor: e-resize;
	}
	.top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 15px;
		cursor: n-resize;
	}
	.bottom {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 15px;
		cursor: s-resize;
	}
}
</style>

<script>
export default {
  name: 'PopupView',
  data() {
    return {
      positionX: 0,
			positionY: 0,
			doms: ['left', 'right', 'top', 'bottom', 'top-right', 'top-left', 'bottom-right', 'bottom-left'],
			type: ''
    }
  },
  props: {
    title: {
      type: String,
      default: ''
		},
		minWidth: {
			type: Number,
			default: 900
		},
		minHeight: {
			type: Number,
			default: 540
		},
		css: {
			type: Object,
			default: () => {}
		},
		isShow: {
			type: Boolean,
			default: false
		},
		isMove: {
			type: Boolean,
			default: true
		},
		isZoom: {
			type: Boolean,
			default: true
    },
    isActive: {
      type: Boolean,
	  default: false
    }
	},
	watch: {
		isShow(val) {
			if (val) {
				this.setPotionCenter()
			}
		}
	},
	mounted() {
		this.setPotionCenter()
	},
  methods: {
  	/**
  	 * 设置元素居中
  	 */
  	async setPotionCenter() {
  		const { $refs, isShow } = this
  		if (!isShow) return
  		await this.$nextTick()
  		const oDiv = $refs.wrap
  		const winW = document.documentElement.clientWidth
  		const winH = document.documentElement.clientHeight
  		const boxW = oDiv.clientWidth
  		const boxH = oDiv.clientHeight

  		const top = (winH - boxH) / 2
  		const left = (winW - boxW) / 2
  		this.positionX = left
        this.positionY = top

      // 移动当前元素
      oDiv.style.left = `${left}px`
      oDiv.style.top = `${top}px`
  	},
  	/**
  	 * 移动元素
  	 * @param  {Enevt} e event对象
  	 */
    move(e) {
			const { $refs, type, isMove } = this
			if (type || !isMove) return
      let oDiv = $refs.wrap // 获取目标元素
      // 算出鼠标相对元素的位置
      let disX = e.clientX - oDiv.offsetLeft
			let disY = e.clientY - oDiv.offsetTop
			const { clientWidth, clientHeight } = oDiv
			const oBody = document.documentElement
			const windowW = oBody.clientWidth
			const windowH = oBody.clientHeight
      // 鼠标按下并移动的事件
      document.onmousemove = e => {
				// if (this.type) return
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
				let top = e.clientY - disY
				
				if (left <= 0) {
					left = 0
				} else if (left >= windowW - clientWidth) {
					left = windowW - clientWidth
				}

				if (top <= 0) {
					top = 0
				} else if (top >= windowH - clientHeight) {
					top = windowH - clientHeight
				}
				// 绑定元素位置到positionX和positionY上面
        this.positionX = left
        this.positionY = top

        // 移动当前元素
        oDiv.style.left = `${left}px`
        oDiv.style.top = `${top}px`
      }
      document.onmouseup = (e) => {
				document.onmousemove = null
				document.onmouseup = null
      }
    },
    handClose() {
      if (!this.isActive) {
        this.changeState(false)
      }
    	this.$emit('handClose')
		},
		/**
		 * 改变显示或隐藏
		 * @param {Boolean} state true显示反之隐藏
		 */
		changeState(state) {
			this.$emit('update:isShow', state)
		},
		/**
		 * 获取显示隐藏的状态
		 * @return {Boolean} true为显示，反之隐藏
		 */
		getState() {
			return this.isShow
		},
		/**
		 * down拖拽的元素
		 * @param {Event} e 元素得event
		 * @param {String} type 当前元素的class
		 */
		down(ev, type) {
			const { isZoom } = this
			if (!isZoom) return
			this.type = type
			let curX = ev.clientX
			let curY = ev.clientY
			// 鼠标按下并移动的事件
      document.onmousemove = e => {
				// 移动当前元素
				const w = e.clientX- curX
				const h = e.clientY - curY
				this.changeBox({ w, h })
				curX = e.clientX
				curY = e.clientY
      }
      document.onmouseup = (e) => {
				document.onmousemove = null
				document.onmouseup = null
				this.type = ''
      }
		},
		/**
		 * 根据类型判断拉伸的方向
		 * @param {Object} opt 拉伸的大小参数
		 */
		changeBox(opt) {
			const { $refs, type } = this
			// 获取目标元素
			const oDiv = $refs.wrap
			const data = {
				...opt,
				oDiv
			}
			switch(type) {
				case 'right':
					this.changeRight(data)
					break
				case 'left':
					this.changeLeft(data)
					break
				case 'top':
					this.changeTop(data)
					break
				case 'bottom':
					this.changeBottom(data)
					break
				case 'top-left':
					this.changeTop(data)
					this.changeLeft(data)
					break
				case 'top-right':
					this.changeTop(data)
					this.changeRight(data)
					break
				case 'bottom-left':
					this.changeBottom(data)
					this.changeLeft(data)
					break
				case 'bottom-right':
					this.changeBottom(data)
					this.changeRight(data)
					break
				default:	
			}
		},
		changeLeft(opt) {
			const { minWidth } = this
			const { w, oDiv } = opt
			const { clientWidth, offsetLeft } = oDiv
			let width
			// 防止拉伸超出左边屏幕
			if (clientWidth - w >= offsetLeft + clientWidth) {
				width = offsetLeft + clientWidth
				oDiv.style.left = '0px'
				this.positionX = 0
			} else if (clientWidth <= minWidth && w >= 0) {
				// 防止小于设定的最小高度
				width = minWidth
			} else {
				const l = w + offsetLeft
				oDiv.style.left = `${l}px`
				this.positionX = l
				width = clientWidth - w
			}
			oDiv.style.width = `${width}px`
		},
		changeRight(opt) {
			const { minWidth } = this
			const { w, oDiv } = opt
			const { clientWidth, offsetLeft } = oDiv
			const oBody = document.documentElement
			const windowW = oBody.clientWidth
			let width
			if (clientWidth >= windowW - offsetLeft && w >= 0) {
				width = windowW - offsetLeft
			} else if (clientWidth <= minWidth && w <= 0) {
				// 判断最小宽度不能小于最小宽度
				width = minWidth
			} else {
				width = clientWidth + w
			}
			oDiv.style.width = `${width}px`
		},
		changeTop(opt) {
			const { minHeight } = this
			const { h, oDiv } = opt
			const { clientHeight, offsetTop } = oDiv
			let height
			// 防止弹窗拉伸超出屏幕上方
			if (clientHeight - h >= offsetTop + clientHeight) {
				height = offsetTop + clientHeight
				oDiv.style.top = '0px'
				this.positionY = 0
			} else if (clientHeight <= minHeight && h >= 0) {
				// 防止弹窗拉伸小于设定的最小高度
				height = minHeight
			}	else {
				const t = h + offsetTop
				oDiv.style.top = `${t}px`
				this.positionY = t
				height = clientHeight - h
			}
			oDiv.style.height = `${height}px`
		},
		changeBottom(opt) {
			const { minHeight } = this
			const { h, oDiv } = opt
			const { clientHeight, offsetTop } = oDiv
			const oBody = document.documentElement
			const windowH = oBody.clientHeight
			let height
			// 防止向下拉伸超出屏幕
			if (offsetTop + clientHeight >= windowH && h >= 0) {
				height = windowH - offsetTop
			} else if (clientHeight <= minHeight && h <= 0) {
				// 防止屏幕拉伸小于设定的最小高度
				height = minHeight
			} else {
				height = clientHeight + h
			}
			oDiv.style.height = `${height}px`
		}
  }
}
</script>
