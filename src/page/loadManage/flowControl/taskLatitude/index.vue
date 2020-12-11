<!-- 任务纬度报表 -->
<template>
  <div class="content">
    <tab-bar
      ref="tabBar"
      :searchList="searchList"
      :operButton="operButton"
      :listLi="listLi"
      :reviseTitle="reviseTitle"
      :rules="rules"
      @upload="handleUpload"
      @query="query"
      @check="check"
      @clickTreeNode="handleNodeClick"
      @clickAdd="clickAdd"
      @addConfirm="addConfirm" 
      @clickRevise="clickRevise"
      @reviseConfirm="reviseConfirm"
      @clickDelete="clickDelete"
      @exportFile="exportFile"
      @change="changeSelect"
    />
    <my-table
      isCheck ref="table"
      :tableData="tableData"
      :tableTitle="tableTitle"
       @request="requestInfo"
      @handleCell="handleBtn"
    />

    <!-- 导入弹窗 -->
    <popup ref="popup" />

    <!-- 审核设置 -->
    <set-examine :row="curNode" ref="setExamine" @handleConfirm="handleSetExamine" />

    <!-- 审核 -->
    <examine ref="examine" @handleExamine="handleExamine" />
    
    <!-- 部门审核提交 -->
    <examine-submit :curNode="curNode" ref="examineSubmit" @checkOperator="checkOperator" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { Message, MessageBox } from 'element-ui'
import Popup from './components/popup'
import SetExamine from './components/SetExamine'
import Examine from './components/Examine'
import ExamineSubmit from './components/ExamineSubmit'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

import { getDepartmentAll } from '@/api/sysetsmM/dpt'
import { getQueryFlowControlTaskPage, updateFlowContrlTask, deleteFlowContrlTask, getExcel, getDptAll, addFlowContrTask } from '@/api/loadManage/flowControl'
import { getOperButton, getTreeRepeatValue, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDecimalN, getDateStr, unique } from '@/utils/util'
import { rule } from '@/utils'

