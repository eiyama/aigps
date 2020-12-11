<!-- 流量池详情 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query"/>
    <my-table :isPageing="false" ref="table" :tableData="tableData" :tableTitle="tableTitle"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { getPoolInfo } from '@/api/dataSearch/sim'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'PoolInfo',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('poolInfo.searchList'));
    const tableTitle = this.$t('poolInfo.tableTitle');
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
    const { $route, $store, menuTree } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
    this.setSearchList()
  },
  methods: {
    /**
     * 如果地址栏有参数带过来就设置搜索栏对应的参数
     */
    setSearchList() {
      const poolNumber = this.$route.query.poolNumber;
      if (poolNumber) {
        this.$set(this.searchList.poolNumber, 'model', poolNumber);
        this.query();
      }
    },
     /**
     * 查询
     */
    query() {
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const poolNumber = this.searchList.poolNumber.model;
      getPoolInfo(poolNumber).then(res => {
        if (res.result) {
          const operator = res.result.operator;
          res.result.operator1 = this.$t(`otherText.operator${operator}`);
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
