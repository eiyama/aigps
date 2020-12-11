<!-- 里程报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile"
     ref="tabBar" @query="query" @remoteMethod="remoteMethod" @check="check"></tab-bar>
    <my-table ref="table" :tableData="tableData" :tableTitle="tableTitle" :tableMoreConList="tableMoreConList" @request="requestInfo" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj, getFormatTime, getDateStr } from '@/utils/util'
import { getAllVehicle, getSearch } from '@/api/dataSearch/base'
import { getDepartmentAll } from '@/api/sysetsmM/dpt'
import { getAllFull } from '@/api/sysetsmM/car'
import exportFile from '@/utils/exportFile';
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import { Message } from 'element-ui'

export default {
  name: 'CarExpire',
  components: {
    TabBar,
    MyTable
  },
  data() {
    const searchList = getCopyObj(this.$t('carExpire.searchList'));
    const tableTitle = this.$t('carExpire.tableTitle');
    const tableMoreConList = this.$t('carExpire.tableMoreConList');
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
     const { $route, menuTree } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
  },
  async mounted() {
    try {
      const tree = await this.getDepartmentAll();
      this.searchList.DptIds.tree = tree;
      const list = await this.getAllFull();
      this.searchList.Type.list = list;
      // this.query();
    } catch(err) {

    }
  },
  methods: {
    /**
     * 查询
     */
    query() {
      const pageing = {
        curPage: 1,
        totalCount: 0,
        perTableCount: {}
      }
      this.$refs.table.setPageing(pageing);
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const type = this.searchList.Type.model;
      const dptIds = this.searchList.DptIds.id || '';
      const search = this.searchList.Search.model;
      const vehExpired = getFormatTime('Y-M-D');
      const pageing = this.$refs.table.getPageing();
      const data = {
        search,
        dptIds,
        vehExpired,
        type: type ? type.join() : '',
        maxResultCount: pageing.limit,
        skipCount: (pageing.curPage - 1) * pageing.limit,
        totalCount: pageing.totalCount
      }
      getAllVehicle(data).then(res => {
        if (res.result) {
          const list = res.result.items;
          for (const v of list.values()) {
            v.vColor = +v.vehColor ? this.$t('otherText.blue') : this.$t('otherText.yellow');
            v.vIsfees = v.vehIsfees ? this.$t('otherText.cobrar') : this.$t('otherText.noCobrar');
            v.vehExpired = getDateStr(v.vehExpired, true) || '--';
            v.creationTime = getDateStr(v.creationTime, true) || '--';
            v.lastLocationTime = getDateStr(v.lastLocationTime) || '--';
          }
          this.tableData = list;
          const totalCount = res.result.totalCount;
          const pageing = {
            totalCount,
            isShow: false 
          }
          this.$refs.table.setPageing(pageing)
        }
      })
      .catch(err => {

      });
    },
    /**
     * 获取部门树数据
     */
    getDepartmentAll() {
      return new Promise((resolve, reject) => {
        getDepartmentAll({ id: '' }, { dom: null }).then(res => {
          if (res.result) {
            const tree = res.result.items;
            resolve(tree);
          } else {
            reject();
          }
        })
        .catch(err => {
          reject(err);
        });
      })
    },
    /**
     * 获取设备信息
     */
    getAllFull() {
      return new Promise((resolve, reject) => {
        getAllFull().then(res => {
          if (res.result) {
            const list = res.result.items;
            resolve(list);
          } else {
            reject();
          }
        })
        .catch(err => {
          reject();          
        });
      });
    },
    /**
     * 点击导出
     */
    exportFile() {
      const num = this.tableData.length;
      if (num) {
        exportFile(num, this.$t('carExpire.curTitle'));
      } else {
        Message.error(this.$t('otherText.msgExport'));
      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res) {
      var arr = [];
      var arr2 = [];
      for (const v of res.values()) {
        arr.push(v.id);
        arr2.push(v.dptName);
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList.DptIds.id = arr.join();
      this.searchList.DptIds.model = arr2.join();
    },
    /**
     * 搜索栏远程搜索
     */
    remoteMethod() {
      const key = this.searchList.Search.model;
      if (!key || key.length < 2) {
        return;
      }
      const data = {
        key,
        take: 20,
        dom: '#remote'
      }
      getSearch(data).then(res => {
        if (res.success) {
          const list = res.result;
          for (const v of list.values()) {
            const val = `${v.vehPlateNo}/${v.vehTerminalNo}`;
            v.val = val;
          }
          this.searchList.Search.list = list;
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
