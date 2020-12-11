<!-- 停车未熄火 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS } from '@/utils/util'
import { getReportStop } from '@/api/dataSearch/base'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'ParkNoFlameout',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('parkNoFlameout.searchList'));
    const tableTitle = this.$t('parkNoFlameout.tableTitle');
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
      const dur = this.searchList.duration.model;
      const selectTime = this.searchList.startEndTime.model;
      const vehTerminalNo = this.searchList.vehTerminalNo.vehTerminalNo;
      if (!vehTerminalNo) {
        Message.error(this.$t("error.selectCar"));
        return;
      } else if (!dur) {
        Message.error(this.$t("error.stopCarTime"));
        return;
      } else if (!selectTime || !selectTime.length) {
        Message.error(this.$t("error.selectTimes"));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const veh = this.searchList.vehTerminalNo.vehTerminalNo;
      const selectTime = this.searchList.startEndTime.model;
      const duration = this.searchList.duration.model;
      const data = {
        VehTerminalNo: veh,
        Duration: duration,
        Begin: selectTime[0],
        End: selectTime[1],
        Type: -1
      }
      getReportStop(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.stopStartTime = v.stopStartTime.substring(0, 19).replace('T', ' ');
            v.stopEndTime = v.stopEndTime.substring(0, 19).replace('T', ' ');
            v.updateTime = v.updateTime.substring(0, 19).replace('T', ' ');
            v.sTime = this.getDays(v.stopTime);
            v.address = this.$t('button.queryAddress');
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
     * 查看当前位置
     */
    getAddress(row) {
      this.info = []
      const obj = {
        name: row.vehPlateNo,
        lng: row.gpsWebLng,
        lat: row.gpsWebLat,
        address: row.stopPointAddress
      }
      this.info.push(obj)
      eventBus.$emit("changeMapPop", this.info);
    },
    /**
     * 点击导出
     */
    exportFile() {
      const count = this.tableData.length;
      if (count) {
        exportFile(count, this.$t('parkNoFlameout.curTitle'));
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
