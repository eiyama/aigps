<template>
	<div class="wrap">
		<transition name="show-fade">
			<!-- 电子围栏列表 -->
			<div :class="fenceIsShow ? 'show-fade-enter-active' : 'show-fade-enter'" class="side-p right">
				<div
					class="side-box"
					style="padding: 2px 5px 0;"
					:class="markeOpend ? 'aside-trans-top' : 'aside-right-trans-buttom'"
				>
					<h4 v-show="!markeOpend" @click="handleAnimtion" class="el-icon-arrow-down left-icon"></h4>
					<h4 v-show="markeOpend" @click="handleAnimtion" class="el-icon-arrow-up left-icon"></h4>
					<h4 @click="handleClose" class="el-icon-close right-icon"></h4>
					<el-tabs
						class="center"
						v-model="activeName"
						style="height: 100%;display: flex;flex-direction: column;"
						@tab-click="handleClick"
					>
						<el-tab-pane :name="v.name" style="height: 100%;" v-for="(v, index) in tabs" :key="index">
							<span slot="label">
								<el-checkbox @change="changeCheckAll" v-model="v.check" :disabled="v.disabled">{{
									v.label
								}}</el-checkbox>
							</span>
							<el-scrollbar class="scroll-y" style="height: 100%;">
								<ul class="dpt-marke">
									<li v-for="(item, i) in dptMarkList" :key="i">
										<em class="model">
											<el-checkbox @change="changeCheck($event, i)" v-model="item.check"></el-checkbox>
											<span style="padding: 0 2px" />
											<span @click="handleCheck(i)" :class="item.check ? 'select-color' : ''"
												>{{ item.markName }}</span
											>
										</em>
										<span class="model">
											<el-tooltip
												:enterable="false"
												v-if="item.markType != 1"
												class="item"
												effect="dark"
												:content="$t('button.relation')"
												placement="top"
											>
												<span
													@click="clickRelation(i)"
													class="icon-guanlianqiye- iconfont mini-btn"
												></span>
											</el-tooltip>
											<el-tooltip
												:enterable="false"
												class="item"
												effect="dark"
												:content="$t('button.revise')"
												placement="top"
											>
												<span
													@click="clickReviseMark(i)"
													class="el-icon-edit mini-btn"
												></span>
											</el-tooltip>
											<el-tooltip
												:enterable="false"
												class="item"
												effect="dark"
												:content="$t('button.delete')"
												placement="top"
											>
												<span
													@click="clickDeleteMark(item.id)"
													class="el-icon-close mini-btn"
												></span>
											</el-tooltip>
										</span>
									</li>
								</ul>
							</el-scrollbar>
						</el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</transition>
		<!-- 修改围栏的弹窗 -->
		<click-button-revise
			isBoxMin
			hideBtn
			@close="reviseCancel"
			@reviseConfirm="reviseConfirm"
			class="button"
			:listLi="listLi"
			:reviseTitle="$t('allMonitor.reviseTitle')"
			:rules="rules"
			:reviseDialog.sync="reviseDialog"
		></click-button-revise>
		<!-- 增加点的弹窗 -->
		<click-button-add
			ref="add"
			isBoxMin
			hideBtn
			:addTitle="$t('allMonitor.addTitle')"
			:listLi="listLi"
			:rules="rules"
			:addDialog.sync="addDialog"
			@addConfirm="addConfirm"
			@close="addClose"
		>
			<template slot="btn">
				<el-button
					v-show="markType == 1 ? false : true"
					type="primary"
					size="small"
					@click="addIsRelationCar('ruleForm')"
					>{{ $t('button.addRelation') }}</el-button
				>
			</template>
		</click-button-add>
		<!-- 修改关联车辆弹窗 -->
		<click-button-revise
			hideBtn
			@reviseConfirm="relationConfirm($event, $t('success.revise'))"
			@check="treeCheck"
			@timeSelectFocus="timeSelectFocus"
			@close="reviseRelationCancel"
			@changeSelect="reviseSelectChange"
			class="button"
			:listLi="relationForm"
			:reviseTitle="$t('allMonitor.relation')"
			:rules="relationRules"
			:reviseDialog.sync="reviseDialogRelation"
		></click-button-revise>
		<!-- 增加关联点的弹窗 -->
		<click-button-add
			hideBtn
			:addTitle="$t('allMonitor.relationTitle')"
			:listLi="relationForm"
			:rules="relationRules"
			:addDialog.sync="relationDialog"
			@check="treeCheck"
			@addConfirm="relationConfirm"
			@close="addClose"
			@timeSelectFocus="timeSelectFocus"
		></click-button-add>
	</div>
