<!-- 单卡查询 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query"></tab-bar>
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { getFindCardInfo } from '@/api/dataSearch/sim'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'SinCardQuery',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('sinCardQuery.searchList'));
    const tableTitle = this.$t('sinCardQuery.tableTitle');
    return {
      searchList,
      tableTitle,
      tableData: [],
      operButton: {}
    }
  },
   computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
  },
  methods: {
     /**
     * 查询
     */
    query() {
      const sim = this.searchList.iccId.model;
      if (!sim) {
        Message.error(this.$t('error.iccId'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const sim = this.searchList.iccId.model;
      const data = JSON.stringify({
        iccid: sim
      })
      getFindCardInfo(data).then(res => {
        if (res.result) {
          this.tableData = [res.result];
        }
      })
      .catch(err => {

      });
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
