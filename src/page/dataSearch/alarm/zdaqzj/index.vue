<!-- 主动安全证据 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile" ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="changeInfo" @handleCell="handleCell" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateStr, getParse } from '@/utils/util'
import { getAlarmRecodeDetailNew, alarmRecodeDetailNewExport } from '@/api/dataSearch/alarm'
import exportFile from '@/utils/exportFile'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Zdaqzj',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('zdaqzj.searchList'))
    const tableTitle = this.$t('zdaqzj.tableTitle')
    return {
      searchList,
      tableTitle,
      tableData: [],
      tableDataAll: [],
      operButton: {},
      info: []
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

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
      this.setInit()
    } catch(err) {

    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const hasOpt = this.hasOpt()
      if (!hasOpt) {
        return
      }
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo()
    },
    /**
     * 请求数据
     */
    async requestInfo() {
      const data = this.getOpt()
      try {
        const res = await getAlarmRecodeDetailNew(data)
        this.tableDataAll = res.result || []
        this.changeInfo()
      } catch(err) {

      }
    },
    /**
     * 校验参是是否通过
     * @return {[Object|Boolean]} 校验通过返回true，不通过反回false
     */
    hasOpt() {
      const { searchList } = this
      const dates = searchList.startEndTime.model
      if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'))
        return false
      }
      return true
    },
    /**
     * 获取请求参数
     * @return {Object} data 返回一个Object
     */
    getOpt() {
      const { searchList } = this
      const ids = searchList.vehTerminalNo.id || ''
      const dates = searchList.startEndTime.model
      const handle = searchList.handle.model
      const ageerType = searchList.ageerType.model
      const alarmLevel = ageerType ? '' : searchList.alarmLevel.model
      // 报警类型，默认全选，如果用户不选择就全选
      const key = ageerType ? 'alarmType2' : 'alarmType'
      const alarmType = searchList[key].id || this.getAlaAllId(key).join()
      const data = {
        vehTerminalNos: ids,
        beginDateTime: dates[0],
        endDateTime: dates[1],
        alarmDisplays: alarmType,
        alaStatus: handle,
        alarmLevel
      }
      return data
    },
    /**
     * 静态改变数据
     */
    changeInfo() {
      const pageing = this.$refs.table.getPageing();
      const start = (pageing.curPage - 1) * pageing.limit;
      const list = getCopyObj(this.tableDataAll.slice(start, start + pageing.limit));
      for (const v of list.values()) {
        v.address = this.$t('button.queryAddress');
        v.stm = getDateStr(v.gpsAlarmStartTime);
        v.etm = getDateStr(v.gpsAlarmEndTime);
        v.alarmDuration = this.getDays(v.alarmDuration);
        v.devIdno = v.vehPlateNo;
        v.alarmType = v.alarmValue;
        v.act = v.alarmLevel === '2级';
        v.isHd = v.alarmStatus ? this.$t('otherText.handleYes') : this.$t('otherText.handleNo');
        if (!v.alarmStatus) v.alarmHandleTime = '';
        v.hdt = getDateStr(v.alarmHandleTime);
        const extensionData = getParse(v.extensionData);
        v.guid = extensionData.guid;
      }
      this.tableData = list;
      const totalCount = this.tableDataAll.length;
      const obj = {
        isShow: false,
        totalCount
      }
      this.$nextTick(() => {
        this.$refs.table.setPageing(obj)
      })
    },
    /**
     * 获取报警的全部id
     * @return arr 返回一个数组
     */
    getAlaAllId(key, tree) {
      let arr = [];
      if (!tree) {
        tree = this.searchList[key].tree;
      }
      for (const v of tree.values()) {
        if (v.type == 2) {
          arr.push(v.id);
        } else {
          if (v.options.length) {
            arr = [...arr, ...this.getAlaAllId(key, v.options)];
          }
        }
      } 
      return arr;
    },
    /**
     * 查看当前位置
     */
    handleCell(row, key) {
      if (key === 'address') {
        this.info = [];
        const startObj = {
          title: row.vid,
          name: row.vehPlateNo,
          lng: row.gpsStartWebLng,
          lat: row.gpsStartWebLat
        }
        this.info.push(startObj);
  
        eventBus.$emit('changeMapPop', this.info);
      } else if (key === 'act' && row[key]) {
        const obj = getCopyObj(row);
        // 这里不需要处理功能
        obj.alarmStatus = true;
        eventBus.$emit('handleAct', obj);
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
     * 点击导出
     */
    async exportFile() {
      const hasOpt = this.hasOpt()
      if (!hasOpt) {
        return
      }
      const data = this.getOpt()
      try {
        const res = await alarmRecodeDetailNewExport(data)
        const blob = new Blob([res])
        const fileName = `${this.$t('zdaqzj.curTitle')}.xlsx`
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
     * 搜索的树复选框选中
     */
    check(res, key) {
      var arr = [];
      var arr2 = [];
      for (let v of res.values()) {
        // 车牌号
        if (key == 'vehTerminalNo') {
          const ttxVehicleCfg = v.ttxVehicleCfg || {};
          // 是否是视频设备
          if (v.type == 2 && ttxVehicleCfg.isVideoDevice) {
            arr.push(v.vehTerminalNo);
            arr2.push(v.name);
          }
        } 
        // 报警类型
        else if (key == 'alarmType' || key == 'alarmType2') {
          if (v.type == 2) {
            arr.push(v.id);
            arr2.push(v.label);
          }
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList[key].id = arr.join();
      this.searchList[key].model = arr2.join();
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
