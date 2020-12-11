<!-- 车辆管理主页 -->
<template>
  <div class="content">
    <div class="top clearFloat">
      <button-power :operButton="operButton"
                    @handleAdd="handleAdd"
                    @handleDelete="handleDelete"
                    @handleEdit="handleEdit"
                    @handleUpload="clickUpload" />
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
      <el-button v-if="!operButton.search && operButton.export"
                 @click="exportFile"
                 type="primary"
                 class="btn margin-bottom"
                 size="small"
                 icon="el-icon-download">
        {{ $t('button.exportFile') }}
      </el-button>
    </div>
    <!-- 添加删除的表单 -->
    <my-form :isShow.sync="isShow"
             :title="title"
             ref="myForm"
             @request="requestList" />
    <!-- 表格 -->
    <my-table ref="table"
              isCheck
              :tableData="tableData"
              :tableTitle="tableTitle"
              :tableMoreConList="tableMoreConList"
              @request="requestList"
              @selectAll="selectAll"
              @handleCell="handleCell" />
    <!-- 导入弹窗 -->
    <popup ref="popup" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton } from '@/utils/data'
import { getCopyObj, getDecimalN, getDateStr, getParse, getTrim } from '@/utils/util'
import { transportType, vehicleType } from '@/utils/vehData'
import { getDepartmentAll } from '@/api/sysetsmM/dpt'
import ButtonPower from './components/ButtonPower'
import SearchBar from './components/SearchBar'
import MyForm from './components/Form'
import { Message, Button, MessageBox } from 'element-ui'

import {
  getAllFull,
  getAllVehicle,
  getDriverAllNew,
  delVehicle,
  exportVehicle
} from '@/api/sysetsmM/car'

import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import Popup from './components/popup'
// import Channel from './components/channel'
// import MyAddress from './components/address'

