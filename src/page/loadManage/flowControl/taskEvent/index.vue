<!-- 任务事件报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'

import { getOperButton, getTodays, getTreeRepeatValue } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateStr, unique } from '@/utils/util'
import { getTaskEvents } from '@/api/loadManage/flowControl'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'TaskEvent',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('taskEvent.searchList'))
    const tableTitle = this.$t('taskEvent.tableTitle')
    return {
      searchList,
      tableTitle,
      tableData: [],
      operButton: {},
      info: []
    }
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
        this.$refs.table.setPageing(pageing);
      }
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  async created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
      this.init()
    } catch(err) {

    }
  },
  methods: {
    /**
     * 判断有无终端号和车牌号传参
     */
    async init() {
      const { $route, searchList } = this
      const { veh, vehPlateNo } = $route.query
      if (!veh || !vehPlateNo) {
        return
      }
      searchList.vehTerminalNo.model = vehPlateNo
      searchList.vehTerminalNo.id = veh
      const tree = this.searchList.vehTerminalNo.tree
        const id = getTreeRepeatValue(tree, 'name', 'id', vehPlateNo)
        if (!id) {
          return
        }
        await this.$nextTick()
        this.$refs.tabBar.$refs.vehTerminalNo[0].setChecked(id, true)
        this.requestInfo()
    },
     /**
     * 查询
     */
    query() {
      const pageing = {
        curPage: 1,
        totalCount: 0,
        perTableCount: {}
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo()
    },
    /**
     * 请求数据
     */
    async requestInfo() {
      const { searchList, $refs } = this
      const veh = searchList.vehTerminalNo.id || ''
      const type = searchList.type.model
      const pageing = $refs.table.getPageing()
      const skipCount = pageing.limit * (pageing.curPage - 1)
      const data = {
        veh,
        type,
        sorting: '',
        skipCount,
        maxCount: pageing.limit
      }
      try {
        const res = await getTaskEvents(data)
        const list = res.result.items
        for (const v of list.values()) {
          const { coordinate, eventTime } = v
          v.eventTime = getDateStr(eventTime)
          v.handAddress = this.$t('button.queryAddress')
          v.gpsWebLng = coordinate.longitude
          v.gpsWebLat = coordinate.latitude
        }
        this.tableData = list
        const totalCount = res.result.totalCount
          const pageing = {
            totalCount,
            isShow: false 
          }
          $refs.table.setPageing(pageing)
      } catch(err) {

      }
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
     * 查看当前位置
     */
    getAddress(row) {
      this.info = []
      const obj = {
        name: row.vehPlateNo || row.venNo,
        lng: row.gpsWebLng,
        lat: row.gpsWebLat,
        address: row.address
      }
      this.info.push(obj)
      eventBus.$emit('changeMapPop', this.info);
    },
    /**
     * 点击导出
     */
    exportFile() {
      const num = this.tableData.length;
      if (num) {
        exportFile(num, this.$t('parkInfo.curTitle'));
      } else {
        Message.error(this.$t('otherText.msgExport'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      const { searchList } = this
      const ids = []
      const names = []
      const list = unique(res, 'vehTerminalNo')
      for (const elem of list.values()) {
        if (elem.type == 2) {
          ids.push(elem.vehTerminalNo)
          names.push(elem.name)
        }
      }
      searchList.vehTerminalNo.id = ids.join();
      searchList.vehTerminalNo.model = names.join();
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
