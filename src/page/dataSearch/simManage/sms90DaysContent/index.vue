<!-- 90天短信内容 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @request="requestInfo" ref="tabBar" @query="query"/>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj, getDateTime } from '@/utils/util'
import { getSms90DaysCount, getSms90DaysContent } from '@/api/dataSearch/sim'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'Sms90DaysContent',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('sms90DaysContent.searchList'));
    const tableTitle = this.$t('sms90DaysContent.tableTitle');
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
    async query() {
      try {
        const count = await this.getSms90DaysCount()
        if (count) {
          this.requestInfo()
        } else {
          this.tableData = []
        }
      } catch(err) {

      }
    },
    /**
     * 获取数据条数
     */
    getSms90DaysCount() {
      const iccid = this.searchList.iccid.model;
      const imsi = this.searchList.imsi.model;
      const msisdn = this.searchList.msisdn.model;
      const data = {
        iccid,
        imsi,
        msisdn
      }
      return new Promise((resolve, reject) => {
        getSms90DaysCount(data).then(res => {
          const pageing = {
            totalCount: res.result,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
          resolve(res.result)
        })
        .catch(err => {
          reject(0)
        });
      })
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const iccid = this.searchList.iccid.model;
      const imsi = this.searchList.imsi.model;
      const msisdn = this.searchList.msisdn.model;
      const data = {
        iccid,
        imsi,
        msisdn
      }
      getSms90DaysContent(data).then(res => {
        if (res.result) {
          const list = res.result;
          for (const v of list.values()) {
            v.createTime2 = getDateTime(v.createTime);
          }
          this.tableData = list;
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