export default {
  name: 'TaskLatitude',
  components: {
    TabBar,
    MyTable,
    Popup,
    SetExamine,
    Examine,
    ExamineSubmit
  },
  data() {
    const msg = this.$t('taskLatitude.rules')
    const rules = {
      vehPlateNo: rule('isEmpty', msg.vehPlateNo),
      loadAreaCode: rule('isEmpty', msg.loadAreaCode, false, 'change'),
      unLoadAreaCode: rule('isEmpty', msg.unLoadAreaCode, false, 'change')
    }
    const searchList = getCopyObj(this.$t('taskLatitude.searchList'))
    const listLi = getCopyObj(this.$t('taskLatitude.listLi'))
    const tableTitle = this.$t('taskLatitude.tableTitle')
    const reviseTitle  = this.$t('taskLatitude.reviseTitle')
    return {
      searchList,
      listLi,
      tableTitle,
      reviseTitle,
      tableData: [],
      operButton: {},
      info: [],
      curNode: {},
      rules
    }
  },
  watch: {
  	searchList: {
	    deep: true,
      handler(newVal, oldVal) {
      	const { $refs } = this
      	if (!$refs.table) return
        const pageing = {
          isShow: true,
          perTableCount: {},
          totalCount: 0,
          curPage: 1
      	}
      	this.$refs.table.setPageing(pageing)
    	}
	  }
	},
  computed: {
    ...mapGetters([
      'menuTree',
      'userInfo'
    ])
  },
  async created() {
    const { $route, $store, menuTree, searchList, listLi } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
    this.operButton.isImport = true
    this.getDptAll()
    this.getDepartmentAll()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehPlateNo.tree = tree
      listLi.vehPlateNo.tree = tree
    } catch(err) {

    }
    this.query()
  },
  methods: {
  	/**
		 * 请求部门数据
		 */
    async getDepartmentAll () {
      const { userInfo, $refs, searchList } = this
      try {
        const res = await getDepartmentAll({ id: userInfo.id })
        if (res.result) {
          const tree = res.result.items
          $refs.popup.setDptNameTree(tree)
          $refs.setExamine.setDptNameTree(tree)
        }
      } catch (err) { }
    },
    /**
     * 获取围栏
     */
    async getDptAll() {
      try{
       const res = await getDptAll(3)
       const { listLi } = this
       listLi.loadAreaCode.list = res.result
       listLi.unLoadAreaCode.list = res.result
      } catch(err) {

      }
    },
    /**
     * 查询
     */
    query() {
      const { $refs } = this
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      $refs.table.setPageing(pageing)
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    async requestInfo() {
    	const { searchList, $refs, listLi } = this
    	const { taskSource, scheduling, isWeight } = listLi
      const vehs = searchList.vehPlateNo.model
      const deliveryTime = searchList.deliveryTime.model
      const isCompeleted = searchList.isCompeleted.model;
      const pageing = $refs.table.getPageing()
      const { curPage, limit, totalCount } = pageing
      const data = {
        vehPlateNo: vehs,
        deliveryTime,
        isCompeleted,
        pageOptions: {
        	pageIndex: curPage,
        	pageSize: limit,
        	total: totalCount
        }
      }
      try {
      const res = await getQueryFlowControlTaskPage(data)
      const list = res.result.flowControlTaskList
      const mapping = this.$t('taskLatitude.mapping')
      const btns = this.$t('taskLatitude.buttons')
      for (const v of list.values()) {
        v.dueDeliveryTime = getDateStr(v.dueDeliveryTime)
        v.dueArrivalTime = getDateStr(v.dueArrivalTime)
      	v.deliveryTime = getDateStr(v.deliveryTime)
      	v.arrivalTime = getDateStr(v.arrivalTime)
      	v.createTime = getDateStr(v.createTime)
        v.handBtn = btns.event
        v.handDetails = btns.dateils
        v.setBtn = v.isCheck ? btns.audit : btns.auditSettings
        const taskSourceObj = taskSource.list.find(e => e.label === v.taskSource)
        v.taskSourceNew = taskSourceObj ? taskSourceObj.value : ''

        v.isAbnormalNew = mapping.isAbnormal[v.isAbnormal]

        const schedulingObj = scheduling.list.find(e => e.label === v.scheduling)
        v.schedulingNew = schedulingObj ? schedulingObj.value : ''

        v.auditJudgeNew = mapping.auditJudge[v.auditJudge]

        const isWeightObj = isWeight.list.find(e => e.label === v.isWeight)
        v.isWeightNew = isWeightObj ? isWeightObj.value : ''

        v.systemFirstAuditNew = mapping.systemFirstAudit[v.systemFirstAudit]

        v.auditProgressNew = mapping.auditProgress[v.auditProgress]

        const packageObj = listLi.package.list.find(e => e.label === v.package)
        v.packageNew = packageObj ? packageObj.value : ''
      }
      this.tableData = list
      const { total } = res.result.pageOptions
      const pageing = {
        totalCount: total,
        isShow: false 
      }
      $refs.table.setPageing(pageing)
      } catch(err) {

      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
    	const { searchList } = this
      var arr = []
      var arr2 = []
      for (let [index, elem] of res.entries()) {
        if (elem.type == 2) {
          arr.push(elem.vehTerminalNo)
          arr2.push(elem.name)
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr))
      arr2 = Array.from(new Set(arr2))
      searchList.vehPlateNo.id = arr.join()
      searchList.vehPlateNo.model = arr2.join()
    },
    /**
     * 点击导入
     */
    handleUpload() {
    	const { $refs } = this
    	$refs.popup.setState(true)
    },
    /**
     * 修改弹窗的tree勾选事件
     */
    handleNodeClick(data) {
      if (data.type === 2) {
        const { listLi } = this
        listLi.vehPlateNo.id = data.vehTerminalNo
        listLi.vehPlateNo.model = data.name
      }
    },
    /**
     * 复选框选中的时候
     */
    changeSelect(val, key) {
      const { listLi } = this
      if (key === 'loadAreaCode' || key === 'unLoadAreaCode') {
        const list = listLi[key].list
        const v = list.find(e => e.id === val)
        listLi[key].name = v ? v.markName : ''
      }
    },
    /**
     * 点击添加
     */
    clickAdd() {
      const { $refs, listLi } = this
      for (const [k, v] of Object.entries(listLi)) {
        if (v.hasOwnProperty('disabled')) {
          v.disabled = false
        }
      }
      $refs.tabBar.addShowAndHide(true)
    },
    /**
     * 点击添加确认
     */
    async addConfirm() {
      const { $refs, listLi } = this
      const data = {}
      for (const [k, v] of Object.entries(listLi)) {
        data[k] = v.model
      }
      const msg = this.$t('taskLatitude.error')
      if (data.loadAreaCode === data.unLoadAreaCode) {
        Message.error(msg.areaCode)
        return
      }
      data.loadArea = listLi.loadAreaCode.name
      data.unLoadArea = listLi.unLoadAreaCode.name
      data.vehNo = listLi.vehPlateNo.id
      try {
        const res = await addFlowContrTask(data)
        $refs.tabBar.addShowAndHide(false)
        Message({
          message: this.$t('success.add'),
          type: 'success'
        })
        this.requestInfo()
      } catch(err) {

      }
    },
    /**
     * 点击修改
     */
    clickRevise() {
      const { $refs, listLi, tableData } = this
      for (const [k, v] of Object.entries(listLi)) {
        if (v.hasOwnProperty('disabled')) {
          v.disabled = true
        }
      }

      const num = tableData.reduce((total, v) => {
        if (v.check) {
          this.curNode = v
          total ++
        }
        return total
      }, 0)
      if (num !== 1) {
        Message.error(this.$t('error.noData'))
        return
      }
      $refs.tabBar.reviseShowAndHide(true)
      for (const k of Object.keys(listLi)) {
        if (this.curNode.hasOwnProperty(k)) {
          listLi[k].model = this.curNode[k]
        }
      }
    },
    /**
     * 确认修改
     */
    async reviseConfirm() {
      const { curNode, listLi, $refs } = this
      const data = {
        id: curNode.id,
        vehPlateNo: '',
        loadArea: '',
        unLoadArea: ''
      }
      for (const k of Object.keys(data)) {
        if (listLi.hasOwnProperty(k)) {
          data[k] = listLi[k].model
        }
      }

      try {
        const res = await updateFlowContrlTask(data)
        $refs.tabBar.reviseShowAndHide(false)
        this.requestInfo()
        Message({
          message: this.$t('success.revise'),
          type: 'success'
        })
      } catch(err) {

      }
    },
    /**
     * 点击删除
     */
    async clickDelete() {
      const ids = this.tableData.reduce((arr, v) => {
        if (v.check) {
          arr.push(v.id)
        }
        return arr
      }, [])
      if (!ids.length) {
        Message.error(this.$t('error.noData'))
        return
      }
      try {
        await MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
        await deleteFlowContrlTask(ids.join())
        this.requestInfo()
        Message({
          type: 'success',
          message: this.$t('success.delete')
        })
      } catch(err) {

      }
    },
    /**
     * 导出excel表格
     */
    async exportFile() {
      try {
        await getExcel()
      } catch(err) {

      }
    },
    /**
     * 点击表格单元格
     * @param  {Object} row 当前行的数据
     */
    handleBtn(row, key) {
      const { $router, $refs } = this
      this.curNode = row
      if (key === 'handBtn') {
        const opt = {
          path: '/home/loadManage/taskEvent',
          query: {
            veh: row.vehNo,
            vehPlateNo: row.vehPlateNo
          }
        }
        $router.push(opt)
      } else if (key === 'setBtn' && !row.isCheck) {
        $refs.setExamine.setState(true, row)
      } else if (key === 'setBtn' && row.isCheck) {
        $refs.examine.setState(true, row)
      } else if (key === 'handDetails') {
        const opt = {
          path: '/home/loadManage/loadDetails',
          query: {
            veh: row.vehNo,
            vehPlateNo: row.vehPlateNo
          }
        }
        $router.push(opt)
      }
    },
    /**
     * 审核设置添加成功
     */
    handleSetExamine(id) {
      const { tableData } = this
      const i = tableData.findIndex(e => e.id === id)
      if (i > -1) {
        const btns = this.$t('taskLatitude.buttons')
        tableData[i].isCheck = true
        this.$set(tableData[i], 'setBtn', btns.audit)
      }
    },
    /**
     * 点击审核页面部门的审核按钮
     * @return {Object} v 部门审核信息
     */
    handleExamine(v) {
      const { $refs } = this
      $refs.examineSubmit.setState(true, v)
    },
    /**
     * 部门审核成功之后将审核信息里面的对应部门修改为已审核
     */
    checkOperator(id) {
      const { $refs } = this
      $refs.examine.checkOperator(id)
    }
  }
}
</script>

<style scoped>
.content {
  flex: 1;
  padding: 22px 0 0 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  position: relative;
}
</style>
