<!-- 里程日/月报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check" @changeSelect="changeSelect"></tab-bar>
    <my-table  :isPageing="false"  :tableData="tableData" :tableTitle="tableTitle" showSummary :summary="getSummaries" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays ,getYesterday} from '@/utils/data'
import { getCopyObj, getDateHMS, getDecimalN, getDateStr } from '@/utils/util'
import { getReportStatisticMileage , getStatisticMileage , exportStatisticMileage} from '@/api/dataSearch/base'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'DayMonthMileage',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('dayMonthMileageNew.searchList'))
    const tableTitle = this.$t('dayMonthMileageNew.tableTitle')
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
    const { $route, $store, menuTree, searchList  } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
   
    // 给时间选择框赋值
    searchList.startEndTime.model = getYesterday();
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
      var selectTime = this.searchList.startEndTime.model;
      var veh = this.searchList.vehTerminalNo.vehTerminalNo;
      // 统计类型
      const statisticType = 1;
      // const startMonth = this.searchList.startMonth.model;
      // const endMonth = this.searchList.endMonth.model;
      if (!veh) {
        Message.error(this.$t("error.selectCar"));
        return;
      } else if (!selectTime && statisticType === 1) {
        Message.error(this.$t("error.selectTimes"));
        return;
      }  
      this.requestInfo();
    
    },
    /**
     * 请求数据
     */
    requestInfo() {
      let veh = this.searchList.vehTerminalNo.vehTerminalNo || [];
      let begin, end;
      const statisticType = 1;
      if (statisticType === 1) {
        const selectTime = this.searchList.startEndTime.model;
        begin = selectTime[0];
        end = selectTime[1];
      } else {
        begin = this.searchList.startMonth.model || '';
        end = this.searchList.endMonth.model || '';
      }
      if(veh){
        veh = veh.split(",");
      }
      const data = {         
        "vehTerminalNos": veh,
        "startTime": begin,
        "endTime": end
      }
      getStatisticMileage(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {            
            v.startTime = getDateStr(v.startTime);
            v.endTime = getDateStr(v.endTime);
            v.mileage = getDecimalN(v.mileage);            
            v.facilityDistance = getDecimalN(v.facilityDistance);
            v.batteryPower = v.batteryPower || '0%';
            v.runTime = this.getDays(v.driveTimeSeconds);
            v.stopTime = this.getDays(v.stopTimeSeconds);
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
      const self = this;
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('otherText.total');
          return;
        }
        // 车牌号和最后电压与最后电量不计算
        else if (index === 1 || index === 8 || index === 7) {
          sums[index] = '';
          return;
        }
        let key = column.property;         
        if (column.property === 'runTime') {
        //  console.log(123)
        key = "driveTimeSeconds"
        } else if (column.property === 'stopTime') {        
          key = 'stopTimeSeconds';
        }       
        const values = data.map(item => Number(item[key]));            
        if (!values.every(value => isNaN(value))) {
          var sum = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);          
          if (column.property === 'stopTime' || column.property === 'runTime') {    
            console.log(sum)        
            sums[index] = self.getDays(sum);
          } else {
            sums[index] = getDecimalN(sum);
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
   async exportFile() {
      // exportStatisticMileage
       let veh = this.searchList.vehTerminalNo.vehTerminalNo || [];
      let begin, end;
      const statisticType = this.searchList.statisticType.model;
      if (statisticType === 1) {
        const selectTime = this.searchList.startEndTime.model;
        begin = selectTime[0];
        end = selectTime[1];
      } else {
        begin = this.searchList.startMonth.model || '';
        end = this.searchList.endMonth.model || '';
      }
      if(veh){
        veh = veh.split(",");
      }
      const data = {         
        "vehTerminalNos": veh,
        "startTime": begin,
        "endTime": end
      }
     try {
        const res = await exportStatisticMileage(data)
        if(res.result){
          const localHost = (window.location.href).split("/#")[0] + res.result;    
        //   window.location.href = localHost;      
        }                 
      } catch(err) {

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
    },
    /**
     * tabbar的复习框改变的时候
     * @param check checkbox的值
     */
    changeSelect(val, key) {
      this.tableData = [];
      if (val === 1) {
        // 删除报警级别
        this.$set(this.searchList.startEndTime, 'isHide', false);
        this.$set(this.searchList.startMonth, 'isHide', true);
        this.$set(this.searchList.endMonth, 'isHide', true);
      } else {
        this.$set(this.searchList.startEndTime, 'isHide', true);
        this.$set(this.searchList.startMonth, 'isHide', false);
        this.$set(this.searchList.endMonth, 'isHide', false);
      }
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
