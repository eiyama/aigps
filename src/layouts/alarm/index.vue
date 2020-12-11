<template>
  <div class="query-alarm">
    <el-badge :value="alarmNum" :max="99" @click.native="alarmOpen()" class="item">
      <a class="el-icon-bell" herf="javascript:;" @click.stop="alarmOpen()"></a>
    </el-badge>
     <!-- 报警搜索栏 -->
    <el-dialog class="dialog-flex" :title="$t('alarmManage.title')" :visible.sync="isShow"
        @close="close" width="80%" :before-close="alarmClose">
        <!-- tabBar -->
      <tab-bar :searchList="searchList" :operButton="{ search: true }" @query="query" @searchNodeClick="searchNodeClick" @searchValChange="searchValChange" @check="check"></tab-bar>
      <!-- 表格 -->
      <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="handleCell" />
    </el-dialog>
  </div>
</template>

<style scoped>
.query-alarm {
  float: right;
  position: relative;
  margin: 15px 25px 0 0;
  color: #fff;
}
.query-alarm .item {
  cursor: pointer;
}
.query-alarm a {
  display: block;
  position: relative;
  font-size: 24px;
  left: 8px;
  top: -4px;
}
.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
.table-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

<script>
import { mapGetters } from 'vuex'
import { getPickerOptions, getTodays } from '@/utils/data'
import { getDateHMS, getCopyObj, getParse, getDateStr, unique } from '@/utils/util'
import { isNumber } from '@/utils/validate'
import { getDevicerAlarmNew } from '@/api/dataSearch/deviceAlarm'

import TabBar from '@/components/tabBar'
import MyTable from '@/page/dataSearch/deviceAlarm/alarmDetails/components/myTable'
import { Badge, Dialog, Message } from 'element-ui'

