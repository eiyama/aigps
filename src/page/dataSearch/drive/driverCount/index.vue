<!-- 驾驶行为报表 -->
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
import { getDrivingStatictics } from '@/api/dataSearch/drive'
import exportFile from '@/utils/exportFile'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'driverCount',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('driverCount.searchList'));
    const tableTitle = this.$t('driverCount.tableTitle');
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
      const veh = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      const type = this.searchList.duration.model;
      const data = {
        VehTerminalNo: veh || '',
        Begin: selectTime[0],
        End: selectTime[1],
        Type: type
      };
      getDrivingStatictics(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.creationTime = getDateStr(v.creationTime, true) || '--';
            v.hour = v.hour ||  '--';
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
          sums[index] = '';
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
        exportFile(length, this.$t('driverCount.curTitle'));
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
      this.searchList.vehTerminalNo.id = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
    },
    /**
     * 点击单元格
     * @param {Object} row 当前行的数据
     * @param {Object} column 当前单元格的数据
     */
    handleCell(row, key) {
      var curDate = JSON.stringify(this.curDate);
      let name;
      switch (key) {
        case 'overSpeed':
          name = '/home/dataSearch/overspeed';
          break;
        case 'accelerate':
          name = '/home/dataSearch/acceleration';
          break;
        case 'turn':
          name = '/home/dataSearch/swerve';
          break;
        case 'slowDown':
          name = '/home/dataSearch/deceleration';
          break;
        default:
          name = '/home/dataSearch/fatigueDriving';
      }
      this.$router.push({
        name,
        query: {
          carNum: row.vehPlateNo,
          vehTerminalNo: row.vehTerminalNo,
          code: 'dataQuery',
          curDate,
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
