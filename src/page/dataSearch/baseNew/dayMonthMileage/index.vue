<!-- 里程日/月报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check" @changeSelect="changeSelect"></tab-bar>
    <my-table id="dayTable" :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" showSummary :summary="getSummaries" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDecimalN, getDateStr } from '@/utils/util'
import { getReportStatisticMileage , getStatisticMileage , exportStatisticMileage } from '@/api/dataSearch/base'
// import exportFile from '@/utils/exportFile';
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
    const searchList = getCopyObj(this.$t('dayMonthMileage.searchList'))
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
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays();
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
      const statisticType = this.searchList.statisticType.model;
      const startMonth = this.searchList.startMonth.model;
      const endMonth = this.searchList.endMonth.model;
      if (!veh) {
        Message.error(this.$t("error.selectCar"));
        return;
      } else if (!selectTime && statisticType === 1) {
        Message.error(this.$t("error.selectTimes"));
        return;
      } else if (statisticType === 2) {
        const startTime = new Date(startMonth).getTime();
        const endTime = new Date(endMonth).getTime();
        if (!startMonth) {
          Message.error('开始月份不能为空！');
          return;
        } else if (!endMonth) {
          Message.error('结束月份不能为空！');
          return;
        } else if (endTime < startTime) {
          Message.error('结束月份不能小于开始月份！');
          return;
        }
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      let veh = this.searchList.vehTerminalNo.vehTerminalNo || [];
      let begin, end;
      const statisticType = this.searchList.statisticType.model;
      if (statisticType === 1) {
        const selectTime = this.searchList.startEndTime.model;
        begin = selectTime[0] ;
        end = selectTime[1];
      } else {
        begin = this.searchList.startMonth.model + '-01' || '';
        end = this.searchList.endMonth.model + '-01' || '';
      }
      if(veh){
        veh = veh.split(",");
      }
      const data = {         
        "vehTerminalNos": veh,
        "startTime": begin ,
        "endTime": end ,
        "StatisticMileageType": statisticType - 1
      }
     
      getStatisticMileage(data).then(res => {
        if (res.result) {
          // res = {"result":[{"vehPlateNo":"皖B50587","date":"2020-11-09","startTime":"2020-11-09T11:45:15+08:00","endTime":"2020-11-09T13:39:45+08:00","startWgs84Coordinate":{"lng":118.25479,"lat":31.229321},"startGcj02Coordinate":{"lng":118.260069,"lat":31.227288},"startAddress":"安徽省芜湖市三山区星火路久顺服饰附近9米","endWgs84Coordinate":{"lng":118.254828,"lat":31.229275},"endGcj02Coordinate":{"lng":118.260107,"lat":31.227242},"endAddress":"安徽省芜湖市三山区星火路久顺服饰附近4米","platformDayMileage":0.00672,"deviceDayMileage":0.6,"driveTimeSeconds":0.0,"stopTimeSeconds":6870.0}],"targetUrl":null,"success":true,"error":null,"unAuthorizedRequest":false,"__abp":true}         
          const list = res.result;
          for (const v of list.values()) {            
            v.startTime = getDateStr(v.startTime);
            v.endTime = getDateStr(v.endTime);
            v.mileage = getDecimalN(v.mileage);            
            v.facilityDistance = getDecimalN(v.facilityDistance);
            v.batteryPower = v.batteryPower || '0%';            
            v.runTime = this.getDays(v.driveTimeSeconds);                  
            if(v.runTime == 0 && v.deviceDayMileage > 0.5 && statisticType === 1){
              let endTime = new Date(end + " 23:59:59");
              let startTime =  new Date(v.startTime);
              let stopTime = v.stopTimeSeconds * 1000;
              let time = (endTime - startTime - stopTime) / 1000;  
              v.runTime = this.getDays(time)                              
            }
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
          lng: row.startWgs84Coordinate.lng,
          lat: row.startWgs84Coordinate.lat,
          title: row.vehPlateNo,
          address: row.startAddress
        };
        this.info.push(obj);
      } else {
        // 当天车辆有运行，存在开始与结束两个点
        const startObj = {
          name: this.$t('otherText.startAddress'),
          lng: row.startWgs84Coordinate.lng,
          lat: row.startWgs84Coordinate.lat,
          title: row.vehPlateNo,
          address: row.startAddress
        };
        const endObj = {
          name:  row.endAddress,
          lng: row.endWgs84Coordinate.lng,
          lat: row.endWgs84Coordinate.lat,
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
    // 前端导出
    //  exportFileExel() {      
    //    const num = this.tableData.length;
    //    const month = new Date().getMonth()
		// 		if (num) {
		// 			exportFile(num, "里程统计报表" + month + '月','dayTable');
		// 		} else {
		// 			Message.error(this.$t('otherText.msgExport'));
    //     }
    // },
    // api导出
  async exportFile() {
      let veh = this.searchList.vehTerminalNo.vehTerminalNo || [];
      let begin, end;
      const statisticType =  this.searchList.statisticType.model;
      if (statisticType === 1) {
        const selectTime = this.searchList.startEndTime.model;
        begin = selectTime[0] ;
        end = selectTime[1];
      } else {
        begin = this.searchList.startMonth.model + '-01' || '';
        end = this.searchList.endMonth.model + '-01' || '';
      }
      if(veh){
        veh = veh.split(",");
      }
      const data = {         
        "vehTerminalNos": veh,
        "startTime": begin,
        "endTime": end, 
        "StatisticMileageType": statisticType - 1     
      }
     try {
        const res = await exportStatisticMileage(data)
        if(res.result){
          const localHost = (window.location.href).split("/#")[0] + res.result;    
          window.location.href = localHost;      
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
