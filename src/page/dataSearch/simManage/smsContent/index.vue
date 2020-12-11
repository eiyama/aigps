<!-- 单卡短信查询 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" ref="tabBar" @query="query"/>
    <my-table :isPageing="false" ref="table" :tableData="tableData" :tableTitle="tableTitle"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj, getDateMonth } from '@/utils/util'
import { getSMSContent } from '@/api/dataSearch/sim'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'SmsContent',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('smsContent.searchList'));
    const tableTitle = this.$t('smsContent.tableTitle');
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
    searchList.yearMonth.model = getDateMonth()
    this.setSearchList()
  },
  methods: {
    /**
     * 如果地址栏有参数带过来就设置搜索栏对应的参数
     */
    setSearchList() {
      const iccid = this.$route.query.iccid;
      const imsi = this.$route.query.imsi;
      const msisdn = this.$route.query.msisdn;
      if (iccid && imsi && msisdn) {
        this.$set(this.searchList.iccid, 'model', iccid);
        this.$set(this.searchList.imsi, 'model', imsi);
        this.$set(this.searchList.msisdn, 'model', msisdn);
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
      const iccid = this.searchList.iccid.model;
      const imsi = this.searchList.imsi.model;
      const msisdn = this.searchList.msisdn.model;
      const yearMonth = this.searchList.yearMonth.model;
      const data = {
        imsi,
        iccid,
        msisdn,
        yearMonth
      }
      getSMSContent(data).then(res => {
        if (res.result) {
          this.tableData = res.result;
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
