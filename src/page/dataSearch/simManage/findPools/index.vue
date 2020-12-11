<!-- 流量池清单 -->
<template>
  <div class="content">
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" @handleRow="handleRow" />
  </div>
</template>

<script>
import { getFindPools } from '@/api/dataSearch/sim'
import MyTable from '@/components/myTable'

export default {
  name: 'FindPools',
  components: {
    MyTable
  },
  data() {
    const tableTitle = this.$t('findPools.tableTitle');
    return {
      tableTitle,
      tableData: []
    }
  },
  created() {
    this.requestInfo();
  },
  methods: {
    /**
     * 请求数据
     */
    requestInfo() {
      getFindPools().then(res => {
        if (res.result) {
          this.tableData = res.result;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击行跳转详情
     * @param row 行数据
     */
    handleRow(row) {
      this.$router.push({
        path: '/home/dataSearch/poolInfo',
        query: {
          poolNumber: row.poolNumber,
          code: 'dataQuery'
        }
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
