<!-- 路况信息 -->
<template>
	<div class="traffic" :class="isShow ? 'show-fade-start' : 'show-fade-enter'">
		<div class="state-bar">
			<span class="title">{{ i18n.title }}</span>
			<span class="remove el-icon-close" @click="handleClose"></span>
			<em v-for="(v, i) of i18n.state" :key="i" :style="{background: v.color}" class="state">{{ v.text }}</em>
		</div>
		<div class="time-bar">
			<span class="lable">{{ i18n.uptime }}</span>
			<span class="time">{{ time }}</span>
			<span class="update el-icon-refresh" @click="handleRefresh"></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.traffic {
	width: 240px;
	position: absolute;
	top: 40px;
	right: 5px;
	overflow: hidden;
	padding: 5px;
	box-sizing: border-box;
	background: #fff;
	z-index: 998;
	.state-bar {
		overflow: hidden;
		line-height: 20px;
		.title {
			float: left;
		}
		.state {
			float: right;
			color: #fff;
			padding: 0 5px;
			margin: 0 3px 0 0;
		}
		.remove {
			float: right;
			margin: 0 0 0 7px;
			display: block;
			line-height: 20px;
			font-size: 16px;
			cursor: pointer;
		}
	}
	.time-bar {
		padding: 5px 0 0;
		overflow: hidden;
		line-height: 20px;
		.lable, .time, .update {
			float: left;
			color: #999;
		}
		.update {
			display: block;
			line-height: 20px;
			font-size: 16px;
			color: #333;
			margin: 0 0 0 10px;
			cursor: pointer;
		}
	}
}
.show-fade-enter {
	transform: translateX(330px);
	transition: all 0.3s;
}

.show-fade-start {
	transition: all 0.3s;
	transform: translateX(0);
}
</style>

<script type="text/javascript">
	import { getFormatTime } from '@/utils/util'

	export default {
		name: 'TrafficInfo',
		data() {
			const data = this.getData()
			return {
				...data
			}
		},
		props: {
			isTraffic: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			isTraffic(val, oldVal) {
				this.isShow = val
			}
		},
		created() {
			const traffic = this.$t('allMonitor.traffic')
			this.i18n = traffic
			const date = getFormatTime('h:m')
			this.time = date
		},
		beforeDestroy() {
			this.i18n = {}
		},
		methods: {
			getData() {
				return {
					i18n: {},
					time: '',
					isShow: false
				}
			},
			handleClose() {
				this.isShow = false
				this.$emit('handleClose')
			},
			handleRefresh() {
				this.$emit('handleRefresh')
				const date = getFormatTime('h:m')
				this.time = date
			}
		}
	}
</script>