<template>
	<div class="wrap-item">
		<div class="cur-title">
			<span
				v-if="isAnimation"
				class="el-icon-arrow-right icon"
				:class="info.isSwitch ? 'rotate90' : 'rotate0'"
				@click="handleAnmation"
			></span>
			{{ title }}
		</div>
		<div
			:class="isAnimation ? (info.isSwitch ? 'animationHAuto' : 'animationH0') : ''"
			class="content clearFloat"
			:style="{ overflow: isAnimation ? 'hidden' : '' }"
		>
			<slot name="content"></slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrap-item {
	.cur-title {
		padding: 0 38px 10px;
		font-size: 15px;
		.icon {
			margin-right: 5px;
			cursor: pointer;
		}
	}
	.animationH0 {
		transition: .3s ease-in;
		max-height: 0 !important;
	}
	.animationHAuto {
		transition: 0.3s ease-in;
		max-height: 1000px !important;
	}
	.rotate0 {
		transform: rotate(0);
		transition: 0.3s ease-in;
	}
	.rotate90 {
		transform: rotate(90deg);
		transition: 0.3s ease-in;
	}
}
</style>

<script>
	export default {
		name: 'WrapItem',
		data() {
			info: {},
			isLock: true
		},
		props: {
			isAnimation: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			}
		},
		methods: {
			handleAnmation() {
				const { info, isLock } = this
				if (!isLock) return
				this.isLock = false
				setTimeout(() => {
					this.$set(info, 'isSwitch', !info.isSwitch)
					this.isLock = true
				}, 300)
			}
		}
	}
</script>