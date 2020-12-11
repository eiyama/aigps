<!-- 配置引擎 -->
<template>
	<div class="wrap">
		<h5>{{ other.title }}</h5>
		<div class="divider"></div>
		<div class="form">
			<div class="form-item" v-for="(v, i) of forms" :key="i">
				<div class="label">{{ v.label }}</div>
				<el-input v-model.number="v.val" size="small"></el-input>
				<el-checkbox v-if="v.isCheck" v-model="v.check">{{ v.checkText }}</el-checkbox>
				<div v-else class="empty"></div>
				<span class="msg">{{ v.msg }}</span>
			</div>
		</div>
		<div class="btn">
			<el-button type="primary" size="small" @click="handleConfirm">{{ $t('button.confirm') }}</el-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.wrap {
		padding: 20px;
		.divider {
			height: 1px;
			background: #ddd;
			margin: 5px 0 0;
		}
		.form {
			.form-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px;
				color: #666;
				::v-deep .el-input {
					width: 160px;
				}
				::v-deep .el-checkbox {
					width: 80px;
					margin: 0 30px;
				}
				.label {
					width: 280px;
				}
				.empty {
					width: 80px;
					margin: 0 30px;
				}
				.msg {
					width: 340px;
					color: #999;
				}
			}
		}
		.btn {
			padding: 40px 0 0;
			display: flex;
			justify-content: center;
		}
	}
</style>

<script>
	import { mapGetters } from 'vuex'
	import { Checkbox, Message } from 'element-ui'

	import { insertFlowControlConfig, getControlConfig } from '@/api/loadManage/setting'
	import { getCopyObj } from '@/utils/util'

	export default {
		components: {
			ElCheckbox: Checkbox
		},
		data() {
			return {
				forms: [],
				other: {},
				curNode: {}
			}
		},
		computed: {
			...mapGetters([
				'userInfo'
			])
		},
		created() {
			this.other = this.$t('engine.other')
			this.forms = getCopyObj(this.$t('engine.forms'))
			this.requestConfig()
		},
		methods: {
			async requestConfig() {
				const { forms } = this 
				try {
					const res = await getControlConfig()
					this.curNode = res.result || {}
					for (const v of forms.values()) {
						this.$set(v, 'val', res.result[v.key])
						if (v.isCheck) {
							this.$set(v, 'check', res.result[`${v.key}Enable`])
						}
					}
				} catch(err) {

				}
			},
			async handleConfirm() {
				const { forms, userInfo, curNode } = this
				const data = {
					depId: userInfo.id
				}
				for (const v of forms.values()) {
					data[v.key] = v.val
					if (v.isCheck) {
						data[`${v.key}Enable`] = v.check
					}
				}
				if (curNode.id) {
					data.id = curNode.id
				}
				
				try {
					await insertFlowControlConfig(data)
					Message({
			          message: this.$t('success.add'),
			          type: 'success'
			        })
				} catch(err) {

				}
			}
		}
	}
</script>