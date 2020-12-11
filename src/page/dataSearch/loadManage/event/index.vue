<!-- 事件管理 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" :tableMoreConList="tableMoreConList" @handleCell="handleCell" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateStr, getDateHMS } from '@/utils/util'
import { getGpsEvent } from '@/api/dataSearch/load'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'Event',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('event.searchList'));
    const tableTitle = this.$t('event.tableTitle');
    const tableMoreConList = this.$t('event.tableMoreConList');
    return {
      searchList,
      tableTitle,
      tableMoreConList,
      tableData: [],
      operButton: {},
      info: {}
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

    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }
  },
  methods: {
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
     * 查询
     */
    query() {
      const dates = this.searchList.startEndTime.model;
      if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const ids = this.searchList.vehTerminalNo.id;
      const dates = this.searchList.startEndTime.model;
      const type = this.searchList.type.model;
      const data = {
        vehTerminalNo: ids || '',
        begin: dates[0],
        end: dates[1],
        type: type ? type.join() : ''
      }
      getGpsEvent(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.startTime = getDateStr(v.startTime);
            v.endTime = getDateStr(v.endTime);
            v.creationTime = getDateStr(v.creationTime);
            v.sec = this.getDays(v.seconds);
            v.address = this.$t('button.queryAddress');
          }
          this.tableData = list;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击查看位置
     */
    handleCell(row, key) {
      this.info.name = row.vehPlateNo;
      this.info.lng = row.startWebLng;
      this.info.lat = row.startWebLat;
      eventBus.$emit('changeMapPop', this.info);
    },
    /**
     * 搜索的树复选框选中
     */
    check(res, key) {
      let arr = [];
      let arr2 = [];
      for (let [index, elem] of res.entries()) {
        if (elem.type == 2) {
          arr.push(elem.vehTerminalNo);
          arr2.push(elem.name);
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
