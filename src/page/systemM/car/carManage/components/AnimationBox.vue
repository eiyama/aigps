<template>
	<div class="animation">
		<div class="cur-title">
			<span
				v-if="isAnimation"
				style="margin-right: 5px; cursor: pointer;"
				class="el-icon-arrow-right"
				:class="isSwitch ? 'rotate90' : 'rotate0'"
				@click="handleAnimation"
			></span>
			{{ title }}
		</div>
		<div class="content clearFloat" :class="isAnimation ? isSwitch ? 'animationHAuto' : 'animationH0' : ''">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.animation {
	.cur-title {
		padding: 0 0 10px;
		font-size: 15px;
	}
	.rotate0 {
		transform: rotate(0);
		transition: 0.3s all;
	}
	.rotate90 {
		transform: rotate(90deg);
		transition: 0.3s all;
	}
	.animationH0 {
		transition: 0.3s all;
		max-height: 0 !important;
		overflow: hidden;
	}
	.animationHAuto {
		transition: 0.3s all;
		max-height: 10000px !important;
	}
}
</style>

<script>
	export default {
		name: 'AnimationBox',
		data() {
			return {
				isLock: true
			}
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			isSwitch: {
				type: Boolean,
				default: false
			},
			isAnimation: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			handleAnimation() {
				const { isSwitch, isLock } = this
				if (!isLock) return
				this.isLock = false
				const tid = setTimeout(() => {
					clearTimeout(tid)
					this.$emit('update:isSwitch', !isSwitch)
					this.isLock = true
				}, 300)
			}
		}
	}
</script>