<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile" ref="tabBar"
     @query="query" @searchValChange="searchValChange" @searchNodeClick="handleNode"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" :tableMoreConList="tableMoreConList" @request="requestInfo" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDecimalN, getDateStr, getParse } from '@/utils/util'
import { getReportPosition, getLocusExcel } from '@/api/dataSearch/base'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Run',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('run.searchList'));
    const tableTitle = this.$t('run.tableTitle');
    const tableMoreConList = this.$t('run.tableMoreConList');
     
    return {
      searchList,
      tableTitle,
      tableMoreConList,
      tableData: [],
      operButton: {},
      info: []
    }
  },
  watch: {
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
        const pageing = {
          isShow: true,
          perTableCount: {},
          totalCount: 0,
          curPage: 1
        }
        this.$refs.table.setPageing(pageing);
      }
    },
    componentInfo: {
      deep: true,
      handler(newVal, oldVal) {
        this.componentInit(newVal)
      }
    }
  },
  props: {
    componentInfo: {
      type: Object,
      default: () => new Object
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  async created() {
    const { $route, $store, menuTree, searchList, componentInfo } = this
    const url = componentInfo.url || $route.path
    // 如果有数据证明是组件传参
    if (componentInfo && componentInfo.url) {
      this.componentInit(componentInfo)
    }
    this.operButton = getOperButton(menuTree, url)

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {
      console.log(err)
    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      if (!this.isInputVal()) {
        return;
      }
      const pageing = {
        curPage: 1,
        totalCount: 0,
        perTableCount: {}
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const vehTerminalNo = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      const zero = this.searchList.zero.model ? 1 : 0;
      const pageing = this.$refs.table.getPageing();
      const data = {
        zero,
        type: 0,
        vehTerminalNo,
        end: selectTime[1],
        begin: selectTime[0],
        page: pageing.curPage,
        limit: pageing.limit,
        totalCount: pageing.totalCount,
        perTableCount: pageing.perTableCount
      }
      getReportPosition(data).then(res => {
        if (res.result) {
          const list = res.result.postion;
          for (const e of list.values()) {
            e.gpstime = getDateStr(e.gpstime);
            e.creationTime = getDateStr(e.creationTime);
            // 扩展字段展示定位类型
            const extensionData = getParse(e.extensionData);
            const grpcBaseStationInfo = getParse(extensionData.GrpcBaseStationInfo);
            if (Array.isArray(grpcBaseStationInfo.BaseStationInfos)) {
            e.infoLBS = `${grpcBaseStationInfo.Mcc}-${grpcBaseStationInfo.Mnc}-`;
              for (const v of grpcBaseStationInfo.BaseStationInfos.values()) {
                e.infoLBS += `${v.Lac}-${v.Cellid}-${v.Signal}-`;
              }
            e.infoLBS += grpcBaseStationInfo.Needaddress;
            }
            e.locationType = extensionData.LocationType || '';
            e.gpsAcc = e.gpsAcc ? this.$t('otherText.open') : this.$t('otherText.shut');
            e.gpsIsposition = e.gpsIsposition ? this.$t('otherText.isPosition_1') : this.$t('otherText.isPosition_2');
            e.address = this.$t('button.queryAddress');
            e.gpsTotalDistance = getDecimalN(e.gpsTotalDistance);
            e.gpsDayDistance = getDecimalN(e.gpsDayDistance);
            e.batteryPower = e.batteryPower || `${0}%`;
          }
          this.tableData = list;
          const perTableCount = res.result.perTableCount;
          const totalCount = res.result.totalCount;
          const pageing = {
            totalCount,
            perTableCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
        }
      })
      .catch(err => {

      });
    },
    /**
     * 校验搜索框的值
     */
    isInputVal() {
      const veh = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      
      if (!veh) {
        Message.error(this.$t('error.selectCar'));
        return false;
      } else if (!Array.isArray(selectTime) || !selectTime.length) {
        Message.error(this.$t('error.selectTimes'));
        return false;
      } else {
        return true;
      }
    },
    /**
     * 组件打开页面执行
     */
    componentInit(info) {
      this.searchList.vehTerminalNo.model = info.carName;
      this.searchList.vehTerminalNo.id = info.id;
      this.searchList.startEndTime.model = getTodays();
      if (info.carName && info.id) {
        this.$nextTick(() => {
          this.query();
        });
      }
    },
    /**
     * 查看当前位置
     */
    getAddress(row) {
      this.info = []
      const obj = {
        title: row.vehPlateNo,
        lng: row.gpsWebLng,
        lat: row.gpsWebLat,
        address: row.positionAddress
      }
      this.info.push(obj)
      eventBus.$emit('changeMapPop', this.info);
    },
    /**
     * 点击导出
     */
    exportFile() {
      if (!this.isInputVal()) {
        return;
      }
      const vehTerminalNo = this.searchList.vehTerminalNo.id;
      const dates = this.searchList.startEndTime.model;
      const zero = this.searchList.zero.model ? 1 : 0;
      const data = {
        vehTerminalNo,
        zero,
        begin: dates[0],
        end: dates[1]
      }
      getLocusExcel(data).then(res => {
        if (res.result) {
          location.href = `${process.env.VUE_APP_BASEURL}${res.result.fileName}`;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 搜索框树点击节点
     * @param {Object} data 当前节点的数据
     * @param {String} key 当前选项的key
     */
    handleNode(data, key) {
      this.searchList[key].model = data.name;
      this.searchList[key].id = data.vehTerminalNo;
    },
    /**
     * 树类型搜索框值改变
     * @param {String} key 当前选项的key
     */
    searchValChange(key) {
      this.searchList[key].id = '';
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
