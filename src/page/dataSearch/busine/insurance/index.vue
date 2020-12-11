<!-- 车辆保险 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTreeRepeatValue, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getInterval, getMax, getDateStr, getDecimalN, unique } from '@/utils/util'
import { getInsuranceData } from '@/api/dataSearch/busine'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'

export default {
  name: 'Insurance',
  components: {
    TabBar,
    MyTable
  },
  data () {
    const searchList = getCopyObj(this.$t('insurance.searchList'))
    const tableTitle = this.$t('insurance.tableTitle')
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
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }
  },
  methods: {
    /**
     * 点击查询
     */
    query () {
      const pageing = {
        curPage: 1,
        totalCount: 0,
        perTableCount: {}
      }
      this.$refs.table.setPageing(pageing)
      this.requestInfo()
    },
    /**
     * 请求数据
     */
    async requestInfo () {
      const data = this.getRequestData()
      try {
        const res = await getInsuranceData(data)
        const { result } = res
        const { items, totalCount } = result
        const { $refs } = this
        for (const v of items.values()) {
          v.creationTime = getDateStr(v.creationTime)
          v.registrationDate = getDateStr(v.registrationDate)
        }
        this.tableData = items

        const pageing = {
          totalCount,
          isShow: false 
        }

        $refs.table.setPageing(pageing)
      } catch (err) {

      }
    },
    /**
     * 校验搜索框的值
     */
    getRequestData () {
      const { searchList, $refs } = this
      const veh = searchList.vehTerminalNo.id || ''
      const pageing = $refs.table.getPageing()
      const maxCount = pageing.limit
      const skipCount = (pageing.curPage - 1) * maxCount
      const data = {
        vehNum: veh,
        type: '',
        sorting: '',
        skipCount,
        maxCount
      }

      return data
    },
    /**
     * 搜索的树复选框选中
     * @param {Array} arr 数组
     */
    check (res) {
      const { searchList } = this
      const arr = unique(res)
      const arr1 = []
      const arr2 = []
      for (const v of arr.values()) {
        if (v.type == 2) {
          arr1.push(v.vehTerminalNo)
          arr2.push(v.name)
        }
      }
      searchList.vehTerminalNo.id = arr1.join()
      searchList.vehTerminalNo.model = arr2.join()
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
