<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" showSummary :summary="getSummaries" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTreeRepeatValue, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDecimalN, getDateStr } from '@/utils/util'
import { getReportMileage , GetMileage } from '@/api/dataSearch/base'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Mileage',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('mileage.searchList'));
    const tableTitle = this.$t('newMileage.tableTitle');
    return {
      searchList,
      tableTitle,
      tableData: [],
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

    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree;
      this.setInit();
    } catch(err) {

    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const selectTime = this.searchList.startEndTime.model;
      const veh = this.searchList.vehTerminalNo.vehTerminalNo;
      if (!veh) {
        Message.error(this.$t('error.selectCar'));
        return;
      } else if (!selectTime || !selectTime.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      let veh = this.searchList.vehTerminalNo.vehTerminalNo || [];
      const selectTime = this.searchList.startEndTime.model;
      const begin = selectTime[0];
      const end = selectTime[1];
      if(veh){
        veh = veh.split(',');
      }
      const data = {
        vehTerminalNos: veh,
        startTime: begin,
        endTime: end
      }
      GetMileage(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.mileageStartTime = getDateStr(v.mileageStartTime);
            v.mileageStopTime = getDateStr(v.mileageStopTime);
            v.mileage = getDecimalN(v.mileage);            
            v.facilityMileage = (Math.floor(v.facilityEndDistance * 100) - Math.floor(v.facilityStartDistance * 100)) / 100;
            // v.facilityDistance = v.facilityDistance ? Math.floor(v.facilityDistance * 100) / 100 : v.mileage;
            v.batteryPower = v.batteryPower ? v.batteryPower : '0%';
            v.stopTime = this.getDays(v.portionStayTime);
            v.runTime = this.getDays(v.driveTime);
            v.batteryVoltage = v.batteryVoltage || 0
            v.address = this.$t('button.queryAddress');
          }
          this.tableData = list;
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
        // 车牌号和最后电压与最后电量不计算
        else if (index === 1 || index === 9 || index === 10) {
          sums[index] = '';
          return;
        }
        let key = column.property;
        if (column.property === 'runTime') {
          key = 'driveTime';
        } else if (column.property === 'stopTime') {
          key = 'portionStayTime';
        }
        const values = data.map(item => +item[key]);
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = +curr;
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);

          if (column.property === 'runTime' || column.property === 'stopTime') {
            sums[index] = this.getDays(sums[index]);
          } else {
            sums[index] = getDecimalN(sums[index]);
          }
        } else {
          sums[index] = '';
        }
      });
      return sums;
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
     * 从日月里程报表跳转过来调用此方法获取详情
     */
    setInit() {
      const query = this.$route.query;
      if (!query.startTime || !query.endTime || !query.vehTerminalNo) {
        // 给时间选择框赋值
        this.searchList.startEndTime.model = getTodays();
        return;
      }
      const timeDate = [query.startTime.substring(0, 10), query.endTime.substring(0, 10)];
      this.searchList.startEndTime.model = timeDate;
      const tree = this.searchList.vehTerminalNo.tree;
      this.searchList.vehTerminalNo.model = query.vehPlateNo;
      this.searchList.vehTerminalNo.vehTerminalNo = query.vehTerminalNo;
      const id = getTreeRepeatValue(tree, 'vehTerminalNo', 'id', query.vehTerminalNo);
      if (id) {
        this.$nextTick(() => {
          this.$refs.tabBar.$refs.vehTerminalNo[0].setChecked(id, true);
        });
        this.query();
      }
    },
    /**
     * 查看当前位置
     */
    getAddress(row) {
      this.info = [];
      if (row.driveTime <= 0 || row.portionStayTime <= 0 || row.mileage <= 0) {
        // 证明当天没有运行只有一个点
        const obj = {
          name: row.vehPlateNo,
          lng: row.startGpWebsLng,
          lat: row.startGpWebsLat,
          title: row.vehPlateNo,
          address: row.startAddress
        };
        this.info.push(obj);
      } else {
        // 当天车辆有运行，存在开始与结束两个点
        const startObj = {
          name: this.$t('otherText.startAddress'),
          lng: row.startGpWebsLng,
          lat: row.startGpWebsLat,
          title: row.vehPlateNo,
          address: row.startAddress
        };
        const endObj = {
          name: this.$t('otherText.endAddress'),
          lng: row.endGpsWebLng,
          lat: row.endGpsWebLat,
          title: row.vehPlateNo,
          address: row.endAddress
        };
        this.info.push(startObj);
        this.info.push(endObj);
      }
      eventBus.$emit('changeMapPop', this.info);
    },
    /**
     * 点击导出
     */
    exportFile() {
      if (this.tableData.length) {
        exportFile(this.tableTitle.length, this.$t('mileage.curTitle'));
      } else {
        Message.error(this.$t('otherText.msgExport'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      var arr = [];
      var arr2 = [];
      for (let [index, elem] of res.entries()) {
        if (elem.type == 2) {
          arr.push(elem.vehTerminalNo);
          arr2.push(elem.name);
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.vehTerminalNo.vehTerminalNo = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
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
