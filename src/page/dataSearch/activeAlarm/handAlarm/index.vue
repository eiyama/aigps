<!-- 安全报警处理 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="handleCell" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays, getTreeRepeatValue } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateStr, getParse, copyToClipboard, getFormatTime, getDecimalN } from '@/utils/util'
import { getAlarmRecodeDetailNew } from '@/api/dataSearch/alarm'
import { getDevicerAlarmNew } from '@/api/dataSearch/deviceAlarm'
import { alarmDetailApp } from '@/api/video'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'HandAlarm',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('handAlarm.searchList'));
    const tableTitle = this.$t('handAlarm.tableTitle');
     
    return {
      searchList,
      tableTitle,
      tableData: [],
      tableDataAll: [],
      operButton: {},
      oldSearch: {},
      info: [],
      totalCount:0
    }
  },
  computed: {
    ...mapGetters([
      'menuTree',
      'jsession'
    ])
  },
  async created() {
     // 监听报警处理成功之后的返回值
    eventBus.$on('handleAlaCallback', this.handleAla);
    
    // 监听从报警页面跳过来
    eventBus.$on('handleDetails', this.init);

    const { $route, $store, menuTree, searchList } = this
    const { path, query } = $route
    this.operButton = getOperButton(menuTree, path)

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
      if (query.pageId) this.init(query)
    } catch(err) {

    }
  },
  beforeDestroy() {
    eventBus.$off('handleDetails', this.init);
    eventBus.$off('handleAlaCallback', this.handleAla);
  },
  methods: {
    /**
     * 其它页面跳转过来执行
     */
    init(obj) {
      const startTime = obj.begin || obj.startTime || obj.gpsAlarmStartTime;
      const endTime = obj.end || obj.endTime || obj.alaTime;
      let ageerType = obj.ageerType;
      if (typeof ageerType === 'undefined') {
        ageerType = obj.alarmStatus ? 1 : 0;
      }
      const alarmValue = obj.alarmDisplay || obj.alarmValue;
      const key = +ageerType ? 'alarmType2' : 'alarmType';
      const alarmLevel = obj.alarmLevel ? obj.alarmLevel + '级' : '';
      this.$set(this.searchList.vehTerminalNo, 'model', obj.vehPlateNo);
      this.$set(this.searchList.vehTerminalNo, 'id', obj.vehTerminalNo);
      this.$set(this.searchList.alarmLevel, 'model', alarmLevel);
      this.$set(this.searchList.startEndTime, 'model', [startTime, endTime]);
      this.$set(this.searchList.ageerType, 'model', +ageerType);
      
      this.$set(this.searchList[key], 'model', alarmValue);
      this.$set(this.searchList[key], 'id', alarmValue);
      
      const tree = this.searchList.vehTerminalNo.tree;
      const id = getTreeRepeatValue(tree, 'vehTerminalNo', 'id', obj.vehTerminalNo);
      this.$nextTick(() => {
        this.$refs.tabBar.$refs[key][0].setChecked(alarmValue, true);
        this.$refs.tabBar.$refs.vehTerminalNo[0].setChecked(id, true);
      });
      this.query();
    },
    /**
     * 报警处理成功之后
     */
    handleAla(id) {
      const index = this.tableDataAll.findIndex(elem => elem.id === id);
      if (index > -1) {
        // 处理状态等于0是未处理，等于空是全部
        if (this.oldSearch.handle === 0) {
          this.tableDataAll.splice(index, 1);
        } else if (this.oldSearch.handle === '') {
          this.$set(this.tableDataAll[index], 'isHd', this.$t('otherText.handleYes'))
          this.$set(this.tableDataAll[index], 'alarmStatus', true)
        }
        this.changeInfo();
      }
    },
     /**
     * 查询
     */
    query() {
      const dates = this.searchList.startEndTime.model;
      if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    async requestInfo() {
      const search = this.searchList;
      let ids = search.vehTerminalNo.id || [];
      if(ids){
        ids = ids.split(',');
      }
      const dates = search.startEndTime.model;
      const handle = this.searchList.handle.model === '' ? null : this.searchList.handle.model == '1' ? true : false;
      const ageerType = search.ageerType.model;
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
      const key = ageerType ? 'alarmType2' : 'alarmType';
      const alarmType = search[key].id || this.getAlaAllId(key).join();
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

      try {
        const res = await getDevicerAlarmNew(data)
        this.oldSearch.handle = handle
        this.tableDataAll = res.result || []
        this.changeInfo()
      } catch(err) {

      }
    },
    /**
     * 静态改变数据
     */
    changeInfo() {
      const pageing = this.$refs.table.getPageing();
      // const start = (pageing.curPage - 1) * pageing.limit;
      const list = getCopyObj(this.tableDataAll.getDeviceAlarmNewDtos);
      const i18n = this.$t('otherText');
      for (const v of list.values()) {
        v.address = this.$t('button.queryAddress');        
        v.endAddress = v.endAddress;
        v.stm = getDateStr(v.gpsStartTime);
        v.etm = getDateStr(v.gpsEndTime);       
        v.alarmDuration = v.alarmDurationSeconds ? getDateHMS(v.alarmDurationSeconds, i18n) : 0;
        v.devIdno = v.vehPlateNo;
        // v.alarmType = v.alarmValue;
        v.act = getParse(v.extensionData).GpsAlarmLevel === '2级';
        v.copy = true;
        v.vehResoure = v.alarmCatogery; 
        v.alarmLevel = getParse(v.extensionData).GpsAlarmLevel;       
        if (!v.alarmHandleStatus) v.alarmHandleTime = '';
        if(v.alarmHandleInfo){
            v.hdt = getDateStr(v.alarmHandleInfo.alarmHandleTime);
            v.alarmHandleContent = v.alarmHandleInfo.alarmHandleContent || '';
            v.alarmHandler = v.alarmHandleInfo.alarmHandlerName || '';
            v.alarmStatus = v.alarmHandleInfo.alarmHandleStatus; 
            v.isHd = v.alarmHandleInfo.alarmHandleStatus ? this.$t('otherText.handleYes') : `${this.$t('otherText.handleNo')}`;                
        }else{
          v.alarmStatus = false; 
          v.isHd = `${this.$t('otherText.handleNo')}`;
        } 
        v.dptName = v.departmentName;
        const extensionData = getParse(v.extensionData);
        v.guid = extensionData.guid;
        
      }
      this.tableData = list;
      const totalCount = this.tableDataAll.pageOption.total;
       
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
        console.log(row);
        eventBus.$emit('handleAct', row);
      } else if (key === 'copy') {
        this.copyText(row)
      }
    },
    async copyText(row) {
      const { jsession } = this
      const { guid, alarmType, stm, dptName, vehPlateNo, alarmDisplay } = row
      const keys = getCopyObj(this.$t('handAlarm.other'))
      keys.vehPlateNo.val = vehPlateNo
      keys.stm.val = stm
      keys.dptName.val = dptName
      keys.alaType.val = alarmDisplay

      try {
        const data = {
          guid,
          alaType: alarmType,
          begintime: stm,
          alarmDisplay: alarmType,
          jsession
        }
        const res = await alarmDetailApp(data)
        const { videos, infos } = res
        if (videos instanceof Array && videos.length) {
          keys.url.val = videos[0].fsl
        }
        if (infos && typeof infos === 'object') {
          keys.speed.val = getDecimalN(infos.endSpeed / 10)
        }
      } catch(err) {

      }
      const date = getFormatTime('YMDhms')
      keys.code.val = date
      
      let str = ''
      for (const v of Object.values(keys)) {
        if (v.val) str = `${str}${v.label}${v.val}${v.unit || ''}\n`
      }
      const isCopy = copyToClipboard(str)
      if (isCopy) {
        Message.success(this.$t('success.copy'))
      } else {
        Message.error(this.$t('error.copy'))
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res, key) {
      var arr = [];
      var arr2 = [];
      for (const v of res.values()) {
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