export default {
  components: {
    ElBadge: Badge,
    ElDialog: Dialog,
    TabBar,
    MyTable
  },
  data() {
    const tableTitle = this.$t('alarmDetails.newtableTitle')
    return {
      isShow: false,
      searchList: {},
      pickerOptions: getPickerOptions(this.$t('otherText')),
      tableData: [],
      oldSearchVal: {},
      info: [],
      tableTitle
    }
  },
  computed: {
    ...mapGetters([
      'alarmNum'
    ])
  },
  watch: {
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
        if (!this.$refs.table) return
        const pageing = {
          isShow: true,
          totalCount: 0,
          curPage: 1
        }
        this.$refs.table.setPageing(pageing)
      }
    }
  },
  created() {
    this.searchList = getCopyObj(this.$t('alarmDetails.searchList'));
    delete this.searchList.isAnalysis;
    this.searchList.alaType.tree = getCopyObj(this.$t('home.alarmData'));
    // 给搜索的时间组件赋值
    this.searchList.startEndTime.model = getTodays()

    // 监控页面在这里监听监控页面点击报警图标
    eventBus.$on('changeAlamPop', this.changeAlamPop)

    // 监听报警处理成功之后更新表格
    eventBus.$on('upAlarm', this.upAlarm)

    // 监听报警处理成功之后更新表格
    eventBus.$on('handleClickNew', this.handleClick)
  },
  beforeDestroy() {
    eventBus.$off('changeAlamPop', this.changeAlamPop)
    eventBus.$off('upAlarm', this.upAlarm)
    eventBus.$off('handleClickNew', this.handleClick)
  },
  methods: {
    getDays(val) {
      if (val <= 0) {
        return '0'
      } else if (!val) {
        return '--'
      } else {
        return getDateHMS(val, this.$t('otherText'))
      }
    },
    /**
     * 点击弹出表格
     */
    async alarmOpen(oldSearchVal) {
      this.$store.dispatch('alarm/alarmAddOrClear', false)

      const tree = await this.$store.dispatch('data/setCarTree')
      this.searchList.vehTerminalNo.tree = tree

      this.isShow = true
      // 关闭地图弹窗
      eventBus.$emit('changeMapPop', false)
      if (!oldSearchVal) {
        this.$store.dispatch('alarm/alarmAddOrClear', false)
      }
      await this.$nextTick()
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo(oldSearchVal)
    },
    /**
     * 请求数据
     */
    requestInfo(oldSearchVal) {
      if (!oldSearchVal) oldSearchVal = {}
      const startEndTime = this.searchList.startEndTime.model;
      const selectTime = oldSearchVal.startEndTime || startEndTime;
      let vehTerminalNo = this.searchList.vehTerminalNo.id;
      const alarmCategory = this.searchList.alaType.alarmCategory;
      const alaType = this.searchList.alaType.id;
      const handle = this.searchList.handle.model === '' ? null : this.searchList.handle.model == '1' ? true : false;
      const duration = this.searchList.duration.model;
      const pageing = this.$refs.table.getPageing();      
      let alarmCategoryArr = [] ,alarmDisplayArr = [];
      if(oldSearchVal.alarmCategory){
        alarmCategoryArr = oldSearchVal.alarmCategory.split(',');
      }else if(alarmCategory){
        alarmCategoryArr = alarmCategory.split(',');
      }
      if(vehTerminalNo){
        vehTerminalNo = vehTerminalNo.split(',');
      }
      if(oldSearchVal.alarmDisplay){
        alarmDisplayArr = oldSearchVal.alarmDisplay.split(',') ;
      }else if(alaType){
        alarmDisplayArr = alaType.split(',');
      }

      const data =  {
        "vehTerminalNos": vehTerminalNo || oldSearchVal.vehTerminalNo ||  [],
        "startTime": selectTime ? selectTime[0] : '',
        "endTime": selectTime ? selectTime[1] : '',
        "alarmCategory":  alarmCategoryArr || alarmCategory || '',
        "alarmDisplay": alarmDisplayArr || alaType || '',
        "alarmHandleStatus": handle,
        "alarmLevel": 0,
        "alarmDuration": duration || oldSearchVal.duration || 0,
        "pageOption": {
          "pageIndex": pageing.curPage,
          "pageSize": pageing.limit,
          "total": pageing.totalCount
        }
      }    
      getDevicerAlarmNew(data).then(res => {
        if(res.result) {
          // 把查询的时候的时间存起来
          this.oldSearchVal = {
            ...oldSearchVal,
            startEndTime: selectTime
          }
          const arr = res.result.getDeviceAlarmNewDtos || []
          const otherText = this.$t('otherText')
          for (const v of arr.values()) {
            v.alaTime = getDateStr(v.gpsEndTime);
            v.gpsAlarmStartTime = getDateStr(v.gpsStartTime);
            v.alaHandleTime = getDateStr(v.alarmHandleTime);
            v.alarmDuration = this.getDays(v.alarmDuration);
            v.sAddress = this.$t('otherText.startAddress');
            v.eAddress = this.$t('otherText.endAddress');
            v.alarmDuration = v.alarmDurationSeconds;          
            v.alarmCategory = v.alarmCatogery;  
            if(v.extensionData){
               v.gpsAlarmLevel = getParse(v.extensionData).GpsAlarmLevel 
            }                     
            if(v.alarmHandleInfo){
                v.alarmHandleTime = getDateStr(v.alarmHandleInfo.alarmHandleTime);
                v.alarmHandleContent = v.alarmHandleInfo.alarmHandleContent || '';
                v.alarmHandlerName = v.alarmHandleInfo.alarmHandlerName || '';
                const text = `${this.$t(otherText.handleNo)}，${this.$t('button.clickHandle')}`;
                v.alaStateText = v.alarmHandleInfo.alarmHandleStatus ? this.$t('otherText.handleYes') : text;  
                v.alarmStatus = v.alarmHandleInfo.alarmHandleStatus;             
            }else{   
              v.alarmStatus = false;         
              v.alaStateText = `${this.$t('otherText.handleNo')}，${this.$t('button.clickHandle')}`;
            }           
          }         
          this.tableData = arr;   
          // console.log(arr);     
          const totalCount = res.result.pageOption.total;        
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
        }
      })
      .catch(err => {

      })
    },
    /**
     * 弹窗关闭之前
     * @param {Function} done 用来关闭弹窗
     */
    alarmClose(done) {
      // 初始化搜索栏
      this.$set(this.searchList.vehTerminalNo, 'vehTerminalNo', '');
      this.$set(this.searchList.vehTerminalNo, 'model', '');
      this.$set(this.searchList.alaType, 'model', '');
      this.$set(this.searchList.alaType, 'vehTerminalNo', '');
      this.$set(this.searchList.handle, 'model', null);
      this.$set(this.searchList.duration, 'model', '');
      this.$set(this.searchList.startEndTime, 'model', getTodays());
      done();
    },
    /**
     * 弹窗关闭的回调
     */
    close() {
      eventBus.$emit('changeMapPop', false)
      this.tableData = []
    },
    query() {
      // 时间范围必填
      const timeDate = this.searchList.startEndTime.model;
      // 持续时间必须是整数但是可以不必填
      const duration = this.searchList.duration.model;
      if (!Array.isArray(timeDate) || !timeDate.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      } else if (duration && !isNumber(duration)) {
        Message.error(this.$t('error.duration'));
        return;
      }
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo()
    },
    /**
     * 搜索框树点击节点
     * @param {Object} data 当前节点的数据
     * @param {String} key 当前选项的key
     */
    searchNodeClick(data, key) {
      if (key === 'vehTerminalNo') {
        this.searchList[key].model = data.name;
        this.searchList[key].id = data.vehTerminalNo;
      }
    },
    /**
     * 搜索树的报警复选框
     */
    check(arr, key) {
      const { searchList } = this
      const names = []
      const ids = []
      if (key === 'alaType') {
        const newArr = unique(arr, 'label')
        const parentNames = [] 
        for (const v of newArr.values()) {
          if (v.type == 2) {
            names.push(v.label)
            ids.push(v.id)
            const i = parentNames.findIndex(e => e === v.parentName)
            if (i === -1) parentNames.push(v.parentName)
          }
        }
        searchList[key].alarmCategory = parentNames.join()
      } else if (key === 'vehTerminalNo') {
        const newArr = unique(arr, 'name')
        for (const v of newArr.values()) {
          if (v.type == 2) {
            names.push(v.name)
            ids.push(v.vehTerminalNo)
          }
        }
      }
      // es6的方法去重
      searchList[key].id = ids.join()
      searchList[key].model = names.join()
    },
    /**
     * 树搜索框值改变
     * @param {String} key 搜索组件的key
     */
    searchValChange(key) {
      //每次搜索框改变都改为反
      if (key === 'vehTerminalNo') {
        this.searchList.vehTerminalNo.id = '';
      } else if (key === 'alaType') {
        this.searchList.alaType.id = '';
        this.searchList.alaType.alarmCategory = '';
      }
    },
    /**
     * 报警处理成功之后更新表格
     */
    upAlarm() {
      this.requestInfo(this.oldSearchVal)
      eventBus.$emit('handleAlaCallback')
    },
    /**
     * 点击监控页面的报警图标
     * @param {Object} res 数据
     */
    changeAlamPop(res) {
      this.searchList.vehTerminalNo.model = res.name
      this.searchList.vehTerminalNo.id = res.vehTerminalNo
      this.query()
    },
    /**
     * 点击报警处理
     * @param {Object} row 当前行的数据
     */
    handleClick(row) {
      // 1是视频报警设备
      if (row.alarmCategory == '视频设备报警') {
        const extensionData = getParse(row.extensionData)
        row.guid = extensionData.guid
        row.atp = row.alarmValue
        row.stm = row.alaTime
        eventBus.$emit('handleAct', row)
      } else {
        eventBus.$emit('handleAlarm', row)        
      }
    },
    /**
     * 点击地址弹出地址弹窗
     * @param {Object} row 当前行的数据
     * @param {String} key 列的key
     */
    handleAddress(row, key) {
      this.info = []
      let obj = {}
      if (key === 'sAddress') {
        obj = {
          name: row.startAddress,
          lng: row.gcj02StartCoordinate.lng,
          lat: row.gcj02StartCoordinate.lat,
          title: row.vehPlateNo
        }
      } else if (key === 'eAddress') {
        obj = {
          name: row.endAddress,
          lng: row.gcj02EndCoordinate.lng,
          lat: row.gcj02EndCoordinate.lat,
          title: row.vehPlateNo
        }
      }
      this.info.push(obj)
      eventBus.$emit('changeMapPop', this.info)
    },
    /**
     * 跳转详情页
     * @param {Object} row 当前行的数据
     */ 
    handleDetails(row) {
      this.close();
      // 关闭报警弹窗
      this.isShow = false;
      const curPath = this.$route.path;
      let path = '/home/dataSearch/detailsDeviceAlarm';
      // 根据报警的类型判断跳转哪个页面
      if (row.alarmCategory === '胎压报警') {
        path = '/home/dataSearch/tirePressure';
      } else if (row.alarmCategory === '围栏报警') {
        path = '/home/dataSearch/area';
      } else if (row.alarmCategory === '视频设备报警') {
        path = '/home/dataSearch/handAlarm';
      }
      // 证明是当前页面不需要跳转
      if (path === curPath) {
        eventBus.$emit('handleDetails', row);
      } else {
        this.$router.push({
          path,
          query: {
            code: 'dataQuery',
            vehPlateNo: row.vehPlateNo,
            vehTerminalNo: row.vehTerminalNo,
            gpsAlarmStartTime: row.gpsAlarmStartTime,
            alaTime: row.alaTime,
            alarmValue: row.alarmDisplay,
            alarmDisplay: row.alarmDisplay,
            alarmCategory: row.alarmCategory,
            alarmStatus: row.alarmStatus,
            pageId: 1
          }
        })
      }
    },
    /**
     * 点击表格单元格
     * @param {Object} row 当前行的数据
     * @param {String} key 列的key
     */
    handleCell(row, prop) {    
      if (prop === 'alarmDisplay') {
        this.handleDetails(row)
      } else if (prop === 'alaStateText') {
        this.handleClick(row)
      } else {
        this.handleAddress(row, prop)
      }
    }
  }
}
</script>