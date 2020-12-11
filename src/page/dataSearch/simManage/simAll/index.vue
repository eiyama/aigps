<!-- 多卡查询 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query"/>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj } from '@/utils/util'
import { getCardListPage } from '@/api/dataSearch/sim'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'AimAll',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('simAll.searchList'));
    const tableTitle = this.$t('simAll.tableTitle');
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
  created() {
    const { $route, $store, menuTree, searchList } = this
    const { path, query } = $route
    this.operButton = getOperButton(menuTree, path)
    if (query.sim) {
      searchList.msisdn.model = query.sim
      this.query()
    }
  },
  methods: {
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
      const iccid = this.searchList.iccid.model;
      const imsi = this.searchList.imsi.model;
      const msisdn = this.searchList.msisdn.model;
      const pageing = this.$refs.table.getPageing();
      const data = {
        curPage: pageing.curPage,
        limit: pageing.limit,
        msisdn,
        iccid,
        imsi
      }
      getCardListPage(data).then(res => {
        if (res.result) {
          const list = res.result.cardList;
          for (const v of list.values()) {
            // 根据值来显示运营商
            v.operators = this.$t(`otherText.operator${v.operator}`);
            // 根据值来显示当前卡的状态
            v.state = this.$t(`simAll.state${v.status}`);
          }
          this.tableData = list;
          const totalCount = res.result.totalPage * data.limit;
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
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