</template>

<style scoped>
.show-fade-enter,
.show-fade-leave-active {
	transform: translateX(330px);
	transition: all 0.3s;
}

.show-fade-enter-active,
.show-fade-leave-active {
	transition: all 0.3s;
	transform: translateX(0);
}

.aside-trans-top {
	transition: all 0.5s;
	height: 100% !important;
}

.aside-right-trans-buttom {
	transition: all 0.5s;
	height: 32px !important;
}

.side-p {
	padding: 5px 0 40px 5px;
	width: 330px;
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	box-sizing: border-box;
	z-index: 999;
}
.side-box {
	padding: 5px 20px;
	background: #fff;
	display: flex;
	flex-direction: column;
	height: 100%;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
}
.side-box .left-icon,
.side-box .right-icon {
	line-height: 40px;
	cursor: pointer;
	position: absolute;
	top: 0;
	z-index: 12;
}

.side-box .left-icon {
	left: 5px;
}

.side-box .right-icon {
	right: 5px;
}
.right {
	right: 0;
	left: auto;
	padding: 5px 5px 40px 0;
}
.dpt-marke li {
	height: 32px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.dpt-marke li .model {
	display: block;
	display: flex;
}
.dpt-marke .model >>> .el-checkbox {
	margin: 0;
}
.dpt-marke li em span {
	cursor: pointer;
}
</style>

<script>
import { Tabs, Checkbox, Tooltip, Button, TabPane, Scrollbar, MessageBox, Message } from 'element-ui'
import ClickButtonRevise from '@/components/clickButtonRevise'
import ClickButtonAdd from '@/components/clickButtonAdd'
import { getDptAll, deleteMark, gpsFenceGet, gpsMarkUp, gpsFenceSave, gpsMarkCreate } from '@/api/dpt'
import { getTreeRepeatValue } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { rule } from '@/utils'
export default {
	components: {
		ClickButtonRevise,
		ClickButtonAdd,
		ElTabs: Tabs,
		ElCheckbox: Checkbox,
		ElTooltip: Tooltip,
		ElButton: Button,
		ElTabPane: TabPane,
		ElScrollbar: Scrollbar
	},
	data() {
		const data = this.getData()
		return {
			...data
		}
	},
	props: {
		fenceIsShow: {
			type: Boolean,
			default: false
		},
		defaultProps: {
			type: Object,
			default: {}
		},
		latLngs: {
			type: Array,
			default: []
		},
		markType: {
			type: Number
		}
	},
	beforeDestroy() {
		const data = this.getData()
		for (const k of Object.keys(data)) {
			this[k] = null
		}
	},
	methods: {
		getData() {
			const rules = {
				markName: rule('isEmpty', this.$t('allMonitor.rules.markName'))
			}
			const relationRules = {
				fenceName: rule('isEmpty', this.$t('allMonitor.rules.markName')),
				fenceRule: rule('isEmpty', this.$t('allMonitor.rules.fenceRule'))
			}
			const tabs = getCopyObj(this.$t('allMonitor.tabs'))
			const relationForm = getCopyObj(this.$t('allMonitor.relationForm'))
			const listLi = getCopyObj(this.$t('allMonitor.listLi'))
			return {
				tabs,
				dptMarkList: [],
				activeName: 'point',
				lock: true,
				markeOpend: true,
				curIndex: 1,
				relationForm,
				curNode: {},
				listLi,
				reviseDialog: false,
				rules,
				treeHide: false,
				relationRules,
				reviseDialogRelation: false,
				addDialog: false,
				overlays: [],
				relationDialog: false
			}
		},
		/**
		 * 获取当前标记类型的值
		 * @return this.curIndex
		 */
		getType() {
			return this.curIndex
		},
		/**
		 * 绑定树数据
		 * @param {Array} tree 树数据
		 */
		setTree(tree) {
			this.relationForm.fenceVehids.tree = tree
		},
		/**
		 * 点击关闭围栏
		 */
		handleClose() {
			this.$emit('handleClose', false)
			// 初始化设置
			this.tabs[this.curIndex - 1].check = false
			this.tabs[this.curIndex - 1].disabled = true
			this.tabs[0].disabled = false
			this.curIndex = 1
			this.activeName = this.tabs[0].name
			this.dptMarkList = []
		},
		/**
		 * tabs上面的复选框改变
		 * @param {Boolean} val 改变之后的值
		 * @param {Number} i 当前的下标
		 */
		changeCheck(val, i) {
			const { dptMarkList, curIndex } = this
			// 是否全选
			const isEvery = dptMarkList.every(e => e.check)
			this.$set(this.tabs[curIndex - 1], 'check', isEvery)

			// 分发事件在地图上渲染围栏覆盖物
			const data = getCopyObj(dptMarkList[i])
			this.$emit('changeCheck', data, curIndex, val)
		},
		/**
		 * 获取标注点列表
		 * @param {Boolean} isInit 是否初始化数据
		 */
		getDptAll(isInit) {
			if (isInit) this.dptMarkList = []
			getDptAll({ type: this.curIndex })
				.then((res) => {
					if (res.success) {
						var list = res.result
						// 证明开始有值，id相同就给同样的check
						if (this.dptMarkList.length && list.length) {
							var boole = true
							outer: for (const v of list.values()) {
								v.check = false
								inter: for (const e of this.dptMarkList.values()) {
									if (e.id == v.id) {
										v.check = e.check
										break inter
									}
								}
								if (!v.check) {
									boole = false
								}
							}
							// 是否是全选
							this.tabs[this.curIndex - 1].check = boole
						} else {
							this.tabs[this.curIndex - 1].check = false
						}
						this.dptMarkList = list
					}
				})
				.catch((err) => {})
		},
		/**
		 * 标记点展开与闭合的动画
		 */
		handleAnimtion() {
			if (!this.lock) return
			this.lock = false
			this.markeOpend = !this.markeOpend
			setTimeout(() => {
				this.lock = true
			}, 500)
		},
		/**
		 * tabs全选
		 * @param {Boolean} 复选框更新后得值
		 */
		changeCheckAll(val) {
			const { dptMarkList, curIndex } = this
			if (!Array.isArray(dptMarkList) || !dptMarkList.length) return
			if (val) {
				const data = dptMarkList.filter(e => !e.check)
				this.$emit('changeCheck', getCopyObj(data), curIndex, val)
			} else {
				const data = dptMarkList.filter(e => e.check)
				this.$emit('changeCheck', getCopyObj(data), curIndex, val)
			}

			for (const v of this.dptMarkList.values()) {
				v.check = val
			}
		},
		/**
		 * 点击复选框文字使点居中
		 * @param {Numer} index 数据的下标
		 */
		handleCheck(index) {
			this.$set(this.dptMarkList[index], 'check', true)
			this.changeCheck(true, index)
		},
		/**
		 * 点击修改关联
		 * @param {Number} index 当前点击的下标
		 */
		clickRelation(index) {
			var that = this
			this.curNode = this.dptMarkList[index]
			const id = this.curNode.id
			gpsFenceGet({ id }).then((res) => {
				const obj = res.result
				if (obj) {
					// 根据标注类型选择限定值的显示隐藏并控制placeholder的值
					this.reviseSelectChange(obj.fenceRule)
					this.curNode.curId = obj.id
					obj.fenceStartTime = obj.fenceStartTime.substring(11, 16)
					obj.fenceEndTime = obj.fenceEndTime.substring(11, 16)
					for (var key in this.relationForm) {
						this.relationForm[key].model = obj[key]
					}
					var arr = obj.fenceVehids.split(',') || []
					/*将最开始的车辆id保存起来*/
					this.curNode.fenceVehids = obj.fenceVehids
					const tree = this.relationForm.fenceVehids.tree
					const arr2 = arr.reduce((initArr, v) => {
						const name = getTreeRepeatValue(tree, 'id', 'name', v)
						initArr.push(name)
						return initArr
					}, [])
					this.relationForm.fenceVehids.model = arr2.join(',')
					// 保存下来用于在修改树的时候勾选对应id的复选框
					this.relationForm.fenceVehids.id = obj.fenceVehids
					const fenceRule = this.relationForm.fenceRule.model
					// list是下拉的数组
					const list = this.relationForm.fenceRule.list
					for (const v of list.values()) {
						if (fenceRule == v.label) {
							this.relationForm.fenceRule.model = v.value
							break
						}
					}
				} else {
					this.relationForm.fenceVehids.id = ''
					// 没有值初始化类型选择和限定值输入框的placeholder
					this.setFenceRule(this.curIndex)
				}
				// 显示弹窗
				this.reviseDialogRelation = true
			})
		},
		/**
		 * 点击修改标记点
		 * @param {Number} index 当前点击的下标
		 */
		clickReviseMark(index) {
			const { curIndex, dptMarkList } = this
			// 先把勾选的全部清除掉
			this.$emit('clearOverlaysAll', false)
			// 点击勾选把当前修改之外的勾选去掉
			for (const [i, v] of this.dptMarkList.entries()) {
				const isEqual = i === index
				this.$set(this.dptMarkList[i], 'check', isEqual)
			}

			// 如果数据大于1则不是全部勾选
			if (this.dptMarkList.length) {
				this.$set(this.tabs[this.curIndex - 1], 'check', false)
			} else {
				this.$set(this.tabs[this.curIndex - 1], 'check', true)
			}
			this.curNode = dptMarkList[index]
			const data = getCopyObj(dptMarkList[index])
			data.edit = true
			this.$emit('changeCheck', data, curIndex, true)
			this.$emit('upMark')
		},
		/**
		 * 点击删除标记点的数据
		 * @param {String} id 该条数据得id
		 */
		async clickDeleteMark(id) {
			const { curIndex } = this
			const msg = this.$t('message.delete')
			const title = this.$t('message.title')
			const obj = {
				confirmButtonText: this.$t('button.confirm'),
				cancelButtonText: this.$t('button.cancel')
			}
			
			try {
				await MessageBox.confirm(msg, title, obj)
	
				const res = await deleteMark({ id })
	
				Message({
					message: this.$t('success.delete'),
					type: 'success'
				})
				
				this.$emit('clearOverlaysAll', false, { data: { id }, type: curIndex })
				this.getDptAll(true)
			} catch (error) {
				// console.log(error)
			}
		},
		/**
		 * tabs切换的时候
		 * @param {String} val 被选中的标签 tab 实例
		 */
		handleClick(val) {
			const { curIndex } = this
			// 代表点击当前的tabs选项
			if (curIndex === parseInt(val.index) + 1) return
			this.setFenceRule(val.index)
			this.dptMarkList = []
			this.$emit('clearOverlaysAll', false)
			for (const [i, v] of this.tabs.entries()) {
				v.check = false
				if (val.index == i) {
					v.disabled = false
				} else {
					v.disabled = true
				}
			}
			
			this.curIndex = parseInt(val.index) + 1
			this.getDptAll()
		},
		/**
		 * 设置标注点类型选择框的状态，以及限定值的placeholder
		 * @param {Number} i 当前选中的tabs
		 */
		setFenceRule(i) {
			if (i == '1') {
				// 切换到线路的时候类型不可选择
				this.$set(this.relationForm.fenceRule, 'disabled', true)
				// 重新赋值为默认值
				this.reviseSelectChange('10005')
				this.relationForm.fenceRule.model = '10005'
				// 限定值显示
				this.relationForm.fenceLimitValue.isHide = false
				var list = this.relationForm.fenceRule.list
				for (const [index, item] of list.entries()) {
					list[index].disabled = false
				}
			} else {
				// 类型可选择
				this.$set(this.relationForm.fenceRule, 'disabled', false)
				// 限定值显示
				this.relationForm.fenceLimitValue.isHide = false
				// this.relationForm.fenceRule.disabled = false;
				// 清空默认值
				this.relationForm.fenceRule.model = ''
				this.relationForm.fenceLimitValue.placeholder = ''
				var deft = '10005'
				var list = this.relationForm.fenceRule.list
				var i = list.findIndex((elem) => elem.value == deft)
				if (i > -1) {
					// 矩形的时候类型选择禁用线路
					list[i].disabled = true
				}
			}
		},
		/**
		 * 关联类型的下拉框选择
		 * @param {String} val 类型的值
		 */
		reviseSelectChange(val) {
			this.relationForm.fenceLimitValue.isHide = false
			switch (val) {
				case '10003':
					this.relationForm.fenceLimitValue.placeholder = this.$t('allMonitor.placeholder1003')
					break
				case '10004':
					this.relationForm.fenceLimitValue.placeholder = this.$t('allMonitor.placeholder1004')
					break
				case '10005':
					this.relationForm.fenceLimitValue.placeholder = this.$t('allMonitor.placeholder1005')
					break
				default:
					// 其他的隐藏掉
					this.relationForm.fenceLimitValue.isHide = true
			}
		},
		/**
		 * 取消修改编辑
		 */
		reviseCancel() {
			this.reviseDialog = false
		},
		/**
		 * 确认修改编辑
		 * @param {Object} res 表单数据
		 */
		reviseConfirm(res) {
			var arr = this.latLngs
			var arr2 = []
			for (var i in arr) {
				arr2.push(arr[i].lng + ',' + arr[i].lat)
			}
			var markLatLngs = arr2.join(';')
			var obj = {}
			for (var key in res) {
				obj[key] = res[key].model
			}
			obj.dptId = ''
			obj.markType = this.curIndex
			obj.markLatLngs = markLatLngs
			obj.id = this.curNode.id
			gpsMarkUp(obj)
				.then((res) => {
					if (res.success) {
						Message({
							type: 'success',
							message: this.$t('success.revise')
						})
						this.reviseDialog = false
						this.dptMarkList = []
						this.$emit('handleEditEnd', this.curIndex)
						this.getDptAll()
					}
				})
				.catch((err) => {})
		},
		/**
		 * 点击绘制完成按钮并谈窗
		 */
		handleEditEnd(latLngs) {
			for (var key in this.listLi) {
				this.listLi[key].model = this.curNode[key]
				if (this.curIndex == 1) {
					// 是点的时候不隐藏
					this.listLi.markPointType.isHide = false
				} else {
					// 不是点的时候隐藏
					this.listLi.markPointType.isHide = true
				}
			}
			this.reviseDialog = true
		},

		/*****   添加围栏点的方法 ************/
		/**
		 * 点击增加标注确认的回调
		 */
		addConfirm(res, boole) {
			var obj = {}
			for (var key in res) {
				obj[key] = res[key].model
			}
			obj.markType = this.markType
			obj.markLatLngs = this.latLngs.join(';')
			obj.dptId = ''
			obj.dataFlag = ''
			obj.creatorUserId = ''
			gpsMarkCreate(obj)
				.then((res) => {
					if (res.success) {
						this.addDialog = false
						this.addClose()
						this.getDptAll()
						Message({
							type: 'success',
							message: this.$t('success.add')
						})
						// true证明点击了保存并关联
						if (boole) {
							this.curNode = res.result
							this.relationDialog = true
						}
					}
				})
				.catch((err) => {})
		},
		/**
		 * 添加标注表单取消之后 || 点击添加标注取消
		 */
		addClose() {
			this.$emit('clearOverlaysAll', true)
		},
		/**
		 * 点击保存并关联车辆
		 * @param {Object} key 表单ref
		 */
		addIsRelationCar(key) {
			this.$refs.add.addConfirm(key, true)
		},
		/**
		 * 显示添加点的弹窗
		 */
		addMarkShow(markType) {
			if (markType == 1) {
				this.listLi.markPointType.isHide = false
			} else {
				this.listLi.markPointType.isHide = true
			}
			this.addDialog = true
		},

		/*****   下面是修改关联车辆的方法 *******/

		/**
		 * 保存并关联车辆确认的回调
		 */
		relationConfirm(res, message) {
			var that = this
			var obj = {}
			for (var key in res) {
				obj[key] = res[key].model
			}
			obj.markId = this.curNode.id
			obj.fenceVehids = this.curNode.fenceVehids || ''
			obj.dptId = ''
			obj.dataFlag = ''
			obj.fenceStartTime = obj.fenceStartTime ? obj.fenceStartTime + ':00' : ''
			obj.fenceEndTime = obj.fenceEndTime ? obj.fenceEndTime + ':00' : ''
			obj.id = this.curNode.curId || ''
			gpsFenceSave(obj)
				.then((res) => {
					if (res.success) {
						Message({
							type: 'success',
							message: message || this.$t('success.add')
						})
						this.relationDialog = false
						this.reviseDialogRelation = false
					}
				})
				.catch((err) => {})
		},
		/**
		 * 保存并关联车辆点击复选框
		 */
		treeCheck(nodeAll) {
			var arr = []
			var arr2 = []
			for (var i in nodeAll) {
				if (nodeAll[i].type == 2) {
					/*拼接车牌号*/
					arr.push(nodeAll[i].name)
					/*拼接车辆id*/
					// arr2.push(nodeAll[i].vehTerminalNo);
					arr2.push(nodeAll[i].id)
				}
			}
			/*把选择的车辆拼接成字符串赋值给表单的输入框*/
			this.relationForm.fenceVehids.model = arr.join()
			/*保存选择复选框的车辆id*/
			this.curNode.fenceVehids = arr2.join()
		},
		/**
		 * 固定时间输入框触发焦点
		 */
		timeSelectFocus(key) {
			// 根据开始时间和结束时间控制取值范围
			if (key == 'fenceStartTime') {
				this.relationForm[key].pickerOptions.maxTime = this.relationForm.fenceEndTime.model
			} else {
				this.relationForm[key].pickerOptions.minTime = this.relationForm.fenceStartTime.model
			}
		},
		/**
		 * 修改关联取消
		 */
		reviseRelationCancel() {
			this.reviseDialogRelation = false
		}
	}
}
</script>
