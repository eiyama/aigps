<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" 
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table :isPageing="false" :spanMethod="spanMethod" :tableData="tableData" :tableTitle="tableTitle"  :summary="getSummaries" @handleCell="getAddress" />
    <el-dialog  class="" title="地图比对（红色：实际线路，绿色：参考线路）" :visible.sync="showMap"   :with-header="false" width="1085px" :center="true"  >
         <my-map 
         :pointArr="pointArr"
          ref="map"/>                      
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTreeRepeatValue, getTodays } from '@/utils/data'
import { getCopyObj, getDecimalN, getDateHMS } from '@/utils/util'
import { DialogAbnormalTrack ,GetMileage,exportMileage} from '@/api/dataSearch/base'
import MyMap from "./components/map";
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message , Dialog } from 'element-ui'

export default {
  name: 'NewMileage',
  components: {
    TabBar,
    MyTable,
    ElDialog : Dialog ,
    MyMap
  },
  data() {
    const searchList = getCopyObj(this.$t('abnormalPath.searchList'));
    const tableTitle = this.$t('abnormalPath.tableTitle');
    return {
      searchList,
      tableTitle,
      tableData: [],
      operButton: {},
      info: [],
      pointArr:[],//传入地图
      pointArray:[],//暂存地图数据
      showMap:false,
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
      this.setInit()
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
      const tactic = this.searchList.tactic.model;
      let tactics = [];
      tactics.push(tactic)
      const begin = selectTime[0];
      const end = selectTime[1];
      if(veh){
        veh = veh.split(',');
      }
      const data = {
        vehTerminalNo: veh[0],
        startTime: begin,
        endTime: end,
        tactics: tactics
      }
      DialogAbnormalTrack(data).then(res => {
        if (res.result) {
          const list = res.result;
          this.pointArray = [];
          for (const v of list.values()) {             
            v.durationSecond = this.getDays(v.durationSecond);            
            v.mileageKm = getDecimalN(v.mileageKm);                 
            v.mileagesCompared = v.mileageCompared == 0 ? "el-icon-minus" : v.mileageCompared == 1 ?  "el-icon-bottom" : "el-icon-top";  
            v.durationSecondsCompared = v.durationSecondCompared == 0 ? "el-icon-minus" : v.durationSecondCompared == 1 ? "el-icon-bottom" : "el-icon-top" ;                      
            v.address = "查看位置";
            v.mileageDiff =  getDecimalN(v.mileageDiff); 
            // v.facilityMileage = (Math.floor(v.facilityEndDistance * 100) - Math.floor(v.facilityStartDistance * 100)) / 100;
            // v.facilityDistance = v.facilityDistance ? Math.floor(v.facilityDistance * 100) / 100 : v.mileage;
            // v
            // v.isgap = v.mileageDiff > this.searchList.distanceGap.model ? '是' :  "否";
            this.pointArray.push(v.lines);
          }
          this.tableData = list;
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
        else if (index === 1 || index === 6 || index === 7) {
          sums[index] = '';
          return;
        }
        let key = column.property;
        const values = data.map(item => +item[key]);
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = +curr;
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = getDecimalN(sums[index]);
        } else {
          sums[index] = '';
        }
      });
      return sums;
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
        this.showMap = true;
        this.pointArr = this.pointArray;
    //   eventBus.$emit('changeMapPop', this.info)
    },
    // 合并单元格
    spanMethod({ row, column, rowIndex, columnIndex }) {
        // console.log(row, column, rowIndex, columnIndex )
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 10) {
          if (rowIndex % 2 === 0 ) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
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
