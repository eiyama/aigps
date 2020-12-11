<template>
	<div
		class="tool-bar-box"
		:class="
			!isShowVideos && !isShowCenVideo
				? markeBoxShow
					? 'tool-transition-end'
					: 'tool-transition-start'
				: 'tool-transition-hide'
		"
	>
		<!-- 路况信息按钮 -->
		<!-- <el-button @click="handleTraffic" type="primary" size="mini">
			<span class="iconfont icon-shexiangtou">{{ $t('button.traffic') }}</span>
		</el-button> -->
		<!-- 退出绘制按钮 -->
		<!-- <el-button @click="handleQuit" v-show="reviseShow" type="primary" size="mini">
			<span class="iconfont icon-dingwei">{{ $t('button.quitDraw') }}</span>
		</el-button> -->

		<div class="aigps_tool">
			<el-tooltip :content="$t('button.traffic')" placement="left" v-if="trafficShow">
				<a @click="handleTraffic" href="javascript:;" >				
					<img  src="@/assets/image/allMonitor/icon-traffic.png" alt="">				
				</a>
			</el-tooltip>
			<el-tooltip :content="$t('button.traffic')" v-else placement="left">
				<a @click="closeTraffic" href="javascript:;" >				
					<img  src="@/assets/image/allMonitor/icon-traffic-active.png" alt="">				
				</a>
			</el-tooltip>
			<el-tooltip :content="$t('button.dingwei')" placement="left" v-if="!markeBoxShow">
				<a @click="handleMarkBtn" href="javascript:;" >
					<img  src="@/assets/image/allMonitor/location.png" alt="">
					</a>
			</el-tooltip>
			<el-tooltip :content="$t('button.quitDraw')" placement="left" v-else>
				<a @click="handleMarkBtn" href="javascript:;" >
					<img  src="@/assets/image/allMonitor/location-active.png" alt="">
				</a>	
			</el-tooltip>												
		</div>

		<!-- 绘制完成按钮 -->
		<el-tooltip
			v-show="reviseShow"
			:value="reviseShow"
			:manual="true"
			:enterable="true"
			class="item revise-success"
			effect="dark"
			:content="$t('allMonitor.relationTip')"
			placement="top"
		>
			<el-button size="mini" @click="handleEditSuc" type="primary">
				<span class="iconfont">{{ $t('button.drawSuccess') }}</span>
			</el-button>
		</el-tooltip>
		<!-- <el-button @click="handleMarkBtn" type="primary" size="mini">
			<span class="iconfont icon-dingwei">{{ $t('button.dingwei') }}</span>
		</el-button> -->
	</div>
</template>

<style scoped>
.tool-bar-box {
	position: absolute;
	top: 5px;
	right: 5px;
	display: flex;
	z-index: 17;
}
.aigps_tool{
	width: 40px;
    position: absolute;
    right: 16px;
    top: 42px;
    z-index: 200;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,.3);
    border-radius: 5px;
}

.aigps_tool a {
	display: block;
    height: 44px;
    color: #33373c;
    line-height: 44px;
    font-size: 22px;
    border-bottom: 1px solid #dedede;
    text-align: center;
    text-decoration: none;
}
.aigps_tool a img{
	    height: 23px;
    margin-top: 12px;
}
/*工具栏的动画*/
.tool-transition-start {
	transform: translateX(0);
	transition: all 0.3s;
}

.tool-transition-end {
	transform: translateX(-330px);
	transition: all 0.3s;
}
.tool-transition-hide {
	transform: translateX(330px);
	transition: all 0.3s;
}
</style>

<script>
import { Button, Tooltip, } from 'element-ui'
export default {
  components: {
    ElButton: Button,
    ElTooltip: Tooltip
  },
	data() {
		const data = this.getData()
		return {
			...data
		}
	},
	props: {
		isShowVideos: {
			type: Boolean,
			default: false
		},
		isShowCenVideo: {
			type: Boolean,
			default: false
		},
		markeBoxShow: {
			type: Boolean,
			default: false
		}
	},
	beforeDestroy() {
		// const data = this.getData()
		// for (const [k, v] of Object.entries(data)) {
		// 	this[k] = v
		// }
	},
	methods: {
		getData() {
			return {
				reviseShow: false,
				lock: true,
				trafficShow:true,
				locationShow:true
			}
		},
		/**
		 * 退出绘制按钮
		 */
		handleQuit(isQuit) {
			this.reviseShow = false;			 
			if (isQuit) this.$emit('handleQuit')
		},
		/**
		 * 点击绘制完成
		 */
		handleEditSuc() {
			this.$emit('handleEditSuc')
		},
		closeMarkBtn(){
			this.locationShow = true;
		},
		/**
		 * 点击标注
		 */
		handleMarkBtn() {			
			// this.locationShow = !this.locationShow;
			if (!this.lock) return
			this.lock = false			 
			this.$emit('handleMarkBtn', !this.markeBoxShow)
			const tid = setTimeout(() => {
				this.lock = true
				clearTimeout(tid)
			}, 1000)
		},

		closeTraffic(){
			this.$emit('handleTraffic',false);
			this.trafficShow = true;
		},
		/**
		 * 点击路况信息按钮
		 */
		handleTraffic() {
			this.trafficShow = false;
			this.$emit('handleTraffic',true);
		},
		/**
		 * 设置隐藏显示的状态
		 */
		setIsShow(state) {
			this.$emit('update:markeBoxShow', state)
			this.reviseShow = false
		},
		setEditState(state) {
			this.reviseShow = state
		}
	}
}
</script>
