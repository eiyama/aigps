<!-- 查询 -->
<template>
	<el-row class="row">
		<click-button-add
			v-if="!!operButton.add"
			class="button"
			:listLi="listLi"
			:addTitle="addTitle"
			:rules="rules"
			:formLabelWidth="formLabelWidth"
			:addDialog.sync="addDialog"
			:treeHide.sync="treeHide"
			:defaultProps="defaultProps"
			:isBoxMin="isBoxMin"
			:isBox="isBox"
			ref="clickAdd"
			@node-click="clickTreeNode"
			@addConfirm="addConfirm"
			@addInfoCancel="addInfoCancel"
			@clickAddInfo="clickAddInfo"
			@selectChangeValue="changeValue"
			@changeSelect="changeSelect"
      		@handleInput="handleInput"
      		@check="checkPopup"
		>
			<template slot="other">
				<slot name="other"></slot>
			</template>
		</click-button-add>
		<!-- 导入 -->
		<el-tooltip
			v-if="!!operButton.isImport"
			class="item"
			effect="dark"
			:content="$t('button.upload')"
			placement="top"
		>
			<span @click="upload" class="el-icon-upload2 mini-btn button"></span>
		</el-tooltip>
		<click-button-revise
			v-if="!!operButton.revise"
			@reviseInfoCancel="reviseCancel"
			@reviseConfirm="reviseConfirm"
			@clickReviseInfo="reviseInfo"
			@node-click="clickTreeNode"
			@radioChange="radioChange"
			@reviseSelectChange="reviseChangeValue"
			@changeSelect="changeSelect"
      		@handleInput="handleInput"
			class="button"
			:formLabelWidth="formLabelWidth"
			:listLi="listLi"
			:reviseTitle="reviseTitle"
			:rules="rules"
			:reviseDialog.sync="reviseDialog"
			:treeHide.sync="treeHide"
			:defaultProps="defaultProps"
			:isBoxMin="isBoxMin"
			:isBox="isBox"
			ref="clickRevise"
      		@check="checkPopup"
		>
			<template slot="other">
				<slot name="other"></slot>
			</template>
		</click-button-revise>
		<el-tooltip
			v-if="!!operButton.delete"
			class="item"
			effect="dark"
			:content="$t('button.delete')"
			placement="top"
		>
			<span @click="clickDelete" class="el-icon-close button mini-btn margin-bottom"></span>
		</el-tooltip>
		<el-tooltip
			v-if="!!operButton.refresh"
			class="item"
			effect="dark"
			:content="$t('button.refresh')"
			placement="top"
		>
			<span @click="clickRefresh" class="el-icon-refresh button mini-btn margin-bottom"></span>
		</el-tooltip>
		<template v-if="!!operButton.search">
			<el-row v-for="(v, key) in searchList" :key="key" v-show="!v.isHide" class="model-input margin-bottom">
				<span class="name">{{ v.label }}</span>
				<!-- 普通输入框 -->
				<el-input
					:placeholder="v.placeholder ? v.placeholder : ''"
					v-if="v.type == 'input'"
					class="input margin-bottom"
					:style="{ width: v.width ? v.width : '160px' }"
					@keyup.enter.native="query"
					size="small"
					clearable
					v-model="v.model"
				></el-input>
				<!-- 下拉 -->
				<template v-if="v.type == 'select'">
					<el-select
						class="input margin-bottom"
						size="small"
						v-model="v.model"
						:placeholder="v.placeholder ? v.placeholder : ''"
					>
						<el-option
							v-for="(item, index) in v.list"
							:key="index"
							:value="item[v.key.value]"
							:label="item[v.key.value]"
						></el-option>
					</el-select>
				</template>
				<!-- 下拉 -->
				<template v-if="v.type == 'select1'">
					<el-select
						class="input margin-bottom"
						@change="$emit('changeSelect', v.model, key)"
						size="small"
						v-model="v.model"
						:placeholder="v.placeholder ? v.placeholder : ''"
					>
						<el-option
							v-for="(item, index) in v.list"
							:key="index"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select>
				</template>
				<!-- 下拉带远程搜索单选 -->
				<template v-if="v.type == 'selectSearch'">
					<!-- 解决el-input组件input事件的bug -->
					<div class="tree-model search-select margin-bottom">
						<div
							@mouseleave="selectClose = false"
							@mouseenter="selectClose = true"
							@click.stop
							class="el-input input-max el-input--small"
						>
							<input
								v-model="v.model"
								:placeholder="v.placeholder || ''"
								@focus="focusSearch"
								@input="remoteMethod(v.model, key)"
								@keyup.enter="query"
								class="el-input__inner"
								auto-complete="off"
								:readonly="v.showcheck"
							/>
							<span
								@click="handleClose"
								v-show="selectClose && v.model"
								class="remove el-icon-circle-close"
							></span>
						</div>
						<div v-show="searchSelectHide" @click.stop id="remote" class="tree-box border">
							<el-scrollbar class="dtp-tree scroll-y">
								<div v-if="v.list.length === 0" class="no-data">暂无数据</div>
								<div class="ul el-scrollbar__view el-select-dropdown__list">
									<div
										class="li el-select-dropdown__item"
										@click="handleSearchClick(item.vehPlateNo, item.vehTerminalNo)"
										v-for="(item, index) of v.list"
										:key="index"
									>
										{{ item[v.key.value] }}
									</div>
								</div>
							</el-scrollbar>
						</div>
					</div>
				</template>
				<!-- 下拉多选 -->
				<template v-if="v.type == 'selectAll'">
					<el-select
						@change="$emit('changeSelect', v.model)"
						v-model="v.model"
						class="input margin-bottom"
						size="small"
						multiple
						collapse-tags
						:style="{ width: v.width ? v.width : '160px' }"
						:placeholder="v.placeholder ? v.placeholder : ''"
					>
						<el-option
							v-for="item in v.list"
							:key="item.value"
							:label="item[v.key.label]"
							:value="item[v.key.value]"
							:disabled="!!item.disabled"
						/>
					</el-select>
				</template>
				<!-- 单选 -->
				<template v-if="v.type == 'radio'">
					<!-- <el-radio v-model="v.model" v-for="(item,index) in v.children" :key="index" :label="index">{{ item }}</el-radio> -->
					<el-checkbox @change="changeCheck" v-model="v.model"></el-checkbox>
				</template>
				<!-- 树 -->
				<template v-if="v.type == 'tree'">
					<!-- 解决el-input组件input事件的bug -->
					<div class="tree-model margin-bottom">
						<el-input
							@click.native.stop
							v-model="v.model"
							:placeholder="v.placeholder ? v.placeholder : ''"
							clearable
							size="small"
							@focus="focus(key, v.idK)"
							@input.native="valueChange($event, key, v.showcheck, v.filter)"
							@clear="clear(key, v.showcheck)"
							auto-complete="off"
						></el-input>
						<div v-show="!!searchTreeHide[key]" @click.stop class="tree-box border">
							<el-scrollbar class="dtp-tree scroll-y">
								<el-tree
									accordion
									empty-text
									class="border-blue"
									:ref="key"
									node-key="id"
									highlight-current
									:show-checkbox="!!v.showcheck"
									:expand-on-click-node="false"
									:default-expanded-keys="v.opendId"
									:data="v.tree"
									@node-click="handleNodeClick($event, key, v.showcheck)"
									@check="check($event, key)"
									:props="v.defaultProps"
									:filter-node-method="!!v.filter ? filterFn : filterNode"
								></el-tree>
							</el-scrollbar>
						</div>
					</div>
				</template>
				<!-- 时间 -->
				<el-date-picker
					:editable="false"
					v-if="v.type == 'time'"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
					v-model="v.model"
					type="datetime"
					:placeholder="$t('placeholder.times')"
					align="right"
					:picker-options="pickerOptions2 || pickerOptions"
					class="margin-bottom"
				></el-date-picker>
				<!-- 日期 -->
				<el-date-picker
					v-if="v.type == 'date'"
					size="small"
					:style="{ width: v.width ? v.width : '160px' }"
					value-format="yyyy-MM-dd"
					v-model="v.model"
					class="margin-bottom"
					type="date"
					:picker-options="pickerOptions2 || pickerOptions"
					:placeholder="$t('placeholder.times')"
				></el-date-picker>
				<!-- 月 -->
				<el-date-picker
					v-if="v.type == 'month'"
					size="small"
					class="margin-bottom"
					:style="{ width: v.width ? v.width : '160px' }"
					v-model="v.model"
					type="month"
					value-format="yyyy-MM"
					:placeholder="v.placeholder || ''"
				></el-date-picker>
				<!-- 开始结束时间 -->
				<el-date-picker
					:editable="false"
					v-if="v.type == 'startEndTime'"
					value-format="yyyy-MM-dd HH:mm:ss"
					size="small"
					v-model="v.model"
					:style="{ width: v.width ? v.width : '160px' }"
					type="datetimerange"
					:picker-options="pickerOptions2 || pickerOptions1"
					:range-separator="$t('placeholder.to')"
					:start-placeholder="$t('placeholder.startTime')"
					:end-placeholder="$t('placeholder.endTime')"
					align="right"
					class="margin-bottom"
					:default-time="['00:00:00', '23:59:59']"
				></el-date-picker>
				<!-- 开始结束日期 -->
				<el-date-picker
					v-model="v.model"
					:style="{ width: v.width ? v.width : '160px' }"
					value-format="yyyy-MM-dd"
					v-if="v.type == 'startEndDate'"
					size="small"
					type="daterange"
					:range-separator="$t('placeholder.to')"
					:start-placeholder="$t('placeholder.startTime')"
					:end-placeholder="$t('placeholder.endTime')"
					align="right"
					class="margin-bottom"
					:picker-options="pickerOptions2 || pickerOptions1"
				></el-date-picker>
			</el-row>
			<el-button
				v-if="Object.keys(searchList).length"
				@click="query"
				type="primary"
				class="button margin-bottom"
				size="small"
				icon="el-icon-search"
			>
				{{ $t('button.search') }}
			</el-button>
		</template>
		<el-button
			v-if="!!operButton.export"
			@click="exportFile"
			type="primary"
			class="button margin-bottom"
			size="small"
			icon="el-icon-download"
			>{{ $t('button.exportFile') }}</el-button
		>
        <el-button			
			@click="bindingCar"
			type="primary"
			class="button margin-bottom"
			size="small"			
			>{{ $t('button.bandingCar') }}</el-button
		>          
		<slot name="btns"></slot>
	</el-row>
