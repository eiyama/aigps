<!-- 报警详情 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @searchValChange="searchValChange" @searchNodeClick="handleNode" @check="check">
      <template slot="btns">
        <el-button v-show="isCheck" @click="handleAlarms" type="primary" class="button margin-bottom" size="small">报警处理</el-button>
      </template>
    </tab-bar>
    <my-table ref="table" :isCheck="true" :pageSize="[50, 100, 200, 300,1000]" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="handleCell" @select="changeCheck" @selectAll="selectAll" @handleRow="changeCheck" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays, getTreeRepeatValue } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateStr, unique } from '@/utils/util'
import { isNumber } from '@/utils/validate'
import { getAlarmDetailNew, getAlarmDetailNewExport } from '@/api/dataSearch/deviceAlarm'
import exportFile from '@/utils/exportFile'
import TabBar from '@/components/tabBar'
import MyTable from './components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'AlarmDetails',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('alarmDetails.searchList'))
    searchList.alaType.tree = getCopyObj(this.$t('home.alarmData'))
    const tableTitle = this.$t('alarmDetails.tableTitle')
    return {
      searchList,
      tableTitle,
      tableData: [],
      operButton: {},
      info: [],
      oldData: {},
      isCheck: false
    }
  },
   computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
   watch: {
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
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
  async mounted() {
    eventBus.$on('handleAlaCallback', this.handleAlaCallback)
    eventBus.$on('handleDetails', this.setSearchVal)

    const { $route, $store, menuTree, searchList } = this
    const { path, query } = $route
    this.operButton = getOperButton(menuTree, path)

    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }

    // 证明是从详情页面跳转过来
    if (query.vehPlateNo && query.vehTerminalNo) {
      this.setSearchVal(query)
    } else {
      searchList.startEndTime.model = getTodays()
    }
  },
  beforeDestroy() {
    eventBus.$off('handleAlaCallback', this.handleAlaCallback)
    eventBus.$off('handleDetails', this.setSearchVal)
  },
  methods: {
    /**
     * 监听报警处理成功之后的返回值
     */
    handleAlaCallback() {
      // 刷新数据
      this.requestInfo(this.oldData)
    },
    /**
     * 判断勾选的数据是否有未处理的数据
     * @return {Boolean} 数据里面有未处理的数据返回true，反之false
     */
    hasHandState() {
      return this.tableData.some(v => {
        if (!v.alarmStatus && v.check) return true
      })
    },
    /**
     * 复选框勾选
     */
    changeCheck() {
      this.isCheck = this.hasHandState()
    },
    /**
     * 复选框全部勾选或取消
     * @param {Boolean} isCheck true为全部勾选，false为全部未选
     */
    selectAll(isCheck) {
      for (const v of this.tableData.values()) {
        v.check = isCheck
      }
      this.changeCheck()
    },
    /**
     * 从所有的报警点击查询详情跳转过来给搜索栏赋值
     * @param row 跳转过来所带的当前行的参数
     */
    setSearchVal(row) {
      this.$set(this.searchList.vehTerminalNo, 'ids', row.vehTerminalNo);
      this.$set(this.searchList.vehTerminalNo, 'model', row.vehPlateNo);
      const startEndTime = [row.gpsAlarmStartTime, row.alaTime];
      this.$set(this.searchList.startEndTime, 'model', startEndTime);
      this.$set(this.searchList.alaType, 'model', row.alarmDisplay);
      this.$set(this.searchList.alaType, 'ids', row.alarmValue); 
      this.$set(this.searchList.alaType, 'alarmCategory', row.alarmCategory);
      // const handle = +!(!row.alarmStatus || row.alarmStatus === 'false');
      this.$set(this.searchList.handle, 'model', row.alarmStatus);
      const tree = this.searchList.vehTerminalNo.tree;
      const id = getTreeRepeatValue(tree, 'vehTerminalNo', 'id', row.vehTerminalNo);
      this.$nextTick(() => {
        this.$refs.tabBar.$refs.alaType[0].setChecked(row.alarmValue, true);
        this.$refs.tabBar.$refs.vehTerminalNo[0].setChecked(id, true);
      })
      this.query();
    },
    /**
     * 是否可以请求数据
     * @return {Boolean} true可以请求，false不可以请求
     */
    isRequest() {
      const ids = this.searchList.vehTerminalNo.ids
      const dates = this.searchList.startEndTime.model
      const duration = this.searchList.duration.model
      if (!ids) {
        Message.error(this.$t('error.selectCar'));
        return false
      } else if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'));
        return false
      } else if (duration && !isNumber(duration)) {
        Message.error(this.$t('error.duration'))
        return false
      }
      return true
    },
    /**
     * 获取请求参数
     * @param {Object} 返回一个json
     */
    getData() {
      const { searchList } = this
      const ids = searchList.vehTerminalNo.ids
      const vehPlateNo = searchList.vehTerminalNo.model
      const dates = searchList.startEndTime.model
      // 处理情况
      const handle = searchList.handle.model
      const isAnalysis = searchList.isAnalysis.model
      // 报警类型，默认全选，如果用户不选择就全选
      const duration = searchList.duration.model || 0
      let alarmType = '', alarmCategory = ''
      if (this.searchList.alaType.ids) {
        alarmType = this.searchList.alaType.ids
        alarmCategory = searchList.alaType.alarmCategory
      }
      const pageing = this.$refs.table.getPageing()
      return {
        ids,
        vehPlateNo,
        begin: dates[0],
        end: dates[1],
        alarmType,
        handle,
        alarmCategory,
        duration,
        isAnalysis,
        limit: pageing.limit,
        curPage: pageing.curPage,
        isShow: pageing.isShow
      }
    },
     /**
     * 查询
     */
    query() {
      if (!this.isRequest()) return

      const pageing = {
        curPage: 1,
        totalCount: 0,
        perTableCount: {}
      }
      this.$refs.table.setPageing(pageing);
      this.requestInfo();
    },
    /**
     * 请求数据
     * @param {Object} data 当data参数的时候就使用data
     */
    requestInfo(data) {
      if (!data) data = this.getData()
      getAlarmDetailNew(data).then(res => {
        if (res.result) {
          const list = res.result.alarm || []
          this.oldData = data
          for (const v of list.values()) {
            v.alaTime = getDateStr(v.gpsAlarmEndTime);
            v.gpsAlarmStartTime = getDateStr(v.gpsAlarmStartTime);
            v.alaHandleTime = getDateStr(v.alarmHandleTime);
            v.alarmDuration = this.getDays(v.alarmDuration);
            v.startAddress = this.$t('otherText.startAddress');
            v.endAddress = this.$t('otherText.endAddress');
            v.alaStateText = v.alarmStatus ? this.$t('otherText.handleYes') : `${this.$t('otherText.handleNo')}，${this.$t('button.clickHandle')}`;
          }
          this.tableData = list
          const totalCount = res.result.total
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)

          this.isCheck = false
        }
      })
      .catch(err => {

      });
    },
    /**
     * 转成天-时-分-秒
     */
    getDays(val) {
      if (val <= 0) {
        return '0';
      } else if (!val) {
        return '--';    
      } else {
        return getDateHMS(val, this.$t('otherText'));
      }
    },
    /**
     * 点击单元格
     * @param {Object} row 行数据
     * @param {String} key 当前的key
     */
    handleCell(row, key) {
      this.info = [];
      // 点击开始
      if (key == 'startAddress') {
        const startObj = {
          title: row.vehPlateNo,
          name: row.startAddress,
          lng: row.gpsStartWebLng,
          lat: row.gpsStartWebLat
        };
        this.info.push(startObj);
        eventBus.$emit('changeMapPop', this.info);
      }
      // 点击结束
      else if (key == 'endAddress') {
        const endObj = {
          title: row.vehPlateNo,
          name: row.endAddress,
          lng: row.gpsEndWebLng,
          lat: row.gpsEndWebLat
        };
        this.info.push(endObj);
        eventBus.$emit('changeMapPop', this.info);
      } else if (key == 'alaStateText') {
        eventBus.$emit('handleClick', row);
      }
    },
    /**
     * 点击处理按钮批量处理
     */
    handleAlarms() {
      if (!this.isCheck) {
        Message.error('报警已处理！')
        return
      }
      const data = {}
      const ids = this.tableData.reduce((arr, v) => {
        if (v.check && !v.alarmStatus) {
          arr.push(v.id)
          if (!data.begin) {
            data.begin = v.gpsAlarmStartTime
            data.vehPlateNo = v.vehPlateNo
            data.alarmDisplay = v.alarmDisplay
          }
          data.end = v.alaTime
        }
        return arr
      }, [])
      if (!ids.length) {
        Message.error('请选择要处理的数据！')
        return
      }
      data.ids = ids.join()
      eventBus.$emit('handleClick', data)
    },
    /**
     * 点击导出
     */
    async exportFile() {
      if (!this.isRequest()) return
      const data = this.getData()
      try {
        const res = await getAlarmDetailNewExport(data)
        const blob = new Blob([res])
        const fileName = `${this.$t('alarmDetails.curTitle')}.xlsx`
        // 判断是否ie，true是非ie，否则是ie
        if ('download' in document.createElement('a')) {
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else {
          navigator.msSaveBlob(blob, fileName)
        }
      } catch(err) {

      }
    },
    /**
     * 搜索框树点击节点
     * @param {Object} data 当前节点的数据
     * @param {String} key 当前选项的key
     */
    handleNode(data, key) {
      if (key === 'vehTerminalNo') {
        this.searchList[key].model = data.name;
        this.searchList[key].id = data.vehTerminalNo;
      } else if (key === 'alaType') {
        this.searchList[key].model = data.label;
        this.searchList[key].id = data.id;
        this.searchList[key].alarmCategory = data.parentName;
      }
    },
    /**
     * 树类型搜索框值改变
     * @param {String} key 当前选项的key
     */
    searchValChange(key) {
      this.searchList[key].id = '';
    },
    /**
     * 搜索的树复选框选中
     */
    check(res, key) {
      const { searchList } = this
      const names = []
      const ids = []
      if (key === 'alaType') {
        const newArr = unique(res, 'label')
        const parentNames = [] 
        for (const v of newArr.values()) {
          if (v.type == 2) {
            names.push(v.label)
            ids.push(v.id)
            const i = parentNames.findIndex(e => e === v.parentName)
            if (i === -1) parentNames.push(v.parentName)
          }
        }
        searchList[key].alarmCategory = parentNames.join()
      } else if (key === 'vehTerminalNo') {
        const newArr = unique(res, 'name')
        for (const v of newArr.values()) {
          if (v.type == 2) {
            names.push(v.name)
            ids.push(v.vehTerminalNo)
          }
        }
      }
      // es6的方法去重
      searchList[key].ids = ids.join()
      searchList[key].model = names.join()
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
