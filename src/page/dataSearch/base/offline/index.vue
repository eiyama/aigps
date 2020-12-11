<!-- 离线报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="getAddress" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateStr,getDateHMS, unique  } from '@/utils/util'
import { isNumber } from '@/utils/validate'
import { getOfflineReport } from '@/api/dataSearch/base'
import { getDepartmentAll } from '@/api/sysetsmM/dpt'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Offline',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('offline.searchList'));
    const tableTitle = this.$t('offline.tableTitle');
     
    return {
      searchList,
      tableTitle,
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
    }
  },
  props: {
    componentInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters([
      'menuTree',
      'userInfo'
    ])
  },
  async created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    try {
      const tree = await this.getDepartmentAll()
      searchList.dptName.tree = tree
    } catch(err) {
      console.log(err)
    }
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const hour = this.searchList.offlineTime.model;
      if (hour && !isNumber(hour)) {
        Message.error(this.$t('message.msgMin1'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const id = this.searchList.dptName.dptId;
      const hour = this.searchList.offlineTime.model || 0;
      const data = {
        DptIds: id || '',
        Hour: hour
      }
      getOfflineReport(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.lastRecode = getDateStr(v.lastRecode) || '--';
            v.offline = this.getDays(v.offline);
            v.address = this.$t('button.queryAddress');
            v.gpsWebLat = +v.gpsWebLat || '--';
            v.gpsWebLng = +v.gpsWebLng || '--';
            v.batteryPower = v.batteryPower ? v.batteryPower.replace('%', '') : `${0}%`;
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
     * 获取部门树数据
     */
    getDepartmentAll() {
      const { userInfo } = this
      return new Promise((resolve, reject) => {
        getDepartmentAll({ id: userInfo.id }, { dom: null }).then(res => {
          if (res.result) {
            const tree = res.result.items;
            resolve(tree);
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err);
        });
      })
    },
    /**
     * 查看当前位置
     */
    getAddress(row) {
      this.info = []
      const obj = {
        title: row.plateNo,
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
      const num = this.tableData.length;
      if (num) {
        exportFile(num, this.$t('offline.curTitle'));
      } else {
        Message.error(this.$t('otherText.msgExport'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      const { searchList } = this
      const list = unique(res, 'vehTerminalNo')
      const arr1 = []
      const arr2 = []
      for (const v of list.values()) {
        arr1.push(v.id)
        arr2.push(v.dptName)
      }
      searchList.dptName.dptId = arr1.join();
      searchList.dptName.model = arr2.join();
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
