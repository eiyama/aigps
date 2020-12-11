<template>
  <div class="right-box">
    <h6 class="title">{{ $t('divisionManage.rightTitle.title') }}</h6>
    <div class="right-content">
      <div class="type-bar">
        <el-checkbox class="left" @change="checkChangeAll" v-model="checkAll">{{ $t('otherText.selectAll') }}</el-checkbox>
        <div class="left">{{ $t('otherText.yesSelect') }}{{ checkNum }}</div>
        <div class="search-bar">
          <el-input @keyup.enter.native="upEnter" @input.native="changeInput" v-model="searchVal"
            :placeholder="$t('placeholder.dptIsCar')" class="search-input" size="small">
            <i slot="suffix" @click="upEnter" class="el-input__icon search el-icon-search"></i>
          </el-input>
        </div>
      </div>
      <el-scrollbar class="scroll-y" style="flex:1;padding: 10px 0 0;">
        <div v-for="(item,index) in carList" :key="index" style="padding: 4px 20px;">
          <el-checkbox @change="checkChange(index)" v-model="item.checked">{{ `${item.vehPlateNo}（${item.dptName}）` }}</el-checkbox>
        </div>
      </el-scrollbar>
      <div class="block">
        <el-pagination class="pagination" :disabled="paging.disabled" :page-size="paging.pageSize" @current-change="changeCurPage" layout="prev, pager, next" :total="paging.total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getOperButton, parentId, testTreeName, notIsChild } from '@/utils/data'
import { getUnassigned, delGpsAllotVehicle } from '@/api/sysetsmM/dpt'
import { Checkbox, Message, Scrollbar, Pagination } from 'element-ui'

export default {
  components: {
    ElCheckbox: Checkbox,
    ElScrollbar: Scrollbar,
    ElPagination: Pagination
  },
  data() {
    const paging = {
      curPage: 1,
      pageSize: 20,
      total: 0,
      disabled: false
    }
    return {
      checkAll: false,
      searchVal: '',
      carList: [],
      checkNum: 0,
      dptNode: {},
      oldVal: '',
      paging
    }
  },
  props: {
    evBus: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.evBus.$on('handleNode', this.handleNode);
    this.evBus.$on('handleNodeCenter', this.handleNode);
    this.evBus.$on('handleMoveRight', this.handleMoveRight);
  },
  beforeDestroy() {
    this.evBus.$off('handleNode', this.handleNode);
    this.evBus.$off('handleNodeCenter', this.handleNode);
    this.evBus.$off('handleMoveRight', this.handleMoveRight);
  },
  methods: {
    /**
     * 点击节点更新数据
     */
    handleNode(res) {
      this.dptNode = res;
      this.requestList(res.id);
    },
    /**
     * 全选
     */
    checkChangeAll(state) {
      this.checkAll = state;
      if (state) {
        // 全选等于数据长度1且全部去为正
        this.checkNum = this.carList.length;
        for (var i in this.carList) {
          this.carList[i].checked = true;
        }
      } else {
        // 不全选等于0且全部为反
        this.checkNum = 0;
        for (var i in this.carList) {
          this.carList[i].checked = false;
        }
      }
    },
    /**
     * 列表的复选框勾选
     */
    checkChange(index) {
      // 用了判断是否全选
      var boole = true;
      this.checkNum = 0;
      for (var i in this.carList) {
        if (this.carList[i].checked) {
          this.checkNum++;
        } else {
          boole = false;
        }
      }
      if (boole) {
        // 全选
        this.checkAll = true;
      } else {
        // 不全选
        this.checkAll = false;
      }
    },
    /**
     * 输入框的input事件
     */
    changeInput() {
      const val = this.searchVal;
      const oldVal = this.oldVal;
      if (oldVal.length >= 2 && val !== oldVal) {
        this.$set(this.paging, 'disabled', true);
      } else if (oldVal.length < 2 && val.length >= 2) {
        this.$set(this.paging, 'disabled', true);
      } else {
        this.$set(this.paging, 'disabled', false);
      }
    },
    /**
     * 输入框回车或点击搜索图标查询
     */
    upEnter() {
      this.$set(this.paging, 'total', 0);
      this.changeCurPage(1);
    },
    /**
     * 点击分页按钮
     * @param {Number} curPage 当前页码
     */
    changeCurPage(curPage) {
      this.$set(this.paging, 'curPage', curPage);
      const dptId = this.dptNode.id;
      this.requestList(dptId);
    },
    /**
     * 请求列表数据
     * @param {String} id 部门ID
     */
    requestList(id) {
      const key = this.searchVal.length < 2 ? '' : this.searchVal;
      const take = this.paging.pageSize;
      const skip = (this.paging.curPage - 1) * take;
      const data = {
        id,
        take,
        skip,
        key
      }
      getUnassigned(data).then(res => {
        if (res.success && res.result) {
          this.oldVal = key;
          this.$set(this.paging, 'total', res.result.count);
          this.$set(this.paging, 'disabled', false);
          this.checkAll = false;
          this.checkNum = 0;
          this.carList = res.result.item;
          this.checkChangeAll(false);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 获取勾选的数据
     */
    getCheckList() {
      return this.carList.reduce((oArr, v, i, arr) => {
        if (v.checked) {
          oArr.push({
            vehicleID: v.id,
            vehicleName: v.vehPlateNo
          });
        }
        return oArr;
      }, [])
    },
    /**
     * 点击向右撤销数据
     * @param {Array} ids id的集合
     */
    handleMoveRight(ids) {
      delGpsAllotVehicle(ids.join()).then(res => {
        if (res.success) {
          Message({
            type: 'success',
            message: this.$t('success.delete')
          });
          this.evBus.$emit('removeNode', ids);
          this.requestList(this.dptNode.id);
        }
      })
      .catch(err => {

      })
    }
  }
}
</script>

<style scoped>
.title {
  height: 30px;
  padding: 10px 0 0;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
}
.right-box {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}
.right-box {
  margin: 0 0 0 20px;
}
.right-box .right-content {
  flex: 1;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 1px;
  overflow: hidden;
}
.type-bar {
  overflow: hidden;
  height: 40px;
  border-bottom: 1px solid #ddd;
}
.type-bar span {
  display: block;
  float: left;
  width: 32px;
  height: 32px;
  font-size: 20px;
  color: #00a8d4;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  margin: 4px 0 0 !important;
  box-sizing: border-box;
  border: 1px solid #fff;
}
.type-bar span:hover {
  border: 1px solid #dedede;
  border-radius: 2px;
}
.type-bar .search-bar {
  float: right;
  position: relative;
  top: 4px;
  right: 5px;
}
.type-bar .search-bar .search-input {
  width: 160px;
}
.type-bar .search-bar .search {
  cursor: pointer;
  font-size: 16px;
}
.type-bar .left {
  float: left;
  margin: 11px 0 0 10px;
  line-height: 19px;
  font-size: 14px;
  color: #00a8d4;
}
.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}
</style>