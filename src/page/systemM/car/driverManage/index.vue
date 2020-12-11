<!-- 司机管理主页 -->
<template>
  <div class="content">
    <div class="top">
      <button-power :operButton="operButton"
                    @handleAdd="handleAdd"
                    @handleDelete="handleDelete"
                    @handleEdit="handleEdit"></button-power>

      <el-button v-if="!operButton.search && operButton.export"
                 @click="exportFile"
                 type="primary"
                 class="btn margin-bottom"
                 size="small"
                 icon="el-icon-download">{{ $t('button.exportFile') }}</el-button>
      <search-bar v-if="operButton.search"
                  ref="searchBar"
                  @handleSearch="query"
                  @initPageing="initPageing">
        <el-button v-if="operButton.export"
                   @click="exportFile"
                   type="primary"
                   class="btn margin-bottom"
                   size="small"
                   icon="el-icon-download">
          {{ $t('button.exportFile') }}
        </el-button>
      </search-bar>
    </div>
    <!-- 添加删除的表单 -->
    <my-form :isShow.sync="isShow"
             :title="title"
             @request="requestList"
             ref="myForm" />
    <!-- 表格 -->
    <my-table ref="table"
              isCheck
              :tableData="tableData"
              :tableTitle="tableTitle"
              @request="requestList"
              @selectAll="selectAll"
              @handleCell="handleCell" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import exportFile from '@/utils/exportFile'
import { getCopyObj } from '@/utils/util'
import { rule } from '@/utils'
import { getDriverAllNew, delDriver } from '@/api/sysetsmM/car'
import ButtonPower from './components/ButtonPower'
import SearchBar from './components/SearchBar'
import MyForm from './components/Form'
import MyTable from '@/components/myTable'
import { Message, MessageBox } from 'element-ui'


export default {
  name: 'driverManage',
  components: {
    MyForm,
    MyTable,
    ButtonPower,
    SearchBar
  },
  data () {
    const tableTitle = this.$t('driverManage.tableTitle')
    const listLi = getCopyObj(this.$t('driverManage.listLi'))
    const msgRules = this.$t('driverManage.rules')
    const rules = {
      drvName: rule('isEmpty', msgRules.drvName)
      // drvIdCards: rule('isIdCard', msgRules.drvIdCards)
    }
    return {
      tableTitle,
      listLi,
      rules,
      tableData: [],
      curNode: {},
      operButton: {},
      isShow: false,
      title: ''
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  created () {
    const { $route, $store, menuTree } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
  },
  mounted () {
    this.requestList()
  },
  methods: {
    /**
     * 初始化分页
     */
    initPageing () {
      const { $refs } = this
      const pageing = {
        isShow: true,
        totalCount: 0,
        curPage: 1
      }
      $refs.table.setPageing(pageing)
    },
    /**
     * 点击查询按钮
     */
    query () {
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestList()
    },
    /**
     * 请求表格数据
     */
    requestList () {
      const { $refs } = this
      let obj = {}
      if ($refs.searchBar) {
        obj = $refs.searchBar.getSearchData()
      }
      const pageing = $refs.table.getPageing()
      const skipCount = (pageing.curPage - 1) * pageing.limit
      const data = {
        ...obj,
        skipCount,
        maxResultCount: pageing.limit
      }
      getDriverAllNew(data).then(res => {
        if (res.success) {
          const arr = res.result.items
          for (const v of arr.values()) {
            v.check = false;
            v.gender = v.drvGender ? this.$t('otherText.man') : this.$t('otherText.woman');
          }
          this.tableData = arr;
          const totalCount = res.result.totalCount;
          const pageing = {
            totalCount,
            isShow: false
          }
          this.$refs.table.setPageing(pageing);
        }
      })
        .catch(err => {

        });
    },
    /**
     * 点击添加
     */
    handleAdd () {
      this.isShow = true
      this.title = this.$t('driverManage.addTitle')
    },
    /**
     * 修改点击
     */
    handleEdit () {
      const { $refs, tableData } = this
      const num = tableData.reduce((total, v) => {
        if (v.check) {
          this.curNode = v
          total += 1
        }
        return total
      }, 0)
      if (num !== 1) {
        Message.error(this.$t('error.noData'))
        return
      }
      this.title = this.$t('driverManage.reviseTitle')
      this.isShow = true
      $refs.myForm.initEdit(this.curNode)
    },
    /**
     * 全部勾选或全部取消
     * @param {Boolean} check true勾选，反之取消
     */
    selectAll (check) {
      for (const v of this.tableData.values()) {
        v.check = check;
      }
    },
    /**
     * 删除点击
     */
    async handleDelete () {
      const ids = this.tableData.reduce((initArr, v) => {
        if (v.check) {
          initArr.push(v.id);
        }
        return initArr;
      }, []);

      if (!ids.length) {
        Message.error(this.$t('error.noData'));
        return;
      }

      try {
        await MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
        const res = await delDriver(ids.join())
        if (res.success) {
          Message({
            type: 'success',
            message: this.$t('success.delete')
          })
          this.requestList()
        }
      } catch (err) {

      }
    },
    /**
     * 导出
     */
    exportFile () {
      const { tableData } = this
      const length = tableData.length
      if (length === 0) {
        Mssage.error(this.$t('otherText.msgExport'))
        return
      }
      const title = this.$t('driverManage.curTitle')
      exportFile(length, title)
    },
    /**
     * 点击表格单元格
     */
    handleCell (row, key) {
      if (key !== 'vehPlateNo') return
      const { vehPlateNo } = row
      const { $route: { query }, $router } = this
      const obj = {
        path: '/home/systemM/carManage',
        query: {
          ...query,
          vehPlateNo
        }
      }
      $router.push(obj)
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  flex: 1;
  padding: 22px 0 0 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  position: relative;
  .top {
    overflow: hidden;
    ::v-deep .button-bar {
      float: left;
    }
    ::v-deep .btn {
      float: left;
    }
  }
}
</style>