</template>

<script>
import { Checkbox, Row, Scrollbar, Tree, DatePicker, Select, Option, Table, TableColumn, Tooltip } from 'element-ui'
import { getPickerOptions, getPickerOptions2 } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import clickButtonAdd from '@/components/clickButtonAdd'
import clickButtonRevise from '@/components/clickButtonRevise'

export default {
	name: 'TabBar',
	components: {
		clickButtonAdd,
		clickButtonRevise,
		ElRow: Row,
		ElCheckbox: Checkbox,
		ElScrollbar: Scrollbar,
		ElTree: Tree,
		ElDatePicker: DatePicker,
		ElSelect: Select,
		ElOption: Option,
		ElTable: Table,
		ElTableColumn: TableColumn,
		ElTooltip: Tooltip
	},
	data() {
		const pickerOptions1 = getPickerOptions(this.$t('otherText'))
		const pickerOptions = getPickerOptions2(this.$t('otherText'))
		return {
			searchTreeHide: {},
			searchSelectHide: false, // 用来控制带模糊搜索盒子显示的变量
			reviseDialog: false,
			addDialog: false,
			treeSearch: '',
			value9: [],
			pickerOptions1,
			pickerOptions,
			oApp: null,
			curIndex: null, // 用来控制选中哪一个项
			selectClose: false, // 选中搜索框显示清除图标的变量
			openKeys: {}, // 默认展开的树节点id
			treeHide: false,
			oldVal: ''
		}
	},
	props: {
		listLi: Object,
		rules: Object,
		formLabelWidth: {
			type: String,
			default: '120px'
		},
		searchList: {
			type: Object,
			default: () => new Object()
		},
		addTitle: String,
		reviseTitle: String,
		tree: {
			type: Array,
			default: () => []
		},
		defaultProps: Object,
		inputW: String,
		pickerOptions2: {
			type: Object
		},
		operButton: Object,
		isBoxMin: Boolean,
		isBox: Boolean, // 是否需要多一层盒子包裹
		treeName: String,
		filterFn: {
			type: [Function, Object],
			default: () => true
		}, // 过滤
		isImport: Boolean // 是否需要导入按钮
	},
	mounted() {
		//点击其他地方关闭树弹窗
		this.oApp = document.getElementById('app')
		this.oApp.addEventListener('click', this.treeHideFn)
	},
	beforeDestroy() {
		this.oApp.removeEventListener('click', this.treeHideFn)
	},
	computed: {},
	methods: {
		// 树过滤
		filterNode(value, data) {
			if (!value) return true
			// 部门不搜索
			if (data.type == '1') {
				return false
			}
			// 搜索框的值
			var val = value.toUpperCase()
			// 自定义传过来的字段key值
			if (this.treeName) {
				var veh = data[this.treeName] ? data[this.treeName].toUpperCase() : ''
				if (veh.indexOf(val) !== -1) {
					return true
				} else {
					return false
				}
			} else {
				// 默认搜索车牌号与终端号、sim号
				const name = data.name ? data.name.toUpperCase() : ''
				const vehTerminalNo = data.vehTerminalNo ? data.vehTerminalNo.toUpperCase() : ''
				const sim = data.sim ? data.sim.toUpperCase() : ''
				// 只要车牌号与终端号有一个满足就显示
				if (name.indexOf(val) !== -1 || vehTerminalNo.indexOf(val) !== -1 || sim.indexOf(val) != -1) {
					return true
				} else {
					return false
				}
			}
		},
		// 隐藏树
		treeHideFn() {
			for (const [k, v] of Object.entries(this.searchTreeHide)) {
				const obj = this.$refs[k][0]
				if (obj && obj.filter) {
					obj.filter('')
				}
				this.$set(this.searchTreeHide, k, false)
			}
			this.searchSelectHide = false
		},
		/**
		 * 添加弹窗的显示或隐藏
		 * @param {Boolean} 显示或者隐藏
		 */
		addShowAndHide(state) {
			this.addDialog = state
			if (!state) {
				this.$refs.clickAdd.close()
			}
		},
		/**
		 * 修改弹窗的显示或隐藏
		 * @param {Boolean} 显示或者隐藏
		 */
		reviseShowAndHide(state) {
			this.reviseDialog = state
			if (!state) {
				this.$refs.clickRevise.close()
			}
		},
		/**
		 * 触发模糊搜索框的焦点并弹窗
		 */
		focusSearch() {
			this.searchSelectHide = true
		},
		/**
		 * 触发搜索的焦点
		 * @param {String} key 当前key
		 * @param {String} idK id的key
		 */
		focus(key, idK) {
			this.$set(this.searchTreeHide, key, true)
			const obj = this.searchList[key]
			const opendId = obj.opendId
			if (!opendId || !opendId.length) {
				const id = idK ? obj.tree[0][idK] : obj.tree[0].id
				obj.opendId = [id]
			}
		},
		// 添加确认
		addConfirm(res) {
			this.$emit('addConfirm', res)
		},
		// 添加取消
		addInfoCancel() {
			this.$emit('addCancel')
		},
		// 点击添加
		clickAddInfo() {
			this.$emit('clickAdd')
		},
		// 修改取消
		reviseCancel() {
			this.$emit('reviseCancel')
		},
		// 修改确认
		reviseConfirm(res) {
			this.$emit('reviseConfirm', res)
		},
		// 点击修改
		reviseInfo() {
			this.$emit('clickRevise')
		},
		// 点击删除
		clickDelete() {
			this.$emit('clickDelete')
		},
		/**
		 * 点击刷新
		 */
		clickRefresh() {
			this.$emit('clickRefresh')
		},
		// 点击搜索
		query() {
			this.$emit('query', this.searchList)
		},
		// 点击导出
		exportFile() {
			this.$emit('exportFile')
        },
        // 点击导出
		bindingCar() {
			this.$emit('bindingCar')
        },
        // 点击导出
		unbindCar() {
			this.$emit('unbindCar')
        },
		// 点击导入
		upload() {
			this.$emit('upload')
		},
		// 点击树节点
		clickTreeNode(data) {
			this.$emit('clickTreeNode', data)
		},
		// 添加页面的下拉选择
		changeValue(value) {
			this.$emit('selectChangeValue', value)
		},
		// 修改页面的下拉选择
		reviseChangeValue(value) {
			this.$emit('reviseChangeValue', value)
		},
		/**
		 * 点击搜索的树节点
		 */
		handleNodeClick(data, key, showcheck) {
			if (showcheck) {
				this.$emit('searchNodeClick')
				return
			}
			if (data.type == 2 || typeof data.type === 'undefined') {
				this.$set(this.searchTreeHide, key, false)
				this.$emit('searchNodeClick', data, key)
			}
		},
		/**
		 * 搜索树的输入框值改变
		 * @param {Event} ev 输入框的event对象
		 * @param {String} key 当前选项的key值
		 * @param {Boolean} check 是否是复选框树
		 * @param {Boolean} filter 为true的时候不过滤
		 */
		valueChange(ev, key, check, filter) {
			const val = ev.target.value
			// 通过优化输入来尽量减少调用过滤的方法
			if (this.oldVal === val) return
			this.oldVal = val
			setTimeout(() => {
				if (val === this.oldVal) {
					if (!val) {
						this.$emit('searchValChange', key)
						this.$emit('filter', filter)
						this.$set(this.searchTreeHide, key, true)
						if (!check) {
							this.$refs[key][0].setCurrentKey(null)
						}
						this.clear(key, check)
					} else if (val.length >= 2) {
						this.$refs[key][0].filter(val)
					}
				}
			}, 400)
		},
		/**
		 * 树的搜索框清空
		 * @param {String} key 当前选项的key值
		 * @param {Boolean} check 是否是复选框树
		 */
		clear(key, check) {
			if (check) {
				const ids = this.$refs[key][0].getCheckedKeys()
				for (const v of ids.values()) {
					this.$refs[key][0].setChecked(v, false)
				}
				this.$emit('check', [], key)
			} else {
				this.$emit('searchValChange', key)
				this.$refs[key][0].setCurrentKey(null)
			}
			// this.$refs[key][0].filter('');
			const oldTree = getCopyObj(this.searchList[key].tree)
			this.searchList[key].tree = []
			this.$nextTick(() => {
				this.searchList[key].tree = oldTree
			})
		},
    /**
     * 树复选框被选中
     */
		check($event, key) {
			const checkNodeAll = this.$refs[key][0].getCheckedNodes()
			this.$emit('check', checkNodeAll, key)
		},
		/**
		 * 添加或修改弹窗的tree选择事件
		 * @param  {Array} arr 选中的数据
		 * @param  {String} key key字段
		 */
		checkPopup(arr, key) {
			this.$emit('checkPopup', arr, key)
		},
		// 修改的单选
		radioChange(val) {
			this.$emit('radioChange', val)
		},
		// 下拉远程搜索
		remoteMethod(query) {
			this.$emit('remoteMethod', query)
		},
		// 搜索弹框点击的时候
		handleSearchClick(vehPlateNo, vehTerminalNo) {
			this.searchSelectHide = false
			this.$emit('handleSearchClick', vehPlateNo, vehTerminalNo)
		},
		// 清除搜索框的值
		handleClose() {
			this.$emit('handleClose')
		},
		// 复选框改变
		changeCheck(check) {
			this.$emit('changeCheck', check)
		},
		/**
		 * 下拉框选择的时候
		 * @param {String} val 当前选中的值
		 * @param {String} key 当前数据的key
		 */
		changeSelect(val, key) {
			this.$emit('change', val, key)
    },
    /**
     * 点击输入框
     * @param {String} key 当前数据的key
     */
    handleInput(key) {
      this.$emit('handleInput', key)
    }
	}
}
</script>

<style scoped>
.model-input {
	display: flex;
}
.tree-model {
	position: relative;
	width: 220px;
	display: inline-block;
}
.input-max {
	width: 100%;
}
.tree-box {
	position: absolute;
	top: 42px;
	left: -10px;
	z-index: 999999;
	background: #fff;
	width: 240px;
	height: 300px;
	box-shadow: 0 1px 5px #666;
	display: flex;
	flex-direction: column;
}
.dtp-tree {
	flex: 1;
}
.search-select .remove {
	position: absolute;
	top: 0;
	right: 10px;
	font-size: 14px;
	height: 100%;
	align-items: center;
	justify-content: center;
	color: #c0c5cf;
	cursor: pointer;
	display: flex;
}
.search-select .remove:hover {
	color: #999;
}
.search-select input {
	padding-right: 30px !important;
}
</style>
