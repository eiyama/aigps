<template>
	<el-dialog
	  :title="btns.audit"
	  :visible.sync="isShow"
	  :close-on-click-modal="false"
	  width="800px"
	  @close="handleClose"
	>
 		<div class="content">
 			<div class="left">
 				<h5>{{ titles.task }}</h5>
 				<div class="li">
 					<span class="label">{{ examineLabel.vehPlateNo }}：</span>
 					<em class="val">{{ flowControlTask.vehPlateNo }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.trackingNumber }}：</span>
 					<em class="val">{{ flowControlTask.trackingNumber }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.departmentName }}：</span>
 					<em class="val">{{ flowControlTask.departmentName }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.vehicleFromAgency }}：</span>
 					<em class="val">{{ flowControlTask.vehicleFromAgency }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.package }}：</span>
 					<em class="val">{{ flowControlTask.newPackage }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.deliveryWeight }}：</span>
 					<em class="val">{{ flowControlTask.deliveryWeight }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.customerName }}：</span>
 					<em class="val">{{ flowControlTask.customerName }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.loadArea }}：</span>
 					<em class="val">{{ flowControlTask.loadArea }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.unLoadArea }}：</span>
 					<em class="val">{{ flowControlTask.unLoadArea }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.deliveryTime }}：</span>
 					<em class="val">{{ flowControlTask.deliveryTime }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.arrivalTime }}：</span>
 					<em class="val">{{ flowControlTask.arrivalTime }}</em>
 				</div>
 			</div>
 			<div class="right">
 				<h5>{{ titles.examine }}</h5>
 				<div class="li">
 					<span class="label">{{ examineLabel.systemFirstAudit }}：</span>
 					<em class="val">{{ flowControlTask.newSystemFirstAudit }}</em>
 				</div>
 				<div class="li">
 					<span class="label">{{ examineLabel.auditProgress }}：</span>
 					<em class="val">{{ flowControlTask.newAuditProgress }}</em>
 				</div>
				<div class="li" v-for="(v, i) of auditDepartments" :key="i">
 					<span class="label">{{ v.label }}：</span>
 					<em class="val">{{ v.departmentName }}</em>
 					<em class="state">{{ v.state }}</em>
 					<el-button
 						size="mini"
 						type="primary"
 						v-if="v.isBtn"
 						@click="handleExamine(i)"
 					>
 						{{ btns.audit }}
 					</el-button>
 				</div>
 			</div>
 		</div>
 		<div class="btn-bar">
	 		<el-button
				size="mini"
				type="primary"
				@click="handleTrajectory"
			>
				{{ btns.trajectory }}
			</el-button>
 		</div>
		<span slot="footer" class="dialog-footer">
		  	<el-button size="small" @click="isShow = false">{{ i18n.cancel }}</el-button>
		    <el-button size="small" type="primary" @click="isShow = false">{{ i18n.confirm }}</el-button>
		</span>
	</el-dialog>
</template>

<style lang="scss" scoped>
	.el-dialog__wrapper {
		::v-deep .el-dialog__body {
			padding: 10px 20px;
			.content {
				overflow: hidden;
				.left {
					float: left;
					width: 50%;
				}
				.right {
					float: right;
					width: 50%;
				}
				.li {
					line-height: 28px;
					margin: 5px 0 0;
					.label, .val {
						color: #666;
					}
					.el-button {
						margin: 0 0 0 14px;
					}
					.state {
						color: #999;
						font-size: 12px;
						padding: 0 5px;
					}
				}
			}
			.btn-bar {
				padding: 10px 0 0;
			}
		}
	}	
</style>

<script>
	import { mapGetters } from 'vuex'

	import { Dialog } from 'element-ui'

	import { getControlTaskDetail } from '@/api/loadManage/flowControl'

	import { getCopyObj } from '@/utils/util'

	export default {
		name: 'Examine',
		components: {
			ElDialog: Dialog
		},
		data() {
			return {
				isShow: false,
				btns: {},
				i18n: {},
				dptLabel: {},
				titles: {},
				curNode: {},
				auditConfig: {},
				flowControlTask: {},
				examineLabel: {},
				mapping: {},
				curIndex: 0,
				auditDepartments: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'routes'
			])
		},
		created() {
			this.i18n = this.$t('button')
			this.btns = this.$t('taskLatitude.buttons')
			this.dptLabel = this.$t('taskLatitude.auditLabel')
			this.examineLabel = this.$t('taskLatitude.examineLabel')
			this.mapping = this.$t('taskLatitude.mapping')
			this.titles = this.$t('taskLatitude.titles')
		},
		methods: {
			setState(isShow, row) {
				this.isShow = isShow
				if (row) {
					this.curNode = row
					this.requestTaskDetail(row)
				}
			},
			handleClose() {
				this.flowControlTask = {}
				this.auditConfig = {}
			},
			async requestTaskDetail(row) {
				try {
					const res = await getControlTaskDetail(row.id)
					const { mapping, dptLabel: { dpts }, userInfo } = this
					const { auditConfig, flowControlTask } = res.result
					flowControlTask.newPackage = mapping.package[flowControlTask.package]
					flowControlTask.newSystemFirstAudit = mapping.systemFirstAudit[flowControlTask.systemFirstAudit]
					flowControlTask.newAuditProgress = mapping.auditProgress[flowControlTask.auditProgress]
					this.flowControlTask = flowControlTask
					this.auditConfig = auditConfig || {}

					for(const [i, v] of auditConfig.auditDepartments.entries()) {
						v.label = dpts[i]
						// 当前审核的部门id与当前登录账号的id相同，且审核开启，且没有审核
						v.isBtn = v.departmentId === userInfo.dptId && auditConfig.opened && !v.operated
						// 没有审核显示未审核，反之则已审核
						v.state = v.operated ? mapping.auditState[0] : mapping.auditState[1]
					}
					this.auditDepartments = getCopyObj(auditConfig.auditDepartments)
				} catch(err) {
					this.auditDepartments = []
				}
			},
			handleExamine(i) {
				const { auditDepartments } = this
				this.curIndex = i
				const v = auditDepartments[i]
				this.$emit('handleExamine', v)
			},
			/**
			 * 部门审核成功把对应的部门状态设置为已审核，并去掉按钮
			 */
			checkOperator(id) {
				console.log(id)
				const { auditDepartments, mapping } = this
				const i = auditDepartments.findIndex(e => e.id === id)
				if (i > -1) {
					this.$set(auditDepartments[i], 'isBtn', false)
					this.$set(auditDepartments[i], 'state', mapping.auditState[0])
				}
			},
			/**
			 * 轨迹回放
			 */
			handleTrajectory() {
				const { curNode, routes, $router } = this
				const opt = {
					path: '/home/carMonitor/carAnalysis',
					query: {
						startTime: curNode.deliveryTime,
						endTime: curNode.arrivalTime,
						carName: curNode.vehPlateNo,
						id: curNode.vehNo
					}
				}
				const i = routes.findIndex(e => e.path === opt.path)
				if (i < 0) {
					opt.path = '/home/carMonitor/'
				}

				$router.push(opt)
			}
		}
	}
</script>