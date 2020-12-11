<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar"
     @query="query" @searchValChange="searchValChange" @searchNodeClick="handleNode"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDecimalN, getDateStr } from '@/utils/util'
import { getGyroscopeData } from '@/api/dataSearch/busine'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Gyroscope',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('gyroscope.searchList'));
    const tableTitle = this.$t('gyroscope.tableTitle');
     
    return {
      searchList,
      tableTitle,
      tableData: [],
      operButton: {}
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
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  async created() {
    const code = this.$route.query.code;
    const url = this.$route.path;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        break;
      }
    }
    // 给时间选择框赋值
    this.searchList.startEndTime.model = getTodays();
    try {
      const tree = await this.$store.dispatch('data/setCarTree');
      this.searchList.vehTerminalNo.tree = tree;
    } catch(err) {

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
      const id = this.searchList.vehTerminalNo.id;
      const selectTime = this.searchList.startEndTime.model;
      const pageing = this.$refs.table.getPageing();
      const data = {
        id,
        end: selectTime[1],
        begin: selectTime[0],
        page: pageing.curPage,
        limit: pageing.limit,
        totalCount: pageing.totalCount,
        perTableCount: pageing.perTableCount
      }
      getGyroscopeData(data).then(res => {
        if (res.result) {
          const list = res.result.gyroscopeList
          for (const v of list.values()) {
            v.createTime = getDataStr(v.createTime)
            v.convertLng = v.convertLng ? getDecimalN(v.convertLng, 6) : 0
            v.convertLat = v.convertLat ? getDecimalN(v.convertLat, 6) : 0
          }
          this.tableData = list

          const perTableCount = res.result.perTableCount
          const totalCount = res.result.totalCount
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