export default {
  name: 'carManage',
  components: {
    TabBar,
    MyTable,
    Popup,
    // Channel,
    // MyAddress,
    ButtonPower,
    SearchBar,
    MyForm,
    ElButton: Button
  },
  data () {
    return {
      ...this.getData(),
      tableData: [],
      curNode: {},
      tree: [],
      treeCurNode: {},
      operButton: {},
      selectList: [], // 导入文件设备类型选择的数组
      openKeys: [], // 导入文件选择部门默认展开的树节点
      isRoot: false, // 是否是root账号
      isVideoDev: false, // 是否是视频设备
      addressKey: '',
      title: '',
      isShow: false
    }
  },
  computed: {
    ...mapGetters(['menuTree', 'userInfo'])
  },
  async created () {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)
    this.getAllFull()
    this.requestDriver()
    this.getDepartmentAll()
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
		 * 获取参数
		 */
    getData () {
      const tableTitle = this.$t('carManage.tableTitle')
      const tableMoreConList = this.$t('carManage.tableMoreConList')
      const searchList = getCopyObj(this.$t('carManage.searchList'))
      return {
        tableTitle,
        tableMoreConList,
        searchList
      }
    },
		/**
		 * 获取设备
		 */
    async getAllFull () {
      const { $refs } = this
      try {
        const res = await getAllFull()
        const list = res.result.items
        $refs.myForm.setDevType(list)
        $refs.searchBar.setDevType(list)
        $refs.popup.setDevType(list)
      } catch (err) {

      }
    },
		/**
		 * 请求部门数据
		 */
    async getDepartmentAll () {
      const { userInfo, $refs, searchList } = this
      try {
        const res = await getDepartmentAll({ id: userInfo.id })
        if (res.result) {
          const tree = res.result.items
          $refs.myForm.setDptNameTree(tree)
          searchList.dptIds.tree = tree
          $refs.searchBar.setDptNameTree(tree)
          $refs.popup.setDptNameTree(tree)
        }
      } catch (err) { }
    },
		/**
		 * 请求表格的数据
		 */
    async requestList () {
      const { $refs } = this
      let obj = {}
      if ($refs.searchBar) {
        obj = $refs.searchBar.getSearchData()
      }
      const pageing = $refs.table.getPageing()
      const skipCount = (pageing.curPage - 1) * pageing.limit
      const data = {
        ...obj,
        sorting: '',
        skipCount,
        maxResultCount: pageing.limit
      }
      try {
        const res = await getAllVehicle(data)
        const list = res.result.items
        for (const v of list.values()) {
          for (const e of Object.values(v)) {
            if (e && typeof e === 'object') {
              for (const [k, item] of Object.entries(e)) {
                if (!v.hasOwnProperty(k)) v[k] = item
              }
            }
          }

          v.color = v.vehColor == '1' ? this.$t('otherText.blue') : this.$t('otherText.yellow')
          v.isfees = v.vehIsfees ? this.$t('otherText.cobrar') : this.$t('otherText.noCobrar')
          v.vehExpired = getDateStr(v.vehExpired, true) || ''
          v.creatTime = getDateStr(v.creationTime, true) || ''
          v.lastLocationTime = getDateStr(v.lastLocationTime) || '--'
          v.firstGuaranteeDate = getDateStr(v.firstGuaranteeDate) || ''
          v.maintenanceDate = getDateStr(v.maintenanceDate) || ''
          v.registrationDate = getDateStr(v.registrationDate) || ''
          v.reminderDate = getDateStr(v.reminderDate) || ''
          v.check = false
          v.maintenanceMemo = v.gpsMaintenanceDto.remark
          v.renewalMemo = v.gpsInsuranceDto.remark
          v.RiskMemo = v.gpsRiskManagementDto.remark
          delete v.remark
        }
        this.tableData = list
        const totalCount = res.result.totalCount
        const pageing = {
          totalCount,
          isShow: false
        }
        $refs.table.setPageing(pageing)
      } catch (err) {

      }
    },
		/**
		 * 请求司机的数据
		 */
    async requestDriver () {
      const { $refs } = this
      try {
        const res = await getDriverAllNew({ isAll: true })
        const list = res.result.items
        $refs.myForm.setDriverList(list)
      } catch (err) {

      }
    },
    handleEdit () {
      const { $refs, tableData } = this
      const num = tableData.reduce((total, v) => {
        if (v.check) {
          this.curNode = getCopyObj(v)
          total += 1
        }
        return total
      }, 0)
      // 只能选择一条数据修改
      if (num !== 1) {
        Message.error(this.$t('error.noData'))
        return
      }
      this.title = this.$t('carManage.reviseTitle')
      this.isShow = true
      $refs.myForm.initEdit(this.curNode)
    },
		/**
		 * 根据条件查询
		 */
    query (data) {
      const pageing = {
        curPage: 1,
        totalCount: 0
      }
      this.$refs.table.setPageing(pageing)
      this.requestList()
    },
		/**
		 * 全部勾选
		 */
    selectAll (check) {
      for (const v of this.tableData.values()) {
        v.check = check
      }
    },
    handleAdd () {
      const { $refs } = this
      this.title = this.$t('carManage.addTitle')
      this.isShow = true
      $refs.myForm.handleAdd()
    },
    async handleDelete () {
      const ids = this.tableData.reduce((initArr, v) => {
        if (v.check) {
          initArr.push(v.id)
        }
        return initArr
      }, [])
      if (!ids.length) {
        Message.error(this.$t('error.noData'))
        return
      }

      try {
        await MessageBox.confirm(this.$t('message.delete'), this.$t('message.title'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
        const res = await delVehicle(ids.join())
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
    // 点击导出
    exportFile () {
      const { $refs } = this
      let obj = {}
      if ($refs.searchBar) {
        obj = $refs.searchBar.getSearchData()
      }

      const { search, dptIds, type, vehExpired } = obj
      const str = search || dptIds || type || ''
      exportVehicle({ vehExpired, search: str })
        .then((res) => {
          if (res.success) {
            location.href = process.env.VUE_APP_BASEURL + res.result.fileName
          }
        })
        .catch((err) => { })
    },
		/**
		 * 点击导入按钮
		 */
    clickUpload () {
      this.$refs.popup.setState(true)
    },
		/**
		 * 点击sim卡号跳转多卡查询
		 */
    handleCell (row, prop) {
      this.$router.push({
        path: '/home/dataSearch/simAll',
        query: {
          code: 'dataQuery',
          sim: row.vehSimno
        }
      })
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
    ::v-deep .button-bar {
      float: left;
    }
    ::v-deep .btn {
      float: left;
      display: block;
    }
    ::v-deep .search-bar {
      display: inline;
    }
  }
}
</style>
