<!-- 90天短信条数 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @query="query" />
    <div class="count">
      <div class="label">{{ $t('sms90DaysCount.label') }}</div>
      <div class="text">{{ count }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj, getDateTime } from '@/utils/util'
import { getSms90DaysCount } from '@/api/dataSearch/sim'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'Sms90DaysCount',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('sms90DaysCount.searchList'));
    return {
      searchList,
      count: '',
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
    async query() {
      this.requestInfo()
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
      getSms90DaysCount(data).then(res => {
        this.count = res.result || 0;
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

.count {
  overflow: hidden;
  padding: 10px 0 0;
}
.count .label, .count .text {
  float: left;
  font-size: 14px;
}
.count .label {
  color: #333;
}
.count .text {
  color: #666;
}
</style>
