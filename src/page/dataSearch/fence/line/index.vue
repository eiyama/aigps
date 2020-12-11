<!-- 里程报表 -->
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
import { getCopyObj } from '@/utils/util'
import { getAlarmRecode } from '@/api/dataSearch/fence'
import exportFile from '@/utils/exportFile'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'FenceLine',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('line.searchList'));
    const tableTitle = this.$t('line.tableTitle');
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
    } catch(err) {

    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const selectTime = this.searchList.startEndTime.model;
      if (!selectTime || !selectTime.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const veh = this.searchList.vehTerminalNo.vehTerminalNo || '';
      const selectTime = this.searchList.startEndTime.model;
      const data = {
        VehTerminalNo: veh || '',
        Begin: selectTime[0],
        End: selectTime[1],
        AlaType: '10005',
        AlaStatus: ''
      }
      getAlarmRecode(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.alarmAddress = this.$t('button.queryAddress');
          }
          this.tableData = list;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击导出
     */
    exportFile() {
      const length = this.tableData.length;
      if (length) {
        exportFile(length, this.$t('line.curTitle'));
      } else {
        Message.error(this.$t('otherText.msgExport'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      let arr = [];
      let arr2 = [];
      for (const v of res.values()) {
        if (v.type == 2) {
          arr.push(v.vehTerminalNo);
          arr2.push(v.name);
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.vehTerminalNo.vehTerminalNo = arr.join();
      this.searchList.vehTerminalNo.model = arr2.join();
    },
    /**
     * 点击查看地址
     */
    getAddress(row) {
      this.info = []
      const obj = {
        name: row.vehPlateNo,
        lng: row.gpsWebLng,
        lat: row.gpsWebLat
      }
      this.info.push(obj)
      eventBus.$emit('changeMapPop', this.info);
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
