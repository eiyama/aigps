<template>
	<popup-view
		:isShow.sync="isShow"
		:isZoom="false"
		:css="{ width: '80%', height: '400px' }"
		@handClose="handleClose"
	>
		<div class="content">
			<el-table
			    ref="table"
			    border
			    :data="tableData"
			    height="100%" 
			    size="mini"
		        highlight-current-row
		        style="flex: 1;"
		        @handleClose="handleClose"
		    >
		      	<el-table-column align="center" v-for="(v, index) in tableTitle" :label="v.label" :key="index">
			      	<el-table-column align="center" v-for="(item, j) in v.children" :prop="item.prop" :min-width="item.width" :label="item.label" :key="j" :sortable="!!item.sort" ></el-table-column>
			    </el-table-column> 	
		    </el-table>
		</div>
	</popup-view>
</template>

<style lang="scss" scoped>
.content {
	flex: 1;
	background: #fff;
	padding: 20px;
	display: flex;
  	flex-direction: column;
  	overflow: hidden;
  	box-sizing: border-box;
}
</style>

<script>
	import { Table, TableColumn, Form, FormItem } from 'element-ui'
	import PopupView from '@/components/map/PopupView'

	import { getOnLineRate } from '@/api/index'
	import { getDecimalN } from '@/utils/util'

	export default {
		name: 'HistoryOnline',
		components: {
			ElTable: Table,
			ElTableColumn: TableColumn,
			ElForm: Form,
			ElFormItem: FormItem,
			PopupView
		},
		data() {
			const tableTitle = this.$t('home.historyOnlineTableTitle')
			return {
				isShow: false,
				tableTitle,
				tableData: []
			}
		},
		methods: {
			handleClose() {
				this.tableData = []
			},
			initData() {
				const { isShow } = this
				if (isShow) return
				this.isShow = true
				this.requestInfo()
			},
			async requestInfo() {
				try {
					const res = await getOnLineRate()
					const { result } = res
					const obj = {}
					for (const [k, v] of Object.entries(result)) {
						for (const [j, e] of Object.entries(v)) {
							if (j === 'rate') {
								e = `${getDecimalN(e * 100)}%`
							}
							obj[`${k}${j}`] = e
						}
					}
					this.tableData = [obj]
				} catch(err) {
					this.tableData = []
				}
			}
		}
	}
</script>
