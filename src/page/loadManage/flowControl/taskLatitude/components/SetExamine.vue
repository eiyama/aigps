<template>
	<el-dialog
	  :title="btns.auditSettings"
	  :visible.sync="isShow"
	  :close-on-click-modal="false"
	  width="540px"
	  @close="handleClose">
	  <div>
	  	<div class="li">
	  		<span class="label">{{ btns.toggle }}：</span>
	  		<el-switch v-model="toggle" />
	  	</div>
	  	<div class="dpt-box">
		  	<div class="li dpt-li" v-for="(v, i) of dpts" :key="i">
		  		<div class="row">
		  			<span class="label">{{ dptLabel.dpts[i] }}：</span>
		  			<el-input
		  				size="small"
		  				v-model="v.dptVal"
		  				clearable
						auto-complete="off"
						@click.native.stop="handleClick(i)"
						@input.native="changeInput($event, i)"
						@clear="handleClear(i)"
		  			/>
		  		</div>
		  		<div class="row">
		  			<el-checkbox size="small" v-model="v.check">{{ dptLabel.check }}</el-checkbox>
		  			<span class="el-icon-plus" @click="addDpt"></span>
		  			<span class="el-icon-minus" @click="delDpt(i)"></span>
		  		</div>
		  	</div>
		  	<popup-tree
				ref="popupTree"
				:tree="tree"
				:defaultProps="defaultProps"
				:isShow.sync="popupTreeIsShow"
				:labels="labels"
				:opendIdArr="opendIdArr"
				:style="{top: `${(curIndex + 1) * 43}px`}"
				@handleNode="handleNode"
			/>
	  	</div>
	  </div>
	  <span slot="footer" class="dialog-footer">
	    <el-button size="small" @click="isShow = false">{{ i18n.cancel }}</el-button>
	    <el-button size="small" type="primary" @click="handleConfirm">{{ i18n.confirm }}</el-button>
	  </span>
	</el-dialog>
</template>

