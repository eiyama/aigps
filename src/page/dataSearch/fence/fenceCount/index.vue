<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" showSummary :summary="getSummaries" @handleCell="handleCell" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateStr } from '@/utils/util'
import { getFanceAlarm } from '@/api/dataSearch/fence'
import exportFile from '@/utils/exportFile'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'FenceCount',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('fenceCount.searchList'));
    const tableTitle = this.$t('fenceCount.tableTitle');
    return {
      searchList,
      tableTitle,
      tableData: [],
      operButton: {},
      curDate: []
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
    } catch(err) {

    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const selectTime = this.searchList.startEndTime.model;
      if (!selectTime || !selectTime.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const veh = this.searchList.vehTerminalNo.vehTerminalNo;
      const selectTime = this.searchList.startEndTime.model;
      const data = {
        vehTerminalNo: veh || '',
        beginDateTime: selectTime[0],
        endDateTime: selectTime[1]
      }
      getFanceAlarm(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.startTime = getDateStr(v.beginDateTime);
            v.endTime = getDateStr(v.endDateTime);
            v.fanceOverSpeedCount = v.fanceOverSpeedCountObject ? v.fanceOverSpeedCountObject.count : 0;
            v.fanceStopCarCount = v.fanceStopCarCountObject ? v.fanceStopCarCountObject.count : 0;
            v.inFanceCount = v.inFanceCountObject ? v.inFanceCountObject.count : 0;
            v.outFanceCount = v.outFanceCountObject ? v.outFanceCountObject.count : 0;
          }
          this.tableData = list;
          // 记录请求的时间范围，用来跳转其他页面用
          this.curDate = getCopyObj(selectTime);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 合计
     */
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('otherText.total');
          return;
        }
        const values = data.map(item => item[column.property]);
        if (values.every(value => typeof value === 'number')) {
          sums[index] = values.reduce((prev, curr) => {
            return prev + curr;
          }, 0);
          sums[index] += ' ' + this.$t('otherText.second');
        } else {
          sums[index] = ' ';
        }
      });
      return sums;
    },
    /**
     * 点击导出
     */
    exportFile() {
      const length = this.tableData.length;
      if (length) {
        exportFile(length, this.$t('fenceCount.curTitle'));
      } else {
        Message.error(this.$t('otherText.msgExport'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      let arr = [];
      let arr2 = [];
      for (const v of res.values()) {
        if (v.type == 2) {
          arr.push(v.vehTerminalNo);
          arr2.push(v.name);
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.vehTerminalNo.vehTerminalNo = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
    },
    /**
     * 点击单元格
     * @param {Object} row 当前行的数据
     * @param {Object} key 当前单元格key
     */
    handleCell(row, column) {
      const curDate = JSON.stringify(this.curDate);
      let alaType;
      switch (key) {
        case 'inFanceCount':
          alaType = '10001';
          break;
        case 'outFanceCount':
          alaType = '10002';
          
          break;
        case 'fanceOverSpeedCount':
          alaType = '10004';
          
          break;
        case 'fanceStopCarCount':
          alaType = '10003';         
          break;
        default:
          alaType = '10005';          
      }
      this.$router.push({
        name: '/home/dataSearch/area',
        query: {
          carNum: row.plateNo,
          vehTerminalNo: row.vehTerminalNo,
          alaType,
          code: 'dataQuery',
          curDate
        }
      });
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
