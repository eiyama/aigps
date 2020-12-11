<!-- sim卡超流80% -->
<template>
  <div class="content">
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" />
  </div>
</template>

<script>
import { getCarTraffic } from '@/api/dataSearch/sim'
import MyTable from '@/components/myTable'

export default {
  name: 'FindPools',
  components: {
    MyTable
  },
  data() {
    const tableTitle = this.$t('simExcessFlow.tableTitle')
    return {
      tableTitle,
      tableData: []
    }
  },
  created() {
    this.requestInfo()
  },
  methods: {
    /**
     * 请求数据
     */
    async requestInfo() {
      try {
        const res = await getCarTraffic()
        const arr = res.result.overtraffics
        this.tableData = arr
      } catch(err) {

      }
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