<script>
	import { Dialog, Checkbox, Switch, Message } from 'element-ui'

	import PopupTree from './PopupTree'

	import { getCopyObj } from '@/utils/util'

	import { insertAuditConfig, getControlTaskDetail } from '@/api/loadManage/flowControl'

	export default {
		name: 'SetExamine',
		components: {
			ElDialog: Dialog,
			ElCheckbox: Checkbox,
			ElSwitch: Switch,
			PopupTree
		},
		data() {
			return {
				isShow: false,
				toggle: false,
				popupTreeIsShow: false,
				dpts: [],
				i18n: {},
				btns: {},
				dptLabel: {},
				curIndex: 0,
				tree: [],
				defaultProps: {
					children: 'child',
					label: 'dptName'
				},
				labels: ['dptName'],
				opendIdArr: [],
				oldVal: '',
				curNode: {},
				row: {},
				details: {}
			}
		},
		created() {
			this.i18n = this.$t('button')
			this.btns = this.$t('taskLatitude.buttons')
			this.dptLabel = this.$t('taskLatitude.auditLabel')
			this.addDpt()
		},
		methods: {
			handleClose() {
				this.dpts = []
				this.toggle = false
				this.details = {}
				this.addDpt()
			},
			setState(isShow, row) {
				this.isShow = isShow
				if (row) {
					this.row = row
					this.requestTaskDetail(row)
				}
			},
			async requestTaskDetail(row) {
				const { dpts } = this
				try {
					const res = await getControlTaskDetail(row.id)
					const { opened, auditDepartments } = res.result.auditConfig
					this.toggle = opened
					for (const [i, v] of auditDepartments.entries()) {
						if (i === 0) {
							this.addDpt()
						}
						this.$set(dpts[i], 'dptVal', v.departmentName)
						this.$set(dpts[i], 'dptId', v.departmentId)
						this.$set(dpts[i], 'check', v.allowedUploadImage)
					}
					this.details = res.result
				} catch(err) {

				}
			},
			/**
			 * 设置部门名称的tree数据
			 */
			setDptNameTree(tree) {
				this.tree = tree
				this.opendIdArr.push(tree[0].id)
			},
			addDpt() {
				const { dpts, dptLabel } = this
				const { length } = this.dpts
				if (length >= dptLabel.dpts.length) {
					return
				}
				const data = {
					dptVal: '',
					check: false
				}
				this.dpts.push(data)
			},
			delDpt(i) {
				const { dpts } = this
				if (dpts.length === 1) {
					return
				}
				this.dpts.splice(i, 1)
			},
			/**
		     * 点击树节点
		     * @param {Object} data 点击的当前值
		     */
		    handleNode(data) {
		    	const { curIndex, dpts } = this
		    	const { dptName, id } = data
		    	const err = this.$t('taskLatitude.error')
		    	const isRepeat = dpts.some(e => e.dptId === id || e.dptName === dptName)
		    	// 部门不允许重复选择
		    	if (isRepeat) {
		    		Message.error(err.dptRepeat)
		    		return
		    	}
		    	this.popupTreeIsShow = false
		    	this.curNode = data
		    	this.$set(dpts[curIndex], 'dptVal', dptName)
		    	this.$set(dpts[curIndex], 'dptId', id)
		    },
		    /**
		     * 点击tree的输入框
		     */
		    handleClick(i) {
		    	this.curIndex = i
		    	const { popupTreeIsShow } = this
		    	// 为true的时候不执行
		    	if (popupTreeIsShow) return
		    	this.handleClear()
		    	this.popupTreeIsShow = true
		    },
		     /**
		     * 输入框值改变
		     */
		    changeInput(e, i) {
		    	const { dpts, $refs } = this
		    	dpts[i].dptId = ''
		    	const val = e.target.value
		    	// 通过优化输入来尽量减少调用过滤的方法
				if (this.oldVal === val) return
				this.oldVal = val
				const tid = setTimeout(() => {
					clearTimeout(tid)
					if (val === this.oldVal) {
						if (!val) {
							this.handleClear()
						} else if (val.length >= 2) {
							$refs.popupTree.filter(val)
						}
					}
				}, 400)
		    },
		    /**
		     * 点击清除树的输入框
		     */
		    handleClear(i) {
		    	const { tree, dpts } = this
		    	if (typeof i !== 'undefined') {
		    		dpts[i].dptId = ''
		    	}
		    	const oldTree = getCopyObj(tree)
				this.tree = []
				this.$nextTick(() => {
					this.tree = oldTree
				})
		    },
		    /**
		     * 添加确认
		     */
		    async handleConfirm() {
		    	const { dpts, toggle, row, details: { auditConfig } } = this
		    	const auditDepartments = dpts.reduce((arr, v, i) => {
		    		if (v.dptVal && v.dptId) {
			    		const obj = {
			    			departmentId: v.dptId,
			    			departmentName: v.dptVal,
			    			level: i + 1,
			    			allowedUploadImage: v.check
			    		}
			    		arr.push(obj)
		    		}
		    		return arr
		    	}, [])

		    	const data = {
		    		flowControlTaskId: row.id,
		    		opened: toggle,
		    		auditDepartments
		    	}
		    	if (auditConfig) {
		    		data.id = auditConfig.id
		    	}

		    	try {
			    	const res = await insertAuditConfig(data)
			    	Message({
			          message: this.$t('success.add'),
			          type: 'success'
			        })
			        this.isShow = false
			        if (toggle) {
			        	this.$emit('handleConfirm', row.id)
			        }
		    	} catch(err) {

		    	}
		    }
		}
	}
</script>

<style scoped lang="scss">
	.el-dialog__wrapper {
		::v-deep .el-dialog__body {
			padding: 10px 20px;
			.li {
				margin: 10px 0 0;
				.el-input {
					width: 220px;
				}
			}
			.dpt-box {
				position: relative;
				.dpt-li {
					display: flex;
					justify-content: space-between;
					.row {
						line-height: 32px;
						.label, span {
							line-height: 32px;
						}
						span {
							cursor: pointer;
						}
						.el-icon-plus {
							margin: 0 8px 0 0;
						}
					}
				}
				.dpt-tree {
					left: 60px;
				}
			}
		}
	}
</style>