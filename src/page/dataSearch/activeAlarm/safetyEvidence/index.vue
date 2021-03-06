<!-- 主动安全证据 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile" ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="handleCell" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateStr, getParse } from '@/utils/util'
import { getAlarmRecodeDetailNew, alarmRecodeDetailNewExport } from '@/api/dataSearch/alarm'
import { getDevicerAlarmNew , exportDeviceAlarm} from '@/api/dataSearch/deviceAlarm'
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
      info: [],
      totalCount:0
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
        const res = await getDevicerAlarmNew(data)
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
      let ids = searchList.vehTerminalNo.id || [];
      if(ids){
        ids = ids.split(',');
      }
      const dates = searchList.startEndTime.model
      const handle = this.searchList.handle.model === '' ? null : this.searchList.handle.model == '1' ? true : false;
      const ageerType = searchList.ageerType.model
      let alarmLevel = ageerType ? 0 : this.searchList.alarmLevel.model;
      switch(alarmLevel){
        case "" :
          alarmLevel = 0;
          break;
        case "1级" :
           alarmLevel = 1;
          break;
        case "2级" :
          alarmLevel = 2;
          break;
        default :
          alarmLevel = 0
      }
      // 报警类型，默认全选，如果用户不选择就全选
      const key = ageerType ? 'alarmType2' : 'alarmType'
      const alarmType = searchList[key].id || this.getAlaAllId(key).join()   
      const pageing = this.$refs.table.getPageing();
      let alarmDisplayArr = [];       
      if(alarmType){
        alarmDisplayArr =  alarmType.split(",");
      }
      let data = {
        "vehTerminalNos": ids,
        "startTime": dates[0],
        "endTime": dates[1],
        "alarmCategory": ["视频设备报警"],
        "alarmDisplay": alarmDisplayArr,
        "alarmHandleStatus": handle,  
        "alarmLevel": alarmLevel,       
        "pageOption": {
          "pageIndex": pageing.curPage,
          "pageSize": pageing.limit,
          "total": pageing.totalCount
        }
      }
      return data
    }, 
    /**
     * 静态改变数据
     */
    changeInfo() {      
      const pageing = this.$refs.table.getPageing();
      const start = (pageing.curPage - 1) * pageing.limit;
      const list = getCopyObj(this.tableDataAll.getDeviceAlarmNewDtos);
      const i18n = this.$t('otherText');
      for (const v of list.values()) {
        v.address = this.$t('button.queryAddress');
        v.endAddress = v.endAddress;
        v.stm = getDateStr(v.gpsStartTime);
        v.etm = getDateStr(v.gpsEndTime);  
        v.alarmDuration = this.getDays(v.alarmDurationSeconds);
        v.devIdno = v.vehPlateNo;     
        v.vehResoure = v.alarmCatogery;
        v.alarmLevel = getParse(v.extensionData).GpsAlarmLevel;
        v.act = getParse(v.extensionData).GpsAlarmLevel === '2级';
        if(v.alarmHandleInfo){
            v.hdt = getDateStr(v.alarmHandleInfo.alarmHandleTime);
            v.alarmHandleContent = v.alarmHandleInfo.alarmHandleContent || '';
            v.alarmHandlerName = v.alarmHandleInfo.alarmHandlerName || '';
            v.alarmStatus = v.alarmHandleInfo.alarmHandleStatus; 
            v.isHd = v.alarmHandleInfo.alarmHandleStatus ? this.$t('otherText.handleYes') : `${this.$t('otherText.handleNo')}，${this.$t('button.clickHandle')}`;                
        }else{
          v.alarmStatus = false; 
          v.isHd = `${this.$t('otherText.handleNo')}`;
        } 
        const extensionData = getParse(v.extensionData);
        v.guid = extensionData.guid;    
        v.dptName = v.departmentName;
      }    
      this.tableData = list;
      const totalCount = this.tableDataAll.pageOption.total;
      this.totalCount = totalCount;
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
          name: row.endAddress,
          lng: row.gcj02EndCoordinate.lng,
          lat: row.gcj02EndCoordinate.lat
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
      let Opt = this.getOpt();
       
      let data = {
      "vehTerminalNos": Opt.vehTerminalNos,
      "startTime": Opt.startTime,
      "endTime": Opt.endTime,
      "alarmCategory": Opt.alarmCategory,
      "alarmDisplay": Opt.alarmDisplay,
      "alarmHandleStatus": Opt.alarmHandleStatus,
      "alarmLevel":  0,  
      "alarmDuration": 0
    }   
      try {
        const res = await exportDeviceAlarm(data);
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
