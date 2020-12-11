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
import { getOperButton, getTodays, getTreeRepeatValue } from '@/utils/data'
import { getCopyObj, getParse } from '@/utils/util'
import { getAlarmRecode } from '@/api/dataSearch/fence'
import exportFile from '@/utils/exportFile'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Areas',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('area.searchList'));
    const tableTitle = this.$t('area.tableTitle');
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
 
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
      this.init()
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
      const alarmType = this.searchList.alarmType.model;
      const selectTime = this.searchList.startEndTime.model;
      const data = {
        VehTerminalNo: veh || '',
        Begin: selectTime[0],
        End: selectTime[1],
        AlaType: alarmType,
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
    init() {
      const query = this.$route.query;
      if (query.carNum && query.curDate) {
        this.searchList.vehTerminalNo.vehTerminalNo = query.vehTerminalNo;
        this.searchList.vehTerminalNo.model = query.carNum;
        this.searchList.startEndTime.model = getParse(query.curDate);
        this.searchList.alarmType.model = query.alaType;
        const tree = this.searchList.vehTerminalNo.tree;
        const id = getTreeRepeatValue(tree, 'name', 'id', query.carNum);
        if (id) {
          this.$nextTick(() => {
            this.$refs.tabBar.$refs.vehTerminalNo[0].setChecked(id, true);
          });
        }
        this.query();
      } else {
        // 给时间选择框赋值
        this.searchList.startEndTime.model = getTodays();
      }
      
    },
    /**
     * 点击导出
     */
    exportFile() {
      const length = this.tableData.length;
      if (length) {
        exportFile(length, this.$t('area.curTitle'));
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
