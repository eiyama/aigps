<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @request="requestInfo" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" :tableMoreConList="tableMoreConList" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getDateStr } from '@/utils/util'
import { getSendMessage } from '@/api/dataSearch/base'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Sendcommand',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('sendcommand.searchList'));
    const tableTitle = this.$t('sendcommand.tableTitle');
    const tableMoreConList = this.$t('sendcommand.tableMoreConList');
    return {
      searchList,
      tableTitle,
      tableMoreConList,
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
        this.$refs.table.setPageing(pageing)
      }
    }
  },
  async created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree;
    } catch(err) {
      console.log(err)
    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const veh = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      
      if (!veh) {
        Message.error(this.$t('error.selectCar'));
        return;
      } else if (!Array.isArray(selectTime) || !selectTime.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      const pageing = {
        curPage: 1,
        totalCount: 0,
        perTableCount: {}
      }
      this.$refs.table.setPageing(pageing);
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const veh = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      const pageing = this.$refs.table.getPageing();
      const data = {
        VehTerminalNo: veh,
        Begin: selectTime[0],
        End: selectTime[1],
        Limit: pageing.limit,
        Page: pageing.curPage,
        MessageId: 0
      }
      getSendMessage(data).then(res => {
        if (res.result) {
          const list = res.result.result;
          for (const v of list.values()) {
            v.creationTime = getDateStr(v.creationTime);
            v.sState = v.sendState ? this.$t('otherText.send') : this.$t('otherText.noSend');
            v.rState = v.responseState ? this.$t('otherText.response') : this.$t('otherText.noResponse');
            v.creationContent = v.conTent;
          }
          this.tableData = list;
          const totalCount = res.result.count;
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
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
        exportFile(this.tableTitle.length, this.$t('sendcommand.curTitle'));
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
      this.searchList.vehTerminalNo.id = arr.join();
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
