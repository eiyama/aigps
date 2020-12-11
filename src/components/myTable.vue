<template>
  <div class="table-box">
    <el-table :id="id" stripe ref="table"  border :data="tableData" :height="height" size="mini" :show-summary="showSummary" :summary-method="summary"
      :span-method="spanMethod" highlight-current-row @select="changeCheck" @select-all="selectAll" @cell-dblclick="handleCelldbl"  @row-click="handleRow" @row-dblclick="rowDblclick" style="flex:1;">
      <el-table-column v-if="!!tableMoreConList.length" type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item v-for="(item,key) in tableMoreConList" :key="key" :label="item.label">
              <span>{{ props.row[item.prop] }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column v-if="isCheck" align="center" width="80" type="selection" />
      <el-table-column v-else align="center" :label="$t('otherText.index')" width="80" type="index" :index="setIndex || indexMethod" />
      <el-table-column align="center" v-for="(v,index) in tableTitle" :prop="v.prop" :min-width="v.width" :label="v.label" :key="index" :sortable="!!v.sort" > 
        <template slot-scope="scope">
          <span v-if="!!v.click" @click.stop="handleCell(scope.row, v.prop)" class="select-color">
            {{ scope.row[v.prop] }}
          </span>
          <span v-else-if="!!v.isButton && scope.row[v.prop]" @click.stop="handleCell(scope.row, v.prop)" class="select-color">
            {{ scope.row[v.prop] }}
          </span>
          <span v-else-if="!!v.act" @click.stop="handleCell(scope.row, v.prop)" :class="[scope.row[v.prop] ? 'select-color' : 'msg-color', v.icon || 'icon-yanjing']" class="iconfont"></span>           
          <span v-else-if="!!v.icon" ><i  :class="scope.row[v.prop]"></i> </span>           
          <span v-else>{{ scope.row[v.prop] }}</span>
          
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="isPageing">
      <el-pagination :disabled="pageing.isShow" class="pagination el-input--mini" :page-sizes="pageSize" :page-size="pageing.limit" @current-change="changePage"
        @size-change="changeSize" :layout="layout" :total="pageing.totalCount"></el-pagination>
    </div>
  </div>
</template>

<style scoped>
.table-box {
  padding: 25px 0 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}
.table-box >>> .el-table button {
  width: 100%;
}
.table-box >>> .el-icon-bottom:before{
  color: red;
}
.table-box >>> .el-icon-top , .el-icon-bottom{
  font-weight: bold;
}
.table-box >>> .el-icon-top:before{
  color: #44b549;
}
.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
.iconfont {
  font-size: 20px;
}
.select-color {
  cursor: pointer;
}
</style>

<script>
import { Table, TableColumn, Form, FormItem, Pagination } from 'element-ui'

export default {
  name: 'MyTable',
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElForm: Form,
    ElFormItem: FormItem,
    ElPagination: Pagination
  },
  data() {
    const pageing = {
      curPage: 1,
      limit: 50,
      totalCount: 0,
      perTableCount: {},
      isShow: false
    }
    return {
      pageing
    }
  },
  updated : function(){
      this.$nextTick(function(){
          this.$refs['table'].doLayout()
            //在下次 DOM 更新循环结束之后执行这个回调。在修改数据之后立即使用这个方法，获取更新后的DOM.          
      })
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    isPageing: {
      type: Boolean,
      default: true
    },
    tableTitle: {
      type: Array,
      default: () => []
    },
    tableMoreConList: {
      type: Array,
      default: () => []
    },
    isCheck: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Array,
      default: () => ['50', '80', '100']
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summary: {
      type: [Function, Object],
      default: null
    },
    spanMethod: {
      type: [Function, Object],
      default: null
    },
    setIndex: {
      type: [Function, Object],
      default: null
    },
    height: {
      type: String,
      default: '100%'
    },
    id: {
      type: String,
      default: 'out-table'
    }
  },
  methods: {
    indexMethod(index) {
      return (this.pageing.curPage - 1) * this.pageing.limit + index + 1
    },
    /**
     * 返回分页参数
     */
    getPageing() {
      return this.pageing
    },
    setPageing(pageing) {
      for (const [k, v] of Object.entries(pageing)) {
        this.pageing[k] = v
      }
    },
    /**
     * 改变页码
     * @param {Number} curPage 要改变的当前页码
     */
    changePage(curPage) {
      this.$set(this.pageing, 'curPage', curPage)
      this.$emit('request')
    },
    /**
     * 改变条数
     * @param {Number} pageSize 要改变的每页条数
     */
    changeSize(pageSize) {
      this.$set(this.pageing, 'limit', pageSize)
      this.$set(this.pageing, 'curPage', 1)
      this.$set(this.pageing, 'totalCount', 0)
      this.$emit('request')
    },
    // 双击行
    handleCelldbl(row){    
      // if (this.tableMoreConList.length) {
      //   this.$refs.table.toggleRowExpansion(row);
      // }      
      this.$emit('handleCelldbl', row);
    },
    /**
     * 单击行
     * @param {Object} row 当前行的数据
     */
    handleRow(row) {
      // 有复选框勾选或取消复选框，反之有展开更多就展开或收缩更多
      if (this.isCheck) {
        this.$refs.table.toggleRowSelection(row);
        row.check = !row.check;
      } else {
        if (this.tableMoreConList.length) {
          this.$refs.table.toggleRowExpansion(row);
        }
      }
      this.$emit('handleRow', row);
    },
    /**
     * 触发复选框
     */
    changeCheck(selection, row) {
      row.check = !row.check
      this.$emit('select', row)
    },
    /**
     * 触发全选复选框
     */
    selectAll(selection) {
      this.$emit('selectAll', !!selection.length)
    },
    /**
     * 双击表格某一行
     */
    rowDblclick(row, event, column) {
      // 有复选框且有更多展示的时候双击展开更多
      if (this.isCheck && this.tableMoreConList.length) {
        this.$refs.table.toggleRowExpansion(row);
      }
    },
    /**
     * 点击自定义单元格
     */
    handleCell(row, prop) {
      this.$emit('handleCell', row, prop);
    }
  }
}
</script>