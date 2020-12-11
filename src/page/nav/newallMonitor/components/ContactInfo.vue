<template>
	<popup-view
		ref="popup"
		:isShow.sync="isShow"
		:title="title"
		:isZoom="false"
		:css="{ minWidth: '360px', width: 'auto', height: 'auto' }"
	>
		<div class="content">
			<div class="ul">
				<div class="li" v-for="(v, i) of i18nArr" :key="i">
					<span class="label">{{ v.label }}</span>
					<em class="val">{{ info[v.key] }}</em>
				</div>
			</div>
		</div>
	</popup-view>
</template>

<style scoped lang="scss">
.content {
	background: #fff;
	flex: 1;
	padding: 20px;
	.img {
		height: 300px;
		img {
			height: 100%;
			margin: 0 auto;
			display: block;
		}
		p {
			text-align: center;
			line-height: 300px;
		}
	}
	.ul {
		.li {
			overflow: hidden;
			line-height: 24px;
			.label {
				float: left;
				margin: 0 10px 0 0;
				color: #666;
			}
			.val {
				color: #999;
			}
		}
	}
}
</style>

<script>
import PopupView from '@/components/map/PopupView'
import { getDriveImage } from '@/api/sysetsmM/car'

export default {
	name: 'DriveInfo',
	components: {
		PopupView
	},
	data() {
		return {
			isShow: false,
			title: '',
			info: {},
			i18nArr: []
		}
	},
	created() {
		this.i18nArr = this.$t('allMonitor.contactInfo')
	},
	methods: {
		/**
		 * 根据司机姓名请求数据渲染页面
		 * @param  {Object} curNode 当前司机的车辆信息
		 */
		async initInfo(curNode) {
			const { driver, name } = curNode
			this.title = name
			const { isShow, $refs } = this
			if (!isShow) {
				this.setState(!isShow)
				await this.$nextTick()
				$refs.popup.setPotionCenter()
			}
			try {
				const res = await getDriveImage(driver)
				this.info = res.result
			} catch(err) {

			}
		},
		setState(state) {
			this.isShow = state

		}
	}
}
</script>